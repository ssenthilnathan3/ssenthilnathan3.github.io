<script lang="ts">
  import { onMount } from "svelte";

  let mode: "direct" | "cot" = "direct";
  let step = 0;
  let playing = false;
  let timer: ReturnType<typeof setInterval>;

  const directSteps = [
    {
      tokens:
        '"I want to wash my car. The car wash is 50m away. Should I walk or drive?"',
      ht: ["wash", "car", "50m", "transport_choice"],
      pWalk: 0.73,
      pDrive: 0.22,
      note: "Single forward pass. h_t dominated by distance pattern.",
      output: "",
    },
    {
      tokens: "→ generating...",
      ht: ["wash", "car", "50m", "transport_choice"],
      pWalk: 0.73,
      pDrive: 0.22,
      note: "P(walk) > P(drive). Model samples from this distribution.",
      output: '"You should walk! 50 meters is a very short distance..."',
    },
  ];

  const cotSteps = [
    {
      tokens: '"...Should I walk or drive? Let me think step by step."',
      ht: ["wash", "car", "50m", "step_by_step"],
      pWalk: 0.55,
      pDrive: 0.3,
      note: '"Step by step" shifts h_t slightly — but walk still leads.',
      output: "",
    },
    {
      tokens: '→ "First, what does a car wash actually do?"',
      ht: ["wash", "car", "50m", "what_does_wash_do"],
      pWalk: 0.48,
      pDrive: 0.38,
      note: "The reasoning token reframes the problem. Walk lead shrinks.",
      output: '"First, what does a car wash actually do?"',
    },
    {
      tokens: '→ "It washes the car. So the car needs to be there."',
      ht: ["wash", "car", "car_must_be_present", "50m"],
      pWalk: 0.25,
      pDrive: 0.65,
      note: "Causal constraint activates! h_t reorganizes. Drive takes the lead.",
      output: '"...So the car needs to be there."',
    },
    {
      tokens: '→ "Therefore I should drive."',
      ht: ["car_must_be_present", "transport_car", "drive"],
      pWalk: 0.08,
      pDrive: 0.88,
      note: "With the constraint in h_t, the distribution is now peaked on drive. ✓",
      output:
        '"Therefore, you should drive — you need the car there to wash it."',
    },
  ];

  $: steps = mode === "direct" ? directSteps : cotSteps;
  $: currentStep = steps[Math.min(step, steps.length - 1)];

  function switchMode(m: "direct" | "cot") {
    mode = m;
    step = 0;
    playing = false;
    if (timer) clearInterval(timer);
  }

  function play() {
    step = 0;
    playing = true;
    timer = setInterval(() => {
      step++;
      if (step >= steps.length) {
        clearInterval(timer);
        playing = false;
      }
    }, 2000);
  }

  function nextStep() {
    if (step < steps.length - 1) step++;
  }

  function prevStep() {
    if (step > 0) step--;
  }

  onMount(() => {
    return () => {
      if (timer) clearInterval(timer);
    };
  });
</script>

<div class="cot-container">
  <div class="cot-header">
    <span class="cot-title">chain-of-thought simulator</span>
  </div>

  <div class="mode-toggle">
    <button
      class="mode-btn"
      class:active={mode === "direct"}
      on:click={() => switchMode("direct")}
    >
      direct answer
    </button>
    <button
      class="mode-btn"
      class:active={mode === "cot"}
      on:click={() => switchMode("cot")}
    >
      chain-of-thought
    </button>
  </div>

  <div class="step-display">
    <div class="step-tokens">
      <span class="step-label">tokens</span>
      <span class="step-text">{currentStep.tokens}</span>
    </div>

    <div class="ht-display">
      <span class="step-label">h<sub>t</sub> encodes</span>
      <div class="ht-tags">
        {#each currentStep.ht as tag}
          <span
            class="ht-tag"
            class:causal={tag === "car_must_be_present" ||
              tag === "transport_car"}
            class:distance={tag === "50m"}
          >
            {tag}
          </span>
        {/each}
      </div>
    </div>

    <div class="prob-display">
      <div class="prob-row">
        <span class="prob-name" style="color: #ef4444;">walk</span>
        <div class="prob-track">
          <div
            class="prob-fill"
            style="width: {currentStep.pWalk * 100}%; background: #ef4444;"
          ></div>
        </div>
        <span class="prob-val">{(currentStep.pWalk * 100).toFixed(0)}%</span>
      </div>
      <div class="prob-row">
        <span class="prob-name" style="color: #22c55e;">drive</span>
        <div class="prob-track">
          <div
            class="prob-fill"
            style="width: {currentStep.pDrive * 100}%; background: #22c55e;"
          ></div>
        </div>
        <span class="prob-val">{(currentStep.pDrive * 100).toFixed(0)}%</span>
      </div>
    </div>

    <div class="step-note">{currentStep.note}</div>

    {#if currentStep.output}
      <div
        class="output-bubble"
        class:correct={currentStep.pDrive > currentStep.pWalk}
      >
        <span class="output-label">output →</span>
        {currentStep.output}
      </div>
    {/if}
  </div>

  <div class="controls">
    <button class="nav-btn" on:click={prevStep} disabled={step === 0}>←</button>
    <span class="step-counter">{step + 1} / {steps.length}</span>
    <button
      class="nav-btn"
      on:click={nextStep}
      disabled={step >= steps.length - 1}>→</button
    >
  </div>

  {#if mode === "cot" && step >= steps.length - 1}
    <div class="insight">
      <strong>key insight:</strong> each generated reasoning token modifies h<sub
        >t</sub
      >. the causal constraint <em>emerges</em> through iterated next-token prediction
      — not through a separate reasoning module. same mechanism, different trajectory.
    </div>
  {/if}
</div>

<style>
  .cot-container {
    background: var(--color-surface, #fffdfa);
    border: 1px solid var(--color-border, #e4ddd6);
    border-radius: 8px;
    padding: 1.5rem;
    margin: 2rem 0;
    font-family: var(--font-sans, "Inter", sans-serif);
  }

  .cot-header {
    margin-bottom: 1rem;
  }

  .cot-title {
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-text-subtle, #b6afa8);
  }

  /* Mode toggle */
  .mode-toggle {
    display: flex;
    gap: 0;
    margin-bottom: 1.25rem;
    border: 1px solid var(--color-border, #e4ddd6);
    border-radius: 6px;
    overflow: hidden;
    width: fit-content;
  }

  .mode-btn {
    font-family: var(--font-mono, "JetBrains Mono", monospace);
    font-size: 0.75rem;
    padding: 0.5rem 1rem;
    border: none;
    background: transparent;
    color: var(--color-text-muted, #5f5b57);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .mode-btn.active {
    background: var(--color-text, #1a1816);
    color: var(--color-bg, #fdf8f3);
  }

  .mode-btn:not(.active):hover {
    background: var(--color-accent-light, #f6f1ec);
  }

  /* Step display */
  .step-display {
    padding: 1rem;
    background: var(--color-accent-light, #f6f1ec);
    border-radius: 6px;
    margin-bottom: 1rem;
  }

  .step-label {
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text-subtle, #b6afa8);
    display: block;
    margin-bottom: 0.25rem;
  }

  .step-tokens {
    margin-bottom: 0.75rem;
  }

  .step-text {
    font-family: var(--font-mono, "JetBrains Mono", monospace);
    font-size: 0.78rem;
    color: var(--color-text, #1a1816);
    line-height: 1.5;
  }

  /* h_t tags */
  .ht-display {
    margin-bottom: 0.75rem;
  }

  .ht-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }

  .ht-tag {
    font-family: var(--font-mono, "JetBrains Mono", monospace);
    font-size: 0.7rem;
    padding: 0.2rem 0.5rem;
    border-radius: 3px;
    background: rgba(0, 0, 0, 0.06);
    color: var(--color-text-muted, #5f5b57);
    transition: all 0.3s ease;
  }

  .ht-tag.causal {
    background: rgba(34, 197, 94, 0.15);
    color: #16a34a;
    font-weight: 600;
  }

  .ht-tag.distance {
    background: rgba(239, 68, 68, 0.12);
    color: #dc2626;
  }

  /* Probabilities */
  .prob-display {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin-bottom: 0.75rem;
  }

  .prob-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .prob-name {
    font-family: var(--font-mono, "JetBrains Mono", monospace);
    font-size: 0.7rem;
    font-weight: 600;
    width: 40px;
    text-align: right;
    flex-shrink: 0;
  }

  .prob-track {
    flex: 1;
    height: 18px;
    background: rgba(0, 0, 0, 0.04);
    border-radius: 3px;
    overflow: hidden;
  }

  .prob-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .prob-val {
    font-family: var(--font-mono, "JetBrains Mono", monospace);
    font-size: 0.7rem;
    font-weight: 600;
    width: 32px;
    color: var(--color-text, #1a1816);
  }

  .step-note {
    font-size: 0.8rem;
    color: var(--color-text-muted, #5f5b57);
    font-style: italic;
    line-height: 1.4;
  }

  /* Output bubble */
  .output-bubble {
    margin-top: 0.75rem;
    padding: 0.6rem 0.8rem;
    border-radius: 6px;
    font-family: var(--font-mono, "JetBrains Mono", monospace);
    font-size: 0.75rem;
    background: rgba(239, 68, 68, 0.08);
    border: 1px solid rgba(239, 68, 68, 0.2);
    color: var(--color-text, #1a1816);
    line-height: 1.5;
  }

  .output-bubble.correct {
    background: rgba(34, 197, 94, 0.08);
    border-color: rgba(34, 197, 94, 0.2);
  }

  .output-label {
    color: var(--color-text-subtle, #b6afa8);
    font-weight: 600;
  }

  /* Controls */
  .controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  .nav-btn {
    font-family: var(--font-mono, "JetBrains Mono", monospace);
    font-size: 0.85rem;
    padding: 0.3rem 0.7rem;
    border: 1px solid var(--color-border, #e4ddd6);
    border-radius: 4px;
    background: transparent;
    color: var(--color-text-muted, #5f5b57);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .nav-btn:hover:not(:disabled) {
    background: var(--color-accent-light, #f6f1ec);
  }

  .nav-btn:disabled {
    opacity: 0.3;
    cursor: default;
  }

  .step-counter {
    font-family: var(--font-mono, "JetBrains Mono", monospace);
    font-size: 0.7rem;
    color: var(--color-text-subtle, #b6afa8);
  }

  /* Insight callout */
  .insight {
    margin-top: 1rem;
    padding: 0.75rem 1rem;
    background: rgba(34, 197, 94, 0.06);
    border-left: 3px solid #22c55e;
    border-radius: 0 6px 6px 0;
    font-size: 0.82rem;
    line-height: 1.5;
    color: var(--color-text, #1a1816);
    animation: fadeIn 0.5s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Dark mode */
  @media (prefers-color-scheme: dark) {
    .cot-container {
      background: #22201d;
      border-color: #33302c;
    }

    .mode-toggle {
      border-color: #33302c;
    }

    .mode-btn.active {
      background: #e8e4e0;
      color: #1a1816;
    }

    .mode-btn:not(.active):hover {
      background: #2c2825;
    }

    .step-display {
      background: #2c2825;
    }

    .step-text {
      color: #e8e4e0;
    }

    .ht-tag {
      background: rgba(255, 255, 255, 0.06);
      color: #b6afa8;
    }

    .ht-tag.causal {
      background: rgba(34, 197, 94, 0.12);
      color: #4ade80;
    }

    .ht-tag.distance {
      background: rgba(239, 68, 68, 0.1);
      color: #f87171;
    }

    .prob-track {
      background: rgba(255, 255, 255, 0.04);
    }

    .prob-val,
    .step-note,
    .insight,
    .output-bubble {
      color: #e8e4e0;
    }

    .nav-btn {
      border-color: #33302c;
      color: #b6afa8;
    }

    .nav-btn:hover:not(:disabled) {
      background: #2c2825;
    }

    .output-bubble {
      background: rgba(239, 68, 68, 0.06);
      border-color: rgba(239, 68, 68, 0.15);
    }

    .output-bubble.correct {
      background: rgba(34, 197, 94, 0.06);
      border-color: rgba(34, 197, 94, 0.15);
    }

    .insight {
      background: rgba(34, 197, 94, 0.05);
    }
  }

  @media (max-width: 540px) {
    .mode-toggle {
      width: 100%;
    }

    .mode-btn {
      flex: 1;
      text-align: center;
    }
  }
</style>
