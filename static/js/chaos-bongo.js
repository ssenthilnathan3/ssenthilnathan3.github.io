(function () {
  var el,
    styleEl,
    running = false;

  var css = `
#chaos-bongo {
  position: fixed;
  bottom: 70px;
  right: 20px;
  z-index: 99999;
  width: 100px;
  height: 100px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.4s;
}
#chaos-bongo.visible { opacity: 1; }

#chaos-bongo svg {
  display: block;
  width: 100%;
  height: 100%;
}

@keyframes bongo-tap-left {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-18deg); }
}
@keyframes bongo-tap-right {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(18deg); }
}

.bongo-arm-left  { transform-origin: 32px 58px; animation: bongo-tap-left 0.3s ease-in-out infinite; }
.bongo-arm-right { transform-origin: 68px 58px; animation: bongo-tap-right 0.3s ease-in-out infinite; }
.bongo-arm-left.paused, .bongo-arm-right.paused { animation-play-state: paused; }
`;

  function init() {
    if (el) return;

    styleEl = document.createElement("style");
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    el = document.createElement("div");
    el.id = "chaos-bongo";
    el.innerHTML =
      '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' +
      '  <g class="bongo-arm-left">' +
      '    <rect x="22" y="54" width="12" height="24" rx="6" fill="#d4a373"/>' +
      '    <circle cx="28" cy="78" r="6" fill="#d4a373"/>' +
      "  </g>" +
      '  <g class="bongo-arm-right">' +
      '    <rect x="66" y="54" width="12" height="24" rx="6" fill="#d4a373"/>' +
      '    <circle cx="72" cy="78" r="6" fill="#d4a373"/>' +
      "  </g>" +
      '  <ellipse cx="50" cy="40" rx="26" ry="24" fill="#d4a373"/>' +
      '  <ellipse cx="50" cy="42" rx="20" ry="18" fill="#c4956a"/>' +
      '  <polygon points="28,24 22,10 34,18" fill="#d4a373"/>' +
      '  <polygon points="72,24 78,10 66,18" fill="#d4a373"/>' +
      '  <ellipse cx="42" cy="38" rx="3" ry="4" fill="#333"/>' +
      '  <ellipse cx="58" cy="38" rx="3" ry="4" fill="#333"/>' +
      '  <ellipse cx="44" cy="36" rx="1.5" ry="2" fill="#fff"/>' +
      '  <ellipse cx="60" cy="36" rx="1.5" ry="2" fill="#fff"/>' +
      '  <ellipse cx="50" cy="48" rx="5" ry="3" fill="#333"/>' +
      '  <path d="M46,49 Q50,53 54,49" stroke="#333" stroke-width="1.2" fill="none"/>' +
      '  <rect x="38" y="60" width="24" height="14" rx="4" fill="#8B4513"/>' +
      '  <rect x="38" y="60" width="24" height="4" rx="2" fill="#a0522d"/>' +
      '  <rect x="38" y="72" width="24" height="14" rx="4" fill="#8B4513"/>' +
      '  <rect x="38" y="72" width="24" height="4" rx="2" fill="#a0522d"/>' +
      "</svg>";
    document.body.appendChild(el);
  }

  function setSpeed(rate) {
    if (!el) return;
    var duration = Math.max(0.08, 0.3 / (rate || 1));
    var arms = el.querySelectorAll(".bongo-arm-left, .bongo-arm-right");
    arms.forEach(function (a) {
      a.style.animationDuration = duration + "s";
    });
  }

  function setPlaying(playing) {
    if (!el) return;
    var arms = el.querySelectorAll(".bongo-arm-left, .bongo-arm-right");
    arms.forEach(function (a) {
      a.classList.toggle("paused", !playing);
    });
  }

  function start() {
    if (running) return;
    running = true;
    init();
    el.classList.add("visible");

    var player = document.getElementById("regional-player");
    if (player) {
      setSpeed(player.playbackRate || 1);
      setPlaying(!player.paused);

      player.addEventListener("play", onPlay);
      player.addEventListener("pause", onPause);
      player.addEventListener("ratechange", onRateChange);
    } else {
      setSpeed(1);
      setPlaying(false);
    }
  }

  function onPlay() {
    setPlaying(true);
  }
  function onPause() {
    setPlaying(false);
  }
  function onRateChange() {
    var player = document.getElementById("regional-player");
    if (player) setSpeed(player.playbackRate);
  }

  function stop() {
    running = false;
    if (el) {
      el.classList.remove("visible");
      setPlaying(false);
    }
    var player = document.getElementById("regional-player");
    if (player) {
      player.removeEventListener("play", onPlay);
      player.removeEventListener("pause", onPause);
      player.removeEventListener("ratechange", onRateChange);
    }
  }

  window.startChaosBongo = start;
  window.stopChaosBongo = stop;
})();
