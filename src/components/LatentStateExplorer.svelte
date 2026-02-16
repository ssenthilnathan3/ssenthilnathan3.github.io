<script lang="ts">
  import { onMount } from "svelte";

  // Tokens from the prompt
  const tokens = [
    { text: "I", type: "neutral" },
    { text: "want", type: "neutral" },
    { text: "to", type: "neutral" },
    { text: "wash", type: "goal" },
    { text: "my", type: "neutral" },
    { text: "car", type: "object" },
    { text: ".", type: "neutral" },
    { text: "The", type: "neutral" },
    { text: "car", type: "object" },
    { text: "wash", type: "location" },
    { text: "is", type: "neutral" },
    { text: "50", type: "distance" },
    { text: "meters", type: "distance" },
    { text: "away", type: "distance" },
    { text: ".", type: "neutral" },
    { text: "Should", type: "neutral" },
    { text: "I", type: "neutral" },
    { text: "walk", type: "choice" },
    { text: "or", type: "neutral" },
    { text: "drive", type: "choice" },
    { text: "?", type: "neutral" },
  ];

  // Probability of walk vs drive as each token is processed
  const probCurve = [
    // Each entry: [P(walk), P(drive)]
    [0.5, 0.5], // I
    [0.5, 0.5], // want
    [0.5, 0.5], // to
    [0.45, 0.35], // wash -- slight signal
    [0.45, 0.35], // my
    [0.42, 0.4], // car -- "car" nudges drive slightly
    [0.42, 0.4], // .
    [0.42, 0.4], // The
    [0.43, 0.39], // car
    [0.4, 0.38], // wash -- "car wash" = compound entity
    [0.4, 0.38], // is
    [0.6, 0.25], // 50 -- BIG jump: distance pattern activates
    [0.68, 0.2], // meters -- reinforces distance
    [0.72, 0.18], // away -- distance pattern dominant
    [0.72, 0.18], // .
    [0.72, 0.18], // Should
    [0.72, 0.18], // I
    [0.73, 0.22], // walk -- seeing "walk" primes it
    [0.73, 0.22], // or
    [0.73, 0.22], // drive
    [0.73, 0.22], // ?
  ];

  let currentIndex = -1;
  let pWalk = 0.5;
  let pDrive = 0.5;
  let playing = false;
  let done = false;
  let timer: ReturnType<typeof setInterval>;

  function start() {
    currentIndex = -1;
    pWalk = 0.5;
    pDrive = 0.5;
    done = false;
    playing = true;

    timer = setInterval(() => {
      currentIndex++;
      if (currentIndex >= tokens.length) {
        clearInterval(timer);
        playing = false;
        done = true;
        return;
      }
      pWalk = probCurve[currentIndex][0];
      pDrive = probCurve[currentIndex][1];
    }, 350);
  }

  function jumpTo(i: number) {
    currentIndex = i;
    pWalk = probCurve[i][0];
    pDrive = probCurve[i][1];
    done = i === tokens.length - 1;
  }

  onMount(() => {
    const timeout = setTimeout(start, 600);
    return () => {
      clearTimeout(timeout);
      if (timer) clearInterval(timer);
    };
  });

  // Color for token type
  function tokenColor(type: string): string {
    switch (type) {
      case "goal":
        return "#22c55e";
      case "object":
        return "#3b82f6";
      case "location":
        return "#f59e0b";
      case "distance":
        return "#ef4444";
      case "choice":
        return "#8b5cf6";
      default:
        return "var(--color-text-muted, #5f5b57)";
    }
  }
</script>

<div class="explorer">
  <div class="explorer-header">
    <span class="explorer-title">latent state explorer</span>
    <button class="ctrl-btn" on:click={start}>
      {done ? "↻ replay" : playing ? "⏸" : "▶"}
    </button>
  </div>

  <div class="token-stream">
    {#each tokens as tok, i}
      <button
        class="token"
        class:processed={i <= currentIndex}
        class:current={i === currentIndex}
        style="--tok-color: {tokenColor(tok.type)};"
        on:click={() => jumpTo(i)}
        tabindex="0"
      >
        {tok.text}
      </button>
    {/each}
  </div>

  <div class="legend">
    <span class="leg-item"
      ><span class="leg-dot" style="background:#22c55e"></span>goal</span
    >
    <span class="leg-item"
      ><span class="leg-dot" style="background:#3b82f6"></span>object</span
    >
    <span class="leg-item"
      ><span class="leg-dot" style="background:#f59e0b"></span>location</span
    >
    <span class="leg-item"
      ><span class="leg-dot" style="background:#ef4444"></span>distance</span
    >
    <span class="leg-item"
      ><span class="leg-dot" style="background:#8b5cf6"></span>choice</span
    >
  </div>

  <div class="prob-section">
    <div class="prob-label-row">
      <span class="prob-label">P(next_token | h<sub>t</sub>)</span>
      <span class="prob-step">
        {#if currentIndex >= 0}
          t = {currentIndex + 1}
        {:else}
          waiting...
        {/if}
      </span>
    </div>

    <div class="prob-bars">
      <div class="prob-row">
        <span class="prob-name walk">walk</span>
        <div class="prob-track">
          <div class="prob-fill walk-fill" style="width: {pWalk * 100}%;"></div>
        </div>
        <span class="prob-val">{(pWalk * 100).toFixed(0)}%</span>
      </div>
      <div class="prob-row">
        <span class="prob-name drive">drive</span>
        <div class="prob-track">
          <div
            class="prob-fill drive-fill"
            style="width: {pDrive * 100}%;"
          ></div>
        </div>
        <span class="prob-val">{(pDrive * 100).toFixed(0)}%</span>
      </div>
    </div>
  </div>

  {#if currentIndex >= 11 && currentIndex <= 13}
    <div class="annotation distance-note">
      ⚡ <strong>"50 meters away"</strong> — the distance pattern fires. P(walk)
      jumps from 0.40 → 0.72. this single feature dominates the latent state.
    </div>
  {/if}

  {#if done}
    <div class="annotation final-note">
      final h<sub>t</sub> → model samples <strong>"walk"</strong>. the causal
      constraint ("car must be present") never reached sufficient activation to
      overcome the distance pattern.
    </div>
  {/if}
</div>

<style>
  .explorer {
    background: var(--color-surface, #fffdfa);
    border: 1px solid var(--color-border, #e4ddd6);
    border-radius: 8px;
    padding: 1.5rem;
    margin: 2rem 0;
    font-family: var(--font-sans, "Inter", sans-serif);
  }

  .explorer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .explorer-title {
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-text-subtle, #b6afa8);
  }

  .ctrl-btn {
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

  .ctrl-btn:hover {
    background: var(--color-accent-light, #f6f1ec);
  }

  /* Token stream */
  .token-stream {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    padding: 1rem;
    background: var(--color-accent-light, #f6f1ec);
    border-radius: 6px;
    margin-bottom: 0.75rem;
    min-height: 3rem;
  }

  .token {
    font-family: var(--font-mono, "JetBrains Mono", monospace);
    font-size: 0.8rem;
    padding: 0.15rem 0.4rem;
    border-radius: 3px;
    color: var(--color-text-subtle, #b6afa8);
    cursor: pointer;
    transition: all 0.25s ease;
    border: 1px solid transparent;
  }

  .token.processed {
    color: var(--tok-color);
    background: rgba(0, 0, 0, 0.04);
  }

  .token.current {
    color: var(--tok-color);
    background: rgba(0, 0, 0, 0.08);
    border-color: var(--tok-color);
    font-weight: 600;
    transform: scale(1.08);
  }

  .legend {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }

  .leg-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.65rem;
    color: var(--color-text-subtle, #b6afa8);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .leg-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  /* Probability bars */
  .prob-section {
    margin-top: 0.5rem;
  }

  .prob-label-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .prob-label {
    font-family: var(--font-mono, "JetBrains Mono", monospace);
    font-size: 0.75rem;
    color: var(--color-text-muted, #5f5b57);
  }

  .prob-step {
    font-family: var(--font-mono, "JetBrains Mono", monospace);
    font-size: 0.7rem;
    color: var(--color-text-subtle, #b6afa8);
  }

  .prob-bars {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .prob-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .prob-name {
    font-family: var(--font-mono, "JetBrains Mono", monospace);
    font-size: 0.75rem;
    font-weight: 600;
    width: 45px;
    text-align: right;
    flex-shrink: 0;
  }

  .prob-name.walk {
    color: #ef4444;
  }
  .prob-name.drive {
    color: #22c55e;
  }

  .prob-track {
    flex: 1;
    height: 22px;
    background: var(--color-accent-light, #f6f1ec);
    border-radius: 4px;
    overflow: hidden;
  }

  .prob-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .walk-fill {
    background: linear-gradient(90deg, #ef4444, #f87171);
  }

  .drive-fill {
    background: linear-gradient(90deg, #22c55e, #4ade80);
  }

  .prob-val {
    font-family: var(--font-mono, "JetBrains Mono", monospace);
    font-size: 0.75rem;
    font-weight: 600;
    width: 35px;
    color: var(--color-text, #1a1816);
  }

  /* Annotations */
  .annotation {
    margin-top: 1rem;
    padding: 0.75rem 1rem;
    border-radius: 0 6px 6px 0;
    font-size: 0.82rem;
    line-height: 1.5;
    color: var(--color-text, #1a1816);
    animation: fadeIn 0.4s ease;
  }

  .distance-note {
    background: rgba(239, 68, 68, 0.06);
    border-left: 3px solid #ef4444;
  }

  .final-note {
    background: rgba(139, 115, 85, 0.06);
    border-left: 3px solid var(--color-text-subtle, #b6afa8);
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
    .explorer {
      background: #22201d;
      border-color: #33302c;
    }

    .ctrl-btn {
      border-color: #33302c;
      color: #b6afa8;
    }

    .ctrl-btn:hover {
      background: #2c2825;
    }

    .token-stream {
      background: #2c2825;
    }

    .token.processed {
      background: rgba(255, 255, 255, 0.04);
    }

    .token.current {
      background: rgba(255, 255, 255, 0.08);
    }

    .prob-track {
      background: #2c2825;
    }

    .prob-val {
      color: #e8e4e0;
    }

    .annotation {
      color: #e8e4e0;
    }

    .distance-note {
      background: rgba(239, 68, 68, 0.08);
    }

    .final-note {
      background: rgba(139, 115, 85, 0.08);
    }
  }
</style>
