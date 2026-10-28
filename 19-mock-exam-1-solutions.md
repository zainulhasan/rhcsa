---
description: Grade table and worked solutions for Mock Exam 1, with verification, persistence and a final reboot check for each task.
---

# Mock Exam 1 Solutions

> Score yourself with the grade table, then open a solution only for the tasks you could not finish or want to compare.

Use this file only after you complete [18 Mock Exam 1](18-mock-exam-1.md) without help. All commands run on `servera` as `student` with `sudo`, except where a task says otherwise. Example output is illustrative.

## Solution strategy

Work in dependency order:

1. users and permissions
2. package and script tasks
3. scheduler and service tasks
4. storage and filesystem tasks
5. security and persistence tasks
6. reboot and verify

## Grade yourself

This is the course's own practice scheme. A task earns its full points only if the command in the second column gives the expected result. Run each one **after the reboot in Task 18** as well where the "Persists?" column says yes.

| Task | Points | Verification command | Expected result | Persists? |
|---|---|---|---|---|
| 1 | 6 | `id analyst1; sudo chage -l analyst1` | groups include `reporting`; Maximum 60, Minimum 7, Warning 10 | yes |
| 2 | 5 | `stat -c '%U:%G %a' /srv/reports` | `root:reporting 2775` | yes |
| 3 | 5 | `ls -li /srv/reports/weekly.txt /var/tmp/weekly.txt.*; wc -l < /srv/reports/weekly.txt` | hard link has the same inode and link count 2; soft link shows `->`; `3` | yes |
| 4 | 4 | `grep -c 'bash$' /var/tmp/bash-users.txt; cat /var/tmp/bash-users.count` | the two numbers are equal | yes |
| 5 | 3 | `rpm -q tree; command -v tree` | `tree-<version>`; `/usr/bin/tree` | yes |
| 6 | 6 | `userreport.sh analyst1; userreport.sh nosuchuser9; head -1 /usr/local/bin/userreport.sh` | `exists`; `missing`; `#!/bin/bash` | yes |
| 7 | 4 | `systemctl is-enabled atd; cat /var/tmp/at-proof.txt` | `enabled`; one hostname line | yes (atd) |
| 8 | 4 | `crontab -l; tail -n 2 /var/tmp/cron-proof.txt` | `*/5 * * * * date >> /var/tmp/cron-proof.txt`; date lines | yes |
| 9 | 3 | `systemctl is-active sshd; systemctl is-enabled sshd` | `active`; `enabled` | yes |
| 10 | 6 | `ssh -o BatchMode=yes student@serverb.lab.example hostname` | `serverb.lab.example`, no prompt | yes |
| 11 | 7 | `lsblk -o NAME,SIZE /dev/vdb; sudo lvs -o lv_name,vg_name,lv_size vgmock; sudo parted /dev/vdb print` | `vdb1` 600M; `lvdata vgmock 512.00m`; flag `lvm` | yes |
| 12 | 7 | `findmnt /data; grep ' /data ' /etc/fstab; sudo mount -a` | xfs on `/dev/mapper/vgmock-lvdata`; line starts `UUID=`; no error | yes |
| 13 | 5 | `swapon --show; grep swap /etc/fstab` | `/dev/vdb2` about 512M; line starts `UUID=` | yes |
| 14 | 3 | `hostnamectl --static` | `servera.lab.example` | yes |
| 15 | 4 | `sudo firewall-cmd --list-services; sudo firewall-cmd --permanent --list-services` | both include `http` | yes |
| 16 | 5 | `getenforce; ls -Z /var/www/html/index.html; cat /var/www/html/index.html` | `Enforcing`; `httpd_sys_content_t`; `mock1` | yes |
| 17 | 4 | `systemd-analyze cat-config systemd/journald.conf \| grep '^Storage'; ls -d /var/log/journal` | `Storage=persistent`; the directory exists | yes |
| 18 | 19 | the reboot checklist in Task 18 below | every line matches | n/a |

| Score sheet | |
|---|---|
| Points earned (out of 100) | ____ |
| Your own target to move on to [Mock Exam 2](20-mock-exam-2.md) | 70 |
| Tasks to redo | ____ |

## Solutions

### Task 1

??? success "Solution"
    ```bash
    sudo groupadd reporting
    sudo useradd -m analyst1
    sudo usermod -aG reporting analyst1
    sudo chage -M 60 -m 7 -W 10 analyst1
    ```
    **Verify:**
    ```bash
    id analyst1
    sudo chage -l analyst1
    ```
    ```text title="Example output"
    uid=1001(analyst1) gid=1002(analyst1) groups=1002(analyst1),1001(reporting)
    Minimum number of days between password change		: 7
    Maximum number of days between password change		: 60
    Number of days of warning before password expires	: 10
    ```
    **Persistence:** user and aging data live in `/etc/passwd`, `/etc/group` and `/etc/shadow`, so there is nothing more to do. Use `-aG`: plain `-G` would replace the user's other groups.

### Task 2

??? success "Solution"
    ```bash
    sudo mkdir -p /srv/reports
    sudo chown root:reporting /srv/reports
    sudo chmod 2775 /srv/reports
    ```
    **Verify:**
    ```bash
    ls -ld /srv/reports
    stat -c '%U:%G %a' /srv/reports
    ```
    ```text title="Example output"
    drwxrwsr-x. 2 root reporting 6 Jan  5 10:00 /srv/reports
    root:reporting 2775
    ```
    The `s` in the group triplet is the setgid bit: new files inherit group `reporting`. **Persistence:** ownership and mode are stored in the filesystem.

### Task 3

??? success "Solution"
    ```bash
    printf "line1\nline2\nline3\n" | sudo tee /srv/reports/weekly.txt
    sudo ln /srv/reports/weekly.txt /var/tmp/weekly.txt.hard
    sudo ln -s /srv/reports/weekly.txt /var/tmp/weekly.txt.soft
    ```
    **Verify:**
    ```bash
    ls -li /srv/reports/weekly.txt /var/tmp/weekly.txt.hard /var/tmp/weekly.txt.soft
    wc -l < /srv/reports/weekly.txt
    ```
    ```text title="Example output"
    655361 -rw-r--r--. 2 root reporting 18 Jan  5 10:01 /srv/reports/weekly.txt
    655361 -rw-r--r--. 2 root reporting 18 Jan  5 10:01 /var/tmp/weekly.txt.hard
    655370 lrwxrwxrwx. 1 root root      23 Jan  5 10:01 /var/tmp/weekly.txt.soft -> /srv/reports/weekly.txt
    3
    ```
    If `ln` says `Invalid cross-device link`, `/srv` and `/var/tmp` are on different filesystems (check `df /srv /var/tmp`); a hard link cannot cross filesystems. The links go in `/var/tmp` rather than `/tmp` because `/tmp` may be a RAM-backed tmpfs that is emptied at every reboot (and a hard link from `/srv` into a tmpfs always fails). **Persistence:** none needed; `/var/tmp` survives reboots and is cleaned only after a long time. <!-- VERIFY: /tmp is a tmpfs on RHEL 10 by default (check with findmnt /tmp) -->

### Task 4

??? success "Solution"
    ```bash
    grep 'bash$' /etc/passwd > /var/tmp/bash-users.txt
    grep -c 'bash$' /etc/passwd > /var/tmp/bash-users.count
    ```
    **Verify:**
    ```bash
    cat /var/tmp/bash-users.txt
    cat /var/tmp/bash-users.count
    [ "$(cat /var/tmp/bash-users.count)" = "$(wc -l < /var/tmp/bash-users.txt)" ] && echo OK
    ```
    The `$` anchors the match to the end of the line, so `/bin/bash` matches but `/bin/bash2` would not. `grep -c` prints only the number, which is what the task asks for.

### Task 5

??? success "Solution"
    ```bash
    sudo dnf install -y tree
    ```
    **Verify:**
    ```bash
    rpm -q tree
    command -v tree
    tree /srv/reports
    ```
    If you did not know the package name: `dnf provides '*/bin/tree'`.

### Task 6

??? success "Solution"
    ```bash
    sudo tee /usr/local/bin/userreport.sh >/dev/null <<'EOF'
    #!/bin/bash
    if id "$1" >/dev/null 2>&1; then
        echo exists
    else
        echo missing
    fi
    EOF
    sudo chmod +x /usr/local/bin/userreport.sh
    ```
    **Verify:**
    ```bash
    userreport.sh analyst1
    userreport.sh nosuchuser9
    ls -l /usr/local/bin/userreport.sh
    ```
    `id "$1"` returns exit status 0 for a known user and non-zero otherwise; the redirects hide its output so only `exists` or `missing` prints. If the shell says `command not found`, check that `/usr/local/bin` is in your `$PATH` (`echo $PATH`).

### Task 7

??? success "Solution"
    ```bash
    sudo dnf install -y at
    sudo systemctl enable --now atd
    echo 'hostname > /var/tmp/at-proof.txt' | at now + 2 minutes
    atq
    ```
    <!-- VERIFY: whether the at package is installed by default on RHEL 10 -->
    **Verify:**
    ```bash
    systemctl is-active atd
    atq
    sleep 130; cat /var/tmp/at-proof.txt
    ```
    ```text title="Example output"
    1	Mon Jan  5 10:05:00 2026 a student
    servera.lab.example
    ```
    The file holds whatever hostname the machine had when the job ran (it changes to `servera.lab.example` once Task 14 is done). If `at` says `Can't open /var/run/atd.pid`, the daemon is not running. **Persistence:** `enable --now` makes `atd` start at boot.

### Task 8

??? success "Solution"
    ```bash
    crontab -e
    ```
    Add this line, save and exit:

    ```text
    */5 * * * * date >> /var/tmp/cron-proof.txt
    ```

    Non-interactive alternative:

    ```bash
    (crontab -l 2>/dev/null; echo '*/5 * * * * date >> /var/tmp/cron-proof.txt') | crontab -
    ```
    **Verify:**
    ```bash
    crontab -l
    systemctl is-active crond
    sleep 300; tail -n 2 /var/tmp/cron-proof.txt
    ```
    Run it as `student`, not with `sudo`, so it lands in `student`'s crontab. Crontabs are stored on disk, so they survive a reboot as long as `crond` is enabled (it is by default).

### Task 9

??? success "Solution"
    ```bash
    sudo systemctl enable --now sshd
    ```
    **Verify:**
    ```bash
    systemctl is-active sshd
    systemctl is-enabled sshd
    ```
    ```text title="Example output"
    active
    enabled
    ```
    **Persistence:** the `enable` half is the persistence; `--now` is the "running now" half. Do both.

### Task 10

??? success "Solution"
    ```bash
    ssh-keygen -t ed25519 -N '' -f ~/.ssh/id_ed25519
    ssh-copy-id student@serverb.lab.example
    ```
    Answer `yes` to the host-key question and enter the password `student` when asked. Use `192.168.122.11` instead of the name if name resolution fails.

    **Verify:**
    ```bash
    ssh -o BatchMode=yes student@serverb.lab.example hostname
    ```
    ```text title="Example output"
    serverb.lab.example
    ```
    `BatchMode=yes` forbids any prompt, so a password fallback shows up as a failure. Key access is stored in `~/.ssh/authorized_keys` on `serverb`, so it persists. If it still asks for a password, check on `serverb`: `chmod 700 ~/.ssh; chmod 600 ~/.ssh/authorized_keys; restorecon -Rv ~/.ssh`.

### Task 11

??? success "Solution"
    ```bash
    lsblk /dev/vdb
    sudo parted --script /dev/vdb mklabel gpt
    sudo parted --script /dev/vdb mkpart primary 1MiB 601MiB
    sudo parted --script /dev/vdb set 1 lvm on
    sudo partprobe /dev/vdb
    sudo udevadm settle
    sudo pvcreate /dev/vdb1
    sudo vgcreate vgmock /dev/vdb1
    sudo lvcreate -n lvdata -L 512M vgmock
    ```
    **Verify:**
    ```bash
    lsblk -o NAME,SIZE,TYPE /dev/vdb
    sudo parted /dev/vdb print
    sudo lvs -o lv_name,vg_name,lv_size vgmock
    ```
    ```text title="Example output"
      LV     VG     LSize
      lvdata vgmock 512.00m
    ```
    The 600 MiB partition becomes about 596 MiB in the VG (LVM metadata and 4 MiB extents), so a 512 MiB LV fits. **Persistence:** partition table and LVM metadata are written to disk; the filesystem mount is the part that needs an fstab line (Task 12).

### Task 12

??? success "Solution"
    ```bash
    sudo mkfs.xfs /dev/vgmock/lvdata
    sudo mkdir -p /data
    echo "UUID=$(sudo blkid -s UUID -o value /dev/vgmock/lvdata) /data xfs defaults 0 0" | sudo tee -a /etc/fstab
    sudo systemctl daemon-reload
    sudo mount -a
    ```
    **Verify:**
    ```bash
    findmnt /data
    grep ' /data ' /etc/fstab
    df -h /data
    ```
    ```text title="Example output"
    TARGET SOURCE                     FSTYPE OPTIONS
    /data  /dev/mapper/vgmock-lvdata  xfs    rw,relatime,seclabel,attr2,inode64,logbufs=8,logbsize=32k,noquota
    ```
    `sudo blkid` matters: without root, `blkid` may print nothing and you would write `UUID= /data ...`. If you prefer the editor, run `sudo blkid /dev/vgmock/lvdata` and put the UUID in `/etc/fstab` with `sudo vi /etc/fstab`:

    ```text
    UUID=xxxx-xxxx  /data  xfs  defaults  0 0
    ```

    **Persistence:** the fstab line is the persistence. `sudo mount -a` with no error is the pre-reboot proof; Task 18 is the real proof.

### Task 13

??? success "Solution"
    ```bash
    sudo parted --script /dev/vdb mkpart swap linux-swap 601MiB 1113MiB
    sudo partprobe /dev/vdb
    sudo udevadm settle
    sudo mkswap /dev/vdb2
    sudo swapon /dev/vdb2
    echo "UUID=$(sudo blkid -s UUID -o value /dev/vdb2) none swap defaults 0 0" | sudo tee -a /etc/fstab
    sudo systemctl daemon-reload
    ```
    **Verify:**
    ```bash
    swapon --show
    grep swap /etc/fstab
    lsblk /dev/vdb
    ```
    ```text title="Example output"
    NAME      TYPE      SIZE USED PRIO
    /dev/vdb2 partition 512M   0B   -1
    ```
    `swapon /dev/vdb2` is not persistent by itself; the fstab line is. Prove it with `sudo swapoff /dev/vdb2 && sudo swapon -a && swapon --show`.

### Task 14

??? success "Solution"
    ```bash
    sudo hostnamectl set-hostname servera.lab.example
    ```
    **Verify:**
    ```bash
    hostnamectl --static
    cat /etc/hostname
    ```
    **Persistence:** `hostnamectl set-hostname` writes `/etc/hostname`, so it survives a reboot.

### Task 15

??? success "Solution"
    ```bash
    sudo firewall-cmd --add-service=http --permanent
    sudo firewall-cmd --reload
    ```
    **Verify:**
    ```bash
    sudo firewall-cmd --list-services
    sudo firewall-cmd --permanent --list-services
    ```
    ```text title="Example output"
    cockpit dhcpv6-client http ssh
    ```
    Without `--permanent` the rule is lost on reload or reboot; without the `--reload` the permanent rule is not yet active. `--add-service=http` followed by `--runtime-to-permanent` is the other valid route. If `firewalld` is not running, start it first: `sudo systemctl enable --now firewalld`.

### Task 16

??? success "Solution"
    ```bash
    getenforce
    sudo dnf install -y httpd
    echo mock1 > /tmp/index.html
    sudo mv /tmp/index.html /var/www/html/index.html
    ls -Z /var/www/html/index.html
    sudo restorecon -Rv /var/www/html
    ls -Z /var/www/html/index.html
    ```
    ```text title="Example output"
    Enforcing
    unconfined_u:object_r:user_tmp_t:s0 /var/www/html/index.html
    Relabeled /var/www/html/index.html from unconfined_u:object_r:user_tmp_t:s0 to unconfined_u:object_r:httpd_sys_content_t:s0
    unconfined_u:object_r:httpd_sys_content_t:s0 /var/www/html/index.html
    ```
    `mv` keeps the old label (`user_tmp_t`), `cp` would not. `restorecon` sets the label back to what the policy says. `/var/www/html` exists only after `httpd` (package `httpd-filesystem`) is installed, which is why the task installs it first.

    If `getenforce` does not print `Enforcing`:

    ```bash
    sudo setenforce 1
    sudo sed -i 's/^SELINUX=.*/SELINUX=enforcing/' /etc/selinux/config
    grep '^SELINUX=' /etc/selinux/config
    ```

    `restorecon` alone works because `/var/www/html` is a **default** web path. For a **custom** path (for example `/srv/webcontent`) define the rule first, then apply it:

    ```bash
    sudo semanage fcontext -a -t httpd_sys_content_t "/srv/webcontent(/.*)?"
    sudo restorecon -Rv /srv/webcontent
    ```

    **Persistence:** labels are stored in the filesystem, and `SELINUX=enforcing` in `/etc/selinux/config` keeps the mode.

### Task 17

??? success "Solution"
    ```bash
    sudo mkdir -p /etc/systemd/journald.conf.d && printf '[Journal]\nStorage=persistent\n' | sudo tee /etc/systemd/journald.conf.d/persistent.conf
    sudo systemctl restart systemd-journald
    sudo journalctl --flush
    ```
    **Verify:**
    ```bash
    systemd-analyze cat-config systemd/journald.conf | grep '^Storage'
    ls -ld /var/log/journal
    ls /var/log/journal
    journalctl --disk-usage
    ```
    ```text title="Example output"
    Storage=persistent
    drwxr-sr-x+ 3 root systemd-journal 46 Jan  5 10:30 /var/log/journal
    4f3a9c1e2b7d4e5f8a6b0c9d1e2f3a4b
    Archived and active journals take up 24.0M in the file system.
    ```
    The long directory name is the machine-id and appears once the journal starts writing to disk. A drop-in is used instead of `sed` on `/etc/systemd/journald.conf` because that file does not exist by default (the stock file is `/usr/lib/systemd/journald.conf`), so `sed` would change nothing. A restart of `systemd-journald` alone does not create `/var/log/journal`; `journalctl --flush` does. After the reboot in Task 18, `journalctl --list-boots` should list more than one boot. **Persistence:** both the drop-in and the directory survive a reboot.

### Task 18

??? success "Solution"
    ```bash
    sudo reboot
    ```
    Log in again as `student` and run the whole check:

    ```bash
    systemctl is-enabled sshd
    findmnt /data
    swapon --show
    hostnamectl --static
    sudo firewall-cmd --list-services
    ls /var/log/journal
    crontab -l
    systemctl is-system-running
    ```
    Every item must match its "Expected result" in the grade table. `systemctl is-system-running` should print `running` (or `degraded` only if you can name the failed unit with `systemctl --failed`).

    **If the machine drops to emergency mode:** the usual cause is a bad `/etc/fstab` line (wrong UUID or mount point). Log in with the root password `redhat`, run `mount -o remount,rw /`, fix `/etc/fstab` (`blkid` shows the real UUIDs), run `mount -a`, then `systemctl reboot`.

## Quality check after completion

- `mount -a` should succeed before reboot
- `swapon --show` should list the configured swap
- `systemctl is-enabled sshd` should return enabled
- `findmnt /data` should return the mount
- `hostnamectl` should show the configured hostname
- `firewall-cmd --list-services` should include `http`

## Common failure points

- wrong disk or partition name
- missing `/etc/fstab` entry
- service started but not enabled
- firewall rule added without `--permanent`
- key generated but not copied to the right remote user
- `userreport.sh` not made executable
- `restorecon` run on `/var/www/html` before `httpd` was installed

**Previous:** [18 Mock Exam 1](18-mock-exam-1.md) · **Next:** [20 Mock Exam 2](20-mock-exam-2.md): the second practice run, with a different task mix.
