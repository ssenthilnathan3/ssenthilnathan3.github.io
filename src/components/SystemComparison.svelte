<script lang="ts">
  import { onMount } from "svelte";

  let activeSystem: "A" | "B" | null = null;
  let stepA = -1;
  let stepB = -1;
  let timer: ReturnType<typeof setInterval>;

  const stepsA = [
    { label: "parse", detail: '"I want to wash my car"', icon: "📖" },
    { label: "extract goal", detail: "CLEAN(car)", icon: "🎯" },
    {
      label: "extract constraint",
      detail: "WASH(car) → PRESENT(car, location)",
      icon: "🔗",
    },
    { label: "world model", detail: "car = HERE, wash = THERE", icon: "🌍" },
    { label: "reason", detail: "PRESENT requires TRANSPORT", icon: "💭" },
    { label: "answer", detail: "→ DRIVE ✓", icon: "✅" },
  ];

  const stepsB = [
    { label: "encode", detail: "tokens → h_t", icon: "⚡" },
    { label: "activate patterns", detail: "P(patterns | h_t)", icon: "🔥" },
    {
      label: "simulate reasoning",
      detail: "patterns ≈ world model output",
      icon: "🎭",
    },
    { label: "sample", detail: "next_token ~ P(· | h_t)", icon: "🎲" },
    { label: "output", detail: "→ WALK ✗ (or DRIVE ✓ if lucky)", icon: "❓" },
  ];

  function runSystem(sys: "A" | "B") {
    if (timer) clearInterval(timer);
    activeSystem = sys;
    stepA = -1;
    stepB = -1;

    const steps = sys === "A" ? stepsA : stepsB;
    let current = -1;

    timer = setInterval(() => {
      current++;
      if (current >= steps.length) {
        clearInterval(timer);
        return;
      }
      if (sys === "A") stepA = current;
      else stepB = current;
    }, 700);
  }

  function runBoth() {
    if (timer) clearInterval(timer);
    activeSystem = null;
    stepA = -1;
    stepB = -1;

    let currentA = -1;
    let currentB = -1;
    const maxSteps = Math.max(stepsA.length, stepsB.length);

    timer = setInterval(() => {
      currentA++;
      currentB++;
      if (currentA < stepsA.length) stepA = currentA;
      if (currentB < stepsB.length) stepB = currentB;
      if (currentA >= stepsA.length && currentB >= stepsB.length) {
        clearInterval(timer);
      }
    }, 700);
  }

  onMount(() => {
    const timeout = setTimeout(runBoth, 800);
    return () => {
      clearTimeout(timeout);
      if (timer) clearInterval(timer);
    };
  });
</script>

<div class="systems-container">
  <div class="systems-header">
    <span class="systems-title">two systems, same question</span>
    <button class="replay-btn" on:click={runBoth}>↻ replay</button>
  </div>

  <div class="systems-grid">
    <div class="system" class:highlight={activeSystem === "A"}>
      <div class="system-label">
        <span class="sys-name">System A</span>
        <span class="sys-type">symbolic reasoning</span>
      </div>
      <div class="pipeline">
        {#each stepsA as s, i}
          <div
            class="pipe-step"
            class:active={stepA >= i}
            class:current={stepA === i}
          >
            <span class="pipe-icon">{s.icon}</span>
            <div class="pipe-info">
              <span class="pipe-label">{s.label}</span>
              <span class="pipe-detail">{s.detail}</span>
            </div>
          </div>
          {#if i < stepsA.length - 1}
            <div class="pipe-arrow" class:active={stepA >= i + 1}>↓</div>
          {/if}
        {/each}
      </div>
    </div>

    <div class="vs-divider">
      <span class="vs">vs</span>
    </div>

    <div class="system" class:highlight={activeSystem === "B"}>
      <div class="system-label">
        <span class="sys-name">System B</span>
        <span class="sys-type">pattern activation</span>
      </div>
      <div class="pipeline">
        {#each stepsB as s, i}
          <div
            class="pipe-step"
            class:active={stepB >= i}
            class:current={stepB === i}
          >
            <span class="pipe-icon">{s.icon}</span>
            <div class="pipe-info">
              <span class="pipe-label">{s.label}</span>
              <span class="pipe-detail">{s.detail}</span>
            </div>
          </div>
          {#if i < stepsB.length - 1}
            <div class="pipe-arrow" class:active={stepB >= i + 1}>↓</div>
          {/if}
        {/each}
      </div>
    </div>
  </div>

  {#if stepA >= stepsA.length - 1 && stepB >= stepsB.length - 1}
    <div class="question-box">
      if System A's "understanding" is also pattern activation over neural
      substrates...
      <strong
        >is the distinction real, or just a difference in reliability?</strong
      >
    </div>
  {/if}
</div>

<style>
  .systems-container {
    background: var(--color-surface, #fffdfa);
    border: 1px solid var(--color-border, #e4ddd6);
    border-radius: 8px;
    padding: 1.5rem;
    margin: 2rem 0;
    font-family: var(--font-sans, "Inter", sans-serif);
  }

  .systems-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.25rem;
  }

  .systems-title {
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-text-subtle, #b6afa8);
  }

  .replay-btn {
    font-family: var(--font-mono, "JetBrains Mono", monospace);
    font-size: 0.75rem;
    padding: 0.3rem 0.8rem;
    border: 1px solid var(--color-border, #e4ddd6);
    border-radius: 4px;
    background: transparent;
    color: var(--color-text-muted, #5f5b57);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .replay-btn:hover {
    background: var(--color-accent-light, #f6f1ec);
  }

  .systems-grid {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 0.75rem;
  }

  .system {
    padding: 1rem;
    background: var(--color-accent-light, #f6f1ec);
    border-radius: 6px;
    transition: all 0.3s ease;
  }

  .system-label {
    margin-bottom: 0.75rem;
  }

  .sys-name {
    font-family: var(--font-mono, "JetBrains Mono", monospace);
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--color-text, #1a1816);
    display: block;
  }

  .sys-type {
    font-size: 0.65rem;
    color: var(--color-text-subtle, #b6afa8);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .pipeline {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .pipe-step {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 0.5rem;
    border-radius: 4px;
    opacity: 0.3;
    transition: all 0.4s ease;
  }

  .pipe-step.active {
    opacity: 1;
  }

  .pipe-step.current {
    background: rgba(59, 130, 246, 0.08);
  }

  .pipe-icon {
    font-size: 0.9rem;
    flex-shrink: 0;
  }

  .pipe-info {
    display: flex;
    flex-direction: column;
  }

  .pipe-label {
    font-family: var(--font-mono, "JetBrains Mono", monospace);
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--color-text, #1a1816);
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .pipe-detail {
    font-family: var(--font-mono, "JetBrains Mono", monospace);
    font-size: 0.65rem;
    color: var(--color-text-muted, #5f5b57);
  }

  .pipe-arrow {
    text-align: center;
    font-size: 0.6rem;
    color: var(--color-text-subtle, #b6afa8);
    opacity: 0.3;
    transition: opacity 0.3s ease;
    padding: 0 0 0 1rem;
  }

  .pipe-arrow.active {
    opacity: 0.6;
  }

  .vs-divider {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .vs {
    font-family: var(--font-mono, "JetBrains Mono", monospace);
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--color-text-subtle, #b6afa8);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .question-box {
    margin-top: 1rem;
    padding: 0.75rem 1rem;
    background: rgba(139, 92, 246, 0.06);
    border-left: 3px solid #8b5cf6;
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
    .systems-container {
      background: #22201d;
      border-color: #33302c;
    }

    .replay-btn {
      border-color: #33302c;
      color: #b6afa8;
    }

    .replay-btn:hover {
      background: #2c2825;
    }

    .system {
      background: #2c2825;
    }

    .sys-name,
    .pipe-label {
      color: #e8e4e0;
    }

    .pipe-detail {
      color: #b6afa8;
    }

    .pipe-step.current {
      background: rgba(59, 130, 246, 0.06);
    }

    .question-box {
      background: rgba(139, 92, 246, 0.06);
      color: #e8e4e0;
    }
  }

  @media (max-width: 640px) {
    .systems-grid {
      grid-template-columns: 1fr;
    }

    .vs-divider {
      padding: 0.5rem 0;
    }
  }
</style>
