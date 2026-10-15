# Source Control Guidelines

## Tools
Git for version control, GitHub for repository hosting, pull requests, and peer code reviews.

## Branching Strategy
- main: The stable, production-ready branch. Direct pushes are completely blocked. Every merge into main triggers the automated CI/CD pipeline.
- feature/<name>: Dedicated branches for developing new application logic (e.g., feature/booking-validation).
- fix/<name>: Dedicated branches for resolving application bugs (e.g., fix/health-check).
- docs/<name>: Dedicated branches for handling documentation updates.

*Team Integration Rule:* Before initiating a new task, team members must check the remote repository first to see if their assigned branch already exists. If the branch exists, they must pull it down locally. If it does not exist, they should proceed to create it following the prefixes above.

## Commit Message Style
Format: `type: short description`

All commits must manually include a structural prefix tag in the commit text field to keep the repository log audited and organized:
- feat: Indicates a new application feature.
- fix: Indicates a correction or bug fix.
- docs: Indicates a documentation change or update.
- chore: Indicates routine maintenance, library updates, or configuration tweaks.

## Pull Request Process
1. Check for an existing branch, or create a new branch from the latest state of the main branch.
2. Commit focused, incremental changes to your isolated workspace.
3. Push the branch to GitHub and open a formal Pull Request (PR) targeting the main branch.
4. At least one teammate must perform a code review and approve the PR.
5. The automated CI workflow (GitHub Actions) checks must pass successfully.
6. Merge the PR into main, then delete the feature branch to maintain a clean repository space.

## Branch Protection (main)
- A formal Pull Request is strictly required before any code can be merged.
- Automated status and build checks must pass cleanly.
- Direct administrative pushes to the main branch are entirely blocked at the platform level.

## Secrets and Environment Management
- The `.gitignore` file must be used to keep local runtime folders (`node_modules`) and plain-text configuration files (`.env`) out of Git tracking.
- The `.env.example` file serves as a blank blueprint template, documenting the required configuration keys without exposing functional passwords.
- Real production credentials must never be hardcoded into the source files. They must live only within encrypted GitHub Secrets for pipeline authentication, and Azure Application Settings for runtime memory injection.
