# GitKraken CLI Reference

A premium CLI experience for managing multiple repositories with familiar GIT CLI commands.

## Core Commands

### Authentication
```bash
gk auth login                    # Authenticate with GitKraken platform
gk provider                      # Add or remove provider tokens
```

### Primary Workflows
```bash
gk graph                         # Display commit graph in current repository
gk issue                         # Manage your issues
gk organization                  # Manage your GitKraken organizations
gk work                          # Interact with your work items
gk workspace (alias: ws)         # Interact with your workspaces
```

### Utility Commands
```bash
gk help                          # Help about any command
gk setup                         # Display system configuration info
gk version                       # Print version number
```

## Standard Workflow

### Single Repository Workflow

1. **Authenticate**
   ```bash
   gk auth login
   ```

2. **Navigate to repository**
   ```bash
   cd ./path/to/repo
   ```

3. **Create Work Item** (auto-adds current directory)
   ```bash
   gk work create "My new work item"
   ```

4. **Commit changes with AI**
   ```bash
   gk work commit --ai
   ```

5. **Push changes**
   ```bash
   gk work push
   ```

6. **Create Pull Request with AI**
   ```bash
   gk work pr create --ai
   ```

### Multi-Repository Workflow

Add multiple repos to a single Work Item:
```bash
gk work add ./path/to/repo      # Add repo to current work item
gk work add .                   # Add current directory
```

## Git Command Passthrough

GitKraken CLI supports standard git commands:
```bash
gk status
gk remote -v
# Any git command works through gk
```

## Tips

- Use `gk [command] --help` for detailed command information
- Current directory is automatically added when creating a work item
- AI features available for commits and PR creation
- Manage multiple repos simultaneously through Work Items
