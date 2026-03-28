# RHCSA and RHCE Local Lab Blueprint

> Build a practical 3-VM local lab that supports both RHCSA and RHCE practice without forcing you to rebuild the environment every week.

## At a Glance

**Purpose**

Help you turn one downloaded Red Hat style cloud image into a stable local lab with one main system and two supporting systems.

**Why this matters for RHCSA and RHCE**

RHCSA needs repeatable practice for storage, networking, users, services, SELinux, SSH, NFS, and reboot-safe configuration. RHCE adds Ansible and multi-host administration. A 3-VM lab gives you enough systems to practice both without wasting effort on a large environment.

**Real-world use**

This setup models a small production network:

- one administrator or control host
- one application or utility host
- one storage or services host

That is close enough to real work that the same lab helps with both exam prep and job skills.

**Prerequisites**

- A local hypervisor such as `virt-manager`, `KVM`, `UTM`, `VirtualBox`, or `VMware`
- One Red Hat compatible cloud image already downloaded
- Enough disk space for three VMs plus snapshots
- Enough memory to run at least two VMs together comfortably
- Root or administrator access on your host machine

**Objectives covered**

- Design a small repeatable RHCSA lab
- Design a small RHCE-ready Ansible lab
- Plan hostnames, IP addresses, and roles
- Prepare storage for LVM, swap, and filesystem practice
- Prepare services for SSH, NFS, autofs, firewalld, and SELinux practice
- Create a baseline snapshot and verification checklist

**Commands/tools used**

`hostnamectl`, `nmcli`, `ip`, `ping`, `ssh`, `ssh-keygen`, `ssh-copy-id`, `dnf`, `systemctl`, `timedatectl`, `chronyc`, `lsblk`, `parted`, `mkfs.xfs`, `mount`, `findmnt`, `exportfs`, `showmount`, `ansible`, `ansible-playbook`

**Offline help references for this topic**

- `man hostnamectl`
- `man nmcli`
- `man ssh-copy-id`
- `man exportfs`
- `man ansible`
- `man ansible-playbook`

**Estimated study time**

2 to 4 hours for the first build, plus 30 to 60 minutes to verify and snapshot it cleanly.

**Common beginner mistakes**

- Building only one VM and then trying to simulate remote tasks locally
- Using dynamic IP addresses and then losing track of the hosts
- Forgetting extra disks for storage practice
- Not keeping a clean baseline snapshot
- Using a cloud image without planning how to set the initial user, password, and host keys

## Concept explanation in simple language

For your goal, the best small lab is:

- `servera`: your main practice box and later your Ansible control node
- `serverb`: a managed node for users, services, web, firewall, and SELinux tasks
- `serverc`: a managed node that can also act as the NFS server and storage-heavy node

This layout works because:

- RHCSA needs at least one remote target for SSH, file copy, NFS, and service checks
- RHCE needs one control node and at least one managed node
- a third system makes NFS, autofs, and service isolation much easier

If you try to do everything on one VM, you can still learn basic commands, but you will lose realism for:

- SSH and key-based trust
- multi-host service checks
- NFS exports and client mounts
- Ansible inventory and playbook targeting
- firewall and hostname resolution practice between systems

This guide assumes you already downloaded a cloud image. That is acceptable, but there is one important warning:

- cloud images are convenient for fast cloning
- normal installed VMs are often easier for boot repair and rescue practice

So the most practical approach is:

- use the cloud image for fast multi-VM cloning now
- later, if you want deeper boot and rescue practice, keep one normal installed VM too

## Recommended lab design

### VM roles

| VM | Main role | Why it exists |
|---|---|---|
| `servera` | main box and control node | daily RHCSA practice now, Ansible control node later |
| `serverb` | managed node 1 | services, users, firewall, SELinux, scripting targets |
| `serverc` | managed node 2 and storage node | NFS exports, autofs targets, extra storage and service practice |

### Recommended resources

| VM | vCPU | RAM | Main disk | Extra disks |
|---|---:|---:|---:|---|
| `servera` | 2 | 4 GB | 40 GB | `1 x 20 GB` |
| `serverb` | 2 | 2 to 4 GB | 30 GB | `1 x 20 GB` |
| `serverc` | 2 | 2 to 4 GB | 30 GB | `2 x 20 GB` |

Why the extra disks matter:

- you need safe space for GPT partitioning
- you need separate devices for `PV`, `VG`, `LV`, and swap practice
- `serverc` benefits from more storage because it can also host NFS shares

### Recommended network design

Use two NICs if your hypervisor allows it:

- `NIC 1`: `NAT`
  - use this for package access and updates
- `NIC 2`: `Host-only` or `Internal network`
  - use this for stable communication between lab systems

Recommended lab addresses:

| Host | Hostname | Lab IP |
|---|---|---|
| `servera` | `servera.lab.local` | `192.168.56.10/24` |
| `serverb` | `serverb.lab.local` | `192.168.56.11/24` |
| `serverc` | `serverc.lab.local` | `192.168.56.12/24` |

Gateway and DNS depend on your hypervisor, but the key idea is simple:

- the internal lab network should stay stable
- your hostnames and `/etc/hosts` should not depend on luck

## Command breakdowns

### Set a hostname

```bash
sudo hostnamectl set-hostname servera.lab.local
```

- sets the persistent hostname
- use a different hostname on each VM

### Check network connections with `nmcli`

```bash
nmcli connection show
nmcli device status
ip -br addr
```

- `nmcli connection show` lists configured connections
- `nmcli device status` shows active device state
- `ip -br addr` gives a short readable IP summary

### Verify host-to-host reachability

```bash
ping -c 3 192.168.56.11
ping -c 3 serverc.lab.local
```

- test IP reachability first
- then test hostname resolution

### Create SSH trust from the main node

```bash
ssh-keygen -t ed25519
ssh-copy-id student@serverb.lab.local
ssh-copy-id student@serverc.lab.local
```

- generate a key on `servera`
- copy it to the other two systems
- this becomes useful immediately for RHCSA and later for RHCE automation

### Verify service state

```bash
systemctl is-active sshd
systemctl is-enabled sshd
```

- `is-active` proves it works now
- `is-enabled` proves it is ready after reboot

### Check storage before using it

```bash
lsblk
sudo parted -l
```

- `lsblk` shows current block devices
- `parted -l` gives a readable partition summary

## Worked examples

### Worked Example 1: Decide which VM should be the NFS server

Best answer:

- use `serverc`

Why:

- it already has the most extra storage
- it keeps storage services separated from your main control node
- it lets `servera` and `serverb` act as clients

Verification:

- you should be able to explain why `servera` is better kept as the control node

### Worked Example 2: Decide which VM should become the Ansible control node

Best answer:

- use `servera`

Why:

- it is your main machine already
- it can hold inventory, playbooks, and SSH keys
- the other two machines can act as managed nodes

Verification:

- you should be able to describe the inventory idea in one sentence: one control node, multiple managed nodes

### Worked Example 3: Decide whether one NIC is enough

Short answer:

- yes, one NIC can work
- but two NICs are better for a serious lab

Why:

- one NIC is enough for simple SSH and service practice
- two NICs make package access easier while keeping the lab network isolated and predictable

Verification:

- you can explain the difference between internet/package access and lab-only communication

## Guided hands-on lab

### Goal

Build three VMs named `servera`, `serverb`, and `serverc` from your downloaded cloud image and make them ready for RHCSA and RHCE practice.

### Setup

Before you start, decide:

- which hypervisor you will use
- where the VM disks will be stored
- whether you will use a cloud-init seed image or the hypervisor's cloud-image import wizard

### Task steps

1. Create `servera` from the cloud image.
2. Assign at least `2 vCPU`, `4 GB RAM`, and `40 GB` main disk space.
3. Add one extra `20 GB` disk to `servera`.
4. Clone or create `serverb` and `serverc` from the same base image.
5. Add one extra `20 GB` disk to `serverb`.
6. Add two extra `20 GB` disks to `serverc`.
7. Set hostnames on all three systems.
8. Configure the lab network so each host has a stable IP address.
9. Add `/etc/hosts` entries on all systems for all three hosts.
10. Set or confirm a usable password for your admin user and for `root`.
11. Enable `sshd` on all three systems.
12. From `servera`, verify you can `ping`, `ssh`, and copy files to `serverb` and `serverc`.
13. Install baseline tools on all systems:

```bash
sudo dnf install -y vim bash-completion curl wget tar chrony nfs-utils
```

14. On `servera`, install Ansible when you are ready for RHCE:

```bash
sudo dnf install -y ansible-core
```

15. Generate an SSH key on `servera` and copy it to the other two systems.
16. On `serverc`, create initial NFS directories:

```bash
sudo mkdir -p /srv/nfs/share /srv/nfs/home
```

17. Take a clean snapshot of all three VMs.

### Expected result

At the end:

- all three VMs boot successfully
- all three have stable names and IPs
- `servera` can reach `serverb` and `serverc`
- extra storage is visible with `lsblk`
- `serverc` is ready to act as the NFS server later
- you have a clean rollback point

## Independent practice tasks

1. Change the lab IP plan to a different private subnet and update all three systems correctly.
2. Rebuild one VM from the base cloud image without touching the other two.
3. Add another extra disk to `serverb` and confirm the system sees it after reboot.
4. Configure passwordless SSH from `servera` to both managed nodes.
5. Install `ansible-core` on `servera` and create a simple inventory file for `serverb` and `serverc`.
6. Configure `chronyd` on all systems and verify time sync status.
7. Create a small NFS export on `serverc` and mount it manually on `serverb`.

## Verification steps

1. Confirm hostnames:

```bash
hostnamectl
```

2. Confirm IP addresses:

```bash
ip -br addr
```

3. Confirm SSH service state:

```bash
systemctl is-active sshd
systemctl is-enabled sshd
```

4. Confirm block devices:

```bash
lsblk
```

5. Confirm node-to-node access from `servera`:

```bash
ping -c 3 serverb.lab.local
ping -c 3 serverc.lab.local
ssh serverb.lab.local hostname
ssh serverc.lab.local hostname
```

6. Confirm the baseline survives reboot:

```bash
sudo reboot
```

After reboot, repeat `hostnamectl`, `ip -br addr`, `lsblk`, and the SSH checks.

## Troubleshooting section

### Problem: cloud image boots but you cannot log in

Symptoms:

- login fails even though the VM is running
- SSH rejects your user

Checks:

- did you define the initial user correctly in cloud-init or the import wizard?
- did you set a password or inject an SSH key?
- did you accidentally disable password authentication too early?

Fix:

- rebuild the seed config cleanly
- verify the username before cloning more VMs

### Problem: VMs can reach the internet but not each other

Symptoms:

- package install works
- lab IP addresses do not respond

Fix:

- check that all three VMs are on the same host-only or internal network
- verify the second NIC actually exists and is up
- confirm the IP addresses are in the same subnet

### Problem: hostnames resolve on one system but not the others

Symptoms:

- `ping 192.168.56.11` works
- `ping serverb.lab.local` fails

Fix:

- check `/etc/hosts`
- confirm each host has the full list of lab names
- verify spacing and spelling

### Problem: extra disks are missing

Symptoms:

- the hypervisor shows the disk
- `lsblk` inside the VM does not

Fix:

- power off and re-check the virtual hardware attachment
- make sure the disk is attached to the correct VM
- reboot the guest and check `dmesg | tail`

### Problem: SSH works with password but not with keys

Symptoms:

- `ssh-copy-id` ran
- key login still prompts or fails

Fix:

- check permissions on `~/.ssh` and `~/.ssh/authorized_keys`
- verify you copied the key to the correct user
- test with `ssh -v serverb.lab.local`

## Common mistakes and recovery

- Mistake: using random VM names
  - Recovery: rename them now and keep the `servera`, `serverb`, `serverc` pattern for the rest of your practice.

- Mistake: no snapshot after baseline
  - Recovery: stop and create one clean snapshot before you start harder tasks.

- Mistake: doing storage practice on the main OS disk
  - Recovery: leave the main system disk alone and use only the extra virtual disks for partitions and LVM.

- Mistake: trying RHCE automation before SSH trust works
  - Recovery: fix `ssh`, `hostname`, and `name resolution` first, then install and test Ansible.

- Mistake: trying to memorize the whole lab
  - Recovery: memorize the design, not every exact command. The important thing is that you can rebuild the lab and verify it.

## Mini quiz

1. Which VM should usually be your Ansible control node?
2. Which VM is the best default NFS server in this 3-VM design?
3. Why are extra disks better than using the main OS disk for storage labs?
4. What is the main advantage of having both NAT and host-only networking?
5. What commands quickly confirm hostname, IP addresses, and visible disks?
6. Why should you take a baseline snapshot before serious RHCSA practice?

## Exam-style tasks

### Exam-Style Task 1

You have three VMs built from one base image. Prepare them so that:

- `servera` can use SSH to reach `serverb` and `serverc` by hostname
- all systems have stable hostnames and addresses
- `serverc` is ready to be used later as an NFS server
- the setup survives reboot

Grader mindset checklist:

- all three hostnames are correct
- name resolution works by hostname, not only IP
- `sshd` is active and enabled
- `servera` can connect remotely to the other nodes
- the result still works after reboot

### Exam-Style Task 2

Prepare the same 3-VM lab for future RHCE work so that:

- `servera` is ready to become the control node
- `serverb` and `serverc` are ready to become managed nodes
- extra disks are visible for later storage labs
- you can explain why this layout supports both RHCSA and RHCE

Grader mindset checklist:

- the role of each VM is clear
- `servera` has the required admin tooling
- the managed nodes are reachable
- block devices are visible where expected
- the design is documented clearly enough to rebuild

## Answer key / solution guide

### Exam-Style Task 1 example solution

One valid solution:

1. Set all hostnames with `hostnamectl set-hostname`.
2. Configure stable lab IPs using `nmcli`.
3. Add all names and addresses to `/etc/hosts` on all systems.
4. Enable and start `sshd` with `systemctl enable --now sshd`.
5. On `servera`, generate an SSH key and use `ssh-copy-id` for the admin user on `serverb` and `serverc`.
6. Create `/srv/nfs/share` and `/srv/nfs/home` on `serverc`.
7. Reboot each system and re-run `hostnamectl`, `ip -br addr`, and `ssh`.

### Exam-Style Task 2 example solution

One valid solution:

1. Keep `servera` as the main system and install `ansible-core` there.
2. Keep `serverb` and `serverc` as managed nodes reachable over SSH.
3. Attach extra disks to all systems and confirm them with `lsblk`.
4. Record a simple host map:

```text
servera = RHCSA main box, RHCE control node
serverb = managed node 1
serverc = managed node 2, NFS and storage node
```

5. Verify everything still works after reboot.

## Recap / memory anchors

- `servera` = main box now, control node later
- `serverb` = managed node
- `serverc` = managed node plus storage/NFS duties
- extra disks are for practice, not the OS disk
- stable hostnames and stable IPs save time
- snapshot the clean baseline before you break anything

## Quick command summary

```bash
hostnamectl set-hostname servera.lab.local
nmcli connection show
ip -br addr
ping -c 3 serverb.lab.local
ssh-keygen -t ed25519
ssh-copy-id student@serverb.lab.local
systemctl enable --now sshd
systemctl is-enabled sshd
lsblk
sudo mkdir -p /srv/nfs/share /srv/nfs/home
sudo dnf install -y vim bash-completion curl wget tar chrony nfs-utils
sudo dnf install -y ansible-core
```
