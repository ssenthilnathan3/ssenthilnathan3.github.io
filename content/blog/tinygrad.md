---
title: "everything is a UOp"
description: "following a matrix multiply through tinygrad"
date: 2026-08-06
hero_image: /images/tinygrad.jpeg
category: tech
---

i've used PyTorch for years. `a @ b`, `.backward()`, `.cuda()`. works every time. i never thought about what's underneath.

then i came across tinygrad. it's the deep learning stack behind [comma.ai](https://comma.ai/)'s openpilot, the open-source self-driving system. 17K lines of Python. PyTorch is 3 million lines of C++. this thing fits the whole pipeline, including the compiler, in less code than some test suites.

i figured i'd spend an afternoon reading it.

to give an outline of how tinygrad works, we would explore these 4 stages:

<canvas id="pipeline-overview" class="nomnoml-canvas"></canvas>
<script>
drawDiagram('pipeline-overview', `
[a.matmul(b)] -> [UOp graph]
[UOp graph] -> [realize]
[realize] -> [rangeify]
[rangeify] -> [scheduler]
[scheduler] -> [codegen]
[codegen] -> [runtime]
`);

</script>

## the first thing i noticed
to start with, we need to know how a tensor operation works. the fundamental tensor operation used in DL libraries is **matrix multiplication**. so, i opened a terminal and typed this out.

```python
from tinygrad import Tensor

a = Tensor.rand(4, 4)
b = Tensor.rand(4, 4)
c = a.matmul(b)

print(c.shape)   # (4, 4)
```

this creates two tensors of shape *4 x 4* with random values and multiplies it, store its result in *c*. the shape came back as `(4, 4)`. looks fine!!

but... no multiplication had actually happened. `a.matmul(b)` didn't crunch any numbers. it just built a tree of lazy operations and returned. the real work only runs when you call `c.realize()`.
this was new to me because, PyTorch does `a @ b` and immediately launches the matmul. but, tinygrad waits.

this is called **lazy evaluation**. you describe what you want to do, and the framework postpones the actual computation until you explicitly ask for the answer. function calls build a graph. the graph just sits there waiting for the computation caller to call, which is what `.realize()` is, and the moment where everything actually runs.

so, i was curious what the graph looked like.

```
REDUCE(sum, axis=-1)
  PERMUTE
    MUL
      RESHAPE(4,1,4)
        a.uop
      PERMUTE
        RESHAPE(1,4,4)
          b.uop
```

i stared at it for a minute. the tree reads bottom-up :)

take `a`, view it as a 4-by-1-by-4. take `b`, view it as 1-by-4-by-4, then transpose the last two axes. multiply them elementwise with broadcasting, which gives you a 4-by-4-by-4. then sum along the last axis. that's a 4-by-4 matrix multiplication.

<canvas id="matmul-flow" class="nomnoml-canvas"></canvas>
<script>
drawDiagram('matmul-flow', `
[a] -> [reshape a|4 x 1 x 4]
[b] -> [reshape b|1 x 4 x 4] -> [transpose]
[reshape a] -> [multiply]
[transpose] -> [multiply]
[multiply] -> [sum|axis=-1] -> [result|4 x 4]
`);
</script>

`a @ b` got turned into `(a.reshape(4,1,4) * b.reshape(1,4,4).transpose()).sum(-1)`.

the matmul isn't built into the framework as a primitive. it's syntactic sugar. a convenient way to write reshape, broadcast multiply, and sum. `relu` is sugar for `max(x, 0)`. `sigmoid` is sugar for `1 / (1 + exp(-x))`. the framework has maybe six actual operations. everything else is convenience that decomposes before the scheduler ever sees it.

so if everything is shorthand, and shorthand doesn't trigger any computation... the framework can see your whole program at once before deciding what to run.

## what's inside a tensor

next i opened `tensor.py`. i was expecting a struct with strides and a device pointer and maybe a reference count. something that looked like it owned data.

```python
__slots__ = "uop", "is_param", "grad"
```

that's it. a reference to a graph node. a flag for the optimizer. a slot for the gradient after `.backward()`.

shape lives on the graph node. `self.uop.shape`. dtype, device, everything. the tensor object doesn't carry any of that itself.

the graph node is called a **UOp**. it's the central thing in the whole codebase. tensors are UOps. kernels are UOps. compiled binaries are UOps. a UOp has exactly four fields.

`op` says what kind of node. `dtype` is float32 or int64 or whatever. `src` is a tuple of child nodes feeding into this one. `arg` is extra data the operation needs, like the target shape for a reshape.

when i realised everything is a UOp i went looking for where the actual operations are defined. `add`, `mul`, `matmul`. and found something that didn't make sense at first.

```python
>>> Tensor.add is UOp.add
True
```

the wrapper and the thing it wraps share the same method. not the same name. the same python function object.

it works like this. both `Tensor` and `UOp` inherit from shared helper classes called **mixins**. the operations are written once in files like `mixin/elementwise.py`. both classes pick them up through inheritance.

the mixin methods call a few abstract hooks at the bottom, and each class fills in the hooks differently. `Tensor`'s version wraps results back into a new `Tensor`. `UOp`'s version creates a new graph node. the code in the middle is identical.

what this means in practice is you can write at the `Tensor` level for normal stuff, or drop into raw `UOp` graphs when you need control over the kernel. same methods either way.

## the graph doesn't repeat itself

UOp nodes get cached. every combination of `(op, dtype, children, arg)` is stored once in a dictionary. if you build the same expression twice, you get back the same object.

```python
>>> Tensor(3) + 4
>>> Tensor(3) + 4
# identical UOp object, served from cache
```

this is called, **hash-consing**. it means graph rewriting is just **pointer replacement**. keep all the shared structure, swap out the one subtree that changed, that's it.

a pattern matcher is a rewrite rule. "if you see this arrangement of nodes, replace it with this other arrangement." the code has comments like `pm_move_where_on_load`. the `pm` stands for pattern matcher. it moves WHERE nodes below LOAD nodes. the whole compilation pipeline is these chained together.

here's a real one from the codebase, `pm_cast_float_alu` in `codegen/__init__.py`:

```python
pm_cast_float_alu = PatternMatcher([
  (UPat((Ops.SIN, Ops.LOG2, Ops.EXP2, Ops.SQRT, Ops.RECIPROCAL),
        src=(UPat(name="x"),), name="u"),
   lambda u, x: u.replace(src=(x.cast(u.dtype),))
                if x.dtype != u.dtype else None),
])
```

it says: find any node whose operation is `SIN`, `LOG2`, `EXP2`, `SQRT`, or `RECIPROCAL`. grab its single input `x`. if `x` is a different dtype than the result, insert a cast node between them. returning `None` means "no match, leave it alone." returning a new UOp replaces the old one.

that's the template. a `UPat` describes the subtree to find. a lambda takes the matched pieces and returns either a replacement or `None`. the `PatternMatcher` class stores these pairs in a dictionary keyed by the root operation, so it only checks patterns against nodes whose op matches. no scanning irrelevant nodes.

the power of this comes from chaining. `graph_rewrite` walks the UOp tree and applies every matching rule. when a rule fires, the tree changes, and the walker rechecks the new node against the rules. this repeats until nothing matches or a depth limit is hit. one pass can trigger cascading rewrites.

a few more examples from the pipeline so you can see the pattern:

`pm_simplify_ranges` matches a loop from 0 to 1 and inlines it: "this isn't a loop, it's one iteration, just substitute the index with 0."

`pm_load_collapse` matches two adjacent loads of `buf[i]` and `buf[i+1]` and merges them into one wider load. fewer memory instructions, better bandwidth.

`pm_move_gates_from_index` takes a WHERE node that guards an invalid index and moves the guard to the LOAD level: "instead of computing a masked index and then loading, load a safe value and use the gate to pick between the real value and zero." this avoids out-of-bounds reads.

the compilation pipeline is exactly this, thirty times in a row. each pass is one `PatternMatcher` with a few patterns. the passes compose because each one creates shapes the next pass knows how to match.

## what happens when you finally compute

when i called `c.realize()`, i expected the magic to happen in one step. it doesn't. two things happen. rangeify, then the scheduler.

### views are not copies

reshape and permute don't copy data. reshape changes the shape of a tensor without moving anything in memory,

for example: `Tensor.arange(6).reshape(2, 3)` turns six numbers into a 2-by-3 grid, but the numbers stay in the same order underneath.

and... permute swaps axes:`tensor.permute(1, 0)` transposes a matrix by flipping which dimension is rows and which is columns. again, no data moves. these are just alternate ways to index into the same bytes.

if you have 16 floats in a flat buffer and call `.reshape(4, 4)`, all that happens is the reshape records that element `(row, col)` maps to byte offset `(row * 4 + col) * 4`.

rangeify walks the graph and replaces every reshape, permute, and expand node with explicit loop variables called RANGEs. a reshape becomes a RANGE that loops over the new dimensions and computes the index into the flat buffer. but rangeify does something else too. it splits the full compute graph into kernels.

take the matmul kernel `r_4_4_4`. here's what it computes:

```python
for i in range(4):
    for j in range(4):
        out[i][j] = sum(a[i][k] * b[k][j] for k in range(4))
```

rangeify turns this into a graph of low-level ops:

<canvas id="kernel-structure" class="nomnoml-canvas"></canvas>
<script>
drawDiagram('kernel-structure', `
[load data1|a row as float4]
[load data2|b column elements]
[load data1] -> [mul|val0 * val_n]
[load data2] -> [mul]
[mul] -> [add|sum products]
[add] -> [store data0|write result]
`);
</script>

each `out[i][j] = ...` is one **kernel invocation**. two loads from the input buffers, a multiply and accumulation chain, one store to the output buffer. that's the graph structure inside every kernel.

kernels are split at buffer writes. As long as the graph only reshapes, multiplies, and reduces values, those operations stay in the same kernel. Once a result is written to a buffer and later read back, that write marks the boundary between two kernels.

for my 4×4 matmul, rangeify produced eight kernels. Seven handled RNG bookkeeping: `Tensor.rand` uses a counter-based PRNG, and advancing its state is a separate computation. The matrix multiplication itself became a single kernel: `r_4_4_4`, named for its three loops, each of size 4.

this is where laziness pays off. Because reshape, multiply, and sum were all still in the graph, rangeify fused them into one kernel. An eager framework would have executed them separately, writing intermediates to memory and reading them back between each step.

### ordering the kernels

rangeify gives you a pile of kernels. the scheduler figures out what order to run them in.

each kernel reads from some buffers and writes to others. if kernel A writes buffer X and kernel B reads buffer X, then A must run before B. if kernel B wants to write buffer X and kernel A is still reading it, B has to wait. the scheduler builds a dependency graph from these constraints and topologically sorts it into a flat list. the output is called a LINEAR.

there's also a memory planner. if kernel A writes buffer X and kernel B is the last reader, buffer X's memory can be handed to kernel C later. no need to allocate fresh space.

## the compilation pipeline

each kernel now enters the codegen. a chain of rewrite passes walks the UOp tree and transforms it. i'll show three passes where the change is visible.

`symbolic simplify` resolves shape math at compile time:

```c
// before
int offset = (Lidx1 * 4) + 0;
// after
int offset = Lidx1 * 4;
```

`apply_opts` picks an execution strategy. for my matmul it unrolled the inner reduction:

```c
// before: a loop
for (int k = 0; k < 4; k++)
    sum += a[k] * b[k];

// after: straight-line multiply-adds
sum = a0*b0 + a1*b1 + a2*b2 + a3*b3;
```

`devectorize` splits vector ops into scalars, then `memory coalescing` re-merges adjacent ones. a `float4` add becomes four `float` adds, and if coalescing spots four adjacent loads, it re-packs them into one `float4` load:

```c
// devectorize: float4 -> four scalars
float4 tmp = buf[0];    // before
float a = buf[0];       // after
float b = buf[1];
float c = buf[2];
float d = buf[3];

// coalesce: adjacent scalars -> float4
// four individual loads become one vector load
float4 val = *((float4*)(buf));  // after
```

the order matters. devectorize first gives coalescing full visibility into memory adjacency.

after the chain, a renderer turns the flat UOp instructions into source code. on CPU, C with GCC vector extensions. on CUDA, CUDA. on AMD GPUs, machine code bytes. then a compiler produces the binary, cached by hash.

here's the full kernel after all sixteen passes:

```c
typedef float float4 __attribute__((aligned(16),ext_vector_type(4)));
void r_4_4_4(float* restrict data0, float* restrict data1, float* restrict data2) {
  for (int Lidx1 = 0; Lidx1 < 4; Lidx1++) {
    int alu0 = (Lidx1<<2);
    float4 val0 = (*((float4*)((data1+alu0))));
    for (int Lidx2 = 0; Lidx2 < 4; Lidx2++) {
      float val1 = (*(data2+(Lidx2+4)));
      float val2 = (*(data2+(Lidx2+8)));
      float val3 = (*(data2+(Lidx2+12)));
      float val4 = (*(data2+Lidx2));
      *(data0+(alu0+Lidx2)) = ((val0[0]*val4)+(val0[1]*val1)+(val0[2]*val2)+(val0[3]*val3));
    }
  }
}
```

the `float4` is from coalescing. the straight-line multiply-add is from unroll. `Lidx1<<2` is from symbolic simplify. every line comes from a pass you can find.

## running it

after compilation, each kernel is a binary blob with metadata. the runtime's job is to get these binaries onto the hardware.

a function called `run_linear` walks the LINEAR list one entry at a time. each entry is a `CALL` node. the CALL says what kind of work this is and which buffers are involved.

for a compute kernel, the runtime looks up the cached binary by the kernel's hash. it computes the launch dimensions from the kernel metadata. on a GPU, this means deciding how many thread blocks and threads per block. on CPU, it's the loop bounds. then it calls into the device driver to launch.

for a copy between devices, the runtime picks the fastest available path. if the two devices share a PCIe link, it uses direct memory access - the GPU can read from CPU memory without involving the CPU. if one end is a disk tensor backed by a file on an NVMe drive, it might use memory-mapped I/O to bypass the kernel's page cache. the fallback is always a CPU-hosted copy, but it's the slowest option and the runtime avoids it when it can.

each device backend lives in a file under `tinygrad/runtime/`. every backend implements four things. an allocator that gives you device memory and frees it. a renderer that turns UOp instructions into source code. a compiler that turns source into a binary the device can run. a runtime that loads and launches that binary.

the CPU backend uses gcc to compile C code and launches it as a function call. the CUDA backend uses nvrtc to compile CUDA source and launches via the CUDA driver API. the Metal backend compiles MSL and dispatches through Metal's command queue. the AMD and NVIDIA backends go further. they skip the vendor runtime entirely. they format the commands directly in the GPU's hardware command queue format and write them to memory-mapped registers. same approach Apple's Metal driver uses internally. no ROCm. no CUDA runtime. just Python talking to hardware.

you can watch the whole thing by turning up a number. `DEBUG=4` shows the generated source code for every kernel before it gets compiled.

```
DEBUG=4 python -c "from tinygrad import Tensor; (Tensor.rand(16,16)@Tensor.rand(16,16)).realize()"
```

a matmul that took seconds to write becomes 30 lines of unrolled, vectorized C on your terminal. and you can trace which pass produced each line.

i opened this codebase expecting a Python frontend with a black-box compiler underneath. instead i found 17K lines where a matmul is visible at every step. the graph you build, the kernel it becomes, the loops it unrolls, the C it generates. nothing is tucked away.

it's wild how much design went into this.
- the **mixin** system that lets Tensor and UOp share code.
- the **hash-consed graph** where rewriting is free.
- the **scheduler** that fuses ops because it sees the whole program at once.
- the pipeline of pattern matchers where each pass knows exactly what shape to look for.

the whole thing is at [github.com/tinygrad/tinygrad](https://github.com/tinygrad/tinygrad). the `DEBUG` flags are your way in. `1` for kernels, `2` for timing, `3` for the AST, `4` for the source. start with a matmul and follow it down.
