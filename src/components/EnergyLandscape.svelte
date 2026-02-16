<script lang="ts">
  import { onMount } from "svelte";

  let ballX = 10; // 0-100 position along the landscape
  let animating = false;
  let mode: "default" | "cot" = "default";
  let phase: "rolling" | "settled" | "reshaped" = "rolling";
  let animFrame: number;

  // Energy landscape: array of [x, y] pairs defining the curve
  // y = energy (lower = more attractive)
  // Default landscape: deep well at ~70 (surface pattern), shallow well at ~35 (causal)
  function defaultLandscape(x: number): number {
    // Shallow causal well around x=30
    const causal = 8 * Math.exp(-((x - 30) ** 2) / 40);
    // Deep surface well around x=72
    const surface = 20 * Math.exp(-((x - 72) ** 2) / 60);
    // General slope pushing right
    const slope = -0.06 * x;
    // Base curve
    const base = 50 + slope - surface - causal + 0.004 * (x - 50) ** 2;
    return base;
  }

  // CoT landscape: walls raised around surface, causal well deepened
  function cotLandscape(x: number): number {
    // Deepened causal well around x=30
    const causal = 18 * Math.exp(-((x - 30) ** 2) / 50);
    // Shallower surface well around x=72
    const surface = 8 * Math.exp(-((x - 72) ** 2) / 40);
    // Barrier raised between wells
    const barrier = 6 * Math.exp(-((x - 52) ** 2) / 20);
    const slope = -0.03 * x;
    const base =
      50 + slope - surface - causal + barrier + 0.004 * (x - 50) ** 2;
    return base;
  }

  $: landscape = mode === "cot" ? cotLandscape : defaultLandscape;

  // Generate SVG path from landscape function
  function pathFromLandscape(fn: (x: number) => number): string {
    const points: string[] = [];
    for (let x = 0; x <= 100; x += 0.5) {
      const y = fn(x);
      const svgX = 20 + x * 3.6; // map [0,100] to [20, 380]
      const svgY = y * 1.8; // scale vertically
      points.push(`${svgX},${svgY}`);
    }
    return "M" + points.join(" L");
  }

  $: pathD = pathFromLandscape(landscape);

  // Ball position on the curve
  $: ballSvgX = 20 + ballX * 3.6;
  $: ballSvgY = landscape(ballX) * 1.8;

  function simulate(targetMode: "default" | "cot") {
    mode = targetMode;
    ballX = 10;
    phase = "rolling";
    animating = true;

    let velocity = 0;
    const friction = 0.96;
    const gravity = 0.15;

    function step() {
      if (!animating) return;

      // Compute gradient (force = -dE/dx)
      const dx = 0.5;
      const gradient =
        (landscape(ballX + dx) - landscape(ballX - dx)) / (2 * dx);
      const force = -gradient * gravity;

      velocity = (velocity + force) * friction;
      ballX += velocity;

      // Clamp
      if (ballX < 2) {
        ballX = 2;
        velocity = Math.abs(velocity) * 0.3;
      }
      if (ballX > 98) {
        ballX = 98;
        velocity = -Math.abs(velocity) * 0.3;
      }

      // Check if settled
      if (Math.abs(velocity) < 0.02 && Math.abs(force) < 0.01) {
        animating = false;
        phase = "settled";
        return;
      }

      animFrame = requestAnimationFrame(step);
    }

    animFrame = requestAnimationFrame(step);
  }

  onMount(() => {
    const timeout = setTimeout(() => simulate("default"), 800);
    return () => {
      clearTimeout(timeout);
      animating = false;
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  });

  // Determine which well the ball settled in
  $: settledIn = ballX < 50 ? "causal" : "surface";
</script>

<div class="energy-container">
  <div class="energy-header">
    <span class="energy-title">energy landscape of pattern activation</span>
  </div>

  <div class="mode-toggle">
    <button
      class="mode-btn"
      class:active={mode === "default"}
      on:click={() => simulate("default")}
    >
      direct prompt
    </button>
    <button
      class="mode-btn"
      class:active={mode === "cot"}
      on:click={() => simulate("cot")}
    >
      chain-of-thought
    </button>
  </div>

  <div class="landscape-wrap">
    <svg viewBox="0 0 400 120" class="landscape-svg">
      <!-- Landscape fill -->
      <path
        d="{pathD} L380,120 L20,120 Z"
        fill="var(--land-fill, rgba(0,0,0,0.04))"
      />
      <!-- Landscape line -->
      <path
        d={pathD}
        fill="none"
        stroke="var(--land-stroke, #b6afa8)"
        stroke-width="2"
      />

      <!-- Well labels -->
      <text
        x={20 + 30 * 3.6}
        y="115"
        class="well-label causal-label"
        text-anchor="middle"
      >
        causal pattern
      </text>
      <text
        x={20 + 72 * 3.6}
        y="115"
        class="well-label surface-label"
        text-anchor="middle"
      >
        surface pattern
      </text>

      <!-- Depth indicators -->
      {#if mode === "default"}
        <text
          x={20 + 30 * 3.6}
          y={cotLandscape(30) * 1.8 + 14}
          class="depth-label"
          text-anchor="middle">shallow</text
        >
        <text
          x={20 + 72 * 3.6}
          y={defaultLandscape(72) * 1.8 + 14}
          class="depth-label"
          text-anchor="middle">deep</text
        >
      {:else}
        <text
          x={20 + 30 * 3.6}
          y={cotLandscape(30) * 1.8 + 14}
          class="depth-label"
          text-anchor="middle">deepened</text
        >
        <text
          x={20 + 72 * 3.6}
          y={cotLandscape(72) * 1.8 + 14}
          class="depth-label"
          text-anchor="middle">raised</text
        >
      {/if}

      <!-- Ball -->
      <circle
        cx={ballSvgX}
        cy={ballSvgY - 5}
        r="6"
        class="ball"
        class:settled={phase === "settled"}
        class:correct={phase === "settled" && settledIn === "causal"}
        class:wrong={phase === "settled" && settledIn === "surface"}
      />

      <!-- h_t label -->
      <text
        x={ballSvgX}
        y={ballSvgY - 16}
        class="ball-label"
        text-anchor="middle">h_t</text
      >
    </svg>
  </div>

  {#if phase === "settled"}
    <div
      class="settle-result"
      class:correct-result={settledIn === "causal"}
      class:wrong-result={settledIn === "surface"}
    >
      {#if settledIn === "surface"}
        h<sub>t</sub> fell into the <strong>surface pattern well</strong> (50m →
        walk). the causal well exists but wasn't deep enough to capture the trajectory.
      {:else}
        CoT tokens <strong>reshaped the landscape</strong> — deepened the causal
        well, raised the surface barriers. h<sub>t</sub> now settles into the
        <strong>causal pattern</strong> (car must be present → drive). ✓
      {/if}
    </div>
  {/if}
</div>

<style>
  .energy-container {
    background: var(--color-surface, #fffdfa);
    border: 1px solid var(--color-border, #e4ddd6);
    border-radius: 8px;
    padding: 1.5rem;
    margin: 2rem 0;
    font-family: var(--font-sans, "Inter", sans-serif);
    --land-fill: rgba(0, 0, 0, 0.03);
    --land-stroke: #c4bdb5;
  }

  .energy-header {
    margin-bottom: 1rem;
  }

  .energy-title {
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-text-subtle, #b6afa8);
  }

  .mode-toggle {
    display: flex;
    gap: 0;
    margin-bottom: 1rem;
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

  .landscape-wrap {
    margin-bottom: 0.5rem;
  }

  .landscape-svg {
    width: 100%;
    height: auto;
  }

  .well-label {
    font-size: 7px;
    font-weight: 500;
    fill: var(--color-text-subtle, #b6afa8);
    font-family: var(--font-mono, "JetBrains Mono", monospace);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .depth-label {
    font-size: 6px;
    fill: var(--color-text-subtle, #b6afa8);
    font-family: var(--font-mono, "JetBrains Mono", monospace);
    font-style: italic;
  }

  .ball {
    fill: #3b82f6;
    stroke: #2563eb;
    stroke-width: 1.5;
    transition:
      fill 0.3s ease,
      stroke 0.3s ease;
  }

  .ball.settled.correct {
    fill: #22c55e;
    stroke: #16a34a;
  }

  .ball.settled.wrong {
    fill: #ef4444;
    stroke: #dc2626;
  }

  .ball-label {
    font-size: 7px;
    font-weight: 600;
    fill: var(--color-text-muted, #5f5b57);
    font-family: var(--font-mono, "JetBrains Mono", monospace);
  }

  .settle-result {
    padding: 0.75rem 1rem;
    border-radius: 0 6px 6px 0;
    font-size: 0.82rem;
    line-height: 1.5;
    color: var(--color-text, #1a1816);
    animation: fadeIn 0.5s ease;
  }

  .wrong-result {
    background: rgba(239, 68, 68, 0.06);
    border-left: 3px solid #ef4444;
  }

  .correct-result {
    background: rgba(34, 197, 94, 0.06);
    border-left: 3px solid #22c55e;
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
    .energy-container {
      background: #22201d;
      border-color: #33302c;
      --land-fill: rgba(255, 255, 255, 0.03);
      --land-stroke: #45403c;
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

    .ball-label {
      fill: #b6afa8;
    }

    .settle-result {
      color: #e8e4e0;
    }

    .wrong-result {
      background: rgba(239, 68, 68, 0.08);
    }

    .correct-result {
      background: rgba(34, 197, 94, 0.08);
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
