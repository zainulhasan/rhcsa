# 1. Title

Archives, Compression, and Secure File Transfer

# 2. Purpose

Teach you how to bundle files into archives, compress and uncompress them, and securely transfer files between systems.

# 3. Why this matters for RHCSA

RHCSA includes `tar`, `gzip`, and `bzip2`, and real administration often involves packaging logs, backing up directories, and moving files between systems securely.

# 4. Real-world use

Admins archive configuration directories before changes, compress log bundles, and copy files between servers using secure tools such as `scp` and `sftp`.

# 5. Prerequisites

- Read `00-study-skills-and-offline-help.md`
- Read `01-shell-basics-and-command-syntax.md`
- Read `02-files-directories-and-text-editing.md`

# 6. Objectives covered

- Archive, compress, unpack, and uncompress files using `tar`, `gzip`, and `bzip2`
- Securely transfer files between systems
- Access remote systems using SSH

# 7. Commands/tools used

`tar`, `gzip`, `gunzip`, `bzip2`, `bunzip2`, `scp`, `sftp`, `ssh`, `ls`, `file`

# 8. Offline help references for this topic

- `man tar`
- `man gzip`
- `man bzip2`
- `man scp`
- `man sftp`

# 9. Estimated study time

3 hours

# 10. Common beginner mistakes

- Compressing a directory with the wrong tool directly instead of using `tar`
- Forgetting where extracted files will appear
- Mixing up archive creation and extraction options
- Copying files to the wrong remote path
- Not verifying that a transferred file matches the original

## Concept Explanation In Simple Language

An archive bundles files together. Compression makes data smaller. They are related but not identical.

Common pattern:

1. create archive with `tar`
2. compress archive with `gzip` or `bzip2`

### Common File Types

- `.tar` archive only
- `.tar.gz` or `.tgz` tar archive compressed with gzip
- `.tar.bz2` tar archive compressed with bzip2

### Secure Transfer

Use SSH-based tools when moving files between systems:

- `scp` for quick copy
- `sftp` for interactive transfer

## Command Breakdowns

### Create a tar archive

```bash
tar -cvf configs.tar configs/
```

- `-c` create
- `-v` verbose
- `-f` archive file name follows

### Extract a tar archive

```bash
tar -xvf configs.tar
```

- `-x` extract

### Create gzip-compressed archive

```bash
tar -czvf configs.tar.gz configs/
```

### Create bzip2-compressed archive

```bash
tar -cjvf configs.tar.bz2 configs/
```

### Uncompress gzip or bzip2 files

```bash
gunzip file.gz
bunzip2 file.bz2
```

### Copy with `scp`

```bash
scp file.txt user@serverb:/tmp/
scp -r dir user@serverb:/tmp/
```

### Interactive transfer with `sftp`

```bash
sftp user@serverb
```

Common interactive commands:

- `put file`
- `get file`
- `ls`
- `quit`

## Worked Examples

### Worked Example 1: Archive a Directory

```bash
mkdir -p demo/a
touch demo/a/file1 demo/a/file2
tar -cvf demo.tar demo
tar -tvf demo.tar
```

Verification:

- `tar -tvf` should list archive contents

### Worked Example 2: Create a Compressed Archive

```bash
tar -czvf demo.tar.gz demo
file demo.tar.gz
```

Verification:

- `file` should identify compressed tar data

### Worked Example 3: Extract Into a Separate Location

```bash
mkdir extract-here
tar -xvf demo.tar -C extract-here
find extract-here
```

Verification:

- extracted files should appear under `extract-here`

## Guided Hands-On Lab

### Lab Goal

Bundle files, compress them, extract them, and practice secure copy syntax.

### Setup

```bash
cd
mkdir -p rhcsa-archive-lab/data
touch rhcsa-archive-lab/data/file1 rhcsa-archive-lab/data/file2
echo "alpha" > rhcsa-archive-lab/data/file1
echo "beta" > rhcsa-archive-lab/data/file2
cd rhcsa-archive-lab
```

### Task Steps

1. Create `data.tar` from the `data` directory.
2. List archive contents without extracting.
3. Create `data.tar.gz`.
4. Create `data.tar.bz2`.
5. Extract `data.tar.gz` into `restore1`.
6. Extract `data.tar.bz2` into `restore2`.
7. Use `file` on all archive types.
8. If you have a second system, copy `data.tar.gz` to it with `scp`.
9. If you have a second system, open `sftp` and list the remote directory.

### Expected Result

You can create and inspect archives, work with both gzip and bzip2, and understand secure transfer syntax.

### Verification Commands

```bash
tar -tvf data.tar
find restore1
find restore2
file data.tar data.tar.gz data.tar.bz2
```

## Independent Practice Tasks

1. Create a tar archive from any practice directory.
2. Create both gzip and bzip2 versions.
3. Extract one archive into `/tmp/test-restore`.
4. List archive contents without extracting.
5. Copy a file to another machine with `scp`.
6. Use `sftp` to download one file from another machine.

## Verification Steps

1. Confirm the archive contains the expected files with `tar -tvf`.
2. Confirm extracted files appear in the intended directory.
3. Confirm transferred files exist on the destination system.
4. Compare source and destination file sizes with `ls -l` if transferring between hosts.

## Troubleshooting Section

### Problem: `tar` says it cannot open the archive

Cause:

- wrong file name or wrong path

Fix:

- list files with `ls`
- use the exact archive name

### Problem: Extracted files appear in the wrong directory

Cause:

- you extracted from the current directory unintentionally

Fix:

- use `tar -xvf archive -C targetdir`

### Problem: `scp` says `No such file or directory`

Cause:

- remote path or local path is wrong

Fix:

- verify both paths carefully

### Problem: SSH transfer fails

Cause:

- remote host unavailable, wrong username, firewall, or SSH service not running

Fix:

- test plain `ssh user@host` first

## Common Mistakes And Recovery

- Mistake: trying to use `gzip` directly on a directory.
  Recovery: use `tar` first, or use `tar -czf`.

- Mistake: forgetting `-f` with `tar`.
  Recovery: review `man tar` and always include the archive file name immediately after `-f`.

- Mistake: transferring to the wrong host path.
  Recovery: confirm the remote destination before the copy.

- Mistake: not checking extracted content.
  Recovery: verify with `find` or `ls -R`.

## Mini Quiz

1. What is the difference between an archive and compression?
2. Which `tar` option extracts files?
3. Which option makes a gzip-compressed tar archive?
4. What tool quickly copies files over SSH?
5. What command lists the contents of a tar archive?

## Exam-Style Tasks

### Task 1

Create `/tmp/configs.tar.gz` from the directory `/etc/ssh`. Do not modify the source directory. Then list the archive contents.

### Grader Mindset Checklist

- archive file must exist
- source directory must remain intact
- archive listing command must succeed

### Task 2

If a second host is available, securely copy `/tmp/configs.tar.gz` to user `student` on `serverb` under `/tmp/`.

### Grader Mindset Checklist

- file should exist on the destination host
- transfer should use SSH-based tooling
- file should remain readable after transfer

## Answer Key / Solution Guide

### Quiz Answers

1. An archive bundles files. Compression reduces size.
2. `-x`
3. `-z`
4. `scp`
5. `tar -tvf archive.tar`

### Exam-Style Task 1 Example Solution

```bash
tar -czvf /tmp/configs.tar.gz /etc/ssh
tar -tvf /tmp/configs.tar.gz
```

### Exam-Style Task 2 Example Solution

```bash
scp /tmp/configs.tar.gz student@serverb:/tmp/
```

## Recap / Memory Anchors

- `tar` bundles
- `gzip` and `bzip2` compress
- `-c` create
- `-x` extract
- `-t` list
- `scp` copies over SSH
- verify archive contents before assuming success

## Quick Command Summary

```bash
tar -cvf files.tar dir
tar -xvf files.tar
tar -tvf files.tar
tar -czvf files.tar.gz dir
tar -cjvf files.tar.bz2 dir
gunzip file.gz
bunzip2 file.bz2
scp file user@host:/tmp/
sftp user@host
```
