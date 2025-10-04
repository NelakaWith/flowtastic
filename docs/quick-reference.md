# Flowtastic Quick Reference

## 🚀 Getting Started

### Installation

```bash
npm install
npm run dev
```

### First Workflow

1. Click **📋 Templates** to choose a starting point
2. Or drag blocks from the left toolbox
3. All 4 export formats generate automatically
4. Watch the validation panel for errors

---

## 🎨 UI Elements

### Toolbar (Top)

- **📋 Templates** - Load pre-built workflows
- **📥 Import YAML** - Import existing GitHub Actions file
- **💾 Save** - Save to browser storage
- **📂 Load** - Load from browser storage
- **🗑️ Clear** - Clear workspace
- **↶/↷** - Undo/Redo
- **🔍+/🔍-/⊙** - Zoom controls

### Workspace (Left)

- Drag blocks from toolbox
- Connect blocks by matching shapes
- Click blocks to edit values
- Right-click for more options

### Preview (Right)

- **YAML** - Custom format
- **JSON** - Structured data
- **GitHub (Converted)** - From generic blocks
- **GitHub (Native)** - From GitHub Actions blocks
- **↓ Download** - Save to file

### Validation Panel (Bottom)

- **Green** - No issues ✓
- **Yellow** - Warnings ⚠
- **Red** - Errors ✗
- Click errors to jump to block

---

## 📋 Block Categories

### 1. Workflow (Green)

Main workflow structure

**GitHub Actions:**

- `Workflow Name` - Root block
- `Trigger` - When to run (push, pull_request, etc.)
- `Permissions` - Access control
- `Job` - Execution unit
- `Steps` - Commands to run

### 2. Jobs (Blue)

Job configuration

- `Job Permissions` - Job-level access
- `Strategy Matrix` - Parallel execution
- `Environment Variables` - Key-value pairs

### 3. Steps (Orange)

Actions to perform

- `Step: Uses` - Use GitHub Action
- `Step: Run` - Shell command
- `Step: Run (Multi-line)` - Complex scripts
- `Step: Run (Enhanced)` - With working directory
- `With Parameters` - Action inputs
- `Step Condition` - Conditional execution

### 4. Triggers (Purple)

Event configurations

- `Push/PR Config` - Branch/tag filters
- `Workflow Dispatch` - Manual trigger
- `Release Config` - Release types
- `Issues Config` - Issue events

---

## ✅ Validation Rules

### Errors (Must Fix)

- ❌ Empty workflow name
- ❌ No jobs defined
- ❌ Empty job name
- ❌ Duplicate job names
- ❌ Invalid job name format (use a-z, 0-9, -, \_)
- ❌ Missing runs-on (runner)
- ❌ Job dependency doesn't exist
- ❌ Circular dependencies
- ❌ Empty run command
- ❌ Empty action (uses)
- ❌ Empty parameter key

### Warnings (Should Fix)

- ⚠️ No triggers (won't run automatically)
- ⚠️ No steps in job
- ⚠️ Empty step name
- ⚠️ Action without version (e.g., missing @v4)
- ⚠️ Empty parameter value
- ⚠️ Empty environment variable

---

## 📥 Import YAML

### Supported Features

✅ Workflow name
✅ Triggers (all types)
✅ Trigger configs (branches, tags, types)
✅ Permissions (workflow & job level)
✅ Jobs (all properties)
✅ Job dependencies (needs)
✅ Matrix strategy
✅ Environment variables
✅ Steps (uses & run)
✅ Step parameters (with)
✅ Working directory
✅ Conditionals (if)

### How to Import

1. Click **📥 Import YAML**
2. Select `.yml` or `.yaml` file
3. Workspace clears and blocks created
4. Check validation panel for issues
5. Edit as needed

---

## 📋 Template Library

### CI/CD

- **Node.js CI** - Build, test, coverage
- **Docker Build & Push** - Container workflows

### Testing

- **Python Testing** - Multi-version pytest

### Release

- **NPM Release** - Publish on release event

### Deployment

- **Deploy to GitHub Pages** - Static sites

### How to Use Templates

1. Click **📋 Templates**
2. Filter by category (optional)
3. Click template card
4. Edit for your needs

---

## 🎯 Common Workflows

### Basic CI

```
Workflow Name: "CI"
└─ Trigger: push
└─ Job: "test"
   ├─ runs-on: ubuntu-latest
   └─ Steps:
      ├─ Uses: actions/checkout@v4
      ├─ Uses: actions/setup-node@v4
      ├─ Run: npm ci
      └─ Run: npm test
```

### Job Dependencies

```
Job: "build"
└─ needs: (empty)

Job: "test"
└─ needs: build

Job: "deploy"
└─ needs: test
```

### Matrix Strategy

```
Job: "test"
└─ Strategy Matrix:
   ├─ node-version: 18, 20, 22
   └─ os: ubuntu-latest, windows-latest
```

---

## 💡 Tips & Tricks

### 1. Start with Templates

Don't build from scratch - customize a template!

### 2. Watch Validation

Fix red errors first, then yellow warnings.

### 3. Use Job Dependencies

Chain jobs with `needs` field for sequential execution.

### 4. Matrix for Parallel Tests

Test multiple versions/platforms simultaneously.

### 5. Export Native Format

Use "GitHub (Native)" format for direct GitHub Actions.

### 6. Import to Learn

Import existing workflows to see how they're structured.

### 7. Save Often

Use **💾 Save** frequently - it persists in browser storage.

### 8. Zoom for Complex Workflows

Use **🔍+/🔍-** to navigate large workflows.

---

## 🐛 Troubleshooting

### Q: Blocks won't connect

**A:** Check shapes match. Only compatible blocks connect.

### Q: Export shows empty

**A:** Add a `Workflow Name` block as root.

### Q: Validation shows errors

**A:** Click error to jump to block. Fix required fields.

### Q: Import failed

**A:** Check YAML syntax. Must be valid GitHub Actions workflow.

### Q: Job dependency error

**A:** Referenced job must exist. Check `needs` field.

### Q: Template won't load

**A:** Try clearing workspace first with **🗑️ Clear**.

### Q: Lost my work

**A:** Check **📂 Load** - saves persist in browser.

---

## 🎓 Best Practices

### Naming

- Use descriptive job names: `build`, `test`, `deploy`
- Use clear step names: "Install dependencies", "Run tests"

### Organization

- One job per major task
- Group related steps
- Use comments (step names) liberally

### Dependencies

- Build → Test → Deploy (sequential)
- Use matrix for parallel execution
- Avoid circular dependencies

### Validation

- Keep validation panel green
- Fix warnings before deploying
- Test with real GitHub repository

### Templates

- Start with closest template
- Customize for your needs
- Save custom workflows for reuse

---

## 🔗 Keyboard Shortcuts

- **Ctrl+Z** / **Cmd+Z** - Undo
- **Ctrl+Shift+Z** / **Cmd+Shift+Z** - Redo
- **Delete** - Delete selected block
- **Ctrl+C** / **Cmd+C** - Copy block
- **Ctrl+V** / **Cmd+V** - Paste block

---

## 📊 Export Formats Explained

### 1. YAML (Custom)

Generic workflow format - platform agnostic

### 2. JSON (Custom)

Structured JSON - for APIs or databases

### 3. GitHub Actions (Converted)

Converts generic blocks to GitHub Actions format

### 4. GitHub Actions (Native)

Direct GitHub Actions - from GHA-specific blocks

**💡 Tip:** Use format #4 for production workflows!

---

## 🆘 Support

- Issues: Check validation panel first
- Bugs: Check browser console (F12)
- Questions: Refer to docs/workflow-builder.md
- Examples: See docs/examples.md

---

## 🚀 Next Steps

1. **Try a Template** - Load "Node.js CI"
2. **Customize It** - Change node version, add steps
3. **Export** - Download as `.github/workflows/ci.yml`
4. **Import** - Verify by importing the exported file
5. **Deploy** - Commit to GitHub repository

**Happy workflow building!** 🎉
