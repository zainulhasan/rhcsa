---
description: Checklist of every official RHEL 10 EX200 objective with where to learn it, where to practise it, and a confidence mark.
---

# Objectives Map

> Use this page as your checklist: for every official RHEL 10 EX200 objective, where to learn it, where to practise it.

!!! note "Where the list comes from"
    The objective list on this page is taken from Red Hat's official [EX200 exam page](https://www.redhat.com/en/services/training/ex200-red-hat-certified-system-administrator-rhcsa-exam), which states that the exam is based on Red Hat Enterprise Linux 10. It has 62 objectives in 10 groups, and the wording below is copied as published. Red Hat publishes no changelog for the list, so check the official page again before you book your exam.

!!! note "Containers are not on the list"
    Podman and containers are not an EX200 objective for RHEL 10. The course keeps them as an optional chapter: [15a Containers with Podman](15a-containers-with-podman.md). Nothing below depends on it.

!!! tip "How to use this map"
    1. Work through the lessons in order. When you finish a lesson, come here and use the **Learn it** links to re-read the exact section for each objective in that group.
    2. Do the **Practise it** items. "Lesson lab" means the `Hands-on lab` section of the lesson itself. Drills come from the [labs](22-labs-track-and-skill-check-guide.md). Mock task numbers point to the numbered task lists in the mock exams.
    3. Mark the **Confidence** column on your own copy: change `☐` to `☑` only when you can do the task from a blank prompt, with only `man` and `/usr/share/doc`, and prove it survives a reboot.
    4. Re-visit anything you could not tick, then read [Objectives that need extra attention](#objectives-that-need-extra-attention) at the end.

## Understand and use essential tools

| Objective | Learn it | Practise it | Confidence |
|---|---|---|:-:|
| Access a shell prompt and issue commands with correct syntax | [01 section 1](01-shell-basics-and-command-syntax.md#1-where-am-i-who-am-i) | [Lesson lab](01-shell-basics-and-command-syntax.md#hands-on-lab)<br>[Lab 24 guided lab](24-foundations-labs.md#guided-hands-on-lab) | ☐ |
| Use input-output redirection (>, >>, |, 2>, etc.) | [03 section 1](03-redirection-pipes-grep-and-regex.md#1-send-output-to-a-file-and)<br>[03 section 2](03-redirection-pipes-grep-and-regex.md#2-split-errors-from-results-2-21-devnull)<br>[03 section 4 (pipes)](03-redirection-pipes-grep-and-regex.md#4-connect-commands-with-and-show-and-save-with-tee) | [Lab 24 Drill 5](24-foundations-labs.md#drill-5-search-text-and-save-the-result-to-a-file)<br>[Lesson lab](03-redirection-pipes-grep-and-regex.md#hands-on-lab) | ☐ |
| Use grep and regular expressions to analyze text | [03 section 5 (grep)](03-redirection-pipes-grep-and-regex.md#5-search-with-grep) | [Lab 24 Drill 5](24-foundations-labs.md#drill-5-search-text-and-save-the-result-to-a-file)<br>[Lab 24 Drill 8](24-foundations-labs.md#drill-8-find-files-that-contain-a-given-string)<br>[Mock 1 task 4](18-mock-exam-1.md#tasks) | ☐ |
| Access remote systems using SSH | [05 section 1](05-ssh-login-switching-users-and-remote-workflows.md#1-log-in-and-identify-context) | [Lesson lab](05-ssh-login-switching-users-and-remote-workflows.md#hands-on-lab)<br>[Lab 26 guided lab](26-networking-users-and-security-labs.md#guided-hands-on-lab) | ☐ |
| Log in and switch users in multi-user targets | [01 section 8](01-shell-basics-and-command-syntax.md#8-switch-users-su-sudo-i-sudo-u)<br>[05 section 6](05-ssh-login-switching-users-and-remote-workflows.md#6-switching-users-inside-an-ssh-session) | [Lesson lab](01-shell-basics-and-command-syntax.md#hands-on-lab)<br>[Lesson lab](05-ssh-login-switching-users-and-remote-workflows.md#hands-on-lab) | ☐ |
| Archive, compress, unpack, and uncompress files using tar, gzip, and bzip2 | [04 section 1 (tar)](04-archives-compression-and-secure-file-transfer.md#1-create-an-archive-with-tar)<br>[04 section 4 (compression)](04-archives-compression-and-secure-file-transfer.md#4-add-compression-with-z-j-j)<br>[04 section 6 (single files)](04-archives-compression-and-secure-file-transfer.md#6-compress-and-uncompress-a-single-file) | [Lab 24 Drill 6](24-foundations-labs.md#drill-6-create-a-gzip-compressed-archive-of-usrlocal)<br>[Mock 2 task 5](20-mock-exam-2.md#tasks) | ☐ |
| Create and edit text files | [02 section 8 (vi/vim)](02-files-directories-and-text-editing.md#8-edit-text-vivim)<br>[02 section 9 (nano)](02-files-directories-and-text-editing.md#9-edit-text-nano-the-simple-alternative) | [Lesson lab](02-files-directories-and-text-editing.md#hands-on-lab) | ☐ |
| Create, delete, copy, and move files and directories | [02 section 2 (mkdir)](02-files-directories-and-text-editing.md#2-create-directories-mkdir-and-rmdir)<br>[02 section 3 (cp)](02-files-directories-and-text-editing.md#3-copy-cp)<br>[02 section 4 (mv)](02-files-directories-and-text-editing.md#4-move-and-rename-mv)<br>[02 section 5 (rm)](02-files-directories-and-text-editing.md#5-delete-rm) | [Lesson lab](02-files-directories-and-text-editing.md#hands-on-lab)<br>[Lab 24 Drill 7](24-foundations-labs.md#drill-7-find-old-files-and-copy-them-to-a-staging-directory) | ☐ |
| Create hard and soft links | [06 section 1](06-links-permissions-and-default-permissions.md#1-create-links) | [Mock 1 task 3](18-mock-exam-1.md#tasks)<br>[Lab 24 guided lab](24-foundations-labs.md#guided-hands-on-lab) | ☐ |
| List, set, and change standard ugo/rwx permissions | [06 section 3](06-links-permissions-and-default-permissions.md#3-change-permissions-with-symbolic-mode)<br>[06 section 4](06-links-permissions-and-default-permissions.md#4-change-permissions-with-numeric-mode) | [Lab 24 Drill 2](24-foundations-labs.md#drill-2-shared-project-directory-with-sgid)<br>[Lab 24 Drill 3](24-foundations-labs.md#drill-3-sticky-bit-drop-zone)<br>[Mock 1 task 2](18-mock-exam-1.md#tasks) | ☐ |
| Locate, read, and use system documentation including man, info, and files in /usr/share/doc | [00 section 3 (man)](00-study-skills-and-offline-help.md#3-man-the-main-offline-manual)<br>[00 section 7 (/usr/share/doc)](00-study-skills-and-offline-help.md#7-usrsharedoc-and-rpm-qd-package-documentation) | [Bank speed drill 1](28-rhcsa-10-mixed-practice-bank.md#extra-speed-drills-by-objective-group)<br>[Lesson lab](00-study-skills-and-offline-help.md#hands-on-lab) | ☐ |

## Manage software

| Objective | Learn it | Practise it | Confidence |
|---|---|---|:-:|
| Configure access to RPM repositories | [07 section 2](07-software-management-rpm-repos-and-flatpak.md#2-write-a-repo-file-configure-access-to-a-repository) | [Bank priority Q2](28-rhcsa-10-mixed-practice-bank.md#priority-core-set-by-objective-group)<br>[Lab 25 guided lab](25-administration-core-labs.md#guided-hands-on-lab) | ☐ |
| Install and remove RPM software packages | [07 section 3 (dnf)](07-software-management-rpm-repos-and-flatpak.md#3-install-update-and-remove-with-dnf) | [Mock 1 task 5](18-mock-exam-1.md#tasks)<br>[Lab 25 guided lab](25-administration-core-labs.md#guided-hands-on-lab) | ☐ |
| Configure access to Flatpak repositories | [07 section 7 (Flatpak)](07-software-management-rpm-repos-and-flatpak.md#7-flatpak-remotes-install-update-remove) | [Lesson lab](07-software-management-rpm-repos-and-flatpak.md#hands-on-lab) | ☐ |
| Install and remove Flatpak software packages | [07 section 7 (Flatpak)](07-software-management-rpm-repos-and-flatpak.md#7-flatpak-remotes-install-update-remove) | [Lesson lab](07-software-management-rpm-repos-and-flatpak.md#hands-on-lab) | ☐ |

## Create simple shell scripts

| Objective | Learn it | Practise it | Confidence |
|---|---|---|:-:|
| Conditionally execute code (use of: if, test, [], etc.) | [08 section 4](08-shell-scripting-basics.md#4-conditionals-if-elif-else-and-test) | [Lab 25 Drill 3](25-administration-core-labs.md#drill-3-argument-based-script-with-directory-test)<br>[Lab 25 Drill 4](25-administration-core-labs.md#drill-4-count-arguments-and-warn-if-there-are-too-many) | ☐ |
| Use Looping constructs (for, etc.) to process file, command line input | [08 section 5](08-shell-scripting-basics.md#5-loops-for-and-while-read) | [Lab 25 Drill 5](25-administration-core-labs.md#drill-5-for-loop-file-processing) | ☐ |
| Process script inputs ($1, $2, etc.) | [08 section 2](08-shell-scripting-basics.md#2-script-inputs-0-1) | [Lab 25 Drill 3](25-administration-core-labs.md#drill-3-argument-based-script-with-directory-test)<br>[Lab 25 Drill 4](25-administration-core-labs.md#drill-4-count-arguments-and-warn-if-there-are-too-many)<br>[Mock 1 task 6](18-mock-exam-1.md#tasks) | ☐ |
| Processing output of shell commands within a script | [08 section 6](08-shell-scripting-basics.md#6-command-substitution-and-arithmetic) | [Lab 25 guided lab](25-administration-core-labs.md#guided-hands-on-lab)<br>[Lesson lab](08-shell-scripting-basics.md#hands-on-lab) | ☐ |

## Operate running systems

| Objective | Learn it | Practise it | Confidence |
|---|---|---|:-:|
| Boot, reboot, and shut down a system normally | [09 section 1](09-boot-targets-processes-logs-and-tuning.md#1-boot-reboot-and-shut-down-normally) | [Mock 1 task 18](18-mock-exam-1.md#tasks)<br>[Lesson lab](09-boot-targets-processes-logs-and-tuning.md#hands-on-lab) | ☐ |
| Boot systems into different targets manually | [09 section 3](09-boot-targets-processes-logs-and-tuning.md#3-boot-into-a-different-target-from-grub-one-time) | [Lesson lab](09-boot-targets-processes-logs-and-tuning.md#hands-on-lab) | ☐ |
| Interrupt the boot process in order to gain access to a system | [09 section 4](09-boot-targets-processes-logs-and-tuning.md#4-interrupt-the-boot-to-reset-a-lost-root-password) | [Bank priority Q17](28-rhcsa-10-mixed-practice-bank.md#priority-core-set-by-objective-group)<br>[Lesson lab](09-boot-targets-processes-logs-and-tuning.md#hands-on-lab) | ☐ |
| Identify CPU/memory intensive processes and kill processes | [09 section 6](09-boot-targets-processes-logs-and-tuning.md#6-find-cpu-and-memory-intensive-processes)<br>[09 section 7](09-boot-targets-processes-logs-and-tuning.md#7-kill-processes) | [Lab 25 guided lab](25-administration-core-labs.md#guided-hands-on-lab)<br>[Lesson lab](09-boot-targets-processes-logs-and-tuning.md#hands-on-lab) | ☐ |
| Adjust  process scheduling | [09 section 8](09-boot-targets-processes-logs-and-tuning.md#8-adjust-process-scheduling-nice-and-renice) | [Lesson lab](09-boot-targets-processes-logs-and-tuning.md#hands-on-lab) | ☐ |
| Manage tuning profiles | [09 section 11](09-boot-targets-processes-logs-and-tuning.md#11-manage-tuning-profiles) | [Lesson lab](09-boot-targets-processes-logs-and-tuning.md#hands-on-lab) | ☐ |
| Locate and interpret system log files and journals | [09 section 9](09-boot-targets-processes-logs-and-tuning.md#9-locate-and-interpret-log-files) | [Mock 2 task 8](20-mock-exam-2.md#tasks)<br>[Bank speed drill 14](28-rhcsa-10-mixed-practice-bank.md#extra-speed-drills-by-objective-group) | ☐ |
| Preserve system journals | [09 section 10](09-boot-targets-processes-logs-and-tuning.md#10-preserve-system-journals) | [Lab 25 Drill 11](25-administration-core-labs.md#drill-11-make-journald-persistent-with-configuration)<br>[Mock 1 task 17](18-mock-exam-1.md#tasks) | ☐ |
| Start, stop, and check the status of network services | [09 section 5](09-boot-targets-processes-logs-and-tuning.md#5-start-stop-and-check-network-services) | [Mock 1 task 9](18-mock-exam-1.md#tasks)<br>[Bank speed drill 11](28-rhcsa-10-mixed-practice-bank.md#extra-speed-drills-by-objective-group) | ☐ |
| Securely transfer files between systems | [04 section 7 (scp/sftp/rsync)](04-archives-compression-and-secure-file-transfer.md#7-copy-files-securely-scp-sftp-rsync)<br>[05 section 3 (scp)](05-ssh-login-switching-users-and-remote-workflows.md#3-copy-files-with-scp) | [Lab 24 guided lab](24-foundations-labs.md#guided-hands-on-lab)<br>[Lesson lab](05-ssh-login-switching-users-and-remote-workflows.md#hands-on-lab) | ☐ |

## Configure local storage

| Objective | Learn it | Practise it | Confidence |
|---|---|---|:-:|
| List, create, and delete partitions on GPT disks | [10 section 2](10-storage-partitions-lvm-and-swap.md#2-create-a-gpt-partition-with-parted) | [Lab 25 Drill 1](25-administration-core-labs.md#drill-1-create-a-1-gib-xfs-partition-and-mount-it-persistently)<br>[Mock 1 task 11](18-mock-exam-1.md#tasks) | ☐ |
| Create and remove physical volumes | [10 section 4](10-storage-partitions-lvm-and-swap.md#4-create-lvm-objects)<br>[10 section 8](10-storage-partitions-lvm-and-swap.md#8-remove-lvm-objects-safely) | [Lab 25 Drill 8](25-administration-core-labs.md#drill-8-create-an-lv-by-extents-and-custom-pe-size)<br>[Mock 1 task 11](18-mock-exam-1.md#tasks) | ☐ |
| Assign physical volumes to volume groups | [10 section 4](10-storage-partitions-lvm-and-swap.md#4-create-lvm-objects)<br>[10 section 5](10-storage-partitions-lvm-and-swap.md#5-extend-a-volume-group-and-a-logical-volume) | [Lab 25 Drill 8](25-administration-core-labs.md#drill-8-create-an-lv-by-extents-and-custom-pe-size)<br>[Mock 2 task 13](20-mock-exam-2.md#tasks) | ☐ |
| Create and delete logical volumes | [10 section 4](10-storage-partitions-lvm-and-swap.md#4-create-lvm-objects)<br>[10 section 8](10-storage-partitions-lvm-and-swap.md#8-remove-lvm-objects-safely) | [Lab 25 Drill 8](25-administration-core-labs.md#drill-8-create-an-lv-by-extents-and-custom-pe-size)<br>[Lab 25 Drill 12](25-administration-core-labs.md#drill-12-create-a-vfat-lv-by-extents-and-mount-it) | ☐ |
| Configure systems to mount file systems at boot by universally unique ID (UUID) or label | [10 section 6](10-storage-partitions-lvm-and-swap.md#6-make-a-filesystem-then-mount-it-by-uuid-or-label)<br>[11 section 3](11-filesystems-mounts-nfs-and-autofs.md#3-make-mounts-persistent-by-uuid-or-label) | [Lab 25 Drill 1](25-administration-core-labs.md#drill-1-create-a-1-gib-xfs-partition-and-mount-it-persistently)<br>[Mock 1 task 12](18-mock-exam-1.md#tasks)<br>[Mock 2 task 14](20-mock-exam-2.md#tasks) | ☐ |
| Add new partitions and logical volumes, and swap to a system non-destructively | [10 section 1](10-storage-partitions-lvm-and-swap.md#1-inspect-and-find-free-space-first-non-destructive)<br>[10 section 7](10-storage-partitions-lvm-and-swap.md#7-create-swap-partition-lv-then-persist) | [Lab 25 Drill 2](25-administration-core-labs.md#drill-2-add-swap-without-removing-current-swap)<br>[Mock 1 task 13](18-mock-exam-1.md#tasks) | ☐ |

## Create and configure file systems

| Objective | Learn it | Practise it | Confidence |
|---|---|---|:-:|
| Create, mount, unmount, and use VFAT, ext4, and XFS file systems | [11 section 1](11-filesystems-mounts-nfs-and-autofs.md#1-create-a-filesystem)<br>[11 section 2](11-filesystems-mounts-nfs-and-autofs.md#2-mount-and-unmount) | [Lab 25 Drill 1](25-administration-core-labs.md#drill-1-create-a-1-gib-xfs-partition-and-mount-it-persistently)<br>[Lab 25 Drill 12](25-administration-core-labs.md#drill-12-create-a-vfat-lv-by-extents-and-mount-it)<br>[Mock 2 task 14](20-mock-exam-2.md#tasks) | ☐ |
| Mount and unmount network file systems using NFS | [11 section 5](11-filesystems-mounts-nfs-and-autofs.md#5-mount-an-nfs-share-client-side) | [Mock 2 task 16](20-mock-exam-2.md#tasks)<br>[Lesson lab](11-filesystems-mounts-nfs-and-autofs.md#hands-on-lab) | ☐ |
| Configure autofs | [11 section 6](11-filesystems-mounts-nfs-and-autofs.md#6-autofs-mount-on-demand) | [Lab 25 Drill 10](25-administration-core-labs.md#drill-10-autofs-home-style-mount)<br>[Bank priority Q6](28-rhcsa-10-mixed-practice-bank.md#priority-core-set-by-objective-group) | ☐ |
| Extend existing logical volumes | [11 section 4](11-filesystems-mounts-nfs-and-autofs.md#4-extend-an-existing-logical-volume)<br>[10 section 5](10-storage-partitions-lvm-and-swap.md#5-extend-a-volume-group-and-a-logical-volume) | [Mock 2 task 15](20-mock-exam-2.md#tasks)<br>[Bank priority Q20](28-rhcsa-10-mixed-practice-bank.md#priority-core-set-by-objective-group) | ☐ |
| Diagnose and correct file permission problems | [06 section 7](06-links-permissions-and-default-permissions.md#7-diagnose-and-correct-file-permission-problems)<br>[11 section 7](11-filesystems-mounts-nfs-and-autofs.md#7-diagnose-and-correct-file-permission-problems) | [Lesson 06 Lab B (break and fix)](06-links-permissions-and-default-permissions.md#lab-b-break-and-fix)<br>[Lab 24 Drill 2](24-foundations-labs.md#drill-2-shared-project-directory-with-sgid) | ☐ |

## Deploy, configure, and maintain systems

| Objective | Learn it | Practise it | Confidence |
|---|---|---|:-:|
| Schedule tasks using at, cron and systemd timer units | [12 section 1 (at)](12-scheduling-services-time-and-bootloader.md#1-one-time-jobs-with-at)<br>[12 section 2 (cron)](12-scheduling-services-time-and-bootloader.md#2-repeating-jobs-with-cron)<br>[12 section 3 (timers)](12-scheduling-services-time-and-bootloader.md#3-create-a-systemd-timer) | [Lab 25 Drill 6](25-administration-core-labs.md#drill-6-user-specific-cron-and-reboot)<br>[Mock 1 task 7](18-mock-exam-1.md#tasks)<br>[Mock 1 task 8](18-mock-exam-1.md#tasks) | ☐ |
| Start and stop services and configure services to start automatically at boot | [12 section 4](12-scheduling-services-time-and-bootloader.md#4-services-start-stop-and-enable-at-boot) | [Mock 1 task 9](18-mock-exam-1.md#tasks)<br>[Bank speed drill 11](28-rhcsa-10-mixed-practice-bank.md#extra-speed-drills-by-objective-group) | ☐ |
| Configure systems to boot into a specific target automatically | [12 section 5](12-scheduling-services-time-and-bootloader.md#5-boot-into-a-specific-target-automatically) | [Lesson lab](12-scheduling-services-time-and-bootloader.md#hands-on-lab) | ☐ |
| Configure time service clients | [12 section 6](12-scheduling-services-time-and-bootloader.md#6-time-service-clients-with-chrony) | [Lab 25 Drill 7](25-administration-core-labs.md#drill-7-configure-a-chrony-client)<br>[Mock 2 task 7](20-mock-exam-2.md#tasks) | ☐ |
| Install and update software packages from Red Hat Content Delivery Network, a remote repository, or from the local file system | [07 section 3 (dnf)](07-software-management-rpm-repos-and-flatpak.md#3-install-update-and-remove-with-dnf)<br>[07 section 4 (local rpm)](07-software-management-rpm-repos-and-flatpak.md#4-install-from-a-local-rpm-file)<br>[07 section 6 (CDN)](07-software-management-rpm-repos-and-flatpak.md#6-red-hat-cdn-and-subscription-checks) | [Bank priority Q2](28-rhcsa-10-mixed-practice-bank.md#priority-core-set-by-objective-group)<br>[Lab 25 guided lab](25-administration-core-labs.md#guided-hands-on-lab) | ☐ |
| Modify the system bootloader | [12 section 7](12-scheduling-services-time-and-bootloader.md#7-modify-the-bootloader) | [Lab 25 Drill 13](25-administration-core-labs.md#drill-13-change-the-default-boot-kernel-safely) | ☐ |

## Manage basic networking

| Objective | Learn it | Practise it | Confidence |
|---|---|---|:-:|
| Configure IPv4 and IPv6 addresses | [13 section 2 (IPv4)](13-networking-hostname-resolution-and-firewalld.md#2-configure-a-static-ipv4-address)<br>[13 section 3 (IPv6)](13-networking-hostname-resolution-and-firewalld.md#3-configure-a-static-ipv6-address) | [Lab 26 Drill 2](26-networking-users-and-security-labs.md#drill-2-static-networkmanager-profile)<br>[Lab 26 guided lab](26-networking-users-and-security-labs.md#guided-hands-on-lab) | ☐ |
| Configure hostname resolution | [13 section 6](13-networking-hostname-resolution-and-firewalld.md#6-check-dns-and-name-resolution)<br>[13 section 7](13-networking-hostname-resolution-and-firewalld.md#7-set-and-read-the-hostname) | [Lab 26 Drill 3](26-networking-users-and-security-labs.md#drill-3-hostname-and-local-name-resolution)<br>[Mock 2 task 10](20-mock-exam-2.md#tasks)<br>[Mock 2 task 11](20-mock-exam-2.md#tasks) | ☐ |
| Configure network services to start automatically at boot | [13 section 5](13-networking-hostname-resolution-and-firewalld.md#5-bring-connections-up-and-down-and-make-them-start-at-boot)<br>[12 section 4](12-scheduling-services-time-and-bootloader.md#4-services-start-stop-and-enable-at-boot) | [Mock 1 task 9](18-mock-exam-1.md#tasks)<br>[Bank speed drill 11](28-rhcsa-10-mixed-practice-bank.md#extra-speed-drills-by-objective-group) | ☐ |
| Restrict network access using firewalld and firewall-cmd | [13 section 10](13-networking-hostname-resolution-and-firewalld.md#10-firewalld-services-ports-removal)<br>[13 section 11](13-networking-hostname-resolution-and-firewalld.md#11-firewalld-zones-and-sources-restricting-access) | [Lab 26 guided lab](26-networking-users-and-security-labs.md#guided-hands-on-lab)<br>[Mock 2 task 12](20-mock-exam-2.md#tasks)<br>[Bank speed drill 12](28-rhcsa-10-mixed-practice-bank.md#extra-speed-drills-by-objective-group) | ☐ |

## Manage users and groups

| Objective | Learn it | Practise it | Confidence |
|---|---|---|:-:|
| Create, delete, and modify local user accounts | [14 section 1](14-users-groups-passwords-and-sudo.md#1-create-and-inspect-users)<br>[14 section 2](14-users-groups-passwords-and-sudo.md#2-modify-and-delete-users) | [Lab 26 Drill 1](26-networking-users-and-security-labs.md#drill-1-users-supplementary-groups-and-non-login-shell)<br>[Lab 26 Drill 7](26-networking-users-and-security-labs.md#drill-7-create-users-with-specific-uids-and-expiration-policy)<br>[Mock 2 task 1](20-mock-exam-2.md#tasks) | ☐ |
| Change passwords and adjust password aging for local user accounts | [14 section 4](14-users-groups-passwords-and-sudo.md#4-set-passwords)<br>[14 section 5](14-users-groups-passwords-and-sudo.md#5-password-aging-with-chage) | [Lab 26 Drill 7](26-networking-users-and-security-labs.md#drill-7-create-users-with-specific-uids-and-expiration-policy)<br>[Mock 1 task 1](18-mock-exam-1.md#tasks) | ☐ |
| Create, delete, and modify local groups and group memberships | [14 section 3](14-users-groups-passwords-and-sudo.md#3-create-and-manage-groups) | [Lab 26 Drill 1](26-networking-users-and-security-labs.md#drill-1-users-supplementary-groups-and-non-login-shell)<br>[Bank speed drill 6](28-rhcsa-10-mixed-practice-bank.md#extra-speed-drills-by-objective-group) | ☐ |
| Configure privileged access | [14 section 7](14-users-groups-passwords-and-sudo.md#7-configure-privileged-access) | [Bank priority Q15](28-rhcsa-10-mixed-practice-bank.md#priority-core-set-by-objective-group)<br>[Mock 2 task 2](20-mock-exam-2.md#tasks) | ☐ |

## Manage security

| Objective | Learn it | Practise it | Confidence |
|---|---|---|:-:|
| Configure firewall settings using firewall-cmd/firewalld | [13 section 9](13-networking-hostname-resolution-and-firewalld.md#9-firewalld-runtime-vs-permanent)<br>[13 section 10](13-networking-hostname-resolution-and-firewalld.md#10-firewalld-services-ports-removal) | [Lab 26 guided lab](26-networking-users-and-security-labs.md#guided-hands-on-lab)<br>[Mock 1 task 15](18-mock-exam-1.md#tasks)<br>[Mock 2 task 12](20-mock-exam-2.md#tasks) | ☐ |
| Manage default file permissions | [06 section 6 (umask)](06-links-permissions-and-default-permissions.md#6-check-set-and-persist-the-default-umask) | [Lesson 06 Lab A (umask)](06-links-permissions-and-default-permissions.md#lab-a-links-permissions-and-umask)<br>[Bank priority Q13](28-rhcsa-10-mixed-practice-bank.md#priority-core-set-by-objective-group) | ☐ |
| Configure key-based authentication for SSH | [15 section 8](15-selinux-ssh-keys-and-security.md#8-create-an-ssh-key-pair-and-install-it)<br>[05 section 4 (keys)](05-ssh-login-switching-users-and-remote-workflows.md#4-key-based-login-create-the-key-pair-then-install-it) | [Lesson 15 Lab B (SSH keys)](15-selinux-ssh-keys-and-security.md#lab-b-ssh-key-login-and-the-permission-check)<br>[Mock 1 task 10](18-mock-exam-1.md#tasks)<br>[Mock 2 task 17](20-mock-exam-2.md#tasks) | ☐ |
| Set enforcing and permissive modes for SELinux | [15 section 1](15-selinux-ssh-keys-and-security.md#1-check-and-set-the-selinux-mode) | [Lesson 15 Lab A (label, port, boolean)](15-selinux-ssh-keys-and-security.md#lab-a-label-port-and-boolean-fix-on-a-web-server)<br>[Mock 1 task 16](18-mock-exam-1.md#tasks) | ☐ |
| List and identify SELinux file and process context | [15 section 2](15-selinux-ssh-keys-and-security.md#2-inspect-contexts) | [Lesson 15 Lab A (label, port, boolean)](15-selinux-ssh-keys-and-security.md#lab-a-label-port-and-boolean-fix-on-a-web-server) | ☐ |
| Restore default file contexts | [15 section 3](15-selinux-ssh-keys-and-security.md#3-restore-default-labels-with-restorecon) | [Lab 26 Drill 6](26-networking-users-and-security-labs.md#drill-6-serve-content-from-a-nonstandard-directory-with-selinux)<br>[Mock 1 task 16](18-mock-exam-1.md#tasks) | ☐ |
| Manage SELinux port labels | [15 section 5](15-selinux-ssh-keys-and-security.md#5-manage-port-labels) | [Lab 26 Drill 5](26-networking-users-and-security-labs.md#drill-5-allow-httpd-on-custom-port-82)<br>[Bank speed drill 12](28-rhcsa-10-mixed-practice-bank.md#extra-speed-drills-by-objective-group) | ☐ |
| Use Boolean settings to modify system SELinux settings | [15 section 6](15-selinux-ssh-keys-and-security.md#6-use-booleans) | [Lab 26 Drill 4](26-networking-users-and-security-labs.md#drill-4-selinux-boolean-for-http-home-directories) | ☐ |

## Objectives that need extra attention

Coverage is not equal everywhere. These objectives are practised mainly in one lesson lab, with no dedicated drill in the lab files, or they need setup that is easy to skip. Write your own extra drill for each before the exam.

1. **Configure access to Flatpak repositories** and **Install and remove Flatpak software packages**: taught in [07 section 7](07-software-management-rpm-repos-and-flatpak.md#7-flatpak-remotes-install-update-remove) and practised only in the lesson lab. A remote such as Flathub needs internet access, so a fully offline lab cannot repeat it.
2. **Manage tuning profiles**: one section in [09](09-boot-targets-processes-logs-and-tuning.md#11-manage-tuning-profiles) and one lab line. There is no drill or mock task, so it is easy to forget `tuned-adm`.
3. **Schedule tasks using at, cron and systemd timer units**: `at` and `cron` have drills and mock tasks. The systemd timer part is covered only by [12 section 3](12-scheduling-services-time-and-bootloader.md#3-create-a-systemd-timer) and its lesson lab.
4. **Interrupt the boot process in order to gain access to a system**: lab-only and risky. The mixed bank only tells you to rehearse it on a disposable snapshot. Take a VM snapshot and repeat it until it is routine.
5. **Configure IPv4 and IPv6 addresses**: the lab drill is IPv4. IPv6 is covered by one lesson section and one line of the lesson lab.
6. **Mount and unmount network file systems using NFS**: you need `serverb` acting as an NFS server before you can practise. Only mock 2 task 16 and the lesson lab use it, and the mock leaves the setup to you.
7. **Configure systems to boot into a specific target automatically** and **Adjust process scheduling**: both are single-section topics with a lesson lab line and no separate drill. They are quick to learn and quick to lose.
8. **Configure network services to start automatically at boot**: this overlaps with services and with connection profiles (autoconnect), and the course has no drill that isolates it. Check both `systemctl is-enabled` and the connection's autoconnect setting when you practise.

---

Back to [How To Study This Course](repository-guide.md) or the [Labs Track and Skill Check Guide](22-labs-track-and-skill-check-guide.md).
