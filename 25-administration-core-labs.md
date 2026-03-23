# 1. Title

Administration Core Labs

# 2. Purpose

Test your ability to manage software, write small scripts, control running systems, work with storage, configure filesystems, and use systemd-related tools.

# 3. Why this matters for RHCSA

This is the center of the RHCSA exam. If you can perform these labs confidently, you are much closer to real exam readiness.

# 4. Real-world use

Admins install packages, automate checks, inspect logs, extend storage, mount filesystems, and keep services working after reboot.

# 5. Prerequisites

- A working lab VM
- Preferably one extra disk on `servera`
- Foundation skills from earlier lessons or labs

# 6. Objectives covered

- Package and repository management
- Simple shell scripting
- Boot targets, logs, processes, and tuning
- GPT partitions, PV, VG, LV, and swap
- Filesystems, mounts, `/etc/fstab`, NFS, and autofs
- `at`, `cron`, `systemd`, `chronyd`, and bootloader checks

# 7. Commands/tools used

`dnf`, `rpm`, `bash`, `grep`, `awk`, `bc`, `systemctl`, `journalctl`, `ps`, `kill`, `tuned-adm`, `parted`, `pvcreate`, `vgcreate`, `lvcreate`, `mkfs`, `mount`, `findmnt`, `blkid`, `crontab`, `at`, `timedatectl`, `chronyc`, `grubby`

# 8. Offline help references for this topic

- `man dnf`
- `man bash`
- `man journalctl`
- `man parted`
- `man lvm`
- `man mount`
- `man fstab`
- `man crontab`
- `man systemctl`

# 9. Estimated study time

6 to 8 hours

# 10. Common beginner mistakes

- Installing a package but not verifying it
- Writing a script without executable permission
- Creating an LV but forgetting the filesystem
- Mounting a filesystem but not making it persistent
- Creating cron entries without checking the daemon or full command paths

## Concept explanation in simple language

This lab file is about the middle of RHCSA: packages, automation, storage, services, and persistence.

Most failures here come from incomplete workflows. For example:

- package installed, but repo was not configured correctly
- logical volume created, but no filesystem was built
- filesystem mounted now, but not after reboot
- service started now, but not enabled at boot

These labs are built to force complete workflows, not half-finished tasks.

## Command breakdowns

### Check repos and packages

```bash
dnf repolist
rpm -q bash
```

### Simple scripting helpers

```bash
bc <<< '2 + 3'
grep root <<< "root:x:0:0"
```

### Build a small LVM stack

```bash
pvcreate /dev/vdb1
vgcreate vgdata /dev/vdb1
lvcreate -n lvdata -L 1G vgdata
```

### Make mounts persistent

```bash
blkid
mount -a
findmnt /data
```

## Worked examples

### Worked Example 1: Verify a package and its source tools

```bash
dnf repolist
rpm -q bash
```

Verification:

- package query should succeed
- repo output should be understandable in your lab

### Worked Example 2: Create a tiny admin script

```bash
printf '#!/bin/bash\necho \"host=$(hostname)\"\n' > ~/hostcheck.sh
chmod +x ~/hostcheck.sh
~/hostcheck.sh
```

Verification:

- script runs and prints the current hostname

### Worked Example 3: Verify a mount correctly

```bash
findmnt /data
grep /data /etc/fstab
```

Verification:

- one command proves current mount
- one command proves persistent config

## Guided hands-on lab

### Lab goal

Perform a complete admin workflow covering packages, scripting, storage, mounts, and services.

### Setup

Use a VM with an extra empty disk if possible.

### Task steps

1. Query package repositories.
2. Install one small package if available in your lab.
3. Create a shell script that prints the hostname and current date.
4. Make it executable and run it.
5. Inspect running processes and identify one process by name.
6. Read logs for one service with `journalctl`.
7. On the extra disk, create a GPT partition.
8. Create a PV, VG, and LV.
9. Create an XFS or ext4 filesystem on the LV.
10. Mount it at `/data`.
11. Add a persistent mount entry using UUID or label.
12. Test `/etc/fstab` with `mount -a`.
13. Create a cron or `at` test job.
14. Check `chronyd` status.
15. Reboot and confirm the mount and any enabled service still work.

### Expected result

- you can complete a multi-topic admin workflow end to end

### Verification commands

```bash
rpm -q PACKAGE
ls -l ~/hostcheck.sh
journalctl -u sshd -b | head
lsblk -f
findmnt /data
grep /data /etc/fstab
crontab -l
timedatectl
```

### Cleanup

You may keep the filesystem and script if they are useful for later labs.

## Independent practice tasks

1. Create a `.repo` file for a lab repository if your environment provides one.
2. Write a script that accepts one argument and reports whether it is a file.
3. Use `bc` in a script or one-line test.
4. Start a background process and then terminate it safely.
5. Create and activate a swap area on a second device or partition.
6. Extend an existing logical volume and grow the filesystem.
7. Create a cron line that appends the date to a file.
8. Check bootloader defaults safely with `grubby`.

## Verification steps

1. Confirm you can distinguish between package install, package query, and repo query.
2. Confirm you can prove both the current mount and the persistent mount.
3. Confirm you can explain the order: partition -> PV -> VG -> LV -> filesystem -> mount.
4. Confirm you can prove service state now and at boot with `systemctl`.

## Troubleshooting section

### Problem: package install fails

Symptom:

- `dnf install` cannot find the package

Fix:

- verify repositories with `dnf repolist`
- check package name spelling with `dnf search`

### Problem: script does not run

Symptom:

- permission denied or command not found

Fix:

- use `chmod +x`
- run it as `./scriptname`

### Problem: mount fails

Symptom:

- `mount -a` reports an error

Fix:

- check filesystem type
- verify UUID with `blkid`
- review `/etc/fstab` carefully

### Problem: service not persistent

Symptom:

- service worked before reboot, not after

Fix:

- verify `systemctl is-enabled SERVICE`
- enable it if needed

### Problem: cron job not running

Symptom:

- expected output file is not created

Fix:

- check `crond`
- use full command paths
- wait enough time for the schedule

## Common mistakes and recovery

- Mistake: forgetting to create the filesystem on a new LV.
  Recovery: run `lsblk -f` and identify missing filesystem signatures.
- Mistake: writing `/etc/fstab` entries from memory without checking `blkid`.
  Recovery: copy exact UUIDs and test with `mount -a`.
- Mistake: reading only `systemctl status` and not checking `is-enabled`.
  Recovery: always verify current state and boot persistence separately.

## Mini quiz

1. What command queries an installed RPM package?
2. What command tests `/etc/fstab` without rebooting?
3. What is the correct order for building an LVM-backed filesystem?
4. What command checks whether a service is enabled at boot?
5. Why is `blkid` useful in storage labs?

## Exam-style tasks

### Exam-Style Task 1

Create a new logical volume from an extra disk, build a filesystem on it, mount it at `/data`, and make sure it mounts automatically after reboot.

Grader mindset checklist:

- partition, PV, VG, and LV must exist
- filesystem must exist on the LV
- mountpoint must exist
- `/etc/fstab` must contain a correct entry
- mount must still work after reboot

### Exam-Style Task 2

Create a small custom admin script, enable a service if needed, and schedule a simple time-based task to prove you can automate and verify work.

Grader mindset checklist:

- script file must exist
- it must run correctly
- service state should be verifiable
- scheduler configuration should exist
- output or logs should prove the job ran

## Answer key / solution guide

### Mini quiz answers

1. `rpm -q PACKAGE`
2. `mount -a`
3. partition -> PV -> VG -> LV -> filesystem -> mount
4. `systemctl is-enabled SERVICE`
5. It shows UUIDs and filesystem details for persistent mount work.

### Exam-Style Task 1 example solution

```bash
sudo parted /dev/vdb --script mklabel gpt mkpart primary 1MiB 2GiB
sudo pvcreate /dev/vdb1
sudo vgcreate vgdata /dev/vdb1
sudo lvcreate -n lvdata -L 1G vgdata
sudo mkfs.xfs /dev/vgdata/lvdata
sudo mkdir -p /data
UUID=$(blkid -s UUID -o value /dev/vgdata/lvdata)
echo "UUID=$UUID /data xfs defaults 0 0" | sudo tee -a /etc/fstab
sudo mount -a
findmnt /data
```

### Exam-Style Task 2 example solution

```bash
printf '#!/bin/bash\necho \"$(date) $(hostname)\" >> /tmp/host-report.txt\n' > ~/hostreport.sh
chmod +x ~/hostreport.sh
systemctl is-active sshd
(crontab -l 2>/dev/null; echo "*/5 * * * * /bin/bash $HOME/hostreport.sh") | crontab -
crontab -l
```

## Recap / memory anchors

- repo, package, script, mount, persistence
- LVM is a chain, not one command
- test `/etc/fstab` before reboot
- verify `is-active` and `is-enabled`

## Quick command summary

```bash
dnf repolist
rpm -q bash
chmod +x script.sh
bc <<< '2 + 3'
journalctl -u sshd -b
parted /dev/vdb
pvcreate /dev/vdb1
vgcreate vgdata /dev/vdb1
lvcreate -n lvdata -L 1G vgdata
mkfs.xfs /dev/vgdata/lvdata
blkid
mount -a
findmnt /data
crontab -l
timedatectl
grubby --default-kernel
```
