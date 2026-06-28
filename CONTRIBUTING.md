# Contributing to Zen Registry

Thank you for contributing to the Zen ecosystem.

## Authentication

### Create an Account

```bash
zen signup
```

Password must be at least 8 characters with:
- Uppercase letter
- Lowercase letter
- Number
- Special character (@$!%*?&)

### Login

```bash
zen login
```

Your token is saved in `~/.zen/auth.json`.

### Check Login Status

```bash
zen whoami
```

Returns the currently logged-in username.

### Logout

```bash
zen logout
```

Removes your local token.

### recovery

```bash
zen recovery
```

update your password

---
---

## Publishing Packages

### Publish Your Package

```bash
zen publish
```

This publishes the package defined in your `zen.json` in the current directory.

### Update a Package

Increase the version in `zen.json` and publish again:

```bash
zen publish
```

Version must be higher than the latest published version (uses semantic versioning comparison).

### Unpublish a Package

Navigate to the package directory and run:

```bash
zen unpublish
```

This unpublishes the package defined in your `zen.json`. Only the owner can unpublish.

---

## Installing Packages

### Install a Package

```bash
zen install mypackage
```

**Runnable packages** (with `main` in zen.json):
- Install to current directory
- Ready to run with `zen run`

**Library packages** (with `bin` in zen.json):
- Install to `~/.zen/packages/mypackage`
- Available for import in your projects

### List Available Packages

```bash
zen list
```

Browse all published packages with pagination. Press `y` to see the next batch.

---

## Package Requirements

Every package must:

- Have a valid `zen.json`
- Be hosted in a public GitHub repository
- Use Semantic Versioning (`major.minor.patch`)
- Have a unique package name (alphanumeric, hyphens, underscores)
- Include a meaningful description
- Contain working Zen source code
- Use `main` for runnable applications, `bin` for libraries

### Example `zen.json` — Runnable Application

```json
{
  "name": "hello-app",
  "version": "1.0.0",
  "author": "your-github-username",
  "repo": "https://github.com/your-github-username/hello-app",
  "description": "A simple Hello World application",
  "main": "main.zen"
}
```

### Example `zen.json` — Library Package

```json
{
  "name": "string-utils",
  "version": "1.0.0",
  "author": "your-github-username",
  "repo": "https://github.com/your-github-username/string-utils",
  "description": "Utility functions for string manipulation",
  "bin": "lib.zen"
}
```

---

## Package Ownership

Packages belong to the account that originally published them.

Only the owner can:

- Publish new versions
- Unpublish the package
- Update the description and repository URL

---

## Version Management

### Semantic Versioning

Format: `major.minor.patch`

Examples:
- `1.0.0` — Initial release
- `1.1.0` — New features (backward compatible)
- `1.1.1` — Bug fixes
- `2.0.0` — Breaking changes

Each new publish must have a version higher than the latest published version.

---

## Reporting Issues

If you discover a bug or security issue in the registry, please open an issue in the [zen-registry repository](https://github.com/jishith-dev/zen-registry) with:

- Clear description of the issue
- Steps to reproduce (if applicable)
- Expected vs actual behavior
- Your environment (OS, Zen version, Node version)

For security issues, please disclose responsibly.

---

## CLI Commands Reference

```bash
# Authentication
zen signup              # Create account
zen login              # Login
zen whoami             # Check logged-in user
zen logout             # Logout
zen recovery           # recover forgotten password

# Package management
zen publish            # Publish/update package
zen unpublish          # Remove package (reads from zen.json)
zen install <pkg>      # Install package
zen list               # Browse all packages

# Development
zen init <name>        # Create new project
zen init <name> --bin  # Create library package
zen run <file>         # Run Zen code
zen build <file>       # Compile to binary
```

---

## Support

For questions about publishing or using Zen, check the [Zen documentation](https://docs.zen-lang.com) or open an issue in this repository.
