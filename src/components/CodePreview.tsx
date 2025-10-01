import { useState } from "react";
import yaml from "js-yaml";
import * as Blockly from "blockly";
import type { Workflow } from "../utils/blockToWorkflow";
import { workflowToGitHubActions } from "../utils/githubActionsConverter";
import { githubActionsBlocksToWorkflow } from "../utils/githubActionsBlocksConverter";
import { Button } from "./Button";

interface CodePreviewProps {
  workflow: Workflow;
  workspace: Blockly.WorkspaceSvg;
}

type PreviewFormat = "yaml" | "json" | "github-actions" | "github-blocks";

export const CodePreview: React.FC<CodePreviewProps> = ({
  workflow,
  workspace,
}) => {
  const [format, setFormat] = useState<PreviewFormat>("yaml");

  const getPreviewContent = (): string => {
    try {
      if (format === "github-actions") {
        const githubWorkflow = workflowToGitHubActions(workflow);
        return yaml.dump(githubWorkflow, {
          indent: 2,
          lineWidth: -1,
          styles: {
            "!!str": "literal",
          },
        });
      } else if (format === "github-blocks") {
        const githubWorkflow = githubActionsBlocksToWorkflow(workspace);

        return yaml.dump(githubWorkflow, {
          indent: 2,
          lineWidth: -1,
          flowLevel: -1,
        });
      } else if (format === "yaml") {
        return yaml.dump(workflow, { indent: 2 });
      } else {
        return JSON.stringify(workflow, null, 2);
      }
    } catch (error) {
      return `Error generating ${format.toUpperCase()}: ${error}`;
    }
  };

  const getFileName = (): string => {
    if (format === "github-actions" || format === "github-blocks") {
      return "workflow.yml";
    } else if (format === "yaml") {
      return "workflow.yaml";
    } else {
      return "workflow.json";
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
    a.download = getFileName();
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
            <Button
              onClick={() => setFormat("yaml")}
              variant={format === "yaml" ? "primary" : "ghost"}
            >
              YAML
            </Button>
            <Button
              onClick={() => setFormat("json")}
              variant={format === "json" ? "primary" : "ghost"}
            >
              JSON
            </Button>
            <Button
              onClick={() => setFormat("github-actions")}
              variant={format === "github-actions" ? "primary" : "ghost"}
            >
              GitHub (Converted)
            </Button>
            <Button
              onClick={() => setFormat("github-blocks")}
              variant={format === "github-blocks" ? "primary" : "ghost"}
            >
              GitHub (Native)
            </Button>
          </div>
          <Button
            onClick={copyToClipboard}
            variant="ghost"
            title="Copy to clipboard"
          >
            📋 Copy
          </Button>
          <Button onClick={downloadFile} variant="ghost" title="Download file">
            💾 Download
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <pre className="p-4 text-sm font-mono">
          <code>{getPreviewContent()}</code>
        </pre>
      </div>
      {(format === "github-actions" || format === "github-blocks") && (
        <div className="p-4 border-t border-gray-700 bg-gray-800">
          <div className="text-sm text-gray-300">
            <p className="font-semibold mb-2">💡 GitHub Actions Workflow</p>
            {format === "github-actions" && (
              <p className="mb-2">
                <span className="bg-blue-900 text-blue-200 px-2 py-1 rounded text-xs">
                  CONVERTED
                </span>{" "}
                Generated from generic workflow blocks
              </p>
            )}
            {format === "github-blocks" && (
              <p className="mb-2">
                <span className="bg-green-900 text-green-200 px-2 py-1 rounded text-xs">
                  NATIVE
                </span>{" "}
                Built with GitHub Actions blocks
              </p>
            )}
            <p>
              Save this as{" "}
              <code className="bg-gray-700 px-1 rounded">
                .github/workflows/{getFileName()}
              </code>{" "}
              in your repository.
            </p>
            <p className="mt-1">
              Configure required secrets in your repository settings for actions
              that need them.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
