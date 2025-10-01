import * as Blockly from "blockly";

export interface WorkflowStep {
  type: string;
  [key: string]: unknown;
}

export interface Workflow {
  name: string;
  version: string;
  trigger?: WorkflowStep;
  steps: WorkflowStep[];
}

const processBlock = (block: Blockly.Block): WorkflowStep | null => {
  if (!block || !block.isEnabled()) {
    return null;
  }

  const type = block.type;
  const step: WorkflowStep = { type };

  switch (type) {
    case "workflow_trigger": {
      const triggerType = block.getFieldValue("TRIGGER_TYPE");
      const config = block.getInputTargetBlock("CONFIG");
      step.triggerType = triggerType;
      if (config) {
        step.config = processBlock(config);
      }
      break;
    }

    case "workflow_action": {
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
      const condition = block.getInputTargetBlock("CONDITION");
      const doBlock = block.getInputTargetBlock("DO");
      const elseBlock = block.getInputTargetBlock("ELSE");

      if (condition) {
        step.condition = processBlock(condition);
      }

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
      const status = block.getFieldValue("END_STATUS");
      step.status = status;
      break;
    }

    case "workflow_parameter": {
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
      const text = block.getFieldValue("TEXT");
      return { type: "text", value: text };
    }

    default:
      step.blockType = type;
      break;
  }

  return step;
};

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

      // Process the chain after the trigger
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
