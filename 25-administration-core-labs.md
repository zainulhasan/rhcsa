# Administration Core Labs

> Test your ability to manage software, write small scripts, control running systems, work with storage, configure filesystems, and use systemd-related tools.

## At a Glance

**Why this matters for RHCSA**

This is the center of the RHCSA exam. If you can perform these labs confidently, you are much closer to real exam readiness.

**Real-world use**

Admins install packages, automate checks, inspect logs, extend storage, mount filesystems, and keep services working after reboot.

**Estimated study time**

6 to 8 hours

## Prerequisites

- A working lab VM
- Preferably one extra disk on `servera`
- Foundation skills from earlier lessons or labs

## Objectives Covered

- Package and repository management
- Simple shell scripting
- Boot targets, logs, processes, and tuning
- GPT partitions, PV, VG, LV, and swap
- Filesystems, mounts, `/etc/fstab`, NFS, and autofs
- `at`, `cron`, `systemd`, `chronyd`, and bootloader checks

## Commands/Tools Used

`dnf`, `rpm`, `bash`, `grep`, `awk`, `bc`, `systemctl`, `journalctl`, `ps`, `kill`, `tuned-adm`, `parted`, `pvcreate`, `vgcreate`, `lvcreate`, `mkfs`, `mount`, `findmnt`, `blkid`, `crontab`, `at`, `timedatectl`, `chronyc`, `grubby`

## Offline Help References For This Topic

- `man dnf`
- `man bash`
- `man journalctl`
- `man parted`
- `man lvm`
- `man mount`
- `man fstab`
- `man crontab`
- `man systemctl`

## Common Beginner Mistakes

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

## Subtitle-derived practice set

These drills convert spoken RHCSA question patterns into clean, exam-usable tasks with persistence checks.

### Drill 1: Create a 1 GiB XFS partition and mount it persistently

As `root`, use an extra free disk such as `/dev/vdb`.

1. Create a GPT label if the disk is empty.
2. Create one 1 GiB partition.
3. Build an XFS filesystem on that partition.
4. Mount it at `/par1`.
5. Make the mount persistent using `UUID=`.
6. Test the entry without rebooting.

What to check before moving on:

- `lsblk -f` shows the partition and filesystem
- `findmnt /par1` shows the live mount
- `/etc/fstab` contains the right UUID and filesystem type

### Drill 2: Add swap without removing current swap

As `root`:

1. Create a new partition of about `750 MiB` on a free disk.
2. Mark it for swap use if your tool requires that step.
3. Create swap on it.
4. Activate it.
5. Make it persistent in `/etc/fstab`.

What to check before moving on:

- existing swap remains active
- the new swap area appears in `swapon --show`
- `/etc/fstab` contains a correct swap entry

### Drill 3: Argument-based script with directory test

As a regular user, create `~/bin/checkdir.sh`.

Requirements:

1. Accept two command-line arguments.
2. If the first argument is an existing directory, print `directory exists`.
3. Otherwise create a new directory using the second argument and print `directory created`.

What to check before moving on:

- the script is executable
- it behaves differently for existing and non-existing directories
- you can explain `$1`, `$2`, and `-d`

### Drill 4: Count arguments and warn if there are too many

As a regular user, create `~/bin/argcount.sh`.

Requirements:

1. Count total command-line arguments.
2. If the count is greater than five, print `too many arguments`.
3. Otherwise print the count.

What to check before moving on:

- you can explain `$#`
- the greater-than-five case works
- the smaller case works too

### Drill 5: For-loop file processing

As a regular user, create `~/bin/fileloop.sh`.

Requirements:

1. Loop over all arguments passed to the script.
2. Print a long listing only for arguments that are regular files.
3. Count how many valid regular files were found.
4. Print the final count.

What to check before moving on:

- the script uses a `for` loop
- non-file arguments do not break it
- the final count is correct

## Repo-derived RHCSA 10 practice set

These drills were selected from external RHCSA study repos and kept only when they still match the current RHCSA 10 objective set.

### Drill 6: User-specific cron and `@reboot`

As `root`:

1. Create a cron entry for user `natasha` that writes `exam in progress` to the system log every 5 minutes.
2. Add a second cron entry for the same user that runs a simple script at reboot.
3. Verify the user-specific crontab without editing the wrong account.

What to check before moving on:

- the crontab belongs to `natasha`
- the `@reboot` entry uses a full command path
- `crond` is active

### Drill 7: Configure a chrony client

As `root`:

1. Ensure `chronyd` is installed if your lab requires that step.
2. Enable and start `chronyd`.
3. Inspect `/etc/chrony.conf` and identify the active `server` or `pool` lines.
4. Restart `chronyd`.
5. Verify time-source visibility with `chronyc`.

What to check before moving on:

- `chronyd` is active and enabled
- `chronyc sources` shows usable source information
- `timedatectl` reflects NTP use

### Drill 8: Create an LV by extents and custom PE size

As `root`, use a spare disk or partition.

1. Create a volume group named `vgi` with PE size `16M`.
2. Create a logical volume named `lvi` with `60` extents.
3. Format it as `ext4`.
4. Mount it persistently at `/record`.

What to check before moving on:

- `vgs` shows the PE size you intended
- `lvs` shows the LV
- `/etc/fstab` and `findmnt /record` both confirm the mount

### Drill 9: `httpd` on custom port and custom document root

As `root`:

1. Install `httpd` if it is not already installed.
2. Reconfigure Apache to listen on port `93`.
3. Use `/tekup/html` as the content directory.
4. Label the content correctly with SELinux.
5. Open port `93` permanently in the firewall.
6. Restart `httpd` and verify with `curl`.

What to check before moving on:

- `ss -tuln` shows port `93`
- `semanage port -l` shows the HTTP SELinux port label
- `curl http://localhost:93/` returns your test page

### Drill 10: Autofs home-style mount

Use two VMs if possible, a server and a client.

Server side:

1. Export `/remoteuser` by NFS.

Client side:

1. Install `autofs`.
2. Create a map so `user20` is automatically mounted under `/remoteuser/user20`.
3. Ensure `autofs` starts automatically at boot.

What to check before moving on:

- the NFS export exists on the server
- `autofs` is active and enabled on the client
- accessing `/remoteuser/user20` triggers the mount

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

### Subtitle-derived practice set solutions

#### Drill 1 example solution

```bash
sudo parted /dev/vdb --script mklabel gpt mkpart primary xfs 1MiB 1025MiB
sudo mkfs.xfs /dev/vdb1
sudo mkdir -p /par1
UUID=$(sudo blkid -s UUID -o value /dev/vdb1)
echo "UUID=$UUID /par1 xfs defaults 0 0" | sudo tee -a /etc/fstab
sudo mount -a
findmnt /par1
lsblk -f /dev/vdb
```

Verification:

- `findmnt /par1` should show the mounted filesystem
- `grep /par1 /etc/fstab` should show the persistent entry

#### Drill 2 example solution

```bash
sudo parted /dev/vdb --script mkpart primary linux-swap 1025MiB 1775MiB
sudo mkswap /dev/vdb2
sudo swapon /dev/vdb2
UUID=$(sudo blkid -s UUID -o value /dev/vdb2)
echo "UUID=$UUID none swap defaults 0 0" | sudo tee -a /etc/fstab
swapon --show
free -h
```

Verification:

- `swapon --show` should list both old and new swap if one already existed
- `grep swap /etc/fstab` should show the new persistent line

#### Drill 3 example solution

```bash
mkdir -p ~/bin
cat > ~/bin/checkdir.sh <<'EOF'
#!/bin/bash
if [ -d "$1" ]; then
  echo "directory exists"
else
  mkdir -p "$2"
  echo "directory created"
fi
EOF
chmod +x ~/bin/checkdir.sh
~/bin/checkdir.sh /tmp /tmp/unused
~/bin/checkdir.sh /tmp/not-there /tmp/newdir
```

Verification:

- the first run should print `directory exists`
- the second run should create `/tmp/newdir`

#### Drill 4 example solution

```bash
cat > ~/bin/argcount.sh <<'EOF'
#!/bin/bash
if [ "$#" -gt 5 ]; then
  echo "too many arguments"
else
  echo "$#"
fi
EOF
chmod +x ~/bin/argcount.sh
~/bin/argcount.sh one two
~/bin/argcount.sh one two three four five six
```

Verification:

- small input should print the count
- more than five args should print `too many arguments`

#### Drill 5 example solution

```bash
cat > ~/bin/fileloop.sh <<'EOF'
#!/bin/bash
count=0
for item in "$@"; do
  if [ -f "$item" ]; then
    ls -l "$item"
    count=$((count + 1))
  fi
done
echo "file count: $count"
EOF
chmod +x ~/bin/fileloop.sh
touch /tmp/a /tmp/b
~/bin/fileloop.sh /tmp/a /tmp/b /tmp/nope /etc/passwd
```

Verification:

- only real files should be listed
- the final count should match the listed files

### Repo-derived RHCSA 10 practice set solutions

#### Drill 6 example solution

```bash
sudo systemctl is-active crond
sudo crontab -e -u natasha
sudo crontab -l -u natasha
```

Example entries:

```text
*/5 * * * * /usr/bin/logger "exam in progress"
@reboot /bin/bash /usr/local/bin/startup-check.sh
```

Verification:

- `sudo crontab -l -u natasha` should show both entries
- `systemctl is-active crond` should report `active`

#### Drill 7 example solution

```bash
sudo dnf install -y chrony
sudo systemctl enable --now chronyd
grep -E '^(server|pool)' /etc/chrony.conf
sudo systemctl restart chronyd
chronyc sources -v
chronyc tracking
timedatectl
```

Verification:

- `systemctl is-enabled chronyd` should report `enabled`
- `chronyc` commands should show source and tracking data

#### Drill 8 example solution

```bash
sudo vgcreate -s 16M vgi /dev/vdb1
sudo lvcreate -l 60 -n lvi vgi
sudo mkfs.ext4 /dev/vgi/lvi
sudo mkdir -p /record
UUID=$(sudo blkid -s UUID -o value /dev/vgi/lvi)
echo "UUID=$UUID /record ext4 defaults 0 0" | sudo tee -a /etc/fstab
sudo mount -a
vgs vgi
lvs /dev/vgi/lvi
findmnt /record
```

Verification:

- `vgs` should show PE size `16.00m`
- `findmnt /record` should show the mounted LV

#### Drill 9 example solution

```bash
sudo dnf install -y httpd
sudo sed -i 's/^Listen 80$/Listen 93/' /etc/httpd/conf/httpd.conf
sudo mkdir -p /tekup/html
echo "RHCSA custom web root" | sudo tee /tekup/html/index.html
sudo semanage port -a -t http_port_t -p tcp 93
sudo semanage fcontext -a -t httpd_sys_content_t '/tekup/html(/.*)?'
sudo restorecon -Rv /tekup/html
sudo firewall-cmd --add-port=93/tcp --permanent
sudo firewall-cmd --reload
sudo systemctl enable --now httpd
sudo systemctl restart httpd
curl http://localhost:93/
```

Note:

- if your lab question explicitly requires a `DocumentRoot` change, update `/etc/httpd/conf/httpd.conf` and its matching `<Directory>` block as well

Verification:

- `ss -tuln | grep :93` should show a listener
- `curl` should return your test page content

#### Drill 10 example solution

Server:

```bash
sudo dnf install -y nfs-utils
sudo mkdir -p /remoteuser/user20
echo '/remoteuser *(rw,no_root_squash)' | sudo tee -a /etc/exports
sudo firewall-cmd --add-service={rpc-bind,mountd,nfs} --permanent
sudo firewall-cmd --reload
sudo exportfs -arv
sudo systemctl enable --now nfs-server
```

Client:

```bash
sudo dnf install -y nfs-utils autofs
echo '/remoteuser /etc/auto.remoteuser' | sudo tee -a /etc/auto.master
echo 'user20 -rw SERVER:/remoteuser/user20' | sudo tee /etc/auto.remoteuser
sudo systemctl enable --now autofs
ls /remoteuser/user20
mount | grep remoteuser
```

Verification:

- replace `SERVER` with the real server hostname or IP
- `systemctl is-enabled autofs` should report `enabled`
- accessing the path should trigger the automount

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
