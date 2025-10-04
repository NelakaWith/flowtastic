import * as Blockly from "blockly";

/**
 * Custom workflow building blocks used by the generic workflow editor.
 * These blocks are higher-level primitives (trigger, action, condition)
 * and are intentionally framework-agnostic. They are registered on
 * import by populating `Blockly.Blocks`.
 */

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

// Loop Block
Blockly.Blocks["workflow_loop"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Loop")
      .appendField(
        new Blockly.FieldDropdown([
          ["For Each", "foreach"],
          ["While", "while"],
          ["For Count", "for"],
          ["Repeat", "repeat"],
        ]),
        "LOOP_TYPE"
      );
    this.appendValueInput("CONDITION")
      .setCheck(null)
      .appendField("Condition/Items");
    this.appendStatementInput("DO").setCheck(null).appendField("Do");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(160);
    this.setTooltip("Loop through items or repeat actions");
    this.setHelpUrl("");
  },
};

// Variable Block
Blockly.Blocks["workflow_variable"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldDropdown([
          ["Set", "set"],
          ["Get", "get"],
          ["Increment", "increment"],
          ["Decrement", "decrement"],
        ]),
        "OPERATION"
      )
      .appendField("variable")
      .appendField(new Blockly.FieldTextInput("variableName"), "VAR_NAME");
    this.appendValueInput("VALUE").setCheck(null).appendField("Value");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setOutput(true, null);
    this.setColour(330);
    this.setTooltip("Manage workflow variables");
    this.setHelpUrl("");
  },
};

// Advanced HTTP Block
Blockly.Blocks["workflow_http_request"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("HTTP Request:")
      .appendField(
        new Blockly.FieldDropdown([
          ["GET", "GET"],
          ["POST", "POST"],
          ["PUT", "PUT"],
          ["DELETE", "DELETE"],
          ["PATCH", "PATCH"],
        ]),
        "METHOD"
      );
    this.appendDummyInput()
      .appendField("URL")
      .appendField(
        new Blockly.FieldTextInput("https://api.example.com"),
        "URL"
      );
    this.appendValueInput("HEADERS").setCheck(null).appendField("Headers");
    this.appendValueInput("BODY").setCheck(null).appendField("Body");
    this.appendDummyInput()
      .appendField("Timeout (ms)")
      .appendField(new Blockly.FieldNumber(5000, 1000, 60000), "TIMEOUT");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(260);
    this.setTooltip("Advanced HTTP request with headers and body");
    this.setHelpUrl("");
  },
};

// Try/Catch Block
Blockly.Blocks["workflow_try_catch"] = {
  init: function () {
    this.appendDummyInput().appendField("Try");
    this.appendStatementInput("TRY").setCheck(null).appendField("Execute");
    this.appendStatementInput("CATCH").setCheck(null).appendField("On Error");
    this.appendStatementInput("FINALLY").setCheck(null).appendField("Finally");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip("Error handling with try/catch/finally");
    this.setHelpUrl("");
  },
};

// Delay/Wait Block
Blockly.Blocks["workflow_delay"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Wait")
      .appendField(new Blockly.FieldNumber(1, 0, 3600), "DURATION")
      .appendField(
        new Blockly.FieldDropdown([
          ["seconds", "seconds"],
          ["minutes", "minutes"],
          ["hours", "hours"],
          ["milliseconds", "ms"],
        ]),
        "UNIT"
      );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(65);
    this.setTooltip("Wait for specified duration");
    this.setHelpUrl("");
  },
};

// Parallel Block
Blockly.Blocks["workflow_parallel"] = {
  init: function () {
    this.appendDummyInput().appendField("Run in Parallel");
    this.appendStatementInput("BRANCH1").setCheck(null).appendField("Branch 1");
    this.appendStatementInput("BRANCH2").setCheck(null).appendField("Branch 2");
    this.appendStatementInput("BRANCH3").setCheck(null).appendField("Branch 3");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip("Execute multiple branches concurrently");
    this.setHelpUrl("");
  },
};

// Transform Data Block
Blockly.Blocks["workflow_transform"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Transform")
      .appendField(
        new Blockly.FieldDropdown([
          ["JSON Parse", "json_parse"],
          ["JSON Stringify", "json_stringify"],
          ["Array Map", "array_map"],
          ["Array Filter", "array_filter"],
          ["Array Reduce", "array_reduce"],
          ["String Format", "string_format"],
        ]),
        "TRANSFORM_TYPE"
      );
    this.appendValueInput("INPUT").setCheck(null).appendField("Input");
    this.appendValueInput("EXPRESSION")
      .setCheck(null)
      .appendField("Expression");
    this.setOutput(true, null);
    this.setColour(290);
    this.setTooltip("Transform data using various operations");
    this.setHelpUrl("");
  },
};

// Notification Block
Blockly.Blocks["workflow_notification"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Send")
      .appendField(
        new Blockly.FieldDropdown([
          ["Email", "email"],
          ["SMS", "sms"],
          ["Push Notification", "push"],
          ["Slack Message", "slack"],
          ["Discord Message", "discord"],
          ["Teams Message", "teams"],
        ]),
        "NOTIFICATION_TYPE"
      );
    this.appendDummyInput()
      .appendField("To")
      .appendField(new Blockly.FieldTextInput("recipient"), "RECIPIENT");
    this.appendDummyInput()
      .appendField("Subject")
      .appendField(new Blockly.FieldTextInput("Subject"), "SUBJECT");
    this.appendValueInput("MESSAGE").setCheck(null).appendField("Message");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(45);
    this.setTooltip("Send notifications via various channels");
    this.setHelpUrl("");
  },
};

/**
 * Application-level initializer for custom blocks. Like the GitHub
 * Actions blocks, registration happens at import time, but the app
 * calls this function during startup to make initialization explicit.
 *
 * @public
 */
export const initializeCustomBlocks = () => {
  // Blocks are registered when this module is imported
  console.log("Custom workflow blocks initialized");
};
