# Recommended package.json Scripts

Add these scripts to your `package.json` to support the complete workflow:

```json
{
  "scripts": {
    "// Development": "",
    "dev": "vite",
    "dev:debug": "vite --debug --force",
    
    "// Building": "",
    "build": "tsc && vite build",
    "build:analyze": "vite build --mode analyze",
    "preview": "vite preview",
    
    "// Testing": "",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:integration": "vitest run --config vitest.integration.config.ts",
    
    "// Code Quality": "",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,css,md}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,js,jsx,json,css,md}\"",
    
    "// Database": "",
    "db:generate": "drizzle-kit generate:pg",
    "db:migrate": "drizzle-kit push:pg",
    "db:studio": "drizzle-kit studio",
    "db:seed": "tsx scripts/seed.ts",
    "db:reset": "tsx scripts/reset-db.ts",
    "db:test:setup": "NODE_ENV=test tsx scripts/setup-test-db.ts",
    
    "// Validation": "",
    "validate": "npm run type-check && npm run lint && npm run test",
    "validate:full": "npm run type-check && npm run lint && npm run test:coverage && npm run build",
    
    "// Git Hooks": "",
    "prepare": "husky install",
    "pre-commit": "lint-staged",
    "pre-push": "npm run validate",
    
    "// Firebase": "",
    "firebase:emulators": "firebase emulators:start",
    "firebase:deploy:staging": "firebase deploy --only hosting:staging",
    "firebase:deploy:prod": "firebase deploy --only hosting:production",
    
    "// Utilities": "",
    "clean": "rm -rf dist node_modules/.vite",
    "clean:full": "rm -rf dist node_modules pnpm-lock.yaml && pnpm install",
    "analyze": "vite-bundle-visualizer"
  }
}
```

## Installation Commands

```bash
# Install development dependencies
pnpm add -D \
  eslint \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  prettier \
  husky \
  lint-staged \
  vitest \
  @vitest/ui \
  @vitest/coverage-v8 \
  vite-bundle-visualizer

# Install Husky for git hooks
pnpm exec husky install

# Create pre-commit hook
cat > .husky/pre-commit << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm run pre-commit
EOF

chmod +x .husky/pre-commit

# Create pre-push hook
cat > .husky/pre-push << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm run validate
EOF

chmod +x .husky/pre-push
```

## lint-staged Configuration

Add to `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "vitest related --run"
    ],
    "*.{js,jsx,json,css,md}": [
      "prettier --write"
    ]
  }
}
```

## Usage Examples

```bash
# Development
pnpm dev                    # Start dev server
pnpm dev:debug              # Start with debug mode

# Testing
pnpm test                   # Run all tests once
pnpm test:watch             # Run tests in watch mode
pnpm test:ui                # Open Vitest UI
pnpm test:coverage          # Generate coverage report
pnpm test:integration       # Run integration tests

# Code Quality
pnpm lint                   # Check for lint errors
pnpm lint:fix               # Fix lint errors
pnpm type-check             # TypeScript type checking
pnpm format                 # Format all files
pnpm format:check           # Check if files are formatted

# Database
pnpm db:generate            # Generate migrations
pnpm db:migrate             # Run migrations
pnpm db:studio              # Open Drizzle Studio
pnpm db:seed                # Seed database

# Validation
pnpm validate               # Quick validation
pnpm validate:full          # Full validation with coverage

# Building
pnpm build                  # Production build
pnpm build:analyze          # Build with bundle analysis
pnpm preview                # Preview production build

# Maintenance
pnpm clean                  # Clean build artifacts
pnpm clean:full             # Full clean and reinstall
```
