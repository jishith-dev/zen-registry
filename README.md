# Zen Package Registry

Official package registry for the Zen programming language.

## Features

- Install packages from the Zen Registry
- Publish packages directly from the CLI
- Secure account-based authentication
- GitHub-hosted package source
- Package ownership verification

---

## Installation

Install a package:

```bash
zen install <package-name>
```

Example:

```bash
zen install banking
zen install calculator
```

Library packages are installed to:

```text
~/.zen/packages/
```

Runnable applications are cloned into the current working directory.

---

## Creating a Package

Create a new library:

```bash
zen init mypackage --bin
```

Create a new application:

```bash
zen init myapp
```

Example `zen.json` for library:

```json
{
  "name": "mypackage",
  "version": "1.0.0",
  "author": "your-github-username",
  "repo": "https://github.com/your-github-username/mypackage",
  "description": "Example package",
  "bin": "lib.zen"
}
```

Example `zen.json` for application:

```json
{
  "name": "myapp",
  "version": "1.0.0",
  "author": "your-github-username",
  "repo": "https://github.com/your-github-username/myapp",
  "description": "Example application",
  "main": "main.zen"
}
```

---

## Authentication

Create an account:

```bash
zen signup
```

Login:

```bash
zen login
```

Check login status:

```bash
zen whoami
```

Logout:

```bash
zen logout
```

Authentication is stored locally in:

```text
~/.zen/auth.json
```

---
## Account Recovery

When you create an account with zen signup, you receive recovery codes. Save these codes in a safe place. They cannot be retrieved later.

Each recovery code can be used once to reset your password if you forget it.

Recover your account:

    zen recovery

You will be prompted for:

- Username
- Recovery code (from the list you saved during signup)  
- New password (must meet password requirements)

If you use a recovery code, it becomes invalid and cannot be used again. You will have 7 remaining codes.

Recovery codes are 8 hexadecimal characters, for example: a1b2c3d4

--- 

## Publishing

Publish a package from its directory:

```bash
zen publish
```

Requirements:

- Logged in with `zen login`
- Valid `zen.json` in current directory
- Public GitHub repository
- Unique package name
- Version higher than previous release

---

## Unpublishing

Navigate to your package directory and remove it:

```bash
zen unpublish
```

This unpublishes the package defined in your `zen.json`. Only the package owner can unpublish.

---

## Browsing Packages

List all available packages:

```bash
zen list
```

Browse through packages with pagination (50 per page). Press `y` to see the next batch.

---

## Package Metadata

Each package in the registry has this metadata:

```json
{
  "name": "mypackage",
  "author": "your-github-username",
  "repo": "https://github.com/your-github-username/mypackage",
  "description": "Example package",
  "latest": "1.0.0"
}
```

---

## Versioning

Zen follows Semantic Versioning (`major.minor.patch`).

Examples:

```
1.0.0
1.2.0
2.0.1
```

Each new publish must have a version higher than the latest.

---

> **Important: No Version History**
> 
> The registry currently stores only the latest version of each package.
> 
> Publishing a new version overwrites the previous one.
> 
> Old versions are not retained or accessible.
> 
> Keep releases in your GitHub repository for historical reference.

---

## Contributing

For guidelines on publishing and package standards, see [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## License

See the LICENSE file for licensing information.
