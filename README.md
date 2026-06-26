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

Example `zen.json`:

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

For applications, replace `bin` with:

```json
{
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

Logout:

```bash
zen logout
```

Authentication is stored locally in:

```text
~/.zen/auth.json
```

---

## Publishing

Publish a package:

```bash
zen publish
```

Requirements:

- Logged in with `zen login`
- Valid `zen.json`
- Public GitHub repository
- Unique package name

---

## Unpublishing

Remove one of your published packages:

```bash
zen unpublish mypackage
```

Only the package owner can unpublish a package.

---

## Package Metadata

Each package is stored in the registry as:

```json
{
  "mypackage": {
    "author": "your-github-username",
    "repo": "https://github.com/your-github-username/mypackage",
    "description": "Example package",
    "latest": "1.0.0"
  }
}
```

---

## Versioning

Zen follows Semantic Versioning.

Examples:

```
1.0.0
1.2.0
2.0.1
```

---

## License

See the LICENSE file for licensing information.
