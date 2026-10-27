# RHCSA 10 Self-Study Course

This course is a complete beginner-friendly path for the current RHCSA `EX200` exam on `RHEL 10`. It is designed to work offline, to be used mainly from the command line, and to train you for a hands-on performance exam where you must solve tasks without internet access. The goal is simple: one organized study system with enough explanation, practice, verification, and troubleshooting that you do not need to keep searching online for missing steps.

The course is published as a website (MkDocs on GitHub Pages). All content is Markdown files at the repository root.

## Where to start

- **Study route, workflows, and tips:** read [repository-guide.md](repository-guide.md) (published on the site as "How To Study"). It holds the beginner and experienced routes, the lesson and lab workflows, how to repeat weak topics, how to use the mock exams, and when to use optional resources.
- **Home page and full file list:** [index.md](index.md).
- **First lesson:** [00-study-skills-and-offline-help.md](00-study-skills-and-offline-help.md).

## RHCSA 10 alignment

- The course is aligned to the current public `EX200` objective list for `RHEL 10`, which is the mandatory scope even when wording or output differs slightly by release.
- When a workflow is version-sensitive, the material calls it out instead of hiding it.
- Labs, cheat sheets, and review sections are organized around the same objective groups you will practice on the exam.
- Containers (Podman, lesson `15a`) are not on the RHEL 10 list and are an optional chapter.

## Who this course is for

- You are starting from zero or close to zero.
- You want one structured path instead of scattered notes.
- You want to learn by doing, not by reading summaries only.
- You want each topic tied to verification and reboot-safe administration.

## Why you should need less Googling

- Lessons explain the command, the reason, the expected output, common failure modes, and how to verify success.
- Labs turn the same objectives into question-first practice so you can prove the skill, not just recognize it.
- The command cheat sheet groups related commands by RHCSA objective so you can revise one section at a time.
- Troubleshooting sections show what failure looks like and what to check next.
- Offline help (`man`, `info`, `--help`, `help`, `type`, `command -v`, `whatis`, `apropos`, `/usr/share/doc`) is taught from lesson `00` onward.

You may still need to adapt to your exact lab environment, but you should not have to keep searching for basic syntax, missing setup steps, or how to verify a task.

## Lab setup

Practice in a lab where you can safely break things and recover: two RHEL-compatible machines or VMs (`servera` and `serverb`), snapshot support, and root access. The exact values (hostnames, IPs, accounts, spare disks) are in [23-vm-lab-setup-and-baseline-checks.md](23-vm-lab-setup-and-baseline-checks.md). For a step-by-step VM build, see the optional [29-rhcsa-rhce-local-lab-blueprint.md](29-rhcsa-rhce-local-lab-blueprint.md).

## Course standards

Every lesson is built to train exam behavior:

- command-line first
- practical over abstract
- verification after every task
- persistence after reboot
- troubleshooting instead of panic
- objective-based organization for easier revision
- enough local explanation that offline study remains practical

## Version watch

This course follows the official objective list as its mandatory scope. Red Hat's public [EX200 page](https://www.redhat.com/en/services/training/ex200-red-hat-certified-system-administrator-rhcsa-exam) states that the exam is based on `RHEL 10`, so some command output and defaults may vary slightly by system version. Core skills remain the same: task completion, verification, troubleshooting, and persistence after reboot.

## Publishing

This repository publishes to GitHub Pages using MkDocs. These files drive the site:

- `mkdocs.yml` for site structure and navigation
- `index.md` for the home page
- `requirements.txt` for the docs build dependencies
- `.github/workflows/deploy-pages.yml` for GitHub Pages deployment

Content `.md` files live at the repository root; `docs/` holds symlinks back to them (plus site assets), so MkDocs can resolve them with `docs_dir: docs`.

### Publish on GitHub

1. Push the repository to GitHub.
2. In the GitHub repository, open `Settings` then `Pages`.
3. Set the source to `GitHub Actions`.
4. Push to the `main` branch.
5. Wait for the `Deploy GitHub Pages` workflow to finish.
6. Open the published Pages URL from the repository Pages settings.

### Local preview

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
mkdocs serve
```

Then open:

```text
http://127.0.0.1:8000
```

To check the build the way CI does, run `mkdocs build --strict`.
