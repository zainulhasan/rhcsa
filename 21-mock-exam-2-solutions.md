# Mock Exam 2 Solutions

Use this file only after you complete `20-mock-exam-2.md` without help.

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

## Solutions

### Tasks 1-3

```bash
groupadd webops
useradd -m webadmin
usermod -aG webops webadmin
echo '%webops ALL=(ALL) ALL' > /etc/sudoers.d/webops
visudo -c
mkdir -p /opt/webdata
chown root:webops /opt/webdata
chmod 775 /opt/webdata
```

### Tasks 4-5

```bash
echo '<h1>Test Page</h1>' > /opt/webdata/index.html
tar -czvf /tmp/webdata.tar.gz /opt/webdata
tar -tvf /tmp/webdata.tar.gz
```

### Task 6

```bash
cat > /usr/local/bin/filecheck.sh <<'EOF'
#!/bin/bash
for file in "$@"
do
    if [ -f "$file" ]; then
        echo "$file regular"
    else
        echo "$file not-regular"
    fi
done
EOF
chmod +x /usr/local/bin/filecheck.sh
```

### Tasks 7-8

```bash
systemctl enable --now chronyd
systemctl is-active chronyd
systemctl is-enabled chronyd
journalctl -u sshd -b | tail -n 20 > /tmp/sshd-boot.log
```

### Tasks 9-12

```bash
nmcli connection show
hostnamectl set-hostname web1.lab.example
echo '127.0.0.1 web1.lab.example' >> /etc/hosts
firewall-cmd --add-service=ssh --permanent
firewall-cmd --add-service=http --permanent
firewall-cmd --reload
```

For interface configuration, adjust `nmcli connection modify ...` to your lab network requirements.

### Tasks 13-15

```bash
lsblk
parted /dev/vdb
pvcreate /dev/vdb1
vgcreate vgweb /dev/vdb1
lvcreate -n lvcontent -L 700M vgweb
mkfs.ext4 /dev/vgweb/lvcontent
mkdir -p /webcontent
mount /dev/vgweb/lvcontent /webcontent
blkid /dev/vgweb/lvcontent
vi /etc/fstab
mount -a
lvextend -L +100M /dev/vgweb/lvcontent
resize2fs /dev/vgweb/lvcontent
```

### Task 16

Example NFS server-side pattern:

```bash
systemctl enable --now nfs-server
echo '/webcontent *(rw,sync)' >> /etc/exports
exportfs -rav
showmount -e localhost
```

Autofs example depends on your lab path and host layout.

### Tasks 17-18

```bash
sudo -u webadmin ssh-keygen
sudo -u webadmin ssh-copy-id webadmin@serverb
restorecon -Rv /var/www/html
ls -Z /var/www/html
```

If the task uses a custom web path, adjust contexts with the appropriate SELinux method and then verify labels.

### Task 19

```bash
reboot
visudo -c
systemctl is-enabled chronyd
hostnamectl
getent hosts web1.lab.example
firewall-cmd --list-services
lvs
findmnt /webcontent
```

## Quality Check After Completion

- `visudo -c` should pass
- `systemctl is-enabled chronyd` should report enabled
- `findmnt /webcontent` should show the mount
- `lvs` should show the LV at the extended size
- `firewall-cmd --list-services` should include `ssh` and `http`
- hostname and local resolution should work

## Common Failure Points

- forgetting to append group membership
- forgetting executable bit on the script
- building the LV but not the filesystem
- extending the LV but not resizing ext4
- adding firewall rules without permanence
- fixing Unix permissions when the real issue is SELinux context
