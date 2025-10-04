# 🚀 Quick Start Guide

Get up and running with Flowtastic in 5 minutes!

## Prerequisites

- Node.js 18 or higher
- npm or yarn

## Installation

```bash
# 1. Navigate to the project directory
cd flowtastic

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will open at `http://localhost:5173`

## Your First Workflow

### Step 1: Add a Trigger

1. Open the **Workflow** category in the toolbox (left sidebar)
2. Drag the **Trigger** block to the workspace
3. Click on the dropdown to select trigger type (e.g., "webhook")

### Step 2: Add an Action

1. Drag an **Action** block below the trigger
2. The blocks will snap together automatically
3. Configure the action:
   - Select action type (e.g., "api_call")
   - Enter a name (e.g., "fetch_data")

### Step 3: Add a Condition (Optional)

1. Drag a **Condition** block below your action
2. From the **Parameters** category, drag a **Simple Condition** into the "If" slot
3. Configure the condition (variable, operator, value)
4. Add actions to the "Then" and "Else" branches

### Step 4: End the Workflow

1. Drag an **End** block to complete your workflow
2. Select the end status (success/failure/cancelled)

### Step 5: View the Output

Look at the right panel to see your workflow as YAML or JSON in real-time!

## Basic Controls

### Toolbar Buttons

- **💾 Save**: Save workflow to browser storage
- **📂 Load**: Load saved workflow
- **🗑️ Clear**: Clear the workspace
- **↶**: Undo last change
- **↷**: Redo
- **🔍+**: Zoom in
- **🔍-**: Zoom out
- **⊙**: Reset zoom

### Preview Panel

- Toggle between **YAML** and **JSON** formats
- **📋 Copy**: Copy code to clipboard
- **💾 Download**: Download as file

## Example: Simple Webhook Handler

Here's a quick example you can build:

1. **Trigger**: Webhook
2. **Action**: API Call named "process_request"
3. **Condition**: Check if response is successful
   - **Then**: Action: Email "send_success_notification"
   - **Else**: Action: Function "log_error"
4. **End**: Success

### Expected YAML Output:

```yaml
name: Untitled Workflow
version: 1.0.0
trigger:
  type: workflow_trigger
  triggerType: webhook
steps:
  - type: workflow_action
    actionType: api_call
    name: process_request
  - type: workflow_condition
    condition:
      type: workflow_simple_condition
      variable: status
      operator: eq
      value: "200"
    then:
      - type: workflow_action
        actionType: email
        name: send_success_notification
    else:
      - type: workflow_action
        actionType: function
        name: log_error
  - type: workflow_end
    status: success
```

## Tips for Success

✅ **Always start with a Trigger** - It's the entry point of every workflow

✅ **Name your actions** - Use descriptive names for clarity

✅ **Save frequently** - Click the Save button to persist your work

✅ **Experiment** - Try different block combinations

✅ **Check the preview** - Monitor the YAML/JSON output as you build

✅ **Use parameters** - Add parameter blocks to configure actions

## Keyboard Shortcuts

- **Ctrl+Z** / **Cmd+Z**: Undo
- **Ctrl+Y** / **Cmd+Y**: Redo
- **Delete**: Remove selected block
- **Ctrl+C** / **Cmd+C**: Copy selected block
- **Ctrl+V** / **Cmd+V**: Paste block

## Troubleshooting

### Blocks won't connect?

- Make sure you're connecting compatible types
- Triggers go at the top, actions/conditions in the middle, end at the bottom

### Preview not updating?

- The preview updates automatically on workspace changes
- Try adding or moving a block to trigger an update

### Can't find a block?

- Check the category tabs in the toolbox
- Workflow blocks are in the "Workflow" category
- Helper blocks are in "Parameters" and "Logic"

### Lost your work?

- Check if auto-save created a backup: it's in localStorage
- Open browser DevTools → Application → Local Storage → look for `flowtastic_workflow_autosave`

## Next Steps

1. **Explore Examples**: Check `docs/examples.md` for more workflow patterns
2. **Read the Docs**: See `README.md` for comprehensive documentation
3. **Customize Blocks**: Learn how to add your own block types
4. **Share**: Export your workflows and share them with others

## Need Help?

- 📚 [Full Documentation](../README.md)
- 💡 [Example Workflows](examples.md)
- 🔧 [Implementation Details](implementation-summary.md)

---

**Happy workflow building! 🎉**
