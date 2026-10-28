---
description: Answer key for Mock Exam 3 with a coverage table against Mocks 1 and 2, a grade-yourself table (task, verification command, expected output), a collapsed solution per task, and the persistence and reboot checks.
---

# 32 Mock Exam 3 Solutions

> Grade yourself with the table, then open a solution only for the tasks you missed.

Use this file only after you complete [31 Mock Exam 3](31-mock-exam-3.md) without help. The setup, the reset block and the exact task values are in that file.

## Coverage vs Mocks 1-2

Mock 3 exists to train what [18 Mock Exam 1](18-mock-exam-1.md) and [20 Mock Exam 2](20-mock-exam-2.md) did not. Objective wording is from the official RHEL 10 EX200 list; see the [Objectives Map](objectives-map.md) for where each one is taught.

| Official objective | Mock 1 | Mock 2 | Mock 3 |
|---|---|---|---|
| Use grep, redirection | Task 4 | verification only | not repeated |
| Access remote systems using SSH, key-based authentication | Task 10 | Task 17 | Task 16 (other user, custom key name, client config) |
| Archive, compress, unpack | not trained | Task 5 | not repeated |
| Hard and soft links | Task 3 | not trained | not repeated |
| List, set, change ugo/rwx permissions | Tasks 2, 3 | Task 3 | not repeated |
| Diagnose and correct file permission problems | not trained | not trained | Task 4 |
| Configure access to RPM repositories | not trained | not trained | Task 1 |
| Install and remove RPM software packages | Task 5 | not trained | Task 1 |
| Configure and use Flatpak remotes, install and remove Flatpak | not trained | not trained | Task 2 |
| Conditionals, input processing in shell scripts | Task 6 | Task 6 | Task 5 (loop, exit status) |
| Loops over command line input | not trained | Task 6 | Task 5 |
| Boot systems into different targets manually | not trained | not trained | Task 18 |
| Interrupt the boot process to gain access | not trained | not trained | Task 19 |
| Identify CPU/memory intensive processes, kill processes, process scheduling | not trained | not trained | not trained (see lesson 09 and lab 24) |
| Manage tuning profiles | not trained | not trained | Task 12 |
| Locate and interpret logs and journals | not trained | Task 8 | verification only |
| Preserve system journals | Task 17 | not trained | Task 6 (drop-in file) |
| Partitions on GPT, PV, VG, LV | Task 11 | Task 13 | Tasks 13, 14 |
| Assign physical volumes to volume groups (`vgextend`) | not trained | not trained | Task 13 |
| Mount by UUID or label | Task 12 (UUID) | Task 14 (UUID) | Task 14 (label) |
| Add swap non-destructively | Task 13 (partition) | not trained | Task 14 (logical volume) |
| VFAT, ext4, XFS | XFS | ext4 | XFS, VFAT |
| Mount NFS | not trained | Task 16 | Task 15 |
| Configure autofs | not trained | Task 16 (one key) | Task 15 (wildcard) |
| Extend existing logical volumes | not trained | Task 15 (ext4) | Task 13 (XFS, new PV) |
| Schedule tasks using at and cron | Tasks 7, 8 | not trained | not repeated |
| Schedule tasks using systemd timer units | not trained | not trained | Task 7 |
| Start and stop services, enable at boot | Task 9 | Task 7 | Tasks 7, 8 |
| Configure systems to boot into a specific target automatically | not trained | not trained | Task 18 |
| Configure time service clients | not trained | Task 7 (enable only) | Task 11 (source) |
| Install packages from a remote repository or the local file system | Task 5 | not trained | Task 1 |
| Modify the system bootloader | not trained | not trained | Task 17 |
| Configure IPv4 and IPv6 addresses | not trained | Task 9 | Task 10 (new connection) |
| Hostname resolution | Task 14 (hostname) | Tasks 10, 11 | not repeated |
| Restrict network access using firewalld | Task 15 | Task 12 | Task 9 (port, runtime to permanent) |
| Create and modify local users and groups | Task 1 | Task 1 | Setup only |
| Adjust password aging | Task 1 | not trained | Task 3 |
| Configure privileged access | not trained | Task 2 | Task 3 (restricted commands) |
| Manage default file permissions (umask) | not trained | not trained | not trained (see lesson 06) |
| Set enforcing and permissive modes | Task 16 | not trained | not repeated |
| List and identify contexts, restore default contexts | Task 16 | Task 18 | not repeated |
| Manage SELinux port labels | not trained | not trained | Task 8 |
| Use Boolean settings | not trained | not trained | Task 8 |

Two objectives are still untrained by all three mocks: the process one (identify CPU and memory intensive processes, kill processes, process scheduling) and `umask`. Drill them with lesson [09](09-boot-targets-processes-logs-and-tuning.md), lesson [06](06-links-permissions-and-default-permissions.md) and the labs.

## Solution strategy

This mock is built around gaps, so slow down on the unfamiliar ones. A workable order:

1. software sources (Tasks 1-2)
2. users, files and scripts (Tasks 3-5)
3. logs, timers, SELinux and firewall (Tasks 6-9)
4. network, time and tuning (Tasks 10-12)
5. storage and NFS (Tasks 13-15)
6. SSH (Task 16)
7. the three console tasks (Tasks 17-19)
8. reboot and re-verify (Task 20)

## Grade yourself

This is this course's own practice scheme: 100 points over 20 tasks. Your own target: 70. Give a task its full points only if every check passes; give 0 otherwise. Run the checks after the Task 20 reboot too. Outputs are illustrative (UUIDs, sizes and times differ on your machine).

| Task | Points | Verification command | Expected output |
|---|---|---|---|
| 1 Local repo | 5 | `sudo dnf repolist`, `rpm -q tree`, `dnf info tree` | `localpractice` listed; `tree-...`; the installed package's repository is `localpractice` |
| 2 Flatpak | 3 | `flatpak remotes`, `flatpak list --app` | `flathub` with `system`; only `org.gnome.gedit` listed |
| 3 Aging and sudo | 6 | `sudo chage -l carol`, `stat -c '%U:%G %a' /etc/sudoers.d/webadmins`, `sudo visudo -c`, `sudo -l -U dana`, `sudo -u dana sudo -n systemctl restart chronyd; echo $?`, `sudo -u dana sudo -n systemctl restart sshd; echo $?` | maximum 45, minimum 2, warning 7, `Dec 31, 2030`; `root:root 440`; `parsed OK`; `(root) NOPASSWD: /usr/bin/systemctl restart chronyd`; `0`; refused (`a password is required`) and `1` |
| 4 Permissions | 4 | `stat -c '%U:%G %a' /data/teamdocs`, `sudo -u bob touch /data/teamdocs/bob.txt`, `ls -l /data/teamdocs/bob.txt` | `root:labteam 2775`; no error; group `labteam` |
| 5 Script | 6 | `dircount.sh /srv/countdemo /nope; echo $?`, `dircount.sh; echo $?` | `/srv/countdemo: 3 entries`, `/nope: not a directory`, `2`; usage line, `1` |
| 6 Journal | 3 | `systemd-analyze cat-config systemd/journald.conf \| grep -E '^(Storage\|SystemMaxUse)'`, `ls /var/log/journal`, `journalctl --list-boots` | `Storage=persistent`, `SystemMaxUse=100M`; a machine-id directory; two or more boots after the first reboot of Task 18 |
| 7 Timer | 6 | `systemctl is-enabled dailyreport.timer`, `systemctl is-enabled dailyreport.service`, `systemctl list-timers dailyreport.timer`, `journalctl -t dailyreport` | `enabled`; `static`; next run `03:30:00`; `daily report ran` |
| 8 SELinux | 6 | `getsebool httpd_can_network_connect`, `sudo semanage boolean -l \| grep httpd_can_network_connect`, `sudo semanage port -l \| grep -w 8765`, `systemctl is-active httpd`, `systemctl is-enabled httpd`, `curl http://localhost:8765` | `on`; `on` in the current and default columns; `http_port_t  tcp  8765, 80, ...`; `active`; `enabled`; `mock3 web` |
| 9 Firewall | 4 | `sudo firewall-cmd --permanent --list-services`, `sudo firewall-cmd --permanent --list-ports` | includes `https`; includes `8765/tcp` |
| 10 Network | 5 | `ip -4 addr show dummy0`, `ip -6 addr show dummy0`, `nmcli connection show labnet` | `10.20.30.40/24`; `fd00:20::40/64`; both methods `manual`, autoconnect `yes` |
| 11 Chrony | 4 | `chronyc sources`, `chronyc tracking`, `systemctl is-enabled chronyd` | `serverb.lab.example` with `^*` or `^+`; reference `192.168.122.11`; `enabled` |
| 12 Tuned | 3 | `tuned-adm active`, `systemctl is-enabled tuned` | `Current active profile: throughput-performance`; `enabled` |
| 13 vgextend | 6 | `sudo vgs -o vg_name,pv_count vgapp`, `sudo lvs --units m -o lv_name,lv_size vgapp`, `df -h /data/app` | `vgapp  2`; `lvapp  1300.00m`; about `1.3G` |
| 14 Swap and VFAT | 6 | `swapon --show`, `findmnt /mnt/usbdata`, `findmnt --verify` | `lvswap` 256M; `vfat`; `Success, no errors or warnings detected` |
| 15 autofs | 6 | `ls /remote/homes/alice`, `findmnt /remote/homes/alice`, `systemctl is-enabled autofs` | `welcome.txt`; `nfs4` from `serverb`; `enabled` |
| 16 SSH | 5 | `sudo -iu bob ssh -o BatchMode=yes labb hostname` | `serverb.lab.example` |
| 17 GRUB argument | 4 | `sudo grubby --info=DEFAULT`, `cat /proc/cmdline` (after the first reboot of Task 18) | `args=` contains `loglevel=5`; running command line contains it |
| 18 Targets | 5 | `systemctl get-default`, `cat /proc/cmdline` (in rescue and after) | `multi-user.target`; `systemd.unit=rescue.target` only in the one-off boot |
| 19 rd.break | 6 | `su - alice`, `ls -Z /etc/shadow`, `ls /.autorelabel` | login works with `Recovered1`; `shadow_t`; `No such file or directory` |
| 20 Reboot | 7 | the 14 checks of Task 20 (half a point each) | same outputs as before the reboot |

Your score: ____ / 100. Below 70: redo the weakest topic group using the lab files ([24](24-foundations-labs.md), [25](25-administration-core-labs.md), [26](26-networking-users-and-security-labs.md)), reset the lab with the block in [31 Mock Exam 3](31-mock-exam-3.md), and repeat.

## Solutions

### Task 1: Local RPM repository

??? success "Solution"
    ```bash
    sudo tee /etc/yum.repos.d/localpractice.repo <<'EOF'
    [localpractice]
    name=Local Practice Repo
    baseurl=file:///srv/localrepo
    enabled=1
    gpgcheck=0
    EOF
    sudo dnf clean all
    sudo dnf repolist
    sudo dnf --disablerepo='*' --enablerepo=localpractice list available
    sudo dnf --disablerepo='*' --enablerepo=localpractice install -y tree
    ```
    **Verify:**
    ```bash
    rpm -q tree
    dnf info tree
    ```
    `dnf repolist` must show `localpractice`; `dnf info tree` names the repository the package came from (`From repo    : localpractice`).

    Persistence: the `.repo` file stays under `/etc/yum.repos.d/`, and installed packages stay installed. `gpgcheck=0` is acceptable here because the copies in `/srv/localrepo` were downloaded on the same machine; a real repository should keep `gpgcheck=1` and a `gpgkey=` line. If `repolist` shows a metadata error, the directory `/srv/localrepo/repodata` is missing: rebuild it with `sudo createrepo_c /srv/localrepo`.

### Task 2: Flatpak remote, install and remove

??? success "Solution"
    ```bash
    flatpak remotes
    sudo flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
    flatpak remotes
    sudo flatpak install -y flathub org.gnome.gedit org.gnome.Calculator
    flatpak list --app
    sudo flatpak uninstall -y org.gnome.Calculator
    flatpak list --app
    ```
    **Verify:** `flatpak remotes` shows `flathub` with the option `system`; `flatpak list --app` shows `org.gnome.gedit` and no longer `org.gnome.Calculator`. <!-- VERIFY: the flatpak list --app column layout on RHEL 10 -->

    Offline alternative (remote `labremote`, see the task):
    ```bash
    sudo flatpak remote-add --if-not-exists --no-gpg-verify labremote file:///srv/flatpak-usb/.ostree/repo
    flatpak remotes
    flatpak remote-ls labremote
    sudo flatpak install -y labremote org.gnome.gedit org.gnome.Calculator
    sudo flatpak uninstall -y org.gnome.Calculator
    ```
    Persistence: remotes and apps are stored on disk (`/var/lib/flatpak` for the system scope), so nothing else is needed. Scope matters: a remote added with `--user` is invisible to `sudo flatpak remotes`. <!-- VERIFY: RHEL 10 ships its own default Flatpak remote (name, URL, login); this task uses flathub only because it is a stable practice target -->

### Task 3: Password aging and a restricted sudo drop-in

??? success "Solution"
    ```bash
    sudo chage -M 45 -m 2 -W 7 -E 2030-12-31 carol
    sudo chage -l carol
    sudo visudo -f /etc/sudoers.d/webadmins
    ```
    In the editor add the single line:
    ```text
    %webadmins ALL=(root) NOPASSWD: /usr/bin/systemctl restart chronyd
    ```
    Save and quit, then fix and check the mode, because a drop-in with the wrong mode is flagged or ignored:
    ```bash
    sudo chmod 440 /etc/sudoers.d/webadmins
    sudo visudo -c
    sudo -l -U dana
    sudo -u dana sudo -n systemctl restart chronyd; echo $?
    sudo -u dana sudo -n systemctl restart sshd; echo $?
    ```
    **Verify:** `chage -l carol` shows `Maximum number of days between password change : 45`, `Minimum ... : 2`, `Number of days of warning before password expires : 7` and `Account expires : Dec 31, 2030`. `chage` stores the date as a day count, so in a time zone east of UTC the display can be one day earlier (`Dec 30, 2030`); the stored value is still `2030-12-31` (day `22279` in `sudo getent shadow carol`). The first `sudo -n` prints `0`; the second is refused (`sudo: a password is required`) and prints `1`. Always give the full path of the command in a sudoers rule, and use `chronyd` as the unit name exactly as the rule says: sudoers matches the whole argument list.

    Persistence: aging data lives in `/etc/shadow` and the drop-in is a file, so both survive a reboot.

### Task 4: Diagnose a permission problem

??? success "Solution"
    Diagnose from the user's side first:
    ```bash
    id bob
    ls -ld /data/teamdocs
    namei -l /data/teamdocs/notes.txt
    sudo -u bob touch /data/teamdocs/bob.txt
    ```
    `bob` is a member of `labteam` (good), but the directory is `root:root` with mode `755`: the group has no meaning and no write bit. There are two causes, so fix both, and add setgid so new files inherit the group:
    ```bash
    sudo chgrp labteam /data/teamdocs
    sudo chmod 2775 /data/teamdocs
    ```
    **Verify:**
    ```bash
    stat -c '%U:%G %a' /data/teamdocs
    sudo -u bob touch /data/teamdocs/bob.txt
    ls -l /data/teamdocs/bob.txt
    sudo -u dana touch /data/teamdocs/dana.txt
    sudo -u dana cat /data/teamdocs/notes.txt
    ```
    Expected: `root:labteam 2775`; no error; `-rw-r--r--. 1 bob labteam ...`; `Permission denied` for `dana`'s `touch`; `team notes`. A group only counts if the directory's **group** is that group, and the group needs `w` and `x` on a directory to create files in it. If the Unix bits are right and access still fails, check the SELinux label with `ls -Zd`; here it was not the problem.

### Task 5: Shell script with a loop and an exit status

??? success "Solution"
    ```bash
    sudo tee /usr/local/bin/dircount.sh <<'EOF'
    #!/bin/bash
    if [ "$#" -eq 0 ]; then
        echo "Usage: dircount.sh DIR..." >&2
        exit 1
    fi
    status=0
    for dir in "$@"
    do
        if [ -d "$dir" ]; then
            count=$(ls -A "$dir" | wc -l)
            echo "$dir: $count entries"
        else
            echo "$dir: not a directory" >&2
            status=2
        fi
    done
    exit "$status"
    EOF
    sudo chown root:root /usr/local/bin/dircount.sh
    sudo chmod 755 /usr/local/bin/dircount.sh
    ```
    **Verify:**
    ```bash
    dircount.sh /srv/countdemo; echo $?
    dircount.sh /srv/countdemo /nope; echo $?
    dircount.sh; echo $?
    ```
    ```text title="Example output"
    /srv/countdemo: 3 entries
    0
    /srv/countdemo: 3 entries
    /nope: not a directory
    2
    Usage: dircount.sh DIR...
    1
    ```
    `exit "$status"` returns the status after the loop has finished, so one bad argument does not stop the others. Quote `"$@"` and `"$dir"` so paths with spaces stay in one piece. `$(...)` captures the output of a command inside the script.

### Task 6: Preserve journals

??? success "Solution"
    ```bash
    sudo mkdir -p /etc/systemd/journald.conf.d
    sudo tee /etc/systemd/journald.conf.d/persistent.conf <<'EOF'
    [Journal]
    Storage=persistent
    SystemMaxUse=100M
    EOF
    sudo mkdir -p /var/log/journal
    sudo systemd-tmpfiles --create --prefix /var/log/journal
    sudo systemctl restart systemd-journald
    sudo journalctl --flush
    ```
    **Verify:**
    ```bash
    systemd-analyze cat-config systemd/journald.conf
    ls /var/log/journal
    ls /var/log/journal/*/system.journal
    journalctl --list-boots
    ```
    `systemd-analyze cat-config` prints the stock file followed by your drop-in, so `Storage=persistent` and `SystemMaxUse=100M` appear under `# /etc/systemd/journald.conf.d/persistent.conf`.
    The first `ls` shows a directory named like the machine ID (illustrative: `4f2c...`). `--list-boots` shows several lines after the reboots in Tasks 18-19; before the first reboot it lists a single line (only boots after `Storage=persistent` took effect are kept). A restart of `systemd-journald` alone does not create `/var/log/journal`: creating the directory first (or running `sudo journalctl --flush`, which moves the runtime journal to disk) is what does. A drop-in file is used because `/etc/systemd/journald.conf` does not exist by default (the stock file is `/usr/lib/systemd/journald.conf`, which package updates replace), so a `sed` on it would change nothing. <!-- VERIFY: RHEL 10 default Storage=auto and whether /var/log/journal exists on a fresh install -->

### Task 7: systemd timer

??? success "Solution"
    ```bash
    sudo tee /etc/systemd/system/dailyreport.service <<'EOF'
    [Unit]
    Description=Daily report logger

    [Service]
    Type=oneshot
    ExecStart=/usr/bin/logger -t dailyreport "daily report ran"
    EOF

    sudo tee /etc/systemd/system/dailyreport.timer <<'EOF'
    [Unit]
    Description=Run dailyreport every day at 03:30

    [Timer]
    OnCalendar=*-*-* 03:30:00
    Persistent=true

    [Install]
    WantedBy=timers.target
    EOF

    systemd-analyze calendar '*-*-* 03:30:00'
    sudo systemctl daemon-reload
    sudo systemctl enable --now dailyreport.timer
    ```
    **Verify:**
    ```bash
    systemctl is-enabled dailyreport.timer
    systemctl list-timers dailyreport.timer
    sudo systemctl start dailyreport.service
    journalctl -t dailyreport --no-pager
    ```
    `systemd-analyze calendar` prints the normalised form and the next elapse time, which catches typos. `Persistent=true` runs a missed job at the next boot. You enable the **timer**, never the service (it has no `[Install]` section). `daemon-reload` is needed after creating unit files. The enabled timer is stored as a symlink under `/etc/systemd/system/timers.target.wants/`, so it survives a reboot.

### Task 8: SELinux boolean and port label

??? success "Solution"
    ```bash
    sudo setsebool -P httpd_can_network_connect on
    getsebool httpd_can_network_connect
    sudo semanage port -l | grep -w 8765
    ```
    The `grep` prints nothing: the port has no label yet. <!-- VERIFY: tcp/8765 is not labelled in the stock RHEL 10 policy (if it is, use semanage port -m instead of -a) -->
    ```bash
    echo 'Listen 8765' | sudo tee /etc/httpd/conf.d/mock3.conf
    echo 'mock3 web' | sudo tee /var/www/html/index.html
    sudo systemctl start httpd
    ```
    The start fails (`Permission denied ... could not bind to address`), because SELinux does not let `httpd` bind a port without an `http_port_t` label. Check with `sudo journalctl -u httpd -n 20` and `sudo ausearch -m avc -ts recent` if `audit` is installed. Add the label and start again:
    ```bash
    sudo semanage port -a -t http_port_t -p tcp 8765
    sudo semanage port -l | grep -w http_port_t
    sudo restorecon -v /var/www/html/index.html
    sudo systemctl enable httpd
    sudo systemctl restart httpd
    curl http://localhost:8765
    ```
    **Verify:** `getsebool` prints `httpd_can_network_connect --> on`; `sudo semanage boolean -l | grep httpd_can_network_connect` shows `(on , on)` (current and default); the port list shows `http_port_t  tcp  8765, 80, ...`; `curl` prints `mock3 web`. `setsebool` without `-P` changes the running value only and is lost at reboot. `semanage port -a` writes to the policy store, so the label persists.

### Task 9: Firewall service and port, runtime to permanent

??? success "Solution"
    ```bash
    sudo firewall-cmd --add-service=https
    sudo firewall-cmd --add-port=8765/tcp
    firewall-cmd --list-services
    firewall-cmd --list-ports
    sudo firewall-cmd --runtime-to-permanent
    sudo firewall-cmd --permanent --list-services
    sudo firewall-cmd --permanent --list-ports
    sudo firewall-cmd --reload
    firewall-cmd --list-services
    firewall-cmd --list-ports
    ```
    **Verify:** both runtime and permanent lists include `https` and `8765/tcp`, also after the reload. `--runtime-to-permanent` copies **everything** that is in the runtime configuration into the permanent one, including any other temporary rule you had tested, so check `firewall-cmd --list-all` first. The classic alternative is to repeat each command with `--permanent` and then `--reload`. Services come from names in `firewall-cmd --get-services`; a port needs the protocol.

### Task 10: Static IPv4 and IPv6 on a second connection

??? success "Solution"
    ```bash
    sudo nmcli connection add type dummy ifname dummy0 con-name labnet \
      ipv4.method manual ipv4.addresses 10.20.30.40/24 \
      ipv6.method manual ipv6.addresses fd00:20::40/64 \
      connection.autoconnect yes
    nmcli connection show --active
    ```
    **Verify:**
    ```bash
    ip -4 addr show dummy0
    ip -6 addr show dummy0
    nmcli connection show labnet | grep -E '^(ipv4|ipv6)\.(method|addresses)|^connection.autoconnect:'
    ```
    The connection is saved in `/etc/NetworkManager/system-connections/labnet.nmconnection`, so it comes back at boot. The `dummy0` interface state shows `UNKNOWN`, which is normal for a dummy device. To change an address later: `sudo nmcli connection modify labnet ipv4.addresses 10.20.30.41/24` then `sudo nmcli connection up labnet`. If the connection already exists, `add` creates a second one with the same name: delete the old one first. <!-- VERIFY: the dummy kernel module and the NetworkManager dummy device type are available on RHEL 10 (kernel-modules package split); if not, use "type bridge ifname br-lab" with the same address properties -->

### Task 11: Chrony time source

??? success "Solution"
    ```bash
    sudo sed -i 's/^pool /#pool /' /etc/chrony.conf
    echo 'server serverb.lab.example iburst' | sudo tee -a /etc/chrony.conf
    grep -E '^(server|pool)' /etc/chrony.conf
    sudo systemctl enable chronyd
    sudo systemctl restart chronyd
    sleep 15
    chronyc sources
    chronyc tracking
    ```
    **Verify:** `chronyc sources` lists `serverb.lab.example` with `^*` (selected) or `^+` (combined) once it is reachable; `^?` right after the restart is normal, repeat after a few seconds. `chronyc tracking` shows `Reference ID : C0A87A0B (serverb.lab.example)` (`C0A87A0B` is `192.168.122.11` in hex). <!-- VERIFY: chronyc tracking output wording on RHEL 10 --> `chronyc sources -v` explains the symbols. If the source stays `^?`: on `serverb` check `grep -E '^(allow|local)' /etc/chrony.conf` (Setup appends them to the main file, which `chronyd` always reads) and `sudo firewall-cmd --list-services` (it needs `ntp`). Persistence: the configuration file and the enabled service survive a reboot.

### Task 12: Tuned profile

??? success "Solution"
    ```bash
    sudo systemctl enable --now tuned
    tuned-adm list
    tuned-adm active
    sudo tuned-adm profile throughput-performance
    tuned-adm active
    tuned-adm verify
    systemctl is-enabled tuned
    ```
    **Verify:** `tuned-adm active` prints `Current active profile: throughput-performance`. The choice is stored in `/etc/tuned/active_profile`, so it persists, as long as the `tuned` service is enabled; check again after the reboot in Task 20. If `tuned-adm` says it cannot talk to the daemon, the service is not running. To go back to the default for this machine: `sudo tuned-adm profile "$(tuned-adm recommend)"`.

### Task 13: Extend a volume group and a logical volume

??? success "Solution"
    ```bash
    sudo vgs -o vg_name,pv_count,vg_size,vg_free vgapp
    sudo lvextend -L +800M /dev/vgapp/lvapp
    ```
    The extension fails with `Insufficient free space`: the group has only about 96 MiB free. Add a physical volume:
    ```bash
    sudo parted --script /dev/vdc mklabel gpt mkpart primary 1MiB 1025MiB set 1 lvm on
    sudo partprobe /dev/vdc
    sudo udevadm settle
    sudo pvcreate /dev/vdc1
    sudo vgextend vgapp /dev/vdc1
    sudo vgs -o vg_name,pv_count,vg_size,vg_free vgapp
    df -h /data/app
    sudo lvextend -r -L +800M /dev/vgapp/lvapp
    ```
    **Verify:**
    ```bash
    sudo vgs -o vg_name,pv_count vgapp
    sudo lvs --units m -o lv_name,lv_size vgapp
    df -h /data/app
    cat /data/app/before.txt
    ```
    Expected: two physical volumes, `lvapp  1300.00m`, a size of about 1.3G (it was under 500M before), and `before growth`. The numbers: the first PV gives 149 extents of 4 MiB, 125 of them are used by `lvapp`, so 24 are free; the second PV adds 255 extents, so 279 are free (1116 MiB), and +800 MiB takes 200 of them. `-r` runs the filesystem grow for you (`xfs_growfs` for XFS, which only works on a mounted filesystem). Without `-r`: `sudo lvextend -L +800M ...` then `sudo xfs_growfs /data/app`. An XFS filesystem can only grow, never shrink. The fstab line from Setup is unchanged, and the new PV is recorded in the LVM metadata, so this persists. If `/dev/vdc1` does not appear after `partprobe`, run `sudo partx -a /dev/vdc` (same for `/dev/vdc2` in Task 14, because `/dev/vdc1` is already in use). <!-- VERIFY: partprobe on a disk whose first partition is an active PV on RHEL 10 -->

### Task 14: Swap on an LV and a VFAT mount by label

??? success "Solution"
    Swap on a logical volume:
    ```bash
    sudo lvcreate -n lvswap -L 256M vgapp
    sudo mkswap /dev/vgapp/lvswap
    echo "UUID=$(sudo blkid -s UUID -o value /dev/vgapp/lvswap) none swap defaults 0 0" | sudo tee -a /etc/fstab
    sudo systemctl daemon-reload
    sudo swapon -a
    swapon --show
    ```
    VFAT by label:
    ```bash
    sudo parted --script /dev/vdc mkpart primary fat32 1025MiB 1225MiB
    sudo partprobe /dev/vdc
    sudo udevadm settle
    sudo mkfs.vfat -n USBDATA /dev/vdc2
    sudo mkdir -p /mnt/usbdata
    echo 'LABEL=USBDATA /mnt/usbdata vfat defaults 0 0' | sudo tee -a /etc/fstab
    sudo systemctl daemon-reload
    sudo mount -a
    findmnt /mnt/usbdata
    findmnt --verify
    ```
    **Verify:** `swapon --show` lists the swap LV (it can appear as `/dev/dm-N`) with `256M`; `tail -n 2 /etc/fstab` shows a line starting `UUID=` for swap and a line starting `LABEL=USBDATA`; `findmnt /mnt/usbdata` shows `vfat`; `findmnt --verify` prints `Success, no errors or warnings detected`. The UUID must be read **after** `mkswap`, otherwise the fstab line contains a blank or old UUID. Use `sudo` with `blkid`, or the UUID can come back empty. A bad fstab line can drop the next boot into emergency mode, so always run `mount -a` and `findmnt --verify` before rebooting.

### Task 15: autofs wildcard map for NFS home directories

??? success "Solution"
    ```bash
    showmount -e serverb
    echo '/remote/homes  /etc/auto.homes' | sudo tee /etc/auto.master.d/homes.autofs
    echo '*  -rw,sync  serverb:/export/homes/&' | sudo tee /etc/auto.homes
    sudo systemctl enable autofs
    sudo systemctl restart autofs
    ls /remote/homes/alice
    findmnt /remote/homes/alice
    sudo -u alice touch /remote/homes/alice/test.txt
    ls /remote/homes/bob
    systemctl is-enabled autofs
    ```
    **Verify:** `ls /remote/homes/alice` lists `welcome.txt` and `findmnt` then shows an `nfs4` mount of `serverb.lab.example:/export/homes/alice`; the `touch` as `alice` works because `alice` has the same UID `4001` on both machines; `ls /remote/homes/bob` mounts a second directory with no extra configuration. `ls /remote/homes` alone looks empty until you access a key: that is normal for a wildcard. Mount points under `/remote/homes` are created and removed by `autofs`. Persistence: the master drop-in, the map file and the enabled service are all files, so they come back at boot. If a user logs in with SELinux enforcing and an NFS home directory, the boolean `use_nfs_home_dirs` also has to be on. If `showmount` hangs, the Setup firewall step on `serverb` is missing.

### Task 16: SSH key login with a client config

??? success "Solution"
    ```bash
    sudo -iu bob ssh-keygen -t ed25519 -N '' -f /home/bob/.ssh/id_ed25519_labb
    sudo -iu bob ssh-copy-id -o StrictHostKeyChecking=accept-new -i /home/bob/.ssh/id_ed25519_labb.pub bob@serverb.lab.example
    sudo -iu bob tee /home/bob/.ssh/config >/dev/null <<'EOF'
    Host labb
        HostName serverb.lab.example
        User bob
        IdentityFile ~/.ssh/id_ed25519_labb
    EOF
    sudo -iu bob chmod 600 /home/bob/.ssh/config
    ```
    `ssh-copy-id` asks once for the password `bobpass` of `bob` on `serverb`. **Verify:**
    ```bash
    sudo -iu bob ssh -o BatchMode=yes labb hostname
    sudo -iu bob ssh labb 'stat -c "%a %n" ~/.ssh ~/.ssh/authorized_keys'
    sudo -iu bob stat -c '%a %n' /home/bob/.ssh/config
    ```
    Expected: `serverb.lab.example`, then `700 ...` and `600 ...`, then `600 ...`. Connect to `serverb.lab.example` in `ssh-copy-id` because that is the name the `labb` alias uses: `known_hosts` stores the host key under the name you typed, and the graded `ssh -o BatchMode=yes labb` cannot answer a host-key prompt, so a key saved only under `serverb` fails with `Host key verification failed`. The client config is why `ssh labb` needs no options: it supplies the host name, the user and the key. If key login still asks for a password, check the permissions and SELinux labels of `~/.ssh` on `serverb` (`restorecon -Rv ~/.ssh`).

### Task 17: Kernel argument in the bootloader

??? success "Solution"
    ```bash
    sudo grubby --update-kernel=ALL --args="loglevel=5"
    sudo grubby --info=DEFAULT
    sudo grubby --info=ALL | grep args
    ```
    **Verify now:** the `args` line of each entry contains `loglevel=5`. **Verify after the first reboot of Task 18** (this task does not reboot; `grubby` only stores the argument):
    ```bash
    cat /proc/cmdline
    ```
    The running command line contains `loglevel=5`. `grubby --update-kernel=ALL` changes the entries that exist now; a kernel installed later gets its arguments from the install tooling, so check it with `grubby --info=ALL` after a kernel update. <!-- VERIFY: which command line kernel-install gives a newly installed kernel on RHEL 10 (/etc/kernel/cmdline or the running /proc/cmdline) --> `grubby` edits the boot loader specification entries in `/boot/loader/entries/`, which is why the change persists. To remove the argument: `sudo grubby --update-kernel=ALL --remove-args="loglevel=5"`. The second route is to edit `GRUB_CMDLINE_LINUX` in `/etc/default/grub` and rebuild with `sudo grub2-mkconfig -o /boot/grub2/grub.cfg`. On RHEL 9 and later `/boot/grub2/grub.cfg` is the right output path for both BIOS and UEFI systems; do not write to the old `/boot/efi/EFI/redhat/grub.cfg`, which is a small stub that points to it. That route mainly affects entries created later, so confirm it with `grubby --info=ALL` and use `grubby` for existing entries. <!-- VERIFY: on RHEL 10, whether grub2-mkconfig after editing /etc/default/grub updates existing BLS entries -->

### Task 18: Boot a target once, set the default target

??? success "Solution"
    Persistent default first:
    ```bash
    sudo systemctl set-default multi-user.target
    systemctl get-default
    sudo reboot
    ```
    At the GRUB menu (console), highlight the first entry and press `e`. Move to the end of the line that starts with `linux`, append a space and `systemd.unit=rescue.target`, then press Ctrl-x. Log in at the `Give root password for maintenance` prompt with `redhat`, then:
    ```bash
    systemctl is-active rescue.target
    cat /proc/cmdline
    systemctl get-default
    systemctl reboot
    ```
    **Verify:** the first two commands show `active` and a command line ending in `systemd.unit=rescue.target`, even though the default target is `multi-user.target`: the one-off argument overrides the default for this boot only. After the normal reboot:
    ```bash
    systemctl get-default
    cat /proc/cmdline
    ```
    The default is still `multi-user.target`, the command line no longer has `systemd.unit=` and it has `loglevel=5` from Task 17. `set-default` makes a symlink for `default.target`, which is why it survives reboots; the GRUB edit is never saved. `emergency.target` is the smaller alternative to `rescue.target`.

### Task 19: Reset a password with rd.break

??? success "Solution"
    Reboot with `sudo reboot`. At the GRUB menu (console), highlight the first entry and press `e`. Append a space and `rd.break` to the end of the `linux` line, then press Ctrl-x. In the `switch_root:/#` shell:
    ```bash
    mount -o remount,rw /sysroot
    chroot /sysroot
    echo 'alice:Recovered1' | chpasswd
    touch /.autorelabel
    exit
    exit
    ```
    `passwd alice` (typing the new password twice) does the same as `chpasswd`. The system continues booting, relabels all files (a few minutes, the screen may look idle) and reboots by itself. Then log in as `student` and run:
    ```bash
    su - alice
    exit
    ls -Z /etc/shadow
    ls /.autorelabel
    ```
    **Verify:** `su - alice` accepts `Recovered1` and refuses `forgotten`; `ls -Z /etc/shadow` shows `shadow_t`; `ls /.autorelabel` says `No such file or directory`. `touch /.autorelabel` must be done inside the chroot so the file lands on the real root filesystem. In the `rd.break` shell the SELinux policy is not loaded, so files written there get no proper label; the full relabel fixes that. Without it, login can fail. <!-- VERIFY: prompts and the shell in the rd.break environment on RHEL 10, and that chpasswd is available in the chroot --> The same procedure with `passwd` (for `root`) resets a lost root password.

### Task 20: Reboot and re-verify

??? success "Solution"
    ```bash
    sudo reboot
    ```
    After the machine is back, log in as `student` and run:
    ```bash
    sudo dnf repolist
    journalctl --list-boots
    systemctl is-enabled dailyreport.timer
    systemctl list-timers dailyreport.timer
    systemctl is-active httpd
    getsebool httpd_can_network_connect
    sudo semanage port -l | grep -w 8765
    curl http://localhost:8765
    sudo firewall-cmd --permanent --list-services
    sudo firewall-cmd --permanent --list-ports
    ip addr show dummy0
    chronyc sources
    tuned-adm active
    df -h /data/app
    cat /data/app/before.txt
    swapon --show
    findmnt /mnt/usbdata
    ls /remote/homes/alice
    systemctl is-enabled autofs
    sudo -iu bob ssh -o BatchMode=yes labb hostname
    cat /proc/cmdline
    systemctl get-default
    ```
    Anything missing here is a persistence bug, not a typing bug. Typical culprits: `setsebool` without `-P`, `firewall-cmd` without `--permanent` or `--runtime-to-permanent`, a timer that was started but not enabled, a wrong or missing line in `/etc/fstab`, `autofs` started but not enabled, a connection created without `autoconnect`, or `tuned` not enabled. To hand the lab back, run the reset block from [31 Mock Exam 3](31-mock-exam-3.md).

## Quality check after completion

- `sudo visudo -c` passes
- `dnf repolist` lists `localpractice` and `rpm -q tree` reports a version
- `systemctl list-timers dailyreport.timer` shows `03:30:00`
- `curl http://localhost:8765` returns `mock3 web` with SELinux enforcing
- `lvs` shows `lvapp` at 1300 MiB and `findmnt --verify` is clean
- `cat /proc/cmdline` has `loglevel=5` and `systemctl get-default` is `multi-user.target`

## Common failure points

- editing the `.repo` file with a wrong `baseurl` or forgetting `repodata` (no `createrepo_c`)
- adding a Flatpak remote with `--user` and then installing with `sudo`
- a sudoers drop-in with mode 644, or a rule without the full command path
- fixing the file mode but not the group of a directory (or the reverse)
- using `semanage port -a` for a port that already has a label (use `-m`), or forgetting `-P` on `setsebool`
- `firewall-cmd --runtime-to-permanent` copying a test rule that you never meant to keep
- changing the main network connection instead of a second one, and losing the session
- extending an LV when the group has no free extents, instead of `vgextend` first
- reading the swap UUID before `mkswap`
- an autofs map with one line per user instead of a wildcard key
- editing GRUB entries at the menu and expecting them to persist
- skipping `touch /.autorelabel` after an `rd.break` password reset

**Previous:** [31 Mock Exam 3](31-mock-exam-3.md) · **Next:** [Objectives Map](objectives-map.md): check every official objective against the practice you have done.
