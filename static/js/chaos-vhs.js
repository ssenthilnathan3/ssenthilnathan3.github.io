(function () {
  var canvas,
    ctx,
    animId,
    running = false;
  var bands = [];
  var spawnTimer = 0;

  function initCanvas() {
    if (canvas) return;
    canvas = document.createElement("canvas");
    canvas.id = "chaos-vhs";
    canvas.style.cssText =
      "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:999999;opacity:0;transition:opacity 0.3s;";
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d");
    resize();
    window.addEventListener("resize", resize);
  }

  function resize() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // Generate a horizontal stripe of static noise
  function drawNoise(y, height, intensity) {
    var w = canvas.width;
    var h = Math.min(height, canvas.height - y);
    if (h <= 0 || y >= canvas.height) return;
    var imageData = ctx.createImageData(w, h);
    var d = imageData.data;
    for (var i = 0; i < d.length; i += 4) {
      var v = 128 + (Math.random() - 0.5) * 80;
      d[i] = v;
      d[i + 1] = v;
      d[i + 2] = v;
      d[i + 3] = Math.random() < intensity ? 80 + Math.random() * 100 : 0;
    }
    ctx.putImageData(imageData, 0, y);
  }

  function spawnBand() {
    if (!canvas) return;
    bands.push({
      y: -Math.random() * 60,
      h: 6 + Math.random() * 20,
      speed: 40 + Math.random() * 80,
      intensity: 0.4 + Math.random() * 0.4,
    });
  }

  // Spawn a few bands immediately to make it visible
  function spawnInitialBands() {
    for (var i = 0; i < 3; i++) {
      var band = {
        y: Math.random() * canvas.height * 0.5,
        h: 6 + Math.random() * 20,
        speed: 30 + Math.random() * 60,
        intensity: 0.5 + Math.random() * 0.4,
      };
      bands.push(band);
    }
  }

  function tick() {
    if (!running || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // spawn a new band occasionally
    if (Math.random() < 0.02 && bands.length < 6) {
      spawnBand();
    }

    for (var i = bands.length - 1; i >= 0; i--) {
      var b = bands[i];
      b.y += b.speed * 0.016; // assume ~60fps
      if (b.y > canvas.height) {
        bands.splice(i, 1);
        continue;
      }
      drawNoise(Math.round(b.y), Math.ceil(b.h), b.intensity);
    }

    animId = requestAnimationFrame(tick);
  }

  function start() {
    if (running) return;
    running = true;
    initCanvas();
    bands = [];
    spawnInitialBands();
    canvas.style.opacity = "1";
    animId = requestAnimationFrame(tick);
  }

  function stop() {
    running = false;
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
    if (canvas) {
      canvas.style.opacity = "0";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    bands = [];
  }

  window.startChaosVHS = start;
  window.stopChaosVHS = stop;
})();
