import * as Blockly from "blockly";

// Trigger Block
Blockly.Blocks["workflow_trigger"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Trigger:")
      .appendField(
        new Blockly.FieldDropdown([
          ["Manual", "manual"],
          ["Webhook", "webhook"],
          ["Schedule", "schedule"],
          ["Event", "event"],
        ]),
        "TRIGGER_TYPE"
      );
    this.appendValueInput("CONFIG").setCheck(null).appendField("Config");
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip("Workflow trigger event");
    this.setHelpUrl("");
  },
};

// Action Block
Blockly.Blocks["workflow_action"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Action:")
      .appendField(
        new Blockly.FieldDropdown([
          ["API Call", "api_call"],
          ["Function", "function"],
          ["Email", "email"],
          ["Database", "database"],
        ]),
        "ACTION_TYPE"
      );
    this.appendDummyInput()
      .appendField("Name")
      .appendField(new Blockly.FieldTextInput("action_name"), "ACTION_NAME");
    this.appendValueInput("PARAMS").setCheck(null).appendField("Parameters");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Execute an action");
    this.setHelpUrl("");
  },
};

// Condition Block
Blockly.Blocks["workflow_condition"] = {
  init: function () {
    this.appendValueInput("CONDITION").setCheck("Boolean").appendField("If");
    this.appendStatementInput("DO").setCheck(null).appendField("Then");
    this.appendStatementInput("ELSE").setCheck(null).appendField("Else");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(210);
    this.setTooltip("Conditional branching");
    this.setHelpUrl("");
  },
};

// End Block
Blockly.Blocks["workflow_end"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("End")
      .appendField(
        new Blockly.FieldDropdown([
          ["Success", "success"],
          ["Failure", "failure"],
          ["Cancelled", "cancelled"],
        ]),
        "END_STATUS"
      );
    this.setPreviousStatement(true, null);
    this.setColour(0);
    this.setTooltip("End workflow execution");
    this.setHelpUrl("");
  },
};

// Parameter Block
Blockly.Blocks["workflow_parameter"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(new Blockly.FieldTextInput("key"), "KEY")
      .appendField(":")
      .appendField(new Blockly.FieldTextInput("value"), "VALUE");
    this.setOutput(true, null);
    this.setColour(290);
    this.setTooltip("Key-value parameter");
    this.setHelpUrl("");
  },
};

// Simple Condition Block
Blockly.Blocks["workflow_simple_condition"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(new Blockly.FieldTextInput("variable"), "VAR")
      .appendField(
        new Blockly.FieldDropdown([
          ["==", "eq"],
          ["!=", "ne"],
          [">", "gt"],
          ["<", "lt"],
          [">=", "gte"],
          ["<=", "lte"],
        ]),
        "OPERATOR"
      )
      .appendField(new Blockly.FieldTextInput("value"), "VALUE");
    this.setOutput(true, "Boolean");
    this.setColour(210);
    this.setTooltip("Simple comparison condition");
    this.setHelpUrl("");
  },
};

export const initializeCustomBlocks = () => {
  // Blocks are registered when this module is imported
  console.log("Custom workflow blocks initialized");
};
