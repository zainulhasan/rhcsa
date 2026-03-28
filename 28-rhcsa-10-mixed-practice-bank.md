# RHCSA 10 Mixed Practice Bank

> Use this file when you want extra mixed RHCSA 10 practice built from repeated real-world exam-style patterns, but rewritten for learning, verification, and exam safety.

## At a Glance

**Purpose**

Give you an extra bank of mixed RHCSA 10 drills based on repeated high-value exam themes and administrative task patterns.

**Why this matters for RHCSA**

Many RHCSA learners can solve one topic at a time but slow down when the exam mixes storage, users, services, archives, and security in the same session. This file trains that mixed-task pressure.

**Real-world use**

Administrators rarely get tasks one chapter at a time. They are asked to create users, fix permissions, mount storage, restart services, and prove access in the same maintenance window.

**Prerequisites**

- Lessons `00-16`
- A RHEL-compatible lab VM with root access
- A second VM if you want to practice SSH-based tasks
- Basic comfort with `sudo`, `dnf`, `systemctl`, `tar`, `awk`, `sed`, `LVM`, `firewalld`, and SELinux

**Objectives covered**

- Essential tools and offline help
- Archives and text processing
- Users, groups, sudo, ACLs, and directory permissions
- Services, journald, cron, and time sync checks
- LVM, filesystems, and persistent mounts
- firewalld, SSH keys, and SELinux verification

**Commands/tools used**

`apropos`, `man`, `tar`, `awk`, `sed`, `dnf`, `systemctl`, `journalctl`, `timedatectl`, `chronyc`, `useradd`, `usermod`, `chage`, `setfacl`, `getfacl`, `pvcreate`, `vgcreate`, `lvcreate`, `mkfs.ext4`, `blkid`, `mount`, `findmnt`, `firewall-cmd`, `semanage`, `restorecon`, `ssh-keygen`, `ssh-copy-id`

**Offline help references for this topic**

- `man tar`
- `man awk`
- `man sed`
- `man systemctl`
- `man journald.conf`
- `man chage`
- `man setfacl`
- `man lvcreate`
- `man fstab`
- `man firewall-cmd`
- `man semanage-port`

**Estimated study time**

3 to 5 hours

**Study sequence note**

For the beginner route, this file comes after labs `22-26` and before the review files `17a` and `17`, even though the file number is higher.

**Common beginner mistakes**

- Solving only the main task and skipping verification
- Using temporary fixes when the task needs reboot persistence
- Forgetting to separate firewall checks from SELinux checks
- Editing a config file and forgetting to restart or reload the service
- Creating storage correctly but mounting it only for the current boot

## Concept Explanation In Simple Language

This file is not another full course. It is a pressure-tested reinforcement bank.

If you are a total beginner, do not start here. Finish the lesson path and section labs first, then return here for mixed-pressure practice.

If you are following the full route in order, the next steps after this file are:

1. `17a-rhcsa-command-reference-cheat-sheet.md`
2. `17-final-review-cheat-sheets.md`
3. `18-mock-exam-1.md`
4. `19-mock-exam-1-solutions.md`
5. `20-mock-exam-2.md`
6. `21-mock-exam-2-solutions.md`

The most useful RHCSA practice patterns repeat the same ideas over and over:

- find the right command without panic
- create and verify users and permissions
- package, start, and verify a service
- build storage from the block device upward
- make the result survive reboot
- prove access through both firewall and SELinux

That repetition is useful, but raw source material can become noisy. This file turns the repeated ideas into clean RHCSA 10 practice tasks with three rules:

1. every task must be explainable in plain English
2. every task must be verifiable with commands
3. every persistent task must be checked after reboot when practical

Use this file when you already know the basics and want more realistic, mixed practice.

## Command Breakdowns

### Find the right local help fast

```bash
apropos archive
man tar
tar --help
```

- `apropos archive` helps when you know the topic but not the command
- `man tar` gives full manual detail
- `tar --help` is faster when you only need option reminders

### Extract fields from `/etc/passwd`

```bash
awk -F: '{print $1, $7}' /etc/passwd
sed -n '1,5p' /etc/passwd
```

- `-F:` tells `awk` that fields are separated by colons
- `{print $1, $7}` prints username and shell
- `sed -n '1,5p'` prints only the first five lines

### Verify service state now and at boot

```bash
systemctl is-active httpd
systemctl is-enabled httpd
journalctl -u httpd -n 20
```

- `is-active` proves it is running now
- `is-enabled` proves it is configured for boot
- `journalctl -u` shows recent log messages for troubleshooting

### Build a persistent mount safely

```bash
blkid /dev/vgdata/lvdata
mount /data
findmnt /data
mount -a
```

- `blkid` finds UUID and filesystem type
- `findmnt` confirms the live mount
- `mount -a` safely tests `/etc/fstab` before reboot

### Treat firewall and SELinux as different checks

```bash
firewall-cmd --list-ports
semanage port -l | grep http_port_t
ss -tuln | grep :85
```

- firewall rules decide whether packets may enter
- SELinux labels decide whether the service is allowed to use that port or content
- `ss -tuln` proves the service is actually listening

## Worked examples

### Worked Example 1: Find the archive command without searching online

Task:

- You forgot how to list the contents of a compressed archive without extracting it.

Good process:

```bash
apropos archive
man tar
```

Then confirm the correct form:

```bash
tar -tzvf backup.tar.gz
```

Expected result:

- a list of files inside the archive
- no extraction happens

What failure looks like:

- wrong option order
- using `gzip` alone instead of `tar`

### Worked Example 2: Prove a mount is persistent

Task:

- You created an LV and filesystem, but you must prove `/data` is persistent.

Good process:

```bash
blkid /dev/vgdata/lvdata
sudoedit /etc/fstab
mount -a
findmnt /data
```

Expected result:

- no `mount -a` errors
- `findmnt /data` shows the mount
- `/etc/fstab` contains a correct UUID or label entry

### Worked Example 3: Verify custom web access correctly

Task:

- `httpd` should serve content on TCP port `85`.

Good process:

```bash
sudo semanage port -a -t http_port_t -p tcp 85
sudo firewall-cmd --add-port=85/tcp --permanent
sudo firewall-cmd --reload
sudo systemctl restart httpd
ss -tuln | grep :85
semanage port -l | grep http_port_t
curl http://localhost:85/
```

Expected result:

- `ss` shows port `85`
- SELinux port label exists
- `curl` returns the page

## Guided Hands-On Lab

### Lab Goal

Complete one mixed RHCSA 10 workflow that touches archives, users, storage, and service verification.

### Setup

- Work as a regular user until root is required
- Use a spare disk such as `/dev/vdb` if available
- If `httpd` is unavailable in your lab, skip only the service portion and still do the archive, user, and storage tasks

### Task Steps

1. Create `/root/reviewbundle.tgz` containing `/etc/ssh`.
2. Create group `reviewops`.
3. Create user `review1` with home `/srv/review1`, Bash shell, and membership in `reviewops`.
4. Set the account to expire in 45 days.
5. Create a collaborative directory `/srv/review-share` owned by group `reviewops` with SGID enabled.
6. Using a spare disk, create one PV, one VG named `vgreview`, and one LV named `lvreview`.
7. Format the LV as `ext4`.
8. Mount it persistently at `/reviewdata`.
9. Verify the mount with both `findmnt` and `/etc/fstab`.
10. If `httpd` is installed, verify whether it is active and enabled and inspect its recent logs.

### Expected Result

- archive exists and can be listed
- user and group are correct
- shared directory inherits the group
- storage is mounted persistently
- service verification commands are familiar

### Verification Commands

```bash
tar -tzvf /root/reviewbundle.tgz
id review1
chage -l review1
ls -ld /srv/review-share
vgs
lvs
findmnt /reviewdata
grep reviewdata /etc/fstab
systemctl is-active httpd
systemctl is-enabled httpd
```

### Cleanup

Keep the archive and storage if you want to reuse them. Remove the user, group, and mount only if you need to reset the lab.

## Independent Practice Tasks

### Priority Core Question Set

Start with these first. They cover the highest-value mixed RHCSA task flow.

1. Configure a static network connection with `nmcli`, set hostname resolution correctly for your lab, and verify the profile is active after reconnect or reboot.
2. Configure a working software repository, prove `dnf repolist` works, then install a required package.
3. Configure a web service so access succeeds only when service state, firewall rules, and SELinux settings are all correct.
4. Create a local user and group, set the required shell and home directory, and verify account data with commands instead of assumptions.
5. Create a collaborative directory for one group, apply SGID, and verify that new files inherit the correct group.
6. Configure `autofs` to mount an NFS path on demand and verify that the mount appears only when accessed.
7. Create a user-specific cron job, verify the right user owns it, and make sure the command uses safe full paths.
8. Grant one user access to another directory using ACLs, and make the rule apply to future files too.
9. Verify time synchronization using both `timedatectl` and `chronyc`, and confirm the time service is active and enabled.
10. Find files by age or name pattern, then copy only the intended matches to a staging directory.
11. Create a user with a specific UID and verify both the UID and the intended account properties.
12. Create a compressed archive with `tar`, then list its contents without extracting it.
13. Set a custom `umask`, create a test file, and explain the resulting default permissions.
14. Configure password or account expiration with `chage`, then prove the settings with `chage -l`.
15. Configure privileged access safely with `visudo` or a validated sudoers drop-in.
16. Write a simple shell script using positional parameters and at least one conditional or loop, then test it with different inputs.
17. Practice the root-password recovery workflow in your lab notes, but do it only on a disposable system snapshot.
18. Create and activate a new swap area, then make it persistent.
19. Build storage from PV to VG to LV, create a filesystem, mount it persistently, and verify it with `findmnt` and `/etc/fstab`.
20. Extend an existing logical volume and grow the filesystem without breaking the mount.

### Optional Or Version-Sensitive Question Set

Use these after the core tasks.

21. If your lab and exam version expect it, create or manage a VDO-backed volume.
22. If your build includes container objectives, run a container task separately and label it `Version-specific` in your notes.

### Extra Speed Drills

1. Use `apropos` and `man -k` to find the command family for scheduled jobs, then open the relevant manual pages.
2. Print only usernames and home directories from `/etc/passwd` using `awk`.
3. Print the first ten lines of `/etc/services` with `sed`.
4. Create `/root/etc-hosts.tgz` from `/etc/hosts` and list its contents without extracting it.
5. Create a user named `analyst1` with custom home `/projects/analyst1` and Bash shell.
6. Add `analyst1` to a supplementary group named `opslab` without replacing other supplementary groups.
7. Create a directory `/projects/shared` owned by group `opslab`, set group collaboration permissions, and add an ACL giving one extra user read-write access.
8. Ensure `chronyd` is active and enabled, then verify time sync using both `timedatectl` and `chronyc`.
9. Create a cron entry for user `analyst1` that appends the date to `/home/analyst1/cron.log` every 15 minutes.
10. Using spare storage, create an LV, format it as `xfs` or `ext4`, mount it persistently at `/projects/data`, and test with `mount -a`.
11. Configure `httpd` or another network service to start at boot, then verify both `is-active` and `is-enabled`.
12. Open TCP port `85` permanently in `firewalld`, add the SELinux HTTP port label if needed, and prove the service can use the port.
13. Create an SSH key pair for your current user and copy the public key to `serverb` if a second host exists.
14. Use `journalctl` to inspect the last twenty lines for `sshd` or `httpd`.
15. Reboot once and repeat the verification commands for any mount, service, or network configuration you changed.

## Verification Steps

1. Confirm every user task with `id`, `getent passwd`, and directory checks.
2. Confirm every storage task with both a live command such as `findmnt` and a persistent check in `/etc/fstab`.
3. Confirm every service task with both `systemctl is-active` and `systemctl is-enabled`.
4. Confirm every security-exposed service with both `firewall-cmd` and the relevant SELinux check.
5. Confirm every reboot-sensitive task again after reboot, not just before reboot.

## Troubleshooting Section

### Problem: repo or package command fails

Symptom:

- `dnf install` cannot find a package

Fix:

- run `dnf repolist`
- inspect repo files under `/etc/yum.repos.d/`
- confirm connectivity or local media source

### Problem: account looks wrong after `useradd`

Symptom:

- home path, shell, or groups are not what you expected

Fix:

- use `getent passwd USER`
- use `id USER`
- correct with `usermod` instead of deleting immediately unless the task allows recreation

### Problem: `/etc/fstab` entry breaks `mount -a`

Symptom:

- `mount -a` prints an error

Fix:

- re-check UUID with `blkid`
- confirm filesystem type
- confirm mount point exists
- fix the exact line before rebooting

### Problem: service starts but access still fails

Symptom:

- `systemctl status` looks good, but client access fails

Fix:

- verify listening socket with `ss -tuln`
- verify firewall runtime and permanent rules
- verify SELinux port and file labels
- check logs with `journalctl -u SERVICE`

### Problem: SSH key login still asks for a password

Symptom:

- key copy completed, but password prompt still appears

Fix:

- check the target username
- inspect `~/.ssh` permissions on the remote host
- verify the key exists in `authorized_keys`

## Common Mistakes And Recovery

- Mistake: solving the storage build but not the persistent mount.
  Recovery: make `blkid`, `/etc/fstab`, `mount -a`, and `findmnt` part of the same workflow every time.
- Mistake: enabling a firewall rule and forgetting SELinux.
  Recovery: always think in layers: service, socket, firewall, SELinux, then client test.
- Mistake: editing sudoers directly with a normal editor.
  Recovery: use `visudo` or a validated drop-in file under `/etc/sudoers.d/`.
- Mistake: using `chcon` for a change that must survive relabeling.
  Recovery: use `semanage fcontext` followed by `restorecon`.
- Mistake: reading answers too early.
  Recovery: write your own verification commands first, then compare.

## Mini Quiz

1. Which command proves a service is configured to start at boot?
2. Which command safely tests `/etc/fstab` without rebooting?
3. Which command shows account expiration details?
4. Which command shows recent logs for one systemd service?
5. Which command checks whether SELinux currently enforces policy?
6. Which command lists persistent firewall configuration for the current zone?

## Exam-Style Tasks

### Exam-Style Task 1

Create user `examuser` with custom home `/srv/examuser`, Bash shell, and supplementary group `examops`. Create `/srv/examshare` for that group with SGID enabled. Then create and mount a persistent filesystem at `/srv/examdata`.

Grader mindset checklist:

- user must exist
- home directory must be correct
- shell must be correct
- group membership must be correct
- shared directory must have SGID
- mount must exist now
- mount must still work after reboot

### Exam-Style Task 2

Configure a web service to use TCP port `85`, allow that port in `firewalld`, label it correctly in SELinux, and prove access locally.

Grader mindset checklist:

- service should be active
- service should be enabled if boot persistence is required
- listening socket should exist on port `85`
- firewall rule should exist
- SELinux port label should exist
- test command such as `curl` should succeed

## Answer key / solution guide

### Guided Lab Example Solution

```bash
sudo tar -czvf /root/reviewbundle.tgz /etc/ssh
sudo groupadd reviewops
sudo useradd -m -d /srv/review1 -s /bin/bash -G reviewops review1
sudo chage -E "$(date -d '+45 days' +%F)" review1
sudo mkdir -p /srv/review-share
sudo chgrp reviewops /srv/review-share
sudo chmod 2775 /srv/review-share
sudo pvcreate /dev/vdb
sudo vgcreate vgreview /dev/vdb
sudo lvcreate -n lvreview -L 1G vgreview
sudo mkfs.ext4 /dev/vgreview/lvreview
sudo mkdir -p /reviewdata
sudo blkid /dev/vgreview/lvreview
sudoedit /etc/fstab
sudo mount -a
findmnt /reviewdata
systemctl is-active httpd
systemctl is-enabled httpd
journalctl -u httpd -n 20
```

### Mini Quiz Answers

1. `systemctl is-enabled SERVICE`
2. `mount -a`
3. `chage -l USER`
4. `journalctl -u SERVICE`
5. `getenforce`
6. `firewall-cmd --list-all --permanent`

### Independent Practice Guidance

For the priority core question set and the extra speed drills, grade yourself this way:

- `2` if you completed it correctly without notes
- `1` if you needed help or retries
- `0` if you could not complete it

Write the score next to each task in your notes so you can see which objective group still needs repetition.

### Priority Question Planning Guide

Use this as a command-direction hint, not as a substitute for solving the task yourself.

- Network config: `nmcli connection show` -> `nmcli connection modify ...` -> `nmcli connection up NAME` -> `ip addr` -> `ip route`
- Repository config: inspect `/etc/yum.repos.d/` -> `dnf repolist` -> `dnf install PACKAGE`
- SELinux and firewall: `systemctl status SERVICE` -> `firewall-cmd` checks -> `semanage` checks -> `ss -tuln` -> client test
- Users and groups: `useradd` or `usermod` -> `id USER` -> `getent passwd USER`
- Collaborative directory: `groupadd` -> `mkdir` -> `chgrp` -> `chmod 2770` or similar -> `ls -ld`
- Autofs: install and enable `autofs` -> map file -> `systemctl restart autofs` -> access mount path -> `mount` or `findmnt`
- Cron: `crontab -e -u USER` or `crontab -u USER -l` -> confirm `crond` is active
- ACL: `setfacl` -> `getfacl`
- Time sync: `systemctl status chronyd` -> `timedatectl` -> `chronyc sources`
- Find and copy: `find` -> `cp` or `-exec cp`
- Specific UID user: `useradd -u UID` -> `id USER`
- Tar: `tar -czvf` -> `tar -tzvf`
- Umask: `umask` -> create file -> `ls -l`
- Expiration: `chage -E` or related option -> `chage -l`
- Sudo: `visudo` or drop-in -> `visudo -c`
- Script: shebang -> positional parameters -> `if` or `for` -> test with multiple arguments
- Root reset: document the recovery path for your exact lab build and practice only on snapshots
- Swap: `mkswap` -> `swapon` -> `/etc/fstab` -> `swapon --show`
- LVM: `pvcreate` -> `vgcreate` -> `lvcreate` -> `mkfs` -> `/etc/fstab` -> `mount -a`
- Extend LV: `lvextend` -> `xfs_growfs` or `resize2fs` -> verify with `lvs` and `df -h`

### Exam-Style Task 1 Example Solution

```bash
sudo groupadd examops
sudo useradd -m -d /srv/examuser -s /bin/bash -G examops examuser
sudo mkdir -p /srv/examshare
sudo chgrp examops /srv/examshare
sudo chmod 2775 /srv/examshare
sudo pvcreate /dev/vdb
sudo vgcreate vgexam /dev/vdb
sudo lvcreate -n lvexam -L 1G vgexam
sudo mkfs.ext4 /dev/vgexam/lvexam
sudo mkdir -p /srv/examdata
sudo blkid /dev/vgexam/lvexam
sudoedit /etc/fstab
sudo mount -a
findmnt /srv/examdata
```

### Exam-Style Task 2 Example Solution

```bash
sudo dnf install -y httpd
sudo semanage port -a -t http_port_t -p tcp 85
sudo firewall-cmd --add-port=85/tcp --permanent
sudo firewall-cmd --reload
sudo systemctl enable --now httpd
sudo ss -tuln | grep :85
sudo semanage port -l | grep http_port_t
sudo firewall-cmd --list-ports
curl http://localhost:85/
```

If `httpd` is configured to listen only on port `80`, also update the service configuration before restarting it.

## Recap / Memory Anchors

- mixed practice matters because the exam mixes topics
- local help first, guessing last
- current state and boot state are different checks
- firewall and SELinux are separate layers
- every persistent task needs a reboot-safe mindset

## Quick Command Summary

```bash
apropos KEYWORD
man COMMAND
tar -czvf archive.tgz DIR
tar -tzvf archive.tgz
awk -F: '{print $1, $7}' /etc/passwd
sed -n '1,10p' FILE
useradd -m -d /custom/home -s /bin/bash USER
usermod -aG GROUP USER
chage -l USER
setfacl -m u:USER:rwx DIR
getfacl DIR
systemctl is-active SERVICE
systemctl is-enabled SERVICE
journalctl -u SERVICE -n 20
timedatectl
chronyc sources
pvcreate DEVICE
vgcreate VG DEVICE
lvcreate -n LV -L 1G VG
mkfs.ext4 /dev/VG/LV
blkid /dev/VG/LV
mount -a
findmnt MOUNTPOINT
firewall-cmd --list-all --permanent
semanage port -l
restorecon -Rv PATH
ssh-keygen
ssh-copy-id USER@HOST
```

## Continue In Order

- Next file for the full beginner route: `17a-rhcsa-command-reference-cheat-sheet.md`
- Then use `17-final-review-cheat-sheets.md` before starting the mock exams
