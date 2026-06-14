/*
 * Offline Mermaid renderer.
 * Mermaid (UMD) is loaded locally before this file. We initialize it ourselves
 * and render any ```mermaid fences (rendered by pymdownx superfences as
 * <pre class="mermaid">), including after Material's instant navigation.
 * No CDN, no network.
 */
(function () {
  "use strict";

  var CONFIG = {
    startOnLoad: false,
    securityLevel: "loose",
    // htmlLabels needed for the <br/> line breaks used in node labels.
    flowchart: { useMaxWidth: false, htmlLabels: true }
  };

  var initialized = false;
  var rendering = false;

  function prep() {
    // superfences emits <pre class="mermaid"><code>…</code></pre>;
    // flatten to plain text so Mermaid reads a clean diagram source.
    document.querySelectorAll("pre.mermaid").forEach(function (pre) {
      if (pre.dataset.prepped === "1") {
        return;
      }
      pre.textContent = pre.textContent;
      pre.dataset.prepped = "1";
    });
  }

  function run() {
    if (!window.mermaid || rendering) {
      return;
    }
    if (!document.querySelector("pre.mermaid:not([data-processed]), div.mermaid:not([data-processed])")) {
      return; // nothing new to render
    }
    rendering = true;
    prep();
    function finish() { rendering = false; }
    try {
      if (!initialized) {
        window.mermaid.initialize(CONFIG);
        initialized = true;
      }
      var result = window.mermaid.run();
      if (result && typeof result.then === "function") {
        result.then(finish).catch(finish);
      } else {
        finish();
      }
    } catch (e) {
      rendering = false;
      if (window.console) {
        console.error("[mermaid-init]", e);
      }
    }
  }

  function boot() {
    run();
    // Re-render after Material instant-navigation swaps the page content.
    var observer = new MutationObserver(function () { run(); });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
