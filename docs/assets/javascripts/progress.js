/*
 * Offline lesson-progress tracker for the RHCSA course.
 * - Adds a "Mark this lesson complete" toggle at the bottom of each lesson.
 * - Shows a progress bar + "X / N lessons complete" on the home page.
 * State lives only in the visitor's browser (localStorage). No network, no backend.
 */
(function () {
  "use strict";

  // The deliberate, sequential lesson path (00-16 plus 15a) = 18 lessons.
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
    var parts = window.location.pathname.split("/").filter(Boolean);
    return parts.length ? parts[parts.length - 1] : "";
  }

  function lessonLabel(done) {
    return done ? "✓ Completed — click to undo" : "Mark this lesson complete";
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
    btn.textContent = lessonLabel(done);

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
      btn.textContent = lessonLabel(nowDone);
    });

    wrap.appendChild(btn);
    inner.appendChild(wrap);
  }

  function renderHomeProgress() {
    var hero = document.querySelector(".hero-panel");
    if (!hero || !hero.parentNode) {
      return; // only the home page has the hero panel
    }
    if (document.querySelector(".rhcsa-progress")) {
      return; // already injected
    }

    var state = load();
    var done = LESSONS.filter(function (s) { return state[s]; }).length;
    var total = LESSONS.length;
    var pct = total ? Math.round((done / total) * 100) : 0;

    var box = document.createElement("div");
    box.className = "rhcsa-progress";
    box.setAttribute("role", "status");
    box.innerHTML =
      '<div class="rhcsa-progress-head">' +
      '<span class="rhcsa-progress-label">Your progress</span>' +
      '<span class="rhcsa-progress-count">' + done + " / " + total + " lessons complete</span>" +
      "</div>" +
      '<div class="rhcsa-progress-track">' +
      '<div class="rhcsa-progress-fill" style="width:' + pct + '%"></div>' +
      "</div>";

    hero.parentNode.insertBefore(box, hero.nextSibling);
  }

  function render() {
    renderLessonButton();
    renderHomeProgress();
  }

  function boot() {
    render();
    // Re-render after Material's instant navigation swaps page content.
    var observer = new MutationObserver(function () { render(); });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
