### **Lesson 0.75: Git and GitHub - Version Control and Collaboration**

## **1. What is Version Control?**

Version control is a system that records changes to files over time so that you can recall specific versions later. It allows multiple people to collaborate on projects without conflicts and provides a complete history of project evolution.

### **Why Version Control Matters:**

- **Track Changes:** See what changed, when, and by whom
- **Revert Mistakes:** Go back to previous working versions
- **Collaboration:** Multiple developers can work on the same project
- **Backup:** Your code is safely stored and can be recovered
- **Branching:** Work on features without affecting main code
- **Merging:** Combine different lines of development
- **Accountability:** Know who made what changes and why
- **Experimentation:** Try new ideas without fear of breaking main code
- **Code Review:** Review changes before they are merged
- **Release Management:** Tag and version releases

### **Types of Version Control:**

#### **Local Version Control:**
- Changes stored only on your computer
- Simple but limited collaboration
- Examples: RCS, SCCS
- Good for personal projects

#### **Centralized Version Control:**
- Single central repository (server)
- All changes go through central server
- Examples: SVN, CVS, Perforce
- Better for team collaboration but single point of failure

#### **Distributed Version Control:**
- Every developer has full copy of repository
- No single point of failure
- Can work offline
- Examples: Git, Mercurial, Bazaar
- Most popular for modern development

## **2. Introduction to Git**

Git is a distributed version control system created by Linus Torvalds in 2005 for Linux kernel development. It's the most popular VCS and forms the foundation of modern software development.

### **Git Architecture:**

```
Working Directory ── git add ──→ Staging Area ── git commit ──→ Local Repository
        ↑                           ↑                     │
        └──────── git checkout ─────┘                     │
                                                         ▼
                                                Remote Repository (GitHub)
```

### **Git States:**
- **Working Directory:** Files you're currently working on (untracked/modified)
- **Staging Area (Index):** Files ready to be committed (staged changes)
- **Local Repository:** Permanent storage of committed changes (.git folder)
- **Remote Repository:** Shared repository on GitHub/GitLab/etc.

### **Git Objects:**
- **Blob:** File content (stores actual file data)
- **Tree:** Directory structure (points to blobs and other trees)
- **Commit:** Snapshot of repository at a point in time
- **Tag:** Named reference to a specific commit

### **Git Internals:**
```bash
# View Git objects
find .git/objects -type f

# View commit object content
git cat-file -p HEAD

# View tree object
git cat-file -p HEAD^{tree}

# View blob content
git cat-file -p <blob-hash>
```

### **HEAD and References:**
- **HEAD:** Points to current branch/commit
- **Branches:** Pointers to commits
- **Tags:** Named references to specific commits
- **Refs:** All references stored in .git/refs/

## **3. Git Installation and Setup**

### **Installing Git:**

#### **Windows:**
```bash
# Download from git-scm.com
# Or using Chocolatey
choco install git

# Or using winget
winget install --id Git.Git -e --source winget
```

#### **macOS:**
```bash
# Using Homebrew
brew install git

# Or Xcode Command Line Tools
xcode-select --install

# Or download from git-scm.com
```

#### **Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install git

# For latest version
sudo add-apt-repository ppa:git-core/ppa
sudo apt update
sudo apt install git
```

#### **Linux (CentOS/RHEL/Fedora):**
```bash
# CentOS/RHEL
sudo yum install git

# Fedora
sudo dnf install git
```

### **Git Configuration:**

#### **Basic Configuration:**
```bash
# Set your identity
git config --global user.name "Your Full Name"
git config --global user.email "your.email@example.com"

# Check configuration
git config --list
git config --global --list

# Set default editor
git config --global core.editor "code --wait"  # VS Code
git config --global core.editor "vim"          # Vim
git config --global core.editor "nano"         # Nano
git config --global core.editor "emacs"        # Emacs

# Set default branch name
git config --global init.defaultBranch main

# Enable colored output
git config --global color.ui auto

# Set line ending preferences
git config --global core.autocrlf input  # Linux/macOS
git config --global core.autocrlf true   # Windows
```

#### **Advanced Configuration:**
```bash
# Set up aliases for common commands
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual '!gitk'

# Configure diff and merge tools
git config --global diff.tool vscode
git config --global merge.tool vscode
git config --global difftool.vscode.cmd 'code --wait --diff $LOCAL $REMOTE'
git config --global mergetool.vscode.cmd 'code --wait $MERGED'

# Set up credential helper
git config --global credential.helper store  # Store credentials
git config --global credential.helper cache  # Cache for 15 minutes
git config --global credential.helper 'cache --timeout=3600'  # Cache for 1 hour
```

### **SSH Key Setup (for GitHub):**

#### **Generate SSH Key:**
```bash
# Generate Ed25519 key (recommended)
ssh-keygen -t ed25519 -C "your.email@example.com" -f ~/.ssh/id_ed25519 -N ""

# Or RSA key (legacy)
ssh-keygen -t rsa -b 4096 -C "your.email@example.com" -f ~/.ssh/id_rsa -N ""
```

#### **SSH Agent Management:**
```bash
# Start SSH agent
eval "$(ssh-agent -s)"

# Add SSH key to agent
ssh-add ~/.ssh/id_ed25519

# List loaded keys
ssh-add -l

# Copy public key to clipboard
# Linux
xclip -sel clip < ~/.ssh/id_ed25519.pub

# macOS
pbcopy < ~/.ssh/id_ed25519.pub

# Windows (Git Bash)
cat ~/.ssh/id_ed25519.pub | clip
```

#### **SSH Config for Multiple Accounts:**
```bash
# ~/.ssh/config
# GitHub Personal
Host github-personal
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_personal

# GitHub Work
Host github-work
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_work
```

#### **Test SSH Connection:**
```bash
# Test connection
ssh -T git@github.com

# Test with specific key
ssh -T -i ~/.ssh/id_ed25519 git@github.com
```

### **GPG Commit Signing:**
```bash
# Generate GPG key
gpg --full-generate-key

# List GPG keys
gpg --list-secret-keys --keyid-format LONG

# Configure Git to use GPG
git config --global user.signingkey <GPG_KEY_ID>
git config --global commit.gpgsign true

# Export public key
gpg --armor --export <GPG_KEY_ID>

# Add to GitHub: Settings → SSH and GPG keys → New GPG key
```

## **4. Advanced Git Commands**

### **Repository Setup and Management:**

#### **Repository Initialization:**
```bash
# Initialize a new repository
git init

# Initialize with specific branch name
git init --initial-branch=main

# Clone an existing repository
git clone https://github.com/username/repo.git
git clone https://github.com/username/repo.git my-project  # Custom directory name

# Clone with SSH
git clone git@github.com:username/repo.git

# Clone specific branch
git clone -b feature-branch https://github.com/username/repo.git

# Clone with depth (shallow clone)
git clone --depth 1 https://github.com/username/repo.git  # Only latest commit
```

#### **Repository Information:**
```bash
# Repository status
git status
git status --porcelain  # Machine-readable format
git status --ignored    # Show ignored files

# Repository information
git remote -v           # List remotes
git branch -a           # List all branches
git tag                 # List tags
git log --oneline -10   # Last 10 commits

# Repository size
git count-objects -v
du -sh .git            # Physical size
```

### **Working with Files:**

#### **Advanced Add Commands:**
```bash
# Interactive staging
git add -i              # Interactive mode
git add -p              # Patch mode (stage hunks)

# Add with patterns
git add "*.js"          # Add all JavaScript files
git add "src/"          # Add entire directory
git add -A              # Add all changes (new, modified, deleted)
git add .               # Add all changes in current directory
git add -u              # Add only modified and deleted files

# Add files matching pattern
git add --all "*.html"
git add --all "*.css"
```

#### **Unstaging Files:**
```bash
# Unstage specific file
git reset HEAD filename.txt

# Unstage all files
git reset HEAD

# Unstage and discard changes
git checkout -- filename.txt
git checkout .           # Discard all changes

# Create new commit to undo last commit
git revert HEAD
```

### **Advanced Commit Operations:**

#### **Commit History:**
```bash
# Detailed log
git log --oneline --graph --decorate
git log --stat          # Show changed files
git log --patch         # Show actual changes
git log --author="John" # Filter by author
git log --since="2 weeks ago"
git log --grep="fix"    # Search commit messages

# Blame (who changed what)
git blame filename.txt
git blame -L 10,20 filename.txt  # Specific lines

# Show specific commit
git show HEAD
git show HEAD~2         # Two commits ago
git show abc123         # Specific commit hash
```

#### **Amending Commits:**
```bash
# Amend last commit message
git commit --amend -m "New commit message"

# Amend last commit with new changes
git add new-file.txt
git commit --amend --no-edit  # Keep same message

# Amend author information
git commit --amend --author="New Author <new@email.com>"
```

### **Branching and Merging Strategies:**

#### **Branch Management:**
```bash
# Create and switch to new branch
git checkout -b feature/login
git switch -c feature/login  # Newer syntax

# Switch branches
git checkout main
git switch main

# List branches
git branch                  # Local branches
git branch -r              # Remote branches
git branch -a              # All branches
git branch --merged        # Branches merged into current
git branch --no-merged     # Branches not merged

# Rename branch
git branch -m old-name new-name

# Delete branch
git branch -d feature/completed  # Safe delete
git branch -D feature/abandoned  # Force delete
```

#### **Merging Strategies:**
```bash
# Fast-forward merge
git checkout main
git merge feature/branch

# Three-way merge (creates merge commit)
git merge --no-ff feature/branch

# Squash merge (combine into single commit)
git merge --squash feature/branch
git commit -m "Add feature"

# Rebase (linear history)
git checkout feature/branch
git rebase main

# Interactive rebase
git rebase -i HEAD~3  # Last 3 commits
```

#### **Merge Conflict Resolution:**
```bash
# Check for conflicts
git status

# View conflicted files
git diff

# Resolve conflicts manually, then:
git add resolved-file.txt
git commit -m "Resolve merge conflicts"

# Abort merge
git merge --abort

# Continue rebase after resolving
git rebase --continue
```

### **Working with Remote Repositories:**

#### **Remote Management:**
```bash
# Add remote
git remote add origin https://github.com/username/repo.git
git remote add upstream https://github.com/original/repo.git

# View remotes
git remote -v
git remote show origin

# Change remote URL
git remote set-url origin https://github.com/newusername/repo.git

# Remove remote
git remote remove origin

# Rename remote
git remote rename origin upstream
```

#### **Pushing and Pulling:**
```bash
# Push to remote
git push origin main
git push -u origin main  # Set upstream branch

# Push all branches
git push --all origin

# Push tags
git push --tags

# Force push (dangerous!)
git push --force-with-lease origin main

# Pull from remote
git pull origin main
git pull --rebase origin main  # Rebase instead of merge

# Fetch without merging
git fetch origin
git fetch --all  # Fetch from all remotes
```

#### **Tracking Branches:**
```bash
# Set upstream branch
git branch --set-upstream-to=origin/main main

# View tracking branches
git branch -vv

# Unset upstream
git branch --unset-upstream
```

## **5. Git Workflow**

### **Daily Git Workflow:**

```bash
# 1. Check status
git status

# 2. Add changes
git add .

# 3. Commit changes
git commit -m "Implement user login functionality"

# 4. Pull latest changes
git pull origin main

# 5. Push your changes
git push origin main
```

### **Feature Branch Workflow:**

```bash
# 1. Create feature branch
git checkout -b feature/user-profile

# 2. Make changes and commits
git add .
git commit -m "Add user profile component"

# 3. Push feature branch
git push origin feature/user-profile

# 4. Create Pull Request on GitHub

# 5. After PR is merged, update main branch
git checkout main
git pull origin main

# 6. Delete feature branch
git branch -d feature/user-profile
```

## **6. GitHub - Social Coding Platform**

### **What is GitHub?**
GitHub is a web-based platform for version control using Git. It provides hosting for software development and version control using Git.

### **GitHub Features:**
- **Repositories:** Storage for your code
- **Issues:** Track bugs and features
- **Pull Requests:** Propose changes to code
- **Actions:** Automate workflows
- **Pages:** Host static websites
- **Discussions:** Community conversations

### **Creating a Repository:**

1. Go to [github.com](https://github.com)
2. Click "New repository"
3. Enter repository name
4. Choose public or private
5. Initialize with README (optional)
6. Create repository

### **README.md File:**

```markdown
# Project Name

A brief description of your project.

## Features

- Feature 1
- Feature 2
- Feature 3

## Installation

```bash
npm install
```

## Usage

```bash
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
```

## **7. Collaboration with GitHub**

### **Fork and Pull Request Workflow:**

```bash
# 1. Fork repository on GitHub
# Click "Fork" button on the repository page

# 2. Clone your fork
git clone https://github.com/yourusername/repo.git

# 3. Create feature branch
git checkout -b feature/improvement

# 4. Make changes and commit
git add .
git commit -m "Improve user interface"

# 5. Push to your fork
git push origin feature/improvement

# 6. Create Pull Request on GitHub
# Go to original repository → Pull Requests → New Pull Request
```

### **Handling Merge Conflicts:**

```bash
# When you have conflicts during merge
git status  # See conflicted files

# Edit conflicted files manually
# Look for conflict markers: <<<<<<<, =======, >>>>>>>

# After resolving conflicts
git add resolved-file.js
git commit -m "Resolve merge conflicts"

# Continue with merge or rebase
```

### **Code Reviews:**

```bash
# Fetch latest changes
git fetch origin

# Checkout the branch to review
git checkout feature/review-branch

# Review code, then approve or request changes
# Once approved, merge the PR
```

## **8. Advanced Git Concepts**

### **Rebasing:**

```bash
# Interactive rebase to clean up commits
git rebase -i HEAD~3  # Last 3 commits

# Rebase feature branch on main
git checkout feature/branch
git rebase main

# Force push after rebase (be careful!)
git push origin feature/branch --force-with-lease
```

### **Stashing:**

```bash
# Save current work temporarily
git stash

# List stashes
git stash list

# Apply latest stash
git stash apply

# Apply specific stash
git stash apply stash@{1}

# Create named stash
git stash save "Work in progress on login"

# Delete stash
git stash drop stash@{0}
```

### **Git Reset vs Revert:**

```bash
# Soft reset (keeps changes in working directory)
git reset --soft HEAD~1

# Mixed reset (default, unstages changes)
git reset HEAD~1

# Hard reset (deletes changes permanently)
git reset --hard HEAD~1

# Revert (creates new commit that undoes changes)
git revert HEAD
```

### **Git Bisect (Finding Bugs):**

```bash
# Start bisect
git bisect start

# Mark current commit as bad
git bisect bad

# Mark known good commit
git bisect good v1.0

# Git will checkout a commit for testing
# Mark as good or bad
git bisect good  # or git bisect bad

# Continue until bug is found
# End bisect
git bisect reset
```

## **9. Git Best Practices**

### **Commit Messages:**
```bash
# Good commit messages
git commit -m "Add user authentication with JWT"

# Bad commit messages
git commit -m "fix"
git commit -m "update"
```

### **Branch Naming:**
```bash
# Feature branches
git checkout -b feature/user-login
git checkout -b feature/payment-integration

# Bug fixes
git checkout -b bugfix/login-validation
git checkout -b hotfix/security-patch

# Releases
git checkout -b release/v1.2.0
```

### **Repository Organization:**
```
project/
├── .gitignore
├── README.md
├── src/
├── tests/
├── docs/
└── scripts/
```

### **.gitignore File:**

```gitignore
# Dependencies
node_modules/
package-lock.json

# Environment variables
.env
.env.local

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed

# Coverage directory used by tools like istanbul
coverage/

# IDE files
.vscode/
.idea/

# OS generated files
.DS_Store
Thumbs.db

# Build outputs
dist/
build/
```

## **10. Code Examples**

### **Example 1: Complete Git Workflow**

```bash
# Initialize project
mkdir my-project
cd my-project
git init

# Create initial files
echo "# My Project" > README.md
echo "console.log('Hello World!');" > app.js

# Add and commit
git add .
git commit -m "Initial commit"

# Create GitHub repository
# Go to github.com, create new repository

# Add remote
git remote add origin https://github.com/username/my-project.git

# Push to GitHub
git push -u origin main

# Create feature branch
git checkout -b feature/add-functionality

# Make changes
echo "function greet(name) { return \`Hello, \${name}!\`; }" >> app.js

# Commit changes
git add .
git commit -m "Add greeting function"

# Push feature branch
git push origin feature/add-functionality

# Create Pull Request on GitHub
# After review and approval:

# Merge to main
git checkout main
git pull origin main
git merge feature/add-functionality

# Delete feature branch
git branch -d feature/add-functionality
git push origin --delete feature/add-functionality
```

### **Example 2: Git Aliases for Productivity**

```bash
# Set up useful aliases
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual '!gitk'

# Usage
git co feature/branch    # Instead of git checkout feature/branch
git br                  # Instead of git branch
git ci -m "message"     # Instead of git commit -m "message"
git st                  # Instead of git status
```

### **Example 3: Git Hooks for Automation**

```bash
# Create pre-commit hook
# File: .git/hooks/pre-commit
#!/bin/sh

echo "Running pre-commit checks..."

# Run linting
npm run lint

# Run tests
npm test

# Check for console.log statements
if git diff --cached --name-only | xargs grep -l "console.log" > /dev/null; then
    echo "Error: console.log statements found in committed files"
    exit 1
fi

echo "Pre-commit checks passed!"
```

```bash
# Make hook executable
chmod +x .git/hooks/pre-commit
```

### **Example 4: GitHub Actions CI/CD**

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
    test:
        runs-on: ubuntu-latest

        steps:
        - uses: actions/checkout@v3

        - name: Setup Node.js
          uses: actions/setup-node@v3
          with:
              node-version: '16'
              cache: 'npm'

        - name: Install dependencies
          run: npm ci

        - name: Run linting
          run: npm run lint

        - name: Run tests
          run: npm test

        - name: Build project
          run: npm run build
```

## **11. Assignments and Projects**

### **Assignment 0.75.1: Git Basics**
1. **Local Git setup:**
   - Install Git on your computer
   - Configure user name and email
   - Create a local repository
   - Make several commits with different file changes

2. **Branching practice:**
   - Create multiple branches
   - Switch between branches
   - Merge branches
   - Resolve merge conflicts

### **Assignment 0.75.2: GitHub Collaboration**
1. **Repository setup:**
   - Create a GitHub account
   - Create a new repository
   - Push local project to GitHub
   - Set up SSH keys for authentication

2. **Collaboration practice:**
   - Fork an existing repository
   - Clone the forked repository
   - Create a feature branch
   - Make changes and commit
   - Create a pull request

### **Project 0.75: Personal Portfolio with Git**
Create a personal portfolio website with:
- HTML, CSS, and JavaScript files
- Git version control throughout development
- Multiple branches for different features
- GitHub repository with proper documentation
- GitHub Pages deployment
- Commit history showing iterative development

## **12. Common Git Problems and Solutions**

### **Problem: "fatal: not a git repository"**
```bash
# Solution: Initialize repository
git init
```

### **Problem: Merge conflicts**
```bash
# Solution: Resolve conflicts manually
git status
# Edit conflicted files
git add resolved-file.js
git commit
```

### **Problem: Accidentally committed wrong files**
```bash
# Solution: Amend last commit
git add correct-files
git commit --amend
```

### **Problem: Lost commits after reset**
```bash
# Solution: Use reflog to find lost commits
git reflog
git checkout lost-commit-hash
```

### **Problem: "Permission denied" when pushing**
```bash
# Solution: Use correct remote URL or SSH key
git remote set-url origin git@github.com:username/repo.git
```

## **13. Resources**

- [Git Official Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Learn Git Branching](https://learngitbranching.js.org/)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [Pro Git Book](https://git-scm.com/book/en/v2)

## **14. Next Steps**

Now that you understand version control, you're ready to:
- **HTML:** Build web page structure
- **CSS:** Style your web pages
- **JavaScript:** Add interactivity
- **Web Development:** Create amazing websites

Remember to commit regularly, write meaningful commit messages, and use branches for new features!

**Happy coding and collaborating! 👥**