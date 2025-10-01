import { useState, useRef, useCallback, useEffect } from "react";
import * as Blockly from "blockly";
import { BlocklyEditor } from "./components/BlocklyEditor";
import { CodePreview } from "./components/CodePreview";
import { WorkflowControls } from "./components/WorkflowControls";
import { blocklyToWorkflow, type Workflow } from "./utils/blockToWorkflow";
import "./App.css";

const STORAGE_KEY = "flowtastic_workflow";

function App() {
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const [workflow, setWorkflow] = useState<Workflow>({
    name: "Untitled Workflow",
    version: "1.0.0",
    steps: [],
  });

  const handleWorkspaceChange = useCallback(
    (workspace: Blockly.WorkspaceSvg) => {
      const newWorkflow = blocklyToWorkflow(workspace);
      setWorkflow(newWorkflow);
    },
    []
  );

  const handleSave = useCallback(() => {
    if (workspaceRef.current) {
      const state = Blockly.serialization.workspaces.save(workspaceRef.current);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      alert("Workflow saved successfully!");
    }
  }, []);

  const handleLoad = useCallback(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && workspaceRef.current) {
      try {
        const state = JSON.parse(saved);
        Blockly.serialization.workspaces.load(state, workspaceRef.current);
        alert("Workflow loaded successfully!");
      } catch (error) {
        alert("Error loading workflow: " + error);
      }
    } else {
      alert("No saved workflow found!");
    }
  }, []);

  const handleClear = useCallback(() => {
    if (
      workspaceRef.current &&
      confirm("Are you sure you want to clear the workspace?")
    ) {
      workspaceRef.current.clear();
    }
  }, []);

  // Auto-save on unmount
  useEffect(() => {
    const workspace = workspaceRef.current;
    return () => {
      if (workspace) {
        const state = Blockly.serialization.workspaces.save(workspace);
        localStorage.setItem(STORAGE_KEY + "_autosave", JSON.stringify(state));
      }
    };
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-900 text-white overflow-hidden">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">⚡ Flowtastic</h1>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
              Workflow Builder MVP
            </span>
          </div>
          <div className="text-sm text-gray-200">
            Build workflows visually • Export to YAML/JSON
          </div>
        </div>
      </header>

      {/* Controls */}
      <WorkflowControls
        workspace={workspaceRef.current}
        onSave={handleSave}
        onLoad={handleLoad}
        onClear={handleClear}
      />

      {/* Main Content - Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Blockly Editor */}
        <div className="flex-1 border-r border-gray-700">
          <BlocklyEditor
            onWorkspaceChange={handleWorkspaceChange}
            workspaceRef={workspaceRef}
          />
        </div>

        {/* Code Preview */}
        <div className="w-1/2 flex flex-col">
          <CodePreview workflow={workflow} />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 p-2 text-center text-xs text-gray-400 border-t border-gray-700">
        Flowtastic v1.0.0 | Built with React + Vite + Blockly + TailwindCSS
      </footer>
    </div>
  );
}

export default App;
