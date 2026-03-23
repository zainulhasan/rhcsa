# Shell Basics and Command Syntax

> Teach you how to work at a Linux shell prompt, read command syntax, understand paths, and run commands correctly as either a regular user or root.

## At a Glance

**Why this matters for RHCSA**

Every RHCSA task starts at the shell. If you cannot read prompts, understand command structure, or tell where you are in the filesystem, every later topic becomes harder.

**Real-world use**

System administrators spend much of their time at a shell prompt running commands, inspecting output, and making careful changes with minimal guesswork.

**Estimated study time**

4 hours

## Prerequisites

- Read `00-study-skills-and-offline-help.md`

## Objectives Covered

- Access a shell prompt and issue commands with correct syntax
- Log in and switch users in multiuser targets
- Locate, read, and use system documentation including local help

## Commands/Tools Used

`pwd`, `ls`, `cd`, `echo`, `whoami`, `id`, `hostname`, `date`, `cal`, `clear`, `history`, `exit`, `su`, `sudo`, `uname`, `type`, `man`, `help`

## Offline Help References For This Topic

- `help cd`
- `help history`
- `man bash`
- `man su`
- `man sudo`
- `man pwd`
- `man ls`
- `man hier`

## Common Beginner Mistakes

- Mixing up command name and arguments
- Forgetting spaces between options and values
- Confusing relative and absolute paths
- Running admin commands as a regular user and not noticing permission errors
- Using `su` without `-` and getting the wrong environment
- Not checking current user or current directory

## Concept Explanation In Simple Language

The shell is a text interface where you type commands. A command normally has this structure:

```text
command option(s) argument(s)
```

Example:

```bash
ls -l /etc
```

Here:

- `ls` is the command
- `-l` is an option
- `/etc` is an argument

### Prompt, User, and Host

A shell prompt often shows:

- your username
- your hostname
- your current directory

Example:

```text
[student@servera ~]$
```

This means:

- user: `student`
- host: `servera`
- current location: home directory (`~`)

### Filesystem Paths

An absolute path starts from the root directory `/`.

Examples:

- `/etc/hosts`
- `/var/log/messages`

A relative path starts from your current directory.

Examples:

- `notes.txt`
- `docs/report.txt`

### `.` and `..`

- `.` means the current directory
- `..` means the parent directory

### Root vs Regular User

A regular user should do normal work.

Root has full administrative power. Use root only when needed because mistakes as root are more dangerous.

Common ways to become root:

```bash
su -
sudo command
```

### Reading Command Syntax

In documentation, you may see syntax such as:

```text
command [OPTION]... FILE...
```

Meaning:

- items in `[]` are optional
- `...` means one or more can be used
- uppercase names like `FILE` are placeholders you replace with real values

## Command Breakdowns

### `pwd`

```bash
pwd
```

Shows your current working directory.

### `ls`

```bash
ls
ls -l
ls -a
ls -la /etc
```

Common options:

- `-l` long listing
- `-a` include hidden files

### `cd`

```bash
cd /etc
cd
cd ..
cd -
```

What they do:

- `cd /etc` moves to `/etc`
- `cd` returns to your home directory
- `cd ..` moves up one level
- `cd -` returns to the previous directory

### `whoami` and `id`

```bash
whoami
id
id root
```

Use them to confirm who you are and what groups you belong to.

### `su -`

```bash
su -
```

Switches to another user, usually root, with that user's login environment.

Why `-` matters:

- it loads the target user's environment properly

### `sudo`

```bash
sudo whoami
```

Runs one command with elevated privileges if your account is allowed.

## Worked Examples

### Worked Example 1: Identify Where You Are and Who You Are

Commands:

```bash
pwd
whoami
id
hostname
```

Expected result:

- You know your current directory, username, groups, and hostname.

Verification:

- Explain in words what each command showed you.

### Worked Example 2: Move Around the Filesystem

Commands:

```bash
pwd
cd /etc
pwd
cd /var
pwd
cd -
pwd
```

Expected result:

- You move between directories and can prove where you are after each move.

Verification:

- `pwd` should match the directory you intended.

### Worked Example 3: Compare `su -` and `sudo`

Commands:

```bash
whoami
sudo whoami
su -
whoami
pwd
exit
whoami
```

Expected result:

- `sudo whoami` prints `root` for one command.
- `su -` changes the whole shell session until you exit.

Verification:

- After `exit`, you should be back as your original user.

## Guided Hands-On Lab

### Lab Goal

Build comfort with the prompt, command syntax, directory movement, and user context.

### Setup

Use a non-root account first. Use root only where instructed.

### Task Steps

1. Open a terminal.
2. Run `pwd`, `whoami`, `id`, and `hostname`.
3. List files in your home directory with `ls -la`.
4. Change to `/etc` and list its contents with `ls`.
5. Change to `/var/log` and list files with `ls -l`.
6. Return to your previous directory with `cd -`.
7. Return to your home directory with `cd`.
8. Use `type cd` and `help cd`.
9. Read `man ls`.
10. If you have permission, test one admin command using `sudo whoami`.
11. If root access is available, use `su -` and confirm the new user with `whoami`, then exit back.

### Expected Result

You can read your prompt, navigate directories, identify your current user, and distinguish one-command privilege elevation from a full root shell.

### Verification Commands

```bash
pwd
whoami
id
type cd
command -v ls
```

## Independent Practice Tasks

1. Move from your home directory to `/usr/share/doc` and back without using mouse or GUI tools.
2. Use local help to find what `cd -` does.
3. Show all files, including hidden ones, in `/root` if you have root access.
4. Confirm whether `history` is a shell builtin.
5. Switch to root with `su -`, run `pwd`, then exit and explain why the directory changed.
6. Use `sudo` to run `date` as root.
7. Use `uname -a` and describe what kind of information it shows.

## Verification Steps

1. You can explain the difference between an absolute path and a relative path.
2. You can move to a directory and prove it with `pwd`.
3. You can confirm your current identity with `whoami` or `id`.
4. You can explain when to use `sudo` versus `su -`.

## Troubleshooting Section

### Problem: `Permission denied`

Cause:

- You are using a regular user for an administrative action.

Fix:

- confirm with `whoami`
- use `sudo` or `su -` if appropriate

### Problem: `No such file or directory`

Cause:

- wrong path or typo

Fix:

- use `pwd`
- list the parent directory with `ls`
- type the path carefully

### Problem: `command not found`

Cause:

- typo, package not installed, or wrong command name

Fix:

- check spelling
- use `command -v name`
- search with `apropos`

### Problem: `su: Authentication failure`

Cause:

- wrong password or root password is unknown

Fix:

- use an account allowed with `sudo` instead if available

### Problem: You switched users but environment looks strange

Cause:

- you used `su` instead of `su -`

Fix:

- exit and re-enter with `su -`

## Common Mistakes And Recovery

- Mistake: forgetting where you are.
  Recovery: run `pwd` immediately.

- Mistake: using a relative path when you meant an absolute path.
  Recovery: start the path with `/` when you need an absolute location.

- Mistake: editing or listing the wrong place because you assumed your location.
  Recovery: check `pwd` before risky actions.

- Mistake: staying in a root shell longer than needed.
  Recovery: use `exit` as soon as the admin task is complete.

- Mistake: reading syntax placeholders as literal text.
  Recovery: replace words like `FILE` or `USER` with real names.

## Mini Quiz

1. What does `pwd` show?
2. What is the difference between `/etc` and `etc`?
3. What does `cd -` do?
4. Why is `su -` usually better than plain `su` for admin work?
5. What command tells you who you are right now?
6. What command type is `cd`?

## Exam-Style Tasks

### Task 1

As a regular user, gather basic system context and save it in `/tmp/session-info.txt`. The file must contain:

- current working directory
- current username
- hostname
- output showing whether `cd` is a builtin

### Grader Mindset Checklist

- `/tmp/session-info.txt` must exist
- file must contain all four required pieces of information
- commands should work without internet access

### Task 2

Demonstrate controlled privilege use:

- show your current username
- run one command as root with `sudo`
- if root password is available, switch into a root login shell, prove you are root, then return to your original user

Record the proof in `/tmp/priv-check.txt`.

### Grader Mindset Checklist

- `/tmp/priv-check.txt` must exist
- evidence should show both normal and elevated context
- if `su -` is used, the session should return to the original user afterward

## Answer Key / Solution Guide

### Quiz Answers

1. Your current working directory.
2. `/etc` is an absolute path from root. `etc` is a relative path from the current directory.
3. It changes to the previous directory.
4. It gives you the target user's login environment.
5. `whoami` or `id`
6. A shell builtin

### Exam-Style Task 1 Example Solution

```bash
pwd > /tmp/session-info.txt
whoami >> /tmp/session-info.txt
hostname >> /tmp/session-info.txt
type cd >> /tmp/session-info.txt
cat /tmp/session-info.txt
```

### Exam-Style Task 2 Example Solution

```bash
whoami > /tmp/priv-check.txt
sudo whoami >> /tmp/priv-check.txt
su -
whoami >> /tmp/priv-check.txt
exit
whoami >> /tmp/priv-check.txt
cat /tmp/priv-check.txt
```

If `su -` is not available in your lab, document that and practice with `sudo` only.

## Recap / Memory Anchors

- Command syntax usually means command, options, arguments.
- `pwd` tells you where you are.
- `whoami` tells you who you are.
- Absolute paths start with `/`.
- `cd` is a shell builtin.
- `sudo` is for one elevated command.
- `su -` is for a full target-user login shell.

## Quick Command Summary

```bash
pwd
ls -la
cd /etc
cd ..
cd -
cd
whoami
id
hostname
type cd
help cd
man ls
sudo whoami
su -
exit
```