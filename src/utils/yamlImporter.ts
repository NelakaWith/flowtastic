import * as Blockly from "blockly";
import yaml from "js-yaml";

interface GitHubAction {
  name?: string;
  on?: Record<string, unknown> | string[];
  permissions?: Record<string, string>;
  jobs?: Record<string, Job>;
}

interface Job {
  "runs-on": string;
  needs?: string | string[];
  permissions?: Record<string, string>;
  strategy?: {
    matrix?: Record<string, string[]>;
  };
  env?: Record<string, string>;
  steps?: Step[];
}

interface Step {
  name?: string;
  uses?: string;
  with?: Record<string, string>;
  run?: string;
  env?: Record<string, string>;
  "working-directory"?: string;
  if?: string;
}

/**
 * Import YAML workflow and create Blockly blocks
 */
export function importYamlToWorkspace(
  yamlContent: string,
  workspace: Blockly.WorkspaceSvg
): { success: boolean; error?: string } {
  try {
    const workflow = yaml.load(yamlContent) as GitHubAction;

    // Clear workspace
    workspace.clear();

    // Create workflow name block
    const workflowBlock = workspace.newBlock("gha_workflow_name");
    workflowBlock.setFieldValue(workflow.name || "Imported Workflow", "NAME");
    workflowBlock.moveBy(20, 20);
    workflowBlock.initSvg();

    // Add permissions
    if (workflow.permissions) {
      let prevPermissionBlock: Blockly.Block | null = null;
      for (const [permission, level] of Object.entries(workflow.permissions)) {
        const permBlock = workspace.newBlock("gha_permissions");
        permBlock.setFieldValue(permission, "PERMISSION_TYPE");
        permBlock.setFieldValue(level, "PERMISSION_LEVEL");
        permBlock.initSvg();

        if (prevPermissionBlock) {
          prevPermissionBlock.nextConnection!.connect(
            permBlock.previousConnection!
          );
        } else {
          workflowBlock
            .getInput("PERMISSIONS")!
            .connection!.connect(permBlock.previousConnection!);
        }
        prevPermissionBlock = permBlock;
      }
    }

    // Add triggers
    if (workflow.on) {
      let prevTriggerBlock: Blockly.Block | null = null;
      const triggers = Array.isArray(workflow.on)
        ? workflow.on
        : Object.keys(workflow.on);

      for (const trigger of triggers) {
        const triggerBlock = workspace.newBlock("gha_trigger");
        triggerBlock.setFieldValue(trigger, "TRIGGER_TYPE");
        triggerBlock.initSvg();

        // Add trigger config if it exists
        if (typeof workflow.on === "object" && !Array.isArray(workflow.on)) {
          const triggerConfig = workflow.on[trigger];
          if (triggerConfig && typeof triggerConfig === "object") {
            addTriggerConfig(
              workspace,
              triggerBlock,
              trigger,
              triggerConfig as Record<string, unknown>
            );
          }
        }

        if (prevTriggerBlock) {
          prevTriggerBlock.nextConnection!.connect(
            triggerBlock.previousConnection!
          );
        } else {
          workflowBlock
            .getInput("TRIGGERS")!
            .connection!.connect(triggerBlock.previousConnection!);
        }
        prevTriggerBlock = triggerBlock;
      }
    }

    // Add jobs
    if (workflow.jobs) {
      let prevJobBlock: Blockly.Block | null = null;
      for (const [jobName, job] of Object.entries(workflow.jobs)) {
        const jobBlock = createJobBlock(workspace, jobName, job);

        if (prevJobBlock) {
          prevJobBlock.nextConnection!.connect(jobBlock.previousConnection!);
        } else {
          workflowBlock
            .getInput("JOBS")!
            .connection!.connect(jobBlock.previousConnection!);
        }
        prevJobBlock = jobBlock;
      }
    }

    workflowBlock.render();
    workspace.render();

    return { success: true };
  } catch (error) {
    console.error("YAML import error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

function addTriggerConfig(
  workspace: Blockly.WorkspaceSvg,
  triggerBlock: Blockly.Block,
  triggerType: string,
  config: Record<string, unknown>
): void {
  let configBlock: Blockly.Block | null = null;

  if (triggerType === "push" || triggerType === "pull_request") {
    configBlock = workspace.newBlock("push_pull_request_config");
    if (config.branches) {
      const branches = Array.isArray(config.branches)
        ? config.branches.join(", ")
        : String(config.branches);
      configBlock.setFieldValue(branches, "BRANCHES");
    }
    if (config.tags) {
      const tags = Array.isArray(config.tags)
        ? config.tags.join(", ")
        : String(config.tags);
      configBlock.setFieldValue(tags, "TAGS");
    }
  } else if (triggerType === "workflow_dispatch") {
    configBlock = workspace.newBlock("workflow_dispatch_config");
    // Note: inputs would require more complex handling
  } else if (triggerType === "release") {
    configBlock = workspace.newBlock("release_config");
    if (config.types) {
      const types = Array.isArray(config.types)
        ? config.types.join(", ")
        : String(config.types);
      configBlock.setFieldValue(types, "TYPES");
    }
  }

  if (configBlock) {
    (configBlock as Blockly.BlockSvg).initSvg();
    triggerBlock
      .getInput("CONFIG")!
      .connection!.connect(configBlock.previousConnection!);
  }
}

function createJobBlock(
  workspace: Blockly.WorkspaceSvg,
  jobName: string,
  job: Job
): Blockly.Block {
  const jobBlock = workspace.newBlock("gha_job");
  jobBlock.setFieldValue(jobName, "JOB_NAME");
  jobBlock.setFieldValue(job["runs-on"], "RUNS_ON");

  // Add needs
  if (job.needs) {
    const needs = Array.isArray(job.needs) ? job.needs.join(", ") : job.needs;
    jobBlock.setFieldValue(needs, "NEEDS");
  }

  // Add job permissions
  if (job.permissions) {
    const permBlock = workspace.newBlock("gha_job_permissions");
    permBlock.initSvg();

    let prevPermItem: Blockly.Block | null = null;
    for (const [perm, level] of Object.entries(job.permissions)) {
      const permItem = workspace.newBlock("gha_permissions");
      permItem.setFieldValue(perm, "PERMISSION_TYPE");
      permItem.setFieldValue(level, "PERMISSION_LEVEL");
      permItem.initSvg();

      if (prevPermItem) {
        prevPermItem.nextConnection!.connect(permItem.previousConnection!);
      } else {
        permBlock
          .getInput("PERMISSIONS")!
          .connection!.connect(permItem.previousConnection!);
      }
      prevPermItem = permItem;
    }

    jobBlock
      .getInput("PERMISSIONS")!
      .connection!.connect(permBlock.outputConnection!);
  }

  // Add strategy matrix
  if (job.strategy?.matrix) {
    let prevStrategyBlock: Blockly.Block | null = null;
    for (const [key, values] of Object.entries(job.strategy.matrix)) {
      const strategyBlock = workspace.newBlock("gha_strategy_matrix");
      strategyBlock.setFieldValue(key, "MATRIX_KEY");
      strategyBlock.setFieldValue(values.join(", "), "MATRIX_VALUES");
      strategyBlock.initSvg();

      if (prevStrategyBlock) {
        prevStrategyBlock.nextConnection!.connect(
          strategyBlock.previousConnection!
        );
      } else {
        jobBlock
          .getInput("STRATEGY")!
          .connection!.connect(strategyBlock.previousConnection!);
      }
      prevStrategyBlock = strategyBlock;
    }
  }

  // Add job env vars
  if (job.env) {
    let prevEnvBlock: Blockly.Block | null = null;
    for (const [key, value] of Object.entries(job.env)) {
      const envBlock = workspace.newBlock("gha_env_vars");
      envBlock.setFieldValue(key, "KEY");
      envBlock.setFieldValue(value, "VALUE");
      envBlock.initSvg();

      if (prevEnvBlock) {
        prevEnvBlock.nextConnection!.connect(envBlock.previousConnection!);
      } else {
        jobBlock
          .getInput("ENV")!
          .connection!.connect(envBlock.previousConnection!);
      }
      prevEnvBlock = envBlock;
    }
  }

  // Add steps
  if (job.steps) {
    let prevStepBlock: Blockly.Block | null = null;
    for (const step of job.steps) {
      const stepBlock = createStepBlock(workspace, step);

      if (prevStepBlock) {
        prevStepBlock.nextConnection!.connect(stepBlock.previousConnection!);
      } else {
        jobBlock
          .getInput("STEPS")!
          .connection!.connect(stepBlock.previousConnection!);
      }
      prevStepBlock = stepBlock;
    }
  }

  jobBlock.initSvg();
  return jobBlock;
}

function createStepBlock(
  workspace: Blockly.WorkspaceSvg,
  step: Step
): Blockly.Block {
  let stepBlock: Blockly.Block;

  if (step.uses) {
    // Action step
    stepBlock = workspace.newBlock("gha_step_uses");
    stepBlock.setFieldValue(step.name || "", "STEP_NAME");
    stepBlock.setFieldValue(step.uses, "USES");

    // Add with parameters
    if (step.with) {
      let prevWithBlock: Blockly.Block | null = null;
      for (const [key, value] of Object.entries(step.with)) {
        const withBlock = workspace.newBlock("gha_with_params");
        withBlock.setFieldValue(key, "KEY");
        withBlock.setFieldValue(value, "VALUE");
        withBlock.initSvg();

        if (prevWithBlock) {
          prevWithBlock.nextConnection!.connect(withBlock.previousConnection!);
        } else {
          stepBlock
            .getInput("WITH")!
            .connection!.connect(withBlock.previousConnection!);
        }
        prevWithBlock = withBlock;
      }
    }
  } else if (step.run) {
    // Run step
    const hasWorkingDir = !!step["working-directory"];
    const isMultiLine = step.run.includes("\n");

    if (hasWorkingDir) {
      stepBlock = workspace.newBlock("gha_step_run_enhanced");
      stepBlock.setFieldValue(
        step["working-directory"] || "",
        "WORKING_DIRECTORY"
      );
    } else if (isMultiLine) {
      stepBlock = workspace.newBlock("gha_step_run_multiline");
    } else {
      stepBlock = workspace.newBlock("gha_step_run");
    }

    stepBlock.setFieldValue(step.name || "", "STEP_NAME");
    stepBlock.setFieldValue(step.run, "RUN");
  } else {
    // Fallback: empty run step
    stepBlock = workspace.newBlock("gha_step_run");
    stepBlock.setFieldValue(step.name || "", "STEP_NAME");
    stepBlock.setFieldValue("", "RUN");
  }

  // Add condition
  if (step.if) {
    stepBlock.setFieldValue(step.if, "CONDITION");
  }

  // Add step env vars
  if (step.env) {
    let prevEnvBlock: Blockly.Block | null = null;
    for (const [key, value] of Object.entries(step.env)) {
      const envBlock = workspace.newBlock("gha_env_vars");
      envBlock.setFieldValue(key, "KEY");
      envBlock.setFieldValue(value, "VALUE");
      envBlock.initSvg();

      if (prevEnvBlock) {
        prevEnvBlock.nextConnection!.connect(envBlock.previousConnection!);
      } else {
        stepBlock
          .getInput("ENV")!
          .connection!.connect(envBlock.previousConnection!);
      }
      prevEnvBlock = envBlock;
    }
  }

  (stepBlock as Blockly.BlockSvg).initSvg();
  return stepBlock;
}
