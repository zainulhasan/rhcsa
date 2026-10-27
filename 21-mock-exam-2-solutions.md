---
description: Answer key for Mock Exam 2 with a grade-yourself table (task, verification command, expected output), a collapsed solution per task, and the persistence and reboot checks.
---

# Mock Exam 2 Solutions

> Grade yourself with the table, then open a solution only for the tasks you missed.

Use this file only after you complete [20 Mock Exam 2](20-mock-exam-2.md) without help. The setup and the exact task values are in that file.

## Solution Strategy

This mock exam mixes almost every major topic. Keep the order practical:

1. users and sudo
2. files and scripting
3. service and log checks
4. networking and firewall
5. storage and mounts
6. NFS or autofs
7. SSH keys and SELinux
8. reboot and re-verify

## Grade yourself

This is this course's own practice scheme: 100 points for Tasks 1-18 and 20, Task 19 is an unscored bonus. Your own target: 70. Give a task its full points only if every check passes; give 0 otherwise. Run the checks after the Task 20 reboot too. Outputs are illustrative (UUIDs and sizes differ on your machine).

| Task | Points | Verification command | Expected output |
|---|---|---|---|
| 1 Accounts | 4 | `getent group webops`, `id webadmin` | `webops:x:3001:webadmin`; `uid=3002(webadmin) ... groups=...,3001(webops)` |
| 2 Sudo | 6 | `stat -c '%U:%G %a' /etc/sudoers.d/webops`, `sudo visudo -c`, `sudo -l -U webadmin` | `root:root 440`; `parsed OK` for every file; `(ALL) ALL` |
| 3 Directory | 5 | `stat -c '%U:%G %a' /opt/webdata` | `root:webops 2775` |
| 4 Test page | 3 | `cat /opt/webdata/index.html` | `<h1>Mock 2 test page</h1>` |
| 5 Archive | 4 | `tar -tzf /var/tmp/webdata.tar.gz` | `opt/webdata/` and `opt/webdata/index.html` |
| 6 Script | 8 | `filecheck.sh /etc/hosts /nope /etc`; `filecheck.sh; echo $?` | three lines ending `regular file`, `not a regular file`, `not a regular file`; usage line then `1` |
| 7 chronyd | 4 | `systemctl is-active chronyd`, `systemctl is-enabled chronyd` | `active`, `enabled` |
| 8 Log | 4 | `wc -l /var/tmp/sshd-boot.log`, `cat /var/tmp/sshd-boot.log` | up to 20 lines, each from `sshd[`, `sshd-session[` or a `systemd[1]` line about the unit |
| 9 Network | 6 | `ip -4 addr show`, `ip -6 addr show`, `nmcli -g ipv4.dns,connection.autoconnect connection show "$CON"` (with `CON` set as in the solution) | `192.168.122.10/24` and `192.168.122.50/24`; `2001:db8:0:1::50/64`; DNS contains `192.168.122.1`, autoconnect `yes` |
| 10 Hostname | 3 | `hostnamectl --static` | `web1.lab.example` |
| 11 Resolution | 4 | `getent hosts web1.lab.example` | `192.168.122.10  web1.lab.example web1` |
| 12 Firewall | 5 | `firewall-cmd --list-services`, `firewall-cmd --permanent --list-services` | both include `ssh` and `http` |
| 13 LVM | 6 | `sudo lvs --units m -o lv_name,lv_size vgweb` | `lvcontent  700.00m` (before Task 15) |
| 14 Filesystem | 6 | `findmnt /webcontent`, `findmnt --verify`, `sudo blkid -s LABEL -o value /dev/vgweb/lvcontent`, `grep ' /webcontent ' /etc/fstab` | `/webcontent /dev/mapper/vgweb-lvcontent ext4`; no errors; `webcontent`; line starts `UUID=` |
| 15 Grow | 4 | `sudo lvs --units m -o lv_name,lv_size vgweb`, `df -h /webcontent` | `lvcontent  800.00m`; size just under 800M |
| 16 NFS + autofs | 8 | `findmnt /mnt/nfsdata`, `ls /mnt/auto/data`, `systemctl is-enabled autofs` | `nfs4` mount; `hello.txt`; `enabled` |
| 17 SSH keys | 6 | `sudo -iu webadmin ssh -o PasswordAuthentication=no webadmin@serverb hostname` | `serverb.lab.example` |
| 18 SELinux | 6 | `ls -Zd /srv/webcontent`, `sudo restorecon -Rnv /srv/webcontent` | `httpd_sys_content_t`; no output |
| 19 Bonus container | 0 | `curl http://localhost:8080` | `mock exam container` |
| 20 Reboot | 8 | all checks above again after `reboot` | same outputs as before the reboot |

Your score: ____ / 100. Below 70: redo the weakest topic group using the lab file for it ([24](24-foundations-labs.md), [25](25-administration-core-labs.md), [26](26-networking-users-and-security-labs.md)) and repeat the mock after resetting the lab.

## Solutions

### Task 1: Accounts

??? success "Solution"
    ```bash
    sudo groupadd -g 3001 webops
    sudo useradd -m -u 3002 -s /bin/bash webadmin
    sudo usermod -aG webops webadmin
    echo 'webadmin:webpass' | sudo chpasswd
    ```
    **Verify:**
    ```bash
    getent group webops
    id webadmin
    ```
    `-aG` appends. Using `-G` alone would remove other supplementary groups.

### Task 2: Sudo

??? success "Solution"
    ```bash
    sudo visudo -f /etc/sudoers.d/webops
    ```
    In the editor add the single line:
    ```text
    %webops ALL=(ALL) ALL
    ```
    Save and quit. `visudo` checks the syntax on save. Then fix and check the mode, because a drop-in with the wrong mode is ignored or flagged:
    ```bash
    sudo chmod 440 /etc/sudoers.d/webops
    sudo visudo -c
    sudo -l -U webadmin
    ```
    Non-interactive alternative: write a temporary file, syntax-check it, then install it with the right mode. Never write straight into `/etc/sudoers.d/`, because a typo there can lock you out of `sudo`:
    ```bash
    echo '%webops ALL=(ALL) ALL' > /var/tmp/webops.sudoers
    sudo visudo -cf /var/tmp/webops.sudoers
    sudo install -m 0440 /var/tmp/webops.sudoers /etc/sudoers.d/webops
    rm -f /var/tmp/webops.sudoers
    ```
    **Verify:** `stat -c '%U:%G %a' /etc/sudoers.d/webops` prints `root:root 440`, and `visudo -c` ends with `parsed OK` for the file.

### Task 3: Shared directory

??? success "Solution"
    ```bash
    sudo mkdir -p /opt/webdata
    sudo chown root:webops /opt/webdata
    sudo chmod 2775 /opt/webdata
    ```
    **Verify:** `stat -c '%U:%G %a' /opt/webdata` prints `root:webops 2775`. The leading `2` is the setgid bit, so new files get the group `webops`.

### Task 4: Test page

??? success "Solution"
    ```bash
    echo '<h1>Mock 2 test page</h1>' | sudo tee /opt/webdata/index.html
    cat /opt/webdata/index.html
    ```
    The directory is owned by `root`, so `student` needs `sudo tee` to write into it.

### Task 5: Archive

??? success "Solution"
    ```bash
    sudo tar -czvf /var/tmp/webdata.tar.gz /opt/webdata
    tar -tzf /var/tmp/webdata.tar.gz
    ls -l /var/tmp/webdata.tar.gz
    ```
    `tar` removes the leading `/` and warns about it; that is normal. The archive is created by `root` with the default umask, so it is readable by `student`.

### Task 6: Script

??? success "Solution"
    ```bash
    sudo tee /usr/local/bin/filecheck.sh <<'EOF'
    #!/bin/bash
    if [ "$#" -eq 0 ]; then
        echo "Usage: filecheck.sh FILE..." >&2
        exit 1
    fi
    for file in "$@"
    do
        if [ -f "$file" ]; then
            echo "$file: regular file"
        else
            echo "$file: not a regular file"
        fi
    done
    EOF
    sudo chown root:root /usr/local/bin/filecheck.sh
    sudo chmod 755 /usr/local/bin/filecheck.sh
    ```
    **Verify:**
    ```bash
    filecheck.sh /etc/hosts /nope /etc
    filecheck.sh; echo $?
    ```
    ```text title="Example output"
    /etc/hosts: regular file
    /nope: not a regular file
    /etc: not a regular file
    Usage: filecheck.sh FILE...
    1
    ```
    Quote `"$@"` so paths with spaces stay in one piece.

### Task 7: Time service

??? success "Solution"
    ```bash
    sudo systemctl enable --now chronyd
    systemctl is-active chronyd
    systemctl is-enabled chronyd
    ```
    **Verify:** `active` and `enabled`. `enable --now` does both steps; the reboot in Task 20 proves the second one.

### Task 8: Log extract

??? success "Solution"
    ```bash
    sudo journalctl -u sshd -b --no-pager | tail -n 20 > /var/tmp/sshd-boot.log
    wc -l /var/tmp/sshd-boot.log
    cat /var/tmp/sshd-boot.log
    ```
    `-u sshd` selects the unit and `-b` the current boot. The redirect happens in your own shell, which is fine because `/var/tmp` is writable for every user. On RHEL 10 the SSH daemon can log as `sshd-session[` as well as `sshd[` (OpenSSH 9.8 and later), so a few lines may come from `sshd-session` or from `systemd[1]`; all are acceptable. <!-- VERIFY: whether `journalctl -u sshd` on RHEL 10 shows sshd-session lines under the sshd unit -->

### Task 9: Network profile

??? success "Solution"
    ```bash
    nmcli connection show --active           # note the profile NAME
    CON=$(nmcli -t -f NAME,TYPE con show --active | awk -F: '$2=="802-3-ethernet"{print $1;exit}')
    echo "$CON"                              # check that it is the profile of the 192.168.122.10 address
    sudo nmcli connection modify "$CON" +ipv4.addresses 192.168.122.50/24
    sudo nmcli connection modify "$CON" +ipv4.dns 192.168.122.1
    sudo nmcli connection modify "$CON" ipv6.addresses 2001:db8:0:1::50/64 ipv6.method manual
    sudo nmcli connection modify "$CON" connection.autoconnect yes
    sudo nmcli connection up "$CON"
    ```
    **Verify:**
    ```bash
    ip -4 addr show
    ip -6 addr show
    nmcli -g ipv4.dns connection show "$CON"
    nmcli -g connection.autoconnect connection show "$CON"
    ```
    The `+` prefix appends to the list; without it you would replace `192.168.122.10/24` and could lose your session. Profile changes are written to disk, so they survive the reboot. <!-- VERIFY: profile name and whether ipv4.method is manual or auto on the lab VM; additional addresses work with both -->

### Task 10: Hostname

??? success "Solution"
    ```bash
    sudo hostnamectl set-hostname web1.lab.example
    hostnamectl --static
    ```
    The static hostname is stored in `/etc/hostname`, so it persists.

### Task 11: Local name resolution

??? success "Solution"
    ```bash
    echo '192.168.122.10 web1.lab.example web1' | sudo tee -a /etc/hosts
    getent hosts web1.lab.example
    getent hosts web1
    ```
    Use `getent hosts` rather than `host` or `dig`: it follows `/etc/nsswitch.conf` and so reads `/etc/hosts`.

### Task 12: Firewall

??? success "Solution"
    ```bash
    sudo firewall-cmd --permanent --add-service=ssh
    sudo firewall-cmd --permanent --add-service=http
    sudo firewall-cmd --reload
    firewall-cmd --list-services
    sudo firewall-cmd --permanent --list-services
    ```
    **Verify:** both lists include `ssh` and `http`. Without `--permanent` the rule is lost at reload or reboot; without `--reload` a permanent rule is not active yet.

### Task 13: LVM on a spare disk

??? success "Solution"
    ```bash
    lsblk
    sudo parted --script /dev/vdb mklabel gpt
    sudo parted --script /dev/vdb mkpart primary 1MiB 1025MiB
    sudo parted --script /dev/vdb set 1 lvm on
    sudo partprobe /dev/vdb
    sudo udevadm settle
    sudo pvcreate /dev/vdb1
    sudo vgcreate vgweb /dev/vdb1
    sudo lvcreate -n lvcontent -L 700M vgweb
    ```
    **Verify:**
    ```bash
    lsblk /dev/vdb
    sudo vgs vgweb
    sudo lvs --units m -o lv_name,lv_size vgweb
    ```
    The partition is 1024 MiB, so the VG has about 1020 MiB (255 extents of 4 MiB) and the LV takes 175 of them. That leaves 80 extents, enough for the +100 MiB in Task 15. A partition of only 800 MiB would leave the VG at about 796 MiB and the extension would fail with `Insufficient free space`.

### Task 14: Filesystem and persistent mount

??? success "Solution"
    ```bash
    sudo mkfs.ext4 -L webcontent /dev/vgweb/lvcontent
    sudo mkdir -p /webcontent
    sudo blkid /dev/vgweb/lvcontent          # copy the UUID
    echo "UUID=$(sudo blkid -s UUID -o value /dev/vgweb/lvcontent) /webcontent ext4 defaults 0 0" | sudo tee -a /etc/fstab
    sudo systemctl daemon-reload
    sudo mount -a
    findmnt /webcontent
    findmnt --verify
    ```
    **Verify:** `findmnt /webcontent` shows ext4 on `/dev/mapper/vgweb-lvcontent`. Use `sudo` with `blkid`; without it the UUID can come back empty and the fstab line is broken. Check the last line of `/etc/fstab` with `tail -n 1 /etc/fstab`.

### Task 15: Grow online

??? success "Solution"
    ```bash
    sudo lvextend -r -L +100M /dev/vgweb/lvcontent
    sudo lvs --units m -o lv_name,lv_size vgweb
    df -h /webcontent
    ```
    **Verify:** `lvs` shows `800.00m`; `df` shows a size below 800M because of ext4 overhead. `-r` runs the filesystem grow (`resize2fs` for ext4) for you. Without `-r`: `sudo lvextend -L +100M ...` then `sudo resize2fs /dev/vgweb/lvcontent`.

### Task 16: NFS client and autofs

??? success "Solution"
    RHCSA is the **NFS client**: mount the export that `serverb` provides (setting up an NFS server is not an RHCSA objective, so it was done in Setup).
    ```bash
    sudo dnf install -y nfs-utils autofs
    showmount -e serverb
    sudo mkdir -p /mnt/nfsdata
    sudo mount -t nfs serverb:/export/data /mnt/nfsdata
    findmnt /mnt/nfsdata
    sudo umount /mnt/nfsdata
    echo 'serverb:/export/data  /mnt/nfsdata  nfs  _netdev,defaults  0 0' | sudo tee -a /etc/fstab
    sudo systemctl daemon-reload
    sudo mount -a
    ls /mnt/nfsdata
    ```
    For on-demand access, add an autofs master drop-in and an indirect map:
    ```bash
    echo '/mnt/auto  /etc/auto.nfsdata' | sudo tee /etc/auto.master.d/nfsdata.autofs
    echo 'data  -rw  serverb:/export/data' | sudo tee /etc/auto.nfsdata
    sudo systemctl enable autofs
    sudo systemctl restart autofs
    ls /mnt/auto/data
    findmnt /mnt/auto/data
    ```
    **Verify:** both `ls` commands list `hello.txt`; `findmnt /mnt/auto/data` shows `nfs4` only after the first access (that is on-demand mounting). `systemctl is-enabled autofs` prints `enabled`. If `showmount` hangs, the Setup firewall step on `serverb` is missing.

### Task 17: SSH key authentication

??? success "Solution"
    Use `sudo -iu webadmin` to get a real login environment for `webadmin` (correct `HOME`):
    ```bash
    sudo -iu webadmin ssh-keygen -t ed25519 -N '' -f /home/webadmin/.ssh/id_ed25519
    sudo -iu webadmin ssh-copy-id -o StrictHostKeyChecking=accept-new -i /home/webadmin/.ssh/id_ed25519.pub webadmin@serverb
    ```
    `ssh-copy-id` asks for the password `webpass`. That is the password set for `webadmin` on `serverb` in the Setup step; without a password (or another working login) on the target, `ssh-copy-id` cannot copy the key.
    **Verify:**
    ```bash
    sudo -iu webadmin ssh -o PasswordAuthentication=no webadmin@serverb hostname
    sudo -iu webadmin ssh webadmin@serverb 'stat -c "%a %n" ~/.ssh ~/.ssh/authorized_keys'
    ```
    Expected: `serverb.lab.example`, then `700 ...` and `600 ...`. If key login still asks for a password, look at the permissions and the SELinux labels of `~/.ssh` on `serverb` (`restorecon -Rv ~/.ssh`).

### Task 18: SELinux file context

??? success "Solution"
    Setup installed `httpd` and `policycoreutils-python-utils` (`semanage`). A custom path needs a context rule first, then `restorecon`; `restorecon` alone would keep the wrong type.
    ```bash
    sudo mkdir -p /srv/webcontent
    echo '<h1>SELinux practice</h1>' | sudo tee /srv/webcontent/index.html
    ls -Zd /srv/webcontent                   # var_t: the wrong type for web content
    sudo semanage fcontext -a -t httpd_sys_content_t "/srv/webcontent(/.*)?"
    sudo restorecon -Rv /srv/webcontent
    ls -Zd /srv/webcontent /srv/webcontent/index.html
    sudo semanage fcontext -l -C
    sudo restorecon -Rnv /srv/webcontent
    ```
    **Verify:** both paths show `httpd_sys_content_t`, `semanage fcontext -l -C` lists the rule, and the dry run `restorecon -Rnv` prints nothing. The rule lives in the policy store, so it survives a reboot and a full relabel. A default path such as `/var/www/html` (it exists once `httpd` is installed) needs only `sudo restorecon -Rv /var/www/html`.

### Task 19: Rootless container (Bonus, optional, not on the RHEL 10 list)

??? success "Solution"
    Not scored. Log in as `webadmin` in a real session so `systemctl --user` can reach the user manager, for example `ssh webadmin@localhost` (password `webpass`). <!-- VERIFY: sudo -iu webadmin may fail with "Failed to connect to bus" because XDG_RUNTIME_DIR is not set; ssh or machinectl shell webadmin@ gives a proper session -->
    ```bash
    podman pull registry.access.redhat.com/ubi10/httpd-24      # VERIFY: image name and tag
    mkdir -p ~/webcontent
    echo "mock exam container" > ~/webcontent/index.html
    chmod -R a+rX ~/webcontent
    podman run -d --name webctr -p 8080:8080 -v ~/webcontent:/var/www/html:Z registry.access.redhat.com/ubi10/httpd-24
    curl http://localhost:8080
    ```
    Then hand the container to systemd with a Quadlet file:
    ```bash
    mkdir -p ~/.config/containers/systemd
    cat > ~/.config/containers/systemd/webctr.container <<'EOF'
    [Unit]
    Description=Mock exam web container

    [Container]
    Image=registry.access.redhat.com/ubi10/httpd-24
    PublishPort=8080:8080
    Volume=%h/webcontent:/var/www/html:Z

    [Install]
    WantedBy=default.target
    EOF

    podman rm -f webctr
    systemctl --user daemon-reload
    systemctl --user start webctr.service
    systemctl --user status webctr.service
    exit
    ```
    Back as `student`, make the user service survive logout and reboot:
    ```bash
    sudo loginctl enable-linger webadmin
    loginctl show-user webadmin -p Linger
    ```
    Notes:

    - Quadlet-generated units cannot be enabled with `systemctl enable`; the `[Install]` section is applied when the unit is generated, so use `daemon-reload` and `start`. <!-- VERIFY: behaviour on RHEL 10 podman version -->
    - rootless containers must use a host port at or above 1024 (here `8080`)
    - the `:Z` relabel is required or SELinux blocks the mounted content
    - `enable-linger` is what makes the user service survive logout and reboot
    - this task uses a different container port (`8080`) than the older `-p 8080:80` pattern because the `httpd-24` image listens on `8080` <!-- VERIFY -->

### Task 20: Reboot and re-verify

??? success "Solution"
    ```bash
    sudo reboot
    ```
    After the machine is back, log in as `student` and run:
    ```bash
    hostnamectl --static
    getent hosts web1.lab.example
    ip -4 addr show
    firewall-cmd --list-services
    sudo lvs --units m -o lv_name,lv_size vgweb
    findmnt /webcontent
    findmnt /mnt/nfsdata
    ls /mnt/auto/data
    systemctl is-enabled autofs
    systemctl is-active chronyd
    systemctl is-enabled chronyd
    ls -Zd /srv/webcontent
    sudo visudo -c
    sudo -iu webadmin ssh -o PasswordAuthentication=no webadmin@serverb hostname
    ```
    Bonus check (only if you did Task 19): `curl http://localhost:8080` prints `mock exam container`.

    Anything missing here is a persistence bug, not a typing bug. Typical culprits: no `fstab` line (or a wrong UUID), `firewall-cmd` without `--permanent`, `autofs` started but not enabled, or `chcon` used instead of `semanage fcontext`. To hand the lab back, run the reset block from [20 Mock Exam 2](20-mock-exam-2.md).

## Quality Check After Completion

- `visudo -c` should pass
- `systemctl is-enabled chronyd` should report enabled
- `findmnt /webcontent` should show the mount
- `lvs` should show the LV at the extended size (800 MiB)
- `firewall-cmd --list-services` should include `ssh` and `http`
- hostname and local resolution should work
- `ls -Zd /srv/webcontent` should show `httpd_sys_content_t`
- bonus: `curl http://localhost:8080` should return the container page after reboot

## Common Failure Points

- forgetting to append group membership (`usermod -aG`, not `-G`)
- forgetting executable bit on the script
- leaving the sudoers drop-in at mode 644 instead of 440
- building the LV but not the filesystem
- extending the LV but not resizing ext4
- making the partition too small, so the VG has no free extents left for the extension
- adding firewall rules without permanence
- `ssh-copy-id` to a user with no password on the target
- fixing Unix permissions when the real issue is SELinux context
- running `restorecon` on a custom path without adding the `semanage fcontext` rule first

**Previous:** [20 Mock Exam 2](20-mock-exam-2.md) · **Next:** [22 Labs Track and Skill Check Guide](22-labs-track-and-skill-check-guide.md): back to targeted drills for any topic group that scored low.
