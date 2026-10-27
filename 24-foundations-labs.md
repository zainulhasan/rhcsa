---
description: Hands-on drills for shell, text processing, archives, SSH copy, links, permissions and ACLs, each with exact setup, a grader checklist, hints and a collapsed solution.
---

# 24 Foundations Labs

> By the end of this page you can do the everyday shell, text, archive, link and permission tasks quickly, and prove each one with a verification command.

## Why it matters

These are the commands you will use constantly on the exam machine. If the foundations are slow, every advanced task becomes slower and riskier. Real administrators read docs, create files, edit configuration, search logs, copy files, and fix permissions every day.

**Prereqs:** [23 VM Lab Setup and Baseline Checks](23-vm-lab-setup-and-baseline-checks.md), and lessons [00](00-study-skills-and-offline-help.md) to [06](06-links-permissions-and-default-permissions.md) completed, or enough prior knowledge to attempt direct lab work. **Time:** about 4 to 6 hours.

## How to use this page

Every drill has the same shape:

1. **Setup**: copy-paste commands that create everything the drill needs (users, groups, files). Nothing relies on state left by another drill.
2. **Task**: what the grader will check, with exact names and paths.
3. **Grader checklist**: tick each box only after you verified it with a command.
4. **Hints**: open one at a time. Try the task first.
5. **Solution**: collapsed. Contains the commands, the verification, and a reboot check where it matters.

The shared environment is the one from [23 VM Lab Setup and Baseline Checks](23-vm-lab-setup-and-baseline-checks.md): `servera.lab.example` (192.168.122.10) is the main machine, `serverb.lab.example` (192.168.122.11) is the remote one, you log in as `student` (password `student`, has sudo), and the root password is `redhat` (lab only). Run the drills on servera unless a drill says otherwise.

!!! note "Users and groups in Setup"
    Setup lines create the accounts a drill needs (`alice`, `bob`, `carol`, `dana`, groups `labteam`, `projectops`). Where a drill needs an account in a group, the Setup uses `id U &>/dev/null || sudo useradd U` and then `sudo usermod -aG GROUP U`. `useradd -G` does nothing when the user already exists (it only prints "already exists"), so the group membership would silently be missing on a re-run; `usermod -aG` is safe to repeat. A plain `sudo useradd NAME` on an existing account is harmless: it prints "already exists" and changes nothing.

## Drill index

| # | Drill | Skill trained | Objective it trains | Time |
|---|---|---|---|---|
| Guided | [Guided Hands-On Lab](#guided-hands-on-lab) | Files, text tools, archive, scp, links, shared dir | Several (see below) | 30 min |
| 1 | [ACL check on a copied system file](#drill-1-acl-check-on-a-copied-system-file) | `setfacl`, `getfacl` | Supporting skill; nearest objective: List, set, and change standard ugo/rwx permissions | 10 min |
| 2 | [Shared project directory with SGID](#drill-2-shared-project-directory-with-sgid) | `groupadd`, `chgrp`, `chmod 2775` | Supporting skill; nearest objective: List, set, and change standard ugo/rwx permissions | 10 min |
| 3 | [Sticky-bit drop zone](#drill-3-sticky-bit-drop-zone) | `chmod 1777` | Supporting skill; nearest objective: List, set, and change standard ugo/rwx permissions | 5 min |
| 4 | [Text extraction speed drill](#drill-4-text-extraction-speed-drill) | `awk`, `sed`, `grep` | Use grep and regular expressions to analyze text | 5 min |
| 5 | [Search text and save the result to a file](#drill-5-search-text-and-save-the-result-to-a-file) | `grep`, `>` vs `>>` | Use input-output redirection (>, >>, \|, 2>, etc.) | 5 min |
| 6 | [Gzip-compressed archive of `/usr/local`](#drill-6-create-a-gzip-compressed-archive-of-usrlocal) | `tar -czvf`, `tar -tzvf` | Archive, compress, unpack, and uncompress files using tar, gzip, and bzip2 | 5 min |
| 7 | [Find old files and copy them](#drill-7-find-old-files-and-copy-them-to-a-staging-directory) | `find -mtime -exec cp` | Create, delete, copy, and move files and directories | 10 min |
| 8 | [Find files that contain a string](#drill-8-find-files-that-contain-a-given-string) | `grep -l -i -d skip` | Use grep and regular expressions to analyze text | 5 min |
| 9 | [Give one user access to another's home](#drill-9-give-one-user-access-to-another-users-home-with-acls) | `setfacl -R`, default ACLs | Supporting skill; nearest objective: List, set, and change standard ugo/rwx permissions | 10 min |
| Exam-style 1 and 2 | [Exam-Style Tasks](#exam-style-tasks) | Combined files, archive, links, shared dir | Create hard and soft links; Archive, compress, unpack, and uncompress files | 20 min |

!!! note "Supporting skill (not a listed RHEL 10 objective)"
    ACLs, SGID collaboration directories and the sticky bit are not named in the published RHEL 10 EX200 objective list. They are kept here because they build directly on the listed objective "List, set, and change standard ugo/rwx permissions" and are common real-world tools.

## Objectives covered

- Access a shell prompt and issue commands with correct syntax
- Use input-output redirection (>, >>, |, 2>, etc.)
- Use grep and regular expressions to analyze text
- Access remote systems using SSH
- Archive, compress, unpack, and uncompress files using tar, gzip, and bzip2
- Create and edit text files
- Create, delete, copy, and move files and directories
- Create hard and soft links
- List, set, and change standard ugo/rwx permissions
- Locate, read, and use system documentation including man, info, and files in /usr/share/doc

## Commands and tools used

`man`, `apropos`, `pwd`, `ls`, `cp`, `mv`, `rm`, `cat`, `less`, `grep`, `sed`, `awk`, `find`, `tar`, `gzip`, `bzip2`, `ssh`, `scp`, `ln`, `chmod`, `umask`, `stat`, `setfacl`, `getfacl`

## Offline help references for this topic

- `man grep`
- `man sed`
- `man awk`
- `man find`
- `man tar`
- `man ssh`
- `man chmod`
- `man setfacl`
- `man umask`
- `apropos permission`

## Concept explanation in simple language

This lab file is about command fluency. You should be able to do simple work quickly and correctly:

- find help
- create and move files
- search and filter text
- archive and extract data
- log in to another host
- set correct permissions

These tasks are not "small." They are the base layer under almost every RHCSA task.

## Command breakdowns

### Search by keyword when you forget a command

```bash
apropos password
man -k archive
```

### Extract usernames from `/etc/passwd`

```bash
awk -F: '{print $1}' /etc/passwd
```

### Replace one word with another

```bash
sed 's/servera/serverb/' file.txt
```

### Find matching files without searching subdirectories

```bash
find /etc -maxdepth 1 -type f -mtime +180
```

### Create a compressed archive

```bash
tar -czvf /tmp/etc-backup.tar.gz /etc
```

### Set a shared directory group workflow

```bash
chmod 2775 /srv/share
```

## Worked examples

### Worked Example 1: Find a command with offline help

```bash
apropos compression
man -k ssh
```

Verification:

- you should get command suggestions from local manuals

### Worked Example 2: Print only login-capable users

```bash
awk -F: '/bash$/ {print $1, $7}' /etc/passwd
```

Verification:

- output should show usernames and shells for matching lines

### Worked Example 3: Test a symbolic link

```bash
touch demo.txt
ln -s demo.txt demo.link
ls -l demo.link
```

Verification:

- `demo.link` should point to `demo.txt`

## Guided Hands-On Lab

**Objectives trained:** Create and edit text files; Use grep and regular expressions to analyze text; Archive, compress, unpack, and uncompress files using tar, gzip, and bzip2; Access remote systems using SSH; Create hard and soft links; List, set, and change standard ugo/rwx permissions.

### Lab goal

Prove you can perform the main RHCSA foundation tasks without step-by-step instructions.

### Setup

Run on servera as `student`. Nothing else is needed; the lab directory is created in step 1. Step 8 needs servera to reach serverb (`ping -c 1 serverb.lab.example`); skip step 8 if serverb is not built yet.

```bash
sudo groupadd -f labteam
```

### Task

- [ ] 1. Create `~/foundations-lab`.
- [ ] 2. Create three files named `app.log`, `users.txt`, and `notes.txt` in it.
- [ ] 3. Put sample text in the files (at least the word `sshd` in `app.log`).
- [ ] 4. Use `grep` to find specific words.
- [ ] 5. Use `sed` to replace one word in output.
- [ ] 6. Use `awk` to print only selected fields from `/etc/passwd`.
- [ ] 7. Create a `tar.gz` archive of the lab directory at `/tmp/foundations-lab.tar.gz`.
- [ ] 8. If `serverb` exists, copy the archive to `student@serverb.lab.example:/tmp/` with `scp`.
- [ ] 9. Create one hard link (`original.hard`) and one symbolic link (`original.soft`) to a file named `original.txt`.
- [ ] 10. Create a directory named `/tmp/shared-foundations`, give it group `labteam`, and set group-sharing style permissions on it (`2775`).

### Expected result

- the lab directory exists
- text-processing commands work
- the archive can be listed
- links work
- permissions are intentional and verifiable

??? question "Hint 1"
    `printf "line one\nline two\n" > file` writes sample text with `\n` newlines. `man tar` and `man scp` show the argument order (options, then archive, then sources / source, then destination).

??? question "Hint 2"
    Permissions for a group-shared directory: set the group with `chgrp`, then use `chmod` with a four-digit mode where the first digit is `2` (setgid).

??? success "Solution"
    ```bash
    mkdir -p ~/foundations-lab
    cd ~/foundations-lab
    printf "servera sshd running\nserverb sshd stopped\n" > app.log
    printf "alice\nbob\ncarol\n" > users.txt
    printf "remember to verify\n" > notes.txt
    grep sshd app.log
    sed 's/stopped/active/' app.log
    awk -F: '{print $1, $7}' /etc/passwd | head -3
    touch original.txt
    ln original.txt original.hard
    ln -s original.txt original.soft
    cd ~
    tar -czvf /tmp/foundations-lab.tar.gz ~/foundations-lab
    scp /tmp/foundations-lab.tar.gz student@serverb.lab.example:/tmp/
    sudo mkdir -p /tmp/shared-foundations
    sudo chgrp labteam /tmp/shared-foundations
    sudo chmod 2775 /tmp/shared-foundations
    ```

    **Verify:**

    ```bash
    ls -l ~/foundations-lab
    ls -li ~/foundations-lab          # original.txt and original.hard share one inode number
    tar -tzvf /tmp/foundations-lab.tar.gz
    stat /tmp/shared-foundations      # Access: (2775/drwxrwsr-x)  Gid: ( labteam )
    ssh student@serverb.lab.example ls -l /tmp/foundations-lab.tar.gz
    ```

    `tar` prints "Removing leading `/` from member names"; that is normal.

    <!-- VERIFY: whether /tmp is cleared at reboot on RHEL 10 (tmpfs or disk with age rules); use /srv for anything that must survive -->

### Cleanup

Remove only temporary files if you want (`sudo rm -rf /tmp/shared-foundations /tmp/foundations-lab.tar.gz`). Keep useful lab notes.

## Independent practice tasks

Seven short tasks. Each has one collapsed answer block at the end.

1. Use `apropos` to find commands related to archives.
2. Use `grep -n` to search `/etc/services` for `ssh`.
3. Use `sed -n '1,5p'` on `/etc/services`.
4. Use `awk -F:` to print usernames from `/etc/passwd`.
5. Create a `tar.bz2` archive of `~/foundations-lab` at `/tmp/foundations-lab.tar.bz2` and list its contents.
6. Create a symbolic link that breaks, then fix it.
7. Create a directory `/srv/stickytest` with sticky bit behavior and explain why it is useful.

??? success "Solution"
    ```bash
    apropos archive
    grep -n ssh /etc/services
    sed -n '1,5p' /etc/services
    awk -F: '{print $1}' /etc/passwd
    mkdir -p ~/foundations-lab && touch ~/foundations-lab/placeholder.txt   # in case the guided lab was skipped
    tar -cjvf /tmp/foundations-lab.tar.bz2 ~/foundations-lab
    tar -tjvf /tmp/foundations-lab.tar.bz2
    ln -s /tmp/not-there-yet ~/broken.link
    ls -l ~/broken.link                    # points to a missing target (shown red / blinking)
    cat ~/broken.link                      # No such file or directory
    touch /tmp/not-there-yet
    cat ~/broken.link                      # works now: the link was always right, the target was missing
    sudo mkdir -p /srv/stickytest
    sudo chmod 1777 /srv/stickytest
    ls -ld /srv/stickytest                 # drwxrwxrwt
    ```

    The sticky bit (`t`) lets everyone create files in a shared directory but lets only a file's owner (or root) delete or rename it. `/tmp` works this way.

## Core skill drills

These drills practise skills in the style of the exam objectives. Each one has its own Setup, so you can do them in any order.

### Drill 1: ACL check on a copied system file

**Setup:**

```bash
id alice &>/dev/null || sudo useradd alice
sudo groupadd -f labteam
id dana &>/dev/null || sudo useradd dana
sudo usermod -aG labteam dana
```

**Task:** As `root` (use `sudo` for each command), copy `/etc/fstab` to `/var/tmp/fstab.practice`. Then:

1. Give user `alice` read and write access.
2. Make sure group `labteam` has no access.
3. Verify the ACL entries explicitly.

**Grader checklist:**

- [ ] `/var/tmp/fstab.practice` exists and is still owned by `root:root`
- [ ] `getfacl` shows `user:alice:rw-`
- [ ] `getfacl` shows `group:labteam:---`
- [ ] `sudo -u dana cat /var/tmp/fstab.practice` is denied (dana is in `labteam`)

??? question "Hint 1"
    ACLs are set with `setfacl -m` (modify) and read with `getfacl`. The entry syntax is `u:NAME:perms` for a user and `g:NAME:perms` for a group.
    
??? question "Hint 2"
    "No access" for a group is the permission string `---`, which is an explicit entry, not the absence of an entry.

??? success "Solution"
    ```bash
    sudo cp /etc/fstab /var/tmp/fstab.practice
    sudo setfacl -m u:alice:rw /var/tmp/fstab.practice
    sudo setfacl -m g:labteam:--- /var/tmp/fstab.practice
    getfacl /var/tmp/fstab.practice
    ls -l /var/tmp/fstab.practice
    ```

    **Verify:**

    ```text title="Example output"
    # file: var/tmp/fstab.practice
    # owner: root
    # group: root
    user::rw-
    user:alice:rw-
    group::r--
    group:labteam:---
    mask::rw-
    other::r--
    ```

    ```bash
    sudo -u alice sh -c 'echo "# test" >> /var/tmp/fstab.practice'   # works
    sudo -u dana cat /var/tmp/fstab.practice                         # Permission denied
    ```

    `ls -l` shows a trailing `+` (for example `-rw-rw-r--+`), which means ACL entries exist; the group triplet shows the mask.

    **Persistence:** ACLs are stored in the filesystem, so they survive a reboot. Reboot and run `getfacl /var/tmp/fstab.practice` again if you want proof.

### Drill 2: Shared project directory with SGID

**Setup:**

```bash
sudo groupadd -f projectops
id alice &>/dev/null || sudo useradd alice
id bob &>/dev/null || sudo useradd bob
sudo usermod -aG projectops alice
sudo usermod -aG projectops bob
```

**Task:** As `root` (use `sudo`):

1. Create a group named `projectops` (done in Setup; `groupadd -f` is safe to repeat).
2. Create `/srv/projectops`.
3. Change the group owner of the directory to `projectops`.
4. Set permissions so members can create files collaboratively and new files inherit the group automatically.

**Grader checklist:**

- [ ] `ls -ld /srv/projectops` shows group `projectops`
- [ ] the mode is `drwxrwsr-x` (octal `2775`), including the SGID bit
- [ ] a file created by `alice` inside it gets group `projectops` (not `alice`)

??? question "Hint 1"
    The directory must be group-writable, and it needs the setgid bit so that new files take the directory's group instead of the creator's primary group.

??? question "Hint 2"
    `chgrp` sets the group; `chmod` with a leading `2` in a four-digit mode sets setgid.

??? success "Solution"
    ```bash
    sudo groupadd -f projectops
    sudo mkdir -p /srv/projectops
    sudo chgrp projectops /srv/projectops
    sudo chmod 2775 /srv/projectops
    ls -ld /srv/projectops
    sudo -u alice touch /srv/projectops/testfile
    ls -l /srv/projectops/testfile
    ```

    **Verify:**

    ```text title="Example output"
    drwxrwsr-x. 2 root projectops 6 Oct 27 10:00 /srv/projectops
    -rw-r--r--. 1 alice projectops 0 Oct 27 10:01 /srv/projectops/testfile
    ```

    - the directory mode contains `rwxrwsr-x`
    - the new file's group is `projectops`, even though `alice`'s primary group is `alice`

    **Persistence:** ownership and mode live on the filesystem, so they survive a reboot. Reboot and re-run `ls -ld /srv/projectops` to confirm.

### Drill 3: Sticky-bit drop zone

**Setup:**

```bash
sudo useradd alice
sudo useradd bob
```

**Task:** As `root` (use `sudo`):

1. Create `/srv/dropbox`.
2. Set it so everyone can create files there.
3. Prevent normal users from deleting each other's files.

**Grader checklist:**

- [ ] the mode is `drwxrwxrwt` (octal `1777`), ending with the sticky-bit indicator `t`
- [ ] `alice` and `bob` can each create a file there
- [ ] `bob` cannot delete `alice`'s file

??? question "Hint 1"
    World-writable alone lets anyone delete anything. One extra permission bit changes who may remove entries.

??? question "Hint 2"
    The sticky bit is the leading `1` in a four-digit `chmod` mode.

??? success "Solution"
    ```bash
    sudo mkdir -p /srv/dropbox
    sudo chmod 1777 /srv/dropbox
    ls -ld /srv/dropbox
    sudo -u alice touch /srv/dropbox/alice.txt
    sudo -u bob touch /srv/dropbox/bob.txt
    sudo -u bob rm -f /srv/dropbox/alice.txt
    ```

    **Verify:**

    ```text title="Example output"
    drwxrwxrwt. 2 root root 6 Oct 27 10:05 /srv/dropbox
    rm: cannot remove '/srv/dropbox/alice.txt': Operation not permitted
    ```

    - the trailing `t` confirms sticky-bit behavior
    - `bob.txt` and `alice.txt` both exist afterwards; only the owner (or root) can remove each

    **Persistence:** the mode is stored on the filesystem; reboot and run `ls -ld /srv/dropbox` to check it is still `drwxrwxrwt`.

### Drill 4: Text extraction speed drill

**Setup:** none. Run as `student`; these files exist on every install.

**Task:** As a regular user:

1. Print only usernames from `/etc/passwd` using `awk`.
2. Print only the first five lines of `/etc/services` using `sed`.
3. Find all lines in `/etc/passwd` that end with `/bin/bash`.

**Grader checklist:**

- [ ] command 1 prints one username per line and nothing else
- [ ] command 2 prints exactly five lines (`sed -n '1,5p' /etc/services | wc -l` gives `5`)
- [ ] command 3 matches only lines ending in `/bin/bash`
- [ ] you can explain the separator (`-F:`) and the regex anchor (`$`)

??? question "Hint 1"
    `/etc/passwd` fields are separated by `:`; the username is the first field. `sed` has a "print only these lines" mode that needs `-n`.

??? question "Hint 2"
    `awk -F: '{print $N}'`, `sed -n 'A,Bp'`, and `grep` with a pattern anchored to the end of the line.

??? success "Solution"
    ```bash
    awk -F: '{print $1}' /etc/passwd
    sed -n '1,5p' /etc/services
    grep '/bin/bash$' /etc/passwd
    ```

    **Verify:**

    - `awk` should print usernames only
    - `sed` should print exactly five lines: `sed -n '1,5p' /etc/services | wc -l`
    - `grep` should match only Bash-shell entries (`root`, `student`, and any users you created with the default shell)

### Drill 5: Search text and save the result to a file

**Setup:**

```bash
sudo useradd carol
sudo -i          # become root for this drill; type exit when done
```

**Task:** As `root`:

1. Search `/etc/passwd` for the string `carol`.
2. Save the result to `/root/lines`.
3. Explain whether `>` or `>>` is safer for the exact task wording.

**Grader checklist:**

- [ ] `/root/lines` exists
- [ ] the file contains only the `carol` line (`wc -l /root/lines` gives `1`)
- [ ] you can explain overwrite versus append

??? question "Hint 1"
    `grep PATTERN FILE` prints matching lines to the screen. Redirection sends that output to a file instead.

??? question "Hint 2"
    Do this in a root shell. `sudo grep ... > /root/lines` fails because your own (non-root) shell opens the redirection target before `sudo` runs.

??? success "Solution"
    ```bash
    grep carol /etc/passwd > /root/lines
    cat /root/lines
    wc -l /root/lines
    ```

    **Verify:**

    ```text title="Example output"
    carol:x:1003:1003::/home/carol:/bin/bash
    1 /root/lines
    ```

    - use `>` if the task implies a fresh result file (it replaces any old content, so re-running gives the same one line)
    - use `>>` only when you intentionally want to append (re-running would add a duplicate line)

    **Persistence:** a normal file on disk, so it survives a reboot.

### Drill 6: Create a gzip-compressed archive of `/usr/local`

**Setup:** none (`/usr/local` exists on every install). Use `sudo` for the commands.

**Task:** As `root`, create `/root/local.tgz` containing `/usr/local`.

**Grader checklist:**

- [ ] `/root/local.tgz` exists
- [ ] `tar -tzvf /root/local.tgz` lists `usr/local/` content without errors
- [ ] you can explain why `tar` and `gzip` are combined here

??? question "Hint 1"
    `tar` bundles files; the `z` option pipes the bundle through `gzip`. You need create (`c`), file (`f`) and gzip (`z`) options.

??? question "Hint 2"
    Options first, archive name next, then the directory to store: `tar -cvzf ARCHIVE SOURCE`.

??? success "Solution"
    ```bash
    sudo tar -cvzf /root/local.tgz /usr/local
    sudo tar -tzvf /root/local.tgz
    ```

    **Verify:**

    - the listing starts with `usr/local/` entries (tar strips the leading `/` and says so)
    - `sudo ls -l /root/local.tgz` shows a non-zero size

    `tar` only bundles; `-z` adds gzip compression so you get one smaller `.tgz` file. Use `-j` for bzip2, `-J` for xz.

### Drill 7: Find old files and copy them to a staging directory

**Setup:** a fresh VM may have no files older than 180 days, so create three test files first (one old, one new, one old but in a subdirectory):

```bash
sudo mkdir -p /etc/practice-sub
sudo touch -d '200 days ago' /etc/practice-old.conf /etc/practice-sub/deep-old.conf
sudo touch /etc/practice-new.conf
```

**Task:** As `root` (use `sudo`):

1. Create `/var/tmp/pvt`.
2. Find regular files directly under `/etc` that were modified more than 180 days ago.
3. Copy them to `/var/tmp/pvt`.

**Grader checklist:**

- [ ] the search does not descend into subdirectories (`deep-old.conf` is NOT copied)
- [ ] only regular files are copied (no directories, no symlinks)
- [ ] `/var/tmp/pvt/practice-old.conf` exists and `practice-new.conf` does not
- [ ] `ls /var/tmp/pvt | wc -l` equals `find /etc -maxdepth 1 -type f -mtime +180 | wc -l`

??? question "Hint 1"
    `find` has options for depth, file type, and modification age. `-mtime +180` means "more than 180 days ago".

??? question "Hint 2"
    `find` can run a command on every match with `-exec COMMAND {} \;`, where `{}` stands for the current file.

??? success "Solution"
    ```bash
    sudo mkdir -p /var/tmp/pvt
    sudo find /etc -maxdepth 1 -type f -mtime +180 -exec cp {} /var/tmp/pvt \;
    ls -l /var/tmp/pvt
    ```

    **Verify:**

    ```bash
    ls /var/tmp/pvt | wc -l
    sudo find /etc -maxdepth 1 -type f -mtime +180 | wc -l     # same number
    ls /var/tmp/pvt/practice-old.conf                          # exists
    ls /var/tmp/pvt/deep-old.conf 2>&1                         # No such file or directory
    ```

    - `-maxdepth 1` keeps the search at the top level of `/etc`
    - `-type f` limits the result to regular files

    **Cleanup:** `sudo rm -rf /etc/practice-sub /etc/practice-old.conf /etc/practice-new.conf /var/tmp/pvt`

### Drill 8: Find files that contain a given string

**Setup:** create two test files in `/etc` (one with the word in mixed case, one without it):

```bash
echo "Chrony practice line" | sudo tee /etc/practice-chrony.txt > /dev/null
echo "nothing to see here" | sudo tee /etc/practice-plain.txt > /dev/null
```

**Task:** As `student` (a regular user) or `root`:

1. Search top-level files in `/etc` for the text `chrony`.
2. Ignore case.
3. Print only the filenames that contain a match.

**Grader checklist:**

- [ ] `/etc/practice-chrony.txt` is listed (its text is `Chrony`, not `chrony`)
- [ ] `/etc/practice-plain.txt` is not listed
- [ ] the output is filenames only, not matching lines
- [ ] no "Is a directory" noise confuses the result

??? question "Hint 1"
    `grep` has one option to ignore case, one to list only filenames, and one to control what it does with directories (`-d`).

??? question "Hint 2"
    `/etc/*` expands to files and directories. Either skip directories with `-d skip` or hide errors with `-s` / `2>/dev/null`. A regular user also hits unreadable files like `/etc/shadow`.

??? success "Solution"
    ```bash
    grep -d skip -il chrony /etc/* 2>/dev/null
    ```

    Alternative:

    ```bash
    grep -lis chrony /etc/*
    ```

    **Verify:**

    - `-i` ignores case
    - `-l` prints filenames only
    - `-d skip` avoids directory-content attempts
    - `-s` (or `2>/dev/null`) hides permission errors from unreadable files
    - `/etc/practice-chrony.txt` appears; `/etc/practice-plain.txt` does not

    **Cleanup:** `sudo rm -f /etc/practice-chrony.txt /etc/practice-plain.txt`

### Drill 9: Give one user access to another user's home with ACLs

**Setup:**

```bash
id bob &>/dev/null || sudo useradd -m bob
id dana &>/dev/null || sudo useradd -m dana
sudo -u bob touch /home/bob/existing.txt
```

**Task:** As `root` (use `sudo`):

1. Users `bob` and `dana` exist (created in Setup).
2. Give `dana` full access to `/home/bob` and its current contents.
3. Make new files created later under `/home/bob` inherit the same ACL for `dana`.

**Grader checklist:**

- [ ] `bob` remains the owner of the home directory
- [ ] `getfacl /home/bob` shows `user:dana:rwx` and `default:user:dana:rwx`
- [ ] `existing.txt` also carries `user:dana:rwx`
- [ ] a file `bob` creates later inherits an ACL entry for `dana`
- [ ] `dana` can list `/home/bob` and create a file in it

??? question "Hint 1"
    You need two kinds of ACL entries: an access ACL (applies now) and a default ACL (a template for new files). Recursion (`-R`) handles the existing content.

??? question "Hint 2"
    Default entries are written with a `d:` prefix: `setfacl -R -m d:u:NAME:rwx DIR`.

??? success "Solution"
    ```bash
    sudo setfacl -R -m u:dana:rwx /home/bob
    sudo setfacl -R -m d:u:dana:rwx /home/bob
    getfacl /home/bob
    ```

    **Verify:**

    ```bash
    getfacl /home/bob/existing.txt                    # user:dana:rwx
    sudo -u bob touch /home/bob/new-after-acl.txt
    getfacl /home/bob/new-after-acl.txt               # user:dana:rwx  #effective:rw-  (inherited; the mask limits it)
    sudo -u dana ls /home/bob
    sudo -u dana touch /home/bob/from-dana.txt
    ls -ld /home/bob                                  # still owned by bob (note the trailing +)
    ```

    - `u:dana:rwx` applies to current content
    - `d:u:dana:rwx` becomes the default ACL for new content
    - default ACLs apply to directories; new files inherit them, masked by the creating mode (hence `rw-` on a new file)

    **Persistence:** ACLs are stored on the filesystem and survive a reboot. Reboot and re-run `getfacl /home/bob`.

## Verification steps

1. Confirm you can explain the difference between `>` and `>>`.
2. Confirm you can explain hard link versus symbolic link.
3. Confirm you can verify permissions on both files and directories.
4. Confirm you can list the contents of a compressed archive without extracting it.

## Troubleshooting

### Problem: wrong path

Symptom:

- `scp` or `tar` fails because the file path is incorrect

Fix:

- use `pwd` and `ls`
- confirm source path before running the command again

### Problem: permission denied

Symptom:

- cannot enter a directory or read a file

Fix:

- inspect permissions with `ls -ld` and `stat`
- fix directory execute permission if traversal is blocked

### Problem: command not found

Symptom:

- system says `apropos` or `bzip2` is unavailable

Fix:

- check `command -v apropos`
- use local package tools to identify whether the package is installed

### Problem: bad syntax

Symptom:

- `sed` or `awk` does not print expected output

Fix:

- start with the simplest pattern first
- test on a small file before using a larger one

### Problem: remote copy fails

Symptom:

- `scp` cannot connect

Fix:

- verify hostname resolution or use IP
- check `sshd` on the remote host
- test with plain `ssh` first

## Common mistakes

Merged from the beginner list and the recovery list:

- **Mistake:** using the wrong path. **Recovery:** run `pwd` and `ls` before the command.
- **Mistake:** overwriting files with `>`. **Recovery:** use `>>` to append, or `cp` the file first.
- **Mistake:** confusing hard links and symbolic links. **Recovery:** `ls -li` shows hard links sharing one inode; `ls -l` shows `->` for symbolic links.
- **Mistake:** forgetting recursion options. **Recovery:** add `-R` (`setfacl`, `chmod`, `cp -r`).
- **Mistake:** setting file permissions correctly but directory permissions incorrectly. **Recovery:** test with `ls -ld` and `cd`; directories need `x` to enter.
- **Mistake:** using `rm -r` in the wrong directory. **Recovery:** run `pwd` before destructive commands.
- **Mistake:** using the wrong archive option. **Recovery:** review `tar -czvf`, `tar -cjvf`, and `tar -xvf`.
- **Mistake:** `sudo grep x file > /root/out` fails with "Permission denied". **Recovery:** the redirection runs as you; use `sudo -i` first, or `grep x file | sudo tee /root/out`.

## Mini quiz

1. What does `apropos` help you do?
2. What does `awk -F:` mean?
3. What is the difference between a hard link and a symbolic link?
4. What command lists the contents of a `tar.gz` archive without extracting it?
5. What does `chmod 2775 DIR` do on a shared directory?

??? success "Answers"
    1. Find commands or manuals by keyword.
    2. It sets `:` as the field separator.
    3. Hard links point to the same inode; symbolic links point by path.
    4. `tar -tzvf archive.tar.gz`
    5. It gives the owner and group `rwx` and others `r-x`, and the leading `2` sets the setgid bit so new files inherit the directory's group.

## Exam-style tasks

### Exam-Style Task 1

**Setup:** none (the task creates everything).

**Task:** Create a lab directory `~/exam1-lab` with sample files (`app.log`, `users.txt`), search and transform text from those files, archive the directory to `/tmp/exam1-lab.tar.gz`, and prove the archive is valid.

**Grader checklist:**

- [ ] files and directory exist
- [ ] search output succeeds (`grep` finds a word in `app.log`)
- [ ] archive file `/tmp/exam1-lab.tar.gz` exists
- [ ] archive listing command succeeds

??? question "Hint 1"
    Create the files with `printf ... >`, search with `grep`, transform with `sed`, archive with `tar -czvf`, prove with `tar -tzvf`.

??? success "Solution"
    ```bash
    mkdir -p ~/exam1-lab
    printf "servera sshd running\nserverb sshd stopped\n" > ~/exam1-lab/app.log
    printf "alice\nbob\n" > ~/exam1-lab/users.txt
    grep sshd ~/exam1-lab/app.log
    sed 's/stopped/active/' ~/exam1-lab/app.log
    tar -czvf /tmp/exam1-lab.tar.gz ~/exam1-lab
    tar -tzvf /tmp/exam1-lab.tar.gz
    ```

    **Verify:** the `tar -tzvf` listing shows `exam1-lab/app.log` and `exam1-lab/users.txt` and exits with status 0 (`echo $?`).

### Exam-Style Task 2

**Setup:**

```bash
sudo groupadd -f labteam
mkdir -p ~/foundations-lab
```

**Task:** Create a shared directory `/srv/projectshare` for the group `labteam` where new files inherit the group, and create both a hard link (`original.hard`) and a symbolic link (`original.soft`) to a test file `~/foundations-lab/original.txt`.

**Grader checklist:**

- [ ] `/srv/projectshare` exists with group `labteam`
- [ ] the setgid bit is present (`drwxrwsr-x`)
- [ ] hard link and symbolic link both exist
- [ ] the symbolic link resolves correctly (`cat ~/foundations-lab/original.soft` works)

??? question "Hint 1"
    Same pattern as Drill 2 for the directory. For the links: `ln` makes a hard link, `ln -s` a symbolic one; `ls -li` proves the hard link.

??? success "Solution"
    ```bash
    sudo mkdir -p /srv/projectshare
    sudo chgrp labteam /srv/projectshare
    sudo chmod 2775 /srv/projectshare
    touch ~/foundations-lab/original.txt
    ln ~/foundations-lab/original.txt ~/foundations-lab/original.hard
    ln -s ~/foundations-lab/original.txt ~/foundations-lab/original.soft
    ls -li ~/foundations-lab
    ls -ld /srv/projectshare
    ```

    **Verify:**

    - `ls -ld /srv/projectshare` shows `drwxrwsr-x` and group `labteam`
    - `original.txt` and `original.hard` show the same inode number and link count `2`
    - `original.soft` shows `-> /home/student/foundations-lab/original.txt`

    **Persistence:** links and permissions live on disk; they survive a reboot.

## Must survive reboot

!!! warning "Must survive reboot"
    | Change | Persistent? | Notes |
    |---|---|---|
    | `chmod`, `chgrp`, `setfacl` on files in `/srv`, `/var/tmp`, `/home` | Yes | stored on the filesystem |
    | Files and directories under `/tmp` | No guarantee | `/tmp` can be cleaned at boot or by age rules <!-- VERIFY: /tmp cleanup on RHEL 10 --> |
    | `useradd`, `groupadd` | Yes | written to `/etc/passwd`, `/etc/group` |
    | Shell variables, `cd`, unexported aliases | No | gone when the shell exits |

**Verify like a grader:** `ls -ld`, `getfacl`, `tar -tzvf`, then reboot and check again.

## Summary

- search help locally before panic
- use `grep`, `sed`, and `awk` together
- verify archives before trusting them
- permissions on directories matter a lot

| Task | Command |
|---|---|
| Find a command by keyword | `apropos archive` |
| Numbered search | `grep -n ssh /etc/services` |
| Print lines 1 to 5 | `sed -n '1,5p' file.txt` |
| Print first field | `awk -F: '{print $1}' /etc/passwd` |
| Create archive | `tar -czvf backup.tar.gz DIR` |
| List archive | `tar -tzvf backup.tar.gz` |
| Remote login / copy | `ssh user@host`, `scp file user@host:/tmp/` |
| Hard / symbolic link | `ln file hardlink`, `ln -s file symlink` |
| Shared directory | `chmod 2775 DIR` |

**Previous:** [23 VM Lab Setup and Baseline Checks](23-vm-lab-setup-and-baseline-checks.md) · **Next:** [25 Administration Core Labs](25-administration-core-labs.md): move on only when shell, file, text, archive, SSH, and permissions tasks feel routine.
