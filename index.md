# RHCSA Self-Study Course

This site turns the course into a browsable handbook for GitHub Pages. The source lessons remain as plain Markdown files in the repository root so they still render cleanly on GitHub and stay easy to edit offline.

## How To Use This Site

1. Start with [Study Skills and Offline Help](00-study-skills-and-offline-help.md).
2. Work through the numbered lessons in order.
3. Use the [RHCSA Command Reference Cheat Sheet](17a-rhcsa-command-reference-cheat-sheet.md) when you need fast recall by command family.
4. Use [Final Review and Cheat Sheets](17-final-review-cheat-sheets.md) after finishing the lesson track.
5. Attempt [Mock Exam 1](18-mock-exam-1.md) and [Mock Exam 2](20-mock-exam-2.md) only after completing lessons `00-16`.
6. Open the mock exam solution files only after you finish the exam attempt.

## Recommended Study Path

### Foundations

- [00 Study Skills and Offline Help](00-study-skills-and-offline-help.md)
- [01 Shell Basics and Command Syntax](01-shell-basics-and-command-syntax.md)
- [02 Files, Directories, and Text Editing](02-files-directories-and-text-editing.md)
- [03 Redirection, Pipes, Grep, and Regex](03-redirection-pipes-grep-and-regex.md)
- [04 Archives, Compression, and Secure File Transfer](04-archives-compression-and-secure-file-transfer.md)
- [05 SSH, Login Control, and Remote Workflows](05-ssh-login-switching-users-and-remote-workflows.md)
- [06 Links, Permissions, and Default Permissions](06-links-permissions-and-default-permissions.md)

### Administration Core

- [07 Software Management, RPM Repositories, and Flatpak](07-software-management-rpm-repos-and-flatpak.md)
- [08 Shell Scripting Basics](08-shell-scripting-basics.md)
- [09 Boot, Targets, Processes, Logs, and Tuning](09-boot-targets-processes-logs-and-tuning.md)
- [10 Storage, Partitions, LVM, and Swap](10-storage-partitions-lvm-and-swap.md)
- [11 Filesystems, Mounts, NFS, and Autofs](11-filesystems-mounts-nfs-and-autofs.md)
- [12 Scheduling, Services, Time, and Bootloader](12-scheduling-services-time-and-bootloader.md)
- [13 Networking, Hostname Resolution, and firewalld](13-networking-hostname-resolution-and-firewalld.md)
- [14 Users, Groups, Passwords, and Sudo](14-users-groups-passwords-and-sudo.md)
- [15 SELinux, SSH Keys, and Security](15-selinux-ssh-keys-and-security.md)
- [16 Persistence, Reboot Checks, and Troubleshooting](16-persistence-reboot-checks-and-troubleshooting.md)

### Review and Exams

- [17a RHCSA Command Reference Cheat Sheet](17a-rhcsa-command-reference-cheat-sheet.md)
- [17 Final Review and Cheat Sheets](17-final-review-cheat-sheets.md)
- [18 Mock Exam 1](18-mock-exam-1.md)
- [19 Mock Exam 1 Solutions](19-mock-exam-1-solutions.md)
- [20 Mock Exam 2](20-mock-exam-2.md)
- [21 Mock Exam 2 Solutions](21-mock-exam-2-solutions.md)

## Study Rules

- Type the commands yourself.
- Use offline help first: `man`, `info`, `--help`, `help`, `type`, `apropos`, `/usr/share/doc`.
- Verify every task with commands, not assumptions.
- Reboot to confirm persistence whenever the task must survive restart.
- Keep a mistake log and repeat weak topics intentionally.

## Publishing Notes

This repository includes:

- `mkdocs.yml` for site structure
- `.github/workflows/deploy-pages.yml` for GitHub Pages deployment
- `requirements.txt` for the docs build dependencies

When pushed to GitHub, the site can be published directly with GitHub Actions.
