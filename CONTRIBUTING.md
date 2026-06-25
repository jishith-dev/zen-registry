# Contributing to Zen Registry

## Adding Your Package

1. Ensure your Zen project is in a public GitHub repo
2. Tag a release (e.g., `v1.0.0`)
3. Add `.zen` source files to the release
4. Fork this repo and edit `packages.json`:

```json
{
  "your-package": {
    "author": "your-github-username",
    "repo": "https://github.com/your-username/zen-your-package",
    "description": "What it does (under 100 chars)",
    "latest": "1.0.0"
  }
}
```

5. Create a PR with title: `add: your-package v1.0.0`

## Requirements

- **Valid zen.json** - project must have zen.json with name, version, author
- **Public GitHub repo** - anyone should be able to download releases
- **Semantic versioning** - use major.minor.patch (1.0.0)
- **README** - include instructions in your repo
- **Working code** - package must be functional

## Review Process

- Check for valid zen.json format
- Verify GitHub repo is accessible
- Confirm package name is unique (lowercase, hyphens ok)
- Accept or request changes

## Updating Your Package

Add new version to packages.json:
```json
"your-package": {
  ...
  "latest": "1.1.0"
}
```

## Removal

Open an issue if a package needs to be removed.

