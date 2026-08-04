---
title: "KV Cache isn't just a Cache"
description: "understanding contexts and memory of LLMs"
date: 2026-08-03
category: tech
hero_image: /images/kv-cache.jpeg
hero_image_source: "google images"
draft: true
hero_image_fit: fit
---

## intuition

a "cache" is just a temporary memory that stores information you'll probably need again. Instead of recomputing or fetching the same data repeatedly, you keep it somewhere much faster to access. a KV cache is as same as that but for LLMs the program is the **transformer** architecture, but the behaviour comes from its learned weights.

these weights are filled in training phase and during inference - where the LLM is actually generates the content, input tokens are processed using these weights to produce the next token. every generated token immediately becomes part of the context for predicting the next token.

{{<info title="Example">}}
**User**: *My dog's name is Max.*
{{</info>}}

this is information for the model.. it needs to store it somewhere for reference when the user mentions the name "Max" or "my dog" or "my pet".

that's where KV cache comes in...

## but wth is K and V

K = key and V = value :)

but there is more to it, an another called Q = query, which makes the whole picture make sense.

you see, every token is represented internally as a high-dimensional vector. as it passes through the transformer, that representation changes layer by layer. so after processing, **My dog's name is Max.**. the KV cache might (conceptually) look like this:

| Token | Key            | Value                          |
| ----- | -------------- | ------------------------------ |
| My    | ownership      | user                           |
| dog   | pet            | user's dog                     |
| name  | identity       | we're talking about a name     |
| is    | assignment     | connects the subject and value |
| Max   | dog's identity | **Max**                        |

*Note: for easy human readability the keys, values are shown as intents, but the KV cache actually contains hundreds of floating point numbers.*

## querying the KV cache

Now suppose the user asks,

> "What's my dog's name?"

The new tokens generate fresh **query (Q)** vector. and it conceptually represents the intent as,

"I'm looking for the identity of the dog!"

now the Query is compared with every cached Key to compute attention scores. those scores determine how much each Value contributes to the final representation.

![KV cache lookup](/images/kv-cache.svg)

notice that the cache stores an entry for every token, not the sentence as a whole. and there is something interesting about the output... the model doesn't search for the word "Max". It searches for a vector representing "the name of the user's dog."

so... **QUERY** asks, *"Who is the user's dog?"*

**KEYS** answer, *"I know something about that."*

**VALUES** provide the *"actual information needed"* to generate the response.

in other words, the model doesn't remember words... it remembers vector representations of their meaning in context. that's why it's called the KV cache, the model stores the Keys and Values for every previous token, and computes a brand-new Query whenever a new token arrives.


