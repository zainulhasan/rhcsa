/*
 * Offline Mermaid renderer (ES module).
 * Loads the locally vendored Mermaid dist (no CDN) and renders every
 * ```mermaid fence with mermaid.render(), which produces correctly sized SVGs
 * (the plugin's in-place run() collapsed them to 0x0 in this theme).
 * Re-runs on Material's instant navigation via the document$ lifecycle.
 */
import mermaid from "./mermaid-dist/mermaid.esm.min.mjs";

mermaid.initialize({
  startOnLoad: false,
  securityLevel: "loose",
  theme: "dark",
  // Extra node padding so multi-line labels (with <br/>) aren't clipped.
  flowchart: { useMaxWidth: false, htmlLabels: true, padding: 16 },
  themeCSS: ".nodeLabel, .node .label { line-height: 1.45; padding: 2px 0; }"
});

let counter = 0;

async function renderAll() {
  const blocks = document.querySelectorAll(
    ".mermaid-diagram:not([data-rendered])"
  );
  for (const el of blocks) {
    const code = (el.textContent || "").trim();
    el.dataset.rendered = "1";
    if (!code) {
      continue;
    }
    try {
      counter += 1;
      const { svg, bindFunctions } = await mermaid.render("mmd-" + counter, code);
      el.innerHTML = svg;
      if (bindFunctions) {
        bindFunctions(el);
      }
    } catch (e) {
      el.dataset.rendered = "";
      if (window.console) {
        console.error("[mermaid-render]", e);
      }
    }
  }
}

// Material exposes document$ (fires on first load and every instant-nav swap).
if (window.document$ && typeof window.document$.subscribe === "function") {
  window.document$.subscribe(function () { renderAll(); });
} else if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderAll);
} else {
  renderAll();
}
