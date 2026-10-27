---
description: A third self-contained 20-task practice exam that fills the objective gaps left by Mocks 1 and 2 (local RPM repository, Flatpak, boot and recovery, tuned, timers, SELinux ports and booleans, vgextend, wildcard autofs, GRUB arguments), with exact values, self-scoring points and a final reboot check.
---

# 31 Mock Exam 3

> The gap-filler practice run: 20 tasks on the objectives that Mocks 1 and 2 did not train, with exact values for every task. Finish it, reboot, and grade yourself against the solutions file.

## When to use this mock exam

Use this after you have worked through [18 Mock Exam 1](18-mock-exam-1.md) and [20 Mock Exam 2](20-mock-exam-2.md). The first table in [32 Mock Exam 3 Solutions](32-mock-exam-3-solutions.md) lists which official objectives those two mocks already trained and which task here covers each remaining one. Do not open that file until you finish.

You should also have completed:

- lessons [00](00-study-skills-and-offline-help.md) to [16](16-persistence-reboot-checks-and-troubleshooting.md)
- the labs `22-26`
- [17a Command Reference Cheat Sheet](17a-rhcsa-command-reference-cheat-sheet.md) and the [Objectives Map](objectives-map.md)

```mermaid
flowchart LR
  A[Software 1-2] --> B[Users and files 3-5]
  B --> C[Logs and timers 6-7]
  C --> D[Security and network 8-11]
  D --> E[Tuning and storage 12-15]
  E --> F[SSH 16]
  F --> G[Boot and recovery 17-19]
  G --> H[Reboot 20]
```

## Instructions

- Suggested self-timer: 3 hours. This is this course's own practice limit, not a statement about any real exam.
- Work from the command line, on `servera`, as `student` with `sudo`. Tasks 18 and 19 need the **console** of `servera` (the hypervisor window or `virsh console`), because you edit the GRUB menu. SSH is not enough for them. Task 17 does not need the console.
- Use local help only (`man`, `--help`, `/usr/share/doc`). Task 2 is the one task that needs internet access (or the offline alternative given there).
- Build in your own verification steps.
- Do the tasks in order. Some depend on earlier ones (Task 9 needs the port from Task 8, Task 14 needs the volume group from Task 13).
- Task 17 does not reboot: `grubby` only stores the argument, and it takes effect on the next boot, which is the first reboot of Task 18. Task 18 reboots twice (rescue shell, then a normal boot), Task 19 reboots (and relabels), and Task 20 reboots once more to prove persistence.
- There are no container tasks in this mock.

## Lab environment and setup

Shared lab environment: `servera.lab.example` (`192.168.122.10`, where you work) and `serverb.lab.example` (`192.168.122.11`, the remote machine). Login `student` / `student` with `sudo`, root password `redhat`. `/dev/vdb` and `/dev/vdc` are 2 GiB empty spare disks on `servera`.

**Self-scoring (this course's own practice scheme):** the 20 tasks add up to 100 points. Treat 70 points as your own target, and grade yourself with the table in [32 Mock Exam 3 Solutions](32-mock-exam-3-solutions.md). A task earns its full points only when every box in its checklist is true; there is no partial credit.

| Task | Skill | Points |
|---|---|---|
| 1 | Local RPM repository | 5 |
| 2 | Flatpak remote, install, remove | 3 |
| 3 | Password aging and a restricted sudo drop-in | 6 |
| 4 | Diagnose a permission problem | 4 |
| 5 | Shell script with a loop and exit status | 6 |
| 6 | Preserve journals | 3 |
| 7 | systemd timer | 6 |
| 8 | SELinux boolean and port label | 6 |
| 9 | Firewall service and port, runtime to permanent | 4 |
| 10 | Static IPv4 and IPv6 on a second connection | 5 |
| 11 | Chrony time source | 4 |
| 12 | Tuned profile | 3 |
| 13 | Extend a volume group and a logical volume | 6 |
| 14 | Swap on an LV and a VFAT mount by label | 6 |
| 15 | autofs wildcard map for NFS home directories | 6 |
| 16 | SSH key login with a client config | 5 |
| 17 | Kernel argument in the bootloader | 4 |
| 18 | Boot a target once, set the default target | 5 |
| 19 | Reset a password with `rd.break` | 6 |
| 20 | Reboot and re-verify | 7 |
| | **Total** | **100** |

### Setup (not scored)

Run these before you start the timer. They prepare both machines so every task can be done as written.

On `servera`:

```bash
sudo dnf install -y httpd policycoreutils-python-utils nfs-utils autofs createrepo_c tuned flatpak dosfstools chrony

# a local name for serverb (Tasks 11, 15 and 16 use serverb and serverb.lab.example)
grep -q 'serverb.lab.example' /etc/hosts || echo '192.168.122.11 serverb.lab.example serverb' | sudo tee -a /etc/hosts

# groups and users (UIDs are fixed so NFS ownership matches serverb)
getent group labteam >/dev/null || sudo groupadd -g 4101 labteam
getent group webadmins >/dev/null || sudo groupadd -g 4102 webadmins
id alice &>/dev/null || sudo useradd -m -u 4001 alice
id bob   &>/dev/null || sudo useradd -m -u 4002 bob
id carol &>/dev/null || sudo useradd -m -u 4003 carol
id dana  &>/dev/null || sudo useradd -m -u 4004 dana
sudo usermod -aG labteam alice
sudo usermod -aG labteam bob
sudo usermod -aG webadmins dana
echo 'alice:forgotten' | sudo chpasswd
echo 'bob:bobpass' | sudo chpasswd
echo 'carol:carolpass' | sudo chpasswd
echo 'dana:danapass' | sudo chpasswd

# stale files from an earlier attempt, so every task starts blank
sudo rm -f /etc/yum.repos.d/localpractice.repo /etc/sudoers.d/webadmins /etc/auto.master.d/homes.autofs /etc/auto.homes
sudo rm -f /etc/systemd/journald.conf.d/persistent.conf /etc/httpd/conf.d/mock3.conf

# Task 1: a directory of RPM files for the local repository
sudo dnf remove -y tree zip
sudo mkdir -p /srv/localrepo
sudo dnf download --destdir /srv/localrepo tree zip
sudo createrepo_c /srv/localrepo

# Task 4: a directory that is not writable for its group
sudo mkdir -p /data/teamdocs
echo 'team notes' | sudo tee /data/teamdocs/notes.txt
sudo rm -f /data/teamdocs/bob.txt /data/teamdocs/dana.txt
sudo chown root:root /data/teamdocs
sudo chmod 755 /data/teamdocs

# Task 5: a directory with three entries
sudo mkdir -p /srv/countdemo
sudo touch /srv/countdemo/a /srv/countdemo/b /srv/countdemo/c

# Tasks 13 and 14: volume group vgapp on /dev/vdb with a mounted XFS logical volume
# (skipped when vgapp already exists, so a second run never destroys it)
if ! sudo vgs vgapp &>/dev/null; then
  sudo parted --script /dev/vdb mklabel gpt mkpart primary 1MiB 601MiB set 1 lvm on
  sudo partprobe /dev/vdb
  sudo udevadm settle
  sudo pvcreate -y /dev/vdb1
  sudo vgcreate vgapp /dev/vdb1
  sudo lvcreate -n lvapp -L 500M vgapp
  sudo mkfs.xfs /dev/vgapp/lvapp
fi
sudo mkdir -p /data/app
grep -q '[[:space:]]/data/app[[:space:]]' /etc/fstab || echo "UUID=$(sudo blkid -s UUID -o value /dev/vgapp/lvapp) /data/app xfs defaults 0 0" | sudo tee -a /etc/fstab
sudo systemctl daemon-reload
mountpoint -q /data/app || sudo mount -a
echo 'before growth' | sudo tee /data/app/before.txt

# Task 18: start from a default target that is not multi-user
sudo systemctl set-default graphical.target
```

On `serverb` (NFS and time server for Tasks 11 and 15, SSH target for Task 16):

```bash
sudo dnf install -y nfs-utils chrony
id alice &>/dev/null || sudo useradd -m -u 4001 alice
id bob   &>/dev/null || sudo useradd -m -u 4002 bob
echo 'bob:bobpass' | sudo chpasswd
sudo mkdir -p /export/homes/alice /export/homes/bob /etc/exports.d
echo 'welcome alice' | sudo tee /export/homes/alice/welcome.txt
echo 'welcome bob' | sudo tee /export/homes/bob/welcome.txt
sudo chown -R alice:alice /export/homes/alice
sudo chown -R bob:bob /export/homes/bob
echo '/export/homes 192.168.122.0/24(rw,sync)' | sudo tee /etc/exports.d/mock3.exports
# time-serving settings go into the main file, which chronyd always reads (guarded, so a re-run adds them once)
grep -q '^allow 192.168.122.0/24' /etc/chrony.conf || printf 'allow 192.168.122.0/24\nlocal stratum 10\n' | sudo tee -a /etc/chrony.conf
sudo systemctl enable nfs-server chronyd
sudo systemctl restart nfs-server chronyd
sudo firewall-cmd --permanent --add-service={nfs,mountd,rpc-bind,ntp}
sudo firewall-cmd --reload
sudo exportfs -rav
```

<!-- VERIFY: dnf download is available in the dnf-plugins-core that RHEL 10 installs; otherwise use dnf install --downloadonly --downloaddir /srv/localrepo tree zip -->
<!-- VERIFY: the stock RHEL 10 /etc/chrony.conf has no uncommented `allow` or `local` line, so the appended lines are the only ones the reset has to remove -->

??? warning "Reset servera and serverb (destroys the Mock 3 work and everything on /dev/vdb and /dev/vdc)"
    Run this to start over after a previous attempt, then run Setup again. Every line ignores "not found" errors. On `servera`:
    ```bash
    sudo systemctl disable --now autofs httpd dailyreport.timer 2>/dev/null
    sudo umount /remote/homes/alice /remote/homes/bob /data/app /mnt/usbdata 2>/dev/null
    sudo swapoff /dev/vgapp/lvswap 2>/dev/null
    # the course's standard disk reset, once for /dev/vdb and once for /dev/vdc
    sudo umount /data /par1 /record /datasource /mnt/lvapp 2>/dev/null; sudo swapoff -a
    sudo vgremove -ff -y vgapp vgdata vgexam vgfs datacontainer 2>/dev/null
    sudo wipefs -a /dev/vdb[0-9]* 2>/dev/null; sudo wipefs -a /dev/vdb; sudo partprobe /dev/vdb
    sudo wipefs -a /dev/vdc[0-9]* 2>/dev/null; sudo wipefs -a /dev/vdc; sudo partprobe /dev/vdc
    sudo sed -i -E '\#[[:space:]]/(data|par1|record|datasource|mnt/lvapp)[[:space:]]#d; /\/dev\/vd[bc]|vg(data|app|fs)-/d' /etc/fstab
    # the two mock mount points (/data/app, /mnt/usbdata) and the swap line, whatever device they used
    sudo sed -i -E '\#[[:space:]]/(data/app|mnt/usbdata)[[:space:]]#d; /^LABEL=USBDATA[[:space:]]/d' /etc/fstab
    for s in $(awk '$1~/^(UUID|LABEL)=/{print $1}' /etc/fstab); do sudo blkid -t "$s" >/dev/null || sudo sed -i "\#^$s[[:space:]]#d" /etc/fstab; done
    sudo systemctl daemon-reload; sudo swapon -a
    sudo rm -f /etc/auto.master.d/homes.autofs /etc/auto.homes /etc/sudoers.d/webadmins
    sudo rm -rf /remote /data /mnt/usbdata /srv/countdemo /srv/localrepo /srv/flatpak-usb /usr/local/bin/dircount.sh
    sudo rm -f /etc/yum.repos.d/localpractice.repo
    sudo dnf remove -y tree zip
    sudo flatpak uninstall --system -y org.gnome.gedit org.gnome.Calculator 2>/dev/null
    sudo flatpak uninstall --system --unused -y 2>/dev/null
    sudo flatpak remote-delete --system --force flathub 2>/dev/null
    sudo flatpak remote-delete --system --force labremote 2>/dev/null
    for u in alice bob carol dana; do sudo pkill -u $u 2>/dev/null; sudo userdel -r $u 2>/dev/null; done
    sudo groupdel labteam 2>/dev/null
    sudo groupdel webadmins 2>/dev/null
    sudo rm -f /etc/systemd/journald.conf.d/persistent.conf
    sudo rm -rf /var/log/journal
    sudo systemctl restart systemd-journald
    sudo rm -f /etc/systemd/system/dailyreport.service /etc/systemd/system/dailyreport.timer
    sudo systemctl daemon-reload
    sudo setsebool -P httpd_can_network_connect off
    sudo semanage port -d -t http_port_t -p tcp 8765 2>/dev/null
    sudo rm -f /etc/httpd/conf.d/mock3.conf /var/www/html/index.html
    sudo firewall-cmd --permanent --remove-service=https 2>/dev/null
    sudo firewall-cmd --permanent --remove-port=8765/tcp 2>/dev/null
    sudo firewall-cmd --reload
    sudo nmcli connection delete labnet 2>/dev/null
    sudo sed -i '/^server serverb.lab.example/d;s/^#pool /pool /' /etc/chrony.conf
    sudo systemctl restart chronyd
    sudo tuned-adm profile "$(tuned-adm recommend)"
    sudo grubby --update-kernel=ALL --remove-args="loglevel=5"
    sudo systemctl set-default multi-user.target
    ```
    The `/etc/hosts` line for `serverb` from Setup is kept on purpose. On `serverb`:
    ```bash
    sudo rm -rf /export/homes /etc/exports.d/mock3.exports
    sudo exportfs -rav
    sudo sed -i '/^allow 192.168.122.0\/24/d;/^local stratum 10/d' /etc/chrony.conf
    sudo systemctl restart chronyd
    for u in alice bob; do sudo userdel -r $u 2>/dev/null; done
    ```

## Tasks

### Task 1 (5 points): Local RPM repository

Setup created a directory `/srv/localrepo` that holds the RPM files `tree` and `zip` plus repository metadata. Neither package is installed. Define a repository for it with the repository ID `localpractice`, the name `Local Practice Repo`, the base URL `file:///srv/localrepo`, enabled, and with `gpgcheck` turned off. Then install the package `tree` using **only** this repository.

- [ ] `/etc/yum.repos.d/localpractice.repo` exists and `sudo dnf repolist` lists `localpractice`
- [ ] `rpm -q tree` reports a version
- [ ] `dnf info tree` (or `dnf list --installed tree`) shows that the package came from `localpractice`

??? question "Hint"
    A `.repo` file is an INI file: one section named after the repository ID, then `name=`, `baseurl=`, `enabled=` and `gpgcheck=`. To force one repository for a single command, disable all and enable only that one.

### Task 2 (3 points): Flatpak remote, install and remove

This is the only task that needs internet access, unless you use the offline alternative below. As root (system-wide scope), add the Flatpak remote named `flathub` with the URL `https://flathub.org/repo/flathub.flatpakrepo`. Install the applications `org.gnome.gedit` and `org.gnome.Calculator` from it. Then remove `org.gnome.Calculator`, so that only `org.gnome.gedit` stays installed.

- [ ] `flatpak remotes` lists `flathub` with scope `system`
- [ ] `flatpak list --app` lists `org.gnome.gedit`
- [ ] `flatpak list --app` does not list `org.gnome.Calculator`

??? question "Offline alternative (no internet on servera)"
    Practice-time only. On any machine that has internet and Flatpak, install both apps and export them with `flatpak create-usb /srv/flatpak-usb org.gnome.gedit org.gnome.Calculator`, then copy `/srv/flatpak-usb` to `servera`. On `servera` use the remote name `labremote` with the URL `file:///srv/flatpak-usb/.ostree/repo` and `--no-gpg-verify`, and do the same install and remove. The checklist then reads `labremote` instead of `flathub`. <!-- VERIFY: flatpak create-usb output layout and that remote-add accepts a file:// path to .ostree/repo on RHEL 10 -->

### Task 3 (6 points): Password aging and a restricted sudo drop-in

Setup created the user `carol` and the user `dana`, who is a member of the group `webadmins`.

- (3 points) For `carol` set: maximum password age 45 days, minimum 2 days, warning 7 days, and the account expiry date `2030-12-31`.
- (3 points) Create the sudoers drop-in `/etc/sudoers.d/webadmins` so that members of `webadmins` can run **only** `/usr/bin/systemctl restart chronyd` as root and **without** a password. Use `visudo` to edit it.

- [ ] `sudo chage -l carol` shows maximum 45, minimum 2, warning 7 and the account expiry `Dec 31, 2030`
- [ ] The drop-in file has owner `root` and mode `0440`, and `sudo visudo -c` reports no errors
- [ ] `sudo -l -U dana` lists `NOPASSWD: /usr/bin/systemctl restart chronyd` and nothing else
- [ ] `sudo -u dana sudo -n systemctl restart chronyd` succeeds, and `sudo -u dana sudo -n systemctl restart sshd` is refused

??? question "Hint"
    `chage` has one option per field (`-M`, `-m`, `-W`, `-E`). A sudoers rule reads `WHO HOST=(RUNAS) NOPASSWD: COMMAND`; a group name starts with `%`. `visudo -f FILE` edits a drop-in with a syntax check.

### Task 4 (4 points): Diagnose a permission problem

Members of the group `labteam` (`alice` and `bob`) must be able to create files in `/data/teamdocs`, and new files must belong to the group `labteam`. Other users (for example `dana`) must still be able to read and enter the directory, but not write. Right now `bob` gets `Permission denied`. Find the causes and fix them. Use only the owning group and the permission bits (no ACLs), keep `root` as the owner, do not add users to other groups and do not make the directory writable for everyone.

- [ ] `sudo -u bob touch /data/teamdocs/bob.txt` succeeds
- [ ] `ls -l /data/teamdocs/bob.txt` shows the group `labteam`
- [ ] `sudo -u dana touch /data/teamdocs/dana.txt` is refused, and `sudo -u dana cat /data/teamdocs/notes.txt` works
- [ ] `stat -c '%U:%G %a' /data/teamdocs` prints `root:labteam 2775`

??? question "Hint"
    Look at the directory itself, not only at the file in it: `ls -ld /data/teamdocs` and `id bob`. Two things are wrong: who owns the directory by group, and what that group is allowed to do.

### Task 5 (6 points): Shell script with a loop and an exit status

Create `/usr/local/bin/dircount.sh`, owned by `root` with mode `755`. It accepts one or more directory paths. For each existing directory it prints `PATH: N entries`, where `N` is the number of entries in it (hidden entries included, `.` and `..` excluded). For an argument that is not a directory it prints `PATH: not a directory` on standard error. The exit status is `0` if every argument was a directory and `2` if at least one was not. With no arguments it prints `Usage: dircount.sh DIR...` on standard error and exits with status `1`.

- [ ] `dircount.sh /srv/countdemo` prints `/srv/countdemo: 3 entries` and `echo $?` shows `0`
- [ ] `dircount.sh /srv/countdemo /nope` prints the `3 entries` line, reports `/nope: not a directory` on standard error and `echo $?` shows `2`
- [ ] `dircount.sh` with no arguments prints the usage line and `echo $?` shows `1`
- [ ] The script is executable and runs by name

??? question "Hint"
    Keep a `status` variable that starts at `0`, set it to `2` inside the `else` branch, and finish the script with `exit "$status"`. Count entries with `ls -A "$dir" | wc -l`.

### Task 6 (3 points): Preserve journals

Configure the system journal to be stored on disk so that it survives reboots. Use a drop-in file `/etc/systemd/journald.conf.d/persistent.conf` that sets `Storage=persistent` and limits the journal to `SystemMaxUse=100M`. Do not edit `/etc/systemd/journald.conf` itself.

- [ ] `/var/log/journal` exists and contains a directory named like the machine ID
- [ ] `ls /var/log/journal/*/system.journal` lists a journal file
- [ ] `systemd-analyze cat-config systemd/journald.conf` shows `Storage=persistent` and `SystemMaxUse=100M`
- [ ] After a reboot, `journalctl --list-boots` lists more than one boot (check it after the first reboot of Task 18)

### Task 7 (6 points): systemd timer

Create the service unit `dailyreport.service` and the timer unit `dailyreport.timer` in `/etc/systemd/system/`. The service is a one-shot job that runs `/usr/bin/logger -t dailyreport "daily report ran"`. The timer starts it every day at `03:30`, catches up after downtime if a run was missed, and is enabled and started.

- [ ] `systemctl is-enabled dailyreport.timer` prints `enabled`
- [ ] `systemctl list-timers dailyreport.timer` shows the next run at `03:30:00`
- [ ] After `sudo systemctl start dailyreport.service`, `journalctl -t dailyreport` shows `daily report ran`
- [ ] The service unit itself is not enabled: `systemctl is-enabled dailyreport.service` prints `static` (the timer starts it)

??? question "Hint"
    A calendar expression for every day at 03:30 is `*-*-* 03:30:00`; check yours with `systemd-analyze calendar`. A timer unit needs a `[Timer]` section and an `[Install]` section with `WantedBy=timers.target`. Catching up is a `Persistent=` setting.

### Task 8 (6 points): SELinux boolean and port label

- (2 points) Turn the SELinux boolean `httpd_can_network_connect` on, persistently.
- (4 points) Configure `httpd` to listen on `tcp/8765` in addition to port 80, using the new file `/etc/httpd/conf.d/mock3.conf`. Give the port `8765` the SELinux label `http_port_t` (it should have no label yet; check with `semanage port -l` first). <!-- VERIFY: tcp/8765 is unlabelled in the stock RHEL 10 policy; if semanage port -l already lists another type for it, change it with semanage port -m instead of -a --> Put the single line `mock3 web` in `/var/www/html/index.html`, then start `httpd` and enable it at boot.

- [ ] `getsebool httpd_can_network_connect` prints `on`, and `sudo semanage boolean -l | grep httpd_can_network_connect` shows `on` in both the current and the default column
- [ ] `sudo semanage port -l | grep -w 8765` lists `http_port_t` with `tcp`
- [ ] `systemctl is-active httpd` prints `active` and `systemctl is-enabled httpd` prints `enabled`
- [ ] `curl http://localhost:8765` prints `mock3 web`

??? question "Hint"
    Try to start `httpd` before you add the label and read the error: it is an SELinux denial on `bind`, not a typo. `setsebool -P` writes the boolean to disk; `semanage port -a` needs the type, the protocol and the port number (`-m` instead of `-a` if the port already has another label).

### Task 9 (4 points): Firewall service and port, runtime to permanent

In the default zone, allow the service `https` and the port `8765/tcp`. First add both to the **runtime** configuration only, test them, and then copy the runtime configuration to the permanent one with a single command.

- [ ] `sudo firewall-cmd --list-services` includes `https` and `sudo firewall-cmd --list-ports` includes `8765/tcp`
- [ ] `sudo firewall-cmd --permanent --list-services` includes `https` and `sudo firewall-cmd --permanent --list-ports` includes `8765/tcp`
- [ ] After `sudo firewall-cmd --reload` both are still present

### Task 10 (5 points): Static IPv4 and IPv6 on a second connection

To avoid cutting your SSH session, do not touch the main connection. Create a new NetworkManager connection named `labnet` of type `dummy` on the interface `dummy0` with the static IPv4 address `10.20.30.40/24` and the static IPv6 address `fd00:20::40/64`. Both methods are `manual`, and the connection starts automatically at boot.

- [ ] `ip -4 addr show dummy0` lists `10.20.30.40/24`
- [ ] `ip -6 addr show dummy0` lists `fd00:20::40/64`
- [ ] `nmcli connection show labnet` shows `ipv4.method: manual`, `ipv6.method: manual` and `connection.autoconnect: yes`

??? question "Hint"
    `nmcli connection add type dummy ifname dummy0 con-name labnet` plus the `ipv4.*` and `ipv6.*` properties creates and activates it in one command. The terse `nmcli -g` output escapes the colons of IPv6 addresses, so read the plain `nmcli connection show labnet` instead.

### Task 11 (4 points): Chrony time source

`serverb` already serves time (Setup). Make `chronyd` on `servera` use `serverb.lab.example` as its only time source: disable the default `pool` line in `/etc/chrony.conf`, add the line `server serverb.lab.example iburst`, and make sure `chronyd` is active and enabled.

- [ ] `grep -E '^(server|pool)' /etc/chrony.conf` prints only the `serverb.lab.example` line
- [ ] `chronyc sources` lists `serverb.lab.example`
- [ ] `chronyc tracking` shows `192.168.122.11` (or the serverb name) as the reference after a minute
- [ ] `systemctl is-active chronyd` prints `active` and `systemctl is-enabled chronyd` prints `enabled`

??? question "Hint"
    A new source shows `^?` for the first seconds; wait and repeat `chronyc sources` until it shows `^*` or `^+`. Restart `chronyd` after editing the file.

### Task 12 (3 points): Tuned profile

Make sure the `tuned` service is active and enabled at boot, and set the active tuning profile to `throughput-performance`.

- [ ] `tuned-adm active` prints `Current active profile: throughput-performance`
- [ ] `systemctl is-enabled tuned` prints `enabled`
- [ ] `tuned-adm verify` ends with a success message, or reports no failing settings <!-- VERIFY: tuned-adm verify output wording on RHEL 10 and whether it can fail inside a VM for harmless reasons -->

### Task 13 (6 points): Extend a volume group and a logical volume

Setup created the volume group `vgapp` (on `/dev/vdb1`, about 596 MiB) with the 500 MiB logical volume `lvapp`, an XFS filesystem mounted at `/data/app` that holds the file `before.txt`. The group has too little free space for what you need. On `/dev/vdc` create a GPT label and one partition of exactly 1 GiB (from `1MiB` to `1025MiB`) with the `lvm` flag. Add it to `vgapp`, then grow `lvapp` by 800 MiB **and** grow its filesystem in one step, without unmounting.

- [ ] `sudo vgs -o vg_name,pv_count vgapp` shows `2` physical volumes
- [ ] `sudo lvs --units m -o lv_name,lv_size vgapp` shows `lvapp` at `1300.00m`
- [ ] `df -h /data/app` shows a size of about 1.3G, and `cat /data/app/before.txt` still prints `before growth`

??? question "Hint"
    Try `lvextend -L +800M` first and read the error. The new partition has to become a physical volume (`pvcreate`) and join the group (`vgextend`) before the extension can work. `lvextend -r` resizes the filesystem too.

### Task 14 (6 points): Swap on an LV and a VFAT mount by label

- (3 points) In `vgapp` create a logical volume `lvswap` of 256 MiB, make it swap, activate it, and make it persistent in `/etc/fstab` by UUID.
- (3 points) On `/dev/vdc` create a second partition of exactly 200 MiB (from `1025MiB` to `1225MiB`), put a VFAT filesystem with the label `USBDATA` on it, and mount it at `/mnt/usbdata` through `/etc/fstab` using the label.

- [ ] `swapon --show` lists `/dev/vgapp/lvswap` (or its `/dev/dm-` name) at 256M, and its `/etc/fstab` line starts with `UUID=`
- [ ] `findmnt /mnt/usbdata` shows type `vfat`, and its `/etc/fstab` line starts with `LABEL=USBDATA`
- [ ] `sudo mount -a` and `findmnt --verify` report no errors

??? question "Hint"
    Read the UUID **after** `mkswap`, never before: a fresh swap area gets its UUID from `mkswap`. A VFAT label is at most 11 characters.

### Task 15 (6 points): autofs wildcard map for NFS home directories

`serverb` exports `/export/homes`, which holds a directory per user (`alice` and `bob`, prepared in Setup). On `servera` configure `autofs` so that `/remote/homes/NAME` mounts `serverb:/export/homes/NAME` on demand, read-write, for any `NAME` (one wildcard line, not one line per user). The master drop-in file is `/etc/auto.master.d/homes.autofs` and the map file is `/etc/auto.homes`. `autofs` must be enabled at boot.

- [ ] `ls /remote/homes/alice` shows `welcome.txt`, and `findmnt /remote/homes/alice` then shows an `nfs4` mount
- [ ] `sudo -u alice touch /remote/homes/alice/test.txt` succeeds
- [ ] `ls /remote/homes/bob` shows `welcome.txt`
- [ ] `systemctl is-enabled autofs` prints `enabled`

??? question "Hint"
    In an indirect map the key `*` matches any name, and `&` in the location is replaced by that name. Keys are not listed by `ls /remote/homes`, they appear when you access them.

### Task 16 (5 points): SSH key login with a client config

As the user `bob` on `servera`, create an ed25519 key pair with no passphrase in `~/.ssh/id_ed25519_labb` (note the non-default file name). Install the public key for `bob` on `serverb` (the password of `bob` there is `bobpass`); always use the name `serverb.lab.example` when you connect, so that the host key is stored under the name the alias uses. Then create `~/.ssh/config` for `bob` with a host alias `labb` that points to `serverb.lab.example`, user `bob` and that key, so that `ssh labb` logs in with no password and no options.

- [ ] `~bob/.ssh/id_ed25519_labb` and `id_ed25519_labb.pub` exist
- [ ] `sudo -iu bob ssh -o BatchMode=yes labb hostname` prints `serverb.lab.example`
- [ ] `~/.ssh` of `bob` on `serverb` has mode `700` and `authorized_keys` mode `600`
- [ ] `~bob/.ssh/config` has mode `600`

### Task 17 (4 points): Kernel argument in the bootloader

Add the kernel argument `loglevel=5` to **every** installed kernel boot entry, in a way that survives reboots. This task does not reboot the machine: the running kernel keeps its old command line until the first reboot of Task 18, so verify the stored setting now and the running one after that reboot.

- [ ] `sudo grubby --info=DEFAULT` shows `loglevel=5` in `args`
- [ ] After the first reboot of Task 18, `cat /proc/cmdline` contains `loglevel=5`

??? question "Hint"
    `grubby --update-kernel=ALL --args="..."` edits the boot entries. Editing `/etc/default/grub` and running `grub2-mkconfig` is the other route, but check the result in `grubby --info=ALL` either way.

### Task 18 (5 points): Boot a target once, set the default target

- (3 points) Set the default target to `multi-user.target`.
- (2 points) Reboot, and **one time only** boot `servera` into `rescue.target` by editing the boot entry at the GRUB menu. Log in as `root` (password `redhat`) in the rescue shell and prove the target, then reboot normally. The next boot must come up in the default target again.

- [ ] `systemctl get-default` prints `multi-user.target`
- [ ] In the rescue shell, `systemctl is-active rescue.target` prints `active` and `cat /proc/cmdline` contains `systemd.unit=rescue.target`
- [ ] After the normal reboot, `cat /proc/cmdline` does not contain `systemd.unit=`, and `cat /proc/cmdline` contains `loglevel=5` (Task 17)

??? question "Hint"
    At the GRUB menu press `e`, go to the end of the line that starts with `linux`, append a space and the argument, then press Ctrl-x. The edit is gone after that boot, which is the point.

### Task 19 (6 points): Reset a password with rd.break

Pretend the password of `alice` is lost (it is `forgotten`). Reboot, interrupt the boot at GRUB with `rd.break`, and set the password of `alice` to `Recovered1` from the early shell, including the step that keeps SELinux labels correct. Let the system finish booting. This takes a console and several minutes because of the relabel.

- [ ] After boot, `su - alice` with the password `Recovered1` works (run it as `student`)
- [ ] The old password `forgotten` no longer works
- [ ] `ls -Z /etc/shadow` shows the type `shadow_t`
- [ ] `ls /.autorelabel` reports `No such file or directory` (the relabel ran and cleaned it up)

??? question "Hint 1"
    In the `switch_root` shell the real root is mounted read-only at `/sysroot`. Remount it read-write, then `chroot /sysroot` so that `passwd` or `chpasswd` edits the real files.

??? question "Hint 2"
    Create the file `/.autorelabel` while you are inside the chroot. Then `exit` twice; the machine continues to boot, relabels and reboots by itself.

### Task 20 (7 points): Reboot and re-verify

Reboot `servera` and, without changing anything, prove that these survived. Each box is worth half a point.

- [ ] Task 1: `sudo dnf repolist` lists `localpractice`
- [ ] Task 6: `journalctl --list-boots` lists more than one boot
- [ ] Task 7: `dailyreport.timer` is enabled and listed by `systemctl list-timers`
- [ ] Task 8: `httpd` is active, the boolean is `on`, the port label exists and `curl http://localhost:8765` prints `mock3 web`
- [ ] Task 9: `https` and `8765/tcp` are in the permanent firewall configuration
- [ ] Task 10: `dummy0` holds `10.20.30.40/24` and `fd00:20::40/64`
- [ ] Task 11: `chronyc sources` lists `serverb.lab.example`
- [ ] Task 12: `tuned-adm active` prints `throughput-performance`
- [ ] Task 13: `/data/app` is mounted at about 1.3G and `before.txt` is intact
- [ ] Task 14: swap on `lvswap` is active and `/mnt/usbdata` is mounted from `LABEL=USBDATA`
- [ ] Task 15: `ls /remote/homes/alice` mounts on access and `autofs` is enabled
- [ ] Task 16: `sudo -iu bob ssh -o BatchMode=yes labb hostname` still works
- [ ] Task 17: `/proc/cmdline` contains `loglevel=5`
- [ ] Task 18: `systemctl get-default` prints `multi-user.target`

## Suggested proof commands

```bash
sudo dnf repolist
rpm -q tree
flatpak list --app
sudo chage -l carol
sudo -l -U dana
stat -c '%U:%G %a' /data/teamdocs
dircount.sh /srv/countdemo /nope; echo $?
journalctl --list-boots
systemctl list-timers dailyreport.timer
getsebool httpd_can_network_connect
sudo semanage port -l | grep -w 8765
curl http://localhost:8765
sudo firewall-cmd --permanent --list-all
ip addr show dummy0
chronyc sources
tuned-adm active
sudo lvs --units m -o lv_name,lv_size vgapp
swapon --show
findmnt /mnt/usbdata
ls /remote/homes/alice
sudo -iu bob ssh -o BatchMode=yes labb hostname
cat /proc/cmdline
systemctl get-default
```

## Continue in order

- Grade yourself before reading the answer key
- Open [32 Mock Exam 3 Solutions](32-mock-exam-3-solutions.md) only after you are fully finished

**Previous:** [21 Mock Exam 2 Solutions](21-mock-exam-2-solutions.md) · **Next:** [32 Mock Exam 3 Solutions](32-mock-exam-3-solutions.md): the coverage table, the grade-yourself table and the worked solutions.
