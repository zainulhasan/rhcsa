(function () {
  function enhanceMermaid(block) {
    if (!block || block.dataset.zoomReady === "true") {
      return;
    }

    var svg = block.querySelector("svg");
    if (!svg) {
      return;
    }

    var figure = document.createElement("div");
    figure.className = "mermaid-figure";

    var toolbar = document.createElement("div");
    toolbar.className = "mermaid-toolbar";

    var zoomOut = document.createElement("button");
    zoomOut.type = "button";
    zoomOut.textContent = "Zoom -";

    var reset = document.createElement("button");
    reset.type = "button";
    reset.textContent = "Reset";

    var zoomIn = document.createElement("button");
    zoomIn.type = "button";
    zoomIn.textContent = "Zoom +";

    toolbar.appendChild(zoomOut);
    toolbar.appendChild(reset);
    toolbar.appendChild(zoomIn);

    var frame = document.createElement("div");
    frame.className = "mermaid-frame";

    block.parentNode.insertBefore(figure, block);
    figure.appendChild(toolbar);
    figure.appendChild(frame);
    frame.appendChild(block);

    var scale = 1;

    function applyScale() {
      svg.style.transform = "scale(" + scale + ")";
    }

    zoomIn.addEventListener("click", function () {
      scale = Math.min(scale + 0.2, 3);
      applyScale();
    });

    zoomOut.addEventListener("click", function () {
      scale = Math.max(scale - 0.2, 0.6);
      applyScale();
    });

    reset.addEventListener("click", function () {
      scale = 1;
      applyScale();
    });

    block.dataset.zoomReady = "true";
    applyScale();
  }

  function scan() {
    document.querySelectorAll(".mermaid").forEach(enhanceMermaid);
  }

  document.addEventListener("DOMContentLoaded", function () {
    scan();

    var observer = new MutationObserver(function () {
      scan();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
})();
