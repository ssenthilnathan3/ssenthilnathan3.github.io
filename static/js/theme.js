(function () {
  const LIGHT = {
    bg: [253, 248, 243],
    surface: [255, 253, 250],
    text: [26, 24, 22],
    textMuted: [95, 91, 87],
    textSubtle: [182, 175, 168],
    accent: [58, 47, 42],
    accentHover: [81, 66, 60],
    accentLight: [246, 241, 236],
    border: [228, 221, 214],
    borderHover: [211, 203, 195],
    preBg: [246, 241, 236],
  };

  const DARK = {
    bg: [26, 24, 22],
    surface: [34, 32, 29],
    text: [232, 228, 224],
    textMuted: [182, 175, 168],
    textSubtle: [110, 106, 102],
    accent: [212, 196, 184],
    accentHover: [230, 218, 205],
    accentLight: [44, 40, 37],
    border: [51, 48, 44],
    borderHover: [69, 64, 60],
    preBg: [13, 12, 11],
  };

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function blendColor(token, t) {
    const a = LIGHT[token];
    const b = DARK[token];
    return [
      Math.round(lerp(a[0], b[0], t)),
      Math.round(lerp(a[1], b[1], t)),
      Math.round(lerp(a[2], b[2], t)),
    ];
  }

  function rgbToHex([r, g, b]) {
    return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
  }

  function applyTheme(t) {
    const root = document.documentElement;
    const set = (prop, token) =>
      root.style.setProperty(prop, rgbToHex(blendColor(token, t)));
    set("--color-bg", "bg");
    set("--color-surface", "surface");
    set("--color-text", "text");
    set("--color-text-muted", "textMuted");
    set("--color-text-subtle", "textSubtle");
    set("--color-accent", "accent");
    set("--color-accent-hover", "accentHover");
    set("--color-accent-light", "accentLight");
    set("--color-border", "border");
    set("--color-border-hover", "borderHover");
    set("--color-pre-bg", "preBg");
    const texOpacity = lerp(0.2, 0.12, t);
    root.style.setProperty("--texture-opacity", texOpacity.toFixed(3));
    root.dataset.themeValue = String(Math.round(t * 100));
  }

  const STORAGE_KEY = "theme-value";

  function getSavedValue() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) return parseInt(saved, 10) / 100;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? 1 : 0;
  }

  function saveValue(pct) {
    localStorage.setItem(STORAGE_KEY, String(pct));
  }

  function buildUI(initialPct) {
    const btn = document.createElement("button");
    btn.id = "theme-toggle-btn";
    btn.setAttribute("aria-label", "Toggle light/dark theme");
    btn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.75"/>
      <line x1="12" y1="2"  x2="12" y2="5"  stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
      <line x1="12" y1="19" x2="12" y2="22" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
      <line x1="2"  y1="12" x2="5"  y2="12" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
      <line x1="19" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
      <line x1="4.93"  y1="4.93"  x2="7.05"  y2="7.05"  stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
      <line x1="16.95" y1="16.95" x2="19.07" y2="19.07" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
      <line x1="4.93"  y1="19.07" x2="7.05"  y2="16.95" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
      <line x1="16.95" y1="7.05"  x2="19.07" y2="4.93"  stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
    </svg>`;
    btn.style.cssText =
      "position:fixed;bottom:1.25rem;right:1.25rem;z-index:999;width:36px;height:36px;border-radius:50%;border:1px solid var(--color-border);background:var(--color-surface);color:var(--color-text);cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.08);transition:all 0.2s ease;";
    document.body.appendChild(btn);

    let isDark = initialPct >= 50;

    function updateBtn() {
      btn.style.color = isDark ? "#fbbf24" : "var(--color-text)";
    }

    btn.addEventListener("click", () => {
      isDark = !isDark;
      const pct = isDark ? 100 : 0;
      applyTheme(pct / 100);
      saveValue(pct);
      updateBtn();
    });

    updateBtn();
  }

  // ── Haptic feedback on touch ────────────────────────────────────────────
  if (navigator.vibrate) {
    document.addEventListener("touchstart", () => navigator.vibrate(10), {
      passive: true,
    });
  }

  const initialT = getSavedValue();
  applyTheme(initialT);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () =>
      buildUI(Math.round(initialT * 100)),
    );
  } else {
    buildUI(Math.round(initialT * 100));
  }
})();
