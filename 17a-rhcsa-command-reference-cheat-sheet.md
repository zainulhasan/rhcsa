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

## RHCSA Objective Study Path

Use this sheet in the same order you would build exam muscle memory:

1. Essential tools
2. Software management
3. Shell scripting
4. Running systems
5. Local storage
6. Filesystems and mounts
7. Scheduling, services, time, and boot behavior
8. Networking
9. Users and groups
10. Security
11. Containers and advanced systemd work if your exam version expects it

---

## Core: Essential Tools

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

!!! info "High-Value Help Commands"
    Use `apropos` and `man -k` when you know the topic but not the exact command name.
    Use `type`, `help`, and `command -v` when you are not sure whether something is a shell builtin or a normal command.

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
| `sed` | Edits or prints text streams | `sed -n '1,5p' file.txt` |
| `awk` | Processes structured text by fields and patterns | `awk -F: '{print $1}' /etc/passwd` |

### Useful Regex Patterns

| Pattern | Meaning | Example |
|---|---|---|
| `^root` | line starts with `root` | `grep '^root' /etc/passwd` |
| `bash$` | line ends with `bash` | `grep 'bash$' /etc/passwd` |
| `.` | any one character | `grep 'r..t' file.txt` |
| `.*` | zero or more characters | `grep 'root.*bash' file.txt` |
| `[0-9]` | one digit | `grep '[0-9]' file.txt` |
| `[^#]` | one non-`#` character | `grep '^[^#]' file.conf` |

### sed and awk Quick Patterns

| Task | Command |
|---|---|
| Print lines 1 to 5 | `sed -n '1,5p' FILE` |
| Replace first match on each line | `sed 's/old/new/' FILE` |
| Replace globally on each line | `sed 's/old/new/g' FILE` |
| Print first field from colon-separated file | `awk -F: '{print $1}' FILE` |
| Print fields 1 and 7 when line matches | `awk -F: '/bash$/ {print $1, $7}' FILE` |

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

### Common Tar and Gzip Patterns

| Task | Command |
|---|---|
| Create plain tar archive | `tar -cvf backup.tar DIR/` |
| Create tar gzip archive | `tar -czvf backup.tar.gz DIR/` |
| Extract tar gzip archive | `tar -xzvf backup.tar.gz` |
| List tar gzip archive contents | `tar -tzvf backup.tar.gz` |

### Essential Tools Muscle Memory Drill

| Goal | Fast command flow |
|---|---|
| Find help when stuck | `apropos KEYWORD` -> `man COMMAND` -> `COMMAND --help` |
| Create and inspect files | `touch FILE` -> `ls -l FILE` -> `cat FILE` |
| Search and filter text | `grep PATTERN FILE` -> `sed ...` -> `awk ...` |
| Save output safely | `COMMAND > FILE` or `COMMAND >> FILE` |
| Archive and verify | `tar -czvf backup.tar.gz DIR` -> `tar -tzvf backup.tar.gz` |

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

### Directory Permission Patterns

| Mode | What it means on a directory | Example |
|---|---|---|
| `r` | can list names in the directory | `chmod u+r DIR` |
| `w` | can create, rename, or remove entries | `chmod g+w DIR` |
| `x` | can enter or traverse the directory | `chmod o+x DIR` |
| `700` | only owner can access it | `chmod 700 private-dir` |
| `755` | owner full, others can read and enter | `chmod 755 webroot` |
| `775` | owner and group full, others read and enter | `chmod 775 shared-dir` |

### Special Permissions

| Command or Mode | What it does | Example with parameters |
|---|---|---|
| `chmod u+s FILE` | Sets setuid bit | `chmod u+s /usr/local/bin/helper` |
| `chmod g+s DIR` | Sets setgid bit on directory | `chmod g+s /srv/projects` |
| `chmod +t DIR` | Sets sticky bit on directory | `chmod +t /shared/tmp` |
| `chmod 4755 FILE` | Numeric setuid example | `chmod 4755 helper` |
| `chmod 2775 DIR` | Numeric setgid directory example | `chmod 2775 /srv/projects` |
| `chmod 1777 DIR` | Numeric sticky directory example | `chmod 1777 /shared/tmp` |

### Special Permission Meaning

| Bit | Meaning | Typical use |
|---|---|---|
| setuid | file runs with owner identity | rare, usually system binaries |
| setgid on dir | new files inherit directory group | shared project directories |
| sticky bit on dir | users cannot delete each other's files unless allowed | `/tmp`-style shared directory |

### Common Numeric Modes

| Mode | Meaning | Common use |
|---|---|---|
| `644` | owner `rw`, group `r`, others `r` | normal text file |
| `600` | owner `rw`, no access for others | private file |
| `755` | owner `rwx`, others `rx` | script or executable |
| `700` | owner `rwx`, others none | private directory |
| `775` | owner/group `rwx`, others `rx` | shared directory |

### Access and Permissions Muscle Memory Drill

| Goal | Fast command flow |
|---|---|
| Reach another host | `ssh USER@HOST` |
| Copy a file | `scp FILE USER@HOST:/tmp/` |
| become root | `sudo COMMAND` or `su -` |
| Share directory by group | `chown :GROUP DIR` -> `chmod 2775 DIR` |
| Protect private content | `chmod 700 DIR` or `chmod 600 FILE` |

---

## Core: Manage Software

## Software Management

| Command | What it does | Example with parameters |
|---|---|---|
| `dnf repolist` | Lists enabled repositories | `sudo dnf repolist` |
| `dnf repolist all` | Lists all repos including disabled | `sudo dnf repolist all` |
| `yum repolist` | Compatibility form on systems where `yum` exists | `sudo yum repolist` |
| `dnf search TEXT` | Searches for package names/descriptions | `dnf search nginx` |
| `dnf install PKG` | Installs a package | `sudo dnf install tree` |
| `dnf remove PKG` | Removes a package | `sudo dnf remove tree` |
| `dnf install ./FILE.rpm` | Installs a local RPM with dependency handling | `sudo dnf install ./pkg.rpm` |
| `dnf info PKG` | Shows package details | `dnf info bash` |
| `rpm -q PKG` | Queries installed package | `rpm -q bash` |
| `rpm -qa` | Lists installed packages | `rpm -qa | head` |
| `rpm -qi PKG` | Shows installed package info | `rpm -qi bash` |
| `rpm -qf FILE` | Shows package owning a file | `rpm -qf /bin/ls` |
| `subscription-manager identity` | Shows registration identity | `sudo subscription-manager identity` |
| `subscription-manager status` | Shows current subscription state | `sudo subscription-manager status` |
| `subscription-manager repos --list-enabled` | Lists enabled CDN repositories | `sudo subscription-manager repos --list-enabled` |
| `subscription-manager refresh` | Refreshes subscription data | `sudo subscription-manager refresh` |
| `flatpak remotes` | Lists Flatpak remotes | `flatpak remotes` |
| `flatpak remote-add --if-not-exists NAME URL` | Adds Flatpak remote | `flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo` |
| `flatpak install REMOTE APPID` | Installs Flatpak app | `flatpak install flathub org.gnome.gedit` |
| `flatpak uninstall APPID` | Removes Flatpak app | `flatpak uninstall org.gnome.gedit` |

### Add a `.repo` File Quickly

| Task | Command or file |
|---|---|
| Repo file location | `/etc/yum.repos.d/custom.repo` |
| Check all repos | `sudo dnf repolist all` |
| Check only enabled repos | `sudo dnf repolist` |

Example file:

```ini
[custom-baseos]
name=Custom BaseOS
baseurl=http://repo.example.com/baseos/
enabled=1
gpgcheck=0
```

### CDN and Repo Verification Pattern

| Goal | Command |
|---|---|
| Check registration identity | `sudo subscription-manager identity` |
| Check subscription state | `sudo subscription-manager status` |
| Compare enabled CDN repos to DNF repos | `sudo subscription-manager repos --list-enabled` then `sudo dnf repolist` |
| Refresh subscription metadata | `sudo subscription-manager refresh` |

### Software Muscle Memory Drill

| Goal | Fast command flow |
|---|---|
| See repos | `dnf repolist` and `dnf repolist all` |
| Add repo | create `/etc/yum.repos.d/custom.repo` -> `dnf repolist` |
| Install package | `dnf install PKG` |
| Verify package | `rpm -q PKG` or `dnf info PKG` |
| Remove package | `dnf remove PKG` |

---

## Core: Create Simple Shell Scripts

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
| `<<<` | Sends one short string as standard input | `grep root <<< "root:x:0:0"` |
| `bc` | Command-line calculator | `bc <<< '2 + 3'` |

### Scripting Muscle Memory Drill

| Goal | Fast command flow |
|---|---|
| Start script | `#!/bin/bash` |
| Accept argument | `$1`, `$2`, `$#` |
| Make decision | `if [ CONDITION ]; then ... fi` |
| Loop through items | `for ITEM in "$@"; do ... done` |
| Quick text or math | `grep ... <<< "text"` and `bc <<< '2 + 3'` |

---

## Core: Operate Running Systems

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
| `mount -o remount,rw /sysroot` | Makes the recovery root writable | `mount -o remount,rw /sysroot` |
| `chroot /sysroot` | Enters the repaired system root | `chroot /sysroot` |
| `touch /.autorelabel` | Forces SELinux relabel on next boot | `touch /.autorelabel` |

### Root Password Reset Pattern

| Step | Command or action |
|---|---|
| Enter recovery boot | `rd.break` or the recovery method documented by your lab |
| Make the repaired root writable | `mount -o remount,rw /sysroot` |
| Enter the repaired system | `chroot /sysroot` |
| Reset root password | `passwd` |
| Prepare SELinux relabel | `touch /.autorelabel` |
| Leave and reboot | `exit` -> `exit` -> reboot |

### Running Systems Muscle Memory Drill

| Goal | Fast command flow |
|---|---|
| Reboot safely | `systemctl reboot` |
| Check target | `systemctl get-default` and `systemctl isolate TARGET` |
| Find heavy process | `top` or `ps aux` |
| Stop bad process | `kill PID` or `pkill NAME` |
| Read service logs | `journalctl -u SERVICE -b` |

---

## Core: Configure Local Storage

## Storage, Partitions, LVM, and Swap

| Command | What it does | Example with parameters |
|---|---|---|
| `lsblk` | Lists block devices and layout | `lsblk` |
| `blkid` | Shows UUIDs and filesystem info | `blkid` |
| `parted DEVICE` | Opens interactive partition editor | `sudo parted /dev/vdb` |
| `mklabel gpt` | Creates GPT partition table inside `parted` | `mklabel gpt` |
| `mkpart primary START END` | Creates partition inside `parted` | `mkpart primary 1MiB 1GiB` |
| `print` | Shows partition layout inside `parted` | `print` |
| `pvcreate DEVICE` | Creates physical volume | `sudo pvcreate /dev/vdb1` |
| `pvs` | Lists physical volumes | `pvs` |
| `vgcreate VG DEVICE` | Creates volume group | `sudo vgcreate vgdata /dev/vdb1` |
| `vgcreate -s SIZE VG DEVICE` | Creates volume group with custom PE size | `sudo vgcreate -s 16M vgi /dev/vdb1` |
| `vgs` | Lists volume groups | `vgs` |
| `lvcreate -n LV -L SIZE VG` | Creates logical volume | `sudo lvcreate -n lvdata -L 500M vgdata` |
| `lvcreate -l EXTENTS -n LV VG` | Creates logical volume by extent count | `sudo lvcreate -l 60 -n lvi vgi` |
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

### LVM Names You Must Recognize

| Term | Meaning | Example |
|---|---|---|
| `PV` | physical volume | `/dev/vdb1` |
| `VG` | volume group | `vgdata` |
| `LV` | logical volume | `lvfiles` |
| `PE` | physical extent in a VG | often `4 MiB` by default |
| `LE` | logical extent in an LV | one LV chunk mapped to a PE |
| LV path | full LV device path | `/dev/vgdata/lvfiles` |

### Storage Muscle Memory Drill

| Goal | Fast command flow |
|---|---|
| Inspect disks | `lsblk` -> `blkid` |
| Create GPT partition | `parted DEVICE` -> `mklabel gpt` -> `mkpart ...` |
| Build LVM | `pvcreate` -> `vgcreate` -> `lvcreate` |
| Add swap | `mkswap DEVICE` -> `swapon DEVICE` |
| Verify | `pvs` `vgs` `lvs` `swapon --show` |

---

## Core: Create and Configure File Systems

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
| `mount -t nfs HOST:PATH MOUNTPOINT` | Mounts NFS share now | `sudo mount -t nfs servera:/share /mnt/share` |
| `umount MOUNTPOINT` | Unmounts NFS share too | `sudo umount /mnt/share` |
| `exportfs -rav` | Re-exports NFS exports | `sudo exportfs -rav` |
| `showmount -e HOST` | Lists NFS exports from server | `showmount -e servera` |
| `systemctl enable --now nfs-server` | Starts and enables NFS server | `sudo systemctl enable --now nfs-server` |
| `systemctl enable --now autofs` | Starts and enables autofs | `sudo systemctl enable --now autofs` |
| `cat /etc/auto.master` | Shows autofs master map | `cat /etc/auto.master` |
| `cat /etc/auto.misc` | Shows a common autofs indirect map | `cat /etc/auto.misc` |

### ext4 and GPT Quick Reminder

| Term | What it means | Example |
|---|---|---|
| `ext4` | common Linux filesystem | `sudo mkfs.ext4 /dev/vdb1` |
| `GPT` | modern partition table format | create with `mklabel gpt` in `parted` |

### autofs Home-Style Mapping Pattern

| Goal | Command or file |
|---|---|
| Add indirect map mountpoint | `echo '/remoteuser /etc/auto.remoteuser' | sudo tee -a /etc/auto.master` |
| Map one user path | `echo 'user20 -rw server:/remoteuser/user20' | sudo tee /etc/auto.remoteuser` |
| Enable autofs | `sudo systemctl enable --now autofs` |
| Trigger the mount | `ls /remoteuser/user20` |
| Verify the result | `mount | grep remoteuser` |

### Filesystems and Mounts Muscle Memory Drill

| Goal | Fast command flow |
|---|---|
| Create filesystem | `mkfs.xfs DEVICE` or `mkfs.ext4 DEVICE` |
| Mount now | `mount DEVICE MOUNTPOINT` |
| Verify mount | `findmnt MOUNTPOINT` |
| Make persistent | add UUID or LABEL to `/etc/fstab` -> `mount -a` |
| NFS check | `showmount -e HOST` -> `mount -t nfs HOST:PATH MOUNTPOINT` |

---

## Core: Deploy, Configure, and Maintain Systems

## Scheduling, Time, and Bootloader

| Command | What it does | Example with parameters |
|---|---|---|
| `at` | Schedules one-time job | `echo "date > /tmp/out.txt" | at now + 2 minutes` |
| `atq` | Lists queued `at` jobs | `atq` |
| `atrm JOBID` | Removes queued `at` job | `atrm 3` |
| `crontab -e` | Edits current user's cron jobs | `crontab -e` |
| `crontab -l` | Lists current user's cron jobs | `crontab -l` |
| `crontab -e -u USER` | Edits another user's cron jobs | `sudo crontab -e -u natasha` |
| `crontab -l -u USER` | Lists another user's cron jobs | `sudo crontab -l -u natasha` |
| `systemctl list-timers` | Lists timer units | `systemctl list-timers` |
| `timedatectl` | Shows time and sync status | `timedatectl` |
| `chronyc sources` | Shows time sources | `chronyc sources` |
| `chronyc tracking` | Shows sync tracking details | `chronyc tracking` |
| `grubby --info=ALL` | Shows bootloader/kernel entry info | `sudo grubby --info=ALL` |
| `grubby --default-kernel` | Shows current default kernel | `sudo grubby --default-kernel` |
| `grubby --update-kernel=ALL --args="ARG"` | Adds kernel argument | `sudo grubby --update-kernel=ALL --args="quiet"` |
| `grubby --update-kernel=ALL --remove-args="ARG"` | Removes kernel argument | `sudo grubby --update-kernel=ALL --remove-args="quiet"` |

### Common Cron Patterns

| Goal | Entry |
|---|---|
| Run every 5 minutes | `*/5 * * * * COMMAND` |
| Run at reboot | `@reboot /bin/bash /usr/local/bin/startup-check.sh` |
| Edit another user's cron | `sudo crontab -e -u natasha` |

### Chrony Client Pattern

| Goal | Command |
|---|---|
| Enable and start client | `sudo systemctl enable --now chronyd` |
| Inspect configured servers | `grep -E '^(server|pool)' /etc/chrony.conf` |
| Restart after edit | `sudo systemctl restart chronyd` |
| Verify sources | `chronyc sources -v` |
| Verify overall state | `chronyc tracking` and `timedatectl` |

### Scheduling, Time, and Bootloader Muscle Memory Drill

| Goal | Fast command flow |
|---|---|
| One-time job | `echo "COMMAND" | at now + 5 minutes` -> `atq` |
| Repeating job | `crontab -e` -> `crontab -l` |
| Check timers | `systemctl list-timers` |
| Check time sync | `timedatectl` -> `chronyc sources` |
| Inspect bootloader | `grubby --info=ALL` -> `grubby --default-kernel` |

## systemd Service and Unit Reference

### Core systemd Commands

| Command | What it does | Example with parameters |
|---|---|---|
| `systemctl status SERVICE` | Shows service state and recent logs | `systemctl status sshd` |
| `systemctl start SERVICE` | Starts service now | `sudo systemctl start httpd` |
| `systemctl stop SERVICE` | Stops service now | `sudo systemctl stop httpd` |
| `systemctl restart SERVICE` | Restarts service | `sudo systemctl restart httpd` |
| `systemctl reload SERVICE` | Reloads config without full restart if supported | `sudo systemctl reload sshd` |
| `systemctl enable SERVICE` | Enables service at boot | `sudo systemctl enable httpd` |
| `systemctl disable SERVICE` | Disables service at boot | `sudo systemctl disable httpd` |
| `systemctl enable --now SERVICE` | Enables at boot and starts now | `sudo systemctl enable --now httpd` |
| `systemctl is-active SERVICE` | Checks current running state | `systemctl is-active httpd` |
| `systemctl is-enabled SERVICE` | Checks boot persistence | `systemctl is-enabled httpd` |
| `systemctl daemon-reload` | Reloads unit files after changes | `sudo systemctl daemon-reload` |
| `systemctl cat SERVICE` | Shows full unit file content | `systemctl cat sshd` |
| `systemctl list-units --type=service` | Lists loaded service units | `systemctl list-units --type=service` |
| `systemctl list-unit-files --type=service` | Lists service files and enabled state | `systemctl list-unit-files --type=service` |
| `journalctl -u SERVICE -b` | Shows current-boot logs for a service | `journalctl -u httpd -b` |

### Common Unit File Locations

| Path | What it is for |
|---|---|
| `/usr/lib/systemd/system/` | package-provided unit files |
| `/etc/systemd/system/` | administrator overrides and custom units |
| `/etc/systemd/system/multi-user.target.wants/` | symlinks showing enabled units |

!!! warning "High-Value systemd Commands"
    Be fast with `enable --now`, `daemon-reload`, `is-active`, `is-enabled`, `status`, and `journalctl -u`.
    These commands prove both current behavior and reboot persistence.

### Custom systemd Service Unit Example

Use this pattern when you need to create your own service:

```ini
[Unit]
Description=Simple custom report service
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/report.sh
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Typical workflow:

1. Create the script such as `/usr/local/bin/report.sh`
2. Make it executable with `chmod +x /usr/local/bin/report.sh`
3. Save the unit as `/etc/systemd/system/report.service`
4. Run `sudo systemctl daemon-reload`
5. Run `sudo systemctl enable --now report.service`
6. Verify with `systemctl status report.service`
7. Verify logs with `journalctl -u report.service -b`

### Custom systemd Timer Reminder

| File | Purpose |
|---|---|
| `name.service` | the job that actually runs |
| `name.timer` | the schedule that triggers it |

Example timer schedule section:

```ini
[Timer]
OnCalendar=*-*-* *:00:00
Persistent=true
```

Meaning:

- run every hour on the hour
- if the system was down, run missed jobs after boot

### Fast systemd Verification Pattern

| Task | Command |
|---|---|
| Prove service runs now | `systemctl is-active SERVICE` |
| Prove service starts at boot | `systemctl is-enabled SERVICE` |
| Prove config was read | `systemctl status SERVICE` |
| Prove logs are clean | `journalctl -u SERVICE -b` |
| Prove unit file content | `systemctl cat SERVICE` |

### systemd Muscle Memory Drill

| Goal | Fast command flow |
|---|---|
| Start and enable service | `systemctl enable --now SERVICE` |
| Verify current state | `systemctl is-active SERVICE` |
| Verify boot persistence | `systemctl is-enabled SERVICE` |
| Reload unit changes | `systemctl daemon-reload` |
| Debug failures | `systemctl status SERVICE` -> `journalctl -u SERVICE -b` |

---

## Core: Manage Basic Networking

## Networking and firewalld

| Command | What it does | Example with parameters |
|---|---|---|
| `ip addr` | Shows IP addresses | `ip addr` |
| `ip route` | Shows routing table | `ip route` |
| `ping HOST` | Tests basic network reachability | `ping -c 4 serverb` |
| `nmcli connection show` | Lists NetworkManager profiles | `nmcli connection show` |
| `nmcli connection modify NAME KEY VALUE` | Changes connection setting | `sudo nmcli connection modify eth0 ipv4.addresses 192.168.122.50/24` |
| `nmcli connection modify NAME ipv4.method manual` | Sets static IPv4 mode | `sudo nmcli connection modify eth0 ipv4.method manual` |
| `nmcli connection modify NAME ipv4.gateway GW` | Sets IPv4 gateway | `sudo nmcli connection modify eth0 ipv4.gateway 192.168.122.1` |
| `nmcli connection modify NAME ipv4.dns DNS` | Sets DNS server | `sudo nmcli connection modify eth0 ipv4.dns 8.8.8.8` |
| `nmcli connection up NAME` | Brings connection up | `sudo nmcli connection up eth0` |
| `hostnamectl set-hostname NAME` | Sets system hostname | `sudo hostnamectl set-hostname servera.lab.example` |
| `getent hosts NAME` | Tests hostname resolution | `getent hosts servera.lab.example` |
| `ss -tuln` | Shows listening TCP and UDP sockets | `ss -tuln` |
| `firewall-cmd --list-all` | Shows zone details and allowed rules | `sudo firewall-cmd --list-all` |
| `firewall-cmd --get-active-zones` | Shows active zones | `sudo firewall-cmd --get-active-zones` |
| `firewall-cmd --add-service=NAME --permanent` | Permanently allows named service | `sudo firewall-cmd --add-service=http --permanent` |
| `firewall-cmd --add-port=PORT/proto --permanent` | Permanently allows custom port | `sudo firewall-cmd --add-port=8080/tcp --permanent` |
| `firewall-cmd --reload` | Reloads firewalld | `sudo firewall-cmd --reload` |

### Networking Muscle Memory Drill

| Goal | Fast command flow |
|---|---|
| Check address | `ip addr` and `ip route` |
| Change connection | `nmcli connection modify ...` -> `nmcli connection up NAME` |
| Set hostname | `hostnamectl set-hostname NAME` |
| Test resolution | `getent hosts NAME` |
| Open firewall | `firewall-cmd --add-service=NAME --permanent` -> `firewall-cmd --reload` |

---

## Core: Manage Users and Groups

## Users, Groups, Passwords, and Sudo

| Command | What it does | Example with parameters |
|---|---|---|
| `useradd USER` | Creates user with system defaults | `sudo useradd alice` |
| `useradd -m USER` | Creates user and home directory | `sudo useradd -m alice` |
| `useradd -M USER` | Creates user without home directory | `sudo useradd -M svcbackup` |
| `useradd -d DIR USER` | Sets custom home directory path | `sudo useradd -d /srv/alice alice` |
| `useradd -m -d DIR USER` | Creates user with custom home directory | `sudo useradd -m -d /srv/alice alice` |
| `useradd -s SHELL USER` | Sets login shell | `sudo useradd -m -s /bin/bash alice` |
| `usermod -aG GROUP USER` | Adds user to supplementary group | `sudo usermod -aG admins alice` |
| `usermod -d DIR USER` | Changes home directory path setting | `sudo usermod -d /srv/alice alice` |
| `usermod -d DIR -m USER` | Moves user content to new home | `sudo usermod -d /srv/alice -m alice` |
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

### User Home Directory Patterns

| Task | Command |
|---|---|
| Create user with default home | `sudo useradd -m USER` |
| Create user without home | `sudo useradd -M USER` |
| Create user with custom home | `sudo useradd -m -d /custom/home USER` |
| Move an existing user to a new home | `sudo usermod -d /custom/home -m USER` |
| Create non-login account | `sudo useradd -s /sbin/nologin USER` |

### Users and Groups Muscle Memory Drill

| Goal | Fast command flow |
|---|---|
| Create user | `useradd -m USER` |
| Create custom home | `useradd -m -d /custom/home USER` |
| Add to group | `usermod -aG GROUP USER` |
| Set password policy | `passwd USER` -> `chage -l USER` |
| Grant sudo | `visudo` or sudoers drop-in -> `visudo -c` |

---

## Core: Manage Security

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
| `semanage port -m -t TYPE -p proto PORT` | Modifies existing port label | `sudo semanage port -m -t http_port_t -p tcp 85` |
| `semanage port -d -t TYPE -p proto PORT` | Deletes port label | `sudo semanage port -d -t http_port_t -p tcp 8080` |
| `ssh-keygen` | Creates SSH key pair | `ssh-keygen` |
| `ssh-copy-id USER@HOST` | Installs public key remotely | `ssh-copy-id student@serverb` |

### HTTPD on Custom Port 85 with SELinux and firewalld

Use this pattern when Apache should listen on `85/tcp` and SELinux plus firewall must both allow it.

| Step | Command | What it does |
|---|---|---|
| 1 | `sudo semanage port -a -t http_port_t -p tcp 85` | allows SELinux to treat port 85 as an HTTP port |
| 2 | `sudo firewall-cmd --add-port=85/tcp --permanent` | opens port 85 permanently in firewalld |
| 3 | `sudo firewall-cmd --reload` | loads the permanent firewall change |
| 4 | `sudo ss -tuln | grep :85` | verifies a service is listening on port 85 |
| 5 | `sudo semanage port -l | grep http_port_t` | verifies SELinux port mapping |
| 6 | `sudo firewall-cmd --list-ports` | verifies firewall allows the port |

Example service-side config reminder:

- if `httpd` should actually use port `85`, the Apache config must also be changed to listen on `85`
- SELinux and firewalld do not make the service listen by themselves

### HTTPD on Custom Port and DocumentRoot Pattern

| Goal | Command |
|---|---|
| Change listening port | edit `/etc/httpd/conf/httpd.conf` and set `Listen 93` |
| Label new SELinux port | `sudo semanage port -a -t http_port_t -p tcp 93` |
| Label custom content root | `sudo semanage fcontext -a -t httpd_sys_content_t '/tekup/html(/.*)?'` |
| Apply labels | `sudo restorecon -Rv /tekup/html` |
| Open firewall | `sudo firewall-cmd --add-port=93/tcp --permanent` then `sudo firewall-cmd --reload` |
| Verify locally | `curl http://localhost:93/` |

### SELinux Runtime and Boot Reminder

| Task | Command |
|---|---|
| Check runtime mode | `getenforce` |
| Check full status | `sestatus` |
| Check configured boot mode | `cat /etc/selinux/config` |

### Security Muscle Memory Drill

| Goal | Fast command flow |
|---|---|
| Check SELinux mode | `getenforce` and `sestatus` |
| Fix file context | `ls -Z PATH` -> `restorecon -Rv PATH` |
| Allow service behavior | `getsebool -a | grep NAME` -> `setsebool -P BOOLEAN on` |
| Allow custom port | `semanage port -a/-m ...` |
| Use SSH keys | `ssh-keygen` -> `ssh-copy-id USER@HOST` |

---

## Optional or Version-Specific: Containers and systemd Add-On

## Containers and systemd

This section is useful for modern RHEL-style administration and may be version-specific depending on the exact RHCSA objective set. Keep it as an add-on reference.

### Podman Core Commands

| Command | What it does | Example with parameters |
|---|---|---|
| `podman images` | Lists local container images | `podman images` |
| `podman pull IMAGE` | Downloads image | `podman pull registry.access.redhat.com/ubi9/ubi` |
| `podman ps` | Lists running containers | `podman ps` |
| `podman ps -a` | Lists all containers | `podman ps -a` |
| `podman run IMAGE` | Runs a container | `podman run ubi9/ubi echo hello` |
| `podman run -d --name NAME IMAGE` | Runs detached named container | `podman run -d --name web quay.io/httpd/httpd-24` |
| `podman run -d -p HOSTPORT:CONTAINERPORT IMAGE` | Publishes container port | `podman run -d --name web -p 8080:80 quay.io/httpd/httpd-24` |
| `podman exec -it NAME COMMAND` | Runs command inside running container | `podman exec -it web /bin/bash` |
| `podman logs NAME` | Shows container logs | `podman logs web` |
| `podman stop NAME` | Stops container | `podman stop web` |
| `podman start NAME` | Starts existing container | `podman start web` |
| `podman rm NAME` | Removes stopped container | `podman rm web` |
| `podman inspect NAME` | Shows detailed JSON info | `podman inspect web` |

### Useful Podman Options

| Option | Meaning | Example |
|---|---|---|
| `-d` | detached mode | `podman run -d ...` |
| `--name NAME` | assigns container name | `podman run --name db ...` |
| `-p HOST:CTR` | maps host port to container port | `-p 8080:80` |
| `-v HOSTDIR:CTRDIR:Z` | mounts volume and relabels for SELinux | `-v /webcontent:/var/www/html:Z` |
| `--restart=always` | restart policy | `podman run --restart=always ...` |
| `--rm` | remove container when it exits | `podman run --rm ubi9/ubi date` |

### Container Verification Pattern

| Task | Command |
|---|---|
| Prove image exists | `podman images` |
| Prove container runs now | `podman ps` |
| Prove all container state | `podman ps -a` |
| Prove logs | `podman logs NAME` |
| Prove published ports | `ss -tuln` and `podman inspect NAME` |

### Running Containers With systemd

There are two common patterns:

1. `podman generate systemd`
2. Quadlet files under systemd-managed directories

#### Pattern 1: Generate a systemd Unit From an Existing Container

| Command | What it does | Example |
|---|---|---|
| `podman generate systemd --name NAME --files` | creates a unit file for a container | `podman generate systemd --name web --files` |

Typical workflow:

1. create the container first
2. generate the unit file
3. move the unit file into `/etc/systemd/system/`
4. run `sudo systemctl daemon-reload`
5. enable the generated unit

Example:

```bash
sudo podman run -d --name web -p 8080:80 quay.io/httpd/httpd-24
sudo podman generate systemd --name web --files
sudo mv container-web.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now container-web.service
systemctl status container-web.service
```

#### Pattern 2: Quadlet for systemd-managed Containers

Quadlet lets you describe a container in a systemd-friendly file.

Common location:

- `/etc/containers/systemd/`

Example `web.container`:

```ini
[Unit]
Description=HTTP container
After=network-online.target

[Container]
Image=quay.io/httpd/httpd-24
PublishPort=8080:80
Volume=/webcontent:/var/www/html:Z

[Service]
Restart=always

[Install]
WantedBy=multi-user.target
```

Typical workflow:

1. save file as `/etc/containers/systemd/web.container`
2. run `sudo systemctl daemon-reload`
3. run `sudo systemctl enable --now web.service`
4. verify with `systemctl status web.service`
5. verify ports with `ss -tuln`

### SELinux With Container Volumes

When binding host directories into containers on SELinux systems:

- use `:Z` for a private relabel
- use `:z` for shared relabel across multiple containers

Example:

```bash
sudo podman run -d --name web -p 8080:80 -v /webcontent:/var/www/html:Z quay.io/httpd/httpd-24
```

### Container Plus systemd Fast Verification Pattern

| Task | Command |
|---|---|
| Prove unit exists | `systemctl status web.service` |
| Prove it starts at boot | `systemctl is-enabled web.service` |
| Prove container runs | `podman ps` |
| Prove app port is listening | `ss -tuln | grep :8080` |
| Prove logs | `journalctl -u web.service -b` and `podman logs web` |

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
| `ss -tuln` | prove a service is listening on the expected port |
| `getenforce` | prove SELinux runtime mode |
| `ls -Z PATH` | prove SELinux file labels |
| `semanage port -l | grep TYPE` | prove SELinux port label exists |
| `journalctl -u SERVICE -b` | inspect current boot logs for a service |
| `getent hosts HOST` | prove name resolution |
| `podman ps` | prove container runs now |
| `podman logs NAME` | inspect container logs |

## Exam Habits for Using This Sheet

1. Identify the task type first: package, service, mount, user, network, SELinux, or storage.
2. Find the command family in this sheet.
3. Adapt the example with the real task values.
4. Run the command.
5. Use one verification command immediately.
6. If persistence matters, reboot and verify again.

## High-Value Task Recipes

### Create User With Custom Home and Bash Shell

```bash
sudo useradd -m -d /srv/alice -s /bin/bash alice
id alice
ls -ld /srv/alice
```

### Create tar.gz Backup

```bash
tar -czvf /tmp/backup.tar.gz /etc/ssh
tar -tzvf /tmp/backup.tar.gz
```

### Create GPT, PV, VG, LV, ext4, and Mount

```bash
sudo parted /dev/vdb
sudo pvcreate /dev/vdb1
sudo vgcreate vgdata /dev/vdb1
sudo lvcreate -n lvfiles -L 1G vgdata
sudo mkfs.ext4 /dev/vgdata/lvfiles
sudo mkdir -p /data
sudo mount /dev/vgdata/lvfiles /data
findmnt /data
```

### Create LV by Extents and Mount

```bash
sudo vgcreate -s 16M vgi /dev/vdb1
sudo lvcreate -l 60 -n lvi vgi
sudo mkfs.ext4 /dev/vgi/lvi
sudo mkdir -p /record
UUID=$(sudo blkid -s UUID -o value /dev/vgi/lvi)
echo "UUID=$UUID /record ext4 defaults 0 0" | sudo tee -a /etc/fstab
sudo mount -a
vgs vgi
lvs /dev/vgi/lvi
findmnt /record
```

### Mount NFS Share

```bash
sudo mkdir -p /mnt/share
sudo mount -t nfs servera:/share /mnt/share
findmnt /mnt/share
```

### Configure autofs for Home-Style Mount

```bash
echo '/remoteuser /etc/auto.remoteuser' | sudo tee -a /etc/auto.master
echo 'user20 -rw serverb:/remoteuser/user20' | sudo tee /etc/auto.remoteuser
sudo systemctl enable --now autofs
ls /remoteuser/user20
mount | grep remoteuser
```

### Check CDN Registration and Enabled Repositories

```bash
sudo subscription-manager identity
sudo subscription-manager status
sudo subscription-manager repos --list-enabled
sudo dnf repolist
```

### Open HTTPD on Port 85 with SELinux and Firewall

```bash
sudo semanage port -a -t http_port_t -p tcp 85
sudo firewall-cmd --add-port=85/tcp --permanent
sudo firewall-cmd --reload
sudo ss -tuln | grep :85
sudo semanage port -l | grep http_port_t
```

### Create and Enable a Custom systemd Service

```bash
sudo vi /etc/systemd/system/report.service
sudo systemctl daemon-reload
sudo systemctl enable --now report.service
systemctl status report.service
journalctl -u report.service -b
```

### Run a Container Through systemd

```bash
sudo podman run -d --name web -p 8080:80 quay.io/httpd/httpd-24
sudo podman generate systemd --name web --files
sudo mv container-web.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now container-web.service
systemctl status container-web.service
```
