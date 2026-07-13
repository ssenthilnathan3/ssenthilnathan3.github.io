---
title: "NPM sucks for a solo dev"
description: "im done with it."
date: 2026-07-01
category: misc
hero_image: /images/npm-meme.jpg
hero_image_source: "google images"
---

i spend every week doing something that has absolutely nothing to do with putting out good content for my blog.

i am fixing a transitive dependency vulnerability in a package i didn't even know i was using.

for a solo developer, the javascript ecosystem can feel like a full-time job. it's a treadmill that never stops, and if you step off it, a dependabot alert will politely tap you on the shoulder to inform you that your site is now insecure because of a micro-package that left-pads strings.

why do we do this to ourselves?

## scales and tools

to be fair: npm isn't bad. it's just solving a different problem.

if you're shipping complex web software at scale with dozens of engineers, an enormous, modular package ecosystem is a superpower. it allows teams to share components, abstract utility logic, and move fast across separate codebases. the overhead of managing dependencies and configuring bundlers is just the cost of doing business.

but i'm not doing that.

i'm trying to publish a blog.

at my scale, every single dependency is another thing competing for my attention. and when you're a solo dev, attention is your most scarce resource.

every minute spent debugging a failing bundler, resolving webpack version conflicts, or chasing down deprecation warnings is a minute not spent writing or thinking. the tooling becomes the product.

## go and hugo

that is why i ended up throwing out the entire node asset pipeline for this portfolio and rewriting it to compile using hugo (go).

when you build with a single static binary like hugo, things feel stable. you don't have a giant **node_modules** tree with 1,500 nested packages just to compile a few stylesheets. there is no bundler config to fight with, no dependency trees to audit, and it generates the entire site in milliseconds. the tool just stays out of the way.

i'd rather spend my energy writing articles than maintaining my local development environment.

sometimes, choosing a single compiled binary isn't going backward. it's just protecting your focus.

so **AALA VIDRA BALLEILAKKA**
