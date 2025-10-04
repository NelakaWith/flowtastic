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
    <div className="border-t border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900 shadow-inner">
      {/* Status Bar */}
      <button
        className="w-full flex items-center justify-between p-4 hover:bg-gray-750/50 transition-all duration-200 group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-3 h-3 rounded-full ${statusColor} shadow-lg animate-pulse`}
          />
          <div className="flex items-center gap-3">
            <span className="font-semibold text-white text-sm">
              {result.valid
                ? totalIssues === 0
                  ? "✓ No Issues"
                  : `⚠ ${result.warnings.length} Warning${
                      result.warnings.length !== 1 ? "s" : ""
                    }`
                : `✗ ${result.errors.length} Error${
                    result.errors.length !== 1 ? "s" : ""
                  }`}
            </span>
            {result.warnings.length > 0 && result.errors.length > 0 && (
              <span className="text-gray-400 text-xs">
                + {result.warnings.length} Warning
                {result.warnings.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          {result.valid && totalIssues === 0 && (
            <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded-full border border-green-700/50">
              Ready to export
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">
            {isExpanded ? "Click to collapse" : "Click to expand"}
          </span>
          <span className="text-gray-400 text-sm group-hover:text-white transition-colors">
            {isExpanded ? "▼" : "▶"}
          </span>
        </div>
      </button>

      {/* Expanded Panel */}
      {isExpanded && totalIssues > 0 && (
        <div className="max-h-64 overflow-y-auto border-t border-gray-700 bg-gray-900/50 animate-fade-in">
          {/* Errors */}
          {result.errors.length > 0 && (
            <div className="p-3 bg-red-900/10 border-b border-red-900/20">
              <h4 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">
                Errors ({result.errors.length})
              </h4>
            </div>
          )}
          {result.errors.map((error, idx) => (
            <div
              key={`error-${idx}`}
              className="p-4 border-b border-gray-700 hover:bg-red-900/10 cursor-pointer transition-all duration-150 group"
              onClick={() => handleErrorClick(error)}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-900/30 flex items-center justify-center group-hover:bg-red-900/50 transition-colors">
                  <span className="text-red-400 font-bold text-sm">✗</span>
                </div>
                <div className="flex-1">
                  <p className="text-red-300 text-sm font-medium">
                    {error.message}
                  </p>
                  {error.field && (
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs text-gray-500">Field:</span>
                      <span className="text-xs text-red-400 font-mono bg-red-900/20 px-2 py-0.5 rounded">
                        {error.field}
                      </span>
                    </div>
                  )}
                </div>
                <span className="text-gray-600 group-hover:text-gray-400 text-sm">
                  →
                </span>
              </div>
            </div>
          ))}

          {/* Warnings */}
          {result.warnings.length > 0 && (
            <div className="p-3 bg-yellow-900/10 border-b border-yellow-900/20">
              <h4 className="text-xs font-semibold text-yellow-400 uppercase tracking-wider mb-2">
                Warnings ({result.warnings.length})
              </h4>
            </div>
          )}
          {result.warnings.map((warning, idx) => (
            <div
              key={`warning-${idx}`}
              className="p-4 border-b border-gray-700 hover:bg-yellow-900/10 cursor-pointer transition-all duration-150 group"
              onClick={() => handleErrorClick(warning)}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-900/30 flex items-center justify-center group-hover:bg-yellow-900/50 transition-colors">
                  <span className="text-yellow-400 font-bold text-sm">⚠</span>
                </div>
                <div className="flex-1">
                  <p className="text-yellow-300 text-sm font-medium">
                    {warning.message}
                  </p>
                  {warning.field && (
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs text-gray-500">Field:</span>
                      <span className="text-xs text-yellow-400 font-mono bg-yellow-900/20 px-2 py-0.5 rounded">
                        {warning.field}
                      </span>
                    </div>
                  )}
                </div>
                <span className="text-gray-600 group-hover:text-gray-400 text-sm">
                  →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Issues Message */}
      {isExpanded && totalIssues === 0 && (
        <div className="p-8 text-center bg-gradient-to-br from-green-900/20 to-blue-900/20 border-t border-gray-700 animate-fade-in">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-900/30 flex items-center justify-center">
              <span className="text-2xl">✓</span>
            </div>
            <div>
              <p className="text-green-400 font-semibold mb-1">
                All validations passed!
              </p>
              <p className="text-gray-400 text-sm">
                Your workflow is ready to export.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
