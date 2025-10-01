import * as Blockly from "blockly";

export interface GitHubActionsWorkflowDirect {
  name?: string;
  permissions?: Record<string, string>;
  on?: Record<string, unknown>;
  jobs?: Record<
    string,
    {
      "runs-on": string;
      permissions?: Record<string, string>;
      strategy?: {
        matrix: Record<string, string[]>;
      };
      env?: Record<string, string>;
      steps: Array<{
        name: string;
        uses?: string;
        run?: string;
        shell?: string;
        "working-directory"?: string;
        with?: Record<string, unknown>;
        env?: Record<string, string>;
        if?: string;
        "continue-on-error"?: boolean;
      }>;
    }
  >;
  env?: Record<string, string>;
}

interface ProcessedBlock {
  type: string;
  value?: unknown;
  name?: string;
}

const processGitHubActionsBlock = (
  block: Blockly.Block
): ProcessedBlock | null => {
  if (!block || !block.isEnabled()) {
    return null;
  }

  const type = block.type;

  switch (type) {
    case "gha_workflow_name": {
      return {
        type: "name",
        value: block.getFieldValue("NAME"),
      };
    }

    case "gha_permissions": {
      const permissions: Record<string, string> = {};
      const contents = block.getFieldValue("CONTENTS");
      const deployments = block.getFieldValue("DEPLOYMENTS");
      const actions = block.getFieldValue("ACTIONS");

      if (contents !== "none") permissions.contents = contents;
      if (deployments !== "none") permissions.deployments = deployments;
      if (actions !== "none") permissions.actions = actions;

      return {
        type: "permissions",
        value: permissions,
      };
    }

    case "gha_trigger": {
      const triggerType = block.getFieldValue("TRIGGER_TYPE");
      const configBlock = block.getInputTargetBlock("CONFIG");

      const trigger: Record<string, unknown> = {};

      if (configBlock) {
        const config = processGitHubActionsBlock(configBlock);
        if (config) {
          trigger[triggerType] = config.value;
        }
      } else {
        trigger[triggerType] = {};
      }

      return {
        type: "trigger",
        value: trigger,
      };
    }

    case "gha_push_config": {
      const branches = block.getFieldValue("BRANCHES");
      const paths = block.getFieldValue("PATHS");

      const pushConfig: Record<string, string[]> = {};
      if (branches.trim()) {
        pushConfig.branches = branches.split(",").map((b: string) => b.trim());
      }
      if (paths.trim()) {
        pushConfig.paths = paths.split(",").map((p: string) => p.trim());
      }

      return {
        type: "push_config",
        value: Object.keys(pushConfig).length > 0 ? pushConfig : {},
      };
    }

    case "gha_schedule_config": {
      return {
        type: "schedule_config",
        value: [{ cron: block.getFieldValue("CRON") }],
      };
    }

    case "gha_pull_request_config": {
      const types = block.getFieldValue("TYPES");
      const branches = block.getFieldValue("BRANCHES");
      const paths = block.getFieldValue("PATHS");

      const prConfig: Record<string, string[]> = {};
      if (types.trim()) {
        prConfig.types = types.split(",").map((t: string) => t.trim());
      }
      if (branches.trim()) {
        prConfig.branches = branches.split(",").map((b: string) => b.trim());
      }
      if (paths.trim()) {
        prConfig.paths = paths.split(",").map((p: string) => p.trim());
      }

      return {
        type: "pull_request_config",
        value: Object.keys(prConfig).length > 0 ? prConfig : {},
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
        description: description,
        required: required,
        type: inputType,
      };

      if (defaultValue.trim()) {
        input.default = defaultValue;
      }

      if (inputType === "choice" && options.trim()) {
        input.options = options.split(",").map((o: string) => o.trim());
      }

      return {
        type: "workflow_dispatch_config",
        value: {
          inputs: {
            [inputName]: input,
          },
        },
      };
    }

    case "gha_release_config": {
      const types = block.getFieldValue("TYPES");
      return {
        type: "release_config",
        value: { types: [types] },
      };
    }

    case "gha_issues_config": {
      const types = block.getFieldValue("TYPES");
      const typesArray = types.split(",").map((t: string) => t.trim());
      return {
        type: "issues_config",
        value: { types: typesArray },
      };
    }

    case "gha_repository_dispatch_config": {
      const types = block.getFieldValue("TYPES");
      const typesArray = types.split(",").map((t: string) => t.trim());
      return {
        type: "repository_dispatch_config",
        value: { types: typesArray },
      };
    }

    case "gha_workflow_call_config": {
      const inputName = block.getFieldValue("INPUT_NAME");
      const inputType = block.getFieldValue("INPUT_TYPE");
      const required = block.getFieldValue("REQUIRED") === "true";

      return {
        type: "workflow_call_config",
        value: {
          inputs: {
            [inputName]: {
              type: inputType,
              required: required,
            },
          },
        },
      };
    }

    case "gha_job": {
      const jobName = block.getFieldValue("JOB_NAME");
      const runsOn = block.getFieldValue("RUNS_ON");

      const job: {
        "runs-on": string;
        steps: Array<Record<string, unknown>>;
        permissions?: Record<string, string>;
        strategy?: { matrix: Record<string, string[]> };
        env?: Record<string, string>;
      } = {
        "runs-on": runsOn,
        steps: [],
      };

      // Process steps
      const stepsInput = block.getInput("STEPS");
      if (stepsInput && stepsInput.connection) {
        let stepBlock = stepsInput.connection.targetBlock();
        while (stepBlock) {
          const step = processGitHubActionsBlock(stepBlock);
          if (step) {
            if (step.type === "job_permissions") {
              job.permissions = step.value as Record<string, string>;
            } else if (step.type === "strategy_matrix") {
              job.strategy = step.value as { matrix: Record<string, string[]> };
            } else if (step.type === "env_vars") {
              job.env = step.value as Record<string, string>;
            } else if (step.type === "step") {
              job.steps.push(step.value as Record<string, unknown>);
            }
          }
          stepBlock = stepBlock.getNextBlock();
        }
      }

      return {
        type: "job",
        name: jobName,
        value: job,
      };
    }

    case "gha_job_permissions": {
      const jobPerms: Record<string, string> = {};
      const jobContents = block.getFieldValue("CONTENTS");
      const jobDeployments = block.getFieldValue("DEPLOYMENTS");

      if (jobContents !== "none") jobPerms.contents = jobContents;
      if (jobDeployments !== "none") jobPerms.deployments = jobDeployments;

      return {
        type: "job_permissions",
        value: jobPerms,
      };
    }

    case "gha_step_uses": {
      const stepName = block.getFieldValue("STEP_NAME");
      const uses = block.getFieldValue("USES");
      const withBlock = block.getInputTargetBlock("WITH");

      const step: Record<string, unknown> = {
        name: stepName,
        uses: uses,
      };

      if (withBlock) {
        const withParams = processGitHubActionsBlock(withBlock);
        if (withParams && withParams.value) {
          step.with = withParams.value;
        }
      }

      return {
        type: "step",
        value: step,
      };
    }

    case "gha_step_run": {
      return {
        type: "step",
        value: {
          name: block.getFieldValue("STEP_NAME"),
          run: block.getFieldValue("RUN"),
        },
      };
    }

    case "gha_step_run_multiline": {
      const multiStep: Record<string, string> = {
        name: block.getFieldValue("STEP_NAME"),
        run: block.getFieldValue("SCRIPT"),
      };

      const shell = block.getFieldValue("SHELL");
      if (shell !== "bash") {
        multiStep.shell = shell;
      }

      const workingDirectory = block.getFieldValue("WORKING_DIRECTORY");
      if (workingDirectory && workingDirectory.trim()) {
        multiStep["working-directory"] = workingDirectory.trim();
      }

      return {
        type: "step",
        value: multiStep,
      };
    }

    case "gha_step_run_enhanced": {
      const enhancedStep: Record<string, string> = {
        name: block.getFieldValue("STEP_NAME"),
        run: block.getFieldValue("COMMANDS"),
      };

      const workingDirectory = block.getFieldValue("WORKING_DIRECTORY");
      if (workingDirectory && workingDirectory.trim()) {
        enhancedStep["working-directory"] = workingDirectory.trim();
      }

      const shell = block.getFieldValue("SHELL");
      if (shell !== "bash") {
        enhancedStep.shell = shell;
      }

      return {
        type: "step",
        value: enhancedStep,
      };
    }

    case "gha_with_params": {
      const withParams: Record<string, unknown> = {};

      const key1 = block.getFieldValue("KEY1");
      const value1 = block.getFieldValue("VALUE1");
      const key2 = block.getFieldValue("KEY2");
      const value2 = block.getFieldValue("VALUE2");

      if (key1.trim()) withParams[key1] = value1;
      if (key2.trim()) withParams[key2] = value2;

      return {
        type: "with_params",
        value: withParams,
      };
    }

    case "gha_env_vars": {
      const envVars: Record<string, string> = {};

      const name1 = block.getFieldValue("NAME1");
      const envValue1 = block.getFieldValue("VALUE1");
      const name2 = block.getFieldValue("NAME2");
      const envValue2 = block.getFieldValue("VALUE2");

      if (name1.trim()) envVars[name1] = envValue1;
      if (name2.trim()) envVars[name2] = envValue2;

      return {
        type: "env_vars",
        value: envVars,
      };
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
      if (os.trim()) {
        matrix.os = os.split(",").map((o: string) => o.trim());
      }
      if (nodeVersion.trim()) {
        matrix["node-version"] = nodeVersion
          .split(",")
          .map((v: string) => v.trim());
      }

      return {
        type: "strategy_matrix",
        value: { matrix },
      };
    }

    default:
      return null;
  }
};

export const githubActionsBlocksToWorkflow = (
  workspace: Blockly.WorkspaceSvg
): GitHubActionsWorkflowDirect => {
  const workflow: GitHubActionsWorkflowDirect = {};

  const topBlocks = workspace.getTopBlocks(true);

  // Process blocks in order
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
            if (processed.name) {
              workflow.jobs[processed.name] =
                processed.value as GitHubActionsWorkflowDirect["jobs"] extends Record<
                  string,
                  infer T
                >
                  ? T
                  : never;
            }
            break;
          case "env_vars":
            workflow.env = processed.value as Record<string, string>;
            break;
        }
      }

      currentBlock = currentBlock.getNextBlock();
    }
  }

  // Set defaults if empty
  if (!workflow.name) {
    workflow.name = "GitHub Actions Workflow";
  }

  if (!workflow.on) {
    workflow.on = { workflow_dispatch: {} };
  }

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
