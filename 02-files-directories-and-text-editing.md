# 1. Title

Files, Directories, and Text Editing

# 2. Purpose

Teach you how to create, inspect, copy, move, rename, delete, and edit files and directories safely from the command line.

# 3. Why this matters for RHCSA

Most RHCSA tasks involve files: configuration files, logs, user files, service files, and mount points. If file handling is slow or careless, every admin task becomes harder.

# 4. Real-world use

Administrators constantly create directories, back up configuration files, edit text, inspect logs, and move data into correct locations.

# 5. Prerequisites

- Read `00-study-skills-and-offline-help.md`
- Read `01-shell-basics-and-command-syntax.md`

# 6. Objectives covered

- Create and edit text files
- Create, delete, copy, and move files and directories
- Access a shell prompt and issue commands with correct syntax

# 7. Commands/tools used

`touch`, `mkdir`, `rmdir`, `cp`, `mv`, `rm`, `cat`, `less`, `head`, `tail`, `wc`, `file`, `stat`, `nano` or `vim`, `echo`, `printf`

# 8. Offline help references for this topic

- `man touch`
- `man mkdir`
- `man cp`
- `man mv`
- `man rm`
- `man stat`
- `man file`
- `man nano` or `man vim`

# 9. Estimated study time

5 hours

# 10. Common beginner mistakes

- Deleting the wrong file because you did not check the path
- Using `rm -r` carelessly
- Confusing copy and move
- Overwriting a file by accident
- Editing a file without making a backup
- Forgetting that Linux file names are case-sensitive

## Concept Explanation In Simple Language

A file stores data. A directory stores file names and other directories. Linux treats many things as files, including configuration data.

### Common File Actions

- create a file
- read a file
- change a file
- copy a file
- move or rename a file
- delete a file

### Case Sensitivity

These are different names:

- `report.txt`
- `Report.txt`
- `REPORT.TXT`

### Safe Administration Habit

Before editing an important file:

1. confirm the file path
2. make a backup copy
3. edit carefully
4. verify the result

Example:

```bash
cp /etc/hosts /etc/hosts.bak
```

### Text Editors

You need at least one command-line editor. Different systems may have different editors available. For RHCSA study, be able to use one of these confidently:

- `vim`
- `nano`

If your exam environment uses `vim`, you should practice `vim` enough to open, insert text, save, and quit.

## Command Breakdowns

### `touch`

```bash
touch notes.txt
```

Creates an empty file if it does not exist.

### `mkdir`

```bash
mkdir lab
mkdir -p projects/rhcsa/notes
```

- `-p` creates parent directories as needed.

### `cp`

```bash
cp file1 file2
cp -r dir1 dir2
cp -a source target
```

- `-r` copies directories recursively
- `-a` preserves more attributes and is useful for backups

### `mv`

```bash
mv oldname newname
mv file.txt /tmp/
```

Moves or renames files.

### `rm`

```bash
rm file.txt
rm -r olddir
```

Danger:

- `rm` deletes
- `rm -r` deletes directories recursively
- there is no normal trash safety in plain shell use

### `cat`, `less`, `head`, `tail`

```bash
cat file.txt
less file.txt
head -n 5 file.txt
tail -n 5 file.txt
```

Use:

- `cat` for short files
- `less` for reading longer files
- `head` and `tail` for the beginning or end

### `stat`

```bash
stat file.txt
```

Shows detailed metadata such as size, timestamps, and permissions.

### `file`

```bash
file /etc/passwd
```

Identifies file type.

## Worked Examples

### Worked Example 1: Create and Inspect a Practice File

Commands:

```bash
touch practice.txt
ls -l practice.txt
stat practice.txt
file practice.txt
```

Expected result:

- `practice.txt` exists
- `ls -l` shows size and permissions
- `stat` shows metadata
- `file` identifies it as empty or text depending on contents

Verification:

- confirm the file exists in the intended directory

### Worked Example 2: Build and Copy a Directory Tree

Commands:

```bash
mkdir -p lab1/docs
touch lab1/docs/notes1.txt
cp -r lab1 lab1-copy
find lab1-copy
```

Expected result:

- a copied directory tree named `lab1-copy`

Verification:

- `find lab1-copy` should show the copied files and directories

### Worked Example 3: Back Up and Edit a Text File

Commands:

```bash
echo "first line" > notes.txt
cp notes.txt notes.txt.bak
echo "second line" >> notes.txt
cat notes.txt
cat notes.txt.bak
```

Expected result:

- original content saved in `notes.txt.bak`
- updated content in `notes.txt`

Verification:

- `notes.txt` should have two lines
- backup should still have the original one line

## Guided Hands-On Lab

### Lab Goal

Create, inspect, copy, move, edit, and remove files and directories safely.

### Setup

Use your home directory as a workspace:

```bash
cd
mkdir -p rhcsa-file-lab
cd rhcsa-file-lab
```

### Task Steps

1. Create directories `configs`, `logs`, and `archive`.
2. Create files `configs/app.conf`, `configs/db.conf`, and `logs/app.log`.
3. Put sample text into the config files with `echo` or your editor.
4. Display both config files with `cat`.
5. Create a backup directory `archive/backup1`.
6. Copy the `configs` directory into `archive/backup1`.
7. Rename `logs/app.log` to `logs/app.log.1`.
8. Create a file `todo.txt` and edit it with your text editor.
9. Inspect `todo.txt` with `cat`, `wc -l`, and `stat`.
10. Remove an unneeded file you created by mistake.
11. Remove an empty directory with `rmdir`.

### Expected Result

You end with a small directory tree containing original files, backups, and at least one edited text file that you can inspect from the shell.

### Verification Commands

```bash
find .
cat configs/app.conf
cat todo.txt
stat todo.txt
wc -l todo.txt
```

### Cleanup

Optional:

```bash
cd
rm -r rhcsa-file-lab
```

## Independent Practice Tasks

1. Create a directory tree `practice/a/b/c` with one command.
2. Create three empty files inside `practice/a`.
3. Copy one file to a new name and verify both copies exist.
4. Move one file from `practice/a` to `practice/a/b`.
5. Rename a directory without changing its contents.
6. Create a text file with at least three lines and display only the first two lines.
7. Make a backup copy of that text file before editing it.
8. Delete an empty directory and then delete a directory that contains files.

## Verification Steps

1. Use `find` or `ls -R` to prove your directory structure exists.
2. Use `cat`, `head`, or `tail` to prove file contents are correct.
3. Use `stat` to confirm the file you edited is the one you intended.
4. Verify backups exist before deleting originals.

## Troubleshooting Section

### Problem: `No such file or directory`

Cause:

- typo in path
- parent directory does not exist

Fix:

- check with `pwd`
- list nearby directories with `ls`
- use `mkdir -p` when creating nested directories

### Problem: `Is a directory`

Cause:

- you used a file command on a directory incorrectly

Fix:

- inspect with `ls`
- if copying a directory, use `cp -r`

### Problem: `rm: cannot remove`

Cause:

- permissions problem or directory requires recursive removal

Fix:

- check ownership and permissions
- for directories, use `rm -r` carefully

### Problem: You overwrote the wrong file

Cause:

- target path was wrong

Fix:

- restore from backup if available
- build the habit of `cp file file.bak` before editing

### Problem: Editor feels confusing

Fix:

- practice only a few basic actions first:
  - open file
  - insert text
  - save
  - quit

## Common Mistakes And Recovery

- Mistake: using `mv` when you meant `cp`.
  Recovery: check whether the source still exists. If not, move it back.

- Mistake: deleting before verifying backup.
  Recovery: create and inspect backup first.

- Mistake: forgetting `-r` when copying a directory.
  Recovery: rerun with `cp -r`.

- Mistake: editing a system file directly without a safety copy.
  Recovery: adopt a standard backup suffix such as `.bak`.

- Mistake: confusing file names that differ only by uppercase and lowercase.
  Recovery: list with `ls -l` and inspect exact names.

## Mini Quiz

1. What command creates an empty file?
2. What option lets `mkdir` create parent directories too?
3. What is the difference between `cp` and `mv`?
4. Why is `rm -r` dangerous?
5. What command shows detailed file metadata?
6. What command is better for reading a long file one screen at a time?

## Exam-Style Tasks

### Task 1

Create this structure under `/tmp/adminlab`:

- directory `configs`
- directory `backups`
- file `configs/web.conf`
- file `configs/db.conf`

Add one line of sample text to each config file. Then make a backup copy of the entire `configs` directory into `backups/configs-copy`.

### Grader Mindset Checklist

- `/tmp/adminlab/configs` must exist
- both config files must exist
- each file must contain text
- `/tmp/adminlab/backups/configs-copy` must exist
- copied files must still be present in the backup directory

### Task 2

Create `/tmp/editcheck.txt` with at least three lines, then:

- append one more line
- make a backup named `/tmp/editcheck.txt.bak`
- display only the last two lines of the edited file

### Grader Mindset Checklist

- edited file and backup must both exist
- main file must have at least four lines
- backup should represent the file state at the time you copied it
- `tail` or equivalent command should succeed

## Answer Key / Solution Guide

### Quiz Answers

1. `touch`
2. `-p`
3. `cp` duplicates. `mv` moves or renames.
4. It recursively deletes and can remove large directory trees quickly.
5. `stat`
6. `less`

### Exam-Style Task 1 Example Solution

```bash
mkdir -p /tmp/adminlab/configs /tmp/adminlab/backups
echo "web_port=8080" > /tmp/adminlab/configs/web.conf
echo "db_name=appdb" > /tmp/adminlab/configs/db.conf
cp -r /tmp/adminlab/configs /tmp/adminlab/backups/configs-copy
find /tmp/adminlab
```

### Exam-Style Task 2 Example Solution

```bash
printf "line1\nline2\nline3\n" > /tmp/editcheck.txt
cp /tmp/editcheck.txt /tmp/editcheck.txt.bak
echo "line4" >> /tmp/editcheck.txt
tail -n 2 /tmp/editcheck.txt
```

## Recap / Memory Anchors

- `touch` creates files.
- `mkdir -p` creates directory paths.
- `cp` copies. `mv` moves or renames.
- `rm` deletes, so verify paths first.
- `cat`, `less`, `head`, and `tail` help inspect content.
- `stat` proves details.
- Back up important files before editing.

## Quick Command Summary

```bash
touch file.txt
mkdir -p dir/subdir
cp file.txt file.txt.bak
cp -r dir dir-copy
mv oldname newname
rm file.txt
rm -r dir
cat file.txt
less file.txt
head -n 5 file.txt
tail -n 5 file.txt
wc -l file.txt
file file.txt
stat file.txt
```
