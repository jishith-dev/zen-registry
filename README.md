# Zen Package Registry

Official package registry for the Zen programming language.

## Features

- Install and uninstall packages
- Publish and update packages
- Search and browse packages
- Secure account authentication
- GitHub-hosted package source
- Automatic GitHub default branch detection
- Library and application package support

---

## CLI Commands

### Package Management

```bash
zen install <package>
zen uninstall <package>
zen search <package>
zen kind <package>
zen mine
zen list
zen publish
zen unpublish
```

### Authentication

```bash
zen signup
zen login
zen whoami
zen logout
zen recovery
```

---

## Creating a Package

### Library

```bash
zen init mypackage --bin
```

### Application

```bash
zen init myapp
```

### Library `zen.json`

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

### Application `zen.json`

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

## Package Requirements

Every package must:

- Have a valid `zen.json`
- Be hosted in a public GitHub repository
- Use Semantic Versioning (`major.minor.patch`)
- Have a unique package name
- Provide a meaningful description (maximum 400 characters)
- Use `main` for runnable applications
- Use `bin` for library packages

---

## Installing Packages

### Library Packages

```bash
zen install http
```

Installed to:

```text
~/.zen/packages/
```

Imported as:

```zen
import(get) from "http"
```

### Runnable Applications

Runnable applications are cloned into the current working directory.

Remove an installed package:

```bash
zen uninstall <package>
```

---

## Publishing Packages

Publish from the package directory:

```bash
zen publish
```

Requirements:

- Logged in with `zen login`
- Valid `zen.json`
- Public GitHub repository
- Unique package name
- Version higher than the latest published version

Updating a package only requires increasing the version and publishing again.

---

## Package Ownership

Packages belong to the account that originally published them.

Only the owner can:

- Publish new versions
- Unpublish the package
- Update the repository URL
- Update the package description

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

Current account:

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

When creating an account with `zen signup`, you receive recovery codes.

Store these codes safely. They cannot be retrieved later.

Recover your account:

```bash
zen recovery
```

You will be prompted for:

- Username
- Recovery code
- New password

Each recovery code can only be used once.

---

## Browsing Packages

Browse all packages:

```bash
zen list
```

Search packages:

```bash
zen search <package>
```

Show package type:

```bash
zen kind <package>
```

View packages published by your account:

```bash
zen mine
```

---

## Package Metadata

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

```text
1.0.0
1.2.0
2.0.1
```

Each publish must use a version greater than the currently published version.

---

## Important Notes

- The registry stores only the latest published version.
- Publishing a new version replaces the previous registry entry.
- Previous releases should be preserved in your GitHub repository.
- `zen install` automatically clones the repository's default Git branch.
- Library packages are imported by package name without the `.zen` extension.

---

## Reporting Issues

Please open an issue in the Zen Registry repository with:

- Clear description
- Steps to reproduce
- Expected and actual behavior
- Environment information

---

## License

See the LICENSE file.