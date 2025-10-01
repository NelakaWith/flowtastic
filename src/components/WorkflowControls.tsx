import * as Blockly from "blockly";
import { Button } from "./Button";

interface WorkflowControlsProps {
  workspace: Blockly.WorkspaceSvg | null;
  onSave: () => void;
  onLoad: () => void;
  onClear: () => void;
}

export const WorkflowControls: React.FC<WorkflowControlsProps> = ({
  workspace,
  onSave,
  onLoad,
  onClear,
}) => {
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
    <div className="flex items-center gap-2 p-4 bg-gray-800 border-b border-gray-700">
      <div className="flex gap-2 border-r border-gray-700 pr-2">
        <Button onClick={onSave} variant="primary">
          💾 Save
        </Button>
        <Button onClick={onLoad} variant="success">
          📂 Load
        </Button>
        <Button onClick={onClear} variant="danger">
          🗑️ Clear
        </Button>
      </div>

      <div className="flex gap-2 border-r border-gray-700 pr-2">
        <Button onClick={handleUndo} variant="ghost" title="Undo">
          ↶
        </Button>
        <Button onClick={handleRedo} variant="ghost" title="Redo">
          ↷
        </Button>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleZoomIn} variant="ghost" title="Zoom In">
          🔍+
        </Button>
        <Button onClick={handleZoomOut} variant="ghost" title="Zoom Out">
          🔍-
        </Button>
        <Button onClick={handleZoomReset} variant="ghost" title="Reset Zoom">
          ⊙
        </Button>
      </div>
    </div>
  );
};
