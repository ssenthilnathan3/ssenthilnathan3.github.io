// ===== LATENT STATE EXPLORER =====
(function () {
  var el = document.getElementById("latent-explorer");
  if (!el) return;

  var tokens = [
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
  var probCurve = [
    [0.5, 0.5],
    [0.5, 0.5],
    [0.5, 0.5],
    [0.45, 0.35],
    [0.45, 0.35],
    [0.42, 0.4],
    [0.42, 0.4],
    [0.42, 0.4],
    [0.43, 0.39],
    [0.4, 0.38],
    [0.4, 0.38],
    [0.6, 0.25],
    [0.68, 0.2],
    [0.72, 0.18],
    [0.72, 0.18],
    [0.72, 0.18],
    [0.72, 0.18],
    [0.73, 0.22],
    [0.73, 0.22],
    [0.73, 0.22],
    [0.73, 0.22],
  ];
  var tokenColors = {
    goal: "#22c55e",
    object: "#3b82f6",
    location: "#f59e0b",
    distance: "#ef4444",
    choice: "#8b5cf6",
    neutral: "var(--color-text-muted,#5f5b57)",
  };
  var currentIndex = -1,
    pWalk = 0.5,
    pDrive = 0.5,
    playing = false,
    done = false,
    timer;

  function render() {
    var stream = el.querySelector(".token-stream");
    var stepEl = el.querySelector(".prob-step");
    var walkFill = el.querySelector(".walk-fill");
    var driveFill = el.querySelector(".drive-fill");
    var walkVal = el.querySelector(".walk-val");
    var driveVal = el.querySelector(".drive-val");
    var btn = el.querySelector(".ctrl-btn");
    var distNote = el.querySelector(".distance-note");
    var finalNote = el.querySelector(".final-note");

    if (stream) {
      stream.querySelectorAll(".token").forEach(function (t, i) {
        t.classList.toggle("processed", i <= currentIndex);
        t.classList.toggle("current", i === currentIndex);
      });
    }
    if (stepEl)
      stepEl.textContent =
        currentIndex >= 0 ? "t = " + (currentIndex + 1) : "waiting...";
    if (walkFill) walkFill.style.width = pWalk * 100 + "%";
    if (driveFill) driveFill.style.width = pDrive * 100 + "%";
    if (walkVal) walkVal.textContent = Math.round(pWalk * 100) + "%";
    if (driveVal) driveVal.textContent = Math.round(pDrive * 100) + "%";
    if (btn) btn.textContent = done ? "↻ replay" : playing ? "⏸" : "▶";
    if (distNote)
      distNote.style.display =
        currentIndex >= 11 && currentIndex <= 13 ? "" : "none";
    if (finalNote) finalNote.style.display = done ? "" : "none";
  }

  function start() {
    clearInterval(timer);
    currentIndex = -1;
    pWalk = 0.5;
    pDrive = 0.5;
    done = false;
    playing = true;
    render();
    timer = setInterval(function () {
      currentIndex++;
      if (currentIndex >= tokens.length) {
        clearInterval(timer);
        playing = false;
        done = true;
        render();
        return;
      }
      pWalk = probCurve[currentIndex][0];
      pDrive = probCurve[currentIndex][1];
      render();
    }, 350);
  }

  // Build HTML
  var stream = el.querySelector(".token-stream");
  if (stream) {
    tokens.forEach(function (tok, i) {
      var btn = document.createElement("button");
      btn.className = "token";
      btn.textContent = tok.text;
      btn.style.setProperty(
        "--tok-color",
        tokenColors[tok.type] || tokenColors.neutral,
      );
      btn.addEventListener("click", function () {
        clearInterval(timer);
        playing = false;
        currentIndex = i;
        pWalk = probCurve[i][0];
        pDrive = probCurve[i][1];
        done = i === tokens.length - 1;
        render();
      });
      stream.appendChild(btn);
    });
  }
  el.querySelector(".ctrl-btn").addEventListener("click", start);
  render();
  setTimeout(start, 600);
})();

// ===== CHAIN OF THOUGHT =====
(function () {
  var el = document.getElementById("cot-widget");
  if (!el) return;

  var directSteps = [
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
  var cotSteps = [
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

  var mode = "direct",
    step = 0,
    timer;

  function steps() {
    return mode === "direct" ? directSteps : cotSteps;
  }
  function cur() {
    return steps()[Math.min(step, steps().length - 1)];
  }

  function render() {
    var s = cur();
    el.querySelector(".step-text").textContent = s.tokens;
    var tags = el.querySelector(".ht-tags");
    tags.innerHTML = "";
    s.ht.forEach(function (t) {
      var span = document.createElement("span");
      span.className =
        "ht-tag" +
        (t === "car_must_be_present" || t === "transport_car"
          ? " causal"
          : t === "50m"
            ? " distance"
            : "");
      span.textContent = t;
      tags.appendChild(span);
    });
    el.querySelector(".walk-bar").style.width = s.pWalk * 100 + "%";
    el.querySelector(".drive-bar").style.width = s.pDrive * 100 + "%";
    el.querySelector(".walk-pct").textContent = Math.round(s.pWalk * 100) + "%";
    el.querySelector(".drive-pct").textContent =
      Math.round(s.pDrive * 100) + "%";
    el.querySelector(".step-note").textContent = s.note;
    var ob = el.querySelector(".output-bubble");
    if (s.output) {
      ob.textContent = s.output;
      ob.style.display = "";
      ob.classList.toggle("correct", s.pDrive > s.pWalk);
    } else {
      ob.style.display = "none";
    }
    el.querySelector(".step-counter").textContent =
      step + 1 + " / " + steps().length;
    el.querySelector(".prev-btn").disabled = step === 0;
    el.querySelector(".next-btn").disabled = step >= steps().length - 1;
    el.querySelectorAll(".mode-btn").forEach(function (b) {
      b.classList.toggle("active", b.dataset.mode === mode);
    });
    var insight = el.querySelector(".insight");
    insight.style.display =
      mode === "cot" && step >= steps().length - 1 ? "" : "none";
  }

  el.querySelectorAll(".mode-btn").forEach(function (b) {
    b.addEventListener("click", function () {
      clearInterval(timer);
      mode = b.dataset.mode;
      step = 0;
      render();
    });
  });
  el.querySelector(".prev-btn").addEventListener("click", function () {
    if (step > 0) {
      step--;
      render();
    }
  });
  el.querySelector(".next-btn").addEventListener("click", function () {
    if (step < steps().length - 1) {
      step++;
      render();
    }
  });
  render();
})();

// ===== ENERGY LANDSCAPE =====
(function () {
  var el = document.getElementById("energy-widget");
  if (!el) return;

  var svg = el.querySelector(".landscape-svg");
  var mode = "default",
    animating = false,
    ballX = 10,
    animFrame;

  function defaultLandscape(x) {
    var causal = 8 * Math.exp(-Math.pow(x - 30, 2) / 40);
    var surface = 20 * Math.exp(-Math.pow(x - 72, 2) / 60);
    return 50 - 0.06 * x - surface - causal + 0.004 * Math.pow(x - 50, 2);
  }
  function cotLandscape(x) {
    var causal = 18 * Math.exp(-Math.pow(x - 30, 2) / 50);
    var surface = 8 * Math.exp(-Math.pow(x - 72, 2) / 40);
    var barrier = 6 * Math.exp(-Math.pow(x - 52, 2) / 20);
    return (
      50 - 0.03 * x - surface - causal + barrier + 0.004 * Math.pow(x - 50, 2)
    );
  }
  function landscape(x) {
    return mode === "cot" ? cotLandscape(x) : defaultLandscape(x);
  }

  function pathStr() {
    var pts = [];
    for (var x = 0; x <= 100; x += 0.5)
      pts.push(20 + x * 3.6 + "," + landscape(x) * 1.8);
    return "M" + pts.join(" L");
  }

  function render(phase, settled) {
    var pathEl = svg.querySelector(".land-path");
    var fillEl = svg.querySelector(".land-fill");
    var d = pathStr();
    if (pathEl) pathEl.setAttribute("d", d);
    if (fillEl) fillEl.setAttribute("d", d + " L380,120 L20,120 Z");

    var bx = 20 + ballX * 3.6,
      by = landscape(ballX) * 1.8;
    var ball = svg.querySelector(".energy-ball");
    if (ball) {
      ball.setAttribute("cx", bx);
      ball.setAttribute("cy", by - 5);
      ball.classList.toggle("settled", phase === "settled");
      ball.classList.toggle("correct", phase === "settled" && ballX < 50);
      ball.classList.toggle("wrong", phase === "settled" && ballX >= 50);
    }
    var label = svg.querySelector(".ball-label");
    if (label) {
      label.setAttribute("x", bx);
      label.setAttribute("y", by - 16);
    }

    var depthLabels = svg.querySelectorAll(".depth-label");
    if (depthLabels[0])
      depthLabels[0].textContent = mode === "default" ? "shallow" : "deepened";
    if (depthLabels[1])
      depthLabels[1].textContent = mode === "default" ? "deep" : "raised";

    var resultEl = el.querySelector(".settle-result");
    if (resultEl) {
      if (phase === "settled") {
        resultEl.style.display = "";
        resultEl.className =
          "settle-result " + (ballX < 50 ? "correct-result" : "wrong-result");
        resultEl.innerHTML =
          ballX < 50
            ? "CoT tokens <strong>reshaped the landscape</strong> — deepened the causal well. h<sub>t</sub> settles into the <strong>causal pattern</strong> (car must be present → drive). ✓"
            : "h<sub>t</sub> fell into the <strong>surface pattern well</strong> (50m → walk). The causal well exists but wasn't deep enough.";
      } else {
        resultEl.style.display = "none";
      }
    }
    el.querySelectorAll(".mode-btn").forEach(function (b) {
      b.classList.toggle("active", b.dataset.mode === mode);
    });
  }

  function simulate(m) {
    mode = m;
    ballX = 10;
    animating = true;
    if (animFrame) cancelAnimationFrame(animFrame);
    var velocity = 0,
      friction = 0.96,
      gravity = 0.15;
    render("rolling", false);
    function step() {
      if (!animating) return;
      var dx = 0.5,
        grad = (landscape(ballX + dx) - landscape(ballX - dx)) / (2 * dx);
      velocity = (velocity + -grad * gravity) * friction;
      ballX += velocity;
      if (ballX < 2) {
        ballX = 2;
        velocity = Math.abs(velocity) * 0.3;
      }
      if (ballX > 98) {
        ballX = 98;
        velocity = -Math.abs(velocity) * 0.3;
      }
      if (Math.abs(velocity) < 0.02 && Math.abs(-grad * gravity) < 0.01) {
        animating = false;
        render("settled", true);
        return;
      }
      render("rolling", false);
      animFrame = requestAnimationFrame(step);
    }
    animFrame = requestAnimationFrame(step);
  }

  el.querySelectorAll(".mode-btn").forEach(function (b) {
    b.addEventListener("click", function () {
      simulate(b.dataset.mode);
    });
  });
  render("idle", false);
  setTimeout(function () {
    simulate("default");
  }, 800);
})();

// ===== PATTERN RACE =====
(function () {
  var el = document.getElementById("pattern-race");
  if (!el) return;

  var patterns = [
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
  var winner = "",
    showResult = false,
    running = false,
    animFrame;

  function reset() {
    patterns.forEach(function (p) {
      p.fill = 0;
    });
    winner = "";
    showResult = false;
  }

  function render() {
    var tracks = el.querySelectorAll(".track");
    tracks.forEach(function (track, i) {
      var p = patterns[i];
      track.classList.toggle("winner", winner === p.label);
      var fill = track.querySelector(".track-fill");
      var pct = track.querySelector(".track-pct");
      if (fill) fill.style.width = p.fill + "%";
      if (pct) {
        pct.textContent = Math.round(p.fill) + "%";
        pct.style.color = p.fill > 50 ? "#fff" : p.color;
      }
    });
    var resultEl = el.querySelector(".race-result");
    if (resultEl) resultEl.style.display = showResult ? "" : "none";
    if (showResult && winner) {
      var rt = el.querySelector(".result-text");
      if (rt)
        rt.innerHTML =
          '<strong>"' +
          winner +
          '"</strong> activates first.<br><span class="result-sub">The causal pattern (green) exists — but loses the race to the surface pattern.</span>';
    }
    var btn = el.querySelector(".race-btn");
    if (btn) btn.textContent = showResult ? "↻ replay" : "▶ run";
  }

  function animate() {
    if (!running) return;
    var anyDone = false;
    patterns.forEach(function (p) {
      if (p.fill < 100)
        p.fill = Math.min(100, p.fill + p.speed + (Math.random() - 0.5) * 0.8);
      if (p.fill >= 100 && !winner) {
        winner = p.label;
        anyDone = true;
      }
    });
    render();
    if (anyDone) {
      setTimeout(function () {
        running = false;
        showResult = true;
        render();
      }, 600);
      return;
    }
    if (running) animFrame = requestAnimationFrame(animate);
  }

  function start() {
    if (animFrame) cancelAnimationFrame(animFrame);
    reset();
    running = true;
    render();
    requestAnimationFrame(animate);
  }

  el.querySelector(".race-btn").addEventListener("click", start);
  render();
  setTimeout(start, 800);
})();

// ===== SYSTEM COMPARISON =====
(function () {
  var el = document.getElementById("system-comparison");
  if (!el) return;

  var stepsA = [
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
  var stepsB = [
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
  var stepA = -1,
    stepB = -1,
    timer;

  function buildPipeline(container, steps, which) {
    container.innerHTML = "";
    steps.forEach(function (s, i) {
      var div = document.createElement("div");
      div.className = "pipe-step";
      div.dataset.index = i;
      div.dataset.which = which;
      div.innerHTML =
        '<span class="pipe-icon">' +
        s.icon +
        '</span><div class="pipe-info"><span class="pipe-label">' +
        s.label +
        '</span><span class="pipe-detail">' +
        s.detail +
        "</span></div>";
      container.appendChild(div);
      if (i < steps.length - 1) {
        var arr = document.createElement("div");
        arr.className = "pipe-arrow";
        arr.dataset.index = i;
        arr.dataset.which = which;
        arr.textContent = "↓";
        container.appendChild(arr);
      }
    });
  }

  function render() {
    el.querySelectorAll(".pipe-step").forEach(function (s) {
      var idx = parseInt(s.dataset.index),
        which = s.dataset.which;
      var cur = which === "A" ? stepA : stepB;
      s.classList.toggle("active", idx <= cur);
      s.classList.toggle("current", idx === cur);
    });
    el.querySelectorAll(".pipe-arrow").forEach(function (a) {
      var idx = parseInt(a.dataset.index),
        which = a.dataset.which;
      var cur = which === "A" ? stepA : stepB;
      a.classList.toggle("active", idx + 1 <= cur);
    });
    var qbox = el.querySelector(".question-box");
    if (qbox)
      qbox.style.display =
        stepA >= stepsA.length - 1 && stepB >= stepsB.length - 1 ? "" : "none";
  }

  function runBoth() {
    clearInterval(timer);
    stepA = -1;
    stepB = -1;
    render();
    var cA = -1,
      cB = -1;
    timer = setInterval(function () {
      cA++;
      cB++;
      if (cA < stepsA.length) stepA = cA;
      if (cB < stepsB.length) stepB = cB;
      render();
      if (cA >= stepsA.length && cB >= stepsB.length) clearInterval(timer);
    }, 700);
  }

  buildPipeline(el.querySelector(".pipeline-a"), stepsA, "A");
  buildPipeline(el.querySelector(".pipeline-b"), stepsB, "B");
  el.querySelector(".replay-btn").addEventListener("click", runBoth);
  render();
  setTimeout(runBoth, 800);
})();

// ===== FPGA VS VARIABLE =====
(function () {
  var el = document.getElementById("fpga-widget");
  if (!el) return;

  var step = 0,
    interval;
  var vals = ["?", "5", "8", "16"];

  function render() {
    var lines = el.querySelectorAll(".code-line");
    lines.forEach(function (l, i) {
      l.classList.toggle("active", step === i + 1);
    });
    var vv = el.querySelector(".var-value");
    if (vv) vv.textContent = vals[step === 4 ? 0 : step] || "?";
    ["circ-node", "circ-wire", "circ-gate"].forEach(function (cls) {
      el.querySelectorAll("." + cls).forEach(function (n) {
        var req = parseInt(n.dataset.active || 99);
        n.classList.toggle("active", step >= req);
      });
    });
  }

  interval = setInterval(function () {
    step = (step + 1) % 5;
    render();
  }, 1000);
  render();
})();
