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

```bash
lsblk
parted /dev/vdb
pvcreate /dev/vdb1
vgcreate vgmock /dev/vdb1
lvcreate -n lvdata -L 512M vgmock
lvs
```

### Task 12

```bash
mkfs.xfs /dev/vgmock/lvdata
mkdir -p /data
mount /dev/vgmock/lvdata /data
blkid /dev/vgmock/lvdata
vi /etc/fstab
mount -a
findmnt /data
```

### Task 13

```bash
mkswap /dev/vdb2
swapon /dev/vdb2
blkid /dev/vdb2
vi /etc/fstab
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
restorecon -Rv /var/www/html
ls -Z /var/www/html
```

### Task 17

```bash
mkdir -p /var/log/journal
systemctl restart systemd-journald
ls -ld /var/log/journal
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
