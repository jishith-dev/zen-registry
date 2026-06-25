# Zen Package Registry

Official package registry for the Zen programming language.

## Install a Package

```bash
zen install banking
zen install calculator
```

Packages are installed to `~/.zen/packages/`

## Publish Your Package

1. Create a GitHub repo with your Zen project
2. Add `zen.json` to your project:
   ```json
   {
     "name": "mypackage",
     "version": "1.0.0",
     "kind": "lib",
     "author": "your-username",
     "description": "What your package does",
     "repo": "https://github.com/your-username/zen-mypackage",
     "main": "main.zen"
   }
   ```

3. Create a release on GitHub with your Zen files

4. Submit PR to add your package to `packages.json`:
   ```json
   "mypackage": {
     "author": "your-username",
     "repo": "https://github.com/your-username/zen-mypackage",
     "description": "What your package does",
     "latest": "1.0.0"
   }
   ```

Or run:
```bash
zen publish mypackage
```

## Registry Format

`packages.json` maps package names to metadata:

```json
{
  "package-name": {
    "author": "github-username",
    "repo": "https://github.com/username/repo",
    "description": "Short description",
    "latest": "1.0.0"
  }
}
```

## Guidelines

- Package names must be lowercase, alphanumeric, hyphens allowed
- One package per GitHub repo
- Keep descriptions under 100 characters
- Use semver for versions (1.0.0)

