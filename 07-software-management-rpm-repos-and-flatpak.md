# 1. Title

Software Management, RPM Repositories, and Flatpak

# 2. Purpose

Teach you how to configure software sources, install and remove packages, and manage both RPM-based software and Flatpak packages.

# 3. Why this matters for RHCSA

Software management is a direct exam objective. You must know how to install packages from repositories, from local files, and how to verify what is installed.

# 4. Real-world use

Administrators install services, troubleshooting tools, and updates. They also need to know which repository a package came from and how to remove software cleanly.

# 5. Prerequisites

- Read `00-study-skills-and-offline-help.md`
- Read `01-shell-basics-and-command-syntax.md`

# 6. Objectives covered

- Configure access to RPM repositories
- Install and remove RPM software packages
- Configure access to Flatpak repositories
- Install and remove Flatpak software packages
- Install and update software packages from CDN, remote repositories, or local file system

# 7. Commands/tools used

`rpm`, `dnf`, `yum` if present as compatibility command, `subscription-manager`, `flatpak`, `cat`, `ls`

# 8. Offline help references for this topic

- `man dnf`
- `man rpm`
- `dnf --help`
- `man flatpak`
- `flatpak --help`
- `/etc/yum.repos.d/`

# 9. Estimated study time

5 hours

# 10. Common beginner mistakes

- Installing from an unverified source
- Confusing `rpm` with dependency-resolving package managers such as `dnf`
- Forgetting to enable a repository
- Assuming a package installed correctly without verifying it
- Mixing system packages and Flatpak packages in your thinking

## Concept Explanation In Simple Language

On RHEL-style systems, most software is installed as RPM packages. Repositories are organized software sources. `dnf` is the main high-level package manager. It can resolve dependencies automatically.

`rpm` works directly with package files, but does not resolve dependencies the way `dnf` does. That is why `dnf` is usually safer for installations.

Flatpak is different. It is a separate application distribution system, mostly used for desktop-style applications. It is in the EX200 objective list, so you should know the basic commands.

### Core vs Version-Specific

- Core: repository files, install, remove, query, verify installed packages
- Version-specific: exact CDN workflow and subscription state may vary by RHEL version and lab access

### Persistence After Reboot

Software management is a little different from service configuration:

- installed packages normally remain installed after reboot
- repository configuration files under `/etc/yum.repos.d/` remain after reboot unless changed
- Flatpak remotes and installed apps also persist unless removed

Still, on exam practice, verify after reboot when you change software sources or install a tool you will depend on later.

!!! warning "Exam Focus"
    Be comfortable reading and creating `.repo` files under `/etc/yum.repos.d/`.
    Even if `yum` exists as a compatibility command, think in `dnf` terms first.

## Command Breakdowns

### List repositories

```bash
sudo dnf repolist
sudo dnf repolist all
sudo yum repolist
```

### Install and remove packages

```bash
sudo dnf install httpd
sudo dnf remove httpd
sudo yum install httpd
```

### Install from local RPM file

```bash
sudo dnf install ./package.rpm
```

### Query installed packages

```bash
rpm -q bash
rpm -qa | head
dnf list installed
```

### Show package info

```bash
dnf info bash
rpm -qi bash
```

### Repository file example

Common repo file location:

```text
/etc/yum.repos.d/example.repo
```

Example content:

```ini
[baseos-local]
name=BaseOS Local Repo
baseurl=http://repo.example.com/baseos/
enabled=1
gpgcheck=0
```

After creating or editing a repo file:

```bash
sudo dnf repolist
sudo dnf repolist all
```

### Flatpak basics

```bash
flatpak remotes
flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
flatpak install flathub org.gnome.gedit
flatpak uninstall org.gnome.gedit
```

## Worked Examples

### Worked Example 1: Check Whether a Package Is Installed

```bash
rpm -q bash
dnf info bash
```

Verification:

- package query should succeed for installed packages

### Worked Example 2: Install a Package from a Repository

```bash
sudo dnf install -y tree
rpm -q tree
```

Verification:

- `rpm -q tree` should report the installed package name and version

### Worked Example 3: Add and View a Flatpak Remote

```bash
flatpak remotes
sudo flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
flatpak remotes
```

Verification:

- `flathub` should appear in the remote list

### Worked Example 4: Inspect a `.repo` File

```bash
ls /etc/yum.repos.d/
cat /etc/yum.repos.d/*.repo
```

Verification:

- identify `baseurl`, `enabled`, and `gpgcheck` settings in at least one repo file

## Guided Hands-On Lab

### Lab Goal

Inspect repositories, install and remove packages, and practice the basic Flatpak workflow.

### Setup

You need root privileges. Internet or a local repository source may be required for actual installation.

### Task Steps

1. List configured RPM repositories.
2. Inspect the files under `/etc/yum.repos.d/`.
3. Query whether `bash`, `tar`, and `vim` are installed.
4. Install a small package such as `tree` or `wget`.
5. Verify installation with both `rpm -q` and `command -v` if the package provides a command.
6. Remove the package.
7. Re-verify removal.
8. If a local RPM file is available, install it with `dnf install ./package.rpm`.
9. List Flatpak remotes.
10. If allowed in your lab, add a Flatpak remote and install then remove one small application.
11. If your lab provides a practice repository URL, create a `.repo` file for it and verify it appears in `dnf repolist`.

### Expected Result

You can inspect software sources, install and remove packages safely, and distinguish RPM package management from Flatpak management.

### Verification Commands

```bash
sudo dnf repolist
rpm -q bash
flatpak remotes
```

## Independent Practice Tasks

1. List all enabled repositories.
2. Find out which package owns a known file using `rpm -qf`.
3. Install a package from a repository.
4. Remove that package.
5. Query package information before installing.
6. Add a Flatpak remote if your lab supports it.
7. Install and uninstall one Flatpak package.
8. Compare `dnf repolist` and `dnf repolist all`.
9. Read one `.repo` file and explain what `baseurl`, `enabled`, and `gpgcheck` mean.

## Verification Steps

1. Verify the repository is enabled before installing.
2. Verify the package is installed with `rpm -q`.
3. Verify a removed package no longer appears in queries.
4. Verify Flatpak remotes and installed apps separately from RPM packages.
5. Reboot after major repository or software changes in lab practice and confirm the package and repo configuration still exist.
6. Verify new repo files are readable and actually recognized by `dnf`.

## Troubleshooting Section

### Problem: `No match for argument`

Cause:

- wrong package name or repository missing

Fix:

- search with `dnf search name`
- check `dnf repolist`

### Problem: dependency failure with `rpm`

Cause:

- direct `rpm` install does not resolve dependencies automatically

Fix:

- prefer `dnf install ./package.rpm`

### Problem: repository file exists but package still unavailable

Cause:

- repo disabled, metadata issue, or network/subscription problem

Fix:

- inspect the repo config and test with `dnf repolist all`

### Problem: Flatpak command not found

Cause:

- Flatpak package not installed on the system

Fix:

- install Flatpak through RPM package management if available in your lab

## Common Mistakes And Recovery

- Mistake: using `rpm -ivh` first for everything.
  Recovery: prefer `dnf install` unless the task explicitly requires raw `rpm`.

- Mistake: not verifying installed software.
  Recovery: query the package after installation.

- Mistake: removing the wrong package.
  Recovery: inspect package names carefully before deletion.

- Mistake: assuming Flatpak uses the same repo system as `dnf`.
  Recovery: treat Flatpak remotes as a separate system.

## Mini Quiz

1. What is the main difference between `dnf` and `rpm` for installation?
2. Where are normal RPM repository files commonly stored?
3. What command lists repositories?
4. How do you query whether a package is installed?
5. What command lists Flatpak remotes?
6. Why should you verify installation after running the install command?

## Exam-Style Tasks

### Task 1

Configure repository access available in your lab, then install a package that provides the `tree` command. Verify the package is installed and the command works.

### Grader Mindset Checklist

- repository access must be functional
- package must be installed
- `rpm -q` should succeed
- `tree` command should run

### Task 2

Add a Flatpak remote if your environment supports it, install one Flatpak application, verify it is installed, then remove it.

### Grader Mindset Checklist

- remote must be configured
- package must appear in Flatpak installed list
- uninstall should complete cleanly

## Answer Key / Solution Guide

### Quiz Answers

1. `dnf` resolves dependencies; `rpm` is a lower-level package tool.
2. `/etc/yum.repos.d/`
3. `dnf repolist`
4. `rpm -q package`
5. `flatpak remotes`
6. Because command success alone does not prove the package is installed correctly.

### Exam-Style Task 1 Example Solution

```bash
sudo dnf repolist
sudo dnf install -y tree
rpm -q tree
command -v tree
```

### Exam-Style Task 2 Example Solution

```bash
sudo flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
flatpak remotes
flatpak install -y flathub org.gnome.gedit
flatpak list
flatpak uninstall -y org.gnome.gedit
```

## Recap / Memory Anchors

- `dnf` is the main package manager
- `rpm` queries and works with package files
- repos feed `dnf`
- Flatpak is separate from RPM repos
- always verify package state after changes

## Quick Command Summary

```bash
dnf repolist
dnf repolist all
dnf search name
dnf install package
dnf remove package
dnf install ./package.rpm
rpm -q package
rpm -qa
rpm -qf /path/to/file
flatpak remotes
flatpak install remote appid
flatpak uninstall appid
```
