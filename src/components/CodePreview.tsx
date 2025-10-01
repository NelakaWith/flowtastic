import { useState, useMemo } from "react";
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

interface GeneratedFormats {
  yaml: string;
  json: string;
  "github-actions": string;
  "github-blocks": string;
}

export const CodePreview: React.FC<CodePreviewProps> = ({
  workflow,
  workspace,
}) => {
  const [format, setFormat] = useState<PreviewFormat>("yaml");

  // Generate all formats when workflow or workspace changes
  const generatedFormats = useMemo<GeneratedFormats>(() => {
    const formats: GeneratedFormats = {
      yaml: "",
      json: "",
      "github-actions": "",
      "github-blocks": "",
    };

    try {
      // Custom YAML format
      formats.yaml = yaml.dump(workflow, { indent: 2 });
    } catch (error) {
      formats.yaml = `Error generating YAML: ${error}`;
    }

    try {
      // JSON format
      formats.json = JSON.stringify(workflow, null, 2);
    } catch (error) {
      formats.json = `Error generating JSON: ${error}`;
    }

    try {
      // GitHub Actions (Converted) format
      const githubWorkflow = workflowToGitHubActions(workflow);
      formats["github-actions"] = yaml.dump(githubWorkflow, {
        indent: 2,
        lineWidth: -1,
        styles: {
          "!!str": "literal",
        },
      });
    } catch (error) {
      formats[
        "github-actions"
      ] = `Error generating GitHub Actions (Converted): ${error}`;
    }

    try {
      // GitHub Actions (Native) format
      const githubWorkflow = githubActionsBlocksToWorkflow(workspace);
      formats["github-blocks"] = yaml.dump(githubWorkflow, {
        indent: 2,
        lineWidth: -1,
        flowLevel: -1,
      });
    } catch (error) {
      formats[
        "github-blocks"
      ] = `Error generating GitHub Actions (Native): ${error}`;
    }

    return formats;
  }, [workflow, workspace]);

  const getPreviewContent = (): string => {
    return generatedFormats[format];
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
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">Workflow Preview</h2>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-400">All formats generated</span>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-gray-800 rounded-lg overflow-hidden">
            <Button
              onClick={() => setFormat("yaml")}
              variant={format === "yaml" ? "primary" : "ghost"}
              title="Custom workflow format"
            >
              YAML
            </Button>
            <Button
              onClick={() => setFormat("json")}
              variant={format === "json" ? "primary" : "ghost"}
              title="Custom workflow format as JSON"
            >
              JSON
            </Button>
            <Button
              onClick={() => setFormat("github-actions")}
              variant={format === "github-actions" ? "primary" : "ghost"}
              title="Converted from generic blocks to GitHub Actions"
            >
              GitHub (Converted)
            </Button>
            <Button
              onClick={() => setFormat("github-blocks")}
              variant={format === "github-blocks" ? "primary" : "ghost"}
              title="Built with GitHub Actions specific blocks"
            >
              GitHub (Native)
            </Button>
          </div>
          <div className="border-l border-gray-700 pl-2 flex gap-2">
            <Button
              onClick={copyToClipboard}
              variant="ghost"
              title="Copy current format to clipboard"
            >
              📋 Copy
            </Button>
            <Button
              onClick={downloadFile}
              variant="ghost"
              title="Download current format as file"
            >
              💾 Download
            </Button>
          </div>
        </div>
      </div>

      {/* Format Status Bar */}
      <div className="px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="text-gray-400">Currently viewing:</span>
            <span className="font-semibold text-white">
              {format === "yaml" && "Custom YAML"}
              {format === "json" && "Custom JSON"}
              {format === "github-actions" && "GitHub Actions (Converted)"}
              {format === "github-blocks" && "GitHub Actions (Native)"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <span>✅ YAML</span>
            <span>✅ JSON</span>
            <span>✅ GitHub (Converted)</span>
            <span>✅ GitHub (Native)</span>
          </div>
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
