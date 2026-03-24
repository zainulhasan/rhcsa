# RHCSA 10 Mixed Practice Bank From Playlist Analysis

> Use this file when you want extra mixed RHCSA 10 practice drawn from repeated topic patterns in the supplied YouTube playlists, but rewritten for learning, verification, and exam safety.

## At a Glance

**Purpose**

Give you an extra bank of mixed RHCSA 10 drills based on repeated themes found across the supplied playlists and subtitle material.

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

**Common beginner mistakes**

- Solving only the main task and skipping verification
- Using temporary fixes when the task needs reboot persistence
- Forgetting to separate firewall checks from SELinux checks
- Editing a config file and forgetting to restart or reload the service
- Creating storage correctly but mounting it only for the current boot

## Concept explanation in simple language

This file is not another full course. It is a pressure-tested reinforcement bank.

The supplied playlists repeat the same RHCSA patterns over and over:

- find the right command without panic
- create and verify users and permissions
- package, start, and verify a service
- build storage from the block device upward
- make the result survive reboot
- prove access through both firewall and SELinux

That repetition is useful, but raw video material can become noisy. This file turns the repeated ideas into clean RHCSA 10 practice tasks with three rules:

1. every task must be explainable in plain English
2. every task must be verifiable with commands
3. every persistent task must be checked after reboot when practical

Use this file when you already know the basics and want more realistic, mixed practice.

## Command breakdowns

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

## Guided hands-on lab

### Lab goal

Complete one mixed RHCSA 10 workflow that touches archives, users, storage, and service verification.

### Setup

- Work as a regular user until root is required
- Use a spare disk such as `/dev/vdb` if available
- If `httpd` is unavailable in your lab, skip only the service portion and still do the archive, user, and storage tasks

### Task steps

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

### Expected result

- archive exists and can be listed
- user and group are correct
- shared directory inherits the group
- storage is mounted persistently
- service verification commands are familiar

### Verification commands

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

## Independent practice tasks

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

## Verification steps

1. Confirm every user task with `id`, `getent passwd`, and directory checks.
2. Confirm every storage task with both a live command such as `findmnt` and a persistent check in `/etc/fstab`.
3. Confirm every service task with both `systemctl is-active` and `systemctl is-enabled`.
4. Confirm every security-exposed service with both `firewall-cmd` and the relevant SELinux check.
5. Confirm every reboot-sensitive task again after reboot, not just before reboot.

## Troubleshooting section

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

## Common mistakes and recovery

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

## Mini quiz

1. Which command proves a service is configured to start at boot?
2. Which command safely tests `/etc/fstab` without rebooting?
3. Which command shows account expiration details?
4. Which command shows recent logs for one systemd service?
5. Which command checks whether SELinux currently enforces policy?
6. Which command lists persistent firewall configuration for the current zone?

## Exam-style tasks

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

### Guided lab example solution

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

### Mini quiz answers

1. `systemctl is-enabled SERVICE`
2. `mount -a`
3. `chage -l USER`
4. `journalctl -u SERVICE`
5. `getenforce`
6. `firewall-cmd --list-all --permanent`

### Independent practice guidance

For tasks 1 to 15, grade yourself this way:

- `2` if you completed it correctly without notes
- `1` if you needed help or retries
- `0` if you could not complete it

Write the score next to each task in your notes so you can see which objective group still needs repetition.

### Exam-Style Task 1 example solution

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

### Exam-Style Task 2 example solution

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

## Recap / memory anchors

- mixed practice matters because the exam mixes topics
- local help first, guessing last
- current state and boot state are different checks
- firewall and SELinux are separate layers
- every persistent task needs a reboot-safe mindset

## Quick command summary

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
