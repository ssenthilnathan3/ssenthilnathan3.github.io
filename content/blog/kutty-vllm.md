---
title: "how LLMs remember, schedule, and stream tokens"
description: "i built a small CPU inference runtime to find out"
date: 2026-08-24
category: tech
hero_image: /images/spongebob.jpeg
hero_image_source: "google images"
---

when i started this, i thought inference was basically this:

```python
while True:
    logits = model(tokens)
    token = logits[-1].argmax()
    tokens.append(token)
```

which is correct. technically.

but, this tells us nothing about what happens when two people use the model at the same time. or where the model keeps all the previous tokens. or how ChatGPT starts printing before the complete response is ready.

the transformer only predicts the next token. there is a whole system around it that remembers the past, decides whose token to generate next, and sends that token back to the right person.

i wanted to understand that part. so over the last four months, i built a small version of it on the CPU using Python and NumPy.

i called it [kutty-vllm](https://github.com/ssenthilnathan3/kutty-vllm). "kutty" means small in Tamil :)

## starting with a transformer

the first version was not an inference runtime. it was just a decoder-only transformer.

tokens went through an embedding table, attention, and a feed-forward layer. i used RMSNorm before attention, and RoPE to give each token a position. NumPy handled all the matrix multiplications.

the weights were random because i only wanted to check if the implementation was correct. natural language could come later.

and... it worked.

```python
logits = model.forward([257, 72, 105])
print(logits.shape)

# (3, 259)
```

then i wrote the obvious generation loop. every time the model generated a token, i passed the entire sequence through the model again.

```text
Once upon a time
Once upon a time + token 1
Once upon a time + token 1 + token 2
Once upon a time + token 1 + token 2 + token 3
```

the problem is that the old tokens do not change. their keys and values were already computed in the previous pass. i was throwing them away and calculating the same thing again.

this is what the KV cache fixes.

## remembering old tokens

every attention layer creates a query, key, and value for the current token. the query is only needed right now. but the key and value will be needed by every token that comes after it.

so instead of throwing them away, i stored them.

```python
cache.write(layer, position, key, value)
keys, values = cache.read(layer, position + 1)
```

now the model has two different jobs.

**prefill** processes the prompt and fills the cache.

**decode** processes one new token using everything already in the cache.

<canvas id="prefill-decode" class="nomnoml-canvas"></canvas>
<script>
drawDiagram('prefill-decode', `
[prompt] -> [prefill] -> [KV cache]
[KV cache] -> [decode] -> [next token]
[decode] -> [new K and V] -> [KV cache]
`);
</script>

i kept the original slow implementation around for testing. if cached decoding was correct, it had to produce the same logits as recomputing the whole sequence.

```python
expected = model.forward(tokens)
actual = np.stack([model.decode(token, cache) for token in tokens])

np.testing.assert_allclose(actual, expected, rtol=3e-5, atol=3e-5)
```

this test was useful because attention bugs don't always crash. usually, every shape is valid and the model happily gives you the wrong numbers.

## the cache became an allocator

my first KV cache was one large NumPy array per request.

```python
shape = (num_layers, max_seq_len, num_heads, head_dim)
self.keys = np.empty(shape, dtype=np.float32)
self.values = np.empty(shape, dtype=np.float32)
```

easy enough. but it allocates `max_seq_len` even when the request uses only a few tokens.

suppose the model supports 2,048 tokens. one user asks a short question and generates 20 tokens. that request still gets space for all 2,048.

with enough users, most of the KV memory would just be empty.

the fix looked a lot like virtual memory. i divided the cache into equal-sized blocks. a request sees its tokens as one continuous sequence, but those tokens can live in unrelated physical blocks.

```text
request A:

logical block     0     1     2
                  |     |     |
physical block    7     2     9
```

each request only needs a block table.

```python
block = block_table[position // block_size]
offset = position % block_size

pool.keys[block, layer, offset] = key
```

when the request finishes, blocks 7, 2, and 9 go back into the free list. they don't have to stay together. the next request can reuse any of them.

this is the idea behind paged KV caches. production runtimes have kernels that read the blocks directly during attention. mine gathers them into a NumPy array first, which is slower, but made the memory management visible.

this was also the point where model inference quietly turned into allocator debugging.

one version could leak blocks if a reservation failed halfway through. say a request needed three blocks and only two were free. it allocated those two, failed on the third, and never returned the first two.

i fixed it by checking the complete reservation before allocating anything.

```python
blocks_needed = logical_block + 1 - len(block_table)

if blocks_needed > pool.free_blocks:
    raise CacheExhausted(...)
```

the operation had to either allocate everything or allocate nothing.

## okay, now two users

once requests had their own caches, i could run more than one.

the naive version picked a few requests and made a batch. this works when they all start together and generate the same number of tokens. real requests obviously don't do that.

imagine these two:

```text
A: 10 prompt tokens, wants 100 output tokens
B: 400 prompt tokens, wants 5 output tokens
```

B finishes almost immediately. in a static batch, its row still occupies a slot until A finishes.

then request C arrives while A is still running. should C wait for the whole batch to end? there is an empty row sitting right there.

continuous batching means there isn't really a fixed batch. before every decode step, the scheduler looks at which requests can run **right now**.

```text
step 1: [A, B]
step 2: [A, B]
           B finishes
step 3: [A, C]
step 4: [A, C]
```

my scheduler ended up with a waiting queue and a running list.

```python
while waiting and len(running) < max_batch_size:
    request = waiting[0]

    if blocks_required(request) > cache.free_blocks:
        break

    waiting.popleft()
    running.append(request)
```

after every step, completed requests leave the running list and release their cache blocks. on the next step, another request can use both the slot and the memory.

there was a deadlock in this too :)

if a request needed more blocks than the entire cache contained, it sat at the front of the queue forever. it could never run. and because the scheduler was FIFO, nobody behind it could run either.

the engine looked busy because `waiting` was not empty. but every call to `step()` did nothing.

now `add_request()` rejects a request if its prompt and output budget cannot possibly fit.

## my "batch" was a for loop

after continuous batching worked, i looked at the model call and noticed this:

```python
for request in running:
    request.next_logits = model.decode(token, request.cache)
```

i had built a batched scheduler that executed every request one by one.

not exactly batching.

the large operations in a transformer are matrix multiplications. instead of multiplying one hidden vector at a time, i could stack all active requests and multiply them together.

attention was the annoying part. every request had a different context length. each one also had a different block table.

so the dense projections run as a batch, while attention reads each request's cache separately.

```python
qkv = normalized_batch @ layer.qkv

for row, cache in enumerate(caches):
    keys, values = cache.read(layer, positions[row] + 1)
    attention_rows.append(attend(q[row], keys, values))

x = residual + np.stack(attention_rows) @ layer.out
```

there is still a Python loop in attention. it is not going to compete with a fused C++ or CUDA kernel. but QKV, output projection, MLP, and vocabulary projection now operate on the actual batch.

more importantly, the scheduler calls the model once per step instead of once per request.

## streaming fell out of the scheduler

i expected token streaming to need a separate design. it didn't.

one engine step already generates one token for every running request. i just had to return those tokens instead of hiding them inside the engine.

```python
@dataclass
class TokenOutput:
    request_id: str
    token_id: int
    text: str
    finished: bool
```

`stream()` repeatedly advances the shared engine and yields events belonging to one request.

```python
def stream(self, request_id):
    while not request.finished:
        for output in self.step():
            if output.request_id == request_id:
                yield output
```

the important bit is that `self.step()` advances everyone. streaming request A does not create a private generation loop for A. requests B and C continue moving through the same batches.

cancellation fits into the same setup. if the request is waiting, remove it from the queue. if it is running, remove it from the batch and release its blocks.

## everything worked, and the output was nonsense

at this point the cache worked. batching worked. streaming worked. the demo printed this:

```text
\x14\xf8\x1c-A7\xaf"\xe8\xd0\x0dm\x16>R^f
```

well... the model still had random weights.

i was also using a byte tokenizer, so random token IDs became random bytes. some were control characters. one was a carriage return, which moved the cursor to the beginning of the terminal and overwrote the prompt. for a while i thought streaming was broken.

escaping the bytes made the bug understandable, but it didn't make the model useful.

to generate language, i needed pretrained weights and the exact architecture those weights expected.

i used TinyStories-1M. it is a small GPT-Neo model trained on short stories. it has eight layers and a hidden size of 64, which is small enough to run through this NumPy runtime without waiting forever.

GPT-Neo is different from the model i started with. it uses learned position embeddings instead of RoPE. it uses LayerNorm instead of RMSNorm. the MLP uses GELU. its attention alternates between global and local windows.

so i added another model implementation and mapped the checkpoint weights into NumPy arrays. PyTorch is only used to read the checkpoint file. it does not run inference.

```python
model = GPTNeoModel.from_pretrained()
tokenizer = GPT2Tokenizer.from_pretrained()

engine = Engine(model, tokenizer=tokenizer)
```

and finally:

```text
The rabbit was a little girl named Timmy and a little girl named Emma.

One day, Lily and Lily was feeling very happy
```

not a great story. but definitely better than `\xf8`.

## the whole thing

the runtime now looks like this:

<canvas id="runtime" class="nomnoml-canvas"></canvas>
<script>
drawDiagram('runtime', `
[prompt] -> [tokenizer] -> [waiting queue]
[waiting queue] -> [scheduler] -> [prefill]
[prefill] -> [paged KV cache]
[paged KV cache] -> [batched decode]
[batched decode] -> [sample token] -> [stream]
[sample token] -> [paged KV cache]
`);
</script>

there are many things it does badly.

prefill still processes the prompt one token at a time. the paged cache gathers blocks instead of reading them directly inside attention. cache admission reserves the request's maximum output length, which is safe but wastes capacity. there is no prefix caching. and NumPy has the final say on CPU performance.

but those are now problems i can point to in code instead of words i have read in an inference blog.

the main thing i took away is that generating a token and **serving** a token are different problems.

the transformer generates it.

the KV cache remembers everything that came before it. the scheduler decides when it gets generated. the streaming layer makes sure it reaches the right user.

`model.forward()` was the easy part.
