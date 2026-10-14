# Source Control Guidelines

## Tools
Git for version control, GitHub for hosting, pull requests and reviews.

## Branching strategy
- `main`: stable, production-ready code. Every merge triggers the CI/CD pipeline.
- `feature/<name>`: new features (e.g. `feature/booking-validation`)
- `fix/<name>`: bug fixes (e.g. `fix/health-check`)
- `docs/<name>`: documentation changes

Nobody pushes directly to `main`.

## Commit message style
Format: `type: short description`

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation
- `chore:` config or maintenance

Example: `fix: correct ACR login step in deploy.yml`

## Pull request process
1. Create a branch from the latest `main`.
2. Commit small, focused changes.
3. Push the branch and open a pull request into `main`.
4. At least one teammate reviews the PR.
5. The CI checks (build, test) must pass.
6. Merge the PR, then delete the branch.

## Branch protection (main)
- Pull request required before merging
- Status checks must pass
- Direct pushes blocked

## Secrets and ignored files
- `.gitignore` keeps `node_modules` and `.env` out of Git.
- `.env.example` documents required variables with no real values.
- Secrets live only in GitHub Secrets and Azure Application Settings.
