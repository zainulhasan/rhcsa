# RHCSA Command Reference Cheat Sheet

This is a fast command reference for revision. It is not a replacement for the lesson files. Use it when you need to remember:

- what a command does
- when to use it
- what the common parameters mean
- what a practical example looks like

## How To Read This Sheet

- Uppercase words like `FILE`, `USER`, `HOST`, and `DEVICE` are placeholders.
- Commands shown with `sudo` normally need root privileges.
- Examples are written in RHEL-style command-line form.
- For exam prep, do not just read these. Type them.

## Placeholder Legend

| Placeholder | Meaning |
|---|---|
| `FILE` | A file path such as `/etc/hosts` |
| `DIR` | A directory path such as `/var/log` |
| `USER` | A username such as `student` |
| `GROUP` | A group name such as `admins` |
| `HOST` | A hostname such as `serverb` |
| `DEVICE` | A block device such as `/dev/vdb1` |
| `VG` | A volume group such as `vgdata` |
| `LV` | A logical volume such as `lvfiles` |
| `MOUNTPOINT` | A path such as `/data` |
| `SERVICE` | A systemd unit such as `sshd` |

## Shell and Offline Help

| Command | What it does | Example with parameters |
|---|---|---|
| `pwd` | Shows your current directory | `pwd` |
| `ls` | Lists directory contents | `ls -la /etc` |
| `cd` | Changes directory | `cd /var/log` |
| `whoami` | Shows current user | `whoami` |
| `id` | Shows user and group identity | `id USER` |
| `hostname` | Shows host name | `hostname` |
| `history` | Shows command history | `history` |
| `clear` | Clears terminal screen | `clear` |
| `reset` | Resets a broken terminal | `reset` |
| `man COMMAND` | Opens manual page | `man ls` |
| `info COMMAND` | Opens GNU info docs | `info grep` |
| `COMMAND --help` | Shows quick option help | `grep --help` |
| `help BUILTIN` | Shows shell builtin help | `help cd` |
| `type NAME` | Shows what a command really is | `type cd` |
| `which COMMAND` | Shows command path | `which ls` |
| `command -v NAME` | Shows how shell resolves a command | `command -v cd` |
| `whatis COMMAND` | Shows one-line manual summary | `whatis passwd` |
| `apropos KEYWORD` | Searches manuals by keyword | `apropos password` |
| `man -k KEYWORD` | Same idea as `apropos` | `man -k directory` |

## Files, Directories, and Text Viewing

| Command | What it does | Example with parameters |
|---|---|---|
| `touch FILE` | Creates empty file if missing | `touch notes.txt` |
| `mkdir DIR` | Creates a directory | `mkdir projects` |
| `mkdir -p DIR` | Creates parent directories too | `mkdir -p lab/a/b` |
| `rmdir DIR` | Removes empty directory | `rmdir emptydir` |
| `cp SRC DST` | Copies file | `cp file1 file1.bak` |
| `cp -r SRC DST` | Copies directory recursively | `cp -r configs configs.bak` |
| `cp -a SRC DST` | Copies while preserving more attributes | `cp -a /etc/ssh ssh-backup` |
| `mv SRC DST` | Moves or renames | `mv oldname newname` |
| `rm FILE` | Removes file | `rm old.txt` |
| `rm -r DIR` | Removes directory recursively | `rm -r olddir` |
| `cat FILE` | Displays file contents | `cat /etc/hostname` |
| `less FILE` | Views long file one screen at a time | `less /var/log/messages` |
| `head FILE` | Shows first lines | `head -n 5 /etc/passwd` |
| `tail FILE` | Shows last lines | `tail -n 20 /var/log/messages` |
| `wc -l FILE` | Counts lines | `wc -l users.txt` |
| `file FILE` | Identifies file type | `file /etc/passwd` |
| `stat FILE` | Shows detailed file metadata | `stat /etc/hosts` |

## Redirection, Pipes, Search, and Text Processing

| Command | What it does | Example with parameters |
|---|---|---|
| `>` | Overwrites stdout to a file | `echo hello > file.txt` |
| `>>` | Appends stdout to a file | `echo hello >> file.txt` |
| `2>` | Redirects stderr to a file | `ls /bad 2> errors.txt` |
| `|` | Sends stdout to next command | `cat /etc/passwd | grep root` |
| `tee FILE` | Saves and displays output | `grep root /etc/passwd | tee roots.txt` |
| `grep TEXT FILE` | Searches for text | `grep root /etc/passwd` |
| `grep -i TEXT FILE` | Ignores case | `grep -i root users.txt` |
| `grep -n TEXT FILE` | Shows line numbers | `grep -n ssh /etc/services` |
| `grep -v PATTERN FILE` | Shows non-matching lines | `grep -v '^#' file.conf` |
| `grep -E REGEX FILE` | Uses extended regex | `grep -E 'bash$|nologin$' /etc/passwd` |
| `sort FILE` | Sorts lines | `sort names.txt` |
| `uniq FILE` | Removes adjacent duplicates | `sort names.txt | uniq` |
| `cut` | Extracts fields or characters | `cut -d: -f1 /etc/passwd` |

### Useful Regex Patterns

| Pattern | Meaning | Example |
|---|---|---|
| `^root` | line starts with `root` | `grep '^root' /etc/passwd` |
| `bash$` | line ends with `bash` | `grep 'bash$' /etc/passwd` |
| `.` | any one character | `grep 'r..t' file.txt` |
| `.*` | zero or more characters | `grep 'root.*bash' file.txt` |
| `[0-9]` | one digit | `grep '[0-9]' file.txt` |
| `[^#]` | one non-`#` character | `grep '^[^#]' file.conf` |

## Archives and Compression

| Command | What it does | Example with parameters |
|---|---|---|
| `tar -cvf ARCHIVE TARPATH` | Creates tar archive | `tar -cvf configs.tar configs/` |
| `tar -xvf ARCHIVE` | Extracts tar archive | `tar -xvf configs.tar` |
| `tar -tvf ARCHIVE` | Lists archive contents | `tar -tvf configs.tar` |
| `tar -czvf ARCHIVE DIR` | Creates gzip-compressed tar archive | `tar -czvf data.tar.gz data/` |
| `tar -cjvf ARCHIVE DIR` | Creates bzip2-compressed tar archive | `tar -cjvf data.tar.bz2 data/` |
| `tar -xvf ARCHIVE -C DIR` | Extracts into target directory | `tar -xvf data.tar -C restore/` |
| `gzip FILE` | Compresses a file | `gzip report.log` |
| `gunzip FILE.gz` | Uncompresses gzip file | `gunzip report.log.gz` |
| `bzip2 FILE` | Compresses a file with bzip2 | `bzip2 report.log` |
| `bunzip2 FILE.bz2` | Uncompresses bzip2 file | `bunzip2 report.log.bz2` |

## SSH and Secure File Transfer

| Command | What it does | Example with parameters |
|---|---|---|
| `ssh USER@HOST` | Opens remote shell session | `ssh student@serverb` |
| `ssh USER@HOST 'COMMAND'` | Runs one remote command | `ssh student@serverb 'hostname; whoami'` |
| `scp FILE USER@HOST:DIR` | Copies local file to remote host | `scp notes.txt student@serverb:/tmp/` |
| `scp USER@HOST:FILE DIR` | Copies remote file locally | `scp student@serverb:/etc/hosts .` |
| `scp -r DIR USER@HOST:DIR` | Copies directories recursively | `scp -r lab student@serverb:/tmp/` |
| `sftp USER@HOST` | Starts interactive file transfer session | `sftp student@serverb` |
| `ssh-copy-id USER@HOST` | Installs your public key for SSH login | `ssh-copy-id student@serverb` |

## Switching Users and Privilege

| Command | What it does | Example with parameters |
|---|---|---|
| `sudo COMMAND` | Runs one command with elevated privileges | `sudo systemctl restart sshd` |
| `su -` | Switches to root login shell | `su -` |
| `exit` | Leaves current shell or remote session | `exit` |

## Links and Permissions

| Command | What it does | Example with parameters |
|---|---|---|
| `ln TARGET LINK` | Creates hard link | `ln report.txt report.hard` |
| `ln -s TARGET LINK` | Creates symbolic link | `ln -s report.txt report.soft` |
| `chmod MODE FILE` | Changes permissions numerically | `chmod 644 file.txt` |
| `chmod u+x FILE` | Adds execute permission to user | `chmod u+x script.sh` |
| `chmod g-w FILE` | Removes group write permission | `chmod g-w shared.txt` |
| `chmod o-r FILE` | Removes others read permission | `chmod o-r secret.txt` |
| `umask` | Shows current default permission mask | `umask` |
| `umask -S` | Shows symbolic mask | `umask -S` |

### Common Numeric Modes

| Mode | Meaning | Common use |
|---|---|---|
| `644` | owner `rw`, group `r`, others `r` | normal text file |
| `600` | owner `rw`, no access for others | private file |
| `755` | owner `rwx`, others `rx` | script or executable |
| `700` | owner `rwx`, others none | private directory |
| `775` | owner/group `rwx`, others `rx` | shared directory |

## Software Management

| Command | What it does | Example with parameters |
|---|---|---|
| `dnf repolist` | Lists enabled repositories | `sudo dnf repolist` |
| `dnf repolist all` | Lists all repos including disabled | `sudo dnf repolist all` |
| `dnf search TEXT` | Searches for package names/descriptions | `dnf search nginx` |
| `dnf install PKG` | Installs a package | `sudo dnf install tree` |
| `dnf remove PKG` | Removes a package | `sudo dnf remove tree` |
| `dnf install ./FILE.rpm` | Installs a local RPM with dependency handling | `sudo dnf install ./pkg.rpm` |
| `dnf info PKG` | Shows package details | `dnf info bash` |
| `rpm -q PKG` | Queries installed package | `rpm -q bash` |
| `rpm -qa` | Lists installed packages | `rpm -qa | head` |
| `rpm -qi PKG` | Shows installed package info | `rpm -qi bash` |
| `rpm -qf FILE` | Shows package owning a file | `rpm -qf /bin/ls` |
| `flatpak remotes` | Lists Flatpak remotes | `flatpak remotes` |
| `flatpak remote-add --if-not-exists NAME URL` | Adds Flatpak remote | `flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo` |
| `flatpak install REMOTE APPID` | Installs Flatpak app | `flatpak install flathub org.gnome.gedit` |
| `flatpak uninstall APPID` | Removes Flatpak app | `flatpak uninstall org.gnome.gedit` |

## Scripting Basics

| Command or Pattern | What it does | Example with parameters |
|---|---|---|
| `#!/bin/bash` | Shebang for Bash scripts | first line of script |
| `chmod +x FILE` | Makes script executable | `chmod +x script.sh` |
| `$1`, `$2` | First and second script arguments | `echo "$1"` |
| `$#` | Number of arguments | `echo "$#"` |
| `if [ CONDITION ]; then ... fi` | Conditional execution | `if [ -f /etc/hosts ]; then echo ok; fi` |
| `for ITEM in LIST; do ... done` | Loops over items | `for f in "$@"; do echo "$f"; done` |
| `$(COMMAND)` | Uses command output inside a script | `today=$(date +%F)` |
| `id USER >/dev/null 2>&1` | Checks whether a user exists silently | `if id "$1" >/dev/null 2>&1; then echo exists; fi` |

## Boot, Targets, Processes, and Logs

| Command | What it does | Example with parameters |
|---|---|---|
| `systemctl reboot` | Reboots system | `sudo systemctl reboot` |
| `systemctl poweroff` | Shuts down system | `sudo systemctl poweroff` |
| `shutdown -r now` | Reboots immediately | `sudo shutdown -r now` |
| `systemctl get-default` | Shows default target | `systemctl get-default` |
| `systemctl set-default TARGET` | Sets default boot target | `sudo systemctl set-default multi-user.target` |
| `systemctl isolate TARGET` | Switches to target now | `sudo systemctl isolate rescue.target` |
| `ps aux` | Lists processes | `ps aux | head` |
| `ps -ef` | Alternative process list | `ps -ef | grep sshd` |
| `top` | Interactive process viewer | `top` |
| `kill PID` | Sends default terminate signal | `kill 1234` |
| `kill -9 PID` | Force kills process | `kill -9 1234` |
| `pkill NAME` | Kills by process name pattern | `pkill sleep` |
| `nice -n N COMMAND` | Starts command with given priority | `nice -n 10 command` |
| `renice N -p PID` | Changes priority of running process | `sudo renice 5 -p 1234` |
| `journalctl` | Shows journal logs | `journalctl` |
| `journalctl -b` | Shows current boot logs | `journalctl -b` |
| `journalctl -u SERVICE` | Shows one service's logs | `journalctl -u sshd` |
| `journalctl -p err -b` | Shows current boot error logs | `journalctl -p err -b` |
| `tuned-adm list` | Lists tuning profiles | `tuned-adm list` |
| `tuned-adm active` | Shows active tuning profile | `sudo tuned-adm active` |
| `tuned-adm profile NAME` | Sets tuning profile | `sudo tuned-adm profile balanced` |

## Storage, Partitions, LVM, and Swap

| Command | What it does | Example with parameters |
|---|---|---|
| `lsblk` | Lists block devices and layout | `lsblk` |
| `blkid` | Shows UUIDs and filesystem info | `blkid` |
| `parted DEVICE` | Opens interactive partition editor | `sudo parted /dev/vdb` |
| `pvcreate DEVICE` | Creates physical volume | `sudo pvcreate /dev/vdb1` |
| `pvs` | Lists physical volumes | `pvs` |
| `vgcreate VG DEVICE` | Creates volume group | `sudo vgcreate vgdata /dev/vdb1` |
| `vgs` | Lists volume groups | `vgs` |
| `lvcreate -n LV -L SIZE VG` | Creates logical volume | `sudo lvcreate -n lvdata -L 500M vgdata` |
| `lvs` | Lists logical volumes | `lvs` |
| `lvextend -L +SIZE LVPATH` | Extends logical volume | `sudo lvextend -L +200M /dev/vgdata/lvdata` |
| `lvremove LVPATH` | Removes logical volume | `sudo lvremove /dev/vgdata/lvdata` |
| `vgremove VG` | Removes volume group | `sudo vgremove vgdata` |
| `pvremove DEVICE` | Removes physical volume metadata | `sudo pvremove /dev/vdb1` |
| `mkswap DEVICE` | Creates swap area | `sudo mkswap /dev/vdb2` |
| `swapon DEVICE` | Activates swap now | `sudo swapon /dev/vdb2` |
| `swapoff DEVICE` | Deactivates swap | `sudo swapoff /dev/vdb2` |
| `swapon --show` | Shows active swap devices | `swapon --show` |
| `free -h` | Shows memory and swap usage | `free -h` |

## Filesystems, Mounts, NFS, and autofs

| Command | What it does | Example with parameters |
|---|---|---|
| `mkfs.xfs DEVICE` | Creates XFS filesystem | `sudo mkfs.xfs /dev/vgdata/lvfiles` |
| `mkfs.ext4 DEVICE` | Creates ext4 filesystem | `sudo mkfs.ext4 /dev/vdb1` |
| `mkfs.vfat DEVICE` | Creates VFAT filesystem | `sudo mkfs.vfat /dev/vdb2` |
| `mount DEVICE MOUNTPOINT` | Mounts filesystem now | `sudo mount /dev/vgdata/lvfiles /data` |
| `umount MOUNTPOINT` | Unmounts filesystem | `sudo umount /data` |
| `findmnt MOUNTPOINT` | Shows mount information | `findmnt /data` |
| `lsblk -f` | Shows devices with filesystem details | `lsblk -f` |
| `mount -a` | Tests `/etc/fstab` mounts | `sudo mount -a` |
| `xfs_growfs MOUNTPOINT` | Grows mounted XFS filesystem | `sudo xfs_growfs /data` |
| `resize2fs DEVICE` | Grows ext filesystem | `sudo resize2fs /dev/vgdata/lvfiles` |
| `exportfs -rav` | Re-exports NFS exports | `sudo exportfs -rav` |
| `showmount -e HOST` | Lists NFS exports from server | `showmount -e servera` |
| `systemctl enable --now nfs-server` | Starts and enables NFS server | `sudo systemctl enable --now nfs-server` |
| `systemctl enable --now autofs` | Starts and enables autofs | `sudo systemctl enable --now autofs` |

## Scheduling, Time, and Bootloader

| Command | What it does | Example with parameters |
|---|---|---|
| `at` | Schedules one-time job | `echo "date > /tmp/out.txt" | at now + 2 minutes` |
| `atq` | Lists queued `at` jobs | `atq` |
| `atrm JOBID` | Removes queued `at` job | `atrm 3` |
| `crontab -e` | Edits current user's cron jobs | `crontab -e` |
| `crontab -l` | Lists current user's cron jobs | `crontab -l` |
| `systemctl list-timers` | Lists timer units | `systemctl list-timers` |
| `timedatectl` | Shows time and sync status | `timedatectl` |
| `chronyc sources` | Shows time sources | `chronyc sources` |
| `chronyc tracking` | Shows sync tracking details | `chronyc tracking` |
| `grubby --info=ALL` | Shows bootloader/kernel entry info | `sudo grubby --info=ALL` |
| `grubby --default-kernel` | Shows current default kernel | `sudo grubby --default-kernel` |
| `grubby --update-kernel=ALL --args="ARG"` | Adds kernel argument | `sudo grubby --update-kernel=ALL --args="quiet"` |
| `grubby --update-kernel=ALL --remove-args="ARG"` | Removes kernel argument | `sudo grubby --update-kernel=ALL --remove-args="quiet"` |

## Networking and firewalld

| Command | What it does | Example with parameters |
|---|---|---|
| `ip addr` | Shows IP addresses | `ip addr` |
| `ip route` | Shows routing table | `ip route` |
| `nmcli connection show` | Lists NetworkManager profiles | `nmcli connection show` |
| `nmcli connection modify NAME KEY VALUE` | Changes connection setting | `sudo nmcli connection modify eth0 ipv4.addresses 192.168.122.50/24` |
| `nmcli connection up NAME` | Brings connection up | `sudo nmcli connection up eth0` |
| `hostnamectl set-hostname NAME` | Sets system hostname | `sudo hostnamectl set-hostname servera.lab.example` |
| `getent hosts NAME` | Tests hostname resolution | `getent hosts servera.lab.example` |
| `ss -tuln` | Shows listening TCP and UDP sockets | `ss -tuln` |
| `firewall-cmd --list-all` | Shows zone details and allowed rules | `sudo firewall-cmd --list-all` |
| `firewall-cmd --get-active-zones` | Shows active zones | `sudo firewall-cmd --get-active-zones` |
| `firewall-cmd --add-service=NAME --permanent` | Permanently allows named service | `sudo firewall-cmd --add-service=http --permanent` |
| `firewall-cmd --add-port=PORT/proto --permanent` | Permanently allows custom port | `sudo firewall-cmd --add-port=8080/tcp --permanent` |
| `firewall-cmd --reload` | Reloads firewalld | `sudo firewall-cmd --reload` |

## Users, Groups, Passwords, and Sudo

| Command | What it does | Example with parameters |
|---|---|---|
| `useradd USER` | Creates user | `sudo useradd -m alice` |
| `usermod -aG GROUP USER` | Adds user to supplementary group | `sudo usermod -aG admins alice` |
| `userdel USER` | Deletes user, keeps home by default | `sudo userdel alice` |
| `userdel -r USER` | Deletes user and home directory | `sudo userdel -r alice` |
| `groupadd GROUP` | Creates group | `sudo groupadd admins` |
| `groupdel GROUP` | Deletes group | `sudo groupdel admins` |
| `passwd USER` | Sets or changes password | `sudo passwd alice` |
| `chage -l USER` | Lists password aging | `sudo chage -l alice` |
| `chage -M DAYS -m DAYS -W DAYS USER` | Sets password aging values | `sudo chage -M 90 -m 7 -W 14 alice` |
| `groups USER` | Shows user's groups | `groups alice` |
| `visudo` | Safely edits sudoers | `sudo visudo` |
| `visudo -c` | Checks sudoers syntax | `sudo visudo -c` |

## SELinux and SSH Keys

| Command | What it does | Example with parameters |
|---|---|---|
| `getenforce` | Shows SELinux mode quickly | `getenforce` |
| `sestatus` | Shows detailed SELinux status | `sestatus` |
| `setenforce 0` | Sets permissive mode now | `sudo setenforce 0` |
| `setenforce 1` | Sets enforcing mode now | `sudo setenforce 1` |
| `ls -Z PATH` | Shows file contexts | `ls -Z /var/www/html` |
| `ps -eZ` | Shows process contexts | `ps -eZ | grep sshd` |
| `restorecon -Rv PATH` | Restores default contexts recursively | `sudo restorecon -Rv /var/www/html` |
| `getsebool -a` | Lists booleans | `getsebool -a | grep httpd` |
| `setsebool -P BOOLEAN on` | Sets boolean persistently | `sudo setsebool -P httpd_can_network_connect on` |
| `semanage port -l` | Lists SELinux port labels | `sudo semanage port -l | grep http` |
| `semanage port -a -t TYPE -p proto PORT` | Adds SELinux port label | `sudo semanage port -a -t http_port_t -p tcp 8080` |
| `ssh-keygen` | Creates SSH key pair | `ssh-keygen` |
| `ssh-copy-id USER@HOST` | Installs public key remotely | `ssh-copy-id student@serverb` |

## Verification Commands You Should Use Constantly

| Command | Best use |
|---|---|
| `id USER` | prove user/group changes |
| `rpm -q PKG` | prove package installation |
| `systemctl is-active SERVICE` | prove service runs now |
| `systemctl is-enabled SERVICE` | prove service starts at boot |
| `findmnt MOUNTPOINT` | prove mount exists now |
| `grep MOUNTPOINT /etc/fstab` | prove mount persistence config |
| `mount -a` | test fstab without reboot |
| `swapon --show` | prove swap is active |
| `firewall-cmd --list-all` | prove firewall rules are loaded |
| `getenforce` | prove SELinux runtime mode |
| `ls -Z PATH` | prove SELinux file labels |
| `journalctl -u SERVICE -b` | inspect current boot logs for a service |
| `getent hosts HOST` | prove name resolution |

## Exam Habits for Using This Sheet

1. Identify the task type first: package, service, mount, user, network, SELinux, or storage.
2. Find the command family in this sheet.
3. Adapt the example with the real task values.
4. Run the command.
5. Use one verification command immediately.
6. If persistence matters, reboot and verify again.
