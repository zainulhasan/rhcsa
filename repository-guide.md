# How To Study This Course

This page explains how to use the repository as a training system instead of a pile of notes.

## Source Of Truth

Red Hat's public [EX200 exam page](https://www.redhat.com/en/services/training/ex200-red-hat-certified-system-administrator-rhcsa-exam) is the final reference for scope. I reviewed this course against that page on March 28, 2026. The current public page states that the exam is based on `RHEL 10`.

Use this course with one rule:

- official exam scope decides what matters
- the lesson files teach the skill
- the lab files test the skill
- the mock exams pressure-test the skill

## Best Route For Most Learners

If you are new to Linux, follow this order:

1. lessons `00-16`
2. labs `22-26`
3. `28-rhcsa-10-mixed-practice-bank.md`
4. `17a-rhcsa-command-reference-cheat-sheet.md`
5. `17-final-review-cheat-sheets.md`
6. `18-mock-exam-1.md`
7. `20-mock-exam-2.md`

If you already know some Linux, start here instead:

1. `22-labs-track-and-skill-check-guide.md`
2. `23-vm-lab-setup-and-baseline-checks.md`
3. `24-foundations-labs.md`
4. `25-administration-core-labs.md`
5. `26-networking-users-and-security-labs.md`
6. `28-rhcsa-10-mixed-practice-bank.md`
7. return to the matching lesson files only where you are weak

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

Use the labs to prove execution, not recognition.

1. Read the task once.
2. Plan the commands before typing.
3. Complete the task from memory.
4. Verify with commands.
5. Reboot when persistence matters.
6. Check the answer key only after you are finished.

## What To Do When You Get Stuck

Stay inside local help first:

- `man`
- `--help`
- `help`
- `apropos`
- `/usr/share/doc`

If the problem is still unclear:

1. go back one lesson
2. re-read the command breakdown
3. redo one worked example
4. retry the lab without looking at the solution

## When To Use Optional Resources

Use optional reinforcement only after the main path is working.

- `27-optional-topic-video-map.md` is for one weak topic at a time
- do not replace hands-on practice with video watching
- reject resources that focus on dumps, memorized answers, or non-objective topics

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
- `README.md` is the repository landing page
- lesson, lab, review, and mock-exam files stay in the repository root
