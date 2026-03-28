# Optional Topic Reinforcement Map

This page is intentionally short.

It is not a second course, and it is not a list of random playlists. Its job is to help you reinforce one weak topic without drifting away from the real RHCSA scope.

## Source Of Truth

Use Red Hat's public [EX200 exam page](https://www.redhat.com/en/services/training/ex200-red-hat-certified-system-administrator-rhcsa-exam) as the final scope check. I reviewed this page on March 28, 2026, and the public exam page states that `EX200` is based on `RHEL 10`.

Use external material in this order:

1. the official EX200 objectives
2. this repository's lesson and lab files
3. official `RHEL 10` documentation at [docs.redhat.com](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10)
4. optional videos only for one specific weak topic

## When To Use This Page

Use this page only when all of the following are true:

- you already completed the main lesson path or labs path
- you know exactly which topic is weak
- you want a second explanation, not a replacement for practice

If you are still early in the course, go back to the lesson files instead.

## Quality Filter For External Resources

Reject a resource immediately if it does any of these:

- teaches from dumps, leaked tasks, or memorized answer patterns
- spends most of its time on topics not listed on the official EX200 page
- uses a different release but never explains what changed
- shows commands without verification
- fixes errors by guessing instead of checking logs, service state, firewall, SELinux, or persistence

Prefer resources that do these things:

- stay close to the published objectives
- show commands and explain why they work
- verify results with real checks
- mention version differences clearly
- keep the focus on hands-on execution

## Topic Map

Use this table to pick the shortest path back to the right material.

| Weak area | Read in this course | Practice here | Best official follow-up |
|---|---|---|---|
| Shell basics, help, and command syntax | `00`, `01`, `03` | `24-foundations-labs.md` | EX200 objectives plus `RHEL 10` docs search |
| Files, links, permissions, and text work | `02`, `03`, `06` | `24-foundations-labs.md` | `RHEL 10` docs plus local `man` pages |
| Archives, SSH, and file transfer | `04`, `05` | `24-foundations-labs.md` | EX200 objectives plus `ssh`, `scp`, and `tar` manuals |
| Software and shell scripting | `07`, `08` | `25-administration-core-labs.md` | `RHEL 10` docs plus package-management docs |
| Boot, processes, logs, and tuning | `09`, `12`, `16` | `25-administration-core-labs.md` | `RHEL 10` docs plus `systemd` and `journalctl` docs |
| Storage, filesystems, NFS, and autofs | `10`, `11` | `25-administration-core-labs.md` | `RHEL 10` storage docs |
| Networking, users, sudo, firewalld, and SELinux | `13`, `14`, `15` | `26-networking-users-and-security-labs.md` | `RHEL 10` networking and security docs |
| Mixed pressure practice | `17`, `17a` | `28-rhcsa-10-mixed-practice-bank.md` | official objectives only, then return to labs |

## Safe Search Pattern

If you still want a video, search for one narrow topic at a time. Use the exact skill you missed, not a full-course search.

Good examples:

- `RHCSA EX200 RHEL 10 nmcli static IP`
- `RHCSA EX200 RHEL 10 autofs NFS`
- `RHCSA EX200 RHEL 10 SELinux port label`
- `RHCSA EX200 RHEL 10 LVM extents`

Bad examples:

- `latest RHCSA dumps`
- `RHCSA shortcut answers`
- `RHCSA full course` when you only missed one topic

## Keep The Main Course In Front

When you use outside material, return to this repository immediately afterward:

1. reread the matching lesson section
2. redo the matching lab without notes
3. verify the result with commands
4. reboot if the task should persist

If the outside resource made the topic feel broader or more confusing, ignore the extra material and return to the official EX200 scope.
