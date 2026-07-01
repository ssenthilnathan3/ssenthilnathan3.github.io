// chaos-toggle.js — converted from index.astro <script>
(function () {
  var faviconChaosInterval = null;
  var faviconWinkInterval = null;
  var faviconBusy = false;

  var toggleBtn = document.getElementById('chaos-toggle');
  var isChaos = localStorage.getItem('chaosMode') === 'true';

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
      if (window.triggerChaosAnimation) window.triggerChaosAnimation();
      if (window.startChaosMusic) window.startChaosMusic();
      if (window.startChaosPong) window.startChaosPong();
      if (window.startChaosP5) window.startChaosP5();
      startChaosFavicon();
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
