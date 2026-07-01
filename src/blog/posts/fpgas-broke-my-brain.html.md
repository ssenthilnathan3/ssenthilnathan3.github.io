---
title: "FPGAs broke my brain"
description: "An SDE's eye on FPGAs"
date: 2025-01-07
category: tech
hero_image: /images/anniyan-ambi-remo.jpg
hero_image_source: "google images"
---

## the talk that broke my brain

i recently attended an event where an engineer who worked on FPGAs explained them in a way that stayed with me... not for minutes, but for *weeks*.

he didn't start with logic blocks or verilog.

he started with a movie.

<aside class="callout callout-gray"><div class="callout-header"><span class="callout-title">FPGAs are like Anniyan</span></div></aside>

for the uninitiated: **ANNIYAN** is Tamil cinema's most chaotic protagonist - a man with three distinct personalities:

- **ambi** -> a rule-bound, anxious bureaucrat who follows every rule to the letter
- **anniyan** -> a vigilante sociopath who emerges when ambi's patience snaps
- **remo** -> a charming romantic alter-ego who wins hearts effortlessly

*"they are like ambi sometimes, doing things exactly as you told them to,"* the engineer said.

*"they can be like anniyan too, doing things their own way, ignoring your intent entirely."*

then he smiled:

*"but if you truly understand them, if you learn to work* **with** *them... they become like remo. they like you. and they do more than you ever asked."*

that line hooked me.

not because it explained FPGAs - it clearly didn't xD

but because it hinted at something deeper: my entire intuition about *control*, *execution*, and *state* might be fundamentally wrong here.

i left with two questions burning in my head:

<aside class="callout callout-info"><div class="callout-header"><span class="callout-title">what the hell are FPGAs, really?</span></div></aside>

and why does thinking about them feel *so different* from thinking about code?


## the unlearning begins

here's the thing about being a software engineer: you've spent years building mental models.

you know that a program runs line by line. you know that variables hold values. you know that `x = 5` means "put 5 in the box labeled x."

these models are useful. they're *correct* - for software.

but FPGAs? they don't just require new knowledge.

**they require you to burn your old models to the ground.**

<aside class="callout callout-warning"><div class="callout-header"><span class="callout-title">In FPGAs, there are no variables.</span></div></aside>

let that sink in.

no `x = 5`.

no "box" that "holds" a value.

no sequential steps that "happen" one after another.

when i first heard this, my brain did that thing where it pretends to understand while actually panicking.

*"sure, sure, no variables, got it. so it's like... constants? immutable data?"*

no.

it's not like anything in software. that's the whole point.


## what do you mean "no variables"?

in software, when you write:

```python
x = 5
x = x + 1
```

you're giving instructions to a CPU. step 1: store 5. step 2: read it, add 1, store that.

time exists. sequence matters. the variable `x` is a *container* that changes over time.

in FPGAs, you don't write instructions.

**you describe geometry.**

<!-- FPGA vs Variable Widget -->
<div id="fpga-widget" class="widget-box explainer">
  <div class="side software">
    <div class="explainer-label">software</div>
    <div class="explainer-content">
      <div class="code-lines">
        <div class="code-line" data-step="1">x = 5</div>
        <div class="code-line" data-step="2">x = x + 3</div>
        <div class="code-line" data-step="3">x = x * 2</div>
      </div>
      <div class="variable-box">
        <span class="var-name">x</span>
        <span class="var-value">?</span>
      </div>
      <p class="circuit-note">one location, overwritten</p>
    </div>
  </div>
  <div class="explainer-divider"></div>
  <div class="side hardware">
    <div class="explainer-label">hardware</div>
    <div class="explainer-content">
      <svg viewBox="0 0 200 100" class="circuit">
        <circle cx="20" cy="30" r="8" class="circ-node" data-active="1"/>
        <circle cx="20" cy="70" r="8" class="circ-node" data-active="1"/>
        <line x1="28" y1="30" x2="70" y2="42" class="circ-wire" data-active="2"/>
        <line x1="28" y1="70" x2="70" y2="58" class="circ-wire" data-active="2"/>
        <rect x="70" y="35" width="40" height="30" rx="4" class="circ-gate" data-active="3"/>
        <text x="90" y="54" class="circ-gate-text">AND</text>
        <line x1="110" y1="50" x2="160" y2="50" class="circ-wire" data-active="4"/>
        <circle cx="175" cy="50" r="8" class="circ-node output" data-active="4"/>
      </svg>
      <p class="circuit-note">all paths exist, signals flow</p>
    </div>
  </div>
</div>

when you write Verilog or VHDL, you're not telling the chip *what to do*. you're telling it *what to become*.

you're saying: "here's a circuit. build it. now electricity will flow through it, following physics, not your step-by-step commands."

- there's no "run"
- there's no "execution order"
- all the wires exist simultaneously
- signals propagate constantly
- the "result" isn't computed - it *emerges*

even "state" - like registers or flip-flops - isn't a "variable that changes over time."

it's better described as:

<aside class="callout callout-note"><div class="callout-header"><span class="callout-title">a piece of hardware that captures a voltage when a clock edge arrives</span></div></aside>

that's not a metaphor. that's literally what it is.


## the sculptor vs. the painter

here's an analogy that helped me:

**software development is like painting.** you start with a blank canvas. you add strokes, one at a time, in sequence. you can paint over mistakes. the order you paint matters.

**hardware development is like sculpting.** you start with a block of marble. you remove material to reveal the shape *that was always there*. you can't "add" marble back. and when you're done, the sculpture exists all at once, not stroke by stroke.

when you program an FPGA, you're not "running code."

you're carving circuits into silicon.

once it's configured, the FPGA doesn't "execute" anything. the circuit just *is*. signals flow through it like water through pipes. the output isn't "calculated" - it's the natural consequence of physics.


## why this matters

you might be thinking: *"cool, but why should i care?"*

here's why:

### 1. parallelism is free

in software, you beg for parallelism. threads, async/await, mutexes, race conditions. it's a mess.

in hardware, **everything is parallel by default.** a thousand operations happening simultaneously isn't a feature - it's the starting point. you have to go out of your way to make things sequential.

### 2. latency is deterministic

CPUs are fast on average but unpredictable in the worst case. cache misses, branch mispredictions, OS interrupts - good luck guaranteeing timing.

FPGAs? the delay through a circuit is a function of physics. you can measure it in *picoseconds*. it won't change because your OS decided to run garbage collection.

### 3. you're building actual hardware

this isn't a simulation. when you configure an FPGA, you're physically rewiring transistors. you're not *simulating* a circuit - you *are* the circuit.


## back to anniyan

remember the three personalities?

after weeks of struggling with FPGAs, the analogy finally clicked:

**ambi mode:** you write Verilog. everything works in simulation. timing is perfect. life is good. this is you following the tutorials, doing everything "right."

**anniyan mode:** you synthesize. the tool does things you didn't expect. timing fails. resources explode. what you *meant* and what you *wrote* were apparently different things. the FPGA is doing exactly what you told it - not what you wanted.

**remo mode:** you start thinking in hardware. you stop fighting the paradigm. you design *with* the grain of silicon. and suddenly, the FPGA doesn't just work - it does things that would take a CPU orders of magnitude longer. it likes you now.


## the shift

here's what i've learned so far:

- stop thinking about "what runs when"
- start thinking about "what connects to what"
- stop thinking about variables
- start thinking about wires
- stop writing algorithms
- start describing architectures

it's hard. my brain still defaults to software thinking every few minutes.

but occasionally... just occasionally.. i catch a glimpse of what it means to *think in hardware*.

and when that happens, it feels less like learning a new skill...

<aside class="callout callout-success"><div class="callout-header"><span class="callout-title">...and more like gaining a new sense.</span></div></aside>
