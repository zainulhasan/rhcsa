# RHCSA Labs Track and Skill Check Guide

> Give you a fast way to practice RHCSA tasks by objective area without rereading the full lessons first.

## At a Glance

**Why this matters for RHCSA**

RHCSA is a hands-on exam. You need a way to test whether you can actually perform tasks, not just recognize them on paper. A lab track lets you measure real skill under time pressure.

**Real-world use**

Junior administrators often inherit servers and must prove they can perform common tasks quickly. A lab checklist is a practical way to validate that skill before touching production systems.

**Estimated study time**

1.5 to 2 hours

## Prerequisites

- Basic access to a RHEL-compatible VM or physical system
- Root access or sudo access
- Willingness to practice by typing commands

## Objectives Covered

- Build a repeatable lab routine
- Use section-based labs to test current skill
- Choose the right lab path based on current knowledge
- Verify work instead of assuming it is correct
- Use a question-first workflow for revision

## Commands/Tools Used

`pwd`, `ls`, `hostnamectl`, `whoami`, `sudo`, `script`, `date`, `systemctl`, `reboot`, `man`

## Offline Help References For This Topic

- `man script`
- `man systemctl`
- `man reboot`
- `man hostnamectl`
- `help`

## Common Beginner Mistakes

- Jumping into hard labs without checking prerequisites
- Trying to memorize answers instead of solving tasks
- Not verifying persistence after reboot
- Skipping timing practice
- Looking at solutions too early

## Concept explanation in simple language

This labs track is for two kinds of learners:

- learners following the full course in order
- learners who already know some Linux and want to test themselves directly

If you are a total beginner, use the lesson track first and use these lab files after each section.

If you already know some Linux, start here, then move through the lab files in order. When a task feels hard or unclear, go back to the matching lesson file and study that topic in depth.

The labs track uses a question-first design:

1. read the task
2. plan the commands
3. do the work
4. verify
5. only then compare to the answer key

This matters because RHCSA rewards execution, not recognition.

The three main lab files now also include subtitle-derived question banks:

- `24-foundations-labs.md` adds extra ACL, SGID, sticky-bit, and text-processing drills
- `25-administration-core-labs.md` adds extra partition, swap, and shell-script drills
- `26-networking-users-and-security-labs.md` adds extra user, `nmcli`, hostname, and SELinux drills

Use this lab track like a pressure test:

- can you finish the task?
- can you verify it with commands?
- can you make it survive reboot?
- can you troubleshoot when it fails?

## Command breakdowns

### Record a practice session

```bash
script ~/rhcsa-practice-session.txt
```

- starts a terminal transcript
- useful when reviewing mistakes after practice

### Check where and who you are

```bash
pwd
whoami
hostnamectl
```

- `pwd` shows current directory
- `whoami` shows current user
- `hostnamectl` shows system identity and host details

### Reboot-safe verification mindset

```bash
systemctl is-enabled sshd
systemctl is-active sshd
```

- `is-active` proves service works now
- `is-enabled` proves it is configured for boot persistence

## Worked examples

### Worked Example 1: Choose the right practice path

Situation:

- You know basic shell commands but are weak on storage and SELinux.

Correct approach:

1. Skip directly to the lab files for storage and security.
2. Attempt the questions without notes.
3. If blocked, return to the matching lesson and study only that topic.

Verification:

- you should be able to name which file you need next instead of guessing

### Worked Example 2: Score a skill honestly

Use this simple scoring model:

- `2` = completed correctly without notes
- `1` = completed with help or retries
- `0` = could not complete

Verification:

- your notes should show a score beside each question or lab task

### Worked Example 3: Turn a failure into a study target

Situation:

- You could create an LVM volume but forgot how to make it mount after reboot.

Correct response:

1. mark persistence as weak
2. review `/etc/fstab`, `blkid`, and `mount -a`
3. repeat the storage lab after a reboot

Verification:

- you can explain both the temporary mount and the persistent mount workflow

## Guided hands-on lab

### Lab goal

Set up your lab method so you can use the rest of the new lab track efficiently.

### Setup

Use a practice VM where rebooting and making changes is safe.

### Task steps

1. Create a directory named `~/rhcsa-lab-notes`.
2. Start a transcript with `script`.
3. Create a plain-text file named `~/rhcsa-lab-notes/scoreboard.txt`.
4. Add headings for:
   - foundations
   - software and scripting
   - systems and storage
   - networking, users, and security
5. Write today’s date in the file.
6. Add a simple scoring key: `2 = strong`, `1 = partial`, `0 = review`.
7. Reboot the VM once and confirm you can log back in and continue.

### Expected result

- you have a repeatable lab folder
- you have a place to score weak and strong topics
- you are comfortable rebooting the lab

### Verification commands

```bash
ls -ld ~/rhcsa-lab-notes
cat ~/rhcsa-lab-notes/scoreboard.txt
whoami
hostnamectl
```

### Cleanup

Keep the notes directory. It is part of your training setup.

## Independent practice tasks

1. Create a second score file named `~/rhcsa-lab-notes/mistakes.txt`.
2. Write a three-line rule set for how you will verify work after every lab.
3. Add one line explaining when you should reboot during practice.
4. Add one line explaining when you should use `man` instead of guessing.
5. Time yourself for five minutes and list all RHCSA topics you can remember without opening notes.

## Verification steps

1. Confirm `~/rhcsa-lab-notes` exists.
2. Confirm your scoreboard file contains at least four topic headings.
3. Confirm you can explain the difference between “works now” and “works after reboot.”

## Troubleshooting section

### Problem: wrong path

Symptom:

- `cat ~/rhcsa-lab-notes/scoreboard.txt` fails

Fix:

- run `ls -l ~/rhcsa-lab-notes`
- create the file again if needed

### Problem: permission denied

Symptom:

- cannot write to a file in a protected directory

Fix:

- work in your home directory unless root is required
- use `sudo` only when needed

### Problem: command not found

Symptom:

- terminal says `script: command not found`

Fix:

- use `command -v script`
- check local package availability with `rpm -q util-linux`

### Problem: bad syntax

Symptom:

- command runs but file path or option is wrong

Fix:

- re-read `man` or `--help`
- type the command again slowly

### Problem: config changed but not persistent

Symptom:

- something worked before reboot but not after

Fix:

- identify whether the task needed `/etc/fstab`, `systemctl enable`, persistent firewall rules, or SELinux persistence

## Common mistakes and recovery

- Mistake: using the labs like reading material only.
  Recovery: treat every lab as a typing exercise.
- Mistake: checking the answer key too fast.
  Recovery: struggle for a few minutes, then use offline help.
- Mistake: not keeping a weak-topic list.
  Recovery: score every lab honestly.

## Mini quiz

1. Why is a question-first lab useful for RHCSA?
2. What does `systemctl is-enabled` prove?
3. What should you do if you fail a storage lab because of persistence?
4. Why should you keep a mistakes file?
5. When should you look at the solution section?

## Exam-style tasks

### Exam-Style Task 1

Create a personal RHCSA practice workflow in your home directory that includes a score file, a mistakes file, and a simple record of today’s practice date.

Grader mindset checklist:

- a notes directory must exist
- a score file must exist
- a mistakes file must exist
- the files should contain useful text, not be empty
- your workflow should still be usable after reboot

### Exam-Style Task 2

Create a short self-grading checklist in plain text that answers:

- how to test current state
- how to test persistence
- how to identify weak topics

Grader mindset checklist:

- a checklist file must exist
- it must contain at least three practical checks
- it must be readable with `cat`
- it must be useful without internet

## Answer key / solution guide

### Mini quiz answers

1. Because RHCSA tests execution, not recognition.
2. It proves a service is configured to start at boot.
3. Review persistence commands, then repeat the lab after reboot.
4. So you can turn repeated failures into a study plan.
5. Only after attempting the task honestly.

### Exam-Style Task 1 example solution

```bash
mkdir -p ~/rhcsa-lab-notes
date > ~/rhcsa-lab-notes/scoreboard.txt
printf "foundations\nsoftware-and-scripting\nsystems-and-storage\nnetworking-users-security\n" >> ~/rhcsa-lab-notes/scoreboard.txt
printf "mistakes log\n" > ~/rhcsa-lab-notes/mistakes.txt
```

### Exam-Style Task 2 example solution

```bash
cat > ~/rhcsa-lab-notes/self-checklist.txt <<'EOF'
1. Verify current state with commands such as systemctl is-active, id, rpm -q, findmnt, ss -tuln.
2. Verify persistence with commands such as systemctl is-enabled, grep in /etc/fstab, firewall-cmd --list-all, cat /etc/selinux/config.
3. Mark weak topics with 0, partial topics with 1, and strong topics with 2.
EOF
cat ~/rhcsa-lab-notes/self-checklist.txt
```

## Recap / memory anchors

- labs are for proving skill, not reading theory
- verify current state and persistence separately
- score weak topics honestly
- reboot is part of RHCSA practice

## Quick command summary

```bash
mkdir -p ~/rhcsa-lab-notes
script ~/rhcsa-practice-session.txt
date
whoami
hostnamectl
systemctl is-active sshd
systemctl is-enabled sshd
cat ~/rhcsa-lab-notes/scoreboard.txt
```
