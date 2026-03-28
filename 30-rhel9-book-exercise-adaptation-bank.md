# RHEL 9 Book Exercise Adaptation Bank

This page is an optional supplemental exercise bank. It is not part of the required beginner route.

It adapts selected hands-on exercise ideas from the RHEL 9 edition of Asghar Ghori's RHCSA book and rewrites them into RHEL 10-safe practice for this course.

Use this file only after you complete:

1. lessons `00-16`
2. labs `22-26`
3. `28-rhcsa-10-mixed-practice-bank.md`

Use it as extra task repetition, not as a replacement for the core lesson and lab path.

## Foundations Carryover

### Task 1: Archive, verify, and restore a configuration snapshot

Source idea: `Exercise 3-1`, `Lab 3-1`

As `root`:

1. Create `/var/tmp/configsnap`.
2. Copy `/etc/hosts` and `/etc/services` into it.
3. Create `/root/configsnap.tar.gz` from that directory.
4. List the archive contents without extracting them.
5. Extract the archive into `/root/restore-test`.

What To Verify:

- `/root/configsnap.tar.gz` exists
- `tar -tzvf /root/configsnap.tar.gz` shows both files
- `/root/restore-test/var/tmp/configsnap` or the extracted directory tree contains the files you archived

RHEL 10 Fit Note:

The archive workflow is still fully aligned with current RHCSA-style file and backup tasks. The command pattern is unchanged.

Example Solution:

```bash
mkdir -p /var/tmp/configsnap
cp /etc/hosts /etc/services /var/tmp/configsnap
tar -czvf /root/configsnap.tar.gz /var/tmp/configsnap
tar -tzvf /root/configsnap.tar.gz
mkdir -p /root/restore-test
tar -xzvf /root/configsnap.tar.gz -C /root/restore-test
find /root/restore-test -type f | grep -E 'hosts|services'
```

### Task 2: Create both hard and symbolic links correctly

Source idea: `Exercise 3-2`, `Exercise 3-3`

As `root`:

1. Create `/var/tmp/linkdemo.txt` with three lines of text.
2. Create a hard link at `/var/tmp/linkdemo.hard`.
3. Create a symbolic link at `/var/tmp/linkdemo.soft`.
4. Rename the original file to `/var/tmp/linkdemo.renamed`.
5. Repair only the link that breaks.

What To Verify:

- the hard link still points to the same inode after rename
- the symbolic link breaks after rename and works again after repair
- you can explain why the two link types behave differently

RHEL 10 Fit Note:

Hard-link and symbolic-link behavior is not version-sensitive here. This remains a clean RHCSA objective match.

Example Solution:

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

### Task 3: Build a collaborative directory with SGID

Source idea: `Exercise 4-5`, `Lab 4-2`

As `root`:

1. Create group `projectops`.
2. Create directory `/srv/projectops`.
3. Set group ownership to `projectops`.
4. Configure permissions so members can collaborate there and new files inherit the group automatically.

What To Verify:

- `ls -ld /srv/projectops` shows the `projectops` group
- the mode includes SGID
- test files created inside inherit the `projectops` group

RHEL 10 Fit Note:

Group-collaboration directory behavior is still a direct fit for current Linux administration practice and RHCSA-style permissions work.

Example Solution:

```bash
groupadd projectops
mkdir -p /srv/projectops
chgrp projectops /srv/projectops
chmod 2775 /srv/projectops
touch /srv/projectops/testfile
ls -ld /srv/projectops
ls -l /srv/projectops/testfile
```

### Task 4: Create a sticky-bit drop zone

Source idea: `Exercise 4-6`, `Lab 4-2`

As `root`:

1. Create `/srv/dropbox`.
2. Allow all users to create files there.
3. Prevent normal users from deleting each other's files.

What To Verify:

- the directory mode ends with a sticky-bit indicator such as `t`
- users can create files there
- the permission model matches a shared drop zone

RHEL 10 Fit Note:

This remains a clean permissions objective with no meaningful RHEL 9 versus RHEL 10 change.

Example Solution:

```bash
mkdir -p /srv/dropbox
chmod 1777 /srv/dropbox
ls -ld /srv/dropbox
```

## Administration Carryover

### Task 5: Create users with default and custom attributes

Source idea: `Exercise 5-1`, `Exercise 5-2`, `Exercise 5-4`, `Lab 5-3`, `Lab 5-4`

As `root`:

1. Create user `analyst2` with default settings.
2. Create user `operator2` with home `/srv/operator2` and shell `/bin/bash`.
3. Create user `guest2` with shell `/sbin/nologin`.
4. Verify all three accounts completely.

What To Verify:

- account entries exist in `getent passwd`
- home directory and shell values are correct
- `guest2` uses a non-interactive shell

RHEL 10 Fit Note:

User-creation tasks still map directly to current RHCSA skill expectations. The shell and home-management patterns remain the same.

Example Solution:

```bash
useradd analyst2
useradd -m -d /srv/operator2 -s /bin/bash operator2
useradd -m -s /sbin/nologin guest2
getent passwd analyst2 operator2 guest2
ls -ld /srv/operator2
```

### Task 6: Configure password aging and lock state

Source idea: `Exercise 6-1`, `Exercise 6-2`, `Exercise 6-3`, `Lab 6-1`, `Lab 6-2`

As `root`:

1. Set user `analyst2` to maximum password age `60`, minimum `7`, warning `10`.
2. Lock account `guest2`.
3. Unlock the account again.
4. Verify both aging and lock state.

What To Verify:

- `chage -l analyst2` shows the intended aging values
- lock and unlock actions are reflected in account status
- you can explain the difference between locking an account and password-aging policy

RHEL 10 Fit Note:

This is still direct RHCSA-style account administration. The `chage` and lock workflows remain stable.

Example Solution:

```bash
chage -M 60 -m 7 -W 10 analyst2
passwd -l guest2
passwd -S guest2
passwd -u guest2
chage -l analyst2
passwd -S guest2
```

### Task 7: Configure group membership, sudo access, and ownership

Source idea: `Exercise 6-4`, `Exercise 6-6`, `Lab 6-4`, `Lab 6-5`

As `root`:

1. Create group `opsadmin`.
2. Add `operator2` to that group as a supplementary member.
3. Create sudoers drop-in `/etc/sudoers.d/opsadmin` so members of `opsadmin` can run administrative commands.
4. Create `/srv/opsdata`, owned by `operator2:opsadmin`.

What To Verify:

- `id operator2` shows `opsadmin`
- `visudo -c` passes
- ownership of `/srv/opsdata` is correct

RHEL 10 Fit Note:

This is still standard user, group, sudo, and ownership work. No version-specific adaptation is required.

Example Solution:

```bash
groupadd opsadmin
usermod -aG opsadmin operator2
echo '%opsadmin ALL=(ALL) ALL' > /etc/sudoers.d/opsadmin
chmod 440 /etc/sudoers.d/opsadmin
mkdir -p /srv/opsdata
chown operator2:opsadmin /srv/opsdata
id operator2
visudo -c
ls -ld /srv/opsdata
```

### Task 8: Create both one-time and repeating scheduled jobs

Source idea: `Exercise 8-3`, `Exercise 8-4`, `Lab 8-2`

As a regular user:

1. Schedule a one-time `at` job that writes the hostname to `/tmp/at-book-proof.txt` five minutes from now.
2. Add a crontab entry that appends the date to `/tmp/cron-book-proof.txt` every five minutes.

What To Verify:

- `atq` shows the queued job
- `crontab -l` shows the cron entry
- you used full paths where practical

RHEL 10 Fit Note:

The job-scheduling patterns still fit current RHCSA-style administration. This keeps the focus on task creation and verification.

Example Solution:

```bash
echo '/usr/bin/hostname >> /tmp/at-book-proof.txt' | at now + 5 minutes
atq
(crontab -l 2>/dev/null; echo '*/5 * * * * /usr/bin/date >> /tmp/cron-book-proof.txt') | crontab -
crontab -l
```

### Task 9: Configure repositories and verify a package

Source idea: `Exercise 10-1`, `Exercise 10-2`, `Lab 10-1`, `Lab 10-2`

As `root`:

1. Verify enabled repositories.
2. Install a package that provides the `tree` command.
3. Query the installed package and confirm which command it provides.

What To Verify:

- enabled repositories are visible
- `tree` is installed
- RPM query commands can confirm ownership of the binary

RHEL 10 Fit Note:

This stays RHEL 10-safe by using current repository and package-verification habits instead of older package-manager wording.

Example Solution:

```bash
dnf repolist
dnf install -y tree
rpm -q tree
rpm -qf /usr/bin/tree
```

### Task 10: Build persistent GPT, LVM, filesystem, and swap storage

Source idea: `Exercise 13-4`, `Exercise 13-6`, `Exercise 13-7`, `Exercise 14-2`, `Exercise 14-5`, `Lab 13-3`, `Lab 14-3`, `Lab 14-5`

As `root`, using a spare free disk such as `/dev/vdb`:

1. Create a GPT label if needed.
2. Create one partition for LVM and one partition for swap.
3. Build volume group `vgbook` and logical volume `lvdata` sized `700M`.
4. Create an ext4 filesystem on the LV.
5. Mount it persistently at `/bookdata` by UUID.
6. Create, activate, and persist swap on the second partition.

What To Verify:

- `lsblk -f` shows the partition and filesystem layout
- `lvs` shows `vgbook/lvdata`
- `findmnt /bookdata` works
- `swapon --show` shows the new swap area
- `/etc/fstab` contains both persistent entries

RHEL 10 Fit Note:

This keeps only the high-value GPT, LVM, filesystem, and swap flow. MBR and VDO source tasks are intentionally excluded.

Example Solution:

```bash
parted -s /dev/vdb mklabel gpt
parted -s /dev/vdb mkpart primary 1MiB 901MiB
parted -s /dev/vdb mkpart primary linux-swap 901MiB 1669MiB
pvcreate /dev/vdb1
vgcreate vgbook /dev/vdb1
lvcreate -n lvdata -L 700M vgbook
mkfs.ext4 /dev/vgbook/lvdata
mkdir -p /bookdata
blkid /dev/vgbook/lvdata /dev/vdb2
echo "UUID=$(blkid -s UUID -o value /dev/vgbook/lvdata) /bookdata ext4 defaults 0 0" >> /etc/fstab
echo "UUID=$(blkid -s UUID -o value /dev/vdb2) swap swap defaults 0 0" >> /etc/fstab
mkswap /dev/vdb2
swapon /dev/vdb2
mount -a
findmnt /bookdata
swapon --show
```

### Task 11: Make journald storage persistent

Source idea: `Exercise 12-1`, `Lab 12-2`

As `root`:

1. Configure `journald` to store logs persistently.
2. Restart the journal service.
3. Verify both configuration and resulting storage behavior.

What To Verify:

- the config explicitly requests persistent storage
- `/var/log/journal` exists
- `journalctl -b` shows current boot logs

RHEL 10 Fit Note:

Persistent journal storage is still a current administration skill and fits the course’s persistence-first workflow.

Example Solution:

```bash
mkdir -p /var/log/journal
sed -i.bak 's/^#*Storage=.*/Storage=persistent/' /etc/systemd/journald.conf
systemctl restart systemd-journald
grep '^Storage=' /etc/systemd/journald.conf
ls -ld /var/log/journal
journalctl -b | tail
```

## Networking and Security Carryover

### Task 12: Set hostname and local name resolution

Source idea: `Exercise 15-1`, `Exercise 15-5`

As `root`:

1. Set hostname to `servera.lab.example`.
2. Add an `/etc/hosts` entry so that name resolves locally.
3. Verify both hostname and local resolution.

What To Verify:

- `hostnamectl` shows the new hostname
- `getent hosts servera.lab.example` returns the expected record

RHEL 10 Fit Note:

Hostname and local resolution behavior are stable here and remain directly useful for current RHCSA practice.

Example Solution:

```bash
hostnamectl set-hostname servera.lab.example
echo '127.0.0.1 servera.lab.example servera' >> /etc/hosts
hostnamectl
getent hosts servera.lab.example
```

### Task 13: Create a static `nmcli` connection profile

Source idea: `Exercise 15-4`, `Lab 15-1`

As `root`, using your real connection name and interface:

1. Set a static IPv4 address for a lab profile.
2. Set gateway and DNS values that fit your lab.
3. Bring the profile up.
4. Verify the live address and stored profile values.

What To Verify:

- `nmcli connection show NAME` shows the intended settings
- `nmcli connection up NAME` succeeds
- `ip addr` reflects the active address

RHEL 10 Fit Note:

This keeps the current course preference for `nmcli` rather than older or manual-only network workflows.

Example Solution:

```bash
nmcli connection modify NAME ipv4.addresses 192.168.56.20/24
nmcli connection modify NAME ipv4.gateway 192.168.56.1
nmcli connection modify NAME ipv4.dns 1.1.1.1
nmcli connection modify NAME ipv4.method manual
nmcli connection up NAME
nmcli connection show NAME
ip addr
```

### Task 14: Configure NFS export and autofs client access

Source idea: `Exercise 16-1`, `Exercise 16-3`, `Exercise 16-4`, `Lab 16-1`, `Lab 16-2`

Use two systems if possible.

Server side:

1. Export `/srv/nfsshare` read-write to your lab subnet.

Client side:

1. Install `autofs`.
2. Configure a direct or indirect map so the share mounts on demand.
3. Start and enable `autofs`.

What To Verify:

- `exportfs -rav` completes on the server
- `showmount -e SERVER` shows the export from the client
- accessing the client path triggers the mount

RHEL 10 Fit Note:

NFS and autofs remain part of the current course scope. The task is kept focused on export, client access, and on-demand mounting.

Example Solution:

```bash
# server
mkdir -p /srv/nfsshare
echo '/srv/nfsshare 192.168.56.0/24(rw,sync)' >> /etc/exports
exportfs -rav
systemctl enable --now nfs-server

# client
dnf install -y autofs nfs-utils
echo '/- /etc/auto.direct' >> /etc/auto.master
echo '/mnt/nfsshare -rw SERVER:/srv/nfsshare' > /etc/auto.direct
systemctl enable --now autofs
showmount -e SERVER
ls /mnt/nfsshare
```

### Task 15: Verify chrony client health

Source idea: `Exercise 17-1`, `Lab 17-1`

As `root`:

1. Ensure `chronyd` is active now and enabled at boot.
2. Inspect current time-source visibility.
3. Verify that timedate state reflects NTP use.

What To Verify:

- `systemctl is-active chronyd` returns active
- `systemctl is-enabled chronyd` returns enabled
- `chronyc sources` returns source information

RHEL 10 Fit Note:

Chrony client verification remains a safe current objective fit. This supplement keeps the task at the client-verification level.

Example Solution:

```bash
systemctl enable --now chronyd
systemctl is-active chronyd
systemctl is-enabled chronyd
chronyc sources -v
timedatectl
```

### Task 16: Configure SSH key-based authentication

Source idea: `Exercise 18-2`, `Lab 18-1`

As a regular user on `servera`:

1. Generate an SSH key pair if needed.
2. Copy the public key to the same user on `serverb`.
3. Verify passwordless login.

What To Verify:

- the key pair exists
- the public key is installed on the remote system
- `ssh user@serverb hostname` works without password prompt

RHEL 10 Fit Note:

Key-based SSH authentication remains a direct fit for the current course and mock-exam path.

Example Solution:

```bash
ssh-keygen -t ed25519
ssh-copy-id user@serverb
ssh user@serverb hostname
```

### Task 17: Open firewall access and verify persistence

Source idea: `Exercise 19-1`, `Exercise 19-3`, `Lab 19-1`

As `root`:

1. Open HTTP service permanently in `firewalld`.
2. Open TCP port `85` permanently as an extra direct port rule.
3. Reload the firewall.
4. Verify the rule set.

What To Verify:

- the permanent rule set includes `http`
- the permanent rule set includes port `85/tcp`
- you can separate service-based rules from raw port rules

RHEL 10 Fit Note:

This stays current by focusing on normal `firewalld` administration and persistence rather than older firewall tooling.

Example Solution:

```bash
firewall-cmd --add-service=http --permanent
firewall-cmd --add-port=85/tcp --permanent
firewall-cmd --reload
firewall-cmd --list-all
firewall-cmd --list-all --permanent
```

### Task 18: Fix SELinux content access and custom HTTP port labeling

Source idea: `Exercise 20-2`, `Exercise 20-3`, `Exercise 20-5`, `Lab 20-2`, `Lab 20-3`, `Lab 20-5`

As `root`:

1. Create `/srv/bookweb` and place an `index.html` file there.
2. Add a persistent SELinux file-context rule so the directory can be served by `httpd`.
3. Apply the labels.
4. Add TCP port `85` to the HTTP SELinux port type.
5. Verify the file context and port label.

What To Verify:

- `semanage fcontext -l` reflects the new rule
- `ls -Zd /srv/bookweb /srv/bookweb/index.html` shows web content labels
- `semanage port -l | grep http_port_t` includes `85`

RHEL 10 Fit Note:

This keeps the supplement aligned with current SELinux troubleshooting patterns: persistent context rules, port labeling, and verification rather than disabling SELinux.

Example Solution:

```bash
mkdir -p /srv/bookweb
echo 'book web test' > /srv/bookweb/index.html
semanage fcontext -a -t httpd_sys_content_t '/srv/bookweb(/.*)?'
restorecon -Rv /srv/bookweb
semanage port -a -t http_port_t -p tcp 85
ls -Zd /srv/bookweb /srv/bookweb/index.html
semanage port -l | grep http_port_t
```
