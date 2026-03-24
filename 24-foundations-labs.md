# Foundations Labs

> Let you test shell, file, text-processing, remote access, archive, and permissions skills through direct hands-on questions.

## At a Glance

**Why this matters for RHCSA**

These are the commands you will use constantly during the exam. If the foundations are slow, every advanced task becomes slower and riskier.

**Real-world use**

Real administrators read docs, create files, edit configuration, search logs, copy files, and fix permissions every day.

**Estimated study time**

4 to 6 hours

## Prerequisites

- A working VM lab
- Basic shell access
- Lesson `00` to `06` completed, or enough prior knowledge to attempt direct lab work

## Objectives Covered

- Shell syntax and offline help
- Files, directories, and text editing
- Redirection, pipes, `grep`, regex, `sed`, and `awk`
- Archives and compression
- SSH, `scp`, and remote command workflows
- Links, permissions, `umask`, and special permissions

## Commands/Tools Used

`man`, `apropos`, `pwd`, `ls`, `cp`, `mv`, `rm`, `cat`, `less`, `grep`, `sed`, `awk`, `tar`, `gzip`, `bzip2`, `ssh`, `scp`, `ln`, `chmod`, `umask`, `stat`

## Offline Help References For This Topic

- `man grep`
- `man sed`
- `man awk`
- `man tar`
- `man ssh`
- `man chmod`
- `man umask`
- `apropos permission`

## Common Beginner Mistakes

- Using the wrong path
- Overwriting files with `>`
- Confusing hard links and symbolic links
- Forgetting recursion options
- Setting file permissions correctly but directory permissions incorrectly

## Concept explanation in simple language

This lab file is about command fluency. You should be able to do simple work quickly and correctly:

- find help
- create and move files
- search and filter text
- archive and extract data
- log in to another host
- set correct permissions

These tasks are not “small.” They are the base layer under almost every RHCSA task.

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

## Guided hands-on lab

### Lab goal

Prove you can perform the main RHCSA foundation tasks without step-by-step instructions.

### Setup

Create a working directory such as `~/foundations-lab`.

### Task steps

1. Create `~/foundations-lab`.
2. Create three files named `app.log`, `users.txt`, and `notes.txt`.
3. Put sample text in the files.
4. Use `grep` to find specific words.
5. Use `sed` to replace one word in output.
6. Use `awk` to print only selected fields from `/etc/passwd`.
7. Create a `tar.gz` archive of the lab directory.
8. If `serverb` exists, copy the archive to it with `scp`.
9. Create one hard link and one symbolic link.
10. Create a directory named `/tmp/shared-foundations` and set group-sharing style permissions on it.

### Expected result

- the lab directory exists
- text-processing commands work
- the archive can be listed
- links work
- permissions are intentional and verifiable

### Verification commands

```bash
ls -l ~/foundations-lab
tar -tzvf /tmp/foundations-lab.tar.gz
ls -li ~/foundations-lab
stat /tmp/shared-foundations
```

### Cleanup

Remove only temporary files if you want. Keep useful lab notes.

## Independent practice tasks

1. Use `apropos` to find commands related to archives.
2. Use `grep -n` to search `/etc/services` for `ssh`.
3. Use `sed -n '1,5p'` on a file of your choice.
4. Use `awk -F:` to print usernames from `/etc/passwd`.
5. Create a `tar.bz2` archive and list its contents.
6. Create a symbolic link that breaks, then fix it.
7. Create a directory with sticky bit behavior and explain why it is useful.

## Subtitle-derived practice set

These drills come from RHCSA-style question patterns collected from subtitle notes and then corrected into safe, exam-usable commands.

### Drill 1: ACL check on a copied system file

As `root`, copy `/etc/fstab` to `/var/tmp/fstab.practice`.

Then:

1. Give user `natasha` read and write access.
2. Make sure group `mac` has no access.
3. Verify the ACL entries explicitly.

What to check before moving on:

- the file exists
- standard ownership still makes sense
- ACL entries show the exact user and group rules

### Drill 2: Shared project directory with SGID

As `root`:

1. Create a group named `projectops`.
2. Create `/srv/projectops`.
3. Change the group owner of the directory to `projectops`.
4. Set permissions so members can create files collaboratively and new files inherit the group automatically.

What to check before moving on:

- `ls -ld /srv/projectops` shows the group correctly
- the mode includes the SGID bit
- new files created inside inherit the `projectops` group

### Drill 3: Sticky-bit drop zone

As `root`:

1. Create `/srv/dropbox`.
2. Set it so everyone can create files there.
3. Prevent normal users from deleting each other's files.

What to check before moving on:

- the mode ends with a sticky-bit indicator such as `t`
- write access exists for all intended users
- the directory purpose is clear from the permissions

### Drill 4: Text extraction speed drill

As a regular user:

1. Print only usernames from `/etc/passwd` using `awk`.
2. Print only the first five lines of `/etc/services` using `sed`.
3. Find all lines in `/etc/passwd` that end with `/bin/bash`.

What to check before moving on:

- each command prints only the requested data
- you can explain the separator or regex used
- you can repeat the commands from memory

## Verification steps

1. Confirm you can explain the difference between `>` and `>>`.
2. Confirm you can explain hard link versus symbolic link.
3. Confirm you can verify permissions on both files and directories.
4. Confirm you can list the contents of a compressed archive without extracting it.

## Troubleshooting section

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

## Common mistakes and recovery

- Mistake: using `rm -r` in the wrong directory.
  Recovery: run `pwd` before destructive commands.
- Mistake: forgetting that directory permissions affect access differently from file permissions.
  Recovery: test with `ls -ld` and `cd`.
- Mistake: using the wrong archive option.
  Recovery: review `tar -czvf`, `tar -cjvf`, and `tar -xvf`.

## Mini quiz

1. What does `apropos` help you do?
2. What does `awk -F:` mean?
3. What is the difference between a hard link and a symbolic link?
4. What command lists the contents of a `tar.gz` archive without extracting it?
5. What does `chmod 2775 DIR` do on a shared directory?

## Exam-style tasks

### Exam-Style Task 1

Create a lab directory with sample files, search and transform text from those files, archive the directory, and prove the archive is valid.

Grader mindset checklist:

- files and directory must exist
- search output should succeed
- archive file must exist
- archive listing command should succeed

### Exam-Style Task 2

Create a shared directory for a project team where new files inherit the group, and create both a hard link and a symbolic link related to a test file.

Grader mindset checklist:

- shared directory must exist
- setgid bit should be present
- hard link and symbolic link should both exist
- symbolic link should resolve correctly

## Answer key / solution guide

### Mini quiz answers

1. Find commands or manuals by keyword.
2. It sets `:` as the field separator.
3. Hard links point to the same inode; symbolic links point by path.
4. `tar -tzvf archive.tar.gz`
5. It sets group inheritance and standard shared directory permissions.

### Exam-Style Task 1 example solution

```bash
mkdir -p ~/foundations-lab
printf "servera sshd running\nserverb sshd stopped\n" > ~/foundations-lab/app.log
grep sshd ~/foundations-lab/app.log
sed 's/stopped/active/' ~/foundations-lab/app.log
tar -czvf /tmp/foundations-lab.tar.gz ~/foundations-lab
tar -tzvf /tmp/foundations-lab.tar.gz
```

### Exam-Style Task 2 example solution

```bash
sudo mkdir -p /srv/projectshare
sudo chgrp root /srv/projectshare
sudo chmod 2775 /srv/projectshare
touch ~/foundations-lab/original.txt
ln ~/foundations-lab/original.txt ~/foundations-lab/original.hard
ln -s ~/foundations-lab/original.txt ~/foundations-lab/original.soft
ls -li ~/foundations-lab
ls -ld /srv/projectshare
```

### Subtitle-derived practice set solutions

#### Drill 1 example solution

```bash
sudo cp /etc/fstab /var/tmp/fstab.practice
sudo setfacl -m u:natasha:rw /var/tmp/fstab.practice
sudo setfacl -m g:mac:--- /var/tmp/fstab.practice
getfacl /var/tmp/fstab.practice
ls -l /var/tmp/fstab.practice
```

Verification:

- `getfacl /var/tmp/fstab.practice` should show `user:natasha:rw-`
- `getfacl /var/tmp/fstab.practice` should show `group:mac:---`

#### Drill 2 example solution

```bash
sudo groupadd projectops
sudo mkdir -p /srv/projectops
sudo chgrp projectops /srv/projectops
sudo chmod 2775 /srv/projectops
ls -ld /srv/projectops
touch /srv/projectops/testfile
ls -l /srv/projectops/testfile
```

Verification:

- the directory mode should include `rwxrwsr-x`
- new files should inherit group `projectops`

#### Drill 3 example solution

```bash
sudo mkdir -p /srv/dropbox
sudo chmod 1777 /srv/dropbox
ls -ld /srv/dropbox
```

Verification:

- the mode should look similar to `drwxrwxrwt`
- the trailing `t` confirms sticky-bit behavior

#### Drill 4 example solution

```bash
awk -F: '{print $1}' /etc/passwd
sed -n '1,5p' /etc/services
grep '/bin/bash$' /etc/passwd
```

Verification:

- `awk` should print usernames only
- `sed` should print exactly five lines
- `grep` should match only Bash-shell entries

## Recap / memory anchors

- search help locally before panic
- use `grep`, `sed`, and `awk` together
- verify archives before trusting them
- permissions on directories matter a lot

## Quick command summary

```bash
apropos archive
grep -n ssh /etc/services
sed -n '1,5p' file.txt
awk -F: '{print $1}' /etc/passwd
tar -czvf backup.tar.gz DIR
tar -tzvf backup.tar.gz
ssh user@host
scp file user@host:/tmp/
ln file hardlink
ln -s file symlink
chmod 2775 DIR
```
