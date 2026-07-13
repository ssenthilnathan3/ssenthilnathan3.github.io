// chaos-toggle.js — converted from index.astro <script>
(function () {
  var faviconChaosInterval = null;
  var faviconWinkInterval = null;
  var faviconBusy = false;

  var toggleBtn = document.getElementById('chaos-toggle');
  var isChaos = localStorage.getItem('chaosMode') === 'true';

  var scriptsLoaded = false;
  var scriptsLoading = false;
  var loadingCallbacks = [];

  function loadChaosScripts(callback) {
    if (scriptsLoaded) {
      if (callback) callback();
      return;
    }
    if (callback) {
      loadingCallbacks.push(callback);
    }
    if (scriptsLoading) {
      return;
    }
    scriptsLoading = true;

    function loadScript(src, cb) {
      var s = document.createElement('script');
      s.src = src;
      s.onload = cb;
      s.onerror = function () {
        console.error("Failed to load script: " + src);
        cb();
      };
      document.body.appendChild(s);
    }

    loadScript("https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js", function () {
      var remaining = [
        "/js/chaos-rings.js",
        "/js/chaos-pong.js",
        "/js/chaos-p5.js",
        "/js/chaos-music.js"
      ];
      var count = 0;
      function checkDone() {
        count++;
        if (count === remaining.length) {
          scriptsLoaded = true;
          scriptsLoading = false;
          while (loadingCallbacks.length > 0) {
            var cb = loadingCallbacks.shift();
            cb();
          }
        }
      }
      for (var i = 0; i < remaining.length; i++) {
        loadScript(remaining[i], checkDone);
      }
    });
  }

  function setDot(color, opacity) {
    if (faviconBusy) return;
    opacity = opacity === undefined ? 1 : opacity;
    var svgStr = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
      '<circle cx="50" cy="50" r="50" fill="' + color + '" fill-opacity="' + opacity + '"/></svg>';
    var favicon = document.getElementById('favicon');
    if (favicon) favicon.href = 'data:image/svg+xml,' + encodeURIComponent(svgStr);
  }

  function startChaosFavicon() {
    var colors = ['#ffffff','#ff3b3b','#3b82ff','#22c55e','#facc15'];
    var i = 0;
    if (faviconChaosInterval) clearInterval(faviconChaosInterval);
    faviconChaosInterval = setInterval(function () {
      if (!isChaos || faviconBusy) return;
      setDot(colors[i % colors.length]);
      i++;
    }, 700);
  }

  function stopChaosFavicon() {
    if (faviconChaosInterval) { clearInterval(faviconChaosInterval); faviconChaosInterval = null; }
    faviconBusy = false;
  }

  function wink() {
    if (!isChaos || faviconBusy) return;
    faviconBusy = true;
    setDot('#ffffff', 0.15);
    setTimeout(function () { setDot('#ffffff', 1); faviconBusy = false; }, 240);
  }

  function setMode(enabled) {
    isChaos = enabled;
    localStorage.setItem('chaosMode', String(enabled));
    if (enabled) {
      document.body.classList.add('chaos-mode');
      startChaosFavicon();
      loadChaosScripts(function () {
        if (!isChaos) return;
        if (window.triggerChaosAnimation) window.triggerChaosAnimation();
        if (window.startChaosMusic) window.startChaosMusic();
        if (window.startChaosPong) window.startChaosPong();
        if (window.startChaosP5) window.startChaosP5();
      });
    } else {
      document.body.classList.remove('chaos-mode');
      var svg = document.getElementById('chaos-svg');
      if (svg) svg.innerHTML = '';
      if (window.stopChaosMusic) window.stopChaosMusic();
      if (window.stopChaosPong) window.stopChaosPong();
      if (window.stopChaosP5) window.stopChaosP5();
      stopChaosFavicon();
      setDot('#ffffff');
    }
  }

  window.setChaosMode = setMode;

  // Default favicon
  setDot('#ffffff');

  // Rare gold easter egg
  if (Math.random() < 0.0003) setDot('#ffd700');

  // Restore saved state
  if (isChaos) requestAnimationFrame(function () { setMode(true); });

  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () { setMode(!isChaos); });
  }

  if (faviconWinkInterval) clearInterval(faviconWinkInterval);
  faviconWinkInterval = setInterval(function () {
    if (isChaos && Math.random() < 0.15) wink();
  }, 60000);

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { stopChaosFavicon(); }
    else if (isChaos) { startChaosFavicon(); }
  });
})();
