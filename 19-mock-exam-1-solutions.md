# Mock Exam 1 Solutions

Use this file only after you complete `18-mock-exam-1.md` without help.

## Solution Strategy

Work in dependency order:

1. users and permissions
2. package and script tasks
3. scheduler and service tasks
4. storage and filesystem tasks
5. security and persistence tasks
6. reboot and verify

## Solutions

### Task 1

```bash
groupadd reporting
useradd -m analyst1
usermod -aG reporting analyst1
chage -M 60 -m 7 -W 10 analyst1
id analyst1
chage -l analyst1
```

### Task 2

```bash
mkdir -p /srv/reports
chown root:reporting /srv/reports
chmod 775 /srv/reports
ls -ld /srv/reports
```

### Task 3

```bash
printf "line1\nline2\nline3\n" > /srv/reports/weekly.txt
ln /srv/reports/weekly.txt /tmp/weekly.txt.hard
ln -s /srv/reports/weekly.txt /tmp/weekly.txt.soft
ls -li /srv/reports/weekly.txt /tmp/weekly.txt.hard /tmp/weekly.txt.soft
```

### Task 4

```bash
grep 'bash$' /etc/passwd > /tmp/bash-users.txt
grep 'bash$' /etc/passwd | wc -l > /tmp/bash-users.count
```

### Task 5

```bash
dnf install -y tree
rpm -q tree
command -v tree
```

### Task 6

```bash
cat > /usr/local/bin/userreport.sh <<'EOF'
#!/bin/bash
if id "$1" >/dev/null 2>&1; then
    echo exists
else
    echo missing
fi
EOF
chmod +x /usr/local/bin/userreport.sh
/usr/local/bin/userreport.sh analyst1
```

### Task 7

```bash
echo "hostname > /tmp/at-proof.txt" | at now + 1 minute
atq
```

### Task 8

```bash
crontab -e
crontab -l
```

Cron line:

```text
*/5 * * * * date >> /tmp/cron-proof.txt
```

### Task 9

```bash
systemctl enable --now sshd
systemctl is-active sshd
systemctl is-enabled sshd
```

### Task 10

```bash
ssh-keygen
ssh-copy-id user@serverb
ssh user@serverb hostname
```

### Task 11

Create two GPT partitions on the spare disk: `vdb1` for LVM and `vdb2` for swap. The non-interactive form is shown; `partprobe` makes the new nodes appear.

```bash
lsblk
sudo parted --script /dev/vdb mklabel gpt
sudo parted --script /dev/vdb mkpart primary 1MiB 600MiB
sudo parted --script /dev/vdb set 1 lvm on
sudo parted --script /dev/vdb mkpart primary 600MiB 1112MiB
sudo partprobe /dev/vdb
lsblk /dev/vdb
# build the LVM stack on vdb1
sudo pvcreate /dev/vdb1
sudo vgcreate vgmock /dev/vdb1
sudo lvcreate -n lvdata -L 512M vgmock
sudo lvs
```

### Task 12

```bash
sudo mkfs.xfs /dev/vgmock/lvdata
sudo mkdir -p /data
sudo mount /dev/vgmock/lvdata /data
sudo blkid /dev/vgmock/lvdata
# add a line to /etc/fstab using the UUID from blkid, for example:
#   UUID=xxxx-xxxx  /data  xfs  defaults  0 0
sudo vi /etc/fstab
sudo systemctl daemon-reload
sudo mount -a
findmnt /data
```

A reliable way to append the exact UUID line without retyping it:

```bash
echo "UUID=$(sudo blkid -s UUID -o value /dev/vgmock/lvdata) /data xfs defaults 0 0" | sudo tee -a /etc/fstab
```

### Task 13

```bash
sudo mkswap /dev/vdb2
sudo swapon /dev/vdb2
sudo blkid /dev/vdb2
# add a swap line to /etc/fstab using the UUID, for example:
#   UUID=xxxx-xxxx  none  swap  defaults  0 0
echo "UUID=$(sudo blkid -s UUID -o value /dev/vdb2) none swap defaults 0 0" | sudo tee -a /etc/fstab
sudo systemctl daemon-reload
swapon --show
```

### Task 14

```bash
hostnamectl set-hostname servera.lab.example
hostnamectl
```

### Task 15

```bash
firewall-cmd --add-service=http --permanent
firewall-cmd --reload
firewall-cmd --list-services
```

### Task 16

```bash
getenforce
sudo restorecon -Rv /var/www/html
ls -Z /var/www/html
```

`restorecon` works here because `/var/www/html` is a **default** web path. If the task uses a **custom** path (for example `/web`), `restorecon` alone will not help — define the rule first, then apply it:

```bash
sudo semanage fcontext -a -t httpd_sys_content_t "/web(/.*)?"
sudo restorecon -Rv /web
```

### Task 17

```bash
sudo mkdir -p /var/log/journal
# make persistence explicit in the config:
sudo sed -i 's/^#\?Storage=.*/Storage=persistent/' /etc/systemd/journald.conf
sudo systemctl restart systemd-journald
ls -ld /var/log/journal
journalctl --disk-usage
```

### Task 18

```bash
reboot
systemctl is-enabled sshd
findmnt /data
swapon --show
hostnamectl
firewall-cmd --list-services
ls -ld /var/log/journal
```

## Quality Check After Completion

- `mount -a` should succeed before reboot
- `swapon --show` should list the configured swap
- `systemctl is-enabled sshd` should return enabled
- `findmnt /data` should return the mount
- `hostnamectl` should show the configured hostname
- `firewall-cmd --list-services` should include `http`

## Common Failure Points

- wrong disk or partition name
- missing `/etc/fstab` entry
- service started but not enabled
- firewall rule added without `--permanent`
- key generated but not copied to the right remote user
- `userreport.sh` not made executable
