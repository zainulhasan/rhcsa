---
description: A self-contained 18-task practice exam on servera and serverb with exact values, points and a final reboot check; solutions are in the next file.
---

# Mock Exam 1

> Do 18 hands-on tasks on a clean `servera`, score yourself out of 100, and prove that everything survives a reboot.

## How this mock works

Use this only after you have completed:

- lessons [00](00-study-skills-and-offline-help.md) to [16](16-persistence-reboot-checks-and-troubleshooting.md)
- labs `22-26`
- [28 Mixed Practice Bank](28-rhcsa-10-mixed-practice-bank.md)
- [17a Command Reference Cheat Sheet](17a-rhcsa-command-reference-cheat-sheet.md)
- [17 Final Week Plan](17-final-review-cheat-sheets.md)

**Rules for this practice run**

- Suggested practice time budget: 3 hours. This is this course's own pacing suggestion, not a statement about any real exam.
- Work without internet. Use only local documentation (`man`, `--help`, `/usr/share/doc`).
- Verify every task before you move on.
- Reboot only when Task 18 says so (the persistence tasks are checked there).
- Do not open [19 Mock Exam 1 Solutions](19-mock-exam-1-solutions.md) until you are finished.

**Self-scoring (this course's own practice scheme).** The tasks add up to 100 points. A task earns its full points only when every box in its checklist is true; there is no partial credit. Treat **70 points** as your own target to move on to Mock Exam 2. This is a study aid, not a prediction of any real result.

| Task | Skill | Points |
|---|---|---|
| 1 | Users, groups, password aging | 6 |
| 2 | Directory ownership and permissions | 5 |
| 3 | Files, hard link, symbolic link | 5 |
| 4 | Search text, redirect output | 4 |
| 5 | Install a package | 3 |
| 6 | Shell script with an argument | 6 |
| 7 | One-time `at` job | 4 |
| 8 | Recurring cron job | 4 |
| 9 | Service now and at boot | 3 |
| 10 | SSH key-based login | 6 |
| 11 | Partition, VG, LV | 7 |
| 12 | XFS, persistent mount by UUID | 7 |
| 13 | Swap, persistent by UUID | 5 |
| 14 | Hostname | 3 |
| 15 | Firewall rule | 4 |
| 16 | SELinux mode and file labels | 5 |
| 17 | Persistent journal | 4 |
| 18 | Reboot and re-verify everything | 19 |
| | **Total** | **100** |

## Lab assumptions and Setup

- Shared lab environment: you log in as `student` (password `student`, sudo) on `servera.lab.example` (`192.168.122.10`). Use `sudo` for every privileged command.
- `serverb.lab.example` (`192.168.122.11`) is running, has the user `student` with password `student`, and `sshd` is active. Only Task 10 needs it.
- `/dev/vdb` (2 GiB) is the spare disk on `servera` and must be empty. `/dev/vdc` is not used in this mock.
- This mock installs `at`, `tree` and `httpd` itself; they do not have to be present at the start.
- Name resolution: Task 10 uses `serverb.lab.example`. If it does not resolve on your VMs, add it once: `grep -q serverb.lab.example /etc/hosts || echo '192.168.122.11 serverb.lab.example serverb' | sudo tee -a /etc/hosts`.

??? warning "Reset servera before a re-run (destroys the mock's data and /dev/vdb)"
    Run on `servera` as `student` before starting, or before a second attempt. Safe on a fresh machine: every line ignores "not found" errors. The first line saves the swap UUID, because the swap line in `/etc/fstab` uses `UUID=` and would otherwise survive the wipe.
    ```bash
    U=$(sudo blkid -s UUID -o value /dev/vdb2 2>/dev/null); [ -n "$U" ] && sudo sed -i "/$U/d" /etc/fstab
    sudo umount /data /par1 /record /datasource /mnt/lvapp 2>/dev/null; sudo swapoff -a
    sudo vgremove -ff -y vgmock vgdata vgexam vgapp vgfs datacontainer 2>/dev/null
    sudo wipefs -a /dev/vdb[0-9]* 2>/dev/null; sudo wipefs -a /dev/vdb; sudo partprobe /dev/vdb
    sudo sed -i -E '\#[[:space:]]/(data|par1|record|datasource|mnt/lvapp)[[:space:]]#d; /\/dev\/vdb|vg(data|app|fs)-/d' /etc/fstab
    for s in $(awk '$1~/^(UUID|LABEL)=/{print $1}' /etc/fstab); do sudo blkid -t "$s" >/dev/null || sudo sed -i "\#^$s[[:space:]]#d" /etc/fstab; done
    sudo systemctl daemon-reload; sudo swapon -a
    sudo userdel -r analyst1 2>/dev/null
    sudo groupdel reporting 2>/dev/null
    sudo rm -rf /srv/reports /data /var/tmp/weekly.txt.* /var/tmp/bash-users.* /var/tmp/at-proof.txt /var/tmp/cron-proof.txt /tmp/index.html /usr/local/bin/userreport.sh
    crontab -r 2>/dev/null
    sudo dnf remove -y tree at httpd
    sudo rm -f /var/www/html/index.html
    sudo firewall-cmd --permanent --remove-service=http && sudo firewall-cmd --reload
    sudo rm -f /etc/systemd/journald.conf.d/persistent.conf
    sudo rm -rf /var/log/journal && sudo systemctl restart systemd-journald
    rm -f ~/.ssh/id_ed25519 ~/.ssh/id_ed25519.pub
    ```
    On `serverb` as `student`, also run `rm -f ~/.ssh/authorized_keys` so Task 10 starts clean.

## Tasks

Do the tasks in order. Later tasks depend on earlier ones: Task 3 needs the directory from Task 2, Task 6 is tested with the user from Task 1, Task 12 needs the logical volume from Task 11, Task 13 needs partition 1 from Task 11 (it adds partition 2 right after it), and Task 18 re-checks the results of Tasks 9, 10, 12, 13, 14, 15 and 17.

### Task 1: User, group and password aging (6 points)

Create the group `reporting` and the user `analyst1` (with a home directory). Make `analyst1` a member of `reporting` as a **secondary** group. Set password aging for `analyst1`: maximum age 60 days, minimum age 7 days, warning period 10 days.

- [ ] `id analyst1` lists `reporting`
- [ ] `chage -l analyst1` shows maximum 60, minimum 7, warning 10
- [ ] `/home/analyst1` exists

### Task 2: Shared directory (5 points)

Create the directory `/srv/reports` owned by user `root` and group `reporting`. Owner and group must have full access, others may read and enter but not write, and files created inside must automatically belong to group `reporting` (octal mode `2775`).

- [ ] Owner is `root`, group is `reporting`
- [ ] Mode is `drwxrwsr-x` (`2775`)

### Task 3: File and links (5 points)

Create `/srv/reports/weekly.txt` with exactly three lines: `line1`, `line2`, `line3`. Create a **hard link** `/var/tmp/weekly.txt.hard` and a **symbolic link** `/var/tmp/weekly.txt.soft` that both point to it.

- [ ] `weekly.txt` has three lines
- [ ] `/var/tmp/weekly.txt.hard` has the same inode as `weekly.txt` (link count 2)
- [ ] `/var/tmp/weekly.txt.soft` is a symlink to `/srv/reports/weekly.txt`

### Task 4: Search and redirect (4 points)

Save every line of `/etc/passwd` that ends in `bash` to `/var/tmp/bash-users.txt`. Save the **number** of those lines (just the number) to `/var/tmp/bash-users.count`.

- [ ] `/var/tmp/bash-users.txt` contains only lines ending in `bash`
- [ ] `/var/tmp/bash-users.count` contains only the matching-line count

### Task 5: Package (3 points)

Install the package that provides the `tree` command and show that it is installed.

- [ ] `rpm -q tree` reports a version
- [ ] `tree /srv/reports` runs

### Task 6: Script (6 points)

Create the executable script `/usr/local/bin/userreport.sh`. It takes one username as its first argument and prints `exists` if that user is known to the system, or `missing` if not.

- [ ] `userreport.sh analyst1` prints `exists`
- [ ] `userreport.sh nosuchuser9` prints `missing`
- [ ] The file starts with `#!/bin/bash` and is executable

### Task 7: One-time job (4 points)

Make sure the `at` command and its daemon are available (install and enable `atd` if needed). Schedule a one-time job to run 2 minutes from now that writes the output of `hostname` to `/var/tmp/at-proof.txt`.

- [ ] `atd` is active and enabled
- [ ] `atq` shows the pending job right after you schedule it
- [ ] After 2 minutes `/var/tmp/at-proof.txt` contains one line, the hostname

### Task 8: Recurring job (4 points)

As the user `student` (not root), schedule a cron job that appends the output of `date` to `/var/tmp/cron-proof.txt` every 5 minutes.

- [ ] `crontab -l` (as `student`) shows the `*/5` entry
- [ ] After the next 5-minute mark `/var/tmp/cron-proof.txt` has a date line

### Task 9: SSH service (3 points)

Make sure `sshd` is running now **and** starts at boot.

- [ ] `systemctl is-active sshd` prints `active`
- [ ] `systemctl is-enabled sshd` prints `enabled`

### Task 10: SSH key login (6 points)

As `student` on `servera`, create an ed25519 key pair with **no passphrase** and install the public key for `student` on `serverb.lab.example`, so that `student@servera` can log in to `student@serverb` without a password.

- [ ] `~/.ssh/id_ed25519` and `~/.ssh/id_ed25519.pub` exist
- [ ] `ssh -o BatchMode=yes student@serverb.lab.example hostname` prints `serverb.lab.example` with no prompt

### Task 11: Partition, volume group and logical volume (7 points)

On `/dev/vdb`, create a GPT label and **partition 1 of exactly 600 MiB** with the `lvm` flag. Use it as the only physical volume of the volume group `vgmock`. Create the logical volume `lvdata` of 512 MiB in `vgmock`. (Partition 2 is created in Task 13.)

- [ ] `/dev/vdb1` is 600 MiB, GPT, flag `lvm`
- [ ] VG `vgmock` exists on `/dev/vdb1`
- [ ] `/dev/vgmock/lvdata` is 512 MiB

### Task 12: Filesystem and persistent mount (7 points)

Create an XFS filesystem on `/dev/vgmock/lvdata`, mount it on `/data`, and make the mount persistent in `/etc/fstab` using the filesystem **UUID** (not the device name).

- [ ] `findmnt /data` shows type `xfs`
- [ ] The `/etc/fstab` line starts with `UUID=`
- [ ] `sudo mount -a` runs with no error

### Task 13: Swap (5 points)

On `/dev/vdb`, create **partition 2 of 512 MiB** (right after partition 1), format it as swap, activate it and make it persistent in `/etc/fstab` by **UUID**.

- [ ] `swapon --show` lists `/dev/vdb2` (about 512 MiB)
- [ ] The `/etc/fstab` swap line starts with `UUID=`

### Task 14: Hostname (3 points)

Set the static hostname of `servera` to `servera.lab.example`.

- [ ] `hostnamectl --static` prints `servera.lab.example`

### Task 15: Firewall (4 points)

Allow the `http` service through the firewall, both **now** and **permanently**.

- [ ] `firewall-cmd --list-services` includes `http`
- [ ] `firewall-cmd --permanent --list-services` includes `http`

### Task 16: SELinux (5 points)

Confirm SELinux is in `Enforcing` mode (set it, and make it persistent, if it is not). Install `httpd` so that `/var/www/html` exists. Write a file `/tmp/index.html` containing the single word `mock1` and **move** it (`mv`) to `/var/www/html/index.html`. Then restore the default SELinux labels on `/var/www/html` so that the file has the type `httpd_sys_content_t`.

- [ ] `getenforce` prints `Enforcing`
- [ ] `/var/www/html/index.html` exists and contains `mock1`
- [ ] `ls -Z /var/www/html/index.html` shows `httpd_sys_content_t`

### Task 17: Persistent journal (4 points)

Configure the system journal to be stored persistently on disk.

- [ ] `/var/log/journal` exists
- [ ] `Storage=persistent` is active in the journald configuration (`systemd-analyze cat-config systemd/journald.conf` shows it)

### Task 18: Reboot and re-verify (19 points)

Reboot `servera`, log in as `student`, and show that every persistent result still holds. Scoring: sshd enabled (2), `/data` mounted from the LV (4), swap on `/dev/vdb2` active (3), hostname correct (2), `http` in the permanent firewall config (3), journal directory present and holding a machine-id sub-directory (3), cron entry still listed (1), system reached the normal login without emergency mode (1).

- [ ] `systemctl is-enabled sshd` prints `enabled`
- [ ] `findmnt /data` shows the XFS mount
- [ ] `swapon --show` lists `/dev/vdb2`
- [ ] `hostnamectl --static` prints `servera.lab.example`
- [ ] `sudo firewall-cmd --list-services` includes `http`
- [ ] `ls /var/log/journal` lists a directory named like the machine-id
- [ ] `crontab -l` still shows the `*/5` entry
- [ ] The boot did not drop to emergency mode (the fstab lines are correct)

## What a grader checks

- requested users, groups, directories, links, scripts, and files must exist
- package installation must be verifiable
- service state must be correct now and at boot
- storage layout must match requested names and sizes
- mount and swap must return after reboot
- firewall rule must persist
- hostname must persist
- journal persistence must be configured
- SSH key login should work

## Submission method for self-study

Before checking the solution file, create your own proof log with commands such as:

```bash
id analyst1
ls -ld /srv/reports
ls -li /srv/reports/weekly.txt /var/tmp/weekly.txt.hard /var/tmp/weekly.txt.soft
rpm -q tree
systemctl is-enabled sshd
findmnt /data
swapon --show
hostnamectl
firewall-cmd --list-services
getenforce
ls -ld /var/log/journal
```

Then use the "Grade yourself" table in the solutions file to score each task.

## Continue in order

- Check your own proof commands first
- Open [19 Mock Exam 1 Solutions](19-mock-exam-1-solutions.md) only after you are fully done

**Previous:** [17 Final Week Plan](17-final-review-cheat-sheets.md) · **Next:** [19 Mock Exam 1 Solutions](19-mock-exam-1-solutions.md): grade yourself, then read the worked solutions.
