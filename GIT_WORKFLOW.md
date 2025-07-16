# VeloCards Git Workflow

## Branch Structure

### 🏢 Main Branch (`main`)
- **Purpose**: Production-ready code
- **Deployment**: Automatically deploys to app.velocards.com
- **Protection**: Protected branch (requires PR)
- **Direct commits**: Not allowed

### 🔧 Development Branch (`develop`)
- **Purpose**: Integration branch for features
- **Deployment**: Can deploy to staging/test environment
- **Testing**: All features tested here before merging to main
- **Direct commits**: Only for hotfixes

### 🌟 Feature Branches (`feature/*`)
- **Purpose**: Individual features or tasks
- **Naming**: `feature/description-of-feature`
- **Created from**: `develop`
- **Merged to**: `develop`

## Workflow Process

### 1. Starting a New Feature

```bash
# Ensure you have the latest develop
git checkout develop
git pull origin develop

# Create a new feature branch
git checkout -b feature/add-payment-method

# Work on your feature
git add .
git commit -m "feat: add new payment method integration"
```

### 2. Keeping Your Branch Updated

```bash
# While on your feature branch
git checkout develop
git pull origin develop
git checkout feature/add-payment-method
git merge develop

# Resolve any conflicts if they exist
```

### 3. Submitting Your Work

```bash
# Push your feature branch
git push origin feature/add-payment-method

# Create a Pull Request on GitHub
# - Base: develop
# - Compare: feature/add-payment-method
```

### 4. After PR Approval

```bash
# The PR will be merged into develop
# Delete your local feature branch
git checkout develop
git pull origin develop
git branch -d feature/add-payment-method
```

### 5. Releasing to Production

```bash
# When develop is ready for production
git checkout main
git pull origin main
git merge develop
git push origin main

# This triggers automatic deployment to app.velocards.com
```

## Commit Message Convention

Use conventional commits for clear history:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

Examples:
```bash
git commit -m "feat: implement secure card sessions"
git commit -m "fix: resolve login redirect issue"
git commit -m "docs: update API documentation"
```

## Branch Protection Rules (GitHub)

### For `main` branch:
- ✅ Require pull request before merging
- ✅ Require approvals (at least 1)
- ✅ Dismiss stale PR approvals when new commits are pushed
- ✅ Require branches to be up to date before merging
- ✅ Include administrators

### For `develop` branch:
- ✅ Require pull request before merging
- ✅ Require branches to be up to date before merging

## Emergency Hotfix Process

For critical production issues:

```bash
# Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-security-fix

# Make the fix
git add .
git commit -m "fix: patch critical security vulnerability"

# Push and create PR to main
git push origin hotfix/critical-security-fix

# After merge, sync develop
git checkout develop
git pull origin main
git push origin develop
```

## Best Practices

1. **Never commit directly to main**
2. **Always create feature branches from develop**
3. **Keep commits atomic and focused**
4. **Write clear, descriptive commit messages**
5. **Test locally before pushing**
6. **Keep PRs small and focused**
7. **Update branch from develop before creating PR**
8. **Delete feature branches after merge**

## Deployment Pipeline

```
feature/* → develop → main → production
   ↓          ↓        ↓
  Local    Staging   app.velocards.com
```

## Common Commands Reference

```bash
# View all branches
git branch -a

# Clean up local branches
git branch -d branch-name

# Check branch status
git status

# View commit history
git log --oneline --graph --all

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Stash changes temporarily
git stash
git stash pop
```

## Questions?

If you're unsure about any process, ask before proceeding. It's better to clarify than to fix issues later!

---

*Last updated: July 2025*