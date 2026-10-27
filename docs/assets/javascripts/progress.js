/*
 * Offline lesson-progress tracker for the RHCSA course.
 * - Adds a "Mark this lesson complete" toggle at the bottom of each lesson.
 * - Shows a progress bar + "X / N lessons complete" on the home page.
 * State lives only in the visitor's browser (localStorage). No network, no backend.
 */
(function () {
  "use strict";

  // The deliberate, sequential lesson path (00-16 plus 15a) = 18 lessons.
  // 15a is optional (not on the RHEL 10 objective list), so it is tracked but
  // not counted towards the "complete" total.
  var LESSONS = [
    "00-study-skills-and-offline-help",
    "01-shell-basics-and-command-syntax",
    "02-files-directories-and-text-editing",
    "03-redirection-pipes-grep-and-regex",
    "04-archives-compression-and-secure-file-transfer",
    "05-ssh-login-switching-users-and-remote-workflows",
    "06-links-permissions-and-default-permissions",
    "07-software-management-rpm-repos-and-flatpak",
    "08-shell-scripting-basics",
    "09-boot-targets-processes-logs-and-tuning",
    "10-storage-partitions-lvm-and-swap",
    "11-filesystems-mounts-nfs-and-autofs",
    "12-scheduling-services-time-and-bootloader",
    "13-networking-hostname-resolution-and-firewalld",
    "14-users-groups-passwords-and-sudo",
    "15-selinux-ssh-keys-and-security",
    "15a-containers-with-podman",
    "16-persistence-reboot-checks-and-troubleshooting"
  ];

  var OPTIONAL = ["15a-containers-with-podman"];
  var REQUIRED = LESSONS.filter(function (s) { return OPTIONAL.indexOf(s) === -1; });

  var KEY = "rhcsa-progress-v1";

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function save(state) {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      /* storage may be disabled; tracker degrades to a no-op */
    }
  }

  function currentSlug() {
    var parts = window.location.pathname.split("/").filter(function (p) { return p && p !== "index.html"; });
    return parts.length ? parts[parts.length - 1] : "";
  }

  function lessonLabel(done, slug) {
    var noun = OPTIONAL.indexOf(slug) === -1 ? "lesson" : "optional chapter";
    return done ? "✓ Completed — click to undo" : "Mark this " + noun + " complete";
  }

  function renderLessonButton() {
    var slug = currentSlug();
    if (LESSONS.indexOf(slug) === -1) {
      return; // not a tracked lesson page
    }
    var inner = document.querySelector(".md-content__inner");
    if (!inner || inner.querySelector(".rhcsa-complete")) {
      return; // no container, or already injected for this page
    }

    var done = !!load()[slug];

    var wrap = document.createElement("div");
    wrap.className = "rhcsa-complete";

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "rhcsa-complete-btn" + (done ? " is-done" : "");
    btn.textContent = lessonLabel(done, slug);
    btn.setAttribute("aria-pressed", done ? "true" : "false");

    btn.addEventListener("click", function () {
      var state = load();
      if (state[slug]) {
        delete state[slug];
      } else {
        state[slug] = true;
      }
      save(state);
      var nowDone = !!state[slug];
      btn.classList.toggle("is-done", nowDone);
      btn.textContent = lessonLabel(nowDone, slug);
      btn.setAttribute("aria-pressed", nowDone ? "true" : "false");
      renderHomeProgress();
    });

    wrap.appendChild(btn);
    inner.appendChild(wrap);
  }

  function renderHomeProgress() {
    var hero = document.querySelector(".hero-panel");
    if (!hero || !hero.parentNode) {
      return; // only the home page has the hero panel
    }

    var state = load();
    var done = REQUIRED.filter(function (s) { return state[s]; }).length;
    var total = REQUIRED.length;
    var pct = total ? Math.round((done / total) * 100) : 0;

    var box = document.querySelector(".rhcsa-progress");
    if (!box) {
      box = document.createElement("div");
      box.className = "rhcsa-progress";
      hero.parentNode.insertBefore(box, hero.nextSibling);
    }
    box.innerHTML =
      '<div class="rhcsa-progress-head">' +
      '<span class="rhcsa-progress-label">Your progress</span>' +
      '<span class="rhcsa-progress-count">' + done + " / " + total + " lessons complete</span>" +
      "</div>" +
      '<div class="rhcsa-progress-track" role="progressbar" aria-label="Lessons complete"' +
      ' aria-valuemin="0" aria-valuemax="' + total + '" aria-valuenow="' + done + '">' +
      '<div class="rhcsa-progress-fill" style="width:' + pct + '%"></div>' +
      "</div>";
  }

  function render() {
    renderLessonButton();
    renderHomeProgress();
  }

  // Closed <details> stay hidden on paper: open them for printing, restore after.
  var reopen = [];
  window.addEventListener("beforeprint", function () {
    document.querySelectorAll("details:not([open])").forEach(function (d) {
      d.setAttribute("open", "");
      reopen.push(d);
    });
  });
  window.addEventListener("afterprint", function () {
    reopen.forEach(function (d) { d.removeAttribute("open"); });
    reopen = [];
  });

  function boot() {
    // document$ fires on first load and after every Material instant-nav swap.
    if (window.document$ && typeof window.document$.subscribe === "function") {
      window.document$.subscribe(render);
    } else {
      render();
    }
    // Keep a second open tab in sync.
    window.addEventListener("storage", function (e) {
      if (e.key === KEY) {
        renderHomeProgress();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
