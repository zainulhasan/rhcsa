---
description: Hands-on drills for packages, scripting, storage, filesystems, NFS, autofs, scheduling, time, journals and the bootloader, each with a setup, grader checklist, hints and a collapsed solution that includes the reboot check.
---

# Administration Core Labs

> Test your ability to manage software, write small scripts, control running systems, work with storage, configure filesystems, and use systemd-related tools.

## At a Glance

**Why this matters for RHCSA**

This is the center of the RHCSA objective list. If you can perform these labs confidently, you are much closer to being ready.

**Real-world use**

Admins install packages, automate checks, inspect logs, extend storage, mount filesystems, and keep services working after reboot.

**Estimated study time**

6 to 8 hours

## How to use this page

Every drill has the same five parts: **Setup** (creates everything the drill needs, so you never depend on another drill), **Task**, a **grader checklist**, optional **hints**, and a collapsed **Solution** that includes verification, the persistence step and a "reboot and re-check".

1. Read the task and tick the checklist yourself on the VM.
2. Stuck? Open Hint 1, then Hint 2, before the solution.
3. Open the solution only to compare. Then reboot `servera` and re-check anything that must persist.

!!! warning "Storage drills share /dev/vdb"
    The shared lab has two spare 2 GiB disks, `/dev/vdb` and `/dev/vdc`. Drills 1, 2, 8 and 12, the guided lab and Exam-Style Task 1 all start from a **clean `/dev/vdb`**, so each one carries its own collapsed *Disk reset* block. Run it before the drill. It destroys everything on `/dev/vdb`. Never run it on a disk with real data.

!!! info "Containers are a bonus here"
    Drill 14 uses Podman. Containers are not on the RHEL 10 objective list, so Drill 14 is a **Bonus (optional, not on the RHEL 10 list)**. Leave it out of any scoring you do.

## Drill index

| Drill | What you build | Objective it trains | Disk |
|---|---|---|---|
| Guided lab | Package, script, process, journal, LVM + mount, cron/at, chrony | Mixed review of the groups below | `/dev/vdb` |
| 1 | 1 GiB XFS partition mounted at `/par1` by UUID | Create partitions on GPT disks; mount file systems at boot by UUID or label | `/dev/vdb` |
| 2 | 750 MiB swap partition, persistent | Add new partitions and swap non-destructively | `/dev/vdb` |
| 3 | Script with `$1`, `$2`, `-d` | Conditionally execute code; process script inputs | none |
| 4 | Script that counts `$#` | Conditionally execute code; process script inputs | none |
| 5 | Script with a `for` loop over arguments | Use looping constructs to process command line input | none |
| 6 | User cron job plus `@reboot` | Schedule tasks using at, cron and systemd timer units | none |
| 7 | chrony time client | Configure time service clients | none |
| 8 | VG with 16 MiB extents, LV by extents, ext4 | Create and delete logical volumes; mount by UUID | `/dev/vdb` |
| 9 | `httpd` on port 93 with `/srv/webcontent/html` | Start services at boot; SELinux port labels and file contexts; firewalld | none |
| 10 | NFS export plus autofs map | Mount NFS; configure autofs | none (two VMs) |
| 11 | Persistent journal | Preserve system journals | none |
| 12 | LV by extents formatted as VFAT | Create, mount and use VFAT file systems | `/dev/vdb` |
| 13 | Default boot kernel with `grubby` | Modify the system bootloader | none |
| 14 (Bonus) | Rootless container with Quadlet auto-start | Not on the RHEL 10 list | none |

## Prerequisites

- A working lab VM (`servera.lab.example`, user `student` with sudo, spare disks `/dev/vdb` and `/dev/vdc`, 2 GiB each, empty)
- Foundation skills from earlier lessons or labs

## Objectives Covered

- Package and repository management
- Simple shell scripting
- Boot targets, logs, processes, and tuning
- GPT partitions, PV, VG, LV, and swap
- Filesystems, mounts, `/etc/fstab`, NFS, and autofs
- `at`, `cron`, `systemd`, `chronyd`, and bootloader checks
- Containers with `podman` (run, persist, auto-start) as an optional bonus

## Commands/Tools Used

`dnf`, `rpm`, `bash`, `grep`, `awk`, `bc`, `systemctl`, `journalctl`, `ps`, `kill`, `tuned-adm`, `parted`, `pvcreate`, `vgcreate`, `lvcreate`, `mkfs`, `mkfs.vfat`, `mount`, `findmnt`, `blkid`, `crontab`, `at`, `timedatectl`, `chronyc`, `grubby`, `sudoedit`, `podman`, `loginctl`

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
- `man journald.conf`

## Common Beginner Mistakes

- Installing a package but not verifying it
- Writing a script without executable permission
- Creating an LV but forgetting the filesystem
- Mounting a filesystem but not making it persistent
- Creating cron entries without checking the daemon or full command paths

## Concept Explanation In Simple Language

This lab file is about the middle of RHCSA: packages, automation, storage, services, and persistence.

Most failures here come from incomplete workflows. For example:

- package installed, but repo was not configured correctly
- logical volume created, but no filesystem was built
- filesystem mounted now, but not after reboot
- service started now, but not enabled at boot

These labs are built to force complete workflows, not half-finished tasks.

```mermaid
flowchart LR
  A[Disk] --> B[Partition] --> C[PV] --> D[VG] --> E[LV] --> F[Filesystem] --> G[fstab] --> H[Reboot check]
```

## Command Breakdowns

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
- repo output should list at least the BaseOS and AppStream repositories (or whatever your lab provides)

### Worked Example 2: Create a tiny admin script

```bash
cat > ~/hostcheck.sh <<'EOF'
#!/bin/bash
echo "host=$(hostname)"
EOF
chmod +x ~/hostcheck.sh
~/hostcheck.sh
```

Verification:

- script runs and prints `host=servera.lab.example` (or the current hostname)

### Worked Example 3: Verify a mount correctly

```bash
findmnt /data
grep /data /etc/fstab
```

Verification:

- one command proves current mount
- one command proves persistent config

## Guided Hands-On Lab

### Lab Goal

Perform a complete admin workflow covering packages, scripting, storage, mounts, and services.

### Setup

Shared lab environment, `servera`, user `student`. Uses `/dev/vdb` (clean), mount point `/data`, VG `vgdata`, LV `lvdata`.

??? warning "Disk reset (destroys everything on /dev/vdb)"
    Run before the lab. Afterwards delete old lines for `/data` from `/etc/fstab`.
    ```bash
    sudo umount /data /par1 /record /datasource 2>/dev/null
    sudo umount /dev/vdb* 2>/dev/null
    sudo swapoff /dev/vdb* 2>/dev/null
    sudo vgremove -ff -y vgdata vgexam vgapp datacontainer 2>/dev/null
    sudo wipefs -a /dev/vdb
    sudo sed -i '\|[[:space:]]/data[[:space:]]|d' /etc/fstab
    ```

### Task Steps

- [ ] 1. Query package repositories (`dnf repolist`).
- [ ] 2. Install the package `tree`.
- [ ] 3. Create `~/hostcheck.sh` that prints the hostname and the current date.
- [ ] 4. Make it executable and run it.
- [ ] 5. Inspect running processes and identify the `sshd` process by name.
- [ ] 6. Read the logs of `sshd.service` for the current boot with `journalctl`.
- [ ] 7. On `/dev/vdb`, create a GPT label and one partition that uses the whole disk.
- [ ] 8. Create a PV on it, a VG named `vgdata`, and a 1 GiB LV named `lvdata`.
- [ ] 9. Create an XFS filesystem on the LV.
- [ ] 10. Mount it at `/data`.
- [ ] 11. Add a persistent mount entry using the UUID.
- [ ] 12. Test `/etc/fstab` with `mount -a`.
- [ ] 13. Create a cron job (every 5 minutes, appends the date to `/var/tmp/guided.log`) and an `at` job (runs in 1 minute, writes `at ok` to `/var/tmp/guided-at.log`).
- [ ] 14. Check `chronyd` status.
- [ ] 15. Reboot and confirm the mount and any enabled service still work.

??? question "Hint 1"
    Steps 7 to 12 are the storage chain: partition, PV, VG, LV, filesystem, mount, fstab. Prove each link with `lsblk`, `pvs`, `vgs`, `lvs`.

??? question "Hint 2"
    `at` needs the `atd` service running. For the fstab line you need the UUID from `blkid` of the LV, not of the partition.

??? success "Solution"
    ```bash
    dnf repolist
    sudo dnf install -y tree
    rpm -q tree

    cat > ~/hostcheck.sh <<'EOF'
    #!/bin/bash
    echo "host=$(hostname) date=$(date)"
    EOF
    chmod +x ~/hostcheck.sh
    ~/hostcheck.sh

    pgrep -a sshd
    journalctl -u sshd -b | head

    sudo parted --script /dev/vdb mklabel gpt mkpart primary 1MiB 100%
    sudo partprobe /dev/vdb
    sudo pvcreate /dev/vdb1
    sudo vgcreate vgdata /dev/vdb1
    sudo lvcreate -n lvdata -L 1G vgdata
    sudo mkfs.xfs /dev/vgdata/lvdata
    sudo mkdir -p /data
    echo "UUID=$(sudo blkid -s UUID -o value /dev/vgdata/lvdata) /data xfs defaults 0 0" | sudo tee -a /etc/fstab
    sudo systemctl daemon-reload
    sudo mount -a
    findmnt /data

    echo '*/5 * * * * /usr/bin/date >> /var/tmp/guided.log' | crontab -
    crontab -l
    sudo systemctl enable --now atd
    echo 'echo "at ok" >> /var/tmp/guided-at.log' | at now + 1 minute
    atq

    systemctl is-active chronyd
    systemctl is-enabled chronyd
    timedatectl
    ```
    **Verify:**
    ```bash
    rpm -q tree
    ls -l ~/hostcheck.sh
    journalctl -u sshd -b | head
    lsblk -f
    findmnt /data
    grep /data /etc/fstab
    crontab -l
    cat /var/tmp/guided-at.log      # after about a minute
    timedatectl
    ```
    Reboot, then run `findmnt /data`, `systemctl is-active crond atd chronyd` and `crontab -l` again. `/data` must be mounted without any manual step.

### Cleanup

You may keep the filesystem and script if they are useful for later labs, but every storage drill below starts with its own disk reset.

## Independent Practice Tasks

1. Create a `.repo` file for a lab repository if your environment provides one (the solution builds a local one).
2. Write a script that accepts one argument and reports whether it is a file.
3. Use `bc` in a script or one-line test.
4. Start a background process and then terminate it safely.
5. Create and activate a swap area on a second device or partition.
6. Extend an existing logical volume and grow the filesystem.
7. Create a cron line that appends the date to a file.
8. Check bootloader defaults safely with `grubby`.

??? success "Solution sketches"
    **Setup for 1:** `sudo dnf install -y createrepo_c`. **Setup for 5:** reset `/dev/vdc` (`sudo wipefs -a /dev/vdc`). **Setup for 6:** the `vgdata/lvdata` LV from the guided lab above (VG has about 1 GiB free); redo the guided lab's storage steps if it is missing.

    1. Local repository:
        ```bash
        sudo mkdir -p /srv/localrepo
        sudo dnf download --destdir /srv/localrepo tree
        sudo createrepo_c /srv/localrepo
        sudo tee /etc/yum.repos.d/lab-local.repo <<'EOF'
        [lab-local]
        name=Lab local repository
        baseurl=file:///srv/localrepo
        enabled=1
        gpgcheck=0
        EOF
        dnf repolist
        ```
        <!-- VERIFY: dnf download is available in the default RHEL 10 dnf; otherwise install dnf-plugins-core -->
    2. `isfile.sh`:
        ```bash
        cat > ~/isfile.sh <<'EOF'
        #!/bin/bash
        if [ -f "$1" ]; then echo "$1 is a file"; else echo "$1 is not a file"; fi
        EOF
        chmod +x ~/isfile.sh; ~/isfile.sh /etc/passwd; ~/isfile.sh /etc
        ```
    3. `bc <<< 'scale=2; 10/3'` prints `3.33`. In a script: `total=$(echo "2 + 3" | bc); echo "$total"`.
    4. `sleep 600 &` then `jobs`, then `kill %1`. For a process from another shell: `pgrep -a sleep` then `kill PID` (use `kill -9` only if plain `kill` is ignored).
    5. Swap on `/dev/vdc`:
        ```bash
        sudo parted --script /dev/vdc mklabel gpt mkpart swap linux-swap 1MiB 513MiB
        sudo mkswap /dev/vdc1
        sudo swapon /dev/vdc1
        echo "UUID=$(sudo blkid -s UUID -o value /dev/vdc1) none swap defaults 0 0" | sudo tee -a /etc/fstab
        swapon --show
        ```
    6. `sudo lvextend -r -L +500M /dev/vgdata/lvdata` then `df -h /data` and `sudo lvs`.
    7. `(crontab -l 2>/dev/null; echo '*/5 * * * * /usr/bin/date >> /var/tmp/practice.log') | crontab -` then `crontab -l`.
    8. `sudo grubby --default-kernel` and `sudo grubby --info=DEFAULT`.

## Core Pattern Practice Set

These drills turn common admin task shapes into clean tasks with persistence checks. Each one is independent.

### Drill 1: Create a 1 GiB XFS partition and mount it persistently

**Setup:** shared lab environment, `servera`. Clean `/dev/vdb`.

??? warning "Disk reset (destroys everything on /dev/vdb)"
    ```bash
    sudo umount /data /par1 /record /datasource 2>/dev/null
    sudo umount /dev/vdb* 2>/dev/null
    sudo swapoff /dev/vdb* 2>/dev/null
    sudo vgremove -ff -y vgdata vgexam vgapp datacontainer 2>/dev/null
    sudo wipefs -a /dev/vdb
    sudo sed -i '\|[[:space:]]/par1[[:space:]]|d' /etc/fstab
    ```

**Task:** as `root` (or with `sudo`), on `/dev/vdb`:

- [ ] Create a GPT label.
- [ ] Create one 1 GiB partition (`/dev/vdb1`).
- [ ] Build an XFS filesystem on that partition.
- [ ] Mount it at `/par1`.
- [ ] Make the mount persistent using `UUID=`.
- [ ] Test the entry without rebooting.

What to check before moving on:

- [ ] `lsblk -f` shows the partition and filesystem
- [ ] `findmnt /par1` shows the live mount
- [ ] `/etc/fstab` contains the right UUID and filesystem type

??? question "Hint 1"
    `1MiB` is the usual start, so a 1 GiB partition ends at `1025MiB`.

??? question "Hint 2"
    `parted` (label, then `mkpart`), `mkfs.xfs`, `blkid`, then an fstab line, then `mount -a`.

??? success "Solution"
    ```bash
    sudo parted /dev/vdb --script mklabel gpt mkpart primary xfs 1MiB 1025MiB
    sudo partprobe /dev/vdb
    sudo mkfs.xfs /dev/vdb1
    sudo mkdir -p /par1
    UUID=$(sudo blkid -s UUID -o value /dev/vdb1)
    echo "UUID=$UUID /par1 xfs defaults 0 0" | sudo tee -a /etc/fstab
    sudo systemctl daemon-reload
    sudo mount -a
    findmnt /par1
    lsblk -f /dev/vdb
    ```
    **Verify:** `findmnt /par1` shows the mounted filesystem (`xfs`), `grep /par1 /etc/fstab` shows the persistent entry, `findmnt --verify` reports no error for it, and `lsblk /dev/vdb` shows `vdb1` at `1G`.

    **Reboot and re-check:** `sudo reboot`, then `findmnt /par1`. It must be mounted without any manual step.

    **Cleanup (optional):** `sudo umount /par1`, delete the `/par1` line from `/etc/fstab`, `sudo wipefs -a /dev/vdb`.

### Drill 2: Add swap without removing current swap

**Setup:** shared lab environment, `servera`. Clean `/dev/vdb`. Run `swapon --show` first and note any swap that is already active.

??? warning "Disk reset (destroys everything on /dev/vdb)"
    After the reset, open `/etc/fstab` and delete any swap line whose `UUID=` no longer appears in `blkid` output. Do not delete the system's own swap line.
    ```bash
    sudo umount /data /par1 /record /datasource 2>/dev/null
    sudo umount /dev/vdb* 2>/dev/null
    sudo swapoff /dev/vdb* 2>/dev/null
    sudo vgremove -ff -y vgdata vgexam vgapp datacontainer 2>/dev/null
    sudo wipefs -a /dev/vdb
    ```

**Task:** as `root` (or with `sudo`):

- [ ] Create a new partition of `750 MiB` on `/dev/vdb` (GPT label first).
- [ ] Mark it for swap use if your tool requires that step.
- [ ] Create swap on it.
- [ ] Activate it.
- [ ] Make it persistent in `/etc/fstab` by UUID.

What to check before moving on:

- [ ] existing swap (if any) remains active
- [ ] the new swap area appears in `swapon --show`
- [ ] `/etc/fstab` contains a correct swap entry

??? question "Hint 1"
    A partition type flag is not a swap signature. Two separate steps are needed before `swapon` works.

??? question "Hint 2"
    `mkswap`, `swapon`, `blkid`, then an fstab line with `none` as mount point and `swap` as type.

??? success "Solution"
    ```bash
    swapon --show                                   # note what already exists
    sudo parted /dev/vdb --script mklabel gpt mkpart swap linux-swap 1MiB 751MiB
    sudo partprobe /dev/vdb
    sudo mkswap /dev/vdb1
    sudo swapon /dev/vdb1
    UUID=$(sudo blkid -s UUID -o value /dev/vdb1)
    echo "UUID=$UUID none swap defaults 0 0" | sudo tee -a /etc/fstab
    sudo systemctl daemon-reload
    swapon --show
    free -h
    ```
    **Verify:** `swapon --show` lists `/dev/vdb1` of about `750M` and still lists any swap that existed before. `grep swap /etc/fstab` shows the new line with a real UUID (not empty).

    **Reboot and re-check:** `sudo swapoff /dev/vdb1 && sudo swapon -a` proves the fstab line works; then `sudo reboot` and run `swapon --show` again.

    **Cleanup (optional):** `sudo swapoff /dev/vdb1`, delete the line from `/etc/fstab`, `sudo wipefs -a /dev/vdb`.

### Drill 3: Argument-based script with directory test

**Setup:** as `student`, `mkdir -p ~/bin`.

**Task:** as a regular user, create `~/bin/checkdir.sh`.

Requirements:

- [ ] Accept two command-line arguments.
- [ ] If the first argument is an existing directory, print `directory exists`.
- [ ] Otherwise create a new directory using the second argument and print `directory created`.

What to check before moving on:

- [ ] the script is executable
- [ ] it behaves differently for existing and non-existing directories
- [ ] you can explain `$1`, `$2`, and `-d`

??? question "Hint 1"
    `test -d` (or `[ -d ... ]`) answers "is this an existing directory?". Quote your variables.

??? question "Hint 2"
    Use `if ... then ... else ... fi`, and `mkdir -p "$2"` in the `else` branch.

??? success "Solution"
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
    ls -ld /tmp/newdir
    ```
    **Verify:** the first run prints `directory exists` and does not create `/tmp/unused`; the second prints `directory created` and `/tmp/newdir` exists. `ls -l ~/bin/checkdir.sh` shows the `x` bits.

### Drill 4: Count arguments and warn if there are too many

**Setup:** as `student`, `mkdir -p ~/bin`.

**Task:** as a regular user, create `~/bin/argcount.sh`.

Requirements:

- [ ] Count total command-line arguments.
- [ ] If the count is greater than five, print `too many arguments`.
- [ ] Otherwise print the count.

What to check before moving on:

- [ ] you can explain `$#`
- [ ] the greater-than-five case works
- [ ] the smaller case works too

??? question "Hint 1"
    `$#` already holds the number of arguments. No loop needed.

??? question "Hint 2"
    Numeric comparison uses `-gt` inside `[ ]`.

??? success "Solution"
    ```bash
    mkdir -p ~/bin
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
    **Verify:** the first run prints `2`; the second prints `too many arguments`; exactly five arguments prints `5`.

### Drill 5: For-loop file processing

**Setup:** as `student`, `mkdir -p ~/bin` and `touch /tmp/a /tmp/b`.

**Task:** as a regular user, create `~/bin/fileloop.sh`.

Requirements:

- [ ] Loop over all arguments passed to the script.
- [ ] Print a long listing only for arguments that are regular files.
- [ ] Count how many valid regular files were found.
- [ ] Print the final count as `file count: N`.

What to check before moving on:

- [ ] the script uses a `for` loop
- [ ] non-file arguments do not break it
- [ ] the final count is correct

??? question "Hint 1"
    The loop variable walks over `"$@"`. A directory or a missing path must be skipped silently.

??? question "Hint 2"
    `[ -f "$item" ]` for the test; `count=$((count + 1))` for the counter.

??? success "Solution"
    ```bash
    mkdir -p ~/bin
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
    ~/bin/fileloop.sh /tmp/a /tmp/b /tmp/nope /etc/passwd /etc
    ```
    **Verify:** three long listings (`/tmp/a`, `/tmp/b`, `/etc/passwd`) and `file count: 3`. `/tmp/nope` and `/etc` are skipped.

## Extended Objective Practice Set

These drills add more objective-matching tasks and stay only where they still fit the current RHCSA 10 scope.

### Drill 6: User-specific cron and `@reboot`

**Setup:** create the user and the script the second cron entry will run.

```bash
id alice || sudo useradd -m alice
sudo tee /usr/local/bin/startup-check.sh <<'EOF'
#!/bin/bash
echo "reboot seen $(date)" >> /var/tmp/startup-check.log
EOF
sudo chmod 755 /usr/local/bin/startup-check.sh
sudo systemctl enable --now crond
```

**Task:** as `root` (or with `sudo`):

- [ ] Create a cron entry for user `alice` that writes `practice in progress` to the system log every 5 minutes.
- [ ] Add a second cron entry for the same user that runs `/usr/local/bin/startup-check.sh` at reboot.
- [ ] Verify the user-specific crontab without editing the wrong account.

What to check before moving on:

- [ ] the crontab belongs to `alice`
- [ ] the `@reboot` entry uses a full command path
- [ ] `crond` is active

??? question "Hint 1"
    `crontab` has a flag to choose another user's table. Without it you edit your own.

??? question "Hint 2"
    Feed both lines to `crontab -u alice -` at once. The logging command is `logger`; use its full path (`command -v logger`).

??? success "Solution"
    ```bash
    sudo systemctl is-active crond
    sudo crontab -u alice - <<'EOF'
    */5 * * * * /usr/bin/logger "practice in progress"
    @reboot /usr/local/bin/startup-check.sh
    EOF
    sudo crontab -l -u alice
    ```
    **Verify:** `sudo crontab -l -u alice` shows both entries; `systemctl is-active crond` reports `active`; `sudo ls /var/spool/cron/` lists a file named `alice`. After 5 to 10 minutes, `sudo journalctl -u crond --since "15 min ago"` shows a `(alice) CMD` line.
    <!-- VERIFY: exact crond journal wording on RHEL 10 -->

    **Reboot and re-check:** `sudo reboot`. After login, `cat /var/tmp/startup-check.log` shows a `reboot seen ...` line, and `systemctl is-enabled crond` reports `enabled`.
    <!-- VERIFY: @reboot job writes to /var/tmp under SELinux for a user cron job -->

### Drill 7: Configure a chrony client

**Setup:** `sudo dnf install -y chrony` (skip if `rpm -q chrony` already succeeds).

**Task:** as `root` (or with `sudo`):

- [ ] Ensure `chronyd` is installed.
- [ ] Enable and start `chronyd`.
- [ ] Inspect `/etc/chrony.conf` and identify the active `server` or `pool` lines.
- [ ] Restart `chronyd`.
- [ ] Verify time-source visibility with `chronyc`.

What to check before moving on:

- [ ] `chronyd` is active and enabled
- [ ] `chronyc sources` shows usable source information
- [ ] `timedatectl` reflects NTP use

??? question "Hint 1"
    Lines starting with `#` are comments. Only uncommented `server` or `pool` lines count.

??? question "Hint 2"
    `chronyc sources -v` lists sources with a legend; `chronyc tracking` shows the sync state. If the VM has no internet, sources show as unreachable (`Reach` 0) but the configuration is still correct.

??? success "Solution"
    ```bash
    sudo dnf install -y chrony
    sudo systemctl enable --now chronyd
    grep -E '^(server|pool)' /etc/chrony.conf
    sudo systemctl restart chronyd
    chronyc sources -v
    chronyc tracking
    timedatectl
    ```
    **Verify:** `systemctl is-enabled chronyd` reports `enabled` and `systemctl is-active chronyd` reports `active`. `chronyc sources` lists at least one source. `timedatectl` shows `NTP service: active` (and `System clock synchronized: yes` once a source is reachable).

    **Reboot and re-check:** after `sudo reboot`, `systemctl is-active chronyd` still reports `active`.

### Drill 8: Create an LV by extents and custom PE size

**Setup:** shared lab environment, `servera`. Clean `/dev/vdb` (reset below), then give it one 1 GiB LVM partition.

??? warning "Disk reset (destroys everything on /dev/vdb)"
    ```bash
    sudo umount /data /par1 /record /datasource 2>/dev/null
    sudo umount /dev/vdb* 2>/dev/null
    sudo swapoff /dev/vdb* 2>/dev/null
    sudo vgremove -ff -y vgdata vgexam vgapp datacontainer 2>/dev/null
    sudo wipefs -a /dev/vdb
    sudo sed -i '\|[[:space:]]/record[[:space:]]|d' /etc/fstab
    ```

```bash
sudo parted --script /dev/vdb mklabel gpt mkpart primary 1MiB 1025MiB set 1 lvm on
sudo partprobe /dev/vdb
```

**Task:** as `root` (or with `sudo`):

- [ ] Create a PV on `/dev/vdb1`, then a volume group named `vgapp` with PE size `16M`.
- [ ] Create a logical volume named `lvapp` with `60` extents.
- [ ] Format it as `ext4`.
- [ ] Mount it persistently at `/record`.

What to check before moving on:

- [ ] `vgs -o +vg_extent_size vgapp` shows an extent size of `16.00m`
- [ ] `lvs` shows `lvapp` at `960.00m` (60 x 16 MiB)
- [ ] `/etc/fstab` and `findmnt /record` both confirm the mount

??? question "Hint 1"
    Plain `vgs` does not show the PE size. Ask for the extra column or use `vgdisplay`.

??? question "Hint 2"
    `vgcreate -s` sets the extent size and `lvcreate -l` takes extents instead of a size. 60 extents of 16 MiB is 960 MiB.

??? success "Solution"
    ```bash
    sudo pvcreate /dev/vdb1
    sudo vgcreate -s 16M vgapp /dev/vdb1
    sudo lvcreate -l 60 -n lvapp vgapp
    sudo mkfs.ext4 /dev/vgapp/lvapp
    sudo mkdir -p /record
    UUID=$(sudo blkid -s UUID -o value /dev/vgapp/lvapp)
    echo "UUID=$UUID /record ext4 defaults 0 0" | sudo tee -a /etc/fstab
    sudo systemctl daemon-reload
    sudo mount -a
    sudo vgs -o +vg_extent_size vgapp
    sudo vgdisplay vgapp | grep 'PE Size'
    sudo lvs /dev/vgapp/lvapp
    sudo lvdisplay /dev/vgapp/lvapp | grep 'Current LE'
    findmnt /record
    ```
    **Verify:** the `vgs` output ends with `Ext 16.00m` (column `Ext`), `vgdisplay` shows `PE Size 16.00 MiB`, `lvdisplay` shows `Current LE 60`, `lvs` shows `960.00m`, and `findmnt /record` shows `ext4`.
    <!-- VERIFY: column heading printed by vgs -o +vg_extent_size -->

    **Reboot and re-check:** `sudo reboot`, then `findmnt /record` and `sudo lvs vgapp`.

    **Cleanup (optional):** `sudo umount /record`, delete the `/record` line from `/etc/fstab`, `sudo vgremove -ff -y vgapp`, `sudo wipefs -a /dev/vdb`.

### Drill 9: `httpd` on custom port and custom document root

**Setup:** the `httpd` package, the SELinux management tools, and a content directory.

```bash
sudo dnf install -y httpd policycoreutils-python-utils
sudo mkdir -p /srv/webcontent/html
echo "RHCSA custom web root" | sudo tee /srv/webcontent/html/index.html
sudo systemctl enable --now firewalld
```

**Task:** as `root` (or with `sudo`):

- [ ] Reconfigure Apache to listen on port `93` instead of `80`.
- [ ] Set `/srv/webcontent/html` as the `DocumentRoot` and allow access to it (`<Directory>` block with `Require all granted`).
- [ ] Label the content correctly with SELinux (type `httpd_sys_content_t` on `/srv/webcontent`, persistent rule, then apply it).
- [ ] Label port `93` for HTTP in SELinux.
- [ ] Open port `93/tcp` permanently in the firewall.
- [ ] Enable and (re)start `httpd` and verify with `curl`.

What to check before moving on:

- [ ] `sudo httpd -t` reports `Syntax OK`
- [ ] `ss -tuln` shows port `93`
- [ ] `sudo semanage port -l | grep '^http_port_t'` includes `93`
- [ ] `ls -Zd /srv/webcontent/html` shows `httpd_sys_content_t`
- [ ] `curl http://localhost:93/` returns `RHCSA custom web root`

??? question "Hint 1"
    Four separate layers can each block you: the Apache config (`Listen`, `DocumentRoot`, `<Directory>`), the SELinux port label, the SELinux file label, and the firewall. A `403` usually means the `<Directory>` block or the file label; a connection failure or a failed start usually means the port label.

??? question "Hint 2"
    `semanage port -a` for the port, `semanage fcontext -a` then `restorecon -Rv` for the files, `firewall-cmd --permanent` plus `--reload` for the firewall. Put the `<Directory>` block in a new file under `/etc/httpd/conf.d/`.

??? success "Solution"
    ```bash
    # 1. Apache configuration
    sudo sed -i 's/^Listen 80$/Listen 93/' /etc/httpd/conf/httpd.conf
    sudo sed -i 's|^DocumentRoot "/var/www/html"|DocumentRoot "/srv/webcontent/html"|' /etc/httpd/conf/httpd.conf
    sudo tee /etc/httpd/conf.d/webcontent.conf <<'EOF'
    <Directory "/srv/webcontent/html">
        Require all granted
    </Directory>
    EOF
    grep -E '^(Listen|DocumentRoot)' /etc/httpd/conf/httpd.conf
    sudo httpd -t

    # 2. SELinux: port label and file context
    sudo semanage port -a -t http_port_t -p tcp 93
    sudo semanage fcontext -a -t httpd_sys_content_t '/srv/webcontent(/.*)?'
    sudo restorecon -Rv /srv/webcontent

    # 3. Firewall
    sudo firewall-cmd --add-port=93/tcp --permanent
    sudo firewall-cmd --reload

    # 4. Service
    sudo systemctl enable --now httpd
    sudo systemctl restart httpd
    curl http://localhost:93/
    ```
    **Verify:**
    ```bash
    sudo ss -tlnp | grep ':93'
    sudo semanage port -l | grep '^http_port_t'
    ls -Zd /srv/webcontent/html /srv/webcontent/html/index.html
    sudo firewall-cmd --list-ports
    systemctl is-enabled httpd
    ```
    The `curl` prints `RHCSA custom web root`; the listener shows `httpd`; `http_port_t` lists `93`; the content has `httpd_sys_content_t`; the firewall lists `93/tcp`.

    **Reboot and re-check:** `sudo reboot`, then repeat `systemctl is-active httpd`, `sudo firewall-cmd --list-ports` and `curl http://localhost:93/`. If it fails after reboot, the missing piece was `enable`, `--permanent`, or the persistent `semanage` rule (a plain `chcon` would not have survived `restorecon`).

### Drill 10: Autofs home-style mount

**Setup:** use two VMs: `servera` is the NFS server, `serverb` is the client. (With only one VM, do both parts on `servera` and use `servera.lab.example` as the server name.) Confirm the name resolves from the client: `getent hosts servera.lab.example`.

**Task:**

Server side (`servera`):

- [ ] Export `/export/homes` by NFS (read-write) and make sure the directory `/export/homes/carol` exists with a test file.
- [ ] Allow NFS through the firewall permanently.

Client side (`serverb`):

- [ ] Install `autofs`.
- [ ] Create a map so `carol` is automatically mounted under `/remote/carol` from `servera.lab.example:/export/homes/carol`.
- [ ] Ensure `autofs` starts automatically at boot.

What to check before moving on:

- [ ] the NFS export exists on the server (`sudo exportfs -v`)
- [ ] `autofs` is active and enabled on the client
- [ ] accessing `/remote/carol` triggers the mount

??? question "Hint 1"
    `/remote` is managed by autofs: do not create `/remote/carol` yourself. The master map names the parent directory and the map file; the map file names the key (`carol`) and the NFS source.

??? question "Hint 2"
    Server: `exportfs -arv`, `nfs-server`, `firewall-cmd`. Client: a file in `/etc/auto.master.d/` ending in `.autofs`, a map file, `systemctl enable --now autofs`. A mount only shows up after you access the path.

??? success "Solution"
    Server (`servera`):
    ```bash
    sudo dnf install -y nfs-utils
    sudo mkdir -p /export/homes/carol
    echo "hello from carol" | sudo tee /export/homes/carol/welcome.txt
    echo '/export/homes *(rw,sync)' | sudo tee /etc/exports.d/homes.exports
    sudo firewall-cmd --add-service={rpc-bind,mountd,nfs} --permanent
    sudo firewall-cmd --reload
    sudo exportfs -arv
    sudo systemctl enable --now nfs-server
    sudo exportfs -v
    ```
    Client (`serverb`):
    ```bash
    sudo dnf install -y nfs-utils autofs
    echo '/remote /etc/auto.remote' | sudo tee /etc/auto.master.d/remote.autofs
    echo 'carol -rw,sync servera.lab.example:/export/homes/carol' | sudo tee /etc/auto.remote
    sudo systemctl enable --now autofs
    ls /remote/carol
    cat /remote/carol/welcome.txt
    findmnt /remote/carol
    ```
    **Verify:** `ls /remote/carol` lists `welcome.txt`; `findmnt /remote/carol` shows type `nfs4` from `servera.lab.example:/export/homes/carol`; `systemctl is-enabled autofs` reports `enabled`. Before the first access `findmnt /remote/carol` shows nothing: that is normal for autofs.
    <!-- VERIFY: showmount -e servera.lab.example may need rpc-bind and mountd open on RHEL 10; nfs4 mounts do not need it -->

    **Wildcard variant (home-directory style):** replace the map line with `* -rw,sync servera.lab.example:/export/homes/&` so every directory under `/export/homes` (for example a `dana` directory you create on the server) is mounted on demand under `/remote/<name>`. Run `sudo systemctl restart autofs`.

    **Reboot and re-check:** reboot `serverb`, then `systemctl is-active autofs` and `ls /remote/carol` again. If `nfs-server` was not enabled on `servera`, the mount fails after a server reboot.

### Drill 11: Make journald persistent with configuration

**Setup:** note the current state: `grep -i '^#\?Storage' /etc/systemd/journald.conf` and `ls -ld /var/log/journal` (it may not exist yet).

**Task:** as `root` (or with `sudo`):

- [ ] Edit `journald` configuration so logs are stored persistently.
- [ ] Restart the journal service.
- [ ] Verify both the configuration file and the resulting storage behavior.

What to check before moving on:

- [ ] the config explicitly requests persistent storage (`Storage=persistent`, uncommented)
- [ ] `journalctl -b` still works
- [ ] logs still exist after reboot (`journalctl --list-boots` shows more than one boot)

??? question "Hint 1"
    The setting lives in the `[Journal]` section of `/etc/systemd/journald.conf`. The shipped line is commented out.

??? question "Hint 2"
    After changing the file, restart `systemd-journald`. The directory `/var/log/journal` is what makes logs survive a reboot.

??? success "Solution"
    ```bash
    sudoedit /etc/systemd/journald.conf
    ```
    In the `[Journal]` section, set (remove the leading `#`):
    ```ini
    Storage=persistent
    ```
    Then:
    ```bash
    sudo systemctl restart systemd-journald
    grep '^Storage=' /etc/systemd/journald.conf
    ls -ld /var/log/journal
    sudo journalctl --flush
    journalctl -b | tail
    journalctl --disk-usage
    ```
    <!-- VERIFY: restarting systemd-journald with Storage=persistent creates /var/log/journal; if not, run sudo mkdir -p /var/log/journal && sudo systemd-tmpfiles --create --prefix /var/log/journal -->
    **Verify:** `Storage=persistent` is visible in the config and `/var/log/journal` exists (owned by `root:systemd-journal`).

    **Reboot and re-check:** `sudo reboot`, then `journalctl --list-boots` must list at least two boots (`-1` and `0`), and `journalctl -b -1 | head` shows messages from before the reboot.

### Drill 12: Create a VFAT LV by extents and mount it

**Setup:** shared lab environment, `servera`. Clean `/dev/vdb` with one 1 GiB LVM partition, and `dosfstools` for `mkfs.vfat`.

??? warning "Disk reset (destroys everything on /dev/vdb)"
    ```bash
    sudo umount /data /par1 /record /datasource 2>/dev/null
    sudo umount /dev/vdb* 2>/dev/null
    sudo swapoff /dev/vdb* 2>/dev/null
    sudo vgremove -ff -y vgdata vgexam vgapp datacontainer 2>/dev/null
    sudo wipefs -a /dev/vdb
    sudo sed -i '\|[[:space:]]/datasource[[:space:]]|d' /etc/fstab
    ```

```bash
sudo dnf install -y dosfstools
sudo parted --script /dev/vdb mklabel gpt mkpart primary 1MiB 1025MiB set 1 lvm on
sudo partprobe /dev/vdb
```

**Task:** as `root` (or with `sudo`):

- [ ] Create a PV on `/dev/vdb1` and a volume group named `datacontainer` with PE size `16M`.
- [ ] Create logical volume `datacopy` with `50` extents.
- [ ] Format it as `vfat`.
- [ ] Mount it persistently at `/datasource`.

What to check before moving on:

- [ ] `vgs -o +vg_extent_size datacontainer` shows the intended PE size
- [ ] `lvs` shows the LV at `800.00m`
- [ ] `findmnt /datasource` proves the mount and shows `vfat`

??? question "Hint 1"
    Same chain as Drill 8, with a different filesystem tool. VFAT UUIDs look like `1A2B-3C4D`.

??? question "Hint 2"
    `mkfs.vfat` (from `dosfstools`) and `UUID=` still works in `/etc/fstab` with type `vfat`.

??? success "Solution"
    ```bash
    sudo pvcreate /dev/vdb1
    sudo vgcreate -s 16M datacontainer /dev/vdb1
    sudo lvcreate -l 50 -n datacopy datacontainer
    sudo mkfs.vfat /dev/datacontainer/datacopy
    sudo mkdir -p /datasource
    UUID=$(sudo blkid -s UUID -o value /dev/datacontainer/datacopy)
    echo "UUID=$UUID /datasource vfat defaults 0 0" | sudo tee -a /etc/fstab
    sudo systemctl daemon-reload
    sudo mount -a
    sudo vgs -o +vg_extent_size datacontainer
    sudo lvs /dev/datacontainer/datacopy
    findmnt /datasource
    ```
    **Verify:** `mkfs.vfat` satisfies the VFAT objective; `findmnt /datasource` shows `vfat`; `lsblk -f` shows `vfat` on the LV.

    **Reboot and re-check:** `sudo reboot`, then `findmnt /datasource`. The mount survives because it is in `/etc/fstab`.

    **Cleanup (optional):** `sudo umount /datasource`, delete the line from `/etc/fstab`, `sudo vgremove -ff -y datacontainer`, `sudo wipefs -a /dev/vdb`.

### Drill 13: Change the default boot kernel safely

**Setup:** check how many kernels are installed: `rpm -q kernel` (or `ls /boot/vmlinuz-*`). Save the current default so you can restore it: `sudo grubby --default-kernel | tee ~/default-kernel.txt`. If only one kernel is installed, do the inspection steps only; do not force the change.

**Task:** if your lab already has more than one installed kernel:

- [ ] List all bootable kernels.
- [ ] Identify the current default.
- [ ] Change the default to another already-installed kernel.
- [ ] Verify the selection before rebooting.

What to check before moving on:

- [ ] you do not remove the older kernel
- [ ] you can prove the default selection before reboot
- [ ] you can restore the original default if needed

??? question "Hint 1"
    `grubby` can list every boot entry and report which one is the default.

??? question "Hint 2"
    `grubby --set-default` takes the path of a kernel image under `/boot`. Copy the exact path from the `grubby --info=ALL` output.

??? success "Solution"
    ```bash
    sudo grubby --info=ALL
    sudo grubby --default-kernel
    ```
    If a second installed kernel is available:
    ```bash
    sudo grubby --set-default /boot/vmlinuz-VERSION
    sudo grubby --default-kernel
    sudo grub2-editenv list
    ```
    - replace `VERSION` with a real installed kernel path from `grubby --info=ALL`
    - verify the new default before rebooting
    - if only one kernel is installed, treat this as an inspection drill and do not force the change

    **Reboot and re-check:** `sudo reboot`, then `uname -r` shows the kernel you chose. **Restore:** `sudo grubby --set-default "$(cat ~/default-kernel.txt)"` and confirm with `sudo grubby --default-kernel`.
    <!-- VERIFY: grub2-editenv list shows saved_entry on RHEL 10 -->

### Drill 14 (Bonus): Run a rootless web container with persistent storage and auto-start

!!! note "Bonus (optional, not on the RHEL 10 list)"
    Containers are not on the RHEL 10 objective list. Do this drill for extra skill, and leave it out of any scoring.

**Setup:** as `student` (a normal, non-root user logged in through SSH or the console, not `sudo -i`): `sudo dnf install -y podman`. The drill pulls `registry.access.redhat.com/ubi10/httpd-24`, which needs network access to that registry.
<!-- VERIFY: image name registry.access.redhat.com/ubi10/httpd-24 exists, listens on 8080 and serves /var/www/html -->

**Task:** as a normal (non-root) user:

- [ ] Pull a web image (or use one already present) and confirm it with `podman images`.
- [ ] Create a host directory `~/webcontent` with an `index.html` and run a detached container named `web` that publishes host port `8080` to container port `8080` and mounts that directory at `/var/www/html` with the correct SELinux relabel.
- [ ] Prove the page is served with `curl http://localhost:8080`.
- [ ] Write a Quadlet `.container` file so the container starts as a rootless systemd service, enable linger, and start the service.
- [ ] Verify the service is active.

What to check before moving on:

- [ ] the volume option ends in `:Z` (SELinux relabel)
- [ ] the host port is `8080` (rootless cannot use ports below 1024)
- [ ] `loginctl enable-linger` is set so it survives logout/reboot
- [ ] `systemctl --user status web.service` shows active

??? question "Hint 1"
    Rootless containers cannot bind ports below 1024, and the files you mount need an SELinux label the container may read. Check where this image serves from: `podman run --rm registry.access.redhat.com/ubi10/httpd-24 grep -R '^DocumentRoot' /etc/httpd/conf/`.

??? question "Hint 2"
    Quadlet files live in `~/.config/containers/systemd/`. The `[Install]` section does the auto-start; you do not `enable` a generated unit. `daemon-reload`, then `start`. Linger lets the user manager run without a login.

??? success "Solution"
    ```bash
    # as a normal user
    podman pull registry.access.redhat.com/ubi10/httpd-24
    podman images

    mkdir -p ~/webcontent
    echo "drill 14 container" > ~/webcontent/index.html
    podman run -d --name web -p 8080:8080 -v ~/webcontent:/var/www/html:Z registry.access.redhat.com/ubi10/httpd-24
    podman ps
    curl http://localhost:8080

    # auto-start via Quadlet
    mkdir -p ~/.config/containers/systemd
    cat > ~/.config/containers/systemd/web.container <<'EOF'
    [Unit]
    Description=Web container

    [Container]
    Image=registry.access.redhat.com/ubi10/httpd-24
    PublishPort=8080:8080
    Volume=%h/webcontent:/var/www/html:Z

    [Install]
    WantedBy=default.target
    EOF

    podman rm -f web
    loginctl enable-linger "$USER"
    systemctl --user daemon-reload
    systemctl --user start web.service
    systemctl --user status web.service
    curl http://localhost:8080
    ```
    **Verify:**

    - `:Z` is required or SELinux blocks the mounted content
    - on a system without internet access, pull from whatever registry is provided; the image may already be local
    - after reboot, `podman ps` shows the container running without a manual start (linger plus the `[Install]` section do this)

## Verification Steps

1. Confirm you can distinguish between package install, package query, and repo query.
2. Confirm you can prove both the current mount and the persistent mount.
3. Confirm you can explain the order: partition -> PV -> VG -> LV -> filesystem -> mount.
4. Confirm you can prove service state now and at boot with `systemctl`.

## Troubleshooting Section

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

## Common Mistakes And Recovery

- Mistake: forgetting to create the filesystem on a new LV.
  Recovery: run `lsblk -f` and identify missing filesystem signatures.
- Mistake: writing `/etc/fstab` entries from memory without checking `blkid`.
  Recovery: copy exact UUIDs and test with `mount -a`.
- Mistake: reading only `systemctl status` and not checking `is-enabled`.
  Recovery: always verify current state and boot persistence separately.
- Mistake: reading the UUID before the filesystem or swap signature exists (empty `UUID=` in `/etc/fstab`).
  Recovery: run `mkfs` or `mkswap` first, then `blkid`.
- Mistake: starting a drill on a disk still holding the previous drill's partitions.
  Recovery: run that drill's *Disk reset* block and remove stale `/etc/fstab` lines.

## Mini Quiz

1. What command queries an installed RPM package?
2. What command tests `/etc/fstab` without rebooting?
3. What is the correct order for building an LVM-backed filesystem?
4. What command checks whether a service is enabled at boot?
5. Why is `blkid` useful in storage labs?
6. Which command shows the PE size of a volume group?

??? success "Answers"
    1. `rpm -q PACKAGE`
    2. `mount -a`
    3. partition -> PV -> VG -> LV -> filesystem -> mount
    4. `systemctl is-enabled SERVICE`
    5. It shows UUIDs and filesystem details for persistent mount work.
    6. `vgs -o +vg_extent_size VG` or `vgdisplay VG` (plain `vgs` does not show it).

## Exam-Style Tasks

### Exam-Style Task 1

**Setup:** clean `/dev/vdb`.

??? warning "Disk reset (destroys everything on /dev/vdb)"
    ```bash
    sudo umount /data /par1 /record /datasource 2>/dev/null
    sudo umount /dev/vdb* 2>/dev/null
    sudo swapoff /dev/vdb* 2>/dev/null
    sudo vgremove -ff -y vgdata vgexam vgapp datacontainer 2>/dev/null
    sudo wipefs -a /dev/vdb
    sudo sed -i '\|[[:space:]]/data[[:space:]]|d' /etc/fstab
    ```

**Task:** on `/dev/vdb`, create one GPT partition that uses the whole disk, a PV, a VG named `vgdata` and a 1 GiB logical volume named `lvdata`. Build an XFS filesystem on it, mount it at `/data`, and make sure it mounts automatically after reboot.

Grader mindset checklist:

- [ ] partition, PV, VG, and LV must exist
- [ ] filesystem must exist on the LV
- [ ] mountpoint must exist
- [ ] `/etc/fstab` must contain a correct entry
- [ ] mount must still work after reboot

??? success "Solution"
    ```bash
    sudo parted /dev/vdb --script mklabel gpt mkpart primary 1MiB 100%
    sudo partprobe /dev/vdb
    sudo pvcreate /dev/vdb1
    sudo vgcreate vgdata /dev/vdb1
    sudo lvcreate -n lvdata -L 1G vgdata
    sudo mkfs.xfs /dev/vgdata/lvdata
    sudo mkdir -p /data
    UUID=$(sudo blkid -s UUID -o value /dev/vgdata/lvdata)
    echo "UUID=$UUID /data xfs defaults 0 0" | sudo tee -a /etc/fstab
    sudo systemctl daemon-reload
    sudo mount -a
    findmnt /data
    ```
    **Verify:** `lsblk -f` shows `LVM2_member` on `vdb1` and `xfs` on `vgdata-lvdata` mounted at `/data`; `sudo lvs` shows `lvdata` at `1.00g`; `findmnt --verify` is clean. **Reboot and re-check:** `findmnt /data`.

### Exam-Style Task 2

**Setup:** as `student`, no extra preparation.

**Task:** create `~/hostreport.sh` that appends one line with the date and hostname to `/var/tmp/host-report.txt`. Check that `sshd` is active and enabled. Schedule the script as a cron job for `student` every 5 minutes, and prove it ran.

Grader mindset checklist:

- [ ] script file must exist and be executable
- [ ] it must run correctly
- [ ] service state should be verifiable (`is-active` and `is-enabled`)
- [ ] scheduler configuration should exist
- [ ] output or logs should prove the job ran

??? success "Solution"
    ```bash
    cat > ~/hostreport.sh <<'EOF'
    #!/bin/bash
    echo "$(date) $(hostname)" >> /var/tmp/host-report.txt
    EOF
    chmod +x ~/hostreport.sh
    ~/hostreport.sh
    systemctl is-active sshd
    systemctl is-enabled sshd
    systemctl is-active crond
    (crontab -l 2>/dev/null; echo "*/5 * * * * $HOME/hostreport.sh") | crontab -
    crontab -l
    ```
    **Verify:** `wc -l /var/tmp/host-report.txt` is `1` right after the manual run, and grows by one line at each multiple of five minutes. `sudo journalctl -u crond --since "15 min ago"` shows `(student) CMD`. **Reboot and re-check:** `crontab -l` still lists the job and `systemctl is-enabled crond sshd` reports `enabled`.

## Recap / Memory Anchors

- repo, package, script, mount, persistence
- LVM is a chain, not one command
- test `/etc/fstab` before reboot
- verify `is-active` and `is-enabled`
- read the UUID only after `mkfs` or `mkswap`
- reset a shared disk before every storage drill

## Quick Command Summary

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
vgs -o +vg_extent_size
```

## Continue In Order

**Previous:** [24 Foundations Labs](24-foundations-labs.md) · **Next:** [26 Networking, Users and Security Labs](26-networking-users-and-security-labs.md)

- Move on only when storage, filesystems, services, scheduling, and scripting checks feel stable
