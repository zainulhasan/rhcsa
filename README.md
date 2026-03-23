# RHCSA Self-Study Course

This course is a complete beginner-friendly path for the RHCSA exam. It is designed to work offline, to be used mainly from the command line, and to train you for a hands-on performance exam where you must solve tasks without internet access.

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
18. `17-final-review-cheat-sheets.md`
19. `18-mock-exam-1.md`
20. `19-mock-exam-1-solutions.md`
21. `20-mock-exam-2.md`
22. `21-mock-exam-2-solutions.md`

## How To Use The Files

- Read lessons in order unless you are reviewing a weak topic.
- Keep a terminal open while reading.
- Treat every command as something to test, not just something to read.
- Mark commands you repeatedly forget.
- Keep a handwritten or plain-text mistake log.
- Revisit lessons where verification failed or took too long.

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

## How To Use The Mock Exams

Use the mock exams only after finishing lessons `00-16`.

Best method:

1. Set a timer.
2. Do not open the solution file.
3. Work as if internet is unavailable.
4. Use only built-in help such as `man`, `--help`, and local docs.
5. Reboot when the task requires persistent configuration.
6. Grade yourself using the provided checklists before reading solutions.

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

## Version Watch

This course follows your required study points as the mandatory scope. The current public EX200 page states that the exam is based on RHEL 10, so some command output and defaults may vary slightly by system version. Core skills remain the same: task completion, verification, troubleshooting, and persistence after reboot.

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
