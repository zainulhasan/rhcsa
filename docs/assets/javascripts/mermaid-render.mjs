/*
 * Offline Mermaid renderer (ES module).
 * Loads the locally vendored Mermaid dist (no CDN) and renders every
 * ```mermaid fence with mermaid.render(), which produces correctly sized SVGs
 * (the plugin's in-place run() collapsed them to 0x0 in this theme).
 * Re-runs on Material's instant navigation via the document$ lifecycle, and
 * re-renders when the reader switches between the light and dark palette.
 * Only flowcharts are vendored; other diagram types will not render.
 */
import mermaid from "./mermaid-dist/mermaid.esm.min.mjs";

const THEMES = {
  default: {
    background: "transparent",
    primaryColor: "#e3eff0",
    primaryTextColor: "#12252a",
    primaryBorderColor: "#1f5f66",
    secondaryColor: "#f3e6d3",
    tertiaryColor: "#f6f4ef",
    lineColor: "#3d5a60",
    textColor: "#12252a"
  },
  slate: {
    background: "transparent",
    primaryColor: "#1e4a50",
    primaryTextColor: "#e7efee",
    primaryBorderColor: "#49a5a6",
    secondaryColor: "#3a2f1d",
    tertiaryColor: "#182124",
    lineColor: "#9fc3c1",
    textColor: "#e7efee"
  }
};

function scheme() {
  return document.body.getAttribute("data-md-color-scheme") === "slate"
    ? "slate"
    : "default";
}

function configure() {
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "strict",
    theme: "base",
    themeVariables: THEMES[scheme()],
    // Extra node padding so multi-line labels (with <br/>) aren't clipped.
    flowchart: { useMaxWidth: false, htmlLabels: true, padding: 16 },
    themeCSS: ".nodeLabel, .node .label { line-height: 1.45; padding: 2px 0; }"
  });
}

let counter = 0;

async function renderAll() {
  const blocks = document.querySelectorAll(
    ".mermaid-diagram:not([data-rendered])"
  );
  for (const el of blocks) {
    // Keep the source so the diagram can be redrawn after a palette switch.
    const code = (el.dataset.src || el.textContent || "").trim();
    el.dataset.rendered = "1";
    if (!code) {
      continue;
    }
    el.dataset.src = code;
    try {
      counter += 1;
      const { svg, bindFunctions } = await mermaid.render("mmd-" + counter, code);
      el.innerHTML = svg;
      if (bindFunctions) {
        bindFunctions(el);
      }
    } catch (e) {
      // Mermaid leaves a stray error node in <body> when a render fails.
      const stray = document.getElementById("dmmd-" + counter);
      if (stray) {
        stray.remove();
      }
      delete el.dataset.rendered;
      if (window.console) {
        console.error("[mermaid-render]", e);
      }
    }
  }
}

function start() {
  configure();
  renderAll();
}

// Redraw every diagram when Material flips data-md-color-scheme on <body>.
let lastScheme = null;
new MutationObserver(function () {
  const now = scheme();
  if (now === lastScheme) {
    return;
  }
  lastScheme = now;
  configure();
  document.querySelectorAll(".mermaid-diagram[data-src]").forEach(function (el) {
    // Keep the old SVG on screen until the redraw replaces it (no flash of source).
    delete el.dataset.rendered;
  });
  renderAll();
}).observe(document.body, { attributes: true, attributeFilter: ["data-md-color-scheme"] });

// Material exposes document$ (fires on first load and every instant-nav swap).
if (window.document$ && typeof window.document$.subscribe === "function") {
  window.document$.subscribe(function () {
    lastScheme = scheme();
    start();
  });
} else if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}
