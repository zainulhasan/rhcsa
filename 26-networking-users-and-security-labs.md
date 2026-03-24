# Networking, Users, and Security Labs

> Test your ability to configure network settings, firewalld, local users and groups, sudo access, SSH keys, and SELinux.

## At a Glance

**Why this matters for RHCSA**

These are high-value hands-on exam areas. They combine configuration, verification, and troubleshooting, and many tasks fail because learners forget persistence or SELinux side effects.

**Real-world use**

Administrators constantly assign IP settings, control access, create users, manage sudo, allow services through firewalls, and fix SELinux labeling and policy issues.

**Estimated study time**

5 to 7 hours

## Prerequisites

- A working lab VM
- Preferably a second VM for SSH tests
- Previous lesson or lab exposure to systemd and basic shell work

## Objectives Covered

- IPv4 and IPv6 basics with `nmcli`
- Hostname resolution
- firewalld configuration
- Local users, groups, passwords, and sudo
- SSH key-based authentication
- SELinux modes, contexts, booleans, and ports

## Commands/Tools Used

`ip`, `nmcli`, `hostnamectl`, `getent`, `ss`, `firewall-cmd`, `useradd`, `usermod`, `groupadd`, `passwd`, `chage`, `visudo`, `ssh-keygen`, `ssh-copy-id`, `getenforce`, `sestatus`, `restorecon`, `setsebool`, `getsebool`, `semanage`, `setfacl`, `getfacl`, `chmod`, `chgrp`

## Offline Help References For This Topic

- `man nmcli`
- `man firewall-cmd`
- `man useradd`
- `man usermod`
- `man visudo`
- `man ssh-keygen`
- `man ssh-copy-id`
- `man semanage`
- `man setfacl`

## Common Beginner Mistakes

- Setting an IP but forgetting to bring the connection up
- Opening a firewall port temporarily when persistence is required
- Creating users without verifying group membership
- Editing sudo rules unsafely
- Changing an SELinux setting at runtime only and forgetting persistence

## Concept explanation in simple language

This lab file checks whether you can make access work correctly and securely.

Common RHCSA failure patterns here:

- networking looks right, but the connection profile was not activated
- firewall rule works now, but not after reload or reboot
- user exists, but home directory, shell, or group membership is wrong
- SSH key exists, but permissions or key installation are wrong
- service still fails because SELinux blocks it

The key theme is layered verification:

1. configure
2. check current behavior
3. check persistence
4. check security side effects

## Command breakdowns

### Change a connection profile

```bash
sudo nmcli connection modify eth0 ipv4.addresses 192.168.122.50/24
sudo nmcli connection modify eth0 ipv4.gateway 192.168.122.1
sudo nmcli connection modify eth0 ipv4.method manual
sudo nmcli connection up eth0
```

### Create a user with custom home

```bash
sudo useradd -m -d /srv/alice -s /bin/bash alice
```

### Open a firewall service permanently

```bash
sudo firewall-cmd --add-service=http --permanent
sudo firewall-cmd --reload
```

### Add an SELinux port label

```bash
sudo semanage port -a -t http_port_t -p tcp 85
```

## Worked examples

### Worked Example 1: Verify a user completely

```bash
id alice
getent passwd alice
ls -ld /srv/alice
```

Verification:

- all three checks should agree about user identity, home path, and existence

### Worked Example 2: Verify a firewall rule correctly

```bash
sudo firewall-cmd --list-all
sudo firewall-cmd --list-ports
```

Verification:

- the expected service or port should appear in active rules

### Worked Example 3: Verify SELinux for a custom HTTP port

```bash
sudo semanage port -l | grep http_port_t
ss -tuln | grep :85
```

Verification:

- port label and listening state should both make sense

## Guided hands-on lab

### Lab goal

Perform a complete networking, access, and SELinux workflow.

### Setup

Use one or two VMs. Two are better for SSH key testing.

### Task steps

1. Check current IP settings.
2. Modify or review a NetworkManager profile.
3. Bring the connection up and verify the result.
4. Set or verify the hostname.
5. Add a local hostname mapping if needed and test it.
6. Create a user with a custom home and Bash shell.
7. Create a group and add the user to it.
8. Set a password-aging policy.
9. Add a safe sudo rule and verify syntax.
10. Generate an SSH key pair.
11. If a second VM is available, install the public key with `ssh-copy-id`.
12. Open a firewall rule permanently.
13. If `httpd` is available in your lab, prepare it for port `85` with SELinux and firewall settings.
14. Reboot and verify the important persistent settings.

### Expected result

- network configuration is understandable and testable
- user and group administration is correct
- SSH keys work or are prepared correctly
- firewall and SELinux configuration can be verified after reboot

### Verification commands

```bash
ip addr
nmcli connection show
getent hosts servera.lab.example
id alice
groups alice
sudo visudo -c
ssh -o PasswordAuthentication=no user@host
sudo firewall-cmd --list-all
getenforce
sestatus
sudo semanage port -l | grep http_port_t
```

### Cleanup

You may keep the user, rules, and key pair if they support later practice.

## Independent practice tasks

1. Configure a static IPv4 address on a lab connection profile.
2. Add DNS settings with `nmcli`.
3. Create a user without a home directory, then explain when that is useful.
4. Create a second user with a custom home directory.
5. Create a group and add multiple users to it.
6. Create a sudoers drop-in or use `visudo` safely.
7. Generate SSH keys and test key-based login.
8. Set SELinux to permissive mode and then back to enforcing mode.
9. Restore the default context on a changed directory.
10. Configure port `85` for `httpd` with both SELinux and firewalld.

## Subtitle-derived practice set

These drills are adapted from subtitle question banks and rewritten so the commands are correct for real RHCSA practice.

### Drill 1: Users, supplementary groups, and non-login shell

As `root`:

1. Create a group named `newgroup`.
2. Create user `harsh` and add `newgroup` as a supplementary group.
3. Create user `nitin` with shell `/sbin/nologin`.
4. Verify both users fully.

What to check before moving on:

- `harsh` exists
- `newgroup` appears as a supplementary group, not a replacement primary group
- `nitin` shows `/sbin/nologin` in account data

### Drill 2: Static NetworkManager profile

As `root`, create a new connection profile named `net`.

Requirements:

1. Use your real interface name, not a guessed one.
2. Configure static IPv4 address `192.168.122.50/24`.
3. Set gateway `192.168.122.1`.
4. Set DNS `8.8.8.8`.
5. Activate the profile.

What to check before moving on:

- `nmcli connection show net` displays the expected values
- `nmcli connection up net` succeeds
- `ip addr` reflects the intended address

### Drill 3: Hostname and local name resolution

As `root`:

1. Set the hostname to `servera.lab.example`.
2. Add an `/etc/hosts` entry so the system can resolve that name locally.
3. Verify hostname resolution.

What to check before moving on:

- `hostnamectl` shows the new hostname
- `getent hosts servera.lab.example` returns the expected mapping

### Drill 4: SELinux boolean for HTTP home directories

As `root`, ensure `httpd` is allowed to access user home directories.

What to check before moving on:

- you identify the right boolean
- the change is persistent
- the value stays enabled after reboot

### Drill 5: Allow `httpd` on custom port `82`

As `root`:

1. Add the SELinux port label so `httpd` can use TCP `82`.
2. Open TCP `82` permanently in `firewalld`.
3. Reload the firewall.
4. Verify both layers separately.

What to check before moving on:

- the SELinux port label exists
- the firewall port rule exists
- you understand that firewall success alone is not enough

### Drill 6: Serve content from a nonstandard directory with SELinux

Assume `httpd` should be allowed to serve content from `/test`.

As `root`:

1. Create `/test` and an `index.html` file inside it.
2. Add a persistent SELinux file-context rule for `/test` and its contents.
3. Apply the correct labels with `restorecon`.
4. Verify the resulting contexts.

What to check before moving on:

- the rule is stored in SELinux policy, not only changed once with `chcon`
- the context on `/test` matches web content use
- the rule survives relabeling and reboot

## Repo-derived practice set

These drills come from additional RHCSA practice-question sources and were rewritten with clearer verification and recovery steps.

### Drill 7: Create users with specific UIDs and expiration policy

As `root`:

1. Create user `john` with UID `2000`.
2. Create user `davis` with UID `3000`.
3. Set passwords interactively.
4. Configure `davis` so the account expires in 30 days.

What to check before moving on:

- the UIDs are correct in account data
- the account-expiration date is visible with `chage`
- you can explain the difference between password aging and account expiration

### Drill 8: Give one user access to another user's home

As `root`:

1. Make sure users `john` and `davis` exist.
2. Give `davis` full access to `/home/john`.
3. Make that access apply to new files created later as well.
4. Verify with ACL inspection.

What to check before moving on:

- `john` still owns the home directory
- `davis` access is granted with ACL, not by changing ownership
- default ACLs are present for future content

### Drill 9: Create a collaborative directory for one group only

As `root`:

1. Create group `sysgrp` if needed.
2. Create `/redhat/sysgrp`.
3. Give group ownership to `sysgrp`.
4. Let group members collaborate there.
5. Make new files inherit the group automatically.
6. Deny access to users outside the group.

What to check before moving on:

- the directory group is correct
- SGID is set
- others do not have access

### Drill 10: Apply home-directory SELinux context to a custom path

Assume a task asks you to use the same SELinux file type used by home directories on `/xfs`.

As `root`:

1. Inspect the context type used on `/home`.
2. Add a persistent SELinux file-context rule for `/xfs` and its contents.
3. Apply the labels.
4. Verify the result.

What to check before moving on:

- the file type matches the home-directory type
- the policy change is persistent
- `restorecon` applies the label correctly

## Verification steps

1. Confirm you can verify a user with `id`, `getent passwd`, and directory checks.
2. Confirm you can verify both firewall rules and listening ports separately.
3. Confirm you can verify both SELinux runtime mode and configured boot mode.
4. Confirm you can explain why firewall success alone does not prove SELinux success.

## Troubleshooting section

### Problem: network change does not take effect

Symptom:

- settings were modified but the interface still has old values

Fix:

- run `nmcli connection up NAME`
- re-check the connection profile name carefully

### Problem: permission denied with SSH key login

Symptom:

- SSH still asks for password or rejects key use

Fix:

- verify the key was installed for the right user
- check the remote user home and `.ssh` permissions

### Problem: firewall rule not persistent

Symptom:

- port works now but disappears later

Fix:

- use `--permanent`
- reload firewalld
- re-check with `firewall-cmd --list-all`

### Problem: SELinux still blocks service

Symptom:

- firewall and service look correct, but access still fails

Fix:

- inspect contexts with `ls -Z`
- inspect port labels with `semanage port -l`
- inspect relevant booleans with `getsebool -a | grep httpd`

## Common mistakes and recovery

- Mistake: trusting `useradd` without verifying the result.
  Recovery: always run `id`, `getent passwd`, and inspect the home directory.
- Mistake: opening firewall port `85` but forgetting the SELinux port label.
  Recovery: treat firewall and SELinux as separate layers.
- Mistake: using `setenforce 0` as a permanent fix.
  Recovery: fix the policy issue and return to enforcing mode.

## Mini quiz

1. What command activates a changed connection profile?
2. What command safely checks sudoers syntax?
3. What command shows SELinux runtime mode quickly?
4. What command adds a persistent firewall port rule?
5. What command maps port `85` to the HTTP SELinux type?

## Exam-style tasks

### Exam-Style Task 1

Create a user with a custom home and Bash shell, add the user to a supplementary group, configure sudo access safely, and verify everything with commands.

Grader mindset checklist:

- user must exist
- home directory must be correct
- shell must be correct
- group membership must be correct
- sudo configuration must pass syntax check

### Exam-Style Task 2

Configure access for a web service on TCP port `85` with both firewalld and SELinux, then prove the configuration is correct and persistent.

Grader mindset checklist:

- firewall port or service rule must exist
- SELinux port label must exist
- service should listen on the expected port if configured
- settings must still make sense after reboot

## Answer key / solution guide

### Mini quiz answers

1. `nmcli connection up NAME`
2. `visudo -c`
3. `getenforce`
4. `firewall-cmd --add-port=PORT/proto --permanent`
5. `semanage port -a -t http_port_t -p tcp 85`

### Exam-Style Task 1 example solution

```bash
sudo groupadd webteam
sudo useradd -m -d /srv/alice -s /bin/bash alice
sudo usermod -aG webteam alice
sudo visudo
sudo visudo -c
id alice
getent passwd alice
ls -ld /srv/alice
```

### Exam-Style Task 2 example solution

```bash
sudo semanage port -a -t http_port_t -p tcp 85
sudo firewall-cmd --add-port=85/tcp --permanent
sudo firewall-cmd --reload
sudo semanage port -l | grep http_port_t
sudo firewall-cmd --list-ports
ss -tuln | grep :85
```

### Subtitle-derived practice set solutions

#### Drill 1 example solution

```bash
sudo groupadd newgroup
sudo useradd harsh
sudo usermod -aG newgroup harsh
sudo useradd -s /sbin/nologin nitin
id harsh
getent group newgroup
getent passwd nitin
```

Verification:

- `id harsh` should list `newgroup` as a supplementary group
- `getent passwd nitin` should end with `/sbin/nologin`

#### Drill 2 example solution

```bash
nmcli device status
sudo nmcli connection add con-name net type ethernet ifname ens160 ipv4.addresses 192.168.122.50/24 ipv4.gateway 192.168.122.1 ipv4.method manual
sudo nmcli connection modify net ipv4.dns 8.8.8.8
sudo nmcli connection up net
nmcli connection show net
ip addr show ens160
```

Note:

- replace `ens160` with the real interface name from your VM such as `eth0`, `ens3`, or `enp1s0`

#### Drill 3 example solution

```bash
sudo hostnamectl set-hostname servera.lab.example
echo "127.0.0.1 servera.lab.example servera" | sudo tee -a /etc/hosts
hostnamectl
getent hosts servera.lab.example
```

Verification:

- both commands should show the new name consistently

#### Drill 4 example solution

```bash
getsebool -a | grep httpd | grep home
sudo setsebool -P httpd_enable_homedirs on
getsebool httpd_enable_homedirs
```

Verification:

- the boolean should show `on`
- `-P` makes it persistent

#### Drill 5 example solution

```bash
sudo semanage port -a -t http_port_t -p tcp 82
sudo firewall-cmd --add-port=82/tcp --permanent
sudo firewall-cmd --reload
sudo semanage port -l | grep http_port_t | grep 82
sudo firewall-cmd --list-ports
```

Verification:

- the SELinux port list should include `82`
- the firewall rule should include `82/tcp`

#### Drill 6 example solution

```bash
sudo mkdir -p /test
echo "RHCSA lab page" | sudo tee /test/index.html
sudo semanage fcontext -a -t httpd_sys_content_t '/test(/.*)?'
sudo restorecon -Rv /test
ls -Zd /test
ls -Z /test/index.html
```

Verification:

- `/test` and its contents should show `httpd_sys_content_t`
- `restorecon` should be the step that applies the persistent rule

### Repo-derived practice set solutions

#### Drill 7 example solution

```bash
sudo useradd -u 2000 john
sudo useradd -u 3000 davis
sudo passwd john
sudo passwd davis
sudo chage -E "$(date -d '+30 days' +%Y-%m-%d)" davis
getent passwd john
getent passwd davis
sudo chage -l davis
```

Verification:

- `getent passwd` should show the target UIDs
- `chage -l davis` should show a real account-expiration date

#### Drill 8 example solution

```bash
sudo setfacl -R -m u:davis:rwx /home/john
sudo setfacl -R -m d:u:davis:rwx /home/john
getfacl /home/john
```

Verification:

- `u:davis:rwx` grants current access
- `d:u:davis:rwx` becomes the default ACL for new files and directories

#### Drill 9 example solution

```bash
sudo groupadd sysgrp
sudo mkdir -p /redhat/sysgrp
sudo chgrp sysgrp /redhat/sysgrp
sudo chmod 2770 /redhat/sysgrp
ls -ld /redhat/sysgrp
```

Verification:

- the mode should show SGID with something like `drwxrws---`
- only owner and group should have access

#### Drill 10 example solution

```bash
ls -Zd /home
sudo semanage fcontext -a -t user_home_dir_t '/xfs(/.*)?'
sudo restorecon -Rv /xfs
ls -Zd /xfs
```

Verification:

- the type should match the home-directory style context such as `user_home_dir_t`
- use `restorecon`, not `chcon`, when the task requires persistence

## Recap / memory anchors

- `nmcli` changes need activation
- verify users from multiple angles
- firewall and SELinux are separate checks
- runtime state and boot persistence are not the same

## Quick command summary

```bash
ip addr
nmcli connection show
nmcli connection up eth0
hostnamectl
getent hosts servera.lab.example
useradd -m -d /srv/alice -s /bin/bash alice
usermod -aG webteam alice
visudo -c
ssh-keygen
ssh-copy-id user@host
firewall-cmd --list-all
firewall-cmd --add-port=85/tcp --permanent
firewall-cmd --reload
getenforce
sestatus
restorecon -Rv /var/www/html
semanage port -a -t http_port_t -p tcp 85
```
