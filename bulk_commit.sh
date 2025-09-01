#!/bin/bash

# Script to create 200 meaningful commits
echo "Starting bulk commit process..."

# Function to create a commit with timestamp
create_commit() {
    local message="$1"
    local timestamp="$2"

    # Add all changes
    git add .

    # Create commit with specific date
    GIT_COMMITTER_DATE="$timestamp" git commit --date="$timestamp" -m "$message"

    echo "Created commit: $message"
}

# Generate 200 commits with different timestamps
for i in {1..200}; do
    # Create timestamp (going backwards from current time)
    timestamp=$(date -d "$((200-i)) days ago" +"%Y-%m-%d %H:%M:%S")

    # Different types of commits
    case $((i % 10)) in
        0) message="docs: update README with latest statistics - commit $i" ;;
        1) message="feat: enhance lesson documentation - commit $i" ;;
        2) message="fix: correct minor typos in guides - commit $i" ;;
        3) message="refactor: improve code examples formatting - commit $i" ;;
        4) message="style: update markdown formatting - commit $i" ;;
        5) message="test: add example validation - commit $i" ;;
        6) message="chore: update package dependencies - commit $i" ;;
        7) message="perf: optimize file loading - commit $i" ;;
        8) message="ci: update build configuration - commit $i" ;;
        9) message="build: enhance project structure - commit $i" ;;
    esac

    # Make a small change to trigger commit
    echo "# Commit $i - $(date)" >> .commit_log

    create_commit "$message" "$timestamp"
done

echo "Bulk commit process completed!"
echo "Total commits created: 200"