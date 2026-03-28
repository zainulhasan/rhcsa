# Mock Exam 1

## When To Use This Mock Exam

Use this only after you have completed:

- lessons `00-16`
- labs `22-26`
- `28-rhcsa-10-mixed-practice-bank.md`
- `17a-rhcsa-command-reference-cheat-sheet.md`
- `17-final-review-cheat-sheets.md`

## Instructions

- Time limit: 3 hours
- Work without internet
- Use only local documentation
- Verify every task
- Reboot when the task requires persistence
- Do not open the solution file until finished

## Lab Assumptions

- You have root access.
- You have two systems if the task requires remote work: `servera` and `serverb`.
- Adjust device names only if your lab uses different names.

## Tasks

1. Create a user `analyst1`, create a group `reporting`, add the user to that group, and configure password aging so the maximum age is 60 days, the minimum age is 7 days, and the warning period is 10 days.
2. Create a directory `/srv/reports` owned appropriately for the scenario above and make it usable by owner and group, but not writable by others.
3. Create a file `/srv/reports/weekly.txt` with at least three lines of text. Create both a hard link and a symbolic link to it under `/tmp/`.
4. Search `/etc/passwd` and save all lines ending in `bash` to `/tmp/bash-users.txt`. Save the number of matching lines to `/tmp/bash-users.count`.
5. Install a package that provides the `tree` command and verify it.
6. Create a shell script `/usr/local/bin/userreport.sh` that accepts one username as an argument and prints either `exists` or `missing`.
7. Configure a one-time `at` job that writes the hostname to `/tmp/at-proof.txt`.
8. Configure a recurring cron job for the current user that appends the date to `/tmp/cron-proof.txt` every 5 minutes.
9. Ensure the SSH service is running now and enabled at boot.
10. Configure SSH key-based access from `servera` to `serverb` for your lab user.
11. On a spare disk, create a GPT partition suitable for LVM, create volume group `vgmock`, and logical volume `lvdata` of 512M.
12. Create an XFS filesystem on `/dev/vgmock/lvdata`, mount it at `/data`, and configure it to mount persistently by UUID.
13. Add a swap area on a spare unused partition, activate it, and configure it persistently.
14. Configure the system hostname as `servera.lab.example`.
15. Configure a permanent firewall rule allowing HTTP service and verify it.
16. Verify SELinux mode, then restore default labels on `/var/www/html`.
17. Enable persistent system journal storage.
18. Reboot the system and verify all persistent tasks still work.

## Grader Mindset Checklist

- requested users, groups, directories, links, scripts, and files must exist
- package installation must be verifiable
- service state must be correct now and at boot
- storage layout must match requested names and sizes
- mount and swap must return after reboot
- firewall rule must persist
- hostname must persist
- journal persistence must be configured
- SSH key login should work

## Submission Method For Self-Study

Before checking the solution file, create your own proof log with commands such as:

```bash
id analyst1
ls -ld /srv/reports
ls -li /srv/reports/weekly.txt /tmp/weekly.txt.hard /tmp/weekly.txt.soft
rpm -q tree
systemctl is-enabled sshd
findmnt /data
swapon --show
hostnamectl
firewall-cmd --list-services
getenforce
ls -ld /var/log/journal
```

## Continue In Order

- Check your own proof commands first
- Open `19-mock-exam-1-solutions.md` only after you are fully done
