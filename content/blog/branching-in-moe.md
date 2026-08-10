---
title: "MoE routing is just branch prediction"
description: "predict before you know"
date: 2026-08-10
category: tech
hero_image: /images/baby.jpeg
hero_image_source: "google images"
---

if you've spent time in both systems programming and ML infrastructure, you get this weird deja vu reading about transformer inference.

the words are new. **KV cache**, **expert routing**, **paged attention**. but the shape of the problems isn't.

CPU architects ran into this exact wall thirty years ago: **you have to act before you know what you need.**

this post is about two places in a transformer's inference path where that problem shows up almost unchanged. why "just add a branch predictor" turns out to be a more literal suggestion than it sounds. and what happened when i trained a tiny MoE model and tested whether its routing is predictable at all.

## the old problem

basically, a CPU pipeline wants [needs :)] to stay full: **fetch, decode, execute, retire** - every stage busy every cycle.

the thing that empties it is a **branch**. an `if` statement whose outcome isn't known until it's evaluated, which happens several stages after you needed to already be fetching the next instruction.

nobody solved this by waiting. they solved it by **guessing well.**

branch predictors track local history, global history, two-level adaptive patterns. basically a running statistical model of what your program tends to do. they speculatively execute down the predicted path before the branch resolves.

you guess right, and the latency disappears entirely which was awesome to start with... and we ended up with modern predictors making progress north of **95%** of the time on ordinary code. but if you guess wrong, the whole pipeline gets flushed, and we get the penalty.

so we have a set of instructions that we must compulsarily follow now which are: **predict, act on the prediction, verify, pay a cost only when you're wrong.**

now we hold onto that pattern. because it shows up twice more below, wearing different clothes!!

## KV cache management is branch prediction wearing a memory-bandwidth costume

the KV cache stores key/value projections for every token already processed. generating token N+1 doesn't mean recomputing attention over 1 through N-1 from scratch.

people describe this as a memory problem. how much fits, how fast can you read it. and at the lowest level it is. but the actually hard decisions around it are **prediction problems** wearing a memory-management disguise.

take **prefix caching**. vLLM and SGLang keep a radix tree of previously-computed KV states so a new request sharing a system prompt can skip recomputation.

but the system has no way of knowing in advance which incoming request will share a prefix with which cached one. it's betting, every single time, that this sequence resembles something it's seen before.

a chat app with a stable system prompt is the LLM-serving equivalent of a tight loop a branch predictor nails every time. a stream of unrelated one-off prompts is the equivalent of a data-dependent branch nothing can predict better than chance.

**eviction** is the same problem pointed the other direction.

when the cache fills up and something has to go - StreamingLLM's attention sinks, H2O's heavy-hitter scoring, plain sliding windows - the system is asserting that a particular token won't matter again.

that's a prediction. and getting it wrong doesn't crash anything. it just quietly makes the output a bit worse, with **no signal that anything went wrong at all.** arguably a nastier failure mode than a branch misprediction, because a misprediction is at least *visible* to the pipeline.

and **speculative decoding** barely needs the metaphor stretched. a small draft model proposes several tokens ahead, the large model verifies them in parallel. accepted tokens keep their KV entries, rejected ones roll back. **draft, verify, commit-or-flush** - that's speculative execution at the token level instead of the instruction level, with the KV cache standing in for the register file that has to support rollback.

the pattern underneath all three: KV cache work keeps getting framed as "how much memory, how fast." the hard part is **"what will we need, and what's safe to throw away."**

once you see it that way, it stops being a coincidence that branch-prediction ideas keep getting reinvented under new names in inference engines. **history models, confidence-weighted speculation, cheap rollback.**

## MoE routing is branch prediction too

Mixture-of-Experts makes this almost too easy, because the router already looks like a predictor. it's just not usually described as a speculative one.

in a dense transformer every token touches every layer's weights. in an MoE layer, a small **router** - a linear layer plus softmax and top-k - looks at a token and decides which experts, say 2 of 8, get to process it.

that decision happens once, deterministically, per token, per layer. the router doesn't guess and get corrected later. its output *is* the computation.

the resemblance to branch prediction shows up one level down, at **serving time**.

the real misprediction lives in **expert placement**, not expert choice.

in a distributed deployment, experts are sharded across devices. GPU 3 holds experts 12 through 15, GPU 7 holds 40 through 47, and so on. wherever the router sends a token, if that expert isn't co-located with where the token's activation currently sits, you eat an **all-to-all communication cost**.

that's structurally identical to a cache miss that has to fetch a line from a remote node. or a mispredicted branch that has to flush and refetch from the right address. the router "predicted" expert 44; the system pays because expert 44's weights weren't where the compute was happening.

can you **prefetch experts** the way CPUs prefetch instructions?

a branch predictor doesn't just pick a direction. it starts fetching down that path **immediately**, before the branch resolves. there's nothing stopping an MoE serving system from doing the same thing. use recent routing history as a cheap signal to start warming the likely top-k experts before the router's forward pass even finishes. discard the guess if it's wrong.

it's prefetching applied to expert weights instead of cache lines. trading some wasted bandwidth for hidden latency. exactly the trade a branch predictor makes.

even the **load-balancing loss** has a CPU analogue. left alone, MoE routers collapse onto a handful of favorite experts. a lopsided branch that always goes one way during training and then chokes throughput at serving time because a few experts become hot.

the auxiliary load-balancing loss exists to correct that. it pushes the router toward outcomes that are good for the *system* rather than just locally optimal. same spirit as profile-guided compilation pushing code layout toward outcomes that are good for the pipeline instead of just correct.

## where this stops being cute and starts being a real question

it's easy to leave it there as a nice metaphor. but it only earns its keep if it suggests something you could actually **try**, not just a vocabulary swap. two things it points at:

CPU predictors get their accuracy from combining **local** history (this branch's own recent behavior) with **global** history (what nearby branches have been doing). two-level adaptive schemes.

most MoE routing work treats each token's routing decision independently per layer. a router that also conditions on recent routing history - this sequence, this position, this layer - is a **two-level predictor** nobody's really built as one.

and CPUs don't speculate uniformly. some designs throttle how aggressively they speculate based on how confident the prediction is. an MoE system could do the same: only prefetch when the router's top-1 and top-2 scores are close enough that a wrong guess is cheap. skip prefetching entirely when the distribution is already lopsided.

neither of these is really about KV caches or MoE specifically. they're about what happens once a system is too slow to just wait for certainty. **"guess and recover cheaply"** becomes the only way to keep utilization up.

CPUs hit that wall decades ago and built a whole subfield around living with uncertainty cheaply: branch prediction, prefetching, speculative execution, out-of-order retirement.

transformer inference is discovering pieces of that subfield one at a time. **PagedAttention** rediscovering virtual memory. **prefix caching** rediscovering trace caches. **speculative decoding** rediscovering speculative execution. the branch predictor looked like the one piece nobody had explicitly claimed yet.

so i checked whether it actually holds up.

## i actually checked it

the claim hiding inside all of this is simple: routing decisions should be somewhat predictable from history, the way branches are.

that's testable, so i tested it.

i trained a small MoE transformer from scratch. 4 layers, 6 experts, top-2 routing, about 2 million parameters, on character-level Shakespeare. then logged its real router decisions on held-out text.

here's the core of what an MoE layer actually looks like. a router, a pool of experts, and top-k dispatch with weighted aggregation:

```python
class MoELayer(nn.Module):
    def __init__(self):
        super().__init__()
        self.router = nn.Linear(n_embd, n_expert)
        self.experts = nn.ModuleList([Expert() for _ in range(n_expert)])

    def forward(self, x):
        B, T, C = x.shape
        logits = self.router(x)                       # (B,T,n_expert)
        probs = F.softmax(logits, dim=-1)
        topk_probs, topk_idx = probs.topk(top_k, dim=-1)
        topk_probs = topk_probs / topk_probs.sum(-1, keepdim=True)

        flat_x = x.reshape(B * T, C)
        flat_idx = topk_idx.reshape(B * T, top_k)
        flat_w = topk_probs.reshape(B * T, top_k)
        out = torch.zeros_like(flat_x)

        for e in range(n_expert):
            token_rows, slot = (flat_idx == e).nonzero(as_tuple=True)
            if token_rows.numel() == 0:
                continue
            y = self.experts[e](flat_x[token_rows])
            w = flat_w[token_rows, slot].unsqueeze(-1)
            out.index_add_(0, token_rows, y * w)

        return out.reshape(B, T, C)
```

the router is just a **linear layer** projecting the hidden state to `n_expert` logits. softmax, pick top-2, renormalize the weights. scatter tokens to the chosen experts, index-add the weighted results back. that's it. no load-balancing loss, no auxiliary tricks. just the raw mechanism.

i ran three branch-predictor-style heuristics that never see the router's weights, only past routing outputs:

- **last-token**: guess this token's expert equals whatever the previous token's expert was, same layer
- **prev-layer**: guess this token's expert at layer *l* equals its own expert at layer *l−1*
- **moving-majority**: guess the most common expert over the last 8 tokens, same layer

and here's how dead simple the evaluation is. no learned models, no weights, just `torch` index tricks:

```python
for l in range(n_layer):
    actual = routes[l]   # real top-1 expert per token, captured during inference

    # 1. previous token's expert (same layer)
    pred_last = torch.cat([torch.tensor([-1]), actual[:-1]])
    valid_last = torch.arange(T) > 0

    # 2. same token, previous layer's expert
    pred_prevlayer = routes[l - 1] if l > 0 else torch.full_like(actual, -1)
    valid_prevlayer = torch.full((T,), l > 0, dtype=torch.bool)

    # 3. most frequent expert in the last 8 tokens (same layer)
    W = 8
    pred_majority = torch.full((T,), -1)
    for t in range(W, T):
        vals, counts = torch.unique(actual[t - W : t], return_counts=True)
        pred_majority[t] = vals[counts.argmax()]

    acc_last     = (pred_last[valid_last] == actual[valid_last]).float().mean()
    acc_prev     = (pred_prevlayer[valid_prevlayer] == actual[valid_prevlayer]).float().mean()
    acc_majority = (pred_majority[W:] == actual[W:]).float().mean()
```

no router weights, no learned embeddings. just raw history on routing decisions.

![Routing predictability results](/images/routing_predictability.png)

with 6 experts, random guessing lands around **16.7%**. here's what actually happened:

| Layer | Last-token | Prev-layer | Moving-majority | Random |
|---|---|---|---|---|
| 0 | 23.4% | - | 31.0% | 16.7% |
| 1 | 21.2% | 12.4% | 30.8% | 16.7% |
| 2 | 18.8% | 14.2% | 21.6% | 16.7% |
| 3 | 34.1% | 16.6% | 30.8% | 16.7% |

three things came out of this that i didn't expect going in.

history actually helps. the moving-majority heuristic roughly **doubles** the random baseline in most layers. so the analogy isn't hollow. there's real temporal structure in how a router picks experts, the same way there's real structure in branch history.

but it's a **weak signal**, not a strong one.

real branch predictors clear 95%. these heuristics cap out around **34%**. if MoE routing is a branch, it's the hard kind - data-dependent, content-driven - not the kind that loops give predictors for free. that's the honest ceiling on how far "just prefetch based on history" should be trusted.

and a hunch i had turned out wrong.

i expected the expert a token used at layer 1 to hint at something about the expert it'd use at layer 2. related experts clustering across depth. it mostly doesn't. the prev-layer predictor barely beats random anywhere.

i also expected the router's own confidence (a wide gap between its top-1 and top-2 scores) to correlate with predictability. the way a heavily-biased branch is easier to call. that held in three of four layers, and then flipped in layer 2, where the most confident tokens were the **least predictable** from history. i don't have a clean explanation for that yet.

to be clear about the size of this claim: this is a 2-million-parameter model trained for 1,500 steps on Shakespeare. not a production LLM. a frontier MoE with dozens of experts and trillions of training tokens could behave completely differently in either direction.

this isn't evidence about how GPT-scale routers behave. it's a **methodology**, and a real number instead of an assertion. for a question that's cheap to re-ask against an actual deployed model's router logs.

## so, does the analogy hold?

structurally, **yes**. MoE routing and CPU branching are the same category of problem. a decision that gates where computation goes next, made before you'd like to commit to it, where a wrong guess costs you a stall.

that part isn't a stretch. it's why serving systems kept independently reinventing prefetching and speculative rollback for MoE. they just didn't reach for the branch-prediction vocabulary to describe it.

but in terms of *how predictable* the branch actually is, **no**. not in the way CPU branches are.

the experiment suggests MoE routing sits closer to a hard, content-dependent branch than a loop-counter one. the category CPU predictors have always struggled with.

that lines up with what the real prefetching papers already do in practice: none of them lean on cheap history heuristics alone. they train a small draft model, or exploit structural correspondence between models. closer to a **learned predictor** than a lookup table, because the easy heuristics clearly aren't enough on their own.

which is a better ending than "everything is secretly a branch predictor."

the more useful version: the KV cache side genuinely behaves like a predictable branch, and **cheap tricks work**. the MoE side is a harder branch wearing the same clothes, and the fix has to be a **learned model**, not a heuristic.

the analogy's value isn't that it makes MoE routing easy. it's that it tells you in advance which of these problems will yield to a cheap trick and which ones won't.

[*code for the toy model and the analysis*](https://gist.github.com/ssenthilnathan3/53ae8acd79edec05c7781c7b1e7035ae)
