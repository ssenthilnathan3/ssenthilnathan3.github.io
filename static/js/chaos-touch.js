(function () {
  var active = false;

  var tiltX = 0;
  var tiltY = 0;
  var hasOrientation = false;

  var svg = null;

  var colors = [
    "#ff6b6b", "#feca57", "#48dbfb", "#ff9ff3",
    "#54a0ff", "#5f27cd", "#00d2d3", "#ff9f43",
  ];

  function onOrientation(e) {
    if (!active) return;
    if (e.gamma === null) return;
    hasOrientation = true;
    tiltX = (e.gamma / 45);
    tiltY = (e.beta / 45 - 1);
  }

  function tiltLoop() {
    if (!active || !hasOrientation) {
      requestAnimationFrame(tiltLoop);
      return;
    }
    svg = svg || document.getElementById("chaos-svg");
    if (svg) {
      svg.style.transform =
        "translate(" + (tiltX * 12) + "px, " + (tiltY * 12) + "px)";
    }
    requestAnimationFrame(tiltLoop);
  }

  function spawnBurst(x, y) {
    var count = 12 + Math.floor(Math.random() * 10);
    var gravX = hasOrientation ? tiltX * 80 : 0;
    var gravY = hasOrientation ? tiltY * 80 + 40 : 0;

    for (var i = 0; i < count; i++) {
      var dot = document.createElement("div");
      dot.style.cssText =
        "position:fixed;z-index:999;pointer-events:none;" +
        "width:8px;height:8px;border-radius:50%;" +
        "left:" + x + "px;top:" + y + "px;" +
        "background:" + colors[Math.floor(Math.random() * colors.length)] + ";";

      var angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      var dist = 30 + Math.random() * 50;
      var dx = Math.cos(angle) * dist + gravX;
      var dy = Math.sin(angle) * dist + gravY;

      document.body.appendChild(dot);

      dot.animate(
        [
          { transform: "translate(0, 0) scale(1)", opacity: 1 },
          { transform: "translate(" + dx + "px, " + dy + "px) scale(0)", opacity: 0 },
        ],
        {
          duration: 500 + Math.random() * 400,
          easing: "cubic-bezier(0, 0.7, 0.3, 1)",
          fill: "forwards",
        },
      ).onfinish = function () { dot.remove(); };
    }
  }

  function onTouch(e) {
    if (!active) return;
    var t = e.touches ? e.touches[0] : e;
    spawnBurst(t.clientX, t.clientY);
  }

  function onTap(e) {
    if (!active) return;
    spawnBurst(e.clientX, e.clientY);
  }

  window.startChaosTouch = function () {
    if (active) return;
    active = true;
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("click", onTap);
    window.addEventListener("deviceorientation", onOrientation, true);
    tiltLoop();
  };

  window.stopChaosTouch = function () {
    active = false;
    window.removeEventListener("touchstart", onTouch);
    window.removeEventListener("click", onTap);
    window.removeEventListener("deviceorientation", onOrientation, true);
    svg = svg || document.getElementById("chaos-svg");
    if (svg) svg.style.transform = "";
  };
})();
