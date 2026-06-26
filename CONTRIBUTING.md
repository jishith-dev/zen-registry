# Contributing to Zen Registry

Thank you for contributing to the Zen ecosystem.

## Publishing Packages

Publishing is handled entirely through the Zen CLI.

Create an account:

```bash
zen signup
```

Login:

```bash
zen login
```

Publish your package:

```bash
zen publish
```

Update an existing package by increasing the version in `zen.json` and publishing again.

Remove a package:

```bash
zen unpublish mypackage
```

---

## Package Requirements

Every package must:

- Have a valid `zen.json`
- Be hosted in a public GitHub repository
- Use Semantic Versioning (`major.minor.patch`)
- Have a unique package name
- Include a meaningful description
- Contain working Zen source code

Example:

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

Applications should use `main` instead of `bin`.

---

## Package Ownership

Packages belong to the account that originally published them.

Only the owner can:

- Publish new versions
- Unpublish the package

---

## Reporting Issues

If you discover a bug or security issue in the registry, please open an issue in this repository with enough information to reproduce it.
