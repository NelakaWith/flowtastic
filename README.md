# ⚡ Flowtastic - GitHub Actions Workflow Builder

A visual workflow builder for creating **GitHub Actions workflows** using **React + Vite + Blockly + TailwindCSS**.

**🎯 Build CI/CD pipelines visually • No YAML syntax errors • Real-time preview • Template library**

---

## 🚀 Quick Start

```bash
# Clone and install
git clone https://github.com/NelakaWith/flowtastic.git
cd flowtastic
npm install

# Start development server
npm run dev
```

**📚 [Complete User Guide](markdown/USER_GUIDE.md)** • **🚀 [Quick Start](markdown/QUICKSTART.md)** • **💡 [Examples](markdown/examples.md)**

---

## ✨ Features

### 🎯 Visual Workflow Builder

- **Drag & Drop Interface**: Build workflows using visual blocks
- **Real-time Preview**: See YAML/JSON output as you build
- **GitHub Actions Native**: Direct export to production-ready workflows
- **Template Library**: Start with proven CI/CD patterns

### 🔧 Advanced Capabilities

- **📥 YAML Import**: Load existing GitHub Actions workflows
- **✅ Validation Engine**: Catch errors before deployment
- **🔄 Export Formats**: YAML, JSON, GitHub Actions (4 formats)
- **💾 Persistence**: Save/load workflows in browser storage

### 🎨 Developer Experience

- **TypeScript**: Full type safety throughout
- **Modern Stack**: React 19 + Vite 7 + TailwindCSS 3
- **Block System**: Extensible custom block architecture
- **Responsive UI**: Works on desktop and tablet devices

---

## 📸 Screenshot

```
┌─────────────────────────────────────────────────────────────┐
│  📋 Templates | 📥 Import | 💾 Save | 🗑️ Clear | ↶↷ 🔍±⊙    │
├─────────────────┬───────────────────────────────────────────┤
│                 │                                           │
│   📦 Toolbox    │            🎨 Workspace                   │
│                 │                                           │
│  🟢 Workflow    │     ┌─────────────────┐                  │
│  🔵 Jobs        │     │ Workflow Name   │                  │
│  🟠 Steps       │     │ "Node.js CI"    │                  │
│  🟣 Triggers    │     └────────┬────────┘                  │
│                 │              │                           │
├─────────────────┤              ▼                           │
│                 │     ┌─────────────────┐                  │
│  ✅ Validation  │     │ Trigger: push   │                  │
│                 │     └────────┬────────┘                  │
│  🟢 No issues   │              │                           │
│                 │              ▼                           │
└─────────────────┤     ┌─────────────────┐                  │
                  │     │ Job: test       │                  │
                  │     │ runs-on: ubuntu │                  │
                  │     └─────────────────┘                  │
                  │                                           │
                  ├───────────────────────────────────────────┤
                  │                                           │
                  │            📄 Preview                     │
                  │                                           │
                  │  name: Node.js CI                         │
                  │  on: [push, pull_request]                 │
                  │  jobs:                                    │
                  │    test:                                  │
                  │      runs-on: ubuntu-latest               │
                  │      steps:                               │
                  │        - uses: actions/checkout@v4        │
                  │                                           │
                  │  📋 Copy | 💾 Download                    │
                  └───────────────────────────────────────────┘
```

---

## 🎯 Use Cases

### CI/CD Pipelines

- **Node.js/Python/Java** testing and building
- **Docker** image building and publishing
- **Multi-platform** testing with matrix strategies
- **Automated deployment** to staging/production

### Automation Workflows

- **Release automation** with semantic versioning
- **Security scanning** and vulnerability checks
- **Code quality** checks with linting and formatting
- **Notification systems** for team communication

### Learning & Teaching

- **Visual learning** of GitHub Actions concepts
- **Template exploration** for best practices
- **Import existing workflows** to understand structure
- **Experimentation** without breaking production

---

## 📦 What's Included

### 🟢 Block Categories

**Workflow Blocks**: Core structure (Workflow Name, Triggers, Permissions)
**Job Blocks**: Execution units (Jobs, Strategy Matrix, Environment Variables)
**Step Blocks**: Actions (Uses, Run commands, Parameters, Conditions)
**Trigger Blocks**: Event configuration (Push/PR filters, Schedules, Manual)

### 📋 Template Library

- **Node.js CI** - Build, test, and cache Node.js applications
- **Python Testing** - Multi-version testing with pytest
- **Docker Build & Push** - Container workflows with multi-platform builds
- **NPM Release** - Automated package publishing
- **Deploy to GitHub Pages** - Static site deployment

### 🔧 Export Formats

1. **YAML (Custom)** - Generic workflow format
2. **JSON (Custom)** - Structured data format
3. **GitHub Actions (Converted)** - Converted from generic blocks
4. **GitHub Actions (Native)** ⭐ - Direct production-ready format

---

## 🛠️ Tech Stack

| Category            | Technology     | Version |
| ------------------- | -------------- | ------- |
| **Frontend**        | React          | 19.1.1  |
| **Build Tool**      | Vite           | 7.1.7   |
| **Language**        | TypeScript     | 5.8.3   |
| **UI Framework**    | TailwindCSS    | 3.4.18  |
| **Block Editor**    | Google Blockly | 12.3.1  |
| **YAML Processing** | js-yaml        | 4.1.0   |

### Development Tools

- **ESLint** - Code linting and formatting
- **Commitizen** - Conventional commit messages
- **Commitlint** - Commit message validation
- **Husky** - Git hooks for quality control

---

## 📁 Project Structure

```
flowtastic/
├── src/
│   ├── blocks/
│   │   └── githubActionsBlocks.ts    # GitHub Actions block definitions
│   ├── components/
│   │   ├── BlocklyEditor.tsx         # Blockly workspace integration
│   │   ├── CodePreview.tsx           # YAML/JSON preview panel
│   │   ├── WorkflowControls.tsx      # Toolbar controls
│   │   ├── TemplateSelector.tsx      # Template selection modal
│   │   └── ValidationPanel.tsx       # Error/warning display
│   ├── templates/
│   │   └── templateTypes.ts          # Pre-built workflow templates
│   ├── utils/
│   │   ├── githubActionsBlocksConverter.ts  # Block → YAML conversion
│   │   ├── validator.ts              # Workflow validation logic
│   │   └── yamlImporter.ts          # YAML → Blocks conversion
│   ├── hooks/
│   │   └── useToast.tsx             # Toast notification system
│   └── App.tsx                      # Main application component
├── docs/
│   ├── USER_GUIDE.md               # 📚 Complete user documentation
│   ├── QUICKSTART.md               # 🚀 5-minute getting started
│   ├── examples.md                 # 💡 Example workflows
│   ├── quick-reference.md          # 📋 Quick reference guide
│   └── implementation-summary.md   # 🔧 Technical implementation
└── README.md                       # This file
```

---

## 📚 Documentation

| Document                                                | Purpose                   | Audience   |
| ------------------------------------------------------- | ------------------------- | ---------- |
| **[📚 User Guide](docs/USER_GUIDE.md)**                 | Complete documentation    | All users  |
| **[🚀 Quick Start](docs/QUICKSTART.md)**                | 5-minute getting started  | New users  |
| **[💡 Examples](docs/examples.md)**                     | Sample workflows          | Learning   |
| **[📋 Quick Reference](docs/quick-reference.md)**       | UI elements and shortcuts | Reference  |
| **[🔧 Implementation](docs/implementation-summary.md)** | Technical details         | Developers |

### Getting Started Path

1. **🚀 [Quick Start](docs/QUICKSTART.md)** - Get running in 5 minutes
2. **📚 [User Guide](docs/USER_GUIDE.md)** - Learn all features
3. **💡 [Examples](docs/examples.md)** - Explore sample workflows
4. **📋 [Quick Reference](docs/quick-reference.md)** - Reference while building

---

## 🎯 Usage Examples

### Basic CI Workflow

```yaml
# Generated from visual blocks
name: Node.js CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npm ci
      - run: npm test
```

### Matrix Testing

```yaml
# Multi-version testing
strategy:
  matrix:
    node-version: [18, 20, 22]
    os: [ubuntu-latest, windows-latest]
# Creates 6 parallel jobs
```

### Conditional Deployment

```yaml
# Deploy only on main branch
- name: Deploy to production
  if: github.ref == 'refs/heads/main'
  run: npm run deploy
```

---

## 🧩 Adding Custom Blocks

Flowtastic is designed to be extensible. Add new block types by:

### 1. Define Block

```typescript
// In src/blocks/githubActionsBlocks.ts
Blockly.Blocks["my_custom_block"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("My Custom Block")
      .appendField(new Blockly.FieldTextInput("default"), "FIELD_NAME");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(180);
  },
};
```

### 2. Add Converter Logic

```typescript
// In src/utils/githubActionsBlocksConverter.ts
case "my_custom_block": {
  const fieldValue = block.getFieldValue("FIELD_NAME");
  return {
    type: "custom_step",
    value: fieldValue
  };
}
```

### 3. Update Toolbox

```typescript
// In src/blocks/githubActionsBlocks.ts - toolbox definition
{
  kind: "block",
  type: "my_custom_block"
}
```

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/flowtastic.git
cd flowtastic

# Install dependencies
npm install

# Start development server
npm run dev

# Run linting
npm run lint

# Make commits (uses Commitizen)
npm run commit
```

### Contribution Guidelines

1. **🔧 Code Quality**

   - Use TypeScript for type safety
   - Follow existing code patterns
   - Add tests for new functionality
   - Run `npm run lint` before committing

2. **📝 Commit Messages**

   - Use `npm run commit` for conventional commits
   - Format: `type(scope): description`
   - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

3. **🧪 Testing**

   - Test new features thoroughly
   - Verify export formats work correctly
   - Check validation logic for edge cases
   - Test on different browsers

4. **📚 Documentation**
   - Update relevant documentation
   - Add examples for new features
   - Update README if needed

### Areas for Contribution

- **🧩 New Block Types** - Add more GitHub Actions features
- **📋 Templates** - Contribute workflow templates
- **🎨 UI/UX** - Improve interface and experience
- **🔧 Performance** - Optimize rendering and processing
- **📝 Documentation** - Improve guides and examples
- **🐛 Bug Fixes** - Fix issues and edge cases

---

## 🔧 Development

### Available Scripts

```bash
npm run dev      # Start development server (http://localhost:5173)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run commit   # Make conventional commit
```

### Environment Requirements

- **Node.js**: 18+ (LTS recommended)
- **npm**: 8+ (comes with Node.js)
- **Browser**: Modern browser with ES2020 support

### Development Features

- **⚡ Hot Reload** - Instant updates during development
- **🔍 TypeScript** - Full type checking and IntelliSense
- **🎨 Live Styling** - TailwindCSS with instant style updates
- **📦 Component Dev** - Isolated component development
- **🚨 Error Overlay** - Clear error messages during development

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License - You are free to:
✅ Use commercially
✅ Modify and distribute
✅ Use privately
✅ Sublicense

❓ Include copyright notice and license
```

---

## 🙏 Acknowledgments

### Core Technologies

- **[Google Blockly](https://developers.google.com/blockly)** - Visual block programming framework
- **[React](https://react.dev/)** - UI library for building interfaces
- **[Vite](https://vite.dev/)** - Lightning-fast build tool
- **[TailwindCSS](https://tailwindcss.com/)** - Utility-first CSS framework

### Inspiration

- **GitHub Actions** - The workflow platform we're building for
- **Visual Programming** - Making complex concepts accessible
- **Developer Tools** - Improving the development experience

---

## 📞 Support & Community

### Getting Help

- **📚 Documentation**: Start with [User Guide](docs/USER_GUIDE.md)
- **🐛 Bug Reports**: Open issues on GitHub
- **💡 Feature Requests**: Share ideas through GitHub discussions
- **❓ Questions**: Check existing issues or create new ones

### Community

- **🌟 Star** this repository if you find it useful
- **🔗 Share** with developers who work with GitHub Actions
- **🤝 Contribute** to make Flowtastic even better
- **📢 Feedback** helps us improve the tool

### Project Status

- **🚀 Active Development** - Regular updates and improvements
- **✅ Production Ready** - Stable for creating real workflows
- **📈 Growing** - More features and templates being added
- **🤝 Community Driven** - Open to contributions and feedback

---

## 🗺️ Roadmap

### ✅ Completed (v1.0)

- Visual block-based workflow builder
- Real-time YAML/JSON preview
- Template library with common patterns
- YAML import functionality
- Comprehensive validation system
- Export in multiple formats

### 🔄 In Progress (v1.1)

- Enhanced template library
- Improved error messaging
- Performance optimizations
- Better mobile support

### 🎯 Planned (v2.0)

- **🔄 Reusable Workflows** - Support for workflow calls
- **🎨 Custom Actions** - Visual custom action builder
- **👥 Team Features** - Sharing and collaboration
- **🔌 Integrations** - Connect with CI/CD platforms
- **📊 Analytics** - Workflow performance insights

### 🌟 Future Vision

- **🧠 AI Assistance** - Smart workflow suggestions
- **🌐 Cloud Sync** - Cross-device workflow sync
- **📈 Workflow Marketplace** - Community template sharing
- **🔗 Platform Support** - Other CI/CD platforms beyond GitHub

---

**🎉 Start building amazing workflows today!**

**Built with ❤️ by the Flowtastic Team** • **[Get Started](docs/QUICKSTART.md)** • **[Documentation](docs/USER_GUIDE.md)**
