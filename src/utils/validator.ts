import * as Blockly from "blockly";

/**
 * Error or warning produced by the validation engine.
 */
export interface ValidationError {
  /** Blockly block id related to the issue (empty for workspace-level) */
  blockId: string;
  /** Human readable message */
  message: string;
  /** Severity level */
  severity: "error" | "warning";
  /** Optional field name on the block that has the problem */
  field?: string;
}

/**
 * Result of validating a workspace.
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

/**
 * Validate an entire Blockly workspace and collect errors/warnings.
 *
 * This function walks all blocks in the workspace and delegates to
 * specific validation helpers for each block type.
 *
 * @param workspace - The Blockly workspace to validate
 */
export function validateWorkspace(
  workspace: Blockly.WorkspaceSvg
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  const allBlocks = workspace.getAllBlocks(false);

  // Ensure a single workflow name block exists
  const workflowBlocks = allBlocks.filter(
    (b) => b.type === "gha_workflow_name"
  );
  if (workflowBlocks.length === 0) {
    warnings.push({
      blockId: "",
      message: "No workflow name block found. Add a 'Workflow Name' block.",
      severity: "warning",
    });
  } else if (workflowBlocks.length > 1) {
    errors.push({
      blockId: workflowBlocks[1].id,
      message: "Multiple workflow name blocks found. Only one is allowed.",
      severity: "error",
    });
  }

  // Validate each block with specific validators
  for (const block of allBlocks) {
    validateBlock(block, errors, warnings, allBlocks);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Dispatches validation to block-type specific validators.
 */
function validateBlock(
  block: Blockly.Block,
  errors: ValidationError[],
  warnings: ValidationError[],
  allBlocks: Blockly.Block[]
): void {
  switch (block.type) {
    case "gha_workflow_name":
      validateWorkflowName(block, errors, warnings);
      break;
    case "gha_job":
      validateJob(block, errors, warnings, allBlocks);
      break;
    case "gha_step_uses":
      validateStepUses(block, errors, warnings);
      break;
    case "gha_step_run":
    case "gha_step_run_multiline":
    case "gha_step_run_enhanced":
      validateStepRun(block, errors, warnings);
      break;
    case "gha_trigger":
      validateTrigger(block, errors);
      break;
    case "gha_with_params":
      validateWithParams(block, errors, warnings);
      break;
    case "gha_env_vars":
      validateEnvVars(block, errors, warnings);
      break;
  }
}

/**
 * Validate the workflow name block. Ensures a non-empty name and the
 * presence of triggers and jobs where applicable.
 */
function validateWorkflowName(
  block: Blockly.Block,
  errors: ValidationError[],
  warnings: ValidationError[]
): void {
  const name = block.getFieldValue("NAME");
  if (!name || name.trim() === "") {
    errors.push({
      blockId: block.id,
      message: "Workflow name cannot be empty",
      severity: "error",
      field: "NAME",
    });
  }

  // Check for triggers connection
  const triggersInput = block.getInput("TRIGGERS");
  if (triggersInput && !triggersInput.connection?.targetBlock()) {
    warnings.push({
      blockId: block.id,
      message: "No triggers defined. Workflow won't run automatically.",
      severity: "warning",
      field: "TRIGGERS",
    });
  }

  // Ensure at least one job is connected
  const jobsInput = block.getInput("JOBS");
  if (jobsInput && !jobsInput.connection?.targetBlock()) {
    errors.push({
      blockId: block.id,
      message: "At least one job is required",
      severity: "error",
      field: "JOBS",
    });
  }
}

/**
 * Validate a job block: name format, uniqueness, runner and dependencies.
 */
function validateJob(
  block: Blockly.Block,
  errors: ValidationError[],
  warnings: ValidationError[],
  allBlocks: Blockly.Block[]
): void {
  const jobName = block.getFieldValue("JOB_NAME");
  const runsOn = block.getFieldValue("RUNS_ON");
  const needsValue = block.getFieldValue("NEEDS");

  // Validate job name
  if (!jobName || jobName.trim() === "") {
    errors.push({
      blockId: block.id,
      message: "Job name cannot be empty",
      severity: "error",
      field: "JOB_NAME",
    });
  } else if (!/^[a-zA-Z0-9_-]+$/.test(jobName)) {
    errors.push({
      blockId: block.id,
      message:
        "Job name must contain only letters, numbers, hyphens, and underscores",
      severity: "error",
      field: "JOB_NAME",
    });
  }

  // Check for duplicate job names
  const jobBlocks = allBlocks.filter((b) => b.type === "gha_job");
  const duplicates = jobBlocks.filter(
    (b) => b.id !== block.id && b.getFieldValue("JOB_NAME") === jobName
  );
  if (duplicates.length > 0) {
    errors.push({
      blockId: block.id,
      message: `Duplicate job name "${jobName}". Job names must be unique.`,
      severity: "error",
      field: "JOB_NAME",
    });
  }

  // Validate runs-on
  if (!runsOn || runsOn.trim() === "") {
    errors.push({
      blockId: block.id,
      message: "Runner (runs-on) must be specified",
      severity: "error",
      field: "RUNS_ON",
    });
  }

  // Validate needs dependencies
  if (needsValue && needsValue.trim()) {
    const needs = needsValue.split(",").map((n: string) => n.trim());
    const allJobNames = jobBlocks.map((b) => b.getFieldValue("JOB_NAME"));

    for (const need of needs) {
      if (!allJobNames.includes(need)) {
        errors.push({
          blockId: block.id,
          message: `Job dependency "${need}" not found. Referenced jobs must exist.`,
          severity: "error",
          field: "NEEDS",
        });
      }
      if (need === jobName) {
        errors.push({
          blockId: block.id,
          message: "Job cannot depend on itself",
          severity: "error",
          field: "NEEDS",
        });
      }
    }
  }

  // Check for steps
  const stepsInput = block.getInput("STEPS");
  if (stepsInput && !stepsInput.connection?.targetBlock()) {
    warnings.push({
      blockId: block.id,
      message: `Job "${jobName}" has no steps`,
      severity: "warning",
      field: "STEPS",
    });
  }
}

/**
 * Validate a 'uses' step: presence of uses and optional naming.
 */
function validateStepUses(
  block: Blockly.Block,
  errors: ValidationError[],
  warnings: ValidationError[]
): void {
  const stepName = block.getFieldValue("STEP_NAME");
  const uses = block.getFieldValue("USES");

  if (!stepName || stepName.trim() === "") {
    warnings.push({
      blockId: block.id,
      message: "Step name is empty. Consider adding a descriptive name.",
      severity: "warning",
      field: "STEP_NAME",
    });
  }

  if (!uses || uses.trim() === "") {
    errors.push({
      blockId: block.id,
      message: "Action (uses) cannot be empty",
      severity: "error",
      field: "USES",
    });
  } else if (!uses.includes("@")) {
    warnings.push({
      blockId: block.id,
      message: 'Action should include version (e.g., "actions/checkout@v4")',
      severity: "warning",
      field: "USES",
    });
  }
}

/**
 * Validate a run step (single or multi-line) ensuring run command exists.
 */
function validateStepRun(
  block: Blockly.Block,
  errors: ValidationError[],
  warnings: ValidationError[]
): void {
  const stepName = block.getFieldValue("STEP_NAME");
  const run = block.getFieldValue("RUN");

  if (!stepName || stepName.trim() === "") {
    warnings.push({
      blockId: block.id,
      message: "Step name is empty. Consider adding a descriptive name.",
      severity: "warning",
      field: "STEP_NAME",
    });
  }

  if (!run || run.trim() === "") {
    errors.push({
      blockId: block.id,
      message: "Run command cannot be empty",
      severity: "error",
      field: "RUN",
    });
  }
}

/**
 * Simple trigger validation – ensures trigger type is selected.
 */
function validateTrigger(
  block: Blockly.Block,
  errors: ValidationError[]
): void {
  const triggerType = block.getFieldValue("TRIGGER_TYPE");

  if (!triggerType || triggerType.trim() === "") {
    errors.push({
      blockId: block.id,
      message: "Trigger type must be specified",
      severity: "error",
      field: "TRIGGER_TYPE",
    });
  }
}

/**
 * Validate small key/value parameter blocks used in action "with" inputs.
 */
function validateWithParams(
  block: Blockly.Block,
  errors: ValidationError[],
  warnings: ValidationError[]
): void {
  const key = block.getFieldValue("KEY");
  const value = block.getFieldValue("VALUE");

  if (!key || key.trim() === "") {
    errors.push({
      blockId: block.id,
      message: "Parameter key cannot be empty",
      severity: "error",
      field: "KEY",
    });
  }

  if (!value || value.trim() === "") {
    warnings.push({
      blockId: block.id,
      message: `Parameter "${key}" has no value`,
      severity: "warning",
      field: "VALUE",
    });
  }
}

/**
 * Validate environment variable blocks (key/value pairs).
 */
function validateEnvVars(
  block: Blockly.Block,
  errors: ValidationError[],
  warnings: ValidationError[]
): void {
  const key = block.getFieldValue("KEY");
  const value = block.getFieldValue("VALUE");

  if (!key || key.trim() === "") {
    errors.push({
      blockId: block.id,
      message: "Environment variable key cannot be empty",
      severity: "error",
      field: "KEY",
    });
  }

  if (!value || value.trim() === "") {
    warnings.push({
      blockId: block.id,
      message: `Environment variable "${key}" has no value`,
      severity: "warning",
      field: "VALUE",
    });
  }
}
