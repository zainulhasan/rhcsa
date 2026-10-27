---
description: A bank of mixed practice tasks grouped by RHEL 10 EX200 objective, each with exact values, a grader checklist, hints and a collapsed solution with verification.
---

# 28 RHCSA 10 Mixed Practice Bank

> By the end of this bank you can solve tasks from several objective groups in one sitting, prove each result with commands, and confirm it survives a reboot.

!!! example "Try it now (2 minutes)"
    ```bash
    systemctl is-active sshd
    systemctl is-enabled sshd
    ```
    ```text title="Example output"
    active
    enabled
    ```
    Notice that these are two different questions: "is it running now?" and "will it start at boot?". Every task in this bank asks you to answer both kinds of question.

## Why it matters

Many learners can solve one topic at a time but slow down when storage, users, services, archives and security are mixed in the same session. Administrators rarely get tasks one chapter at a time: they create users, fix permissions, mount storage, restart services and prove access in the same maintenance window. This bank trains that mixed-task pressure, and it is not another full course.

**Objectives covered:** every group on the RHEL 10 EX200 list, using the official wording (see the index table below):

- Understand and use essential tools
- Manage software
- Create simple shell scripts
- Operate running systems
- Configure local storage
- Create and configure file systems
- Deploy, configure, and maintain systems
- Manage basic networking
- Manage users and groups
- Manage security

**Prereqs:** lessons `00-16` and labs [22 Labs Track](22-labs-track-and-skill-check-guide.md) to [26 Networking, Users, and Security Labs](26-networking-users-and-security-labs.md) · **Time:** about 3 to 5 hours

!!! note "Where this fits"
    If you are a total beginner, do not start here. Finish the lesson path and the section labs first, then return for mixed-pressure practice. In the full route this file comes after labs `22-26` and before the review files `17a` and `17`, even though its file number is higher. Your next steps after this file are `17a`, `17`, then the mock exams `18` to `21`.

## How to use this bank

- **Work on `servera`** as `student` with `sudo`, in the shared lab environment from [23 VM Lab Setup and Baseline Checks](23-vm-lab-setup-and-baseline-checks.md): `servera.lab.example` (`192.168.122.10`), `serverb.lab.example` (`192.168.122.11`), spare disks `/dev/vdb` and `/dev/vdc` (2 GiB each, empty), root password `redhat`.
- **Each task has a Setup line.** It creates the users, groups, packages and files the task needs, so you never depend on another task. Setup commands are safe to run twice.
- **Three rules for every task:** you can explain it in plain English, you can verify it with commands, and (when it should persist) you check it again after a reboot.
- **Read nothing but the task** until you have tried it. Open a hint first, the solution last.
- **Self-score** each task: `2` if you finished it correctly without notes, `1` if you needed a hint or retries, `0` if you could not finish it. This is this course's own practice scheme, nothing more. Write the score beside the task ID and repeat the groups where you scored `0` or `1`.

Some tasks need `serverb` to resolve by name. Run this once on `servera` (and on `serverb` for `servera` where a task says so):

```bash
grep -q serverb.lab.example /etc/hosts || echo '192.168.122.11 serverb.lab.example serverb' | sudo tee -a /etc/hosts
```

??? warning "Disk reset (destroys everything on the disk)"
    Every storage task in this bank starts from a clean disk. Run this before each storage task that names `/dev/vdb`; for the swap task that names `/dev/vdc`, replace `vdb` with `vdc` wherever it appears. Afterwards remove any related lines from `/etc/fstab` (mount points `/reviewdata`, `/srv/examdata`, `/appdata`, `/projects/data`, and old swap lines for the disk) with `sudo vi /etc/fstab`, then run `sudo systemctl daemon-reload`.
    ```bash
    sudo umount /reviewdata /srv/examdata /appdata /projects/data 2>/dev/null
    sudo swapoff /dev/vdb* 2>/dev/null
    sudo vgremove -ff -y vgdata vgexam vgreview vgapp vgproj 2>/dev/null
    sudo wipefs -a /dev/vdb[0-9]* /dev/vdb 2>/dev/null
    sudo partprobe /dev/vdb
    ```

## Index: task to objective

Task IDs: `G` guided lab, `P` priority core set, `S` speed drills, `M` mixed tasks, `O` optional (not scored).

| ID | Task | Objective group | Official objective |
|---|---|---|---|
| G | Archive, user, shared dir, LVM, persistent mount, service check | Mixed | several (see below) |
| P1 | Static `nmcli` profile, hostname and `/etc/hosts` | Manage basic networking | Configure IPv4 and IPv6 addresses; Configure hostname resolution |
| P2 | Working repository from local media, install a package | Manage software | Configure access to RPM repositories |
| P3 | Web service with custom content directory | Manage security | List and identify SELinux file and process context; Restore default file contexts |
| P4 | User and group with exact attributes | Manage users and groups | Create, delete, and modify local user accounts |
| P5 | Collaborative directory with SGID | Create and configure file systems | Diagnose and correct file permission problems |
| P6 | Autofs on-demand NFS mount | Create and configure file systems | Configure autofs |
| P7 | User cron job | Deploy, configure, and maintain systems | Schedule tasks using at, cron and systemd timer units |
| P8 | ACL with a default ACL | Create and configure file systems | Diagnose and correct file permission problems |
| P9 | Time sync verification | Deploy, configure, and maintain systems | Configure time service clients |
| P10 | Find files by age and copy them | Understand and use essential tools | Create, delete, copy, and move files and directories |
| P11 | User with a fixed UID | Manage users and groups | Create, delete, and modify local user accounts |
| P12 | Compressed archive with bzip2 | Understand and use essential tools | Archive, compress, unpack, and uncompress files using tar, gzip, and bzip2 |
| P13 | Custom `umask` | Manage security | Manage default file permissions |
| P14 | Password aging and account expiry | Manage users and groups | Change passwords and adjust password aging for local user accounts |
| P15 | Sudo drop-in | Manage users and groups | Configure privileged access |
| P16 | Script with parameters, test and loop | Create simple shell scripts | Process script inputs; Conditionally execute code; Use Looping constructs |
| P17 | Root password recovery (snapshot only) | Operate running systems | Interrupt the boot process in order to gain access to a system |
| P18 | New swap, persistent | Configure local storage | Add new partitions and logical volumes, and swap to a system non-destructively |
| P19 | PV, VG, LV, XFS, persistent mount | Configure local storage | Create and remove physical volumes; Create and delete logical volumes; Configure systems to mount file systems at boot by universally unique ID (UUID) or label |
| P20 | Extend an LV and its filesystem | Create and configure file systems | Extend existing logical volumes |
| S1 | Find the scheduling manual pages | Understand and use essential tools | Locate, read, and use system documentation including man, info, and files in /usr/share/doc |
| S2 | Usernames and homes with `awk` | Understand and use essential tools | Use grep and regular expressions to analyze text |
| S3 | First ten lines with `sed` | Understand and use essential tools | Use grep and regular expressions to analyze text |
| S4 | Tar a single file and list it | Understand and use essential tools | Archive, compress, unpack, and uncompress files using tar, gzip, and bzip2 |
| S5 | User with custom home | Manage users and groups | Create, delete, and modify local user accounts |
| S6 | Add a supplementary group | Manage users and groups | Create, delete, and modify local groups and group memberships |
| S7 | Group directory plus an extra ACL user | Create and configure file systems | Diagnose and correct file permission problems |
| S8 | `chronyd` active, enabled, verified | Deploy, configure, and maintain systems | Configure time service clients |
| S9 | Cron entry every 15 minutes | Deploy, configure, and maintain systems | Schedule tasks using at, cron and systemd timer units |
| S10 | LV mounted persistently | Configure local storage | Configure systems to mount file systems at boot by universally unique ID (UUID) or label |
| S11 | Service enabled at boot | Deploy, configure, and maintain systems | Start and stop services and configure services to start automatically at boot |
| S12 | TCP port 85: firewall plus SELinux label | Manage security | Configure firewall settings using firewall-cmd/firewalld; Manage SELinux port labels |
| S13 | SSH key pair copied to `serverb` | Manage security | Configure key-based authentication for SSH |
| S14 | Last twenty journal lines for one unit | Operate running systems | Locate and interpret system log files and journals |
| S15 | Reboot and re-verify | Operate running systems | Boot, reboot, and shut down a system normally |
| M1 | User, shared directory and persistent filesystem | Mixed | users, permissions, storage |
| M2 | Web service on TCP port 85 end to end | Mixed | services, firewall, SELinux |
| O1 | VDO-backed volume (optional) | Optional | not on the RHEL 10 list |
| O2 | Container task (Bonus) | Optional | not on the RHEL 10 list |

**Commands and tools used:** `apropos`, `man`, `tar`, `awk`, `sed`, `dnf`, `systemctl`, `journalctl`, `timedatectl`, `chronyc`, `useradd`, `usermod`, `chage`, `setfacl`, `getfacl`, `pvcreate`, `vgcreate`, `lvcreate`, `mkfs.ext4`, `blkid`, `mount`, `findmnt`, `firewall-cmd`, `semanage`, `restorecon`, `ssh-keygen`, `ssh-copy-id`

**Offline help for this bank:** `man tar`, `man awk`, `man sed`, `man systemctl`, `man journald.conf`, `man chage`, `man setfacl`, `man lvcreate`, `man fstab`, `man firewall-cmd`, `man semanage-port`

## How it works

Think in layers. A task is only finished when every layer you touched is correct, now and after a reboot.

```mermaid
flowchart LR
  A[Do the task] --> B[Check it now]
  B --> C[Make it persist]
  C --> D[Reboot]
  D --> E[Check it again]
```

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
sudo blkid /dev/vgdata/lvdata
sudo mount -a
findmnt /data
```

- `blkid` finds UUID and filesystem type (use `sudo`, the device node is root-only)
- `mount -a` safely tests `/etc/fstab` before reboot
- `findmnt` confirms the live mount

### Treat firewall and SELinux as different checks

```bash
firewall-cmd --list-ports
sudo semanage port -l | grep http_port_t
ss -tuln | grep :85
```

- firewall rules decide whether packets may enter
- SELinux labels decide whether the service is allowed to use that port or content
- `ss -tuln` proves the service is actually listening

## Worked examples

### Worked example 1: Find the archive command without searching online

Task: you forgot how to list the contents of a compressed archive without extracting it.

```bash
apropos archive
man tar
tar -tzvf backup.tar.gz
```

Expected result: a list of files inside the archive and no extraction. What failure looks like: wrong option order, or using `gzip` alone instead of `tar`.

### Worked example 2: Prove a mount is persistent

Task: you created an LV and filesystem, and you must prove `/data` is persistent.

```bash
sudo blkid /dev/vgdata/lvdata
echo "UUID=$(sudo blkid -s UUID -o value /dev/vgdata/lvdata) /data ext4 defaults 0 0" | sudo tee -a /etc/fstab
sudo mount -a
findmnt /data
```

Expected result: no `mount -a` errors, `findmnt /data` shows the mount, and `/etc/fstab` contains a correct UUID entry.

### Worked example 3: Verify custom web access correctly

Task: `httpd` should serve content on TCP port `85`. The `Listen` line is part of the task: `httpd` listens on port `80` until you change it.

```bash
echo 'Listen 85' | sudo tee /etc/httpd/conf.d/listen85.conf
sudo semanage port -a -t http_port_t -p tcp 85
sudo firewall-cmd --add-port=85/tcp --permanent
sudo firewall-cmd --reload
sudo systemctl restart httpd
ss -tuln | grep :85
semanage port -l | grep http_port_t
curl http://localhost:85/
```

Expected result: `ss` shows port `85`, the SELinux port label exists, and `curl` returns the page.

## Guided hands-on lab (G)

**Goal:** complete one mixed workflow that touches archives, users, storage and service verification.

**Setup:** `servera` as `student`; clean `/dev/vdb` (run the Disk reset above); install the web server so step 10 has something to check: `sudo dnf install -y httpd`.

**Task:**

- [ ] 1. Create `/root/reviewbundle.tgz` containing `/etc/ssh`.
- [ ] 2. Create group `reviewops`.
- [ ] 3. Create user `review1` with home `/srv/review1`, Bash shell, and membership in `reviewops`.
- [ ] 4. Set the account to expire in 45 days.
- [ ] 5. Create a collaborative directory `/srv/review-share` owned by group `reviewops` with SGID enabled.
- [ ] 6. On `/dev/vdb`, create one PV, one VG named `vgreview`, and one 1 GiB LV named `lvreview`.
- [ ] 7. Format the LV as `ext4`.
- [ ] 8. Mount it persistently at `/reviewdata` by UUID.
- [ ] 9. Verify the mount with both `findmnt` and `/etc/fstab`.
- [ ] 10. Verify whether `httpd` is active and enabled, then enable and start it, and inspect its recent logs.

Expected result: the archive exists and can be listed, user and group are correct, the shared directory inherits the group, storage is mounted persistently, and `httpd` is active and enabled.

??? question "Hint 1"
    The whole `/dev/vdb` disk can be the PV (no partition needed). Create the PV, then the VG, then the LV, in that order.

??? question "Hint 2"
    For `/etc/fstab` you need the UUID of the LV, from `sudo blkid`. Test the line with `sudo mount -a` before you reboot.

??? success "Solution"
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
    echo "UUID=$(sudo blkid -s UUID -o value /dev/vgreview/lvreview) /reviewdata ext4 defaults 0 0" | sudo tee -a /etc/fstab
    sudo systemctl daemon-reload
    sudo mount -a
    findmnt /reviewdata
    systemctl is-active httpd
    systemctl is-enabled httpd
    sudo systemctl enable --now httpd
    journalctl -u httpd -n 20
    ```
    **Verify:**
    ```bash
    tar -tzvf /root/reviewbundle.tgz | head
    id review1
    sudo chage -l review1
    ls -ld /srv/review-share
    sudo vgs vgreview
    sudo lvs vgreview
    findmnt /reviewdata
    grep reviewdata /etc/fstab
    systemctl is-active httpd
    systemctl is-enabled httpd
    ```
    `ls -ld` should show `drwxrwsr-x ... reviewops`. `chage -l` should show an account expiry date 45 days away. Reboot and run `findmnt /reviewdata` and `systemctl is-active httpd` again.

    Cleanup: keep the archive and storage if you want to reuse them. To reset, use the Disk reset block and `sudo userdel -r review1; sudo groupdel reviewops`.

## Priority core set, by objective group

Start here. These tasks cover the highest-value mixed flow. Scored `0/1/2`.

### Group: Understand and use essential tools

#### P10 Find files by age and copy only the matches

**Setup:**

```bash
mkdir -p /srv/findlab/src /srv/findlab/staging
touch -d '10 days ago' /srv/findlab/src/old1.log /srv/findlab/src/old2.log /srv/findlab/src/old3.txt
touch /srv/findlab/src/new.log
```

**Task:** copy only the `*.log` files in `/srv/findlab/src` that were modified more than 7 days ago into `/srv/findlab/staging`.

- [ ] `/srv/findlab/staging` holds `old1.log` and `old2.log`
- [ ] `new.log` and `old3.txt` were not copied
- [ ] the originals are still in `/srv/findlab/src`

??? question "Hint 1"
    `find` can filter on name and on modification age, and run a command on each match.

??? success "Solution"
    ```bash
    find /srv/findlab/src -name '*.log' -mtime +7 -exec cp -t /srv/findlab/staging {} +
    ls /srv/findlab/staging /srv/findlab/src
    ```
    **Verify:** `ls /srv/findlab/staging` prints exactly `old1.log` and `old2.log`.

#### P12 Compressed archive with bzip2

**Setup:** none beyond the shared environment.

**Task:** create `/var/tmp/sshconf.tar.bz2` from `/etc/ssh` using bzip2 compression, list its contents without extracting, then extract only `etc/ssh/sshd_config` into `/var/tmp/restore`.

- [ ] `/var/tmp/sshconf.tar.bz2` exists and is bzip2 data
- [ ] the listing shows paths under `etc/ssh/`
- [ ] `/var/tmp/restore/etc/ssh/sshd_config` exists and nothing else was extracted

??? success "Solution"
    ```bash
    sudo tar -cjvf /var/tmp/sshconf.tar.bz2 /etc/ssh
    tar -tjvf /var/tmp/sshconf.tar.bz2 | head
    mkdir -p /var/tmp/restore
    tar -xjvf /var/tmp/sshconf.tar.bz2 -C /var/tmp/restore etc/ssh/sshd_config
    find /var/tmp/restore -type f
    file /var/tmp/sshconf.tar.bz2
    ```
    **Verify:** `find` prints one file, `file` says `bzip2 compressed data`. (`tar` strips the leading `/` from member names, so you ask for `etc/ssh/sshd_config`.)

### Group: Manage software

#### P2 Configure a working repository and install a package

**Setup:** attach the RHEL installation ISO to `servera` as `/dev/sr0` (virt-manager: CD-ROM device, or `virsh attach-disk`). If your lab has no ISO, point `baseurl` at your network mirror instead and keep the rest. <!-- VERIFY: ISO layout BaseOS and AppStream directories and RPM-GPG-KEY-redhat-release on the RHEL 10 DVD -->

**Task:** mount `/dev/sr0` read-only at `/mnt/dvd` (persistently), create `/etc/yum.repos.d/lab-local.repo` with repo IDs `lab-baseos` (`file:///mnt/dvd/BaseOS`) and `lab-appstream` (`file:///mnt/dvd/AppStream`), then install the package `tree` from it.

- [ ] `/mnt/dvd` is mounted and the entry is in `/etc/fstab`
- [ ] `dnf repolist` lists `lab-baseos` and `lab-appstream`
- [ ] `rpm -q tree` succeeds and `rpm -qf /usr/bin/tree` returns `tree`

??? question "Hint 1"
    A `.repo` file needs a section name in brackets, `name=`, `baseurl=`, `enabled=1` and `gpgcheck`. With `gpgcheck=1` you also need a `gpgkey=` line.

??? success "Solution"
    ```bash
    sudo mkdir -p /mnt/dvd
    echo '/dev/sr0 /mnt/dvd iso9660 ro,defaults 0 0' | sudo tee -a /etc/fstab
    sudo systemctl daemon-reload
    sudo mount -a
    findmnt /mnt/dvd
    sudo tee /etc/yum.repos.d/lab-local.repo <<'EOF'
    [lab-baseos]
    name=Lab BaseOS
    baseurl=file:///mnt/dvd/BaseOS
    enabled=1
    gpgcheck=1
    gpgkey=file:///mnt/dvd/RPM-GPG-KEY-redhat-release

    [lab-appstream]
    name=Lab AppStream
    baseurl=file:///mnt/dvd/AppStream
    enabled=1
    gpgcheck=1
    gpgkey=file:///mnt/dvd/RPM-GPG-KEY-redhat-release
    EOF
    sudo dnf clean all
    dnf repolist
    sudo dnf install -y tree
    ```
    **Verify:** `rpm -q tree`, `rpm -qf /usr/bin/tree`, and `findmnt /mnt/dvd` after a reboot.

### Group: Create simple shell scripts

#### P16 Script with parameters, a test and a loop

**Setup:** none.

**Task:** write `/usr/local/bin/countlines.sh`. It takes one directory as `$1`. With no argument it prints `usage: countlines.sh DIR` and exits `1`. If the argument is not a directory it prints `not a directory: DIR` and exits `2`. Otherwise it prints, for every regular file directly inside the directory, the file name and its line count, then `files: N` with the number of files.

- [ ] no argument gives the usage line and exit status `1`
- [ ] `/nonexistent` gives the error line and exit status `2`
- [ ] `/etc/skel` prints one line per regular file and a final `files: N`

??? question "Hint 1"
    `"$1"` is the first argument, `[ -z "$1" ]` tests for empty, `[ -d "$1" ]` tests for a directory, `$?` holds the last exit status, and `wc -l < FILE` prints just the number.

??? success "Solution"
    ```bash
    sudo tee /usr/local/bin/countlines.sh >/dev/null <<'EOF'
    #!/bin/bash
    if [ -z "$1" ]; then
        echo "usage: countlines.sh DIR"
        exit 1
    fi
    if [ ! -d "$1" ]; then
        echo "not a directory: $1"
        exit 2
    fi
    n=0
    for f in "$1"/*; do
        [ -f "$f" ] || continue
        echo "$(basename "$f") $(wc -l < "$f")"
        n=$((n + 1))
    done
    echo "files: $n"
    EOF
    sudo chmod 755 /usr/local/bin/countlines.sh
    countlines.sh; echo "exit=$?"
    countlines.sh /nonexistent; echo "exit=$?"
    countlines.sh /etc/skel; echo "exit=$?"
    ```
    **Verify:** the three runs print `exit=1`, `exit=2`, `exit=0`.

### Group: Operate running systems

#### P17 Root password recovery (disposable snapshot only)

**Setup:** take a VM snapshot of `servera` first (see [23 VM Lab Setup and Baseline Checks](23-vm-lab-setup-and-baseline-checks.md)). Do this only on a throwaway copy. Work at the VM console, not over SSH.

**Task:** pretend you do not know the root password. Interrupt the boot, set the root password to `RecoverMe#1`, make sure SELinux relabels on the next boot, and log in as root with the new password. Then restore the snapshot (or set the password back to `redhat`).

- [ ] you reached a root shell without logging in
- [ ] `/.autorelabel` was created before rebooting
- [ ] you can log in as root with `RecoverMe#1`

??? question "Hint 1"
    Interrupt GRUB at the boot menu, edit the kernel line for one boot only, and ask the initramfs to stop before the real system starts. The real root filesystem is mounted read-only under `/sysroot`.

??? success "Solution"
    1. Reboot. At the GRUB menu press `e` on the default entry.
    2. Go to the line that starts with `linux`, press `End`, and append ` rd.break`.
    3. Press `Ctrl+x` to boot. You get the `switch_root:/#` prompt.
    ```bash
    mount -o remount,rw /sysroot
    chroot /sysroot
    echo 'root:RecoverMe#1' | chpasswd
    touch /.autorelabel
    exit
    exit
    ```
    The system continues to boot, relabels the filesystem and reboots again. **Verify:** log in as `root` with `RecoverMe#1`, then run `getenforce`. <!-- VERIFY: rd.break still drops to the switch_root prompt on RHEL 10 and the relabel runs on the next boot -->

### Group: Configure local storage

Every storage task starts from a clean disk. Use the Disk reset block above before each one.

#### P18 Create new swap and make it persistent

**Setup:** clean `/dev/vdc` (Disk reset with `vdc`).

**Task:** create a 512 MiB GPT partition `/dev/vdc1` for swap, create the swap signature, activate it, and make it persistent by UUID.

- [ ] `swapon --show` lists `/dev/vdc1`
- [ ] `/etc/fstab` has a `UUID=... none swap defaults 0 0` line for it
- [ ] after a reboot `swapon --show` still lists `/dev/vdc1`

??? question "Hint 1"
    Read the UUID with `blkid` only after `mkswap`; before that the partition has no UUID yet.

??? success "Solution"
    ```bash
    sudo parted --script /dev/vdc mklabel gpt
    sudo parted --script /dev/vdc mkpart swap1 linux-swap 1MiB 513MiB
    sudo partprobe /dev/vdc
    sudo udevadm settle
    sudo mkswap /dev/vdc1
    echo "UUID=$(sudo blkid -s UUID -o value /dev/vdc1) none swap defaults 0 0" | sudo tee -a /etc/fstab
    sudo systemctl daemon-reload
    sudo swapon -a
    swapon --show
    free -h
    ```
    **Verify:** `swapon --show` lists `/dev/vdc1` with SIZE `512M`; `grep swap /etc/fstab` shows a non-empty `UUID=`. Reboot and check again.

#### P19 Build PV, VG, LV, filesystem and a persistent mount

**Setup:** clean `/dev/vdb` (Disk reset).

**Task:** on `/dev/vdb` create one 1 GiB GPT partition with the `lvm` flag, a PV on it, a VG named `vgapp`, and a 600 MiB LV named `lvapp`. Put an XFS filesystem on it and mount it at `/appdata` by UUID.

- [ ] `pvs`, `vgs` and `lvs` show `/dev/vdb1`, `vgapp` and `lvapp` (600.00m)
- [ ] `findmnt /appdata` shows an `xfs` mount
- [ ] `/etc/fstab` has a UUID line for `/appdata`, and `sudo mount -a` prints no error

??? success "Solution"
    ```bash
    sudo parted --script /dev/vdb mklabel gpt
    sudo parted --script /dev/vdb mkpart primary 1MiB 1025MiB
    sudo parted --script /dev/vdb set 1 lvm on
    sudo partprobe /dev/vdb
    sudo udevadm settle
    sudo pvcreate /dev/vdb1
    sudo vgcreate vgapp /dev/vdb1
    sudo lvcreate -n lvapp -L 600M vgapp
    sudo mkfs.xfs /dev/vgapp/lvapp
    sudo mkdir -p /appdata
    echo "UUID=$(sudo blkid -s UUID -o value /dev/vgapp/lvapp) /appdata xfs defaults 0 0" | sudo tee -a /etc/fstab
    sudo systemctl daemon-reload
    sudo mount -a
    findmnt /appdata
    sudo findmnt --verify
    ```
    **Verify:** `sudo lvs vgapp`, `df -h /appdata`, then reboot and run `findmnt /appdata` again.

### Group: Create and configure file systems

#### P5 Collaborative directory with SGID

**Setup:**

```bash
sudo groupadd -f labteam
id alice &>/dev/null || sudo useradd -m alice
id bob &>/dev/null || sudo useradd -m bob
sudo usermod -aG labteam alice
sudo usermod -aG labteam bob
```

**Task:** create `/srv/labteam-share` owned by `root:labteam`, with mode `2770`, so that files created by `alice` and `bob` inherit group `labteam`.

- [ ] `ls -ld /srv/labteam-share` shows `drwxrws---` and group `labteam`
- [ ] a file created by `alice` there is owned by group `labteam`
- [ ] a user outside `labteam` cannot list the directory

??? success "Solution"
    ```bash
    sudo mkdir -p /srv/labteam-share
    sudo chgrp labteam /srv/labteam-share
    sudo chmod 2770 /srv/labteam-share
    ls -ld /srv/labteam-share
    sudo -u alice touch /srv/labteam-share/alice.txt
    ls -l /srv/labteam-share
    ```
    **Verify:** `alice.txt` shows `alice labteam`. `sudo -u student ls /srv/labteam-share` is denied.

#### P6 Autofs on-demand NFS mount

**Setup:** two machines. Run the hosts line from "How to use this bank" on `servera`. On `serverb`:

```bash
sudo dnf install -y nfs-utils
sudo mkdir -p /srv/nfsshare
echo 'nfs ok' | sudo tee /srv/nfsshare/hello.txt
echo '/srv/nfsshare 192.168.122.0/24(rw,sync)' | sudo tee /etc/exports.d/nfsshare.exports
sudo systemctl enable --now nfs-server
sudo exportfs -rav
sudo firewall-cmd --add-service=nfs --permanent
sudo firewall-cmd --reload
```

On `servera`: `sudo dnf install -y autofs nfs-utils`.

**Task:** on `servera`, use an indirect autofs map so that `serverb.lab.example:/srv/nfsshare` mounts on demand at `/shares/nfsdata` (options `rw,sync`). The mount must not exist until you access the path.

- [ ] `findmnt /shares/nfsdata` shows nothing before access
- [ ] `ls /shares/nfsdata` shows `hello.txt` and triggers the mount
- [ ] `systemctl is-enabled autofs` returns `enabled`

??? question "Hint 1"
    Two files: a master map snippet in `/etc/auto.master.d/` ending in `.autofs` that names the parent directory and the map file, and the map file itself with the key (`nfsdata`), options and source.

??? success "Solution"
    ```bash
    echo '/shares /etc/auto.shares' | sudo tee /etc/auto.master.d/shares.autofs
    echo 'nfsdata -rw,sync serverb.lab.example:/srv/nfsshare' | sudo tee /etc/auto.shares
    sudo systemctl enable --now autofs
    findmnt /shares/nfsdata || echo "not mounted yet (correct)"
    ls /shares/nfsdata
    findmnt /shares/nfsdata
    ```
    **Verify:** `findmnt` shows `serverb.lab.example:/srv/nfsshare` of type `nfs4` after the `ls`. Reboot `servera` and repeat. <!-- VERIFY: showmount -e depends on rpcbind and mountd; this task avoids it by using NFSv4 only -->

#### P8 ACL with a default ACL

**Setup:**

```bash
sudo groupadd -f labteam
id alice &>/dev/null || sudo useradd -m alice
id bob &>/dev/null || sudo useradd -m bob
sudo mkdir -p /srv/acl-demo
sudo chown alice:labteam /srv/acl-demo
sudo chmod 770 /srv/acl-demo
```

**Task:** give `bob` read-write-execute access to `/srv/acl-demo` with an ACL, and also make `bob` get access to files created there in the future.

- [ ] `getfacl /srv/acl-demo` lists `user:bob:rwx` and `default:user:bob:rwx`
- [ ] `sudo -u bob touch /srv/acl-demo/b.txt` works
- [ ] a file created later by `alice` carries a `user:bob` ACL entry

??? success "Solution"
    ```bash
    sudo setfacl -m u:bob:rwx /srv/acl-demo
    sudo setfacl -d -m u:bob:rwx /srv/acl-demo
    getfacl /srv/acl-demo
    sudo -u bob touch /srv/acl-demo/b.txt
    sudo -u alice touch /srv/acl-demo/a.txt
    getfacl /srv/acl-demo/a.txt
    ```
    **Verify:** `getfacl /srv/acl-demo/a.txt` shows `user:bob:rw-`. (The `+` at the end of `ls -l` mode strings means an ACL exists.)

#### P20 Extend a logical volume and its filesystem

**Setup:** clean `/dev/vdb` (Disk reset), then build the starting point:

```bash
sudo parted --script /dev/vdb mklabel gpt mkpart primary 1MiB 1025MiB set 1 lvm on
sudo partprobe /dev/vdb && sudo udevadm settle
sudo pvcreate /dev/vdb1 && sudo vgcreate vgapp /dev/vdb1
sudo lvcreate -n lvapp -L 300M vgapp
sudo mkfs.ext4 /dev/vgapp/lvapp
sudo mkdir -p /appdata
echo "UUID=$(sudo blkid -s UUID -o value /dev/vgapp/lvapp) /appdata ext4 defaults 0 0" | sudo tee -a /etc/fstab
sudo systemctl daemon-reload && sudo mount -a
```

**Task:** grow `lvapp` to 500 MiB and grow the ext4 filesystem with it, while `/appdata` stays mounted.

- [ ] `lvs vgapp` shows `lvapp` at `500.00m`
- [ ] `df -h /appdata` shows about 480M total
- [ ] `/appdata` was never unmounted

??? question "Hint 1"
    One `lvextend` option grows the filesystem in the same step.

??? success "Solution"
    ```bash
    sudo lvextend -r -L 500M /dev/vgapp/lvapp
    sudo lvs vgapp
    df -h /appdata
    ```
    Two-step alternative: `sudo lvextend -L 500M /dev/vgapp/lvapp` then `sudo resize2fs /dev/vgapp/lvapp` (for XFS use `sudo xfs_growfs /appdata`). **Verify:** reboot and run `df -h /appdata` again.

### Group: Deploy, configure, and maintain systems

#### P7 User cron job

**Setup:** `id alice &>/dev/null || sudo useradd -m alice`

**Task:** as user `alice`, schedule `/usr/bin/date >> /home/alice/cron-p7.log` every 10 minutes using full paths, and prove the cron service is running and enabled.

- [ ] `sudo crontab -u alice -l` shows `*/10 * * * * /usr/bin/date >> /home/alice/cron-p7.log`
- [ ] the entry belongs to `alice`, not to `root`
- [ ] `crond` is active and enabled

??? success "Solution"
    ```bash
    echo '*/10 * * * * /usr/bin/date >> /home/alice/cron-p7.log' | sudo crontab -u alice -
    sudo crontab -u alice -l
    systemctl is-active crond
    systemctl is-enabled crond
    ```
    **Verify:** after the next 10-minute mark, `cat /home/alice/cron-p7.log` has a date line.

#### P9 Verify time synchronization

**Setup:** none.

**Task:** make sure `chronyd` is active and enabled, then prove time is synchronized with both `timedatectl` and `chronyc`.

- [ ] `systemctl is-active chronyd` returns `active` and `is-enabled` returns `enabled`
- [ ] `timedatectl` shows `System clock synchronized: yes` and `NTP service: active`
- [ ] `chronyc sources` lists at least one source, and `chronyc tracking` shows a `Leap status`

??? success "Solution"
    ```bash
    sudo systemctl enable --now chronyd
    systemctl is-active chronyd
    systemctl is-enabled chronyd
    timedatectl
    chronyc sources
    chronyc tracking
    ```
    **Verify:** if the lab has no internet, a source may show as unreachable (`?`). In that case point chrony at a lab source with a `server` line in `/etc/chrony.conf` and `sudo systemctl restart chronyd`.

### Group: Manage basic networking

#### P1 Static `nmcli` profile, hostname and local name resolution

**Setup:** work at the VM console or keep the address unchanged (this task re-applies `192.168.122.10`, so SSH survives).

**Task:** on `servera`, make the active Ethernet profile static: address `192.168.122.10/24`, gateway `192.168.122.1`, DNS `192.168.122.1`, method manual. Set the hostname to `servera.lab.example`. Add `192.168.122.11 serverb.lab.example serverb` to `/etc/hosts`. Prove it survives a reconnect and a reboot.

- [ ] `nmcli -g ipv4.method connection show NAME` prints `manual`
- [ ] `ip -4 addr` shows `192.168.122.10/24` on the interface and `ip route` shows default via `192.168.122.1`
- [ ] `hostnamectl --static` prints `servera.lab.example`, and `getent hosts serverb.lab.example` prints `192.168.122.11`

??? question "Hint 1"
    Find the profile name with `nmcli -t -f NAME,TYPE connection show --active`. Changes made with `nmcli connection modify` only apply after the profile is brought up again.

??? success "Solution"
    ```bash
    CON=$(nmcli -t -f NAME,TYPE connection show --active | awk -F: '$2=="802-3-ethernet"{print $1; exit}')
    echo "profile: $CON"
    sudo nmcli connection modify "$CON" ipv4.method manual ipv4.addresses 192.168.122.10/24 ipv4.gateway 192.168.122.1 ipv4.dns 192.168.122.1
    sudo nmcli connection up "$CON"
    sudo hostnamectl set-hostname servera.lab.example
    grep -q serverb.lab.example /etc/hosts || echo '192.168.122.11 serverb.lab.example serverb' | sudo tee -a /etc/hosts
    nmcli connection show "$CON" | grep ipv4
    ip -4 addr
    ip route
    hostnamectl
    getent hosts serverb.lab.example
    ping -c 2 serverb.lab.example
    ```
    **Verify:** reboot, then repeat `ip -4 addr`, `hostnamectl --static` and `getent hosts serverb.lab.example`.

### Group: Manage users and groups

#### P4 User and group with exact attributes

**Setup:** none. If `alice` already exists from another task, run `sudo userdel -r alice` first.

**Task:** create group `labteam` with GID `3000`. Create user `alice` with home `/srv/alice`, shell `/bin/bash`, comment `Alice Lab`, and supplementary group `labteam`. Verify with commands, not assumptions.

- [ ] `getent group labteam` shows GID `3000`
- [ ] `getent passwd alice` shows home `/srv/alice` and shell `/bin/bash`
- [ ] `id alice` lists `labteam`, and `ls -ld /srv/alice` shows it owned by `alice`

??? success "Solution"
    ```bash
    sudo groupadd -g 3000 labteam
    sudo useradd -m -d /srv/alice -s /bin/bash -c 'Alice Lab' -G labteam alice
    getent group labteam
    getent passwd alice
    id alice
    ls -ld /srv/alice
    ```
    **Verify:** run the four checks again after a reboot (account data lives in `/etc/passwd` and `/etc/group`, so it persists).

#### P11 User with a specific UID

**Setup:** none.

**Task:** create user `carol` with UID `2501`, comment `Carol Lab`, and default shell and home.

- [ ] `id carol` shows `uid=2501(carol)`
- [ ] `getent passwd carol` shows `/home/carol`
- [ ] `/home/carol` exists and is owned by `carol`

??? success "Solution"
    ```bash
    sudo useradd -u 2501 -m -c 'Carol Lab' carol
    id carol
    getent passwd carol
    ls -ld /home/carol
    ```
    **Verify:** the `id` output shows `uid=2501(carol) gid=2501(carol)` or similar.

#### P14 Password aging and account expiry

**Setup:** `id dana &>/dev/null || sudo useradd -m dana; echo 'dana:Pass#1234' | sudo chpasswd`

**Task:** for user `dana` set a maximum password age of `60` days, a minimum of `7`, a warning of `10`, and an account expiry date 90 days from today.

- [ ] `sudo chage -l dana` shows maximum `60`, minimum `7`, warning `10`
- [ ] "Account expires" shows a date 90 days away
- [ ] you can explain the difference between password aging and account expiry

??? success "Solution"
    ```bash
    sudo chage -M 60 -m 7 -W 10 -E "$(date -d '+90 days' +%F)" dana
    sudo chage -l dana
    ```
    **Verify:** `chage -l` output has `Password expires`, `Account expires` and the three numbers. The data is stored in `/etc/shadow`, so it persists.

#### P15 Privileged access with a sudo drop-in

**Setup:**

```bash
sudo groupadd -f webadmins
id carol &>/dev/null || sudo useradd -m carol
sudo usermod -aG webadmins carol
```

**Task:** members of group `webadmins` must be able to run any command as root with `sudo` (password required). Use a drop-in file `/etc/sudoers.d/webadmins` and validate it.

- [ ] `sudo visudo -c` reports all files parsed OK
- [ ] `sudo -l -U carol` shows `(ALL) ALL`
- [ ] `/etc/sudoers.d/webadmins` has mode `0440`

??? success "Solution"
    ```bash
    sudo visudo -f /etc/sudoers.d/webadmins
    ```
    In the editor, type `%webadmins ALL=(ALL) ALL`, save and quit. Or without an editor:
    ```bash
    echo '%webadmins ALL=(ALL) ALL' | sudo tee /etc/sudoers.d/webadmins
    sudo chmod 440 /etc/sudoers.d/webadmins
    sudo visudo -cf /etc/sudoers.d/webadmins
    sudo visudo -c
    sudo -l -U carol
    ls -l /etc/sudoers.d/webadmins
    ```
    **Verify:** `sudo -l -U carol` prints the rule; the file is mode `-r--r-----`.

### Group: Manage security

#### P3 Web service with a custom content directory

**Setup:** `sudo dnf install -y httpd`; run the hosts line (see "How to use this bank") on `serverb` for `servera` if you test from there.

**Task:** make `httpd` serve `/srv/webcontent/index.html` (text `p3 ok`) on port `80`. Change `DocumentRoot` to `/srv/webcontent` and its `<Directory>` block, give the directory a persistent SELinux label, open the firewall for HTTP permanently, and enable the service at boot. Test from `serverb`.

- [ ] `curl http://servera.lab.example/` returns `p3 ok` from `serverb`
- [ ] `ls -Zd /srv/webcontent` shows `httpd_sys_content_t`
- [ ] `httpd` is active and enabled, and `firewall-cmd --list-services --permanent` includes `http`

??? question "Hint 1"
    Test with SELinux in enforcing mode and think in layers: service, socket, firewall, SELinux label, client test. A `Permission denied` in `journalctl -u httpd` or a `403` usually means a wrong file label.

??? success "Solution"
    ```bash
    sudo mkdir -p /srv/webcontent
    echo 'p3 ok' | sudo tee /srv/webcontent/index.html
    sudo sed -i 's|^DocumentRoot "/var/www/html"|DocumentRoot "/srv/webcontent"|; s|<Directory "/var/www/html">|<Directory "/srv/webcontent">|' /etc/httpd/conf/httpd.conf
    sudo httpd -t
    sudo dnf install -y policycoreutils-python-utils
    sudo semanage fcontext -a -t httpd_sys_content_t '/srv/webcontent(/.*)?'
    sudo restorecon -Rv /srv/webcontent
    sudo systemctl enable --now httpd
    sudo firewall-cmd --add-service=http --permanent
    sudo firewall-cmd --reload
    ls -Zd /srv/webcontent /srv/webcontent/index.html
    curl http://localhost/
    ```
    From `serverb`: `curl http://servera.lab.example/`. **Verify:** reboot `servera` and run the `curl` again; also `systemctl is-enabled httpd`.

#### P13 Custom `umask`

**Setup:** `id alice &>/dev/null || sudo useradd -m alice`

**Task:** make `alice` get default permissions that deny all access to "others": files `640`, directories `750`. Prove it with a new file and a new directory.

- [ ] `umask` for `alice` prints `0027`
- [ ] a new file is `-rw-r-----` and a new directory is `drwxr-x---`
- [ ] the setting is in `/home/alice/.bashrc` so it persists

??? question "Hint 1"
    The umask is subtracted from `666` for files and `777` for directories. Which umask removes the permissions for others and write for the group?

??? success "Solution"
    ```bash
    echo 'umask 027' | sudo tee -a /home/alice/.bashrc
    sudo -iu alice bash -c 'umask; touch t.txt; mkdir d; ls -ld t.txt d'
    ```
    **Verify:** `umask` prints `0027`; `t.txt` is `-rw-r-----`; `d` is `drwxr-x---`. A fresh login picks up the setting from `~/.bashrc`.

### Optional or version-sensitive tasks (not scored)

#### O1 VDO-backed volume (optional)

These tasks are not on the RHEL 10 list. Skip them if your lab image has no VDO support.

**Setup:** clean `/dev/vdb` (Disk reset), a 1 GiB LVM partition `/dev/vdb1` as a PV, and a VG named `vgvdo` on it. <!-- VERIFY: LVM-VDO syntax and kernel module availability on RHEL 10 -->

**Task:** create a VDO logical volume `lvvdo` with 800 MiB physical size and 2 GiB virtual size, format it with XFS (`-K`), and mount it at `/vdo`.

??? success "Solution"
    ```bash
    sudo parted --script /dev/vdb mklabel gpt mkpart primary 1MiB 1025MiB set 1 lvm on
    sudo partprobe /dev/vdb
    sudo pvcreate /dev/vdb1
    sudo vgcreate vgvdo /dev/vdb1
    sudo lvcreate --type vdo -n lvvdo -L 800M -V 2G vgvdo
    sudo mkfs.xfs -K /dev/vgvdo/lvvdo
    sudo mkdir -p /vdo
    sudo mount /dev/vgvdo/lvvdo /vdo
    findmnt /vdo
    ```
    Make it persistent like any other mount (UUID line in `/etc/fstab`). Clean up with the Disk reset block plus `vgvdo` added to the `vgremove` line.

#### O2 Container task (Bonus)

**Bonus (optional, not on the RHEL 10 list).** Excluded from scoring. See [15a Containers with Podman](15a-containers-with-podman.md).

**Setup:** `sudo dnf install -y podman`; internet access to pull the image.

**Task:** run the image `registry.access.redhat.com/ubi10/httpd-24` as a container named `web1`, publishing host port `8080` to container port `8080`, and fetch the page with `curl`. <!-- VERIFY: image name and port for the RHEL 10 UBI httpd image -->

??? success "Solution"
    ```bash
    sudo dnf install -y podman
    podman run -d --name web1 -p 8080:8080 registry.access.redhat.com/ubi10/httpd-24
    podman ps
    curl -sI http://localhost:8080/ | head -n 1
    podman stop web1 && podman rm web1
    ```

## Extra speed drills, by objective group

Short tasks. Aim for a few minutes each. Same scoring.

### Group: Understand and use essential tools

#### S1 Find the scheduling manual pages

**Task:** using only local help, find the command family for scheduled jobs and open three relevant manual pages.

- [ ] you named at least `crontab`, `at` and `systemd.timer`
- [ ] you opened each page with `man`

??? success "Solution"
    ```bash
    man -k schedul
    man 5 crontab
    man at
    man systemd.timer
    ```
    If `man -k` returns nothing, run `sudo mandb` first and retry.

#### S2 Usernames and home directories with `awk`

**Task:** print only the username and home directory of every account, separated by a space.

- [ ] output is one `name /home/dir` pair per line

??? success "Solution"
    ```bash
    awk -F: '{print $1, $6}' /etc/passwd
    ```

#### S3 First ten lines with `sed`

**Task:** print the first ten lines of `/etc/services` using `sed`.

- [ ] exactly ten lines are printed

??? success "Solution"
    ```bash
    sed -n '1,10p' /etc/services
    ```

#### S4 Tar a single file and list it

**Task:** create `/root/etc-hosts.tgz` from `/etc/hosts` and list its contents without extracting.

- [ ] the listing shows `etc/hosts`
- [ ] nothing was extracted

??? success "Solution"
    ```bash
    sudo tar -czvf /root/etc-hosts.tgz /etc/hosts
    sudo tar -tzvf /root/etc-hosts.tgz
    ```

### Group: Manage users and groups

#### S5 User with a custom home

**Task:** create user `analyst1` with custom home `/projects/analyst1` and shell `/bin/bash`.

- [ ] `getent passwd analyst1` shows `/projects/analyst1` and `/bin/bash`
- [ ] `/projects/analyst1` exists and is owned by `analyst1`

??? success "Solution"
    ```bash
    sudo mkdir -p /projects
    sudo useradd -m -d /projects/analyst1 -s /bin/bash analyst1
    getent passwd analyst1
    ls -ld /projects/analyst1
    ```

#### S6 Add a supplementary group without replacing the others

**Setup:** user `analyst1` from S5 (`id analyst1 &>/dev/null || { sudo mkdir -p /projects; sudo useradd -m -d /projects/analyst1 -s /bin/bash analyst1; }`), plus `sudo groupadd -f labteam; sudo groupadd -f opslab; sudo usermod -aG labteam analyst1`.

**Task:** add `analyst1` to supplementary group `opslab` while keeping `labteam`.

- [ ] `id analyst1` lists both `labteam` and `opslab`

??? question "Hint 1"
    `-G` alone replaces the whole list. Which extra option appends?

??? success "Solution"
    ```bash
    sudo usermod -aG opslab analyst1
    id analyst1
    ```

#### S7 Group directory plus an extra ACL user

**Setup:** `sudo groupadd -f opslab; id bob &>/dev/null || sudo useradd -m bob`

**Task:** create `/projects/shared` owned by group `opslab` with mode `2770`, then add an ACL giving `bob` read and write (and execute, so he can enter it).

- [ ] `ls -ld /projects/shared` shows `drwxrws---+` and group `opslab`
- [ ] `getfacl /projects/shared` lists `user:bob:rwx`
- [ ] `sudo -u bob touch /projects/shared/bob.txt` works

??? success "Solution"
    ```bash
    sudo mkdir -p /projects/shared
    sudo chgrp opslab /projects/shared
    sudo chmod 2770 /projects/shared
    sudo setfacl -m u:bob:rwx /projects/shared
    ls -ld /projects/shared
    getfacl /projects/shared
    sudo -u bob touch /projects/shared/bob.txt
    ```

### Group: Deploy, configure, and maintain systems

#### S8 `chronyd` active, enabled, and verified

**Task:** ensure `chronyd` is active and enabled, then verify with both `timedatectl` and `chronyc`.

- [ ] `is-active` and `is-enabled` both succeed
- [ ] `chronyc sources` returns source data

??? success "Solution"
    ```bash
    sudo systemctl enable --now chronyd
    systemctl is-active chronyd; systemctl is-enabled chronyd
    timedatectl
    chronyc sources
    ```

#### S9 Cron entry every 15 minutes

**Setup:** user `analyst1` from S5.

**Task:** create a cron entry for user `analyst1` that appends the date to `/projects/analyst1/cron.log` every 15 minutes.

- [ ] `sudo crontab -u analyst1 -l` shows `*/15 * * * * /usr/bin/date >> /projects/analyst1/cron.log`

??? success "Solution"
    ```bash
    echo '*/15 * * * * /usr/bin/date >> /projects/analyst1/cron.log' | sudo crontab -u analyst1 -
    sudo crontab -u analyst1 -l
    ```
    (The log goes into the account's real home, `/projects/analyst1`, not `/home/analyst1`.)

#### S11 Service enabled at boot

**Setup:** `sudo dnf install -y httpd`

**Task:** make `httpd` start at boot and be running now, and verify both facts.

- [ ] `is-active` returns `active`
- [ ] `is-enabled` returns `enabled`

??? success "Solution"
    ```bash
    sudo systemctl enable --now httpd
    systemctl is-active httpd
    systemctl is-enabled httpd
    ```

### Group: Configure local storage

#### S10 Logical volume mounted persistently

**Setup:** clean `/dev/vdb` (Disk reset).

**Task:** on `/dev/vdb` create one PV, a VG `vgproj` and a 500 MiB LV `lvproj`, format it as XFS, mount it persistently at `/projects/data`, and test with `mount -a`.

- [ ] `lvs vgproj` shows `lvproj` at `500.00m`
- [ ] `findmnt /projects/data` shows `xfs`
- [ ] `sudo mount -a` prints no error and the `/etc/fstab` line is a UUID line

??? success "Solution"
    ```bash
    sudo pvcreate /dev/vdb
    sudo vgcreate vgproj /dev/vdb
    sudo lvcreate -n lvproj -L 500M vgproj
    sudo mkfs.xfs /dev/vgproj/lvproj
    sudo mkdir -p /projects/data
    echo "UUID=$(sudo blkid -s UUID -o value /dev/vgproj/lvproj) /projects/data xfs defaults 0 0" | sudo tee -a /etc/fstab
    sudo systemctl daemon-reload
    sudo mount -a
    findmnt /projects/data
    ```

### Group: Manage security

#### S12 TCP port 85: firewall plus SELinux label

**Setup:** `sudo dnf install -y httpd policycoreutils-python-utils`

**Task:** make `httpd` serve on TCP port `85`: add the `Listen` line, open the port permanently in `firewalld`, add the SELinux port label `http_port_t`, start the service and prove it answers.

- [ ] `ss -tuln` shows a listener on `:85`
- [ ] `firewall-cmd --list-ports --permanent` shows `85/tcp`
- [ ] `semanage port -l | grep http_port_t` includes `85`
- [ ] `curl http://localhost:85/` returns a page

??? success "Solution"
    ```bash
    echo 'Listen 85' | sudo tee /etc/httpd/conf.d/listen85.conf
    echo 's12 ok' | sudo tee /var/www/html/index.html
    sudo semanage port -a -t http_port_t -p tcp 85 2>/dev/null || true   # "already defined" is fine
    sudo firewall-cmd --add-port=85/tcp --permanent
    sudo firewall-cmd --reload
    sudo systemctl enable --now httpd
    sudo systemctl restart httpd
    ss -tuln | grep :85
    sudo semanage port -l | grep http_port_t
    curl http://localhost:85/
    ```

#### S13 SSH key pair copied to `serverb`

**Setup:** run the hosts line on `servera`. On `serverb` user `student` exists with password `student`.

**Task:** as `student` on `servera`, create an ed25519 key pair with no passphrase, copy the public key to `student@serverb.lab.example`, and log in without a password.

- [ ] `~/.ssh/id_ed25519` and `~/.ssh/id_ed25519.pub` exist
- [ ] `ssh student@serverb.lab.example hostname` prints `serverb.lab.example` with no password prompt

??? success "Solution"
    ```bash
    ssh-keygen -t ed25519 -N '' -f ~/.ssh/id_ed25519
    ssh-copy-id student@serverb.lab.example
    ssh student@serverb.lab.example hostname
    ```
    If it still asks for a password, check `~/.ssh` (`700`) and `authorized_keys` (`600`) on `serverb`, and the target username.

### Group: Operate running systems

#### S14 Last twenty journal lines for one unit

**Task:** show the last twenty journal lines for `sshd`, then only errors from the current boot.

- [ ] twenty or fewer lines are printed for `sshd`
- [ ] the second command prints only priority `err` and worse (or nothing)

??? success "Solution"
    ```bash
    journalctl -u sshd -n 20 --no-pager
    journalctl -p err -b --no-pager
    ```

#### S15 Reboot and re-verify

**Setup:** finish at least P1, P18 or S10 and one service task first.

**Task:** reboot once and repeat the verification commands for every mount, service, swap area and network setting you changed.

- [ ] `findmnt` shows each mount you created
- [ ] `swapon --show` shows each swap area
- [ ] `systemctl is-active` and `is-enabled` give the expected answers for each service
- [ ] `ip -4 addr` and `hostnamectl` still show your settings

??? success "Solution"
    ```bash
    sudo systemctl reboot
    ```
    After login:
    ```bash
    findmnt --verify
    findmnt /appdata /reviewdata /projects/data /srv/examdata
    swapon --show
    systemctl is-active httpd chronyd crond
    systemctl is-enabled httpd chronyd crond
    ip -4 addr
    hostnamectl
    ```
    Anything that worked before the reboot but not after is missing its persistence step. Fix that step (`/etc/fstab`, `systemctl enable`, `--permanent`, `semanage` instead of `chcon`).

## Mixed tasks

Two tasks that cross groups. Same scoring.

### M1 User, shared directory and persistent filesystem

**Setup:** clean `/dev/vdb` (Disk reset).

**Task:** create group `examops`; create user `examuser` with home `/srv/examuser`, shell `/bin/bash` and supplementary group `examops`; create `/srv/examshare` owned by `root:examops` with SGID; create VG `vgexam`, LV `lvexam` (1 GiB, ext4) on `/dev/vdb`, and mount it persistently at `/srv/examdata`.

**Grader checklist:**

- [ ] user exists with the correct home, shell and group
- [ ] `/srv/examshare` has SGID and group `examops`
- [ ] the mount exists now, and is still mounted after reboot

??? success "Solution"
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
    echo "UUID=$(sudo blkid -s UUID -o value /dev/vgexam/lvexam) /srv/examdata ext4 defaults 0 0" | sudo tee -a /etc/fstab
    sudo systemctl daemon-reload
    sudo mount -a
    findmnt /srv/examdata
    ```
    **Verify:** `id examuser`, `ls -ld /srv/examshare` (`drwxrwsr-x`), `findmnt /srv/examdata`, then reboot and check again.

### M2 Web service on TCP port 85 end to end

**Setup:** `sudo dnf install -y httpd policycoreutils-python-utils`

**Task:** make `httpd` serve the text `m2 ok` on TCP port `85`, allow that port in `firewalld`, label it in SELinux, enable the service at boot, and prove access locally.

**Grader checklist:**

- [ ] service is active, and enabled
- [ ] a listening socket exists on port `85`
- [ ] the firewall rule exists (permanent)
- [ ] the SELinux port label exists
- [ ] `curl http://localhost:85/` returns `m2 ok`

??? success "Solution"
    ```bash
    echo 'm2 ok' | sudo tee /var/www/html/index.html
    echo 'Listen 85' | sudo tee /etc/httpd/conf.d/listen85.conf
    sudo semanage port -a -t http_port_t -p tcp 85 2>/dev/null || true   # "already defined" is fine
    sudo firewall-cmd --add-port=85/tcp --permanent
    sudo firewall-cmd --reload
    sudo systemctl enable --now httpd
    sudo systemctl restart httpd
    ss -tuln | grep :85
    sudo semanage port -l | grep http_port_t
    sudo firewall-cmd --list-ports
    curl http://localhost:85/
    ```
    `httpd` listens on port `80` only until you add the `Listen 85` line, so the `Listen` step is not optional. **Verify:** reboot and run the `curl` again.

## Verification steps

1. Confirm every user task with `id`, `getent passwd`, and directory checks.
2. Confirm every storage task with both a live command such as `findmnt` and a persistent check in `/etc/fstab`.
3. Confirm every service task with both `systemctl is-active` and `systemctl is-enabled`.
4. Confirm every security-exposed service with both `firewall-cmd` and the relevant SELinux check.
5. Confirm every reboot-sensitive task again after reboot, not just before reboot.

!!! warning "Must survive reboot"
    | Change | Persistent? | Make it persist with |
    |---|---|---|
    | `mount /dev/... /dir` | No | a UUID line in `/etc/fstab`, then `mount -a` |
    | `swapon /dev/vdc1` | No | an fstab swap line, then `swapon -a` |
    | `systemctl start httpd` | No | `systemctl enable httpd` (or `enable --now`) |
    | `firewall-cmd --add-port=85/tcp` | No | add `--permanent`, then `--reload` |
    | `chcon` label | No (lost on relabel) | `semanage fcontext` then `restorecon` |
    | `nmcli connection modify` | Yes | stored in the profile; apply with `connection up` |
    | `useradd`, `chage`, `usermod` | Yes | nothing, stored in `/etc` |

## Common mistakes

- **Mistake:** solving the storage build but not the persistent mount. **Recovery:** make `blkid`, `/etc/fstab`, `mount -a` and `findmnt` part of the same workflow every time.
- **Mistake:** enabling a firewall rule and forgetting SELinux. **Recovery:** always think in layers: service, socket, firewall, SELinux, then client test.
- **Mistake:** editing sudoers directly with a normal editor. **Recovery:** use `visudo` or a validated drop-in file under `/etc/sudoers.d/` (`visudo -c`).
- **Mistake:** using `chcon` for a change that must survive relabeling. **Recovery:** use `semanage fcontext` followed by `restorecon`.
- **Mistake:** solving only the main task and skipping verification. **Recovery:** every task ends with a check command; write it before you open the solution.
- **Mistake:** using a temporary fix when the task needs reboot persistence. **Recovery:** ask "does this survive a reboot?" for every change and use the Must survive reboot table.
- **Mistake:** editing a config file and forgetting to restart or reload the service. **Recovery:** `sudo systemctl restart SERVICE`, then `systemctl is-active SERVICE`.
- **Mistake:** reading answers too early. **Recovery:** write your own verification commands first, then compare.
- **Mistake:** reading the UUID of a new swap partition before `mkswap`, which puts a blank `UUID=` into `/etc/fstab`. **Recovery:** run `mkswap` first, then `sudo blkid`.
- **Mistake:** running `blkid` as a normal user and getting no output. **Recovery:** use `sudo blkid`.

### Troubleshooting

| Problem | Symptom | Fix |
|---|---|---|
| Repo or package command fails | `dnf install` cannot find a package | `dnf repolist`; inspect `/etc/yum.repos.d/`; confirm connectivity or local media |
| Account looks wrong after `useradd` | home path, shell or groups are not what you expected | `getent passwd USER`, `id USER`; correct with `usermod` instead of deleting, unless the task allows recreation |
| `/etc/fstab` entry breaks `mount -a` | `mount -a` prints an error | re-check the UUID with `blkid`; confirm the filesystem type and that the mount point exists; fix the exact line before rebooting |
| Service starts but access still fails | `systemctl status` looks good, but the client fails | `ss -tuln`; firewall runtime and permanent rules; SELinux port and file labels; `journalctl -u SERVICE` |
| SSH key login still asks for a password | key copied, prompt remains | check the target username; `~/.ssh` permissions on the remote host; the key in `authorized_keys` |

## Quiz

1. Which command proves a service is configured to start at boot?
2. Which command safely tests `/etc/fstab` without rebooting?
3. Which command shows account expiration details?
4. Which command shows recent logs for one systemd service?
5. Which command checks whether SELinux currently enforces policy?
6. Which command lists persistent firewall configuration for the current zone?

??? success "Answers"
    1. `systemctl is-enabled SERVICE`
    2. `mount -a`
    3. `chage -l USER`
    4. `journalctl -u SERVICE`
    5. `getenforce`
    6. `firewall-cmd --list-all --permanent`

## Self-scoring

Score each task `2`, `1` or `0` as described in "How to use this bank". Total the scored tasks (G, P1-P20 except P17 if you skipped the snapshot task, S1-S15, M1, M2; O1 and O2 are not scored). This is this course's own practice scheme. Write the score next to each task ID so you can see which objective group still needs repetition.

??? question "Command-direction cheat list"
    A hint list for when you are stuck. Use it as a command-direction hint, not as a substitute for solving the task yourself.

    - Network config: `nmcli connection show` -> `nmcli connection modify ...` -> `nmcli connection up NAME` -> `ip addr` -> `ip route`
    - Repository config: inspect `/etc/yum.repos.d/` -> `dnf repolist` -> `dnf install PACKAGE`
    - SELinux and firewall: `systemctl status SERVICE` -> `firewall-cmd` checks -> `semanage` checks -> `ss -tuln` -> client test
    - Users and groups: `useradd` or `usermod` -> `id USER` -> `getent passwd USER`
    - Collaborative directory: `groupadd` -> `mkdir` -> `chgrp` -> `chmod 2770` -> `ls -ld`
    - Autofs: install and enable `autofs` -> map file -> `systemctl restart autofs` -> access the mount path -> `findmnt`
    - Cron: `crontab -u USER -l` -> confirm `crond` is active
    - ACL: `setfacl` -> `getfacl`
    - Time sync: `systemctl status chronyd` -> `timedatectl` -> `chronyc sources`
    - Find and copy: `find` -> `cp` or `-exec cp`
    - Specific UID user: `useradd -u UID` -> `id USER`
    - Tar: `tar -czvf` -> `tar -tzvf`
    - Umask: `umask` -> create a file -> `ls -l`
    - Expiration: `chage -E` or related option -> `chage -l`
    - Sudo: `visudo` or a drop-in -> `visudo -c`
    - Script: shebang -> positional parameters -> `if` or `for` -> test with multiple arguments
    - Root reset: practice only on snapshots (see lesson 09)
    - Swap: `mkswap` -> `blkid` -> `/etc/fstab` -> `swapon -a` -> `swapon --show`
    - LVM: `pvcreate` -> `vgcreate` -> `lvcreate` -> `mkfs` -> `/etc/fstab` -> `mount -a`
    - Extend LV: `lvextend -r` (or `lvextend` then `xfs_growfs` or `resize2fs`) -> verify with `lvs` and `df -h`

## Summary

- mixed practice matters because real work mixes topics
- local help first, guessing last
- current state and boot state are different checks
- firewall and SELinux are separate layers
- every persistent task needs a reboot-safe mindset

| Task | Command |
|---|---|
| Find a command | `apropos KEYWORD`, `man COMMAND` |
| Archive and list | `tar -czvf archive.tgz DIR`, `tar -tzvf archive.tgz` |
| Show fields | `awk -F: '{print $1, $7}' /etc/passwd`, `sed -n '1,10p' FILE` |
| Create a user | `useradd -m -d /custom/home -s /bin/bash USER` |
| Add a group | `usermod -aG GROUP USER` |
| Account aging | `chage -l USER` |
| ACL | `setfacl -m u:USER:rwx DIR`, `getfacl DIR` |
| Service state | `systemctl is-active SERVICE`, `systemctl is-enabled SERVICE` |
| Logs | `journalctl -u SERVICE -n 20` |
| Time | `timedatectl`, `chronyc sources` |
| LVM | `pvcreate DEVICE`, `vgcreate VG DEVICE`, `lvcreate -n LV -L 1G VG`, `mkfs.ext4 /dev/VG/LV` |
| Mount | `sudo blkid /dev/VG/LV`, `mount -a`, `findmnt MOUNTPOINT` |
| Firewall | `firewall-cmd --list-all --permanent` |
| SELinux | `semanage port -l`, `restorecon -Rv PATH` |
| SSH keys | `ssh-keygen`, `ssh-copy-id USER@HOST` |

**Previous:** [26 Networking, Users, and Security Labs](26-networking-users-and-security-labs.md) · **Next:** [17a RHCSA Command Reference Cheat Sheet](17a-rhcsa-command-reference-cheat-sheet.md): the quick-lookup sheet for everything you just practised, then [17 Final Review](17-final-review-cheat-sheets.md) before the mock exams. Optional extra repetition: [30 RHEL 9 Book Exercise Adaptation Bank](30-rhel9-book-exercise-adaptation-bank.md).
