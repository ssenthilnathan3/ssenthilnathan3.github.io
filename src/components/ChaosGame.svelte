<script>
    import { onMount } from "svelte";

    // === PLAYER STATE ===
    let playerX = 200;
    let playerVelocity = 0;
    let playerFlipped = false;
    let playerState = "idle";
    let playerHealth = 100;
    let playerLastAttack = 0;
    let playerAttacking = false;

    // === VILLAIN STATE ===
    let villainX = 600;
    let villainVelocity = 0;
    let villainFlipped = true;
    let villainState = "idle";
    let villainHealth = 100;
    let villainLastAttack = 0;
    let villainAttacking = false;

    // === SYSTEM ===
    let keys = { left: false, right: false };
    let width = 800;
    let height = 600;
    let gameLoopFrame;
    let mounted = false;
    let gameOver = false;
    let winner = "";
    let paused = true;

    // === CONFIG ===
    const FRICTION = 0.88;
    const ACCEL = 1.0;
    const ATTACK_COOLDOWN = 600;
    const ATTACK_RANGE = 140;
    const ATTACK_DAMAGE = 12;
    const VILLAIN_SPEED = 2.5;
    const VILLAIN_ATTACK_RANGE = 130;

    const PLAYER_SPRITES = {
        idle: "/sprites/Idle.png",
        run: "/sprites/Run.png",
        attack: "/sprites/Attack_2.png",
    };

    const VILLAIN_SPRITES = {
        idle: "/sprites/Idle_Villain.png",
        run: "/sprites/Run_Villain.png",
        attack: "/sprites/Attack_Villain.png",
    };

    // === GAME LOOP ===
    function gameLoop() {
        if (!mounted) return;
        if (gameOver || paused) {
            gameLoopFrame = requestAnimationFrame(gameLoop);
            return;
        }

        // --- PLAYER MOVEMENT ---
        if (keys.left) {
            playerVelocity -= ACCEL;
            playerFlipped = true;
        }
        if (keys.right) {
            playerVelocity += ACCEL;
            playerFlipped = false;
        }
        playerVelocity *= FRICTION;
        playerX += playerVelocity;

        // Bounds
        playerX = Math.max(80, Math.min(width - 80, playerX));

        // Player animation state
        if (!playerAttacking) {
            playerState = Math.abs(playerVelocity) > 0.3 ? "run" : "idle";
        }
        if (playerAttacking && Date.now() - playerLastAttack > 350) {
            playerAttacking = false;
        }

        // --- VILLAIN AI ---
        const distToPlayer = playerX - villainX;
        const absDistance = Math.abs(distToPlayer);

        // Always face player
        villainFlipped = distToPlayer < 0;

        if (!villainAttacking) {
            if (absDistance > VILLAIN_ATTACK_RANGE) {
                // Chase player
                const chaseDir = distToPlayer > 0 ? 1 : -1;
                villainVelocity += chaseDir * 0.4;
                villainState = "run";
            } else {
                // In range - try to attack
                villainVelocity *= 0.5; // Slow down
                const now = Date.now();
                if (now - villainLastAttack > ATTACK_COOLDOWN + 300) {
                    villainDoAttack();
                } else {
                    villainState = "idle";
                }
            }
        }

        // Apply villain physics
        villainVelocity *= FRICTION;
        villainVelocity = Math.max(
            -VILLAIN_SPEED,
            Math.min(VILLAIN_SPEED, villainVelocity),
        );
        villainX += villainVelocity;
        villainX = Math.max(80, Math.min(width - 80, villainX));

        // Reset villain attack state
        if (villainAttacking && Date.now() - villainLastAttack > 450) {
            villainAttacking = false;
        }

        // --- CHECK WIN/LOSE ---
        if (playerHealth <= 0) {
            gameOver = true;
            winner = "VILLAIN WINS!";
            playGameOverSound(false);
        } else if (villainHealth <= 0) {
            gameOver = true;
            winner = "YOU WIN!";
            playGameOverSound(true);
        }

        gameLoopFrame = requestAnimationFrame(gameLoop);
    }

    // === PLAYER ATTACK ===
    function playerDoAttack() {
        const now = Date.now();
        if (now - playerLastAttack < ATTACK_COOLDOWN || playerAttacking) return;

        playerLastAttack = now;
        playerAttacking = true;
        playerState = "attack";
        playPunchSound();

        // Check if villain in range and facing them
        const dist = Math.abs(playerX - villainX);
        const facingVillain =
            (playerFlipped && villainX < playerX) ||
            (!playerFlipped && villainX > playerX);

        if (dist < ATTACK_RANGE && facingVillain) {
            setTimeout(() => {
                if (mounted && !gameOver) {
                    villainHealth = Math.max(0, villainHealth - ATTACK_DAMAGE);
                    playHitSound();
                }
            }, 150);
        }
    }

    // === VILLAIN ATTACK ===
    function villainDoAttack() {
        villainLastAttack = Date.now();
        villainAttacking = true;
        villainState = "attack";
        playPunchSound();

        // Check if player in range
        const dist = Math.abs(playerX - villainX);
        if (dist < VILLAIN_ATTACK_RANGE + 30) {
            setTimeout(() => {
                if (mounted && !gameOver) {
                    playerHealth = Math.max(0, playerHealth - ATTACK_DAMAGE);
                    playHitSound();
                }
            }, 200);
        }
    }

    // === INPUT ===
    function handleKeyDown(e) {
        // Pause toggle
        if (e.key === "Escape" || e.key === "p" || e.key === "P") {
            if (!gameOver) togglePause();
            return;
        }

        if (gameOver) {
            if (e.key === " " || e.key === "Enter") restartGame();
            return;
        }
        if (paused) return;

        if (e.key === "ArrowLeft" || e.key === "a") keys.left = true;
        if (e.key === "ArrowRight" || e.key === "d") keys.right = true;
        if (e.key === " " || e.key === "Enter") playerDoAttack();
    }

    function togglePause() {
        paused = !paused;
        if (paused) {
            keys.left = false;
            keys.right = false;
        }
    }

    function handleKeyUp(e) {
        if (e.key === "ArrowLeft" || e.key === "a") keys.left = false;
        if (e.key === "ArrowRight" || e.key === "d") keys.right = false;
    }

    function restartGame() {
        playerX = 200;
        villainX = width - 200;
        playerHealth = 100;
        villainHealth = 100;
        playerState = "idle";
        villainState = "idle";
        playerAttacking = false;
        villainAttacking = false;
        playerVelocity = 0;
        villainVelocity = 0;
        gameOver = false;
        winner = "";
        playStartSound();
    }

    // === SOUNDS ===
    function playPunchSound() {
        // Whoosh sound
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        const ctx = new AC();

        // Noise burst for punch whoosh
        const bufferSize = ctx.sampleRate * 0.08;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 800;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
    }

    function playHitSound() {
        // Impact sound
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        const ctx = new AC();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "square";
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    }

    function playStartSound() {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        const ctx = new AC();

        [200, 300, 400].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.1);
            gain.gain.linearRampToValueAtTime(
                0.1,
                ctx.currentTime + i * 0.1 + 0.05,
            );
            gain.gain.linearRampToValueAtTime(
                0,
                ctx.currentTime + i * 0.1 + 0.15,
            );
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + i * 0.1);
            osc.stop(ctx.currentTime + i * 0.1 + 0.2);
        });
    }

    function playGameOverSound(won) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        const ctx = new AC();

        const freqs = won ? [400, 500, 600, 800] : [400, 300, 200, 100];
        freqs.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = won ? "sine" : "sawtooth";
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.15);
            gain.gain.exponentialRampToValueAtTime(
                0.01,
                ctx.currentTime + i * 0.15 + 0.3,
            );
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + i * 0.15);
            osc.stop(ctx.currentTime + i * 0.15 + 0.35);
        });
    }

    onMount(() => {
        width = window.innerWidth;
        height = window.innerHeight;
        playerX = 200;
        villainX = width - 200;
        mounted = true;
        gameLoopFrame = requestAnimationFrame(gameLoop);
        playStartSound();

        return () => {
            mounted = false;
            cancelAnimationFrame(gameLoopFrame);
        };
    });
</script>

<svelte:window
    bind:innerWidth={width}
    bind:innerHeight={height}
    on:keydown={handleKeyDown}
    on:keyup={handleKeyUp}
/>

<div class="game-layer">
    <!-- HUD -->
    <div class="hud">
        <div class="health-bar player-health">
            <span class="label">YOU</span>
            <div class="bar">
                <div
                    class="fill player-fill"
                    style="width: {playerHealth}%;"
                ></div>
            </div>
        </div>

        <div class="hud-center">
            <button
                class="pause-btn"
                on:click={togglePause}
                aria-label="Pause game"
            >
                {paused ? "Play" : "Pause"}
            </button>
            {#if paused}
                <span class="paused-text">PAUSED</span>
            {:else}
                <span class="controls">← → MOVE • SPACE ATTACK</span>
            {/if}
        </div>

        <div class="health-bar villain-health">
            <span class="label">ENEMY</span>
            <div class="bar">
                <div
                    class="fill villain-fill"
                    style="width: {villainHealth}%;"
                ></div>
            </div>
        </div>
    </div>

    <!-- PLAYER -->
    <div
        class="character"
        class:hit={playerAttacking}
        style="left: {playerX}px; transform: scaleX({playerFlipped ? -1 : 1});"
    >
        <div
            class="sprite player-{playerState}"
            style="background-image: url('{PLAYER_SPRITES[playerState]}');"
        ></div>
    </div>

    <!-- VILLAIN -->
    <div
        class="character"
        class:hit={villainAttacking}
        style="left: {villainX}px; transform: scaleX({villainFlipped
            ? -1
            : 1});"
    >
        <div
            class="sprite villain-{villainState}"
            style="background-image: url('{VILLAIN_SPRITES[villainState]}');"
        ></div>
    </div>

    <!-- GROUND -->
    <div class="ground"></div>

    <!-- GAME OVER -->
    {#if gameOver}
        <div class="game-over">
            <h1 class:win={winner === "YOU WIN!"}>{winner}</h1>
            <p>Press SPACE to restart</p>
        </div>
    {/if}
</div>

<style>
    /* HUD */
    .hud {
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        z-index: 20;
        gap: 20px;
        font-family: "Courier New", monospace;
        pointer-events: none;
    }

    .health-bar {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
    }

    .label {
        font-size: 0.7rem;
        color: #fff;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
        font-weight: bold;
    }

    .bar {
        width: 140px;
        height: 14px;
        background: rgba(0, 0, 0, 0.6);
        border: 2px solid rgba(255, 255, 255, 0.4);
        border-radius: 7px;
        overflow: hidden;
    }

    .fill {
        height: 100%;
        transition: width 0.15s ease-out;
        border-radius: 5px;
    }

    .player-fill {
        background: linear-gradient(to bottom, #4ade80, #22c55e);
        box-shadow: 0 0 8px rgba(74, 222, 128, 0.5);
    }

    .villain-fill {
        background: linear-gradient(to bottom, #f87171, #ef4444);
        box-shadow: 0 0 8px rgba(248, 113, 113, 0.5);
    }

    .hud-center {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
    }

    .pause-btn {
        width: 32px;
        height: 32px;
        background: rgba(0, 0, 0, 0.5);
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        color: #fff;
        font-size: 0.9rem;
        cursor: pointer;
        pointer-events: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
    }

    .pause-btn:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.5);
        transform: scale(1.1);
    }

    .paused-text {
        font-size: 0.8rem;
        color: #fbbf24;
        font-weight: bold;
        text-shadow: 0 0 10px rgba(251, 191, 36, 0.6);
        animation: blink 1s ease-in-out infinite;
    }

    @keyframes blink {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }

    .controls {
        font-size: 0.6rem;
        color: rgba(255, 255, 255, 0.6);
        white-space: nowrap;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    }

    /* CHARACTERS */
    .character {
        position: absolute;
        bottom: 50px;
        width: 128px;
        height: 128px;
        margin-left: -64px;
        transform-origin: bottom center;
        transition: filter 0.1s;
    }

    .character.hit {
        filter: brightness(1.3);
    }

    .sprite {
        width: 128px;
        height: 128px;
        background-repeat: no-repeat;
        background-position: 0 0;
        image-rendering: pixelated;
        transform: scale(2);
        transform-origin: bottom center;
    }

    /* PLAYER ANIMATIONS - 7/10/4 frames */
    .player-idle {
        animation: anim-player-idle 0.7s steps(7) infinite;
    }
    .player-run {
        animation: anim-player-run 0.8s steps(10) infinite;
    }
    .player-attack {
        animation: anim-player-attack 0.35s steps(4) forwards;
    }

    @keyframes anim-player-idle {
        from {
            background-position: 0 0;
        }
        to {
            background-position: -896px 0;
        }
    }
    @keyframes anim-player-run {
        from {
            background-position: 0 0;
        }
        to {
            background-position: -1280px 0;
        }
    }
    @keyframes anim-player-attack {
        from {
            background-position: 0 0;
        }
        to {
            background-position: -512px 0;
        }
    }

    /* VILLAIN ANIMATIONS - 7/10/5 frames */
    .villain-idle {
        animation: anim-villain-idle 0.7s steps(7) infinite;
    }
    .villain-run {
        animation: anim-villain-run 0.8s steps(10) infinite;
    }
    .villain-attack {
        animation: anim-villain-attack 0.4s steps(5) forwards;
    }

    @keyframes anim-villain-idle {
        from {
            background-position: 0 0;
        }
        to {
            background-position: -896px 0;
        }
    }
    @keyframes anim-villain-run {
        from {
            background-position: 0 0;
        }
        to {
            background-position: -1280px 0;
        }
    }
    @keyframes anim-villain-attack {
        from {
            background-position: 0 0;
        }
        to {
            background-position: -640px 0;
        }
    }

    /* GROUND */
    .ground {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 50px;
        background: linear-gradient(to bottom, #1a1a1a, #0a0a0a);
        border-top: 3px solid #333;
    }

    /* GAME OVER */
    .game-over {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.8);
        color: #fff;
        font-family: "Courier New", monospace;
        pointer-events: auto;
    }

    .game-over h1 {
        font-size: 3rem;
        margin: 0 0 1rem;
        text-shadow: 0 0 30px rgba(255, 107, 107, 0.8);
        color: #f87171;
    }

    .game-over h1.win {
        color: #4ade80;
        text-shadow: 0 0 30px rgba(74, 222, 128, 0.8);
    }

    .game-over p {
        font-size: 1rem;
        opacity: 0.7;
        animation: pulse 1s ease-in-out infinite;
    }

    @keyframes pulse {
        0%,
        100% {
            opacity: 0.5;
        }
        50% {
            opacity: 1;
        }
    }
</style>
