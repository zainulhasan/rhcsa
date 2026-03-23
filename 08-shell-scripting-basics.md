# Shell Scripting Basics

> Teach you how to write small Bash scripts that accept input, make decisions, loop over data, and use command output.

## At a Glance

**Why this matters for RHCSA**

Simple shell scripting is an explicit exam objective. You do not need to become a software developer, but you do need to write small working scripts under pressure.

**Real-world use**

Admins automate repetitive checks, generate reports, process files, and reduce typing errors through small scripts.

**Estimated study time**

6 hours

## Prerequisites

- Read `01-shell-basics-and-command-syntax.md`
- Read `02-files-directories-and-text-editing.md`
- Read `03-redirection-pipes-grep-and-regex.md`

## Objectives Covered

- Conditionally execute code (`if`, `test`, `[ ]`)
- Use looping constructs (`for`, and simple iteration)
- Process script inputs (`$1`, `$2`, and related variables)
- Process output of shell commands within a script
- Use here-strings and simple calculation tools when helpful in scripts

## Commands/Tools Used

`bash`, `echo`, `test`, `[ ]`, `for`, `if`, `read`, `grep`, `id`, `date`, `chmod`, `awk`, `bc`

## Offline Help References For This Topic

- `help if`
- `help test`
- `help [`
- `help for`
- `man bash`
- `man bc`

## Common Beginner Mistakes

- Forgetting spaces inside `[ ]`
- Forgetting to make the script executable
- Mixing shell syntax with plain English
- Not quoting variables when appropriate
- Writing a script without testing one small piece at a time

## Concept Explanation In Simple Language

A shell script is a text file containing commands that the shell can execute in order.

### Basic Script Structure

```bash
#!/bin/bash
echo "Hello"
```

The first line is called a shebang. It tells the system which interpreter should run the script.

### Script Inputs

- `$0` script name
- `$1` first argument
- `$2` second argument
- `$#` number of arguments

### Conditionals

Use `if` when a command or test decides what happens next.

### Loops

Use `for` when you want to repeat an action for many items.

### Command Substitution

Use `$(command)` when you want a command's output as data.

Example:

```bash
today=$(date +%F)
echo "$today"
```

### Here-Strings

A here-string sends one short piece of text into a command as input.

Example:

```bash
grep root <<< "root:x:0:0:root:/root:/bin/bash"
```

This is useful when you want to test a command quickly without creating a file first.

### Simple Calculations With `bc`

`bc` is a command-line calculator. It is useful when shell arithmetic is not enough or when you want clear calculator-style input.

Example:

```bash
echo '2 + 3' | bc
```

Or with a here-string:

```bash
bc <<< '2 + 3'
```

!!! info "Exam Focus"
    `<<<`, `bc`, `awk`, and small command substitutions are not advanced programming.
    They are fast admin tools for small text and math tasks.

## Command Breakdowns

### Small script example

```bash
#!/bin/bash
echo "Script name: $0"
echo "First argument: $1"
```

### Test whether a file exists

```bash
if [ -f /etc/hosts ]; then
    echo "File exists"
fi
```

### Loop over words

```bash
for name in alice bob carol
do
    echo "$name"
done
```

### Use command output in a variable

```bash
host=$(hostname)
echo "$host"
```

### Here-string example

```bash
grep alice <<< "alice:x:1000:1000:Alice:/home/alice:/bin/bash"
```

### Simple `bc` example

```bash
bc <<< '10 + 25'
```

## Worked Examples

### Worked Example 1: Script That Prints Arguments

Script:

```bash
#!/bin/bash
echo "arg1=$1"
echo "arg2=$2"
```

Verification:

- run the script with two values and confirm the output matches

### Worked Example 2: Script That Checks For a User

Script:

```bash
#!/bin/bash
if id "$1" >/dev/null 2>&1; then
    echo "user exists"
else
    echo "user missing"
fi
```

Verification:

- test with an existing user and a fake user

### Worked Example 3: Script That Loops Through Files

Script:

```bash
#!/bin/bash
for file in "$@"
do
    echo "checking $file"
    if [ -f "$file" ]; then
        echo "regular file"
    else
        echo "not a regular file"
    fi
done
```

Verification:

- run it with a mix of real and fake file names

### Worked Example 4: Use `bc` and a Here-String

Script:

```bash
#!/bin/bash
echo "sum=$(bc <<< '4 + 6')"
grep root <<< "root:x:0:0:root:/root:/bin/bash"
```

Verification:

- confirm the output shows `sum=10`
- confirm `grep` matches `root`

## Guided Hands-On Lab

### Lab Goal

Write and test small Bash scripts that take input and make decisions.

### Setup

```bash
cd
mkdir -p rhcsa-script-lab
cd rhcsa-script-lab
```

### Task Steps

1. Create `showargs.sh` that prints `$1`, `$2`, and `$#`.
2. Make it executable.
3. Run it with two arguments.
4. Create `usercheck.sh` that reports whether a user exists.
5. Test it with `root` and a fake username.
6. Create `loopfiles.sh` that loops over all arguments and reports whether each is a regular file.
7. Use command substitution in a script to save the current date to a variable and print it.
8. Add clear messages so you can read output quickly.
9. Use `bc` in a script to calculate a small sum.
10. Use a here-string with `grep` or `awk` in a script.

### Expected Result

You can create, execute, and test simple Bash scripts that use input arguments, conditions, loops, and command output.

### Verification Commands

```bash
ls -l *.sh
./showargs.sh one two
./usercheck.sh root
./loopfiles.sh /etc/hosts /nope
```

## Independent Practice Tasks

1. Write a script that prints the current hostname.
2. Write a script that checks whether one file path exists.
3. Write a script that loops through three names and prints them.
4. Write a script that prints "missing argument" if no first argument is given.
5. Write a script that uses `grep` output inside the script.
6. Write a script that creates a dated report file name using `$(date ...)`.
7. Write a script that uses `bc` to add two numbers.
8. Write a script that uses `grep <<< "text"` to test a pattern without a file.

## Verification Steps

1. Confirm the script has a shebang.
2. Confirm it is executable or run it with `bash scriptname`.
3. Confirm the script behaves differently for true and false conditions where expected.
4. Confirm script inputs map correctly to `$1`, `$2`, and `$#`.
5. Confirm you can explain what a here-string `<<<` sends into a command.

## Troubleshooting Section

### Problem: `Permission denied` when running the script

Cause:

- script is not executable

Fix:

```bash
chmod +x script.sh
```

### Problem: `[: missing ]`

Cause:

- spacing inside test brackets is wrong

Fix:

```bash
[ -f /etc/hosts ]
```

There must be spaces after `[` and before `]`.

### Problem: Variable appears empty

Cause:

- no argument was passed or the variable name is wrong

Fix:

- echo the variable and verify the inputs

### Problem: Script works for one file but fails for names with spaces

Cause:

- variables are not quoted

Fix:

- quote variables when appropriate, such as `"$1"`

## Common Mistakes And Recovery

- Mistake: writing a large script before testing pieces.
  Recovery: test each command in the shell first.

- Mistake: forgetting the `then` or `fi` in an `if` block.
  Recovery: read the structure line by line.

- Mistake: assuming script input always exists.
  Recovery: check `$#` or test whether `$1` is empty.

- Mistake: not redirecting command output in tests.
  Recovery: use `>/dev/null 2>&1` when you only care about success or failure.

## Mini Quiz

1. What does `$1` mean in a shell script?
2. What does `$#` mean?
3. Why is `#!/bin/bash` useful?
4. What keyword starts a conditional block?
5. What loop is commonly used to process a list of items?
6. What does `$(date)` do?
7. What does `<<<` do?
8. What command can calculate `2 + 3` from standard input?

## Exam-Style Tasks

### Task 1

Create `/usr/local/bin/userexists.sh` that accepts one username as an argument and prints either `exists` or `missing`.

### Grader Mindset Checklist

- script path must exist
- script must be executable
- script must use the first argument
- script should return correct output for real and fake users

### Task 2

Create `/usr/local/bin/filecheck.sh` that accepts one or more file paths as arguments and prints whether each is a regular file.

### Grader Mindset Checklist

- script must accept multiple inputs
- loop logic must work
- output should match the actual file state

## Answer Key / Solution Guide

### Quiz Answers

1. The first argument.
2. The number of arguments.
3. It tells the system to run the script with Bash.
4. `if`
5. `for`
6. It runs `date` and substitutes its output.
7. It sends a short string into a command as input.
8. `bc`

### Exam-Style Task 1 Example Solution

```bash
#!/bin/bash
if id "$1" >/dev/null 2>&1; then
    echo exists
else
    echo missing
fi
```

### Exam-Style Task 2 Example Solution

```bash
#!/bin/bash
for file in "$@"
do
    if [ -f "$file" ]; then
        echo "$file regular"
    else
        echo "$file not-regular"
    fi
done
```

## Recap / Memory Anchors

- scripts are just text files with commands
- shebang first
- arguments use `$1`, `$2`
- conditionals use `if`
- loops use `for`
- `$(command)` captures output
- test small pieces first

## Quick Command Summary

```bash
chmod +x script.sh
./script.sh arg1 arg2
bash script.sh arg1 arg2
if [ -f file ]; then echo ok; fi
for item in a b c; do echo "$item"; done
name=$(hostname)
echo "$name"
```