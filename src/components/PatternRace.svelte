<script lang="ts">
  import type { late } from "astro/zod";
  import { onMount } from "svelte";

  let phase = 0; // 0-100 animation progress
  let running = false;
  let animFrame: number;

  let patterns = [
    {
      label: "50m is short → walk",
      type: "surface",
      speed: 3.2,
      fill: 0,
      color: "#ef4444",
      desc: "lexical co-occurrence",
      freq: "very high",
    },
    {
      label: "car wash = location",
      type: "semantic",
      speed: 2.1,
      fill: 0,
      color: "#f59e0b",
      desc: "entity recognition",
      freq: "high",
    },
    {
      label: '"should I X or Y" → evaluate',
      type: "pragmatic",
      speed: 1.8,
      fill: 0,
      color: "#8b5cf6",
      desc: "intent pattern",
      freq: "high",
    },
    {
      label: "goal requires object → drive",
      type: "causal",
      speed: 0.6,
      fill: 0,
      color: "#22c55e",
      desc: "causal constraint",
      freq: "moderate",
    },
  ];

  let winner = "";
  let showResult = false;

  function reset() {
    patterns.forEach((p) => (p.fill = 0));
    patterns = patterns;
    winner = "";
    showResult = false;
    phase = 0;
  }

  function animate() {
    if (!running) return;

    let anyFinished = false;
    patterns.forEach((p) => {
      if (p.fill < 100) {
        // Add slight randomness to make it feel organic
        p.fill = Math.min(100, p.fill + p.speed + (Math.random() - 0.5) * 0.8);
      }
      if (p.fill >= 100 && !winner) {
        winner = p.label;
        anyFinished = true;
      }
    });
    patterns = patterns;
    phase++;

    if (anyFinished) {
      // Let the others fill a bit more then stop
      setTimeout(() => {
        running = false;
        showResult = true;
      }, 600);
    }

    if (running) {
      animFrame = requestAnimationFrame(animate);
    }
  }

  function start() {
    reset();
    running = true;
    requestAnimationFrame(animate);
  }

  onMount(() => {
    // Auto-start after a small delay
    const timeout = setTimeout(start, 800);
    return () => {
      clearTimeout(timeout);
      running = false;
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  });
</script>

<div class="race-container">
  <div class="race-header">
    <span class="race-title">pattern activation race</span>
    <button class="race-btn" on:click={start}>
      {showResult ? "↻ replay" : "▶ run"}
    </button>
  </div>

  <div class="prompt-display">
    <span class="prompt-label">input →</span>
    <span class="prompt-text"
      >"I want to wash my car. The car wash is 50 meters away. Should I walk or
      drive?"</span
    >
  </div>

  <div class="tracks">
    {#each patterns as p, i}
      <div class="track" class:winner={winner === p.label}>
        <div class="track-meta">
          <span class="track-label">{p.label}</span>
          <span class="track-freq">{p.freq}</span>
        </div>
        <div class="track-bar">
          <div
            class="track-fill"
            style="width: {p.fill}%; background: {p.color};"
          ></div>
          <span
            class="track-pct"
            style="color: {p.fill > 50 ? '#fff' : p.color};"
            >{Math.round(p.fill)}%</span
          >
        </div>
        <span class="track-desc">{p.desc}</span>
      </div>
    {/each}
  </div>

  {#if showResult}
    <div class="result">
      <div class="result-text">
        <strong>"{winner}"</strong> activates first.
        <br />
        <span class="result-sub"
          >the causal pattern (green) exists in the weights — but it loses the
          race to the surface pattern.</span
        >
      </div>
    </div>
  {/if}
</div>

<style>
  .race-container {
    background: var(--color-surface, #fffdfa);
    border: 1px solid var(--color-border, #e4ddd6);
    border-radius: 8px;
    padding: 1.5rem;
    margin: 2rem 0;
    font-family: var(--font-sans, "Inter", sans-serif);
  }

  .race-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .race-title {
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-text-subtle, #b6afa8);
  }

  .race-btn {
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

  .race-btn:hover {
    background: var(--color-accent-light, #f6f1ec);
    border-color: var(--color-border-hover, #d3cbc3);
  }

  .prompt-display {
    font-family: var(--font-mono, "JetBrains Mono", monospace);
    font-size: 0.78rem;
    padding: 0.75rem 1rem;
    background: var(--color-accent-light, #f6f1ec);
    border-radius: 6px;
    margin-bottom: 1.25rem;
    line-height: 1.5;
  }

  .prompt-label {
    color: var(--color-text-subtle, #b6afa8);
  }

  .prompt-text {
    color: var(--color-text, #1a1816);
  }

  .tracks {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .track {
    transition: all 0.3s ease;
  }

  .track.winner {
    transform: scale(1.01);
  }

  .track-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.25rem;
  }

  .track-label {
    font-family: var(--font-mono, "JetBrains Mono", monospace);
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--color-text, #1a1816);
  }

  .track-freq {
    font-size: 0.65rem;
    color: var(--color-text-subtle, #b6afa8);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .track-bar {
    position: relative;
    height: 28px;
    background: var(--color-accent-light, #f6f1ec);
    border-radius: 4px;
    overflow: hidden;
  }

  .track-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.1s linear;
  }

  .track-pct {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    font-family: var(--font-mono, "JetBrains Mono", monospace);
    font-size: 0.7rem;
    font-weight: 600;
    transition: color 0.2s ease;
  }

  .track-desc {
    font-size: 0.65rem;
    color: var(--color-text-subtle, #b6afa8);
    margin-top: 0.15rem;
    display: block;
  }

  .result {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
    margin-top: 1.25rem;
    padding: 1rem;
    background: rgba(239, 68, 68, 0.06);
    border-left: 3px solid #ef4444;
    border-radius: 0 6px 6px 0;
    animation: fadeIn 0.5s ease;
  }

  .result-text {
    font-size: 0.85rem;
    color: var(--color-text, #1a1816);
    line-height: 1.5;
  }

  .result-sub {
    color: var(--color-text-muted, #5f5b57);
    font-size: 0.8rem;
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
    .race-container {
      background: #22201d;
      border-color: #33302c;
    }

    .race-btn {
      border-color: #33302c;
      color: #b6afa8;
    }

    .race-btn:hover {
      background: #2c2825;
      border-color: #45403c;
    }

    .prompt-display {
      background: #2c2825;
    }

    .prompt-text {
      color: #e8e4e0;
    }

    .track-label {
      color: #e8e4e0;
    }

    .track-bar {
      background: #2c2825;
    }

    .result {
      background: rgba(239, 68, 68, 0.08);
    }

    .result-text {
      color: #e8e4e0;
    }

    .result-sub {
      color: #b6afa8;
    }
  }
</style>
