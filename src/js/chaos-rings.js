// chaos-rings.js — converted from ChaosRings.astro <script>
(function () {
  const CHAOS_COLORS = [
    '#ff6b6b','#feca57','#48dbfb','#ff9ff3','#54a0ff',
    '#5f27cd','#00d2d3','#ff9f43','#10ac84','#ee5a24',
    '#c44569','#f8b739','#6ab04c','#eb4d4b','#686de0',
  ];

  const svg = document.getElementById('chaos-svg');

  window.triggerChaosAnimation = function () {
    if (!svg) return;
    svg.innerHTML = '';
    const numRings = 25;
    for (let i = numRings; i >= 0; i--) {
      const radius = (i / numRings) * 90;
      if (radius <= 0) continue;
      const color = CHAOS_COLORS[i % CHAOS_COLORS.length];
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', '50%');
      circle.setAttribute('cy', '50%');
      circle.setAttribute('r', radius + '%');
      circle.setAttribute('fill', 'none');
      circle.setAttribute('stroke', color);
      circle.setAttribute('stroke-width', '4vmin');
      circle.setAttribute('opacity', '0');
      circle.style.transformOrigin = 'center';
      svg.appendChild(circle);
      const animDelay = i * 50;
      circle.animate(
        [{ transform: 'scale(0)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }],
        { duration: 1500, delay: animDelay, fill: 'forwards', easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
      );
    }
  };

  window.restoreChaosState = function () {
    if (!svg) return;
    svg.innerHTML = '';
    window.triggerChaosAnimation();
  };
})();
