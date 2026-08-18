# Zen Package Registry

Official package registry for the Zen programming language.

## Features

- Install and uninstall packages
- Publish and update packages
- Semantic versioning
- Install specific package versions
- Recursive dependency installation
- Automatic dependency detection with `zen deps`
- Search and browse packages
- Secure account authentication
- GitHub-hosted package source
- GitHub tag-based releases
- Automatic GitHub default branch detection
- Library and application package support

---

## CLI Commands

### Package Management

```bash
zen install <package>
zen install <package>@<version>
zen uninstall <package>
zen search <package>
zen kind <package>
zen mine
zen list
zen publish
zen unpublish
zen deps
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

---

## Library `zen.json`

```json
{
  "name": "mypackage",
  "version": "1.0.0",
  "author": "your-github-username",
  "repo": "https://github.com/your-github-username/mypackage",
  "description": "Example package",
  "bin": "lib.zen",
  "dependencies": {}
}
```

## Application `zen.json`

```json
{
  "name": "myapp",
  "version": "1.0.0",
  "author": "your-github-username",
  "repo": "https://github.com/your-github-username/myapp",
  "description": "Example application",
  "main": "main.zen",
  "dependencies": {}
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

### Latest Version

Install the latest published version:

```bash
zen install http
```

### Specific Version

Install an exact published version:

```bash
zen install http@1.0.0
```

If the requested version does not exist, installation fails.

### Library Packages

Library packages are installed globally:

```text
~/.zen/packages/
```

Example:

```text
~/.zen/packages/
└── drift/
    ├── main.zen
    └── zen.json
```

The installed `zen.json` contains the currently installed version.

Libraries are imported by package name:

```zen
import (App, Request, listen) from "drift"
```

### Runnable Applications

Runnable applications are cloned into the current working directory.

Remove an installed package:

```bash
zen uninstall <package>
```

---

## Dependencies

Packages can depend on other Zen packages.

Dependencies are stored in `zen.json`:

```json
{
  "name": "axion",
  "version": "1.0.0",
  "author": "your-github-username",
  "repo": "https://github.com/your-github-username/axion",
  "description": "Example package",
  "bin": "main.zen",
  "dependencies": {
    "drift": "1.0.0"
  }
}
```

The dependency version specifies the exact version required.

### Automatic Dependency Installation

When installing a package, Zen automatically reads its `dependencies` and installs them recursively.

For example:

```text
zen install axion
```

If Axion contains:

```json
"dependencies": {
  "drift": "1.0.0"
}
```

Zen automatically performs:

```text
Installing axion...
    ↓
Installing drift@1.0.0...
    ↓
Installed drift
    ↓
Installed axion
```

Dependencies can themselves have dependencies, and Zen resolves them recursively.

---

## Detecting Dependencies

You normally don't need to manually maintain the dependency list.

Run:

```bash
zen deps
```

Zen starts from the package's `main` or `bin` entry point and scans imports recursively.

For example:

```text
main.zen
 ├── import "drift"
 └── import "utils.zen"
                  └── import "json-utils"
```

Zen generates:

```json
"dependencies": {
  "drift": "1.0.0",
  "json-utils": "2.0.0"
}
```

Local `.zen` files are scanned recursively but are not added as package dependencies.

Comments are ignored during dependency detection.

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
- Valid Semantic Version
- Version must not already exist

Before publishing a new release, update the version in `zen.json`.

Example:

```text
1.0.0 → 1.0.1
```

Then create the corresponding Git tag:

```bash
git tag v1.0.1
git push origin v1.0.1
```

Finally:

```bash
zen publish
```

---

## Versioning

Zen follows Semantic Versioning:

```text
MAJOR.MINOR.PATCH
```

Examples:

```text
1.0.0
1.2.0
2.0.1
```

Each published version is permanently recorded by the registry.

A package can have multiple published versions:

```text
drift
├── 1.0.0
├── 1.0.1
├── 1.1.0
└── 2.0.0
```

The latest version is used when no version is specified:

```bash
zen install drift
```

A specific version can be selected with:

```bash
zen install drift@1.0.0
```

Zen installs the corresponding Git tag:

```text
v1.0.0
```

GitHub therefore acts as the source of the actual package release while the Zen registry stores the package/version metadata.

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

A package's current metadata can be retrieved from the registry:

```json
{
  "name": "mypackage",
  "author": "your-github-username",
  "repo": "https://github.com/your-github-username/mypackage",
  "description": "Example package",
  "latest": "1.0.0"
}
```

Individual versions are stored separately in the registry.

---

## Release Storage

The Zen registry stores metadata for every published version.

For example:

```text
Package: drift

Versions:
  1.0.0 → GitHub tag v1.0.0
  1.1.0 → GitHub tag v1.1.0
  2.0.0 → GitHub tag v2.0.0
```

The registry does not store the package source code itself.

Package source code remains in the author's GitHub repository.

---

## Important Notes

- The registry stores metadata for every published version.
- The `latest` field points to the newest published version.
- Previous releases remain available through their Git tags.
- `zen install <package>` installs the latest published version.
- `zen install <package>@<version>` installs the requested exact version.
- Library packages are installed globally under `~/.zen/packages/`.
- Library packages do not use separate version directories.
- Dependencies are installed automatically.
- Dependencies can have their own dependencies.
- `zen deps` recursively scans imports to generate the dependency list.
- Local `.zen` imports are not treated as package dependencies.
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