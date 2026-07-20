---
title: "Why malloc is doing more than I asked for"
description: "internal fragmentation in memory - explained"
date: 2026-07-20
category: tech
draft: true
---

```c
void *p = malloc(13);
```

Almost all of us has seen this before when writing a _safe_ c program. we know what this line does, atleast we know the purpose of it,

**ask for 13 bytes, get 13 bytes**

seems simple, elegant. that's what i thought when i started building this on a friday out of curiosity. 30 mins into it, without writing a single line of code... i knew that this almost never happens.

this simple line holds multiple interesting computations and allocations in itself under-the-hood.

for example, when I request 13 bytes.

actually reserved:

| Header | Back Pointer | Padding | User Memory |
| :----- | :----------: | :-----: | :---------- |

the user memory is the only thing we are gonna use and the \*p returns the start of that memory. all the others are just there... not for usage.. why is that??
