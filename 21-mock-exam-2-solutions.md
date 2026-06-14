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
# create a GPT partition flagged for LVM
sudo parted --script /dev/vdb mklabel gpt
sudo parted --script /dev/vdb mkpart primary 1MiB 800MiB
sudo parted --script /dev/vdb set 1 lvm on
sudo partprobe /dev/vdb
# build the stack and an ext4 filesystem
sudo pvcreate /dev/vdb1
sudo vgcreate vgweb /dev/vdb1
sudo lvcreate -n lvcontent -L 700M vgweb
sudo mkfs.ext4 /dev/vgweb/lvcontent
sudo mkdir -p /webcontent
sudo mount /dev/vgweb/lvcontent /webcontent
# persistent mount by UUID:
echo "UUID=$(sudo blkid -s UUID -o value /dev/vgweb/lvcontent) /webcontent ext4 defaults 0 0" | sudo tee -a /etc/fstab
sudo systemctl daemon-reload
sudo mount -a
findmnt /webcontent
# extend by 100M and grow the ext4 filesystem (one command with -r):
sudo lvextend -r -L +100M /dev/vgweb/lvcontent
df -h /webcontent
```

### Task 16

RHCSA is the **NFS client** — mount an export the lab server provides (setting up an NFS server is RHCE):

```bash
sudo dnf install -y nfs-utils
showmount -e servera
sudo mkdir -p /mnt/nfsdata
sudo mount -t nfs servera:/export/data /mnt/nfsdata
findmnt /mnt/nfsdata
# persistent: add to /etc/fstab with _netdev, then daemon-reload + mount -a
#   servera:/export/data  /mnt/nfsdata  nfs  _netdev,defaults  0 0
```

For on-demand access with autofs, add a master drop-in and an indirect map:

```bash
sudo dnf install -y autofs
echo '/mnt/auto  /etc/auto.nfsdata' | sudo tee /etc/auto.master.d/nfsdata.autofs
echo 'data  -rw  servera:/export/data' | sudo tee /etc/auto.nfsdata
sudo systemctl enable --now autofs
ls /mnt/auto/data
```

### Tasks 17-18

```bash
sudo -u webadmin ssh-keygen
sudo -u webadmin ssh-copy-id webadmin@serverb
```

For the SELinux step, if the web content is at the **default** path, `restorecon` is enough:

```bash
sudo restorecon -Rv /var/www/html
ls -Z /var/www/html
```

If the task uses a **custom** path (for example `/webcontent`), `restorecon` alone will not work — add the context rule first, then apply it:

```bash
sudo semanage fcontext -a -t httpd_sys_content_t "/webcontent(/.*)?"
sudo restorecon -Rv /webcontent
ls -Zd /webcontent
```

### Task 19 (rootless container)

Run as `webadmin` (use `sudo -iu webadmin` to get a real login session, or run these while logged in as that user):

```bash
podman pull quay.io/httpd/httpd-24      # or use the provided/local registry
mkdir -p ~/webcontent
echo "mock exam container" > ~/webcontent/index.html
podman run -d --name webctr -p 8080:80 -v ~/webcontent:/var/www/html:Z quay.io/httpd/httpd-24
curl http://localhost:8080

mkdir -p ~/.config/containers/systemd
cat > ~/.config/containers/systemd/webctr.container <<'EOF'
[Unit]
Description=Mock exam web container

[Container]
Image=quay.io/httpd/httpd-24
PublishPort=8080:80
Volume=%h/webcontent:/var/www/html:Z

[Install]
WantedBy=default.target
EOF

podman rm -f webctr
loginctl enable-linger webadmin
systemctl --user daemon-reload
systemctl --user start webctr.service
systemctl --user status webctr.service
```

Notes:

- rootless containers must use a host port at or above 1024 (here `8080`)
- the `:Z` relabel is required or SELinux blocks the mounted content
- `enable-linger` is what makes the user service survive logout and reboot

### Task 20

```bash
reboot
visudo -c
systemctl is-enabled chronyd
hostnamectl
getent hosts web1.lab.example
firewall-cmd --list-services
lvs
findmnt /webcontent
curl http://localhost:8080
```

## Quality Check After Completion

- `visudo -c` should pass
- `systemctl is-enabled chronyd` should report enabled
- `findmnt /webcontent` should show the mount
- `lvs` should show the LV at the extended size
- `firewall-cmd --list-services` should include `ssh` and `http`
- hostname and local resolution should work
- `curl http://localhost:8080` should return the container page after reboot

## Common Failure Points

- forgetting to append group membership
- forgetting executable bit on the script
- building the LV but not the filesystem
- extending the LV but not resizing ext4
- adding firewall rules without permanence
- fixing Unix permissions when the real issue is SELinux context
