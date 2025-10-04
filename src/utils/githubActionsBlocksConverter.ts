import * as Blockly from "blockly";

/**
 * Minimal shape for a converted GitHub Actions workflow structure. This mirrors
 * the shape produced by the converter and the one ultimately serialized to YAML.
 */
export interface GitHubActionsWorkflowDirect {
  name?: string;
  permissions?: Record<string, string>;
  on?: Record<string, unknown>;
  jobs?: Record<string, JobDef>;
  env?: Record<string, string>;
}

/**
 * A single step inside a job.
 */
export interface JobStep {
  name: string;
  uses?: string;
  run?: string;
  shell?: string;
  "working-directory"?: string;
  with?: Record<string, unknown>;
  env?: Record<string, string>;
  if?: string;
  "continue-on-error"?: boolean;
}

/**
 * Job definition shape used in the workflow `jobs` map.
 */
export interface JobDef {
  "runs-on": string;
  needs?: string[];
  permissions?: Record<string, string>;
  strategy?: { matrix: Record<string, string[]> };
  env?: Record<string, string>;
  steps: JobStep[];
}

/**
 * Internal representation returned from processing an individual block.
 */
interface ProcessedBlock {
  type: string;
  value?: unknown;
  name?: string;
}

/**
 * Convert a GitHub Actions-specific Blockly block into a structured object.
 * Returns `null` for disabled or unsupported blocks. This function focuses on
 * extracting fields and iterating connected sub-blocks (e.g. steps).
 */
const processGitHubActionsBlock = (
  block: Blockly.Block
): ProcessedBlock | null => {
  if (!block || !block.isEnabled()) return null;

  const type = block.type;

  switch (type) {
    case "gha_workflow_name":
      return { type: "name", value: block.getFieldValue("NAME") };

    case "gha_permissions": {
      const permissions: Record<string, string> = {};
      const contents = block.getFieldValue("CONTENTS");
      const deployments = block.getFieldValue("DEPLOYMENTS");
      const actions = block.getFieldValue("ACTIONS");
      if (contents !== "none") permissions.contents = contents;
      if (deployments !== "none") permissions.deployments = deployments;
      if (actions !== "none") permissions.actions = actions;
      return { type: "permissions", value: permissions };
    }

    case "gha_trigger": {
      const triggerType = block.getFieldValue("TRIGGER_TYPE");
      const configBlock = block.getInputTargetBlock("CONFIG");
      const trigger: Record<string, unknown> = {};
      if (configBlock) {
        const config = processGitHubActionsBlock(configBlock);
        if (config) trigger[triggerType] = config.value;
      } else {
        trigger[triggerType] = {};
      }
      return { type: "trigger", value: trigger };
    }

    case "gha_push_config": {
      const branches = block.getFieldValue("BRANCHES");
      const paths = block.getFieldValue("PATHS");
      const pushConfig: Record<string, string[]> = {};
      if (branches.trim())
        pushConfig.branches = branches.split(",").map((s: string) => s.trim());
      if (paths.trim())
        pushConfig.paths = paths.split(",").map((s: string) => s.trim());
      return {
        type: "push_config",
        value: Object.keys(pushConfig).length ? pushConfig : {},
      };
    }

    case "gha_schedule_config":
      return {
        type: "schedule_config",
        value: [{ cron: block.getFieldValue("CRON") }],
      };

    case "gha_pull_request_config": {
      const types = block.getFieldValue("TYPES");
      const branches = block.getFieldValue("BRANCHES");
      const paths = block.getFieldValue("PATHS");
      const prConfig: Record<string, string[]> = {};
      if (types.trim())
        prConfig.types = types.split(",").map((s: string) => s.trim());
      if (branches.trim())
        prConfig.branches = branches.split(",").map((s: string) => s.trim());
      if (paths.trim())
        prConfig.paths = paths.split(",").map((s: string) => s.trim());
      return {
        type: "pull_request_config",
        value: Object.keys(prConfig).length ? prConfig : {},
      };
    }

    case "gha_workflow_dispatch_config": {
      const inputName = block.getFieldValue("INPUT_NAME");
      const description = block.getFieldValue("DESCRIPTION");
      const inputType = block.getFieldValue("INPUT_TYPE");
      const defaultValue = block.getFieldValue("DEFAULT");
      const required = block.getFieldValue("REQUIRED") === "true";
      const options = block.getFieldValue("OPTIONS");
      const input: Record<string, unknown> = {
        description,
        required,
        type: inputType,
      };
      if (defaultValue.trim()) input.default = defaultValue;
      if (inputType === "choice" && options.trim())
        input.options = options.split(",").map((s: string) => s.trim());
      return {
        type: "workflow_dispatch_config",
        value: { inputs: { [inputName]: input } },
      };
    }

    case "gha_release_config":
      return {
        type: "release_config",
        value: { types: [block.getFieldValue("TYPES")] },
      };

    case "gha_issues_config":
      return {
        type: "issues_config",
        value: {
          types: block
            .getFieldValue("TYPES")
            .split(",")
            .map((s: string) => s.trim()),
        },
      };

    case "gha_repository_dispatch_config":
      return {
        type: "repository_dispatch_config",
        value: {
          types: block
            .getFieldValue("TYPES")
            .split(",")
            .map((s: string) => s.trim()),
        },
      };

    case "gha_workflow_call_config": {
      const inputName = block.getFieldValue("INPUT_NAME");
      const inputType = block.getFieldValue("INPUT_TYPE");
      const required = block.getFieldValue("REQUIRED") === "true";
      return {
        type: "workflow_call_config",
        value: { inputs: { [inputName]: { type: inputType, required } } },
      };
    }

    case "gha_job": {
      const jobName = block.getFieldValue("JOB_NAME");
      const runsOn = block.getFieldValue("RUNS_ON");
      const needsValue = block.getFieldValue("NEEDS");
      let needs: string[] | undefined;
      let permissions: Record<string, string> | undefined;
      let strategy: { matrix: Record<string, string[]> } | undefined;
      let env: Record<string, string> | undefined;
      const steps: Array<Record<string, unknown>> = [];
      if (needsValue && needsValue.trim())
        needs = needsValue
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean);
      const permissionsBlock = block.getInputTargetBlock("PERMISSIONS");
      if (permissionsBlock) {
        const p = processGitHubActionsBlock(permissionsBlock);
        if (p && p.type === "job_permissions")
          permissions = p.value as Record<string, string>;
      }
      const stepsInput = block.getInput("STEPS");
      if (stepsInput && stepsInput.connection) {
        let stepBlock = stepsInput.connection.targetBlock();
        while (stepBlock) {
          const s = processGitHubActionsBlock(stepBlock);
          if (s) {
            if (s.type === "strategy_matrix")
              strategy = s.value as { matrix: Record<string, string[]> };
            else if (s.type === "env_vars")
              env = s.value as Record<string, string>;
            else if (s.type === "step")
              steps.push(s.value as Record<string, unknown>);
          }
          stepBlock = stepBlock.getNextBlock();
        }
      }
      const job: Record<string, unknown> = { "runs-on": runsOn };
      if (needs && needs.length) job.needs = needs;
      if (permissions) job.permissions = permissions;
      if (strategy) job.strategy = strategy;
      if (env) job.env = env;
      job.steps = steps;
      return { type: "job", name: jobName, value: job };
    }

    case "gha_job_permissions": {
      const jobPerms: Record<string, string> = {};
      const jobContents = block.getFieldValue("CONTENTS");
      const jobDeployments = block.getFieldValue("DEPLOYMENTS");
      if (jobContents !== "none") jobPerms.contents = jobContents;
      if (jobDeployments !== "none") jobPerms.deployments = jobDeployments;
      return { type: "job_permissions", value: jobPerms };
    }

    case "gha_step_uses": {
      const stepName = block.getFieldValue("STEP_NAME");
      const uses = block.getFieldValue("USES");
      const withBlock = block.getInputTargetBlock("WITH");
      const step: Record<string, unknown> = { name: stepName, uses };
      if (withBlock) {
        const w = processGitHubActionsBlock(withBlock);
        if (w && w.value) step.with = w.value as Record<string, unknown>;
      }
      return { type: "step", value: step };
    }

    case "gha_step_run":
      return {
        type: "step",
        value: {
          name: block.getFieldValue("STEP_NAME"),
          run: block.getFieldValue("RUN"),
        },
      };

    case "gha_step_run_multiline": {
      const multiStep: Record<string, string> = {
        name: block.getFieldValue("STEP_NAME"),
        run: block.getFieldValue("SCRIPT"),
      };
      const shell = block.getFieldValue("SHELL");
      if (shell !== "bash") multiStep.shell = shell;
      const workingDirectory = block.getFieldValue("WORKING_DIRECTORY");
      if (workingDirectory && workingDirectory.trim())
        multiStep["working-directory"] = workingDirectory.trim();
      return { type: "step", value: multiStep };
    }

    case "gha_step_run_enhanced": {
      const enhancedStep: Record<string, string> = {
        name: block.getFieldValue("STEP_NAME"),
        run: block.getFieldValue("COMMANDS"),
      };
      const workingDirectory = block.getFieldValue("WORKING_DIRECTORY");
      if (workingDirectory && workingDirectory.trim())
        enhancedStep["working-directory"] = workingDirectory.trim();
      const shell = block.getFieldValue("SHELL");
      if (shell !== "bash") enhancedStep.shell = shell;
      return { type: "step", value: enhancedStep };
    }

    case "gha_with_params": {
      const withParams: Record<string, unknown> = {};
      const key = block.getFieldValue("KEY");
      const value = block.getFieldValue("VALUE");
      if (key && key.trim()) withParams[key] = value;
      return { type: "with_params", value: withParams };
    }

    case "gha_env_vars": {
      const envVars: Record<string, string> = {};
      const name1 = block.getFieldValue("NAME1");
      const envValue1 = block.getFieldValue("VALUE1");
      const name2 = block.getFieldValue("NAME2");
      const envValue2 = block.getFieldValue("VALUE2");
      if (name1.trim()) envVars[name1] = envValue1;
      if (name2.trim()) envVars[name2] = envValue2;
      return { type: "env_vars", value: envVars };
    }

    case "gha_step_condition": {
      const condition = block.getFieldValue("CONDITION");
      const customCondition = block.getFieldValue("CUSTOM_CONDITION");
      return {
        type: "step_condition",
        value: condition === "custom" ? customCondition : condition,
      };
    }

    case "gha_strategy_matrix": {
      const os = block.getFieldValue("OS");
      const nodeVersion = block.getFieldValue("NODE_VERSION");
      const matrix: Record<string, string[]> = {};
      if (os.trim()) matrix.os = os.split(",").map((s: string) => s.trim());
      if (nodeVersion.trim())
        matrix["node-version"] = nodeVersion
          .split(",")
          .map((s: string) => s.trim());
      return { type: "strategy_matrix", value: { matrix } };
    }

    default:
      return null;
  }
};

/**
 * Convert an entire Blockly workspace composed of GitHub Actions blocks into
 * a serializable object that matches GitHub Actions workflow structure.
 *
 * The function walks top-level blocks and processes linear chains to build
 * `on`, `jobs`, `env` and other top-level properties.
 *
 * @param workspace - Blockly workspace instance
 */
export const githubActionsBlocksToWorkflow = (
  workspace: Blockly.WorkspaceSvg
): GitHubActionsWorkflowDirect => {
  const workflow: GitHubActionsWorkflowDirect = {};
  const topBlocks = workspace.getTopBlocks(true);

  for (const block of topBlocks) {
    let currentBlock: Blockly.Block | null = block;
    while (currentBlock) {
      const processed = processGitHubActionsBlock(currentBlock);
      if (processed) {
        switch (processed.type) {
          case "name":
            workflow.name = processed.value as string;
            break;
          case "permissions":
            workflow.permissions = processed.value as Record<string, string>;
            break;
          case "trigger":
            workflow.on = processed.value as Record<string, unknown>;
            break;
          case "job":
            if (!workflow.jobs) workflow.jobs = {};
            if (processed.name)
              workflow.jobs[processed.name] = processed.value as JobDef;
            break;
          case "env_vars":
            workflow.env = processed.value as Record<string, string>;
            break;
        }
      }
      currentBlock = currentBlock.getNextBlock();
    }
  }

  if (!workflow.name) workflow.name = "GitHub Actions Workflow";
  if (!workflow.on) workflow.on = { workflow_dispatch: {} };
  if (!workflow.jobs || Object.keys(workflow.jobs).length === 0) {
    workflow.jobs = {
      build: {
        "runs-on": "ubuntu-latest",
        steps: [
          {
            name: "Checkout code",
            uses: "actions/checkout@v4",
          },
        ],
      },
    };
  }

  return workflow;
};
