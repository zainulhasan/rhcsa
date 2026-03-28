# VM Lab Setup and Baseline Checks

> Teach you how to build a safe local RHCSA practice lab and confirm it is ready for the rest of the labs.

## At a Glance

**Why this matters for RHCSA**

You need a repeatable environment where you can break, fix, reboot, and re-test systems without fear. Good lab setup makes the rest of your practice realistic.

**Real-world use**

Administrators often use virtual machines to test package changes, boot settings, storage changes, firewall rules, and service behavior before touching important systems.

**Estimated study time**

2 to 3 hours

## Prerequisites

- A computer capable of running local virtual machines
- Access to a hypervisor such as VirtualBox, VMware, GNOME Boxes, or KVM-based tools
- A RHEL-compatible installation image or an already installed VM

## Objectives Covered

- Set up one or two practice VMs locally
- Plan hostnames, disk layout, and network use
- Create a baseline checklist before advanced labs
- Confirm reboot, sudo, networking, and package manager basics

## Commands/Tools Used

`hostnamectl`, `ip addr`, `ip route`, `ping`, `nmcli`, `lsblk`, `df -h`, `dnf`, `rpm`, `systemctl`, `whoami`, `sudo`, `reboot`

## Offline Help References For This Topic

- `man hostnamectl`
- `man ip`
- `man nmcli`
- `man lsblk`
- `man dnf`
- `man systemctl`

## Common Beginner Mistakes

- Practicing on a machine without snapshots or rollback
- Using only one VM when a second host is needed for SSH and NFS practice
- Not checking whether networking works before later labs
- Not recording hostnames and IP information
- Skipping reboot tests

## Concept Explanation In Simple Language

Your lab should be safe, repeatable, and boring in a good way. You want a system you can rebuild, reboot, and damage without risk.

Recommended local lab:

- `servera` for most administration work
- `serverb` for SSH, remote copy, NFS, and client-server tasks

Minimum useful setup:

- 2 CPUs and 2 to 4 GB RAM for each VM
- one main system disk
- one extra empty disk for storage practice on at least one VM
- local network connectivity between the VMs
- snapshot ability before dangerous labs

Do not wait until storage or SELinux lessons to discover that your VM cannot reboot correctly or cannot talk to another host.

## Command Breakdowns

### Set or inspect hostname

```bash
hostnamectl
sudo hostnamectl set-hostname servera.lab.example
```

### Check networking

```bash
ip addr
ip route
ping -c 4 8.8.8.8
```

### Check storage layout

```bash
lsblk
df -h
```

### Check package tools

```bash
dnf repolist
rpm -q bash
```

## Worked examples

### Worked Example 1: Confirm a second disk exists

```bash
lsblk
```

Expected result:

- you should see the main system disk and an extra disk such as `/dev/vdb`

Verification:

- storage practice will be much easier if a second disk is visible before later labs

### Worked Example 2: Confirm hostname plan

```bash
hostnamectl
```

Expected result:

- system identity should be clear and not left as a random default hostname

Verification:

- write the hostname in your notes file

### Worked Example 3: Confirm package manager works

```bash
dnf repolist
rpm -q bash
```

Verification:

- at least one repository or a known package query should work in your lab

## Guided Hands-On Lab

### Lab Goal

Prepare one or two local VMs so they are ready for RHCSA practice.

### Setup

If your VMs already exist, boot them and log in. If not, create them in your local hypervisor first.

### Task Steps

1. Boot `servera`.
2. Boot `serverb` if available.
3. Record hostnames for both systems.
4. Check IP addresses on both systems.
5. Test ping between the systems if both are available.
6. On `servera`, verify whether an extra disk exists.
7. Confirm you can run commands with `sudo`.
8. Confirm the package manager responds.
9. Reboot `servera`.
10. Log back in and re-check hostname and network status.

### Expected Result

- your lab is usable for remote access, storage, and reboot-safe practice

### Verification Commands

```bash
hostnamectl
ip addr
ip route
ping -c 2 serverb
lsblk
sudo -l
dnf repolist
```

### Cleanup

No cleanup is required. This is your permanent lab baseline.

## Independent Practice Tasks

1. Give both systems clear hostnames if they do not already have them.
2. Record the primary IPv4 address of each VM.
3. Verify whether IPv6 is present.
4. Confirm which VM has the extra storage disk.
5. Reboot one VM and confirm you can still log in, use `sudo`, and reach the network.
6. If you only have one VM, write which later topics will need simulation or adaptation.

## Verification Steps

1. Confirm each VM has a known hostname.
2. Confirm at least one VM has reachable networking.
3. Confirm at least one VM has an extra disk or a clear storage practice plan.

## Troubleshooting Section

### Problem: service not running

Symptom:

- SSH or networking is unavailable

Fix:

```bash
systemctl status NetworkManager
systemctl status sshd
sudo systemctl enable --now sshd
```

### Problem: wrong network mode in hypervisor

Symptom:

- VMs boot but cannot reach each other

Fix:

- check VM network adapter mode
- use a mode that allows host-to-host communication, such as a shared internal or bridged lab design

### Problem: no extra disk

Symptom:

- `lsblk` shows only one system disk

Fix:

- shut down the VM
- add a new virtual disk in the hypervisor
- boot again and verify it appears

### Problem: config changed but not persistent

Symptom:

- hostname or service setting is lost after reboot

Fix:

- use `hostnamectl` for hostname changes
- use `systemctl enable` for services that must start at boot

## Common Mistakes And Recovery

- Mistake: building only one VM and forgetting remote tasks.
  Recovery: add `serverb` now or note which tasks need adaptation.
- Mistake: not checking reboot early.
  Recovery: reboot the lab before trusting it.
- Mistake: ignoring disk layout until storage practice day.
  Recovery: confirm extra disks now.

## Mini Quiz

1. Why is a second VM useful for RHCSA practice?
2. What command quickly shows block devices?
3. What command shows the system hostname?
4. Why should you reboot before deeper practice?
5. What should you record in your notes after lab setup?

## Exam-Style Tasks

### Exam-Style Task 1

Prepare a VM named logically for RHCSA practice, verify networking, confirm package manager access, and prove the machine is safe to use for reboot-based labs.

Grader mindset checklist:

- the hostname should be clear
- network commands should succeed
- package commands should respond
- reboot should succeed
- the machine should still be usable after reboot

### Exam-Style Task 2

On a storage-practice VM, prove that an additional disk is available and record which device it is for later partition and LVM work.

Grader mindset checklist:

- `lsblk` should show the extra device
- the device should not be confused with the system disk
- the learner should be able to name it clearly in notes

## Answer key / solution guide

### Mini Quiz Answers

1. For SSH, file transfer, NFS, and other client-server tasks.
2. `lsblk`
3. `hostnamectl` or `hostname`
4. Because RHCSA tasks often require persistence after reboot.
5. Hostnames, IP addresses, disk layout, and weak areas.

### Exam-Style Task 1 Example Solution

```bash
sudo hostnamectl set-hostname servera.lab.example
hostnamectl
ip addr
ip route
dnf repolist
sudo reboot
```

### Exam-Style Task 2 Example Solution

```bash
lsblk
echo "storage practice disk is /dev/vdb" >> ~/rhcsa-lab-notes/scoreboard.txt
```

## Recap / Memory Anchors

- safe lab first, hard labs second
- two VMs are better than one
- extra disk matters for storage practice
- reboot early so the lab is trustworthy

## Quick Command Summary

```bash
hostnamectl
sudo hostnamectl set-hostname servera.lab.example
ip addr
ip route
ping -c 2 serverb
lsblk
df -h
dnf repolist
sudo reboot
```

## Continue In Order

- If you want one shared lab for both RHCSA and future RHCE work, open `29-rhcsa-rhce-local-lab-blueprint.md` next
- If you only want the RHCSA section labs for now, continue to `24-foundations-labs.md`
