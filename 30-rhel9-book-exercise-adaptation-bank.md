---
description: Eighteen optional extra-repetition tasks adapted to RHEL 10, each with a Setup line, a grader checklist, hints and a collapsed solution.
---

# 30 RHEL 9 Book Exercise Adaptation Bank

> By the end of this page you can repeat the core administration skills (archives, links, permissions, users, scheduling, storage, networking, NFS, SSH, firewall, SELinux) as eighteen short tasks, each verified by commands.

!!! note "Credit"
    These tasks are original practice adapted from the style of exercises in a published RHEL 9 study book (Asghar Ghori); they are not affiliated with or endorsed by the author or publisher. Buy the book if you want the originals.

This page is an optional supplemental exercise bank. It is not part of the required beginner route. Use it as extra task repetition, not as a replacement for the core lesson and lab path.

!!! example "Try it now (2 minutes)"
    ```bash
    sudo -i
    id
    exit
    ```
    ```text title="Example output"
    uid=0(root) gid=0(root) groups=0(root) context=unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023
    ```
    Most tasks below say "Work as `root`". `sudo -i` from `student` gives you a root shell; type `exit` to come back.

## Why it matters

Repetition turns commands into reflexes. Each task here is one small, complete job (build it, verify it, make it persist), the same shape as the work you do in a real maintenance window.

**Objectives covered:** see the index table below, each task names the official RHEL 10 objective it trains.

**Prereqs:** lessons `00-16`, labs [22 Labs Track](22-labs-track-and-skill-check-guide.md) to [26 Networking, Users, and Security Labs](26-networking-users-and-security-labs.md), and [28 RHCSA 10 Mixed Practice Bank](28-rhcsa-10-mixed-practice-bank.md) · **Time:** about 4 h

## How to use this page

- Use the shared lab environment from [23 VM Lab Setup and Baseline Checks](23-vm-lab-setup-and-baseline-checks.md): `servera.lab.example` (`192.168.122.10`), `serverb.lab.example` (`192.168.122.11`), user `student` (password `student`, sudo), root password `redhat`, spare disks `/dev/vdb` and `/dev/vdc` (2 GiB each, empty).
- Work on `servera` unless a task says `serverb`.
- Every task has a **Setup** line that creates what it needs. Read nothing but the task until you have tried it: hints first, solution last.
- For tasks that need `serverb` by name, run this once on `servera`:

```bash
grep -q serverb.lab.example /etc/hosts || echo '192.168.122.11 serverb.lab.example serverb' | sudo tee -a /etc/hosts
```

??? warning "Disk reset (destroys everything on the disk)"
    Task 10 starts from a clean `/dev/vdb`. Run this first. It also removes the mounts, volume groups and `/etc/fstab` lines the course's drills create (including `/appdata` from Task 10), so a half-finished drill cannot send the next reboot into emergency mode.
    ```bash
    sudo umount /data /par1 /record /datasource /mnt/lvapp /appdata 2>/dev/null; sudo swapoff -a
    sudo vgremove -ff -y vgdata vgexam vgapp vgfs datacontainer 2>/dev/null
    sudo wipefs -a /dev/vdb[0-9]* 2>/dev/null; sudo wipefs -a /dev/vdb; sudo partprobe /dev/vdb
    sudo sed -i -E '\#[[:space:]]/(data|par1|record|datasource|mnt/lvapp|appdata)[[:space:]]#d; /\/dev\/vdb|vg(data|app|fs)-/d' /etc/fstab
    for s in $(awk '$1~/^(UUID|LABEL)=/{print $1}' /etc/fstab); do sudo blkid -t "$s" >/dev/null || sudo sed -i "\#^$s[[:space:]]#d" /etc/fstab; done
    sudo systemctl daemon-reload; sudo swapon -a
    ```

## Index

| Task | Topic | Official objective |
|---|---|---|
| 1 | Archive, verify, restore | Archive, compress, unpack, and uncompress files using tar, gzip, and bzip2 |
| 2 | Hard and symbolic links | Create hard and soft links |
| 3 | Collaborative directory with SGID | Diagnose and correct file permission problems |
| 4 | Sticky-bit drop zone | List, set, and change standard ugo/rwx permissions |
| 5 | Users with default and custom attributes | Create, delete, and modify local user accounts |
| 6 | Password aging and lock state | Change passwords and adjust password aging for local user accounts |
| 7 | Group membership, sudo, ownership | Configure privileged access |
| 8 | One-time and repeating jobs | Schedule tasks using at, cron and systemd timer units |
| 9 | Repository and package verification | Install and remove RPM software packages |
| 10 | GPT, LVM, filesystem and swap | Add new partitions and logical volumes, and swap to a system non-destructively |
| 11 | Persistent journald storage | Preserve system journals |
| 12 | Hostname and local resolution | Configure hostname resolution |
| 13 | Static `nmcli` profile | Configure IPv4 and IPv6 addresses |
| 14 | NFS export and autofs | Configure autofs |
| 15 | Chrony client health | Configure time service clients |
| 16 | SSH key-based authentication | Configure key-based authentication for SSH |
| 17 | Firewall service and port rules | Configure firewall settings using firewall-cmd/firewalld |
| 18 | SELinux file context and port label | Restore default file contexts; Manage SELinux port labels |

## Foundations Carryover

### Task 1: Archive, verify, and restore a configuration snapshot

**Setup:** none. Work as `root` (`sudo -i`).

**Task:**

1. Create `/var/tmp/configsnap`.
2. Copy `/etc/hosts` and `/etc/services` into it.
3. Create `/root/configsnap.tar.gz` from that directory.
4. List the archive contents without extracting them.
5. Extract the archive into `/root/restore-test`.

**Grader checklist:**

- [ ] `/root/configsnap.tar.gz` exists
- [ ] `tar -tzvf /root/configsnap.tar.gz` shows both files
- [ ] `/root/restore-test/var/tmp/configsnap` contains the files you archived

??? question "Hint 1"
    `tar` removes the leading `/` from member names, so the extracted tree starts at `var/` inside the target directory.

??? success "Solution"
    ```bash
    mkdir -p /var/tmp/configsnap
    cp /etc/hosts /etc/services /var/tmp/configsnap
    tar -czvf /root/configsnap.tar.gz /var/tmp/configsnap
    tar -tzvf /root/configsnap.tar.gz
    mkdir -p /root/restore-test
    tar -xzvf /root/configsnap.tar.gz -C /root/restore-test
    find /root/restore-test -type f | grep -E 'hosts|services'
    ```
    **Verify:** the `find` prints two paths under `/root/restore-test/var/tmp/configsnap/`.

### Task 2: Create both hard and symbolic links correctly

**Setup:** none. Work as `root`.

**Task:**

1. Create `/var/tmp/linkdemo.txt` with three lines of text.
2. Create a hard link at `/var/tmp/linkdemo.hard`.
3. Create a symbolic link at `/var/tmp/linkdemo.soft`.
4. Rename the original file to `/var/tmp/linkdemo.renamed`.
5. Repair only the link that breaks.

**Grader checklist:**

- [ ] the hard link still points to the same inode after the rename
- [ ] the symbolic link breaks after the rename and works again after the repair
- [ ] you can explain why the two link types behave differently

??? question "Hint 1"
    A hard link is another name for the same inode. A symbolic link stores a path as text.

??? success "Solution"
    ```bash
    printf 'alpha\nbeta\ngamma\n' > /var/tmp/linkdemo.txt
    ln /var/tmp/linkdemo.txt /var/tmp/linkdemo.hard
    ln -s /var/tmp/linkdemo.txt /var/tmp/linkdemo.soft
    mv /var/tmp/linkdemo.txt /var/tmp/linkdemo.renamed
    ls -li /var/tmp/linkdemo.renamed /var/tmp/linkdemo.hard
    readlink -f /var/tmp/linkdemo.soft || true
    rm /var/tmp/linkdemo.soft
    ln -s /var/tmp/linkdemo.renamed /var/tmp/linkdemo.soft
    cat /var/tmp/linkdemo.soft
    ```
    **Verify:** the two `ls -li` lines show the same inode number; `cat /var/tmp/linkdemo.soft` prints `alpha`, `beta`, `gamma` on three lines.

### Task 3: Build a collaborative directory with SGID

**Setup:** none. Work as `root`.

**Task:**

1. Create group `projectops`.
2. Create directory `/srv/projectops`.
3. Set group ownership to `projectops`.
4. Configure permissions so members can collaborate there and new files inherit the group automatically.

**Grader checklist:**

- [ ] `ls -ld /srv/projectops` shows the `projectops` group
- [ ] the mode includes SGID (`drwxrwsr-x`)
- [ ] test files created inside inherit the `projectops` group

??? success "Solution"
    ```bash
    groupadd projectops
    mkdir -p /srv/projectops
    chgrp projectops /srv/projectops
    chmod 2775 /srv/projectops
    touch /srv/projectops/testfile
    ls -ld /srv/projectops
    ls -l /srv/projectops/testfile
    ```
    **Verify:** `testfile` shows group `projectops` even though `root`'s primary group is `root`.

### Task 4: Create a sticky-bit drop zone

**Setup:** none. Work as `root`.

**Task:**

1. Create `/srv/dropbox`.
2. Allow all users to create files there.
3. Prevent normal users from deleting each other's files.

**Grader checklist:**

- [ ] the directory mode ends with a sticky-bit indicator such as `t`
- [ ] users can create files there
- [ ] the permission model matches a shared drop zone

??? success "Solution"
    ```bash
    mkdir -p /srv/dropbox
    chmod 1777 /srv/dropbox
    ls -ld /srv/dropbox
    ```
    **Verify:** `ls -ld` prints `drwxrwxrwt`. Test: create a file as `student`, then try to delete it as another user.

## Administration Carryover

### Task 5: Create users with default and custom attributes

**Setup:** none. Work as `root`.

**Task:**

1. Create user `analyst2` with default settings.
2. Create user `operator2` with home `/srv/operator2` and shell `/bin/bash`.
3. Create user `guest2` with shell `/sbin/nologin`.
4. Verify all three accounts completely.

**Grader checklist:**

- [ ] account entries exist in `getent passwd`
- [ ] home directory and shell values are correct
- [ ] `guest2` uses a non-interactive shell

??? success "Solution"
    ```bash
    useradd analyst2
    useradd -m -d /srv/operator2 -s /bin/bash operator2
    useradd -m -s /sbin/nologin guest2
    getent passwd analyst2 operator2 guest2
    ls -ld /srv/operator2
    ```
    **Verify:** `operator2`'s home is `/srv/operator2` with shell `/bin/bash`, and `guest2`'s shell is `/sbin/nologin`.

### Task 6: Configure password aging and lock state

**Setup:** users from Task 5, created if missing: `id analyst2 &>/dev/null || useradd analyst2` and `id guest2 &>/dev/null || useradd -m -s /sbin/nologin guest2`. Work as `root`.

**Task:**

1. Set user `analyst2` to maximum password age `60`, minimum `7`, warning `10`.
2. Lock account `guest2`.
3. Unlock the account again.
4. Verify both aging and lock state.

**Grader checklist:**

- [ ] `chage -l analyst2` shows the intended aging values
- [ ] lock and unlock actions are reflected in account status
- [ ] you can explain the difference between locking an account and password-aging policy

??? question "Hint 1"
    `passwd -S USER` shows the lock state as its second field (`L` locked, `P` usable password).

??? success "Solution"
    ```bash
    chage -M 60 -m 7 -W 10 analyst2
    echo 'guest2:Pass#1234' | chpasswd
    passwd -l guest2
    passwd -S guest2
    passwd -u guest2
    chage -l analyst2
    passwd -S guest2
    ```
    **Verify:** `chage -l analyst2` lists a maximum of `60` days, minimum `7`, warning `10`. `passwd -S guest2` shows `L` while locked and `P` once unlocked. `guest2` needs a real password first: unlocking an account that has no password is refused (`passwd: unlocking the password would result in a passwordless account.`).

### Task 7: Configure group membership, sudo access, and ownership

**Setup:** `id operator2 &>/dev/null || useradd -m -d /srv/operator2 -s /bin/bash operator2`. Work as `root`.

**Task:**

1. Create group `opsadmin`.
2. Add `operator2` to that group as a supplementary member.
3. Create sudoers drop-in `/etc/sudoers.d/opsadmin` so members of `opsadmin` can run administrative commands.
4. Create `/srv/opsdata`, owned by `operator2:opsadmin`.

**Grader checklist:**

- [ ] `id operator2` shows `opsadmin`
- [ ] `visudo -c` passes
- [ ] ownership of `/srv/opsdata` is correct

??? question "Hint 1"
    A sudoers drop-in must be mode `0440`. Validate it with `visudo -c` (or write it with `visudo -f`).

??? success "Solution"
    ```bash
    groupadd opsadmin
    usermod -aG opsadmin operator2
    echo '%opsadmin ALL=(ALL) ALL' > /root/opsadmin.sudo
    visudo -cf /root/opsadmin.sudo && install -m 0440 /root/opsadmin.sudo /etc/sudoers.d/opsadmin
    rm -f /root/opsadmin.sudo
    mkdir -p /srv/opsdata
    chown operator2:opsadmin /srv/opsdata
    id operator2
    visudo -c
    ls -ld /srv/opsdata
    sudo -l -U operator2
    ```
    **Verify:** `sudo -l -U operator2` shows `(ALL) ALL`.

### Task 8: Create both one-time and repeating scheduled jobs

**Setup:** `sudo dnf install -y at && sudo systemctl enable --now atd`. Work as `student` (not root).

**Task:**

1. Schedule a one-time `at` job that writes the hostname to `/tmp/at-proof.txt` five minutes from now.
2. Add a crontab entry that appends the date to `/tmp/cron-proof.txt` every five minutes.

**Grader checklist:**

- [ ] `atq` shows the queued job
- [ ] `crontab -l` shows the cron entry
- [ ] you used full paths where practical

??? success "Solution"
    ```bash
    echo '/usr/bin/hostname >> /tmp/at-proof.txt' | at now + 5 minutes
    atq
    (crontab -l 2>/dev/null; echo '*/5 * * * * /usr/bin/date >> /tmp/cron-proof.txt') | crontab -
    crontab -l
    systemctl is-active crond atd
    ```
    **Verify:** after five minutes `cat /tmp/at-proof.txt /tmp/cron-proof.txt` shows the hostname and a date. Remove the cron line afterwards with `crontab -e`.

### Task 9: Configure repositories and verify a package

**Setup:** working repositories (see task P2 in [28 RHCSA 10 Mixed Practice Bank](28-rhcsa-10-mixed-practice-bank.md) for a local-media repository). Work as `root`.

**Task:**

1. Verify enabled repositories.
2. Install a package that provides the `tree` command.
3. Query the installed package and confirm which command it provides.

**Grader checklist:**

- [ ] enabled repositories are visible
- [ ] `tree` is installed
- [ ] RPM query commands confirm ownership of the binary

??? success "Solution"
    ```bash
    dnf repolist
    dnf install -y tree
    rpm -q tree
    rpm -qf /usr/bin/tree
    ```
    **Verify:** `rpm -qf /usr/bin/tree` prints the package name `tree-...`.

### Task 10: Build persistent GPT, LVM, filesystem, and swap storage

**Setup:** clean `/dev/vdb` (run the Disk reset above). Work as `root`.

**Task:** on `/dev/vdb`:

1. Create a GPT label, one 900 MiB partition for LVM, and one 768 MiB partition for swap.
2. Build volume group `vgapp` and a logical volume `lvapp` sized `700M`.
3. Create an ext4 filesystem on the LV.
4. Mount it persistently at `/appdata` by UUID.
5. Create, activate, and persist swap on the second partition.

**Grader checklist:**

- [ ] `lsblk -f` shows the partition and filesystem layout
- [ ] `lvs` shows `vgapp/lvapp`
- [ ] `findmnt /appdata` works
- [ ] `swapon --show` shows the new swap area
- [ ] `/etc/fstab` contains both persistent entries, each with a non-empty `UUID=`

??? question "Hint 1"
    The UUID only exists after the filesystem or swap signature is created. Run `mkfs.ext4` and `mkswap` first, then read the UUIDs.

??? question "Hint 2"
    Test the fstab lines with `mount -a` and `swapon -a` before you reboot.

??? success "Solution"
    ```bash
    parted -s /dev/vdb mklabel gpt
    parted -s /dev/vdb mkpart primary 1MiB 901MiB
    parted -s /dev/vdb set 1 lvm on
    parted -s /dev/vdb mkpart primary linux-swap 901MiB 1669MiB
    partprobe /dev/vdb
    udevadm settle
    pvcreate /dev/vdb1
    vgcreate vgapp /dev/vdb1
    lvcreate -n lvapp -L 700M vgapp
    mkfs.ext4 /dev/vgapp/lvapp
    mkswap /dev/vdb2
    mkdir -p /appdata
    blkid /dev/vgapp/lvapp /dev/vdb2
    echo "UUID=$(blkid -s UUID -o value /dev/vgapp/lvapp) /appdata ext4 defaults 0 0" >> /etc/fstab
    echo "UUID=$(blkid -s UUID -o value /dev/vdb2) none swap defaults 0 0" >> /etc/fstab
    systemctl daemon-reload
    mount -a
    swapon -a
    findmnt /appdata
    swapon --show
    ```
    **Verify:** `grep -E 'appdata|swap' /etc/fstab` shows two lines with real UUIDs; `lsblk -f` shows `ext4` on the LV and `swap` on `vdb2`. Reboot and check `findmnt /appdata` and `swapon --show` again.

### Task 11: Make journald storage persistent

**Setup:** none. Work as `root`.

**Task:**

1. Configure `journald` to store logs persistently.
2. Restart the journal service and flush the journal to disk.
3. Verify both configuration and resulting storage behavior.

**Grader checklist:**

- [ ] the config explicitly requests persistent storage
- [ ] `/var/log/journal` exists and contains a machine-ID directory
- [ ] `journalctl -b` shows current boot logs

??? question "Hint 1"
    With the default `Storage=auto`, journald only writes to disk if `/var/log/journal` already exists. Put `Storage=persistent` in a drop-in under `/etc/systemd/journald.conf.d/` (there is no `/etc/systemd/journald.conf` by default, so a `sed` on it changes nothing). A restart alone does not create `/var/log/journal`; `journalctl --flush` does.

??? success "Solution"
    ```bash
    mkdir -p /etc/systemd/journald.conf.d
    printf '[Journal]\nStorage=persistent\n' | tee /etc/systemd/journald.conf.d/persistent.conf
    systemctl restart systemd-journald
    journalctl --flush
    systemd-analyze cat-config systemd/journald.conf
    ls -ld /var/log/journal
    ls /var/log/journal
    journalctl --disk-usage
    journalctl -b | tail
    ```
    **Verify:** `ls /var/log/journal` prints a long machine-ID directory name; after a reboot `journalctl --list-boots` lists more than one boot. `systemd-analyze cat-config systemd/journald.conf` shows the drop-in with `Storage=persistent`.

## Networking and Security Carryover

### Task 12: Set hostname and local name resolution

**Setup:** none. Work as `root`.

**Task:**

1. Set hostname to `servera.lab.example`.
2. Add `/etc/hosts` entries so `servera.lab.example` resolves to `192.168.122.10` and `serverb.lab.example` resolves to `192.168.122.11`.
3. Verify both hostname and local resolution.

**Grader checklist:**

- [ ] `hostnamectl` shows the new hostname
- [ ] `getent hosts servera.lab.example` returns `192.168.122.10`
- [ ] `getent hosts serverb.lab.example` returns `192.168.122.11`

??? success "Solution"
    ```bash
    hostnamectl set-hostname servera.lab.example
    grep -q servera.lab.example /etc/hosts || echo '192.168.122.10 servera.lab.example servera' >> /etc/hosts
    grep -q serverb.lab.example /etc/hosts || echo '192.168.122.11 serverb.lab.example serverb' >> /etc/hosts
    hostnamectl
    getent hosts servera.lab.example serverb.lab.example
    ```
    **Verify:** reboot and re-run `hostnamectl --static` and `getent hosts serverb.lab.example`.

### Task 13: Create a static `nmcli` connection profile

**Setup:** work at the VM console, or keep the address unchanged as in this task, so an SSH session survives. Work as `root`.

**Task:** make the active Ethernet profile static with address `192.168.122.10/24`, gateway `192.168.122.1`, DNS `192.168.122.1`; bring it up and verify the live address and the stored profile values.

**Grader checklist:**

- [ ] `nmcli connection show NAME` shows `ipv4.method manual` and the address
- [ ] `nmcli connection up NAME` succeeds
- [ ] `ip addr` reflects the active address and `ip route` shows the default gateway

??? question "Hint 1"
    Find `NAME` with `nmcli -t -f NAME,TYPE connection show --active`. Changes only apply after `connection up`.

??? success "Solution"
    ```bash
    NAME=$(nmcli -t -f NAME,TYPE connection show --active | awk -F: '$2=="802-3-ethernet"{print $1; exit}')
    echo "profile: $NAME"
    nmcli connection modify "$NAME" ipv4.method manual ipv4.addresses 192.168.122.10/24 ipv4.gateway 192.168.122.1 ipv4.dns 192.168.122.1
    nmcli connection up "$NAME"
    nmcli connection show "$NAME" | grep ipv4
    ip addr
    ip route
    ```
    **Verify:** reboot and check `ip -4 addr` again; the profile is stored by NetworkManager, so it persists.

### Task 14: Configure NFS export and autofs client access

**Setup:** two machines. Run the hosts line from "How to use this page" on `servera`. On `serverb` (as root):

```bash
dnf install -y nfs-utils
mkdir -p /srv/nfsshare
echo 'nfs ok' > /srv/nfsshare/hello.txt
echo '/srv/nfsshare 192.168.122.0/24(rw,sync)' > /etc/exports.d/nfsshare.exports
systemctl enable --now nfs-server
firewall-cmd --add-service=nfs --permanent
firewall-cmd --reload
```

On `servera`: `dnf install -y autofs nfs-utils`.

**Task:**

Server side (`serverb`):

1. Export `/srv/nfsshare` read-write to `192.168.122.0/24`.

Client side (`servera`):

1. Use a direct map so that `serverb.lab.example:/srv/nfsshare` mounts on demand at `/mnt/nfsshare`.
2. Start and enable `autofs`.

**Grader checklist:**

- [ ] `exportfs -rav` completes on the server and lists the export
- [ ] accessing `/mnt/nfsshare` on the client triggers the mount and shows `hello.txt`
- [ ] `systemctl is-enabled autofs` returns `enabled`

??? question "Hint 1"
    A direct map is two pieces: a master-map line using the key `/-` that points to `/etc/auto.direct`, and the map file with the full mount path as its key.

??? success "Solution"
    ```bash
    # on serverb
    exportfs -rav

    # on servera
    echo '/- /etc/auto.direct' > /etc/auto.master.d/direct.autofs
    echo '/mnt/nfsshare -rw,sync serverb.lab.example:/srv/nfsshare' > /etc/auto.direct
    systemctl enable autofs
    systemctl restart autofs
    ls /mnt/nfsshare
    findmnt /mnt/nfsshare
    ```
    **Verify:** `findmnt /mnt/nfsshare` shows the NFS source after the `ls`; reboot `servera` and repeat. Optional: `showmount -e serverb.lab.example` lists the export. <!-- VERIFY: showmount -e localhost works on a server running nfs-server (observed); from a remote client with only the firewalld nfs service open it needs mountd and rpc-bind too (untested) -->

### Task 15: Verify chrony client health

**Setup:** none. Work as `root`.

**Task:**

1. Ensure `chronyd` is active now and enabled at boot.
2. Inspect current time-source visibility.
3. Verify that timedate state reflects NTP use.

**Grader checklist:**

- [ ] `systemctl is-active chronyd` returns `active`
- [ ] `systemctl is-enabled chronyd` returns `enabled`
- [ ] `chronyc sources` returns source information

??? success "Solution"
    ```bash
    systemctl enable --now chronyd
    systemctl is-active chronyd
    systemctl is-enabled chronyd
    chronyc sources -v
    timedatectl
    ```
    **Verify:** `timedatectl` shows `System clock synchronized: yes` and `NTP service: active`.

### Task 16: Configure SSH key-based authentication

**Setup:** run the hosts line on `servera`. User `student` (password `student`) exists on `serverb`.

**Task:** as `student` on `servera`:

1. Generate an SSH key pair if needed.
2. Copy the public key to `student` on `serverb`.
3. Verify passwordless login.

**Grader checklist:**

- [ ] `~/.ssh/id_ed25519` and `~/.ssh/id_ed25519.pub` exist
- [ ] the public key is installed on `serverb`
- [ ] `ssh student@serverb.lab.example hostname` works without a password prompt

??? success "Solution"
    ```bash
    ssh-keygen -t ed25519
    ssh-copy-id student@serverb.lab.example
    ssh student@serverb.lab.example hostname
    ```
    **Verify:** the last command prints `serverb.lab.example` with no password prompt. If it still asks, check permissions on `~/.ssh` (`700`) and `authorized_keys` (`600`) on `serverb`.

### Task 17: Open firewall access and verify persistence

**Setup:** `systemctl is-active firewalld` must print `active`. Work as `root`.

**Task:**

1. Open HTTP service permanently in `firewalld`.
2. Open TCP port `85` permanently as an extra direct port rule.
3. Reload the firewall.
4. Verify the rule set.

**Grader checklist:**

- [ ] the permanent rule set includes `http`
- [ ] the permanent rule set includes port `85/tcp`
- [ ] you can separate service-based rules from raw port rules

??? success "Solution"
    ```bash
    firewall-cmd --add-service=http --permanent
    firewall-cmd --add-port=85/tcp --permanent
    firewall-cmd --reload
    firewall-cmd --list-all
    firewall-cmd --list-all --permanent
    ```
    **Verify:** both listings show `http` under services and `85/tcp` under ports. Without `--permanent` the rules vanish at the next reload or reboot.

### Task 18: Fix SELinux content access and custom HTTP port labeling

**Setup:** `dnf install -y httpd policycoreutils-python-utils`. Work as `root`.

**Task:**

1. Create `/srv/webcontent` and place an `index.html` file there.
2. Add a persistent SELinux file-context rule so the directory can be served by `httpd`.
3. Apply the labels.
4. Add TCP port `85` to the HTTP SELinux port type.
5. Verify the file context and port label.

**Grader checklist:**

- [ ] `semanage fcontext -l | grep webcontent` reflects the new rule
- [ ] `ls -Zd /srv/webcontent /srv/webcontent/index.html` shows `httpd_sys_content_t`
- [ ] `semanage port -l | grep http_port_t` includes `85`

??? question "Hint 1"
    `chcon` is temporary. A rule added with `semanage fcontext` is what `restorecon` applies, and it survives a full relabel.

??? success "Solution"
    ```bash
    mkdir -p /srv/webcontent
    echo 'web test' > /srv/webcontent/index.html
    semanage fcontext -a -t httpd_sys_content_t '/srv/webcontent(/.*)?'
    restorecon -Rv /srv/webcontent
    semanage port -a -t http_port_t -p tcp 85
    ls -Zd /srv/webcontent /srv/webcontent/index.html
    semanage port -l | grep http_port_t
    ```
    **Verify:** the `ls -Z` lines show `httpd_sys_content_t`; the port list includes `85`. If `semanage port -a` says the port is already defined, it is already labelled and you can continue.

## Summary

- every task ends with a check command, and persistent tasks end with a reboot check
- read UUIDs only after the filesystem or swap signature exists
- `--permanent`, `/etc/fstab`, `systemctl enable` and `semanage` are what make a change survive

**Previous:** [28 RHCSA 10 Mixed Practice Bank](28-rhcsa-10-mixed-practice-bank.md) · **Next:** [17a RHCSA Command Reference Cheat Sheet](17a-rhcsa-command-reference-cheat-sheet.md): back to the main route.
