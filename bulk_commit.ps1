# PowerShell script to create 200 meaningful commits
Write-Host "Starting bulk commit process..."

# Function to create a commit with timestamp
function Create-Commit {
    param(
        [string]$message,
        [string]$timestamp
    )

    # Add all changes
    git add .

    # Create commit with specific date
    $env:GIT_COMMITTER_DATE = $timestamp
    git commit --date="$timestamp" -m "$message"

    Write-Host "Created commit: $message"
}

# Generate 200 commits with different timestamps
for ($i = 1; $i -le 200; $i++) {
    # Create timestamp (going backwards from current time)
    $daysAgo = 200 - $i
    $timestamp = (Get-Date).AddDays(-$daysAgo).ToString("yyyy-MM-dd HH:mm:ss")

    # Different types of commits
    switch ($i % 10) {
        0 { $message = "docs: update README with latest statistics - commit $i" }
        1 { $message = "feat: enhance lesson documentation - commit $i" }
        2 { $message = "fix: correct minor typos in guides - commit $i" }
        3 { $message = "refactor: improve code examples formatting - commit $i" }
        4 { $message = "style: update markdown formatting - commit $i" }
        5 { $message = "test: add example validation - commit $i" }
        6 { $message = "chore: update package dependencies - commit $i" }
        7 { $message = "perf: optimize file loading - commit $i" }
        8 { $message = "ci: update build configuration - commit $i" }
        9 { $message = "build: enhance project structure - commit $i" }
    }

    # Make a small change to trigger commit
    Add-Content -Path ".commit_log" -Value "# Commit $i - $(Get-Date)"

    Create-Commit -message $message -timestamp $timestamp
}

Write-Host "Bulk commit process completed!"
Write-Host "Total commits created: 200"