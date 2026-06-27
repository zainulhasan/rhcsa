# SELinux, SSH Keys, and Security

> Teach you how to work with SELinux modes and contexts, restore labels, manage SELinux ports and booleans, and configure SSH key-based authentication.

## At a Glance

**Why this matters for RHCSA**

SELinux and SSH key-based authentication are direct RHCSA objectives. SELinux often appears when a service seems correct but still cannot access files or ports.

**Real-world use**

Admins secure systems by using key-based login, least-privilege firewall rules, and SELinux policy controls instead of simply disabling security features.

**Estimated study time**

8 hours

## Prerequisites

- Read `05-ssh-login-switching-users-and-remote-workflows.md`
- Read `06-links-permissions-and-default-permissions.md`
- Read `13-networking-hostname-resolution-and-firewalld.md`

## Objectives Covered

- Configure key-based authentication for SSH
- Set enforcing and permissive modes for SELinux
- List and identify SELinux file and process context
- Restore default file contexts
- Manage SELinux port labels
- Use boolean settings to modify system SELinux settings
- Configure firewall settings using `firewall-cmd` and `firewalld`
- Manage default file permissions

## Commands/Tools Used

`getenforce`, `setenforce`, `sestatus`, `ls -Z`, `ps -eZ`, `restorecon`, `chcon`, `semanage`, `getsebool`, `setsebool`, `ausearch`, `sealert`, `ssh-keygen`, `ssh-copy-id`, `ssh`

## Offline Help References For This Topic

- `man selinux`
- `man getenforce`
- `man restorecon`
- `man semanage`
- `man setsebool`
- `man ssh-keygen`
- `man ssh-copy-id`

## Common Beginner Mistakes

- Disabling SELinux instead of understanding the real issue
- Using `setenforce 0` and forgetting it is temporary
- Changing file permissions when the real problem is context
- Moving content to a non-standard path without relabeling
- Generating SSH keys but not copying the public key correctly

## Concept Explanation In Simple Language

SELinux adds an extra security layer beyond normal Unix permissions. A process may have permission by owner and mode bits, but SELinux can still deny access if the context is wrong.

```mermaid
flowchart TD
    A["Access request"] --> B["Unix permissions"]
    B --> C{"Allowed by owner or mode?"}
    C -- "No" --> D["Access denied"]
    C -- "Yes" --> E["SELinux context and policy"]
    E --> F{"Allowed by policy?"}
    F -- "No" --> D
    F -- "Yes" --> G["Access succeeds"]
```

```mermaid
flowchart LR
    A["Client private key"] --> C["SSH login attempt"]
    B["Server authorized public key"] --> C
    C --> D["Passwordless key-based access"]
```

### SELinux Modes

- enforcing: SELinux rules are applied
- permissive: violations are logged but not enforced
- disabled: SELinux off

For RHCSA, learn to work with SELinux, not around it.

### File and Process Contexts

Contexts label files and processes. You can inspect them and restore expected labels.

### SSH Keys

SSH key login uses a private key on the client and a public key installed on the server. It avoids typing passwords for every login and is a required skill.

### Persistence

- `setenforce` changes now only
- `/etc/selinux/config` controls boot behavior
- `setsebool -P` persists booleans
- SSH keys remain usable after reboot if installed correctly

## Command Breakdowns

### SELinux mode (runtime)

```bash
getenforce
sestatus
sudo setenforce 0        # permissive now (temporary)
sudo setenforce 1        # enforcing now (temporary)
```

### SELinux mode at boot (persistent)

`setenforce` only changes the current session. To change the mode that applies after reboot, edit the `SELINUX=` line in `/etc/selinux/config`:

```bash
sudo vi /etc/selinux/config
```

```ini
# valid values: enforcing, permissive, disabled
SELINUX=enforcing
```

- Set `SELINUX=permissive` (or `enforcing`) and the change applies on the next boot.
- Verify the configured value with `sestatus` (shows both current mode and "Mode from config file").
- You can also force permissive for one boot from GRUB by appending `enforcing=0` to the kernel line — useful for recovery.
- Note: switching **disabled ↔ enforcing** requires a reboot and triggers a full relabel; switching enforcing ↔ permissive does not.

### Inspect contexts

```bash
ls -Z /var/www/html
ps -eZ | grep sshd
```

### Set and restore file contexts

`restorecon` resets a file to the **default** context for its path. To give a **new or relocated** path the right label, first record the rule with `semanage fcontext`, then apply it with `restorecon`:

```bash
# relabel a path back to its policy default
sudo restorecon -Rv /var/www/html

# define a NEW default for a custom path, then apply it
sudo semanage fcontext -a -t httpd_sys_content_t "/web(/.*)?"
sudo restorecon -Rv /web
```

- `restorecon` alone cannot help a custom path like `/web` — there is no default rule for it until you add one with `semanage fcontext`.
- The `"/web(/.*)?"` regex labels the directory and everything under it.
- `chcon` can also set a context, but it is **not persistent** across a relabel — prefer `semanage fcontext` + `restorecon`.

### Diagnose SELinux denials (AVC)

When SELinux blocks something, it logs an AVC denial. Find it with any of these:

```bash
sudo ausearch -m AVC -ts recent        # recent denials from the audit log
sudo grep AVC /var/log/audit/audit.log # raw denials
sudo journalctl -t setroubleshoot      # human-readable alerts (if setroubleshoot installed)
sudo sealert -a /var/log/audit/audit.log   # detailed analysis + suggested fix
```

`ausearch`/`sealert` usually tell you exactly which context or boolean is wrong, so you fix the policy instead of disabling SELinux.

### SELinux booleans

```bash
getsebool -a | grep httpd
sudo setsebool -P httpd_can_network_connect on
```

### SELinux ports

```bash
sudo semanage port -l | grep http
sudo semanage port -a -t http_port_t -p tcp 8080
sudo semanage port -d -t http_port_t -p tcp 8080
```

### SSH key workflow

```bash
ssh-keygen
ssh-copy-id student@serverb
ssh student@serverb
```

## Worked Examples

### Worked Example 1: Check Current SELinux State

```bash
getenforce
sestatus
```

Verification:

- explain whether the system is enforcing or permissive

### Worked Example 2: Restore Context on a Web Directory

```bash
sudo restorecon -Rv /var/www/html
ls -Z /var/www/html
```

Verification:

- labels should return to default expected types

### Worked Example 3: Generate and Install an SSH Key

```bash
ssh-keygen
ssh-copy-id student@serverb
ssh student@serverb
```

Verification:

- login should work with the key if configured properly

### Worked Example 4: Make SELinux Mode Persistent Across Boot

```bash
getenforce
sudo vi /etc/selinux/config
# set the line:  SELINUX=enforcing
sestatus
```

Verification:

- `sestatus` shows the current mode and the "Mode from config file"
- both should read `enforcing` so the setting survives reboot

### Worked Example 5: Label a Custom Web Directory

```bash
sudo mkdir /web
sudo semanage fcontext -a -t httpd_sys_content_t "/web(/.*)?"
sudo restorecon -Rv /web
ls -Zd /web
```

Verification:

- `ls -Zd /web` shows the type `httpd_sys_content_t`
- the label survives a relabel because it is stored as a policy rule

## Guided Hands-On Lab

### Lab Goal

Use SELinux tools to inspect and fix contexts, and configure SSH key-based authentication.

### Setup

You need root privileges and ideally two systems for SSH key testing.

### Task Steps

1. Check SELinux mode with `getenforce` and `sestatus`.
2. Inspect file contexts on a standard service path such as `/var/www/html` or `/var/ftp`.
3. Inspect process contexts with `ps -eZ`.
4. If a file is moved into a service directory, run `restorecon` on it.
5. Create a custom directory, add a context rule with `semanage fcontext`, and apply it with `restorecon`.
6. List SELinux booleans relevant to a service and change one persistently with `setsebool -P`.
7. List SELinux ports and inspect service-related labels.
8. Trigger or locate an AVC denial and read it with `ausearch -m AVC -ts recent`.
9. Edit `/etc/selinux/config` to set the boot mode, then confirm with `sestatus`.
9. Generate an SSH key pair for your user.
10. Copy the public key to another host with `ssh-copy-id`.
11. Test key-based SSH login.
12. Reboot and verify key login and SELinux boolean persistence if you changed one.

### Expected Result

You can recognize common SELinux state and label problems, and you can use key-based SSH authentication confidently.

### Verification Commands

```bash
getenforce
ls -Z /var/www/html
getsebool -a | head
ssh -o PreferredAuthentications=publickey student@serverb hostname
```

## Independent Practice Tasks

1. Show SELinux mode and full status.
2. List contexts on a service directory.
3. List contexts of running processes.
4. Restore contexts on a directory tree.
5. List SELinux booleans for `httpd` or another service.
6. Add or inspect an SELinux port label in a throwaway lab case.
7. Generate an SSH key and use it to log in to a second host.
8. Compare the runtime SELinux mode to the configured boot-time SELinux mode.

## Verification Steps

1. Verify SELinux mode with both `getenforce` and `sestatus`.
2. Verify labels with `ls -Z` and `ps -eZ`.
3. Verify `restorecon` changed labels where expected.
4. Verify persistent booleans with `getsebool`.
5. Verify `/etc/selinux/config` matches the intended boot-time SELinux mode.
6. Reboot and verify key login and any SELinux persistent changes still work.

## Troubleshooting Section

### Problem: Service still denied after permissions were fixed

Cause:

- SELinux context or boolean issue

Fix:

- inspect labels and relevant booleans

### Problem: `setenforce 0` fixed the issue temporarily

Cause:

- confirms SELinux is involved but does not solve the root cause

Fix:

- restore correct contexts, booleans, or port labels

### Problem: SSH key login still asks for password

Cause:

- key not copied, wrong permissions, wrong user, or server SSH settings

Fix:

- verify `~/.ssh` permissions and authorized key placement

### Problem: `semanage` not found

Cause:

- policy management tools package missing

Fix:

- install the required SELinux utilities package if available in your lab

## Common Mistakes And Recovery

- Mistake: disabling SELinux as the first reaction.
  Recovery: investigate contexts, booleans, and ports first.

- Mistake: using temporary boolean changes when persistence is required.
  Recovery: add `-P` for persistent boolean changes.

- Mistake: copying private keys instead of public keys.
  Recovery: only install the `.pub` key on the server.

- Mistake: trusting normal file permissions alone.
  Recovery: check both Unix permissions and SELinux context.

## Mini Quiz

1. What are the common SELinux modes?
2. What command shows SELinux mode quickly?
3. What command restores default file contexts?
4. What option makes `setsebool` persistent?
5. What command generates an SSH key pair?
6. Why might a correct file permission still not allow service access?
7. Which file controls SELinux mode at boot?
8. How do you give a custom path like `/web` a persistent SELinux type?
9. Which commands let you read SELinux denials (AVC) from the audit log?
10. Why prefer `semanage fcontext` + `restorecon` over `chcon`?

## Exam-Style Tasks

### Task 1

Configure SSH key-based authentication for a user between two hosts and verify passwordless login using the key.

### Grader Mindset Checklist

- key pair must exist
- public key must be installed for the target user
- SSH login with public key should succeed
- setup must still work after reboot

### Task 2

Fix an SELinux-related access problem using the correct SELinux tool, not by disabling SELinux. Verify the change and, if applicable, make it persistent.

### Grader Mindset Checklist

- SELinux should remain usable
- correct context, boolean, or port label must be applied
- target service or access should work
- persistent change should survive reboot where relevant

## Answer Key / Solution Guide

### Quiz Answers

1. Enforcing, permissive, and disabled.
2. `getenforce`
3. `restorecon`
4. `-P`
5. `ssh-keygen`
6. Because SELinux may deny access based on context or policy.
7. `/etc/selinux/config`
8. `sudo semanage fcontext -a -t TYPE "/web(/.*)?"` then `sudo restorecon -Rv /web`.
9. `ausearch -m AVC -ts recent`, `grep AVC /var/log/audit/audit.log`, or `sealert -a /var/log/audit/audit.log`.
10. `chcon` is lost on the next relabel; `semanage fcontext` stores the rule so `restorecon` re-applies it permanently.

### Exam-Style Task 1 Example Solution

```bash
ssh-keygen
ssh-copy-id student@serverb
ssh student@serverb hostname
```

### Exam-Style Task 2 Example Solution

```bash
# diagnose first
sudo ausearch -m AVC -ts recent
# then fix the right way (context / boolean / port), e.g.:
ls -Z /var/www/html
sudo restorecon -Rv /var/www/html
getsebool -a | grep httpd
sudo setsebool -P httpd_can_network_connect on
```

## Recap / Memory Anchors

- SELinux adds another access layer
- `getenforce` checks mode; `/etc/selinux/config` sets the boot mode
- `restorecon` fixes default labels; `semanage fcontext` defines a new default
- diagnose denials with `ausearch -m AVC` or `sealert`
- `setsebool -P` persists booleans
- `semanage` manages ports and file contexts
- SSH keys use private client key plus public server key

## Quick Command Summary

```bash
getenforce
sestatus
setenforce 0
setenforce 1
# boot mode: edit SELINUX= in /etc/selinux/config
ls -Z path
ps -eZ
restorecon -Rv path
semanage fcontext -a -t httpd_sys_content_t "/web(/.*)?"
getsebool -a
setsebool -P boolean on
semanage port -l
semanage port -a -t http_port_t -p tcp 8080
ausearch -m AVC -ts recent
sealert -a /var/log/audit/audit.log
ssh-keygen
ssh-copy-id user@host
ssh user@host
```