# RHCSA 10 Self-Study Course

This course is a complete beginner-friendly path for the current RHCSA `EX200` exam on `RHEL 10`. It is designed to work offline, to be used mainly from the command line, and to train you for a hands-on performance exam where you must solve tasks without internet access. The goal is simple: give you one organized study system with enough explanation, practice, verification, and troubleshooting that you do not need to keep searching online for missing steps.

## RHCSA 10 Alignment

- The course is aligned to the current public `EX200` objective list for `RHEL 10`.
- Your original study points remain the mandatory scope, even when wording or output differs slightly by release.
- When a workflow is version-sensitive, the material calls it out instead of hiding it.
- Labs, cheat sheets, and review sections are organized around the same objective groups you will practice on the exam.

## Who This Course Is For

- You are starting from zero or close to zero.
- You want one structured path instead of scattered notes.
- You want to learn by doing, not by reading summaries only.
- You want each topic tied to verification and reboot-safe administration.

## How To Study This Course

Use the files in order. Each lesson builds on earlier lessons and assumes you practiced the commands, not just read them.

Study loop for every lesson:

1. Read the concept sections slowly.
2. Type every worked example yourself.
3. Complete the guided lab without copy-pasting if possible.
4. Do the independent practice tasks from memory.
5. Run the verification commands.
6. Read the troubleshooting section and intentionally reproduce at least one mistake.
7. Answer the quiz without looking.
8. Attempt the exam-style tasks under time pressure.
9. Compare your work to the answer key only after you finish.

## Recommended Order

### Beginner route

If you are starting from zero, follow this route exactly and ignore optional reference pages until the end.

1. `00-study-skills-and-offline-help.md`
2. `01-shell-basics-and-command-syntax.md`
3. `02-files-directories-and-text-editing.md`
4. `03-redirection-pipes-grep-and-regex.md`
5. `04-archives-compression-and-secure-file-transfer.md`
6. `05-ssh-login-switching-users-and-remote-workflows.md`
7. `06-links-permissions-and-default-permissions.md`
8. `07-software-management-rpm-repos-and-flatpak.md`
9. `08-shell-scripting-basics.md`
10. `09-boot-targets-processes-logs-and-tuning.md`
11. `10-storage-partitions-lvm-and-swap.md`
12. `11-filesystems-mounts-nfs-and-autofs.md`
13. `12-scheduling-services-time-and-bootloader.md`
14. `13-networking-hostname-resolution-and-firewalld.md`
15. `14-users-groups-passwords-and-sudo.md`
16. `15-selinux-ssh-keys-and-security.md`
17. `16-persistence-reboot-checks-and-troubleshooting.md`
18. `22-labs-track-and-skill-check-guide.md`
19. `23-vm-lab-setup-and-baseline-checks.md`
20. `24-foundations-labs.md`
21. `25-administration-core-labs.md`
22. `26-networking-users-and-security-labs.md`
23. `28-rhcsa-10-mixed-practice-bank.md`
24. `17a-rhcsa-command-reference-cheat-sheet.md`
25. `17-final-review-cheat-sheets.md`
26. `18-mock-exam-1.md`
27. `19-mock-exam-1-solutions.md`
28. `20-mock-exam-2.md`
29. `21-mock-exam-2-solutions.md`

### Experienced route

1. `22-labs-track-and-skill-check-guide.md`
2. `23-vm-lab-setup-and-baseline-checks.md`
3. `24-foundations-labs.md`
4. `25-administration-core-labs.md`
5. `26-networking-users-and-security-labs.md`
6. `28-rhcsa-10-mixed-practice-bank.md`
7. Return to the matching lesson files for weak areas.
8. Use `17a-rhcsa-command-reference-cheat-sheet.md` for speed review.
9. Finish with `18-mock-exam-1.md` and `20-mock-exam-2.md`.

## Stay On One Path

Do not try to use every file at once.

- If you are a beginner, stay on this path: lessons `00-16` -> labs `22-26` -> `28-rhcsa-10-mixed-practice-bank.md` -> command review -> mock exams.
- If you already know some Linux, stay on this path: labs `22-26` -> weak-topic lessons -> mixed practice -> mock exams.
- Use optional reference material only after you already know where your weak areas are.
- If a file feels too advanced, go back one step in the path instead of collecting more outside material.

## How To Use The Files

- Read lessons in order unless you are reviewing a weak topic.
- Keep a terminal open while reading.
- Treat every command as something to test, not just something to read.
- Mark commands you repeatedly forget.
- Keep a handwritten or plain-text mistake log.
- Revisit lessons where verification failed or took too long.

## Why You Should Need Less Googling

This course is built to reduce the need for outside searching.

- Lessons explain the command, the reason, the expected output, common failure modes, and how to verify success.
- Labs turn the same objectives into question-first practice so you can prove the skill, not just recognize it.
- The command cheat sheet groups related commands by RHCSA objective so you can revise one section at a time.
- Troubleshooting sections show what failure looks like and what to check next.
- Offline help usage is taught from lesson `00` onward so you can solve problems with `man`, `--help`, `apropos`, and local documentation.

You may still need to adapt to your exact lab environment, but you should not have to keep searching for basic syntax, missing setup steps, or how to verify a task.

## Fast Lab Path For Learners With Some Experience

If you already know basic Linux and want to test yourself first, use this order:

1. `22-labs-track-and-skill-check-guide.md`
2. `23-vm-lab-setup-and-baseline-checks.md`
3. `24-foundations-labs.md`
4. `25-administration-core-labs.md`
5. `26-networking-users-and-security-labs.md`

Then return to the lesson files only for weak areas you discover during the labs.

## Clean Study Workflow

Use the same workflow every time so the course stays easy to follow:

1. Read the lesson or lab objective.
2. Type the worked examples yourself.
3. Complete the guided task without copy-paste if possible.
4. Run the verification commands.
5. Reboot if persistence matters.
6. Record mistakes and the corrected command.
7. Repeat weak tasks until they feel routine.

## Lab Setup

You should practice in a lab where you can safely break things and recover.

Minimum recommended setup:

- 1 main RHEL-compatible system for local administration practice
- 1 second system or VM for SSH, file transfer, NFS, and remote tasks
- Snapshot support if using virtual machines
- Root access

Recommended VM names:

- `servera`
- `serverb`
- `serverc`

If you want one lab for both RHCSA and RHCE, use the dedicated guide:

- `29-rhcsa-rhce-local-lab-blueprint.md`

Recommended habits:

- Practice as a regular user first, then use `sudo` or `su -` only when needed.
- Reboot after major configuration changes to confirm persistence.
- Keep a text file of failed commands and corrected commands.
- Do not rely on copy-paste during serious review.

## How To Repeat Weak Topics

If a topic feels weak:

1. Re-read only the "Concept explanation" and "Command breakdowns".
2. Redo the guided lab without notes.
3. Redo the exam-style tasks with a timer.
4. Reboot and verify persistence.
5. Write a three-line summary from memory.

Weak-topic signals:

- You forget command syntax.
- You cannot explain what the command output means.
- You cannot verify your result.
- You fix errors by guessing.
- Your configuration disappears after reboot.

## Optional Reference Material

These files are not part of the main beginner study path.

- `27-optional-topic-video-map.md` is a topic-based reinforcement map for late-stage review only.
- Use it after lessons, labs, and mixed practice, not before.
- Treat it as a way to revisit weak topics, not as the core course.

## How To Use The Mock Exams

Use the mock exams only after finishing lessons `00-16`.

Best method:

1. Set a timer.
2. Do not open the solution file.
3. Work as if internet is unavailable.
4. Use only built-in help such as `man`, `--help`, and local docs.
5. Reboot when the task requires persistent configuration.
6. Grade yourself using the provided checklists before reading solutions.

## Labs Track

The labs track is a second route through the course.

- It starts with local VM setup and baseline checks.
- `29-rhcsa-rhce-local-lab-blueprint.md` extends that into a 3-VM design for RHCSA plus future RHCE work.
- It is designed for learners who want question-first practice.
- Each lab file follows the same study structure as the lesson files.
- Each lab file includes worked examples, guided labs, independent tasks, verification, troubleshooting, quiz questions, and exam-style tasks.
- `28-rhcsa-10-mixed-practice-bank.md` adds one more mixed drill bank built from repeated RHCSA-style task patterns, but filtered back to RHCSA 10 scope.
- Use it after each major lesson section or as a fast diagnostic path if you already know some Linux.

## Offline Help Rule

This course is designed so that you can solve tasks without internet access. You should become fast with:

- `man`
- `info`
- `--help`
- `help`
- `type`
- `command -v`
- `whatis`
- `apropos`
- `/usr/share/doc`

If you get stuck, your first move should be local documentation, not guessing.

## Course Standards

Every lesson is built to train exam behavior:

- command-line first
- practical over abstract
- verification after every task
- persistence after reboot
- troubleshooting instead of panic
- objective-based organization for easier revision
- enough local explanation that offline study remains practical

## Version Watch

This course follows your required study points as the mandatory scope. Red Hat's public [EX200 page](https://www.redhat.com/en/services/training/ex200-red-hat-certified-system-administrator-rhcsa-exam) states that the exam is based on `RHEL 10`, so some command output and defaults may vary slightly by system version. Core skills remain the same: task completion, verification, troubleshooting, and persistence after reboot.

## GitHub Pages

This repository is set up to publish as a GitHub Pages site using MkDocs.

Files added for publishing:

- `mkdocs.yml`
- `index.md`
- `requirements.txt`
- `.github/workflows/deploy-pages.yml`

### Publish On GitHub

1. Push the repository to GitHub.
2. In the GitHub repository, open `Settings` then `Pages`.
3. Set the source to `GitHub Actions`.
4. Push to the `main` branch.
5. Wait for the `Deploy GitHub Pages` workflow to finish.
6. Open the published Pages URL from the repository Pages settings.

### Local Preview

If you want to preview the site locally before pushing:

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
