---
title: "FPGAs broke my brain"
description: "An SDE's eye on FPGAs"
date: 2025-01-07
category: tech
hero_image: /images/anniyan-ambi-remo.jpg
hero_image_source: "google images"
---

an FPGA engineer recently used a tamil movie analogy to explain hardware design, and it fundamentally changed how i approach programming.

he compared FPGAs to **Anniyan**-the chaotic protagonist with three personalities:

- **ambi:** strict, rule-bound bureaucrat
- **anniyan:** violent, unpredictable vigilante
- **remo:** charming, effortless romantic

his point was that writing for FPGAs isn't just about syntax. if you just follow the rules blindly (Ambi), the synthesis tool might misinterpret your intent and produce something completely broken and chaotic (Anniyan). but if you design with the hardware physically in mind, it works beautifully and handles things faster than a CPU ever could (Remo).

this analogy highlighted how my mental model as a software engineer was completely misaligned for hardware.

## the missing variables

in software, you write sequential instructions. `x = 5` means "put 5 in the box labeled x." time exists, and the variable `x` changes state step-by-step.

in FPGAs, there are no variables. you don't write instructions-you describe physical geometry.

when you write Verilog, you are telling the chip to build a physical circuit. electricity flows through it based on physics, not execution order. all paths exist at once, and signals propagate constantly.

even "state" isn't a variable changing over time. it's literally just a physical flip-flop capturing voltage on a clock edge.

## thinking in hardware

the biggest shift is moving from algorithms to architectures. you don't calculate results step-by-step; you build the pipes that force the result to emerge.

this has real implications:

- **parallelism is default:** a thousand operations happen simultaneously because the physical paths exist for all of them.
- **latency is physics:** you measure delay in picoseconds through a physical path, not by guessing CPU cycles or OS interrupts.

i'm still defaulting to software thinking most days. but i'm slowly learning to stop writing code and start wiring up the silicon.
