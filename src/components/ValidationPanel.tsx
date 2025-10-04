import { useEffect, useState } from "react";
import * as Blockly from "blockly";
import {
  validateWorkspace,
  type ValidationResult,
  type ValidationError,
} from "../utils/validator";

interface ValidationPanelProps {
  workspace: Blockly.WorkspaceSvg | null;
}

export function ValidationPanel({ workspace }: ValidationPanelProps) {
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!workspace) return;

    const validate = () => {
      const validationResult = validateWorkspace(workspace);
      setResult(validationResult);
    };

    // Validate on mount
    validate();

    // Re-validate on workspace changes
    workspace.addChangeListener(validate);

    return () => {
      workspace.removeChangeListener(validate);
    };
  }, [workspace]);

  if (!result) return null;

  const totalIssues = result.errors.length + result.warnings.length;
  const statusColor = result.valid
    ? result.warnings.length > 0
      ? "bg-yellow-600"
      : "bg-green-600"
    : "bg-red-600";

  const handleErrorClick = (error: ValidationError) => {
    if (workspace && error.blockId) {
      const block = workspace.getBlockById(error.blockId);
      if (block) {
        workspace.centerOnBlock(block.id);
        block.select();
      }
    }
  };

  return (
    <div className="border-t border-gray-700 bg-gray-800">
      {/* Status Bar */}
      <button
        className="w-full flex items-center justify-between p-3 hover:bg-gray-750 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${statusColor}`} />
          <span className="font-medium text-white">
            {result.valid
              ? totalIssues === 0
                ? "✓ No Issues"
                : `⚠ ${result.warnings.length} Warning${
                    result.warnings.length !== 1 ? "s" : ""
                  }`
              : `✗ ${result.errors.length} Error${
                  result.errors.length !== 1 ? "s" : ""
                }`}
            {result.warnings.length > 0 &&
              result.errors.length > 0 &&
              ` • ${result.warnings.length} Warning${
                result.warnings.length !== 1 ? "s" : ""
              }`}
          </span>
        </div>
        <span className="text-gray-400 text-sm">{isExpanded ? "▼" : "▶"}</span>
      </button>

      {/* Expanded Panel */}
      {isExpanded && totalIssues > 0 && (
        <div className="max-h-48 overflow-y-auto border-t border-gray-700">
          {/* Errors */}
          {result.errors.map((error, idx) => (
            <div
              key={`error-${idx}`}
              className="p-3 border-b border-gray-700 hover:bg-gray-750 cursor-pointer transition-colors"
              onClick={() => handleErrorClick(error)}
            >
              <div className="flex items-start gap-2">
                <span className="text-red-500 font-bold text-sm">✗</span>
                <div className="flex-1">
                  <p className="text-red-400 text-sm">{error.message}</p>
                  {error.field && (
                    <p className="text-gray-500 text-xs mt-1">
                      Field: {error.field}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Warnings */}
          {result.warnings.map((warning, idx) => (
            <div
              key={`warning-${idx}`}
              className="p-3 border-b border-gray-700 hover:bg-gray-750 cursor-pointer transition-colors"
              onClick={() => handleErrorClick(warning)}
            >
              <div className="flex items-start gap-2">
                <span className="text-yellow-500 font-bold text-sm">⚠</span>
                <div className="flex-1">
                  <p className="text-yellow-400 text-sm">{warning.message}</p>
                  {warning.field && (
                    <p className="text-gray-500 text-xs mt-1">
                      Field: {warning.field}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Issues Message */}
      {isExpanded && totalIssues === 0 && (
        <div className="p-4 text-center text-gray-400 text-sm">
          All validations passed! Your workflow is ready to export.
        </div>
      )}
    </div>
  );
}
