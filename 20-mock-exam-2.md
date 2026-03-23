# Mock Exam 2

## Instructions

- Time limit: 3 hours
- Work from the command line
- Use local help only
- Build in your own verification steps
- Reboot near the end to prove persistence

## Tasks

1. Create local group `webops` and local user `webadmin`, then add the user to the group.
2. Configure a sudoers drop-in so members of `webops` can run administrative commands.
3. Create `/opt/webdata` and ensure only owner and group can write to it.
4. Create `/opt/webdata/index.html` containing a short test page.
5. Archive `/opt/webdata` into `/tmp/webdata.tar.gz`.
6. Create `/usr/local/bin/filecheck.sh` that accepts one or more file paths and prints whether each is a regular file.
7. Configure `chronyd` to be active now and enabled at boot.
8. View current boot logs for `sshd` and save the last 20 lines to `/tmp/sshd-boot.log`.
9. Configure an interface or connection profile with the network settings required by your lab.
10. Set the hostname to `web1.lab.example`.
11. Ensure hostname resolution for `web1.lab.example` works locally.
12. Configure firewalld to allow SSH and HTTP permanently.
13. On a spare disk, create a volume group `vgweb` and logical volume `lvcontent` of 700M.
14. Create an ext4 filesystem on that LV, mount it at `/webcontent`, and make it persistent by UUID.
15. Extend `lvcontent` by 100M and grow the ext4 filesystem.
16. Configure a simple NFS export or client mount according to your lab setup. If your lab supports it, configure autofs for on-demand access.
17. Configure SSH key-based authentication for `webadmin`.
18. Use SELinux tools to ensure the content path for a web-related directory has the correct context for its purpose.
19. Reboot and verify persistent storage, networking, service, firewall, and security settings.

## Grader Mindset Checklist

- account and sudo configuration must be correct
- archive file must exist and be readable
- script must execute correctly
- `chronyd` must be active and enabled
- log file must contain recent `sshd` boot messages
- hostname and name resolution must work
- firewall rules must persist
- LV must exist at the right size before and after extension
- ext4 filesystem must be mounted and persistent
- NFS or autofs task must function as requested
- SSH key login must work
- SELinux labeling must be correct

## Suggested Proof Commands

```bash
id webadmin
visudo -c
tar -tvf /tmp/webdata.tar.gz
/usr/local/bin/filecheck.sh /etc/hosts /nope
systemctl is-enabled chronyd
journalctl -u sshd -b | tail
hostnamectl
getent hosts web1.lab.example
firewall-cmd --list-services
lvs
findmnt /webcontent
ssh -o PreferredAuthentications=publickey webadmin@serverb hostname
ls -Z /var/www/html
```
