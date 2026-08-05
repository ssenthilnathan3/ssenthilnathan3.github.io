---
title: "read Kimi K3 with me"
draft: true
description: ""
date: 2026-08-02
category: tech
---

how does kimi k3 differ from other models, what novelty is in there for all the buzz and how tf does it have 1M context length?

kimi k3 is a 2.8T parameter model (first open-weight model of that size). its novelty lies in the coordination of optimization across three axes: sequence (KDA), depth (Attention Residuals), width (Stable LatentMoE).

what is KDA (kimi delta attention)?

before understanding what KDA is we need to know why there was a need for improvement that led to KDA. for that, we need to know about what transformers are (which all the models are using rn).

transformers have this incredible method called self-attention which understands the relationship between the words that are surrounding it and give it semantic meaning. yk there is a saying that "a word is as meaningful as the place that it is placed on the sentence".

self-attention does exactly that, for a word it finds the places that it could be surrounding with.. in turn it knows where it could occur. thus, next-word generation. but doing this for one word is cool when you do this for every unique word in the corpus of millions of texts. to do this efficiently we parallelize the process, but this comes at a cost of compute. as the input gets longer, the number of comparisons grows quadratically.

so, this is what KDA optimized making it a noticeable one... in the wild.

linear attention: linear attention is a method which optimized the quadratic nature of transformers to be linearly scaled. in standard attention, the computational and memory complexity is O(N^2) where N denotes the sequence length.
