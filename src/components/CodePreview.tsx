import { useState } from "react";
import yaml from "js-yaml";
import type { Workflow } from "../utils/blockToWorkflow";

interface CodePreviewProps {
  workflow: Workflow;
}

type PreviewFormat = "yaml" | "json";

export const CodePreview: React.FC<CodePreviewProps> = ({ workflow }) => {
  const [format, setFormat] = useState<PreviewFormat>("yaml");

  const getPreviewContent = (): string => {
    try {
      if (format === "yaml") {
        return yaml.dump(workflow, { indent: 2 });
      } else {
        return JSON.stringify(workflow, null, 2);
      }
    } catch (error) {
      return `Error generating ${format.toUpperCase()}: ${error}`;
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getPreviewContent());
  };

  const downloadFile = () => {
    const content = getPreviewContent();
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `workflow.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-gray-100">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold">Workflow Preview</h2>
        <div className="flex gap-2">
          <div className="flex bg-gray-800 rounded-lg overflow-hidden">
            <button
              onClick={() => setFormat("yaml")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                format === "yaml"
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              YAML
            </button>
            <button
              onClick={() => setFormat("json")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                format === "json"
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              JSON
            </button>
          </div>
          <button
            onClick={copyToClipboard}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
            title="Copy to clipboard"
          >
            📋 Copy
          </button>
          <button
            onClick={downloadFile}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
            title="Download file"
          >
            💾 Download
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <pre className="p-4 text-sm font-mono">
          <code>{getPreviewContent()}</code>
        </pre>
      </div>
    </div>
  );
};
