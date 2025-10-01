import * as Blockly from "blockly";

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
        <button
          onClick={onSave}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          💾 Save
        </button>
        <button
          onClick={onLoad}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          📂 Load
        </button>
        <button
          onClick={onClear}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          🗑️ Clear
        </button>
      </div>

      <div className="flex gap-2 border-r border-gray-700 pr-2">
        <button
          onClick={handleUndo}
          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
          title="Undo"
        >
          ↶
        </button>
        <button
          onClick={handleRedo}
          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
          title="Redo"
        >
          ↷
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleZoomIn}
          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
          title="Zoom In"
        >
          🔍+
        </button>
        <button
          onClick={handleZoomOut}
          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
          title="Zoom Out"
        >
          🔍-
        </button>
        <button
          onClick={handleZoomReset}
          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
          title="Reset Zoom"
        >
          ⊙
        </button>
      </div>
    </div>
  );
};
