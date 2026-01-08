<script lang="ts">
    import { onMount } from "svelte";

    let step = 0;
    let variableValue = "?";
    let signalPhase = 0;

    onMount(() => {
        // Auto-animate on loop
        const interval = setInterval(() => {
            step = (step + 1) % 5;

            // Software side
            if (step === 1) variableValue = "5";
            else if (step === 2) variableValue = "8";
            else if (step === 3) variableValue = "16";
            else if (step === 0) variableValue = "?";

            // Hardware side
            signalPhase = step;
        }, 1000);

        return () => clearInterval(interval);
    });
</script>

<div class="explainer">
    <div class="side software">
        <div class="label">software</div>
        <div class="content">
            <div class="code">
                <div class="line" class:active={step === 1}>x = 5</div>
                <div class="line" class:active={step === 2}>x = x + 3</div>
                <div class="line" class:active={step === 3}>x = x * 2</div>
            </div>
            <div class="variable">
                <span class="var-name">x</span>
                <span class="var-value">{variableValue}</span>
            </div>
            <p class="note">one location, overwritten</p>
        </div>
    </div>

    <div class="divider"></div>

    <div class="side hardware">
        <div class="label">hardware</div>
        <div class="content">
            <svg viewBox="0 0 200 100" class="circuit">
                <!-- Input nodes -->
                <circle
                    cx="20"
                    cy="30"
                    r="8"
                    class="node"
                    class:active={signalPhase >= 1}
                />
                <circle
                    cx="20"
                    cy="70"
                    r="8"
                    class="node"
                    class:active={signalPhase >= 1}
                />

                <!-- Wires to gate -->
                <line
                    x1="28"
                    y1="30"
                    x2="70"
                    y2="42"
                    class="wire"
                    class:active={signalPhase >= 2}
                />
                <line
                    x1="28"
                    y1="70"
                    x2="70"
                    y2="58"
                    class="wire"
                    class:active={signalPhase >= 2}
                />

                <!-- Gate -->
                <rect
                    x="70"
                    y="35"
                    width="40"
                    height="30"
                    rx="4"
                    class="gate"
                    class:active={signalPhase >= 3}
                />
                <text x="90" y="54" class="gate-text">AND</text>

                <!-- Output wire -->
                <line
                    x1="110"
                    y1="50"
                    x2="160"
                    y2="50"
                    class="wire"
                    class:active={signalPhase >= 4}
                />

                <!-- Output node -->
                <circle
                    cx="175"
                    cy="50"
                    r="8"
                    class="node output"
                    class:active={signalPhase >= 4}
                />
            </svg>
            <p class="note">all paths exist, signals flow</p>
        </div>
    </div>
</div>

<style>
    .explainer {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        gap: 1rem;
        padding: 1.5rem;
        background: var(--color-surface, #fffdfa);
        border: 1px solid var(--color-border, #e4ddd6);
        border-radius: 8px;
        margin: 1.5rem 0;
        font-family: var(--font-sans, "Inter", sans-serif);
    }

    @media (max-width: 540px) {
        .explainer {
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }
        .divider {
            width: 100%;
            height: 1px;
        }
    }

    .side {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .label {
        font-size: 0.7rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--color-text-subtle, #b6afa8);
        margin-bottom: 0.75rem;
    }

    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .divider {
        width: 1px;
        background: var(--color-border, #e4ddd6);
    }

    /* Software side */
    .code {
        font-family: var(--font-mono, "JetBrains Mono", monospace);
        font-size: 0.8rem;
        margin-bottom: 0.75rem;
    }

    .line {
        padding: 0.2rem 0.5rem;
        border-radius: 3px;
        color: var(--color-text-muted, #5f5b57);
        transition: all 0.3s ease;
    }

    .line.active {
        background: rgba(59, 130, 246, 0.12);
        color: #3b82f6;
    }

    .variable {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border: 1px dashed var(--color-border, #e4ddd6);
        border-radius: 4px;
        margin-bottom: 0.5rem;
    }

    .var-name {
        font-family: var(--font-mono, "JetBrains Mono", monospace);
        font-size: 0.75rem;
        color: var(--color-text-subtle, #b6afa8);
    }

    .var-value {
        font-family: var(--font-mono, "JetBrains Mono", monospace);
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--color-text, #1a1816);
        min-width: 2rem;
        text-align: center;
        transition: all 0.3s ease;
    }

    /* Hardware side */
    .circuit {
        width: 100%;
        max-width: 180px;
        height: auto;
        margin-bottom: 0.5rem;
    }

    .node {
        fill: var(--color-surface, #fffdfa);
        stroke: var(--color-border, #e4ddd6);
        stroke-width: 1.5;
        transition: all 0.3s ease;
    }

    .node.active {
        fill: #dcfce7;
        stroke: #22c55e;
    }

    .node.output.active {
        fill: #fef3c7;
        stroke: #f59e0b;
    }

    .wire {
        stroke: var(--color-border, #e4ddd6);
        stroke-width: 2;
        stroke-linecap: round;
        transition: all 0.3s ease;
    }

    .wire.active {
        stroke: #3b82f6;
    }

    .gate {
        fill: var(--color-surface, #fffdfa);
        stroke: var(--color-border, #e4ddd6);
        stroke-width: 1.5;
        transition: all 0.3s ease;
    }

    .gate.active {
        fill: #ede9fe;
        stroke: #8b5cf6;
    }

    .gate-text {
        font-size: 8px;
        font-weight: 500;
        fill: var(--color-text-muted, #5f5b57);
        text-anchor: middle;
    }

    .note {
        font-size: 0.75rem;
        color: var(--color-text-subtle, #b6afa8);
        margin: 0;
        text-align: center;
    }

    /* Dark mode */
    @media (prefers-color-scheme: dark) {
        .explainer {
            background: #22201d;
            border-color: #33302c;
        }

        .label {
            color: #6e6a66;
        }

        .line {
            color: #b6afa8;
        }

        .line.active {
            color: #60a5fa;
        }

        .variable {
            border-color: #33302c;
        }

        .var-name {
            color: #6e6a66;
        }

        .var-value {
            color: #e8e4e0;
        }

        .note {
            color: #6e6a66;
        }

        .node,
        .gate {
            fill: #1a1816;
            stroke: #45403c;
        }

        .wire {
            stroke: #45403c;
        }

        .gate-text {
            fill: #b6afa8;
        }
    }
</style>
