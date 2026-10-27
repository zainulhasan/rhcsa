---
description: How to use this course as a training system - routes, the lesson and lab workflow, local help, weak-topic repetition, and when to use mock exams and optional material.
---

# How To Study This Course

This page explains how to use the course as a training system instead of a pile of notes.

## Source Of Truth

Red Hat's public [EX200 exam page](https://www.redhat.com/en/services/training/ex200-red-hat-certified-system-administrator-rhcsa-exam) is the final reference for scope. It states that the exam is based on `RHEL 10`. This course follows that objective list; where a topic is outside the list (containers with Podman, lesson `15a`), the page says so and marks it optional.

Use this course with one rule:

- official exam scope decides what matters
- the lesson files teach the skill
- the lab files test the skill
- the mock exams pressure-test the skill

The [Objectives Map](objectives-map.md) lists each official objective and the lessons, labs, and mock tasks that cover it.

## Best Route For Most Learners

If you are new to Linux, follow this order:

1. lessons `00-16` (lesson `15a` Podman is optional)
2. labs `22-26`
3. [28 RHCSA 10 Mixed Practice Bank](28-rhcsa-10-mixed-practice-bank.md)
4. [17a RHCSA Command Reference Cheat Sheet](17a-rhcsa-command-reference-cheat-sheet.md)
5. [17 Final Review and Cheat Sheets](17-final-review-cheat-sheets.md)
6. [18 Mock Exam 1](18-mock-exam-1.md)
7. [20 Mock Exam 2](20-mock-exam-2.md)

Labs always come before mock exams. Use the cheat sheet (`17a`) any time during the lessons; it is a reference, not a lesson.

If you already know some Linux, start here instead:

1. [22 Labs Track and Skill Check Guide](22-labs-track-and-skill-check-guide.md)
2. [23 VM Lab Setup and Baseline Checks](23-vm-lab-setup-and-baseline-checks.md)
3. [24 Foundations Labs](24-foundations-labs.md)
4. [25 Administration Core Labs](25-administration-core-labs.md)
5. [26 Networking, Users, and Security Labs](26-networking-users-and-security-labs.md)
6. [28 RHCSA 10 Mixed Practice Bank](28-rhcsa-10-mixed-practice-bank.md)
7. return to the matching lesson files only where you are weak
8. finish with the cheat sheet, final review, and mock exams

Stay on one path. If a file feels too advanced, go back one step instead of collecting more outside material.

## What A Lesson Looks Like

Every lesson follows the same template, so you always know where to look:

1. a one-line promise and a 2-minute "Try it now" experience
2. **Why it matters** and the official objectives covered
3. **How it works** (plain language and a diagram where it helps)
4. **Commands, step by step**, with option tables and example output
5. **Common mistakes** with recovery commands
6. **Hands-on lab**: setup, a task with a `- [ ]` checklist, collapsed hints, and a collapsed solution with verification
7. **Exam tips**, including what must survive reboot
8. a short quiz, a summary, and Previous/Next links

Open hints and solutions only after you try the task yourself.

## Lesson Workflow

Use the same workflow for every lesson:

1. Read the concept section slowly.
2. Type the worked examples yourself.
3. Complete the guided lab without copy-paste if possible.
4. Run the verification commands.
5. Reboot if the task must persist.
6. Record what failed and why.
7. Repeat weak tasks until the syntax feels routine.

## Lab Workflow

Use the labs to prove execution, not recognition. All labs share the same machines and accounts, described in [23 VM Lab Setup and Baseline Checks](23-vm-lab-setup-and-baseline-checks.md).

1. Read the task once.
2. Plan the commands before typing.
3. Complete the task from memory.
4. Verify with commands.
5. Reboot when persistence matters.
6. Check the solution only after you are finished.

## What To Do When You Get Stuck

Stay inside local help first:

- `man`
- `info`
- `--help`
- `help`
- `type` and `command -v`
- `whatis` and `apropos`
- `/usr/share/doc`

If the problem is still unclear:

1. go back one lesson
2. re-read the command breakdown
3. redo one worked example
4. retry the lab without looking at the solution

## Recommended Habits

- Practice as a regular user first, then use `sudo` or `su -` only when needed.
- Reboot after major configuration changes to confirm persistence.
- Keep a text file of failed commands and corrected commands.
- Do not rely on copy-paste during serious review.

## How To Repeat Weak Topics

If a topic feels weak:

1. Re-read only the "How it works" and "Commands, step by step" sections.
2. Redo the hands-on lab without notes.
3. Redo the task with a timer you set yourself.
4. Reboot and verify persistence.
5. Write a three-line summary from memory.

Weak-topic signals:

- You forget command syntax.
- You cannot explain what the command output means.
- You cannot verify your result.
- You fix errors by guessing.
- Your configuration disappears after reboot.

## How To Use The Mock Exams

Use the mock exams only after finishing lessons `00-16` and the labs.

1. Reset your lab to a clean snapshot.
2. Set a timer of your own choosing.
3. Do not open the solution file.
4. Work as if the internet is unavailable and use only built-in help.
5. Reboot when a task requires persistent configuration.
6. Grade yourself with the checklists before reading the solutions.

## When To Use Optional Resources

Use optional reinforcement only after the main path is working.

- [15a Containers With Podman](15a-containers-with-podman.md) covers a skill that is not on the RHEL 10 list; do it when you have time
- [27 Optional Topic Reinforcement Map](27-optional-topic-video-map.md) is for one weak topic at a time
- [30 RHEL 9 Book Exercise Adaptation Bank](30-rhel9-book-exercise-adaptation-bank.md) is for extra optional hands-on repetition after [28](28-rhcsa-10-mixed-practice-bank.md)
- do not replace hands-on practice with video watching
- reject resources built around memorized answers or non-objective topics

## Signs You Are Actually Ready

You are moving in the right direction when you can:

- finish common tasks without panic
- explain why a command works
- verify results without guessing
- separate runtime fixes from persistent fixes
- recover from mistakes after reboot

## Repository Notes

This repository is organized for MkDocs and GitHub Pages.

- `index.md` is the site home page
- `mkdocs.yml` defines the site navigation
- `README.md` is the repository landing page and holds the publishing steps
- lesson, lab, review, and mock-exam files stay in the repository root
