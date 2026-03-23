# 1. Title

Links, Permissions, and Default Permissions

# 2. Purpose

Teach you how hard links and symbolic links work, how standard `ugo/rwx` permissions are read and changed, and how default file permissions are influenced by `umask`.

# 3. Why this matters for RHCSA

Permissions and links are core RHCSA tasks. Many failures that look like "Linux is broken" are really permission or path problems.

# 4. Real-world use

Admins manage shared directories, protect private data, and create links to files and directories for easier access or compatibility.

# 5. Prerequisites

- Read `00-study-skills-and-offline-help.md`
- Read `01-shell-basics-and-command-syntax.md`
- Read `02-files-directories-and-text-editing.md`

# 6. Objectives covered

- Create hard and soft links
- List, set, and change standard `ugo/rwx` permissions
- Manage default file permissions
- Diagnose and correct file permission problems

# 7. Commands/tools used

`ls`, `ln`, `chmod`, `umask`, `touch`, `mkdir`, `stat`, `id`

# 8. Offline help references for this topic

- `man ln`
- `man chmod`
- `help umask`
- `man umask`
- `man stat`

# 9. Estimated study time

5 hours

# 10. Common beginner mistakes

- Confusing hard links and symbolic links
- Forgetting execute permission on directories
- Using the wrong permission target: user, group, or others
- Applying file-style thinking to directories
- Changing permissions without verifying the effect

## Concept Explanation In Simple Language

Permissions control who can do what.

```mermaid
flowchart TD
    A["File or directory"] --> B["User u"]
    A --> C["Group g"]
    A --> D["Others o"]
    B --> E["r"]
    B --> F["w"]
    B --> G["x"]
    C --> E
    C --> F
    C --> G
    D --> E
    D --> F
    D --> G
```

```mermaid
flowchart LR
    A["original.txt"] --> B["hard link"]
    A -. "path target" .-> C["symbolic link"]
    B --> D["same inode and data"]
    C --> E["different inode, points to path"]
```

The standard permission sets are:

- user (`u`)
- group (`g`)
- others (`o`)

The standard permission types are:

- read (`r`)
- write (`w`)
- execute (`x`)

### Reading `ls -l`

Example:

```text
-rw-r--r--
```

Meaning:

- file type: `-` regular file
- user: `rw-`
- group: `r--`
- others: `r--`

For directories:

- `r` lets you list names
- `w` lets you change entries
- `x` lets you enter the directory

### Hard Links vs Symbolic Links

Hard link:

- another directory entry pointing to the same file data
- usually cannot cross filesystems
- usually not for directories
- shares the same inode as the original file

An inode is the filesystem's internal identity record for a file. You do not need deep filesystem theory for RHCSA, but you should know this:

- same inode usually means the same underlying file data
- hard links share an inode
- symbolic links do not share the inode of their target

Symbolic link:

- a special file that points to a path
- can cross filesystems
- can point to directories

### Default Permissions and `umask`

`umask` removes permission bits from default creation modes.

Common idea:

- regular files often start from `666`
- directories often start from `777`
- `umask` subtracts from those defaults

## Command Breakdowns

### Create links

```bash
ln original.txt hardlink.txt
ln -s original.txt symlink.txt
```

### Change permissions with symbolic mode

```bash
chmod u+x script.sh
chmod g-w file.txt
chmod o-r file.txt
chmod u=rw,g=r,o= file.txt
```

### Change permissions with numeric mode

```bash
chmod 644 file.txt
chmod 600 secret.txt
chmod 755 script.sh
chmod 700 private-dir
```

### Check default mask

```bash
umask
umask -S
```

## Worked Examples

### Worked Example 1: Create Hard and Symbolic Links

```bash
echo "demo" > original.txt
ln original.txt hardlink.txt
ln -s original.txt symlink.txt
ls -li original.txt hardlink.txt symlink.txt
```

Verification:

- hard link and original should share the same inode
- symlink should show a different file type and a target path

### Worked Example 2: Lock Down a Secret File

```bash
echo "secret" > secret.txt
chmod 600 secret.txt
ls -l secret.txt
```

Verification:

- permissions should show `-rw-------`

### Worked Example 3: See the Effect of `umask`

```bash
umask
touch masktest.txt
mkdir maskdir
ls -ld masktest.txt maskdir
```

Verification:

- compare created permissions to the current `umask`

## Guided Hands-On Lab

### Lab Goal

Create and inspect links, set permissions correctly, and observe default permission behavior.

### Setup

```bash
cd
mkdir -p rhcsa-perm-lab
cd rhcsa-perm-lab
```

### Task Steps

1. Create `report.txt` with one line of text.
2. Create a hard link named `report.hard`.
3. Create a symbolic link named `report.soft`.
4. List all three with `ls -li`.
5. Change `report.txt` permissions to `640`.
6. Create a directory `shared` and set permissions to `775`.
7. Create a directory `private` and set permissions to `700`.
8. Display the symbolic form of `umask`.
9. Create a new file and new directory and inspect their permissions.
10. Remove the original file and observe what happens to the hard link and symbolic link.

### Expected Result

You can explain how links differ and you can set practical file and directory permissions confidently.

### Verification Commands

```bash
ls -li report.txt report.hard report.soft
ls -ld shared private
umask -S
```

## Independent Practice Tasks

1. Create a file and both link types pointing to it.
2. Set a file so only the owner can read and write it.
3. Set a script file to be executable by everyone.
4. Create a directory that only root or the owner can access.
5. Change a file from numeric mode `644` to `600`.
6. Observe default permissions before and after changing `umask` in the current shell.

## Verification Steps

1. Confirm hard links share the same inode using `ls -i`.
2. Confirm symbolic links display with `l` in `ls -l`.
3. Confirm permission changes with `ls -l` or `stat`.
4. Confirm directory execute permission affects entry into the directory.

## Troubleshooting Section

### Problem: `Permission denied` on a directory

Cause:

- missing execute permission on the directory

Fix:

- inspect with `ls -ld dir`
- add `x` where appropriate

### Problem: Symbolic link is broken

Cause:

- target path is wrong or target file was removed

Fix:

- inspect with `ls -l`
- recreate the link with the correct path

### Problem: Hard link not allowed

Cause:

- target is on another filesystem or is a directory

Fix:

- use a symbolic link instead

### Problem: Permission change did not solve access issue

Cause:

- wrong user, wrong group, directory permissions, ACLs, or SELinux may also matter

Fix:

- verify identity and the whole path, not just one file

## Common Mistakes And Recovery

- Mistake: setting `777` everywhere.
  Recovery: use only the minimum needed permissions.

- Mistake: thinking file execute permission works the same as directory execute permission.
  Recovery: remember directory `x` means traversal or entry.

- Mistake: forgetting that symbolic links point to paths.
  Recovery: check link target with `ls -l`.

- Mistake: not verifying default permission behavior.
  Recovery: create a fresh file after checking `umask`.

## Mini Quiz

1. What is the difference between a hard link and a symbolic link?
2. What does `chmod 600 file` mean?
3. What does execute permission mean on a directory?
4. What command creates a symbolic link?
5. What command shows the shell's default permission mask?
6. Why might a symbolic link fail after the original file is removed?

## Exam-Style Tasks

### Task 1

Create `/tmp/permtest.txt`, place text inside it, create:

- a hard link `/tmp/permtest.hard`
- a symbolic link `/tmp/permtest.soft`

Then set the original file permissions so only the owner can read and write it.

### Grader Mindset Checklist

- all three paths must exist
- hard link must share inode with the original
- symbolic link must point to the original path
- original file permissions must be `600`

### Task 2

Create a directory `/tmp/project-private` that only its owner can access, and a directory `/tmp/project-shared` that owner and group can fully use while others can only read and enter.

### Grader Mindset Checklist

- both directories must exist
- private directory should be `700`
- shared directory should be `775`

## Answer Key / Solution Guide

### Quiz Answers

1. Hard links point to the same file data. Symbolic links point to a path.
2. Owner can read and write. Group and others have no permissions.
3. It allows entering or traversing the directory.
4. `ln -s target linkname`
5. `umask` or `umask -S`
6. Because the symlink target path no longer resolves to a valid file.

### Exam-Style Task 1 Example Solution

```bash
echo "data" > /tmp/permtest.txt
ln /tmp/permtest.txt /tmp/permtest.hard
ln -s /tmp/permtest.txt /tmp/permtest.soft
chmod 600 /tmp/permtest.txt
ls -li /tmp/permtest.txt /tmp/permtest.hard /tmp/permtest.soft
```

### Exam-Style Task 2 Example Solution

```bash
mkdir /tmp/project-private /tmp/project-shared
chmod 700 /tmp/project-private
chmod 775 /tmp/project-shared
ls -ld /tmp/project-private /tmp/project-shared
```

## Recap / Memory Anchors

- hard links share data
- symlinks point to paths
- `chmod` changes permissions
- `600` protects private files
- `700` protects private directories
- `775` is common for shared directories
- `umask` shapes default creation permissions

## Quick Command Summary

```bash
ln file hardlink
ln -s file symlink
chmod 644 file
chmod 600 secret
chmod 755 script
chmod 700 private-dir
chmod 775 shared-dir
umask
umask -S
ls -li
stat file
```
