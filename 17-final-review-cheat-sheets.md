# Final Review and Cheat Sheets

> Compress the course into fast review notes you can use before mock exams or as a weekly memory refresh.

## At a Glance

**Why this matters for RHCSA**

Fast recall matters in a timed hands-on exam. You should be able to remember the tool family, the likely config file, and the right verification command quickly.

**Real-world use**

Admins build compact mental checklists so they can work faster under pressure without skipping validation.

**Estimated study time**

4 hours

**Study sequence note**

If you are following the beginner route, complete labs `22-26` and `28-rhcsa-10-mixed-practice-bank.md` before using this review file. The file number is lower than the lab files, but the study order is not.

## Prerequisites

- Read lessons `00` through `16`

## Objectives Covered

- Whole-course review across essential tools, software, scripting, system operation, storage, networking, users, and security

## Commands/Tools Used

Whole-course review set

## Offline Help References For This Topic

- `man -k keyword`
- `apropos keyword`
- `type`
- `help builtin`
- `/usr/share/doc`

## Common Beginner Mistakes

- Memorizing command names without knowing how to verify results
- Reviewing passively instead of retyping commands
- Studying weak topics last minute instead of repeating them earlier

## Concept Explanation In Simple Language

This lesson is not for deep explanation. It is for compression. Use it to refresh command families, common files, and the most important verification habits.

## Command Breakdowns

### Essential shell

```bash
pwd
ls -la
cd
whoami
id
type cd
```

### Files and text

```bash
cp file file.bak
mv old new
rm -r dir
cat file
less file
```

### Search and redirection

```bash
grep root /etc/passwd
grep -E 'bash$|nologin$' /etc/passwd
command > out.txt 2> err.txt
command1 | command2
```

### Services and logs

```bash
systemctl status service
systemctl is-enabled service
journalctl -u service -b
```

### Storage and mounts

```bash
lsblk
blkid
findmnt /data
mount -a
```

### Networking and firewall

```bash
ip addr
nmcli connection show
firewall-cmd --list-all
```

### Users and security

```bash
id user
chage -l user
getenforce
ls -Z path
ssh-copy-id user@host
```

## Worked Examples

### Worked Example 1: Verify a Service Fast

```bash
systemctl is-active sshd
systemctl is-enabled sshd
journalctl -u sshd -b | tail
```

### Worked Example 2: Verify a Persistent Mount Fast

```bash
findmnt /data
grep /data /etc/fstab
mount -a
```

### Worked Example 3: Verify a User and Sudo Rule Fast

```bash
id alice
chage -l alice
visudo -c
```

## Guided Hands-On Lab

### Lab Goal

Run a full fast-review circuit across the main RHCSA topic groups.

### Setup

Open a shell and keep a note file of commands you could not remember immediately.

### Task Steps

1. Verify your identity and current directory.
2. Search `/etc/passwd` for users with Bash shells.
3. Query one installed package.
4. Check one service's active and enabled states.
5. Inspect current block devices.
6. Check one persistent mount.
7. Check one network interface and one firewall rule.
8. Check one user's group membership.
9. Check SELinux mode.
10. Record any command you hesitated on.

### Expected Result

You identify weak recall areas before the mock exams.

### Verification Commands

```bash
whoami
grep 'bash$' /etc/passwd
rpm -q bash
systemctl is-enabled sshd
lsblk
firewall-cmd --list-all
getenforce
```

## Independent Practice Tasks

1. Rebuild a one-page command summary from memory.
2. Explain the difference between start and enable.
3. Explain the difference between mount now and mount at boot.
4. Explain the difference between Unix permissions and SELinux.
5. Practice one command from each course lesson without notes.

## Verification Steps

1. Time yourself on common checks.
2. Verify whether you can choose the right command without guessing.
3. Revisit weak topics immediately.

## Troubleshooting Section

### Problem: Review feels familiar but execution is slow

Fix:

- stop rereading
- start retyping and redoing labs

### Problem: You remember concepts but forget syntax

Fix:

- build short command cards with one verification command each

### Problem: Mock exam performance collapses under pressure

Fix:

- practice task breakdown and verification, not just commands

## Common Mistakes And Recovery

- Mistake: using cheat sheets as a substitute for labs.
  Recovery: use them only as compression after practice.

- Mistake: reviewing only favorite topics.
  Recovery: spend extra time on storage, networking, SELinux, and persistence.

- Mistake: ignoring repeated mistakes.
  Recovery: keep a mistake log and review it weekly.

## Mini Quiz

1. What command proves a service is enabled at boot?
2. What command safely tests `/etc/fstab`?
3. What command lists block devices?
4. What command shows SELinux mode?
5. What command shows your current groups?

## Exam-Style Tasks

### Task 1

Create your own final one-page RHCSA command sheet from memory, then verify each command on a live system.

### Grader Mindset Checklist

- commands must be grouped logically
- each major topic should include at least one verification command

### Task 2

Choose your three weakest RHCSA topics and perform one timed practical task in each without notes.

### Grader Mindset Checklist

- each task should be completed and verified
- weak areas should be identified honestly

## Answer Key / Solution Guide

### Quiz Answers

1. `systemctl is-enabled service`
2. `mount -a`
3. `lsblk`
4. `getenforce`
5. `id` or `groups`

### Exam-Style Task 1 Example Solution

Include at least:

- service checks
- mount checks
- package checks
- user checks
- network checks
- SELinux checks

### Exam-Style Task 2 Example Solution

Good weak-topic choices often include:

- LVM and filesystems
- firewalld and networking
- SELinux and service access

## Recap / Memory Anchors

- know the command family
- know the config file
- know the verification command
- know the persistence check

## Quick Command Summary

```bash
type
apropos
grep
dnf
systemctl
journalctl
lsblk
blkid
findmnt
nmcli
firewall-cmd
useradd
chage
getenforce
restorecon
ssh-copy-id
```

## Continue In Order

- If you have not finished labs `22-26` and `28`, stop here and return to them first
- If you have finished the labs route, continue to `18-mock-exam-1.md`
