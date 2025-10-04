import { useState, useRef, useCallback, useEffect } from "react";
import * as Blockly from "blockly";
import { BlocklyEditor } from "./components/BlocklyEditor";
import { CodePreview } from "./components/CodePreview";
import { WorkflowControls } from "./components/WorkflowControls";
import { TemplateSelector } from "./components/TemplateSelector";
import { ValidationPanel } from "./components/ValidationPanel";
import { useToast } from "./hooks/useToast";
import { blocklyToWorkflow, type Workflow } from "./utils/blockToWorkflow";
import type { WorkflowTemplate } from "./templates/templateTypes";
import "./App.css";

const STORAGE_KEY = "flowtastic_workflow";

function App() {
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const [workflow, setWorkflow] = useState<Workflow>({
    name: "Untitled Workflow",
    version: "1.0.0",
    steps: [],
  });
  const [showTemplates, setShowTemplates] = useState(false);
  const { showToast } = useToast();

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
      showToast("Workflow saved successfully!", "success");
    }
  }, [showToast]);

  const handleLoad = useCallback(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && workspaceRef.current) {
      try {
        const state = JSON.parse(saved);
        Blockly.serialization.workspaces.load(state, workspaceRef.current);
        showToast("Workflow loaded successfully!", "success");
      } catch (error) {
        showToast("Error loading workflow: " + error, "error");
      }
    } else {
      showToast("No saved workflow found!", "warning");
    }
  }, [showToast]);

  const handleClear = useCallback(() => {
    if (
      workspaceRef.current &&
      confirm("Are you sure you want to clear the workspace?")
    ) {
      workspaceRef.current.clear();
    }
  }, []);

  const handleImportYaml = useCallback(() => {
    if (!workspaceRef.current) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".yml,.yaml";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const { importYamlToWorkspace } = await import("./utils/yamlImporter");
        const result = importYamlToWorkspace(text, workspaceRef.current!);

        if (result.success) {
          showToast("Workflow imported successfully!", "success");
        } else {
          showToast(`Import failed: ${result.error}`, "error");
        }
      } catch (error) {
        showToast("Error reading file: " + error, "error");
      }
    };
    input.click();
  }, [showToast]);

  const handleLoadTemplate = useCallback(
    (template: WorkflowTemplate) => {
      if (workspaceRef.current) {
        try {
          const dom = Blockly.utils.xml.textToDom(template.blocks);
          workspaceRef.current.clear();
          Blockly.Xml.domToWorkspace(dom, workspaceRef.current);
          setShowTemplates(false);
          showToast(`Template "${template.name}" loaded!`, "success");
        } catch (error) {
          console.error("Error loading template:", error);
          showToast("Error loading template: " + error, "error");
        }
      }
    },
    [showToast]
  );

  // Force app-wide dark mode (no toggle)
  useEffect(() => {
    try {
      document.documentElement.classList.add("dark");
    } catch (e) {
      console.debug("Could not set dark class", e);
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
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 p-4 shadow-2xl border-b border-blue-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl animate-pulse-slow">⚡</span>
              <h1 className="text-2xl font-bold tracking-tight">Flowtastic</h1>
            </div>
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm border border-white/30">
              Workflow Builder MVP
            </span>
            <div className="flex items-center gap-2 text-xs text-gray-200 bg-white/10 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Ready</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-100 flex items-center gap-2">
              <span className="hidden md:inline">🎨 Visual Builder</span>
              <span className="text-gray-300">•</span>
              <span className="hidden md:inline">📤 Multi-format Export</span>
              <span className="text-gray-300">•</span>
              <span>✓ GitHub Actions</span>
            </div>
          </div>
        </div>
      </header>

      {/* Controls */}
      <WorkflowControls
        workspace={workspaceRef.current}
        onSave={handleSave}
        onLoad={handleLoad}
        onClear={handleClear}
        onOpenTemplates={() => setShowTemplates(true)}
        onImportYaml={handleImportYaml}
      />

      {/* Template Selector Modal */}
      {showTemplates && (
        <TemplateSelector
          onSelectTemplate={handleLoadTemplate}
          onClose={() => setShowTemplates(false)}
        />
      )}

      {/* Main Content - Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Blockly Editor */}
        <div className="flex-1 border-r border-gray-700 flex flex-col">
          <div className="flex-1">
            <BlocklyEditor
              onWorkspaceChange={handleWorkspaceChange}
              workspaceRef={workspaceRef}
            />
          </div>
          <ValidationPanel workspace={workspaceRef.current} />
        </div>

        {/* Code Preview */}
        <div className="w-1/2 flex flex-col">
          <CodePreview workflow={workflow} workspace={workspaceRef.current!} />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 border-t border-gray-700 shadow-inner">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="font-semibold text-gray-300">
              Flowtastic v1.0.0
            </span>
            <span className="text-gray-600">|</span>
            <div className="flex items-center gap-2">
              <span>⚛️ React</span>
              <span>⚡ Vite</span>
              <span>🧩 Blockly</span>
              <span>🎨 Tailwind</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-1"
            >
              <span>📖</span>
              <span>Docs</span>
            </a>
            <span className="text-gray-600">•</span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-1"
            >
              <span>💬</span>
              <span>Feedback</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
