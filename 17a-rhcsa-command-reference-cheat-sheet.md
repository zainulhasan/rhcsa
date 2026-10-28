---
description: One-page command reference for the RHCSA (EX200, RHEL 10) objectives, with examples, verification commands and quick recipes.
---

# RHCSA Command Reference Cheat Sheet

!!! info "How to use this sheet"
    1. **Find the section** that matches the task type (each section starts with a line naming the official objective it covers).
    2. **Copy the example, swap the placeholders** (`FILE`, `USER`, `DEVICE`, ...) for the real values.
    3. **Run it, then verify** with one command from the "Verification Commands" table near the end.
    4. **If it must survive a reboot, reboot and check again.**

    This is a reference, not a lesson: if a command is new to you, read the matching lesson first. Search the page (press `/`) for a command name.

This is a fast command reference for revision. It is not a replacement for the lesson files. Use it when you need to remember:

- what a command does
- when to use it
- what the common parameters mean
- what a practical example looks like

If you are following the beginner route, use this sheet after labs `22-26` and `28-rhcsa-10-mixed-practice-bank.md`, not immediately after lesson `16`.

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
11. Containers and Quadlet (**optional, not on the RHEL 10 objective list**; practice only after everything above)

---

## Core: Essential Tools

**Official objectives:** Understand and use essential tools (shell prompt and syntax, redirection, grep and regular expressions, SSH, switching users, tar/gzip/bzip2, editing and managing files, hard and soft links, ugo/rwx permissions, man/info//usr/share/doc).

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
| `find DIR OPTIONS` | Searches for files by attributes | `find /etc -maxdepth 1 -type f -mtime +180` |
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
| `grep -il TEXT FILES` | Prints only filenames with a case-insensitive match | `grep -il chrony /etc/*` |
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

### find Quick Patterns

| Task | Command |
|---|---|
| Find regular files only | `find DIR -type f` |
| Stay at top level only | `find DIR -maxdepth 1 -type f` |
| Find files older than 180 days | `find /etc -maxdepth 1 -type f -mtime +180` |
| Copy search results somewhere | `find DIR ... -exec cp {} TARGETDIR \;` |

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
| `chown USER FILE` | Changes the owner | `sudo chown alice report.txt` |
| `chown USER:GROUP FILE` | Changes owner and group together | `sudo chown alice:labteam report.txt` |
| `chown :GROUP DIR` | Changes only the group | `sudo chown :labteam /srv/projects` |
| `chgrp GROUP FILE` | Changes the group | `sudo chgrp labteam report.txt` |
| `chmod MODE FILE` | Changes permissions numerically | `chmod 644 file.txt` |
| `chmod u+x FILE` | Adds execute permission to user | `chmod u+x script.sh` |
| `chmod g-w FILE` | Removes group write permission | `chmod g-w shared.txt` |
| `chmod o-r FILE` | Removes others read permission | `chmod o-r secret.txt` |
| `umask` | Shows current default permission mask | `umask` |
| `umask -S` | Shows symbolic mask | `umask -S` |
| `setfacl -m RULE FILE` | Adds or changes ACL entry | `sudo setfacl -m u:alice:rw FILE` |
| `getfacl FILE` | Displays ACL entries | `getfacl FILE` |

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

**Official objectives:** Configure access to RPM repositories; Install and remove RPM software packages; Configure access to Flatpak repositories; Install and remove Flatpak software packages. Also covers: Install and update software packages from Red Hat Content Delivery Network, a remote repository, or from the local file system.

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
| `flatpak list` | Lists installed Flatpak apps and runtimes | `flatpak list` |
| `flatpak update` | Updates installed Flatpak apps and runtimes | `flatpak update` |
| `flatpak remote-delete NAME` | Removes a Flatpak remote | `flatpak remote-delete flathub` |
| `flatpak search TEXT` | Searches the configured remotes | `flatpak search gedit` |
| `dnf update` | Updates all installed RPM packages | `sudo dnf update` |
| `dnf install --nogpgcheck ./FILE.rpm` | Installs a local RPM without a signature check (lab only) | `sudo dnf install --nogpgcheck ./pkg.rpm` |

### Flatpak Quick Pattern

| Step | Command |
|---|---|
| 1. Add the remote (system-wide, needs root) | `sudo flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo` |
| 2. Check the remote exists | `flatpak remotes` |
| 3. Install the app | `sudo flatpak install flathub org.gnome.gedit` (add `-y` to skip the prompt) |
| 4. Verify | `flatpak list` |
| 5. Update | `sudo flatpak update` |
| 6. Remove | `sudo flatpak uninstall org.gnome.gedit` |

- Without `sudo` (or with `--user`) the remote and app are installed for your user only; with `sudo` (or `--system`) they are system-wide. Use the same scope for every step.
- A remote is a name plus a URL or a `.flatpakrepo` file; `flatpak remote-add NAME FILE_OR_URL` accepts either.

<!-- VERIFY: which Flatpak remote(s) Red Hat's own RHEL 10 images ship preconfigured (the AlmaLinux 10.2 image had none) and whether the exam-style lab uses a local remote; the Flathub URL above works but needs internet access -->

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

**Official objectives:** Conditionally execute code (use of: if, test, [], etc.); Use Looping constructs (for, etc.) to process file, command line input; Process script inputs ($1, $2, etc.); Processing output of shell commands within a script.

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

**Official objectives:** Boot, reboot, and shut down a system normally; Boot systems into different targets manually; Interrupt the boot process in order to gain access to a system; Identify CPU/memory intensive processes and kill processes; Adjust process scheduling; Manage tuning profiles; Locate and interpret system log files and journals; Preserve system journals; Start, stop, and check the status of network services; Securely transfer files between systems.

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
| `journalctl -b -1` | Shows the previous boot (needs persistent journal) | `journalctl -b -1` |
| `journalctl --list-boots` | Lists the boots the journal remembers | `journalctl --list-boots` |
| `journalctl --since "TIME"` | Shows entries since a time | `journalctl --since "10 minutes ago"` |
| `journalctl --disk-usage` | Shows how much disk the journal uses | `journalctl --disk-usage` |
| `top` then `P` / `M` | Sorts `top` by CPU / memory | `top` |
| `ps aux --sort=-%cpu` | Lists processes, busiest CPU first | `ps aux --sort=-%cpu | head` |
| `ps aux --sort=-%mem` | Lists processes, biggest memory first | `ps aux --sort=-%mem | head` |
| `tuned-adm list` | Lists tuning profiles | `tuned-adm list` |
| `tuned-adm active` | Shows active tuning profile | `sudo tuned-adm active` |
| `tuned-adm profile NAME` | Sets tuning profile | `sudo tuned-adm profile balanced` |
| `tuned-adm recommend` | Shows the profile tuned recommends for this machine (`virtual-guest` on a typical VM) | `tuned-adm recommend` |
| `tuned-adm verify` | Checks the active profile is applied | `sudo tuned-adm verify` |
| `tuned-adm off` | Turns tuning off | `sudo tuned-adm off` |
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

### Boot Into a Target From the GRUB Menu (one boot only)

| Step | Action |
|---|---|
| 1 | Reboot and press `e` on the highlighted GRUB entry |
| 2 | Find the line that starts with `linux` and go to its end (`End` key) |
| 3 | Append a space and `systemd.unit=rescue.target` (or `emergency.target`, `multi-user.target`, `graphical.target`) |
| 4 | Press `Ctrl+x` to boot with that edit |
| 5 | Verify with `systemctl get-default` (the default is unchanged) and `systemctl list-units --type=target` |

- The edit applies to this boot only. To change the default for every boot use `sudo systemctl set-default multi-user.target`.
- Use `rd.break` on the same `linux` line instead of `systemd.unit=` for the root-password reset pattern below.

<!-- VERIFY: rescue.target and emergency.target ask for the root password on RHEL 10; confirm the prompt and that rd.break still lands in the initramfs shell -->

### tuned Quick Pattern

| Step | Command |
|---|---|
| Make sure the daemon runs | `sudo dnf install tuned` then `sudo systemctl enable --now tuned` |
| See profiles and the active one | `tuned-adm list` |
| Ask for the recommended profile | `tuned-adm recommend` |
| Switch profile | `sudo tuned-adm profile throughput-performance` |
| Verify | `tuned-adm active` and `sudo tuned-adm verify` |

The active profile is stored by `tuned` itself, so it survives a reboot as long as `tuned.service` is enabled. <!-- VERIFY: tuned keeps the active profile across a reboot (not observed) -->

### Preserve System Journals (persist across reboots)

| Step | Command |
|---|---|
| Set storage mode (there is no `/etc/systemd/journald.conf` by default, so use a drop-in) | `sudo mkdir -p /etc/systemd/journald.conf.d` then `printf '[Journal]\nStorage=persistent\n' \| sudo tee /etc/systemd/journald.conf.d/persistent.conf` |
| Restart journald | `sudo systemctl restart systemd-journald` (on its own this does not create `/var/log/journal`) |
| Flush to disk (this creates `/var/log/journal`) | `sudo journalctl --flush` |
| Verify | `systemd-analyze cat-config systemd/journald.conf`, `ls -ld /var/log/journal` and, after a reboot, `journalctl --list-boots` (the previous boot `-1` and the current `0`) |

See also "Persistent journald Pattern" in the Security section below.

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

**Official objectives:** List, create, and delete partitions on GPT disks; Create and remove physical volumes; Assign physical volumes to volume groups; Create and delete logical volumes; Configure systems to mount file systems at boot by universally unique ID (UUID) or label; Add new partitions and logical volumes, and swap to a system non-destructively.

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
| `vgcreate -s SIZE VG DEVICE` | Creates volume group with custom PE size | `sudo vgcreate -s 16M vgapp /dev/vdb1` |
| `vgs` | Lists volume groups | `vgs` |
| `lvcreate -n LV -L SIZE VG` | Creates logical volume | `sudo lvcreate -n lvdata -L 500M vgdata` |
| `lvcreate -l EXTENTS -n LV VG` | Creates logical volume by extent count | `sudo lvcreate -l 60 -n lvapp vgapp` |
| `lvs` | Lists logical volumes | `lvs` |
| `vgextend VG DEVICE` | Adds a physical volume to an existing VG | `sudo vgextend vgdata /dev/vdc1` |
| `lvextend -L +SIZE LVPATH` | Extends logical volume | `sudo lvextend -L +200M /dev/vgdata/lvdata` |
| `lvextend -r -L +SIZE LVPATH` | Extends the LV and grows its filesystem (XFS or ext4) in one step | `sudo lvextend -r -L +200M /dev/vgdata/lvdata` |
| `lvextend -r -l +100%FREE LVPATH` | Extends the LV into all free space and grows the filesystem | `sudo lvextend -r -l +100%FREE /dev/vgdata/lvdata` |
| `parted -s DEVICE ...` | Runs `parted` non-interactively | `sudo parted -s /dev/vdb mklabel gpt mkpart primary 1MiB 1GiB` |
| `fdisk DEVICE` | Interactive partitioning (`g` new GPT, `n` new partition, `d` delete, `w` write) | `sudo fdisk /dev/vdb` |
| `partprobe DEVICE` | Asks the kernel to re-read the partition table | `sudo partprobe /dev/vdb` |
| `vgs -o +vg_extent_size` | Shows the VG extent (PE) size, which plain `vgs` does not | `vgs -o +vg_extent_size vgdata` |
| `pvs -o +pv_free` | Shows free space per PV | `pvs -o +pv_free` |
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

### Grow a Mounted LV (Add a PV, Extend, Resize the Filesystem)

| Step | Command |
|---|---|
| 1. Check free space in the VG | `sudo vgs vgdata` (look at `VFree`) |
| 2. If there is not enough, add a PV | `sudo pvcreate /dev/vdc1` then `sudo vgextend vgdata /dev/vdc1` |
| 3. Extend the LV and grow the filesystem | `sudo lvextend -r -L +200M /dev/vgdata/lvdata` |
| 4. Verify | `lvs /dev/vgdata/lvdata` and `df -h /data` |

Without `-r` you must grow the filesystem yourself: `sudo xfs_growfs /data` (XFS, takes the mount point) or `sudo resize2fs /dev/vgdata/lvdata` (ext4, takes the device). XFS can only grow, never shrink.

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

**Official objectives:** Create, mount, unmount, and use VFAT, ext4, and XFS file systems; Mount and unmount network file systems using NFS; Configure autofs; Extend existing logical volumes; Diagnose and correct file permission problems.

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
| `mount -t nfs HOST:PATH MOUNTPOINT` | Mounts NFS share now | `sudo mount -t nfs serverb:/share /mnt/share` |
| `umount MOUNTPOINT` | Unmounts NFS share too | `sudo umount /mnt/share` |
| `exportfs -rav` | Re-exports NFS exports | `sudo exportfs -rav` |
| `showmount -e HOST` | Lists NFS exports from server | `showmount -e serverb` |
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

### autofs Wildcard Map (one line for every user directory)

| Goal | Command or file |
|---|---|
| Master map entry | `echo '/remoteuser /etc/auto.remoteuser' | sudo tee -a /etc/auto.master` (or a file in `/etc/auto.master.d/NAME.autofs`) |
| Wildcard map line (`*` = the name you ask for, `&` = that same name) | `echo '* -rw,sync serverb:/remoteuser/&' | sudo tee /etc/auto.remoteuser` |
| Start and enable | `sudo systemctl enable --now autofs` |
| Trigger one mount | `ls /remoteuser/alice` (mounts `serverb:/remoteuser/alice`) |
| Verify | `mount | grep remoteuser` |
| After editing a map | `sudo systemctl reload autofs` |

Single-quote the line so the shell does not expand `*` or `&`. The mount point does not exist until you access it; that is normal.

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

**Official objectives:** Schedule tasks using at, cron and systemd timer units; Start and stop services and configure services to start automatically at boot; Configure systems to boot into a specific target automatically; Configure time service clients; Install and update software packages from Red Hat Content Delivery Network, a remote repository, or from the local file system; Modify the system bootloader.

## Scheduling, Time, and Bootloader

| Command | What it does | Example with parameters |
|---|---|---|
| `at` | Schedules one-time job | `echo "date > /tmp/out.txt" | at now + 2 minutes` |
| `atq` | Lists queued `at` jobs | `atq` |
| `atrm JOBID` | Removes queued `at` job | `atrm 3` |
| `crontab -e` | Edits current user's cron jobs | `crontab -e` |
| `crontab -l` | Lists current user's cron jobs | `crontab -l` |
| `crontab -e -u USER` | Edits another user's cron jobs | `sudo crontab -e -u alice` |
| `crontab -l -u USER` | Lists another user's cron jobs | `sudo crontab -l -u alice` |
| `systemctl list-timers` | Lists timer units | `systemctl list-timers` |
| `timedatectl` | Shows time and sync status | `timedatectl` |
| `chronyc sources` | Shows time sources | `chronyc sources` |
| `chronyc tracking` | Shows sync tracking details | `chronyc tracking` |
| `grubby --info=ALL` | Shows bootloader/kernel entry info | `sudo grubby --info=ALL` |
| `grubby --default-kernel` | Shows current default kernel | `sudo grubby --default-kernel` |
| `grubby --update-kernel=ALL --args="ARG"` | Adds kernel argument | `sudo grubby --update-kernel=ALL --args="quiet"` |
| `grubby --update-kernel=ALL --remove-args="ARG"` | Removes kernel argument | `sudo grubby --update-kernel=ALL --remove-args="quiet"` |
| `grubby --set-default=PATH` | Sets the default kernel entry | `sudo grubby --set-default=/boot/vmlinuz-$(uname -r)` |
| `grub2-mkconfig -o PATH` | Regenerates the GRUB configuration after editing `/etc/default/grub` | `sudo grub2-mkconfig -o /boot/grub2/grub.cfg` |
| `grub2-editenv list` | Shows the saved GRUB environment (saved default entry) | `sudo grub2-editenv list` |

### Modify the Bootloader (persistent kernel arguments)

| Goal | Command |
|---|---|
| Add an argument to every kernel entry (preferred) | `sudo grubby --update-kernel=ALL --args="audit=1"` |
| Check it was stored | `sudo grubby --info=ALL | grep args` |
| Remove an argument | `sudo grubby --update-kernel=ALL --remove-args="audit=1"` |
| Alternative: edit the defaults file | `sudoedit /etc/default/grub` (change `GRUB_CMDLINE_LINUX`, `GRUB_TIMEOUT`) |
| Rebuild the config after that edit | `sudo grub2-mkconfig -o /boot/grub2/grub.cfg` |
| Verify after a reboot | `cat /proc/cmdline` |

<!-- VERIFY: on RHEL 10 the generated config path is /boot/grub2/grub.cfg on both BIOS and UEFI (older releases used /boot/efi/EFI/redhat/grub.cfg on UEFI) -->

### Common Cron Patterns

| Goal | Entry |
|---|---|
| Run every 5 minutes | `*/5 * * * * COMMAND` |
| Run at reboot | `@reboot /bin/bash /usr/local/bin/startup-check.sh` |
| Edit another user's cron | `sudo crontab -e -u alice` |

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

### Full systemd Timer Example (service + timer)

Setup: create the job, then the two unit files.

```bash
sudo tee /usr/local/bin/report.sh <<'EOF'
#!/bin/bash
date >> /var/tmp/report.log
EOF
sudo chmod +x /usr/local/bin/report.sh

sudo tee /etc/systemd/system/report.service <<'EOF'
[Unit]
Description=Write a timestamp to the report log

[Service]
Type=oneshot
ExecStart=/usr/local/bin/report.sh
EOF

sudo tee /etc/systemd/system/report.timer <<'EOF'
[Unit]
Description=Run report.service every 5 minutes

[Timer]
OnCalendar=*:0/5
Persistent=true

[Install]
WantedBy=timers.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now report.timer
systemctl list-timers report.timer
systemctl is-enabled report.timer
```

Rules that trip people up:

- Enable and start the **`.timer`**, not the `.service`. The service has no `[Install]` section on purpose.
- The `.timer` triggers the `.service` with the same base name.
- `Type=oneshot` suits a job that runs and exits.

Check a schedule before you rely on it:

| Command | What it shows |
|---|---|
| `systemd-analyze calendar "*:0/5"` | the normalised form and the next elapse time |
| `systemd-analyze calendar "Mon..Fri 09:00"` | weekdays at 09:00 |
| `systemd-analyze calendar --iterations=3 "daily"` | the next three run times |
| `systemctl list-timers --all` | every timer, when it last ran, when it runs next |
| `journalctl -u report.service -b` | output of past runs |

Other schedule forms: `OnBootSec=2min` (2 minutes after boot), `OnUnitActiveSec=1h` (1 hour after the last run).

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

**Official objectives:** Configure IPv4 and IPv6 addresses; Configure hostname resolution; Configure network services to start automatically at boot; Restrict network access using firewalld and firewall-cmd.

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
| `nmcli connection modify NAME ipv6.method manual` | Sets static IPv6 mode | `sudo nmcli connection modify eth0 ipv6.method manual` |
| `nmcli connection modify NAME ipv6.addresses ADDR/PREFIX` | Sets the IPv6 address | `sudo nmcli connection modify eth0 ipv6.addresses fd00:122::10/64` |
| `nmcli connection modify NAME ipv6.gateway GW` | Sets the IPv6 gateway | `sudo nmcli connection modify eth0 ipv6.gateway fd00:122::1` |
| `nmcli connection modify NAME ipv6.dns DNS` | Sets an IPv6 DNS server | `sudo nmcli connection modify eth0 ipv6.dns fd00:122::1` |
| `nmcli connection modify NAME +ipv4.dns DNS` | Adds a DNS server without replacing the existing ones | `sudo nmcli connection modify eth0 +ipv4.dns 192.168.122.1` |
| `nmcli connection modify NAME connection.autoconnect yes` | Brings the profile up automatically at boot | `sudo nmcli connection modify eth0 connection.autoconnect yes` |
| `nmcli connection up NAME` | Brings connection up | `sudo nmcli connection up eth0` |
| `ip -6 addr` | Shows IPv6 addresses | `ip -6 addr` |
| `ip -6 route` | Shows the IPv6 routing table | `ip -6 route` |
| `ping -6 ADDR` | Tests IPv6 reachability | `ping -6 -c 2 fd00:122::11` |
| `hostnamectl set-hostname NAME` | Sets system hostname | `sudo hostnamectl set-hostname servera.lab.example` |
| `getent hosts NAME` | Tests hostname resolution | `getent hosts servera.lab.example` |
| `/etc/hosts` line | Static name resolution, checked before DNS | `echo '192.168.122.11 serverb.lab.example serverb' | sudo tee -a /etc/hosts` |
| `cat /etc/resolv.conf` | Shows the resolvers in use (managed by NetworkManager) | `cat /etc/resolv.conf` |
| `hostnamectl` | Shows the static hostname | `hostnamectl` |
| `ss -tuln` | Shows listening TCP and UDP sockets | `ss -tuln` |
| `firewall-cmd --list-all` | Shows zone details and allowed rules | `sudo firewall-cmd --list-all` |
| `firewall-cmd --get-active-zones` | Shows active zones | `sudo firewall-cmd --get-active-zones` |
| `firewall-cmd --add-service=NAME --permanent` | Permanently allows named service | `sudo firewall-cmd --add-service=http --permanent` |
| `firewall-cmd --add-port=PORT/proto --permanent` | Permanently allows custom port | `sudo firewall-cmd --add-port=8080/tcp --permanent` |
| `firewall-cmd --reload` | Reloads firewalld | `sudo firewall-cmd --reload` |

### Static IPv4 + IPv6 Recipe (persistent)

```bash
nmcli -t -f NAME,DEVICE connection show --active      # find the profile name, e.g. "eth0"
sudo nmcli connection modify eth0 ipv4.method manual ipv4.addresses 192.168.122.10/24 ipv4.gateway 192.168.122.1 ipv4.dns 192.168.122.1
sudo nmcli connection modify eth0 ipv6.method manual ipv6.addresses fd00:122::10/64
sudo nmcli connection up eth0
ip -4 addr show eth0
ip -6 addr show eth0
```

`nmcli connection modify` writes a profile that survives reboot; `connection up` applies it now. Services that must start at boot: `sudo systemctl enable --now SERVICE`, then `systemctl is-enabled SERVICE`.

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

**Official objectives:** Create, delete, and modify local user accounts; Change passwords and adjust password aging for local user accounts; Create, delete, and modify local groups and group memberships; Configure privileged access.

## Users, Groups, Passwords, and Sudo

| Command | What it does | Example with parameters |
|---|---|---|
| `useradd USER` | Creates user with system defaults | `sudo useradd alice` |
| `useradd -m USER` | Creates user and home directory | `sudo useradd -m alice` |
| `useradd -u UID USER` | Creates user with specific UID | `sudo useradd -u 2000 john` |
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
| `chage -E DATE USER` | Sets account expiration date (use a future date; a past date locks the account at once) | `sudo chage -E 2027-12-31 alice` |
| `chage -E -1 USER` | Removes the account expiration date | `sudo chage -E -1 alice` |
| `chage -d 0 USER` | Forces a password change at next login | `sudo chage -d 0 alice` |
| `chage -I DAYS USER` | Sets days of inactivity after password expiry before the account locks | `sudo chage -I 10 alice` |
| `chage -M 99999 USER` | Effectively disables password expiry | `sudo chage -M 99999 alice` |
| `usermod -L USER` / `usermod -U USER` | Locks / unlocks the password | `sudo usermod -L alice` |
| `groupadd -g GID GROUP` | Creates a group with a specific GID | `sudo groupadd -g 3000 labteam` |
| `gpasswd -d USER GROUP` | Removes a user from a group | `sudo gpasswd -d alice labteam` |
| `echo 'USER:PASS' | chpasswd` | Sets a password non-interactively | `echo 'alice:Passw0rd!' | sudo chpasswd` |
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

### Password Aging Recipe (`chage`)

```bash
sudo useradd -m alice
echo 'alice:Passw0rd!' | sudo chpasswd
sudo chage -M 90 -m 7 -W 14 -E 2027-12-31 alice
sudo chage -l alice
```

```text title="Example output"
Last password change                                    : Oct 27, 2026
Password expires                                        : Jan 25, 2027
Password inactive                                       : never
Account expires                                         : Dec 31, 2027
Minimum number of days between password change          : 7
Maximum number of days between password change          : 90
Number of days of warning before password expires       : 14
```

`/etc/login.defs` (`PASS_MAX_DAYS`, `PASS_MIN_DAYS`, `PASS_WARN_AGE`) sets the defaults for **new** users only; `chage` changes one existing user.

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

**Official objectives:** Configure firewall settings using firewall-cmd/firewalld; Manage default file permissions; Configure key-based authentication for SSH; Set enforcing and permissive modes for SELinux; List and identify SELinux file and process context; Restore default file contexts; Manage SELinux port labels; Use Boolean settings to modify system SELinux settings.

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
| `semanage fcontext -a -t TYPE 'REGEX'` | Adds persistent file-context rule | `sudo semanage fcontext -a -t httpd_sys_content_t '/data/xfs(/.*)?'` |
| `getsebool -a` | Lists booleans | `getsebool -a | grep httpd` |
| `setsebool -P BOOLEAN on` | Sets boolean persistently | `sudo setsebool -P httpd_can_network_connect on` |
| `semanage port -l` | Lists SELinux port labels | `sudo semanage port -l | grep http` |
| `semanage port -a -t TYPE -p proto PORT` | Adds SELinux port label for a port that has no label yet | `sudo semanage port -a -t http_port_t -p tcp 85` |
| `semanage port -m -t TYPE -p proto PORT` | Changes the label of a port that already has one (`-a` fails with "already defined") | `sudo semanage port -m -t http_port_t -p tcp 8080` |
| `semanage port -d -t TYPE -p proto PORT` | Deletes a label you added locally (policy-defined ports cannot be deleted) | `sudo semanage port -d -t http_port_t -p tcp 85` |
| `ssh-keygen` | Creates SSH key pair (ed25519 unless you pass `-t`) | `ssh-keygen` |
| `ssh-copy-id USER@HOST` | Installs public key remotely (the remote user needs a password the first time) | `ssh-copy-id student@serverb` |

<!-- VERIFY: `semanage port -m` on a policy-defined port such as 8080 (http_cache_port_t) succeeds on RHEL 10 and `semanage port -d` on a locally added port (85) removes it -->


### Label a Custom Directory (`semanage fcontext` + `restorecon`)

Setup: create the directory first; `restorecon` on a path that does not exist fails.

```bash
sudo mkdir -p /data/xfs
sudo semanage fcontext -a -t httpd_sys_content_t '/data/xfs(/.*)?'
sudo restorecon -Rv /data/xfs
ls -Zd /data/xfs
```

`semanage fcontext` only records the rule; `restorecon` applies it. `ls -Zd /home` shows `home_root_t` and `/home/USER` shows `user_home_dir_t`, so do not copy those types onto an unrelated directory. Check what a path would get with `matchpathcon /data/xfs`.

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
| Install the web server first | `sudo dnf install httpd` (this creates `/var/www/html`) and `sudo systemctl enable --now httpd` |
| Change the document root | edit `/etc/httpd/conf/httpd.conf`: set `DocumentRoot "/srv/webcontent"` and add a `<Directory "/srv/webcontent">` block with `Require all granted` |
| Change listening port | edit `/etc/httpd/conf/httpd.conf` and set `Listen 93` |
| Label new SELinux port | `sudo semanage port -a -t http_port_t -p tcp 93` |
| Label custom content root | `sudo semanage fcontext -a -t httpd_sys_content_t '/srv/webcontent(/.*)?'` |
| Apply labels | `sudo restorecon -Rv /srv/webcontent` |
| Open firewall | `sudo firewall-cmd --add-port=93/tcp --permanent` then `sudo firewall-cmd --reload` |
| Restart the service | `sudo systemctl restart httpd` |
| Verify locally | `curl http://localhost:93/` |

### SELinux Runtime and Boot Reminder

| Task | Command |
|---|---|
| Check runtime mode | `getenforce` |
| Check full status | `sestatus` |
| Check configured boot mode | `cat /etc/selinux/config` |

### Persistent journald Pattern

| Goal | Command or file |
|---|---|
| Set persistent storage mode | drop-in `/etc/systemd/journald.conf.d/persistent.conf` containing `[Journal]` and `Storage=persistent` (`/etc/systemd/journald.conf` does not exist by default) |
| Restart journald | `sudo systemctl restart systemd-journald` |
| Flush runtime logs to disk (creates `/var/log/journal`) | `sudo journalctl --flush` |
| Verify storage path | `ls -ld /var/log/journal` |
| Verify logs after reboot | `journalctl --list-boots` and `journalctl -b -1` |

### Security Muscle Memory Drill

| Goal | Fast command flow |
|---|---|
| Check SELinux mode | `getenforce` and `sestatus` |
| Fix file context | `ls -Z PATH` -> `restorecon -Rv PATH` |
| Allow service behavior | `getsebool -a | grep NAME` -> `setsebool -P BOOLEAN on` |
| Allow custom port | `semanage port -l | grep PORT` -> `semanage port -a ...` (new) or `-m ...` (already labelled) |
| Use SSH keys | `ssh-keygen` -> `ssh-copy-id USER@HOST` |

---

## Bonus (optional, not on the RHEL 10 list): Containers and Quadlet

!!! note "Supporting skill (not a listed RHEL 10 objective)"
    The official RHEL 10 EX200 objective list has no container objectives. This section is an optional add-on for real-world administration; skip it until everything above is solid, and leave it out of your self-scoring.

Image used below: `registry.access.redhat.com/ubi10/httpd-24`. It serves on port **8080** inside the container, so publish it as `8080:8080`.

<!-- VERIFY: the ubi10/httpd-24 image serves /var/www/html (its existence on registry.access.redhat.com, anonymous access and port 8080 were observed) -->

Learn it first in [15a Containers with Podman](15a-containers-with-podman.md), then use this section as the quick reference.

### Podman Core Commands

| Command | What it does | Example with parameters |
|---|---|---|
| `podman images` | Lists local container images | `podman images` |
| `podman pull IMAGE` | Downloads image | `podman pull registry.access.redhat.com/ubi10/ubi` |
| `podman ps` | Lists running containers | `podman ps` |
| `podman ps -a` | Lists all containers | `podman ps -a` |
| `podman run IMAGE` | Runs a container | `podman run registry.access.redhat.com/ubi10/ubi echo hello` |
| `podman run -d --name NAME IMAGE` | Runs detached named container | `podman run -d --name web registry.access.redhat.com/ubi10/httpd-24` |
| `podman run -d -p HOSTPORT:CONTAINERPORT IMAGE` | Publishes container port | `podman run -d --name web -p 8080:8080 registry.access.redhat.com/ubi10/httpd-24` |
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
| `-p HOST:CTR` | maps host port to container port (this image listens on 8080 inside) | `-p 8080:8080` |
| `-v HOSTDIR:CTRDIR:Z` | mounts volume and relabels for SELinux | `-v /webcontent:/var/www/html:Z` |
| `--restart=always` | restart policy | `podman run --restart=always ...` |
| `--rm` | remove container when it exits | `podman run --rm registry.access.redhat.com/ubi10/ubi date` |

### Container Verification Pattern

| Task | Command |
|---|---|
| Prove image exists | `podman images` |
| Prove container runs now | `podman ps` |
| Prove all container state | `podman ps -a` |
| Prove logs | `podman logs NAME` |
| Prove published ports | `ss -tuln` and `podman inspect NAME` |

### Running Containers With systemd

Two patterns exist. On current RHEL, **Quadlet is the preferred method**; `podman generate systemd` still works but is deprecated upstream, so learn Quadlet first.

#### Pattern 1 (preferred): Quadlet for systemd-managed Containers

Quadlet lets you describe a container in a systemd-friendly file; systemd generates the service from it.

Common locations:

- rootful: `/etc/containers/systemd/NAME.container` (manage with `systemctl`)
- rootless: `~/.config/containers/systemd/NAME.container` (manage with `systemctl --user` + `loginctl enable-linger USER`)

Example `web.container`:

```ini
[Unit]
Description=HTTP container
After=network-online.target

[Container]
Image=registry.access.redhat.com/ubi10/httpd-24
PublishPort=8080:8080
Volume=/webcontent:/var/www/html:Z

[Service]
Restart=always

[Install]
WantedBy=multi-user.target
```

Typical workflow (rootful):

1. save file as `/etc/containers/systemd/web.container`
2. run `sudo systemctl daemon-reload`
3. run `sudo systemctl start web.service` (do not run `systemctl enable`: Quadlet-generated units are generated at `daemon-reload` and cannot be enabled; autostart at boot comes from the `[Install]` section in the `.container` file)
4. verify with `systemctl status web.service`
5. verify ports with `ss -tuln`

<!-- VERIFY: on RHEL 10 a rootful Quadlet unit with WantedBy=multi-user.target starts at boot without systemctl enable; check by rebooting and running systemctl is-active web.service -->

#### Pattern 2 (legacy): Generate a systemd Unit From an Existing Container

!!! warning "Deprecated"
    `podman generate systemd` is **deprecated** in favor of Quadlet (Pattern 1 above). It is kept here only so you can recognise it in older notes. Prefer a `.container` file.

| Command | What it does | Example |
|---|---|---|
| `podman generate systemd --name NAME --files` | creates a unit file for a container | `podman generate systemd --name web --files` |

```bash
sudo podman run -d --name web -p 8080:8080 registry.access.redhat.com/ubi10/httpd-24
sudo podman generate systemd --name web --files
sudo mv container-web.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now container-web.service
systemctl status container-web.service
```

### SELinux With Container Volumes

When binding host directories into containers on SELinux systems:

- use `:Z` for a private relabel
- use `:z` for shared relabel across multiple containers

Example:

```bash
sudo podman run -d --name web -p 8080:8080 -v /webcontent:/var/www/html:Z registry.access.redhat.com/ubi10/httpd-24
```

### Container Plus systemd Fast Verification Pattern

| Task | Command |
|---|---|
| Prove unit exists | `systemctl status web.service` |
| Prove it starts at boot | Quadlet unit: reboot, then `systemctl is-active web.service` (`is-enabled` does not apply to generated units); legacy `generate systemd` unit: `systemctl is-enabled web.service` |
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
| `podman ps` | (Bonus, optional) prove container runs now |
| `podman logs NAME` | (Bonus, optional) inspect container logs |

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

### Create User With Specific UID and Expiration

```bash
sudo useradd -u 2000 john
sudo useradd -u 3000 davis
sudo chage -E "$(date -d '+30 days' +%Y-%m-%d)" davis
getent passwd john
sudo chage -l davis
```

### Create tar.gz Backup

```bash
sudo tar -czvf /var/tmp/backup.tar.gz /etc/ssh
sudo tar -tzvf /var/tmp/backup.tar.gz
```

??? warning "Disk reset"
    Storage recipes below use the empty 2 GiB spare disk `/dev/vdb` (`/dev/vdc` for the second disk). Run this once before each recipe, replacing `vdb` with `vdc` where needed. It also removes the related `/etc/fstab` lines.
    ```bash
    sudo umount /data /par1 /record /datasource /mnt/lvapp 2>/dev/null; sudo swapoff -a
    sudo vgremove -ff -y vgdata vgexam vgapp vgfs datacontainer 2>/dev/null
    sudo wipefs -a /dev/vdb[0-9]* 2>/dev/null; sudo wipefs -a /dev/vdb; sudo partprobe /dev/vdb
    sudo sed -i -E '\#[[:space:]]/(data|par1|record|datasource|mnt/lvapp)[[:space:]]#d; /\/dev\/vdb|vg(data|app|fs)-/d' /etc/fstab
    for s in $(awk '$1~/^(UUID|LABEL)=/{print $1}' /etc/fstab); do sudo blkid -t "$s" >/dev/null || sudo sed -i "\#^$s[[:space:]]#d" /etc/fstab; done
    sudo systemctl daemon-reload; sudo swapon -a
    ```

### Create GPT, PV, VG, LV, ext4, and Mount

```bash
sudo parted -s /dev/vdb mklabel gpt mkpart primary 1MiB 100% set 1 lvm on
sudo pvcreate /dev/vdb1
sudo vgcreate vgdata /dev/vdb1
sudo lvcreate -n lvfiles -L 1G vgdata
sudo mkfs.ext4 /dev/vgdata/lvfiles
sudo mkdir -p /data
sudo mount /dev/vgdata/lvfiles /data
findmnt /data
```

That mount is gone after a reboot. Make it persistent:

```bash
UUID=$(sudo blkid -s UUID -o value /dev/vgdata/lvfiles)
echo "UUID=$UUID /data ext4 defaults 0 0" | sudo tee -a /etc/fstab
sudo umount /data && sudo mount -a && findmnt /data
```

### Create LV by Extents and Mount

Run the "Disk reset" block above first, then:

```bash
sudo parted -s /dev/vdb mklabel gpt mkpart primary 1MiB 100% set 1 lvm on
sudo pvcreate /dev/vdb1
sudo vgcreate -s 16M vgapp /dev/vdb1
sudo lvcreate -l 60 -n lvapp vgapp
sudo mkfs.ext4 /dev/vgapp/lvapp
sudo mkdir -p /record
UUID=$(sudo blkid -s UUID -o value /dev/vgapp/lvapp)
echo "UUID=$UUID /record ext4 defaults 0 0" | sudo tee -a /etc/fstab
sudo mount -a
sudo vgs -o +vg_extent_size vgapp
sudo lvs /dev/vgapp/lvapp
findmnt /record
```

### Mount NFS Share

```bash
sudo mkdir -p /mnt/share
sudo mount -t nfs serverb:/share /mnt/share
findmnt /mnt/share
```

### Configure autofs for Home-Style Mount

```bash
echo '/remoteuser /etc/auto.remoteuser' | sudo tee -a /etc/auto.master
echo 'user20 -rw serverb:/remoteuser/user20' | sudo tee /etc/auto.remoteuser
sudo systemctl enable autofs
sudo systemctl restart autofs
ls /remoteuser/user20
mount | grep remoteuser
```

Wildcard variant (every user directory with one line): `echo '* -rw,sync serverb:/remoteuser/&' | sudo tee /etc/auto.remoteuser`, then `sudo systemctl reload autofs`.

### Check CDN Registration and Enabled Repositories

```bash
sudo subscription-manager identity
sudo subscription-manager status
sudo subscription-manager repos --list-enabled
sudo dnf repolist
```

### Open HTTPD on Port 85 with SELinux and Firewall

```bash
sudo dnf install -y httpd
echo 'Listen 85' | sudo tee /etc/httpd/conf.d/port85.conf
sudo semanage port -a -t http_port_t -p tcp 85
sudo firewall-cmd --add-port=85/tcp --permanent
sudo firewall-cmd --reload
sudo systemctl enable httpd
sudo systemctl restart httpd        # restart, not enable --now: httpd may already be running on the old config
sudo ss -tuln | grep :85
sudo semanage port -l | grep -w 85
```

### Create and Enable a Custom systemd Service

```bash
sudo tee /etc/systemd/system/report.service <<'EOF'
[Unit]
Description=Simple custom report service
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/report.sh
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF
sudo systemctl daemon-reload
sudo systemctl enable --now report.service
systemctl status report.service
journalctl -u report.service -b
```

### Make journald Persistent

```bash
sudo mkdir -p /etc/systemd/journald.conf.d
printf '[Journal]\nStorage=persistent\n' | sudo tee /etc/systemd/journald.conf.d/persistent.conf
sudo systemctl restart systemd-journald
sudo journalctl --flush
systemd-analyze cat-config systemd/journald.conf | tail -3
ls -ld /var/log/journal
journalctl --list-boots
```

### Run a Container Through systemd (Bonus, optional)

Preferred: Quadlet (rootful).

```bash
sudo mkdir -p /srv/webcontent
sudo tee /etc/containers/systemd/web.container <<'EOF'
[Unit]
Description=HTTP container
After=network-online.target

[Container]
Image=registry.access.redhat.com/ubi10/httpd-24
PublishPort=8080:8080
Volume=/srv/webcontent:/var/www/html:Z

[Service]
Restart=always

[Install]
WantedBy=multi-user.target
EOF
sudo systemctl daemon-reload
sudo systemctl start web.service        # not "enable": Quadlet-generated units cannot be enabled
systemctl status web.service
ss -tuln | grep :8080
```

Legacy (deprecated, see Pattern 2 above):

```bash
sudo podman run -d --name web -p 8080:8080 registry.access.redhat.com/ubi10/httpd-24
sudo podman generate systemd --name web --files
sudo mv container-web.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now container-web.service
systemctl status container-web.service
```
