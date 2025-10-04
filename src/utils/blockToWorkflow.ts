import * as Blockly from "blockly";

/**
 * A single step or node in the generated workflow structure.
 *
 * The shape is intentionally loose to allow different block types to add
 * their own fields (e.g. `steps`, `run`, `uses`, `matrix`, etc.).
 */
export interface WorkflowStep {
  type: string;
  [key: string]: unknown;
}

/**
 * Top-level workflow representation produced from a Blockly workspace.
 */
export interface Workflow {
  /** Human-friendly workflow name */
  name: string;
  /** Simple semantic version used by the tool */
  version: string;
  /** Optional trigger block representation */
  trigger?: WorkflowStep;
  /** Linear list of steps (jobs/steps/conditions parsed after the trigger) */
  steps: WorkflowStep[];
}

/**
 * Recursively processes a Blockly block and converts it to a WorkflowStep
 * or a primitive representation (for parameter/text blocks).
 *
 * This function is intentionally permissive: it returns `null` for disabled
 * or missing blocks so callers can easily skip them.
 *
 * @param block - Blockly block to process
 * @returns a WorkflowStep-like object or null
 */
const processBlock = (block: Blockly.Block): WorkflowStep | null => {
  if (!block || !block.isEnabled()) {
    return null;
  }

  const type = block.type;
  const step: WorkflowStep = { type };

  switch (type) {
    case "workflow_trigger": {
      // Trigger has a type and optional config sub-block
      const triggerType = block.getFieldValue("TRIGGER_TYPE");
      const config = block.getInputTargetBlock("CONFIG");
      step.triggerType = triggerType;
      if (config) {
        step.config = processBlock(config);
      }
      break;
    }

    case "workflow_action": {
      // Action block maps to a step with a name, action type and parameters
      const actionType = block.getFieldValue("ACTION_TYPE");
      const actionName = block.getFieldValue("ACTION_NAME");
      const params = block.getInputTargetBlock("PARAMS");
      step.actionType = actionType;
      step.name = actionName;
      if (params) {
        step.parameters = processBlock(params);
      }
      break;
    }

    case "workflow_condition": {
      // Condition blocks can contain a condition, a DO chain and an ELSE chain
      const condition = block.getInputTargetBlock("CONDITION");
      const doBlock = block.getInputTargetBlock("DO");
      const elseBlock = block.getInputTargetBlock("ELSE");

      if (condition) {
        step.condition = processBlock(condition);
      }

      // Walk DO statement chain
      const thenSteps: WorkflowStep[] = [];
      if (doBlock) {
        let current: Blockly.Block | null = doBlock;
        while (current) {
          const processed = processBlock(current);
          if (processed) thenSteps.push(processed);
          current = current.getNextBlock();
        }
      }
      step.then = thenSteps;

      // Walk ELSE statement chain
      const elseSteps: WorkflowStep[] = [];
      if (elseBlock) {
        let current: Blockly.Block | null = elseBlock;
        while (current) {
          const processed = processBlock(current);
          if (processed) elseSteps.push(processed);
          current = current.getNextBlock();
        }
      }
      step.else = elseSteps;
      break;
    }

    case "workflow_end": {
      // Finalization block
      const status = block.getFieldValue("END_STATUS");
      step.status = status;
      break;
    }

    case "workflow_parameter": {
      // Parameter blocks are represented as a simple key/value object
      const key = block.getFieldValue("KEY");
      const value = block.getFieldValue("VALUE");
      return { [key]: value } as WorkflowStep;
    }

    case "workflow_simple_condition": {
      const variable = block.getFieldValue("VAR");
      const operator = block.getFieldValue("OPERATOR");
      const value = block.getFieldValue("VALUE");
      step.variable = variable;
      step.operator = operator;
      step.value = value;
      break;
    }

    case "text": {
      // Text blocks map to a simple typed value
      const text = block.getFieldValue("TEXT");
      return { type: "text", value: text };
    }

    default:
      // Unknown block types are preserved with their blockType field
      step.blockType = type;
      break;
  }

  return step;
};

/**
 * Convert a Blockly workspace into a Workflow object.
 *
 * The converter expects the workspace to place a trigger block at the top
 * and then a chain of blocks (jobs/steps) following it.
 *
 * @param workspace - Blockly workspace instance to convert
 * @returns Workflow object representing the workspace
 */
export const blocklyToWorkflow = (
  workspace: Blockly.WorkspaceSvg
): Workflow => {
  const workflow: Workflow = {
    name: "Untitled Workflow",
    version: "1.0.0",
    steps: [],
  };

  const topBlocks = workspace.getTopBlocks(true);

  for (const block of topBlocks) {
    if (block.type === "workflow_trigger") {
      workflow.trigger = processBlock(block) || undefined;

      // Process the linear chain of blocks after the trigger
      let nextBlock = block.getNextBlock();
      while (nextBlock) {
        const step = processBlock(nextBlock);
        if (step) {
          workflow.steps.push(step);
        }
        nextBlock = nextBlock.getNextBlock();
      }
    }
  }

  return workflow;
};
