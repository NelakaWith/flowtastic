# ⚡ Flowtastic - Workflow Builder MVP

A visual workflow builder application using **React + Vite + Blockly + TailwindCSS**.

## 🎯 Features

### Current MVP (v1.0.0)
- ✅ **Visual Block Editor**: Drag-and-drop workflow creation using Google Blockly
- ✅ **Custom Workflow Blocks**:
  - **Trigger**: Define workflow start events (Manual, Webhook, Schedule, Event)
  - **Action**: Execute tasks (API Call, Function, Email, Database)
  - **Condition**: Branch logic (If/Then/Else)
  - **End**: Workflow termination with status
- ✅ **Real-time Code Generation**: Live YAML and JSON export
- ✅ **Split View UI**: Blocks editor on left, code preview on right
- ✅ **Workflow Persistence**: Save/Load workflows using localStorage
- ✅ **Export**: Download workflows as YAML or JSON files
- ✅ **Editor Controls**: Undo, Redo, Zoom In/Out, Clear workspace

### 🚀 Planned Features
- [ ] Import YAML → Render as blocks
- [ ] React Flow integration for advanced node visualization
- [ ] Backend API (Node.js/Express or Nest.js)
- [ ] Database persistence
- [ ] Workflow execution engine
- [ ] Version control for workflows
- [ ] Collaborative editing

## 📁 Project Structure

```
flowtastic/
├── src/
│   ├── blocks/
│   │   ├── customBlocks.ts      # Custom Blockly block definitions
│   │   └── blocklyConfig.ts     # Blockly toolbox & workspace config
│   ├── components/
│   │   ├── BlocklyEditor.tsx    # Blockly workspace component
│   │   ├── CodePreview.tsx      # YAML/JSON preview panel
│   │   └── WorkflowControls.tsx # Toolbar controls
│   ├── utils/
│   │   └── blockToWorkflow.ts   # Convert blocks → workflow data
│   ├── App.tsx                  # Main application
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── docs/
│   └── workflow-builder.md      # Design documentation
├── package.json
└── README.md
```

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **UI Library**: TailwindCSS
- **Block Editor**: Google Blockly
- **Code Generation**: js-yaml
- **Development Tools**: 
  - ESLint for linting
  - Commitizen for conventional commits
  - Commitlint for commit message validation
  - Husky for git hooks

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/NelakaWith/flowtastic.git
cd flowtastic

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

## 📖 Usage

### Creating a Workflow

1. **Add a Trigger Block**: Drag a "Trigger" block from the toolbox to start your workflow
2. **Add Actions**: Connect action blocks to perform tasks
3. **Add Conditions**: Use condition blocks for branching logic
4. **End Workflow**: Add an "End" block to complete the workflow
5. **Configure Blocks**: Click on blocks to set their properties

### Saving & Loading

- **Save**: Click the 💾 Save button to store workflow in browser localStorage
- **Load**: Click the 📂 Load button to restore a saved workflow
- **Auto-save**: Workflows are automatically saved on page close

### Exporting

- Switch between **YAML** and **JSON** formats using the format toggle
- **Copy**: Click 📋 to copy the code to clipboard
- **Download**: Click 💾 to download as a file

## 🎨 Custom Block Types

### Trigger Block
Defines how the workflow starts:
- Manual: User-initiated
- Webhook: HTTP endpoint trigger
- Schedule: Cron-based timing
- Event: Event-driven trigger

### Action Block
Executes a specific task:
- API Call: Make HTTP requests
- Function: Execute custom code
- Email: Send notifications
- Database: Query/update data

### Condition Block
Branching logic with if/then/else paths

### End Block
Terminates workflow with status:
- Success
- Failure
- Cancelled

## 🧑‍💻 Development Guidelines

### Code Style
- Use **TypeScript** for type safety
- Prefer **functional components** with React Hooks
- Follow **modular architecture**
- Keep components **small and focused**

### Adding New Block Types

1. Define block in `src/blocks/customBlocks.ts`
2. Add to toolbox in `src/blocks/blocklyConfig.ts`
3. Add processing logic in `src/utils/blockToWorkflow.ts`

Example:

```typescript
// In customBlocks.ts
Blockly.Blocks['my_custom_block'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('My Block');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(180);
  }
};

// In blockToWorkflow.ts
case 'my_custom_block': {
  step.customField = block.getFieldValue('FIELD_NAME');
  break;
}
```

### Commit Messages

This project uses **Commitizen** and **Commitlint** for conventional commits:

```bash
npm run commit
```

Format: `type(scope): description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Example: `feat(blocks): add loop block for iterations`

## 📝 Workflow File Format

### YAML Example
```yaml
name: Example Workflow
version: 1.0.0
trigger:
  type: workflow_trigger
  triggerType: webhook
steps:
  - type: workflow_action
    actionType: api_call
    name: fetch_data
  - type: workflow_condition
    condition:
      type: workflow_simple_condition
      variable: status
      operator: eq
      value: success
    then:
      - type: workflow_action
        actionType: email
        name: send_notification
    else: []
  - type: workflow_end
    status: success
```

### JSON Example
```json
{
  "name": "Example Workflow",
  "version": "1.0.0",
  "trigger": {
    "type": "workflow_trigger",
    "triggerType": "webhook"
  },
  "steps": [
    {
      "type": "workflow_action",
      "actionType": "api_call",
      "name": "fetch_data"
    }
  ]
}
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `npm run commit`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google Blockly](https://developers.google.com/blockly) - Visual block programming
- [React](https://react.dev/) - UI framework
- [Vite](https://vite.dev/) - Build tool
- [TailwindCSS](https://tailwindcss.com/) - Styling

## 📞 Support

For questions or issues, please open an issue on GitHub.

---

**Built with ❤️ by the Flowtastic Team**
