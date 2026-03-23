# 1. Title

SSH, Login Control, Switching Users, and Remote Workflows

# 2. Purpose

Teach you how to log in locally and remotely, switch users safely, and perform common remote administration tasks with SSH.

# 3. Why this matters for RHCSA

The exam includes access to remote systems using SSH and login/switch-user tasks in multiuser environments. You must be comfortable moving between systems without confusion.

# 4. Real-world use

Administrators work on remote Linux servers constantly. Clear habits around user identity, hostname awareness, and secure connection methods prevent mistakes.

# 5. Prerequisites

- Read `00-study-skills-and-offline-help.md`
- Read `01-shell-basics-and-command-syntax.md`
- Read `04-archives-compression-and-secure-file-transfer.md`

# 6. Objectives covered

- Access remote systems using SSH
- Log in and switch users in multiuser targets
- Securely transfer files between systems

# 7. Commands/tools used

`ssh`, `scp`, `sftp`, `whoami`, `hostname`, `id`, `exit`, `su`, `sudo`, `ssh-copy-id`

# 8. Offline help references for this topic

- `man ssh`
- `man ssh_config`
- `man scp`
- `man sftp`
- `man su`
- `man sudo`

# 9. Estimated study time

4 hours

# 10. Common beginner mistakes

- Forgetting which host you are connected to
- Running a command on the wrong system
- Confusing local and remote paths in `scp`
- Switching users and not verifying the current identity
- Ignoring host key warnings without understanding them

## Concept Explanation In Simple Language

SSH gives you a secure shell on another system. You type commands on your local computer, but they execute on the remote host after login.

### Remote Awareness

Before you do anything important on a remote system, check:

- `hostname`
- `whoami`
- `pwd`

These three commands prevent many mistakes.

### Local vs Remote Paths

In `scp`, one side may look like:

```text
user@host:/path
```

That side is remote. A plain path like `/tmp/file` is local unless you are already on the other host.

### Multiuser Thinking

Systems can have many users. You need to know:

- who you are now
- when you need elevated privileges
- when to use `sudo`
- when to switch to another account with `su -`

## Command Breakdowns

### Basic SSH login

```bash
ssh student@serverb
```

### Run one remote command without opening a full session

```bash
ssh student@serverb hostname
ssh student@serverb 'whoami && pwd'
```

### Copy local file to remote host

```bash
scp report.txt student@serverb:/tmp/
```

### Copy remote file to local host

```bash
scp student@serverb:/etc/hosts .
```

### Copy your public key

```bash
ssh-copy-id student@serverb
```

This helps prepare for passwordless SSH using keys, which is covered more deeply later.

## Worked Examples

### Worked Example 1: Open a Remote Session and Identify Context

```bash
ssh student@serverb
hostname
whoami
pwd
exit
```

Verification:

- you should return to your original host after `exit`

### Worked Example 2: Run Remote Commands Without Staying Logged In

```bash
ssh student@serverb 'hostname; whoami; date'
```

Verification:

- output should come from the remote host

### Worked Example 3: Transfer a File Both Directions

```bash
scp notes.txt student@serverb:/tmp/
scp student@serverb:/tmp/notes.txt ./notes-from-remote.txt
ls -l notes.txt notes-from-remote.txt
```

Verification:

- local file sizes should match if contents match

## Guided Hands-On Lab

### Lab Goal

Use SSH confidently, verify remote identity, and transfer files safely.

### Setup

You need two systems if possible:

- `servera`
- `serverb`

If you have only one system, practice `ssh localhost` if SSH server is available.

### Task Steps

1. From `servera`, connect to `serverb` with `ssh`.
2. Run `hostname`, `whoami`, and `pwd`.
3. Exit back to `servera`.
4. Run one remote command without an interactive shell.
5. Create `remote-test.txt` locally.
6. Copy it to `serverb:/tmp/`.
7. On `serverb`, confirm it exists.
8. Copy the file back under a different local name.
9. If permitted, test `sudo whoami` on the remote host.
10. If root switching is available, use `su -` and verify identity, then exit back.

### Expected Result

You can clearly tell when you are local or remote, and you can move files between systems without mixing up paths.

### Verification Commands

```bash
ssh student@serverb hostname
ssh student@serverb 'ls -l /tmp/remote-test.txt'
ls -l remote-test.txt remote-test-copy.txt
```

## Independent Practice Tasks

1. Log in to a second host and record its hostname.
2. Run `id` remotely without opening a full interactive shell.
3. Copy `/etc/hosts` from a remote host to your current directory.
4. Copy a local file to a remote user's home directory.
5. Switch to root using `su -` and then return safely.
6. Use `sudo` for one privileged command without opening a root shell.

## Verification Steps

1. Confirm you can distinguish local versus remote prompt context.
2. Confirm transferred files exist on the intended side.
3. Confirm the active user before any admin command.
4. Confirm you leave remote or elevated sessions cleanly with `exit`.

## Troubleshooting Section

### Problem: `Connection refused`

Cause:

- SSH service not running on the remote host

Fix:

- verify the remote service if you have access

### Problem: `Permission denied`

Cause:

- wrong password, wrong user, or key mismatch

Fix:

- confirm the username and auth method

### Problem: `Host key verification failed`

Cause:

- host key changed or known_hosts conflict

Fix:

- investigate before blindly removing the key
- understand whether the host is expected to be rebuilt

### Problem: `scp` copied in the wrong direction

Cause:

- local and remote paths were reversed

Fix:

- remember `user@host:/path` is the remote side

## Common Mistakes And Recovery

- Mistake: forgetting the remote hostname.
  Recovery: run `hostname` first on login.

- Mistake: copying a file to a remote directory that does not exist.
  Recovery: verify the path first or create it remotely.

- Mistake: staying logged in as root remotely longer than needed.
  Recovery: `exit` back to the regular account promptly.

- Mistake: assuming a file transfer succeeded without checking.
  Recovery: verify with `ls -l` on the destination.

## Mini Quiz

1. What does `ssh user@host` do?
2. How do you run one command remotely without staying logged in?
3. In `scp`, which side is remote: `user@host:/tmp/file` or `/tmp/file`?
4. What should you check first after logging into a remote server?
5. Why is it important to know your current user before an admin command?

## Exam-Style Tasks

### Task 1

From one system, connect to another system with SSH and create `/tmp/host-proof.txt` on the remote system containing that remote host's hostname and your username on that host.

### Grader Mindset Checklist

- remote file must exist
- file contents must match remote hostname and user
- task must use SSH

### Task 2

Transfer `/etc/hosts` from a remote host to local `/tmp/hosts.copy`, then verify the file exists locally.

### Grader Mindset Checklist

- `/tmp/hosts.copy` must exist locally
- transfer must use a secure method such as `scp` or `sftp`

## Answer Key / Solution Guide

### Quiz Answers

1. It opens a secure remote shell session.
2. `ssh user@host 'command'`
3. `user@host:/tmp/file` is remote.
4. `hostname`, `whoami`, and often `pwd`
5. Because permissions and consequences depend on identity.

### Exam-Style Task 1 Example Solution

```bash
ssh student@serverb 'hostname > /tmp/host-proof.txt; whoami >> /tmp/host-proof.txt'
ssh student@serverb 'cat /tmp/host-proof.txt'
```

### Exam-Style Task 2 Example Solution

```bash
scp student@serverb:/etc/hosts /tmp/hosts.copy
ls -l /tmp/hosts.copy
```

## Recap / Memory Anchors

- SSH gives remote shell access.
- Always identify host and user first.
- `ssh host command` runs one remote command.
- `scp` copies files securely.
- `su -` changes full user context.
- `sudo` runs one elevated command.

## Quick Command Summary

```bash
ssh user@host
ssh user@host 'hostname; whoami'
scp file user@host:/tmp/
scp user@host:/etc/hosts .
sftp user@host
sudo whoami
su -
exit
```
