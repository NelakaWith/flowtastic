import * as Blockly from "blockly";
import { Button } from "./Button";

interface WorkflowControlsProps {
  workspace: Blockly.WorkspaceSvg | null;
  onSave: () => void;
  onLoad: () => void;
  onClear: () => void;
  onOpenTemplates: () => void;
  onImportYaml: () => void;
}

export const WorkflowControls: React.FC<WorkflowControlsProps> = ({
  workspace,
  onSave,
  onLoad,
  onClear,
  onOpenTemplates,
  onImportYaml,
}) => {
  const blockCount = workspace?.getAllBlocks(false).length || 0;

  const handleUndo = () => {
    if (workspace) {
      workspace.undo(false);
    }
  };

  const handleRedo = () => {
    if (workspace) {
      workspace.undo(true);
    }
  };

  const handleZoomIn = () => {
    if (workspace) {
      workspace.zoomCenter(1.2);
    }
  };

  const handleZoomOut = () => {
    if (workspace) {
      workspace.zoomCenter(-1.2);
    }
  };

  const handleZoomReset = () => {
    if (workspace) {
      workspace.setScale(1);
      workspace.scrollCenter();
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="flex gap-2 border-r border-gray-600 pr-3">
          <Button
            onClick={onOpenTemplates}
            variant="primary"
            title="Load pre-built templates"
          >
            📋 Templates
          </Button>
          <Button
            onClick={onImportYaml}
            variant="success"
            title="Import existing YAML workflow"
          >
            📥 Import
          </Button>
        </div>

        <div className="flex gap-2 border-r border-gray-600 pr-3">
          <Button
            onClick={onSave}
            variant="primary"
            title="Save to browser storage"
          >
            💾 Save
          </Button>
          <Button
            onClick={onLoad}
            variant="success"
            title="Load from browser storage"
          >
            📂 Load
          </Button>
          <Button
            onClick={onClear}
            variant="danger"
            title="Clear entire workspace"
          >
            🗑️ Clear
          </Button>
        </div>

        <div className="flex gap-2 border-r border-gray-600 pr-3">
          <Button onClick={handleUndo} variant="ghost" title="Undo (Ctrl+Z)">
            ↶ Undo
          </Button>
          <Button
            onClick={handleRedo}
            variant="ghost"
            title="Redo (Ctrl+Shift+Z)"
          >
            ↷ Redo
          </Button>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleZoomIn} variant="ghost" title="Zoom In">
            🔍+
          </Button>
          <Button onClick={handleZoomOut} variant="ghost" title="Zoom Out">
            🔍-
          </Button>
          <Button
            onClick={handleZoomReset}
            variant="ghost"
            title="Reset Zoom (100%)"
          >
            ⊙
          </Button>
        </div>
      </div>

      {/* Workspace Stats */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2 text-gray-400">
          <span className="text-xs">Blocks:</span>
          <span className="font-mono font-bold text-white bg-gray-700 px-2 py-1 rounded">
            {blockCount}
          </span>
        </div>
      </div>
    </div>
  );
};
