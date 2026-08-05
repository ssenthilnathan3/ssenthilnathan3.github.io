---
title: "How does a production Deep Learning framework actually work?"
description: "Let's break down tinygrad & find out :)"
date: 2026-08-05
draft: true
category: tech
---

tinygrad is the end-to-end deep learning stack used by the opensource self-driving car project [comma.ai](https://comma.ai/) founded by [George Hotz](https://en.wikipedia.org/wiki/George_Hotz)

out of all the deep learning libraries, why should you know about the internals of tinygrad?

1. it is written in pure python.
2. its tiny :)
3. it teaches you what Pytorch/JAX hides.
4. you get to see real codegen not just the API
5. its the infra behind a safety-critical project in production [openpilot](https://comma.ai/openpilot)

## architecture

a tinygrad program flows through the 4 stages:

1. Tensor API (frontend)
2. UOp graph (lazy IR)
3. Scheduler (splits the IR into kernels)
4. Codegen (optimizes and lowers to source/binary)
5. Runtime (executes on device)

everything in the entire stack is just one data structure: an UOp which is an immutable, hash-consed node with op/dtype/src/arg. Tensors, kernels, compiled programs are all UOps.

{{<info>}}
this post is written by breaking down the library through DEBUG flags, to debug and explore yourself, you can follow the below mentioned method:

```
# prints scheduled kernels
DEBUG=1 python3 -c "from tinygrad import Tensor; (Tensor.rand(16,16)@Tensor.rand(16,16)).realize()"

# prints performance data
DEBUG=2 python3 -c "from tinygrad import Tensor; (Tensor.rand(16,16)@Tensor.rand(16,16)).realize()"

# prints the AST
DEBUG=3 python3 -c "from tinygrad import Tensor; (Tensor.rand(16,16)@Tensor.rand(16,16)).realize()"

# prints generated source
DEBUG=4 python3 -c "from tinygrad import Tensor; (Tensor.rand(16,16)@Tensor.rand(16,16)).realize()"
```

{{</info>}}

## the frontend

the **tensor** *(a generalized family name for scalars, vectors, matrices and higher-dimensional grids)*, is just a thin layer wrapped around UOps. Ops just builds graphs, nothing computes until you call `.realize()` or `.item()`

the wrapper UOps does all the computation around the Tensor. The value, math, shape is all in the UOp it holds.

