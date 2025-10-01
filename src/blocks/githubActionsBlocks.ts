import * as Blockly from "blockly";

// Workflow Name Block
Blockly.Blocks["gha_workflow_name"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Workflow Name:")
      .appendField(new Blockly.FieldTextInput("My Workflow"), "NAME");
    this.setNextStatement(true, null);
    this.setColour(45);
    this.setTooltip("Set the name of the GitHub Actions workflow");
    this.setHelpUrl("");
  },
};

// Permissions Block
Blockly.Blocks["gha_permissions"] = {
  init: function () {
    this.appendDummyInput().appendField("Permissions");
    this.appendDummyInput()
      .appendField("Contents:")
      .appendField(
        new Blockly.FieldDropdown([
          ["read", "read"],
          ["write", "write"],
          ["none", "none"],
        ]),
        "CONTENTS"
      );
    this.appendDummyInput()
      .appendField("Deployments:")
      .appendField(
        new Blockly.FieldDropdown([
          ["none", "none"],
          ["read", "read"],
          ["write", "write"],
        ]),
        "DEPLOYMENTS"
      );
    this.appendDummyInput()
      .appendField("Actions:")
      .appendField(
        new Blockly.FieldDropdown([
          ["none", "none"],
          ["read", "read"],
          ["write", "write"],
        ]),
        "ACTIONS"
      );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(160);
    this.setTooltip("Set workflow-level permissions");
    this.setHelpUrl("");
  },
};

// Trigger Block (On)
Blockly.Blocks["gha_trigger"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Trigger on:")
      .appendField(
        new Blockly.FieldDropdown([
          ["Push", "push"],
          ["Pull Request", "pull_request"],
          ["Schedule", "schedule"],
          ["Manual", "workflow_dispatch"],
          ["Release", "release"],
          ["Issues", "issues"],
        ]),
        "TRIGGER_TYPE"
      );
    this.appendValueInput("CONFIG").setCheck(null).appendField("Config");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip("Define when the workflow should run");
    this.setHelpUrl("");
  },
};

// Trigger Config Blocks
Blockly.Blocks["gha_push_config"] = {
  init: function () {
    this.appendDummyInput().appendField("Push Config");
    this.appendDummyInput()
      .appendField("Branches:")
      .appendField(new Blockly.FieldTextInput("main"), "BRANCHES");
    this.appendDummyInput()
      .appendField("Paths:")
      .appendField(new Blockly.FieldTextInput(""), "PATHS");
    this.setOutput(true, null);
    this.setColour(120);
    this.setTooltip("Configure push trigger (comma-separated values)");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["gha_schedule_config"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Schedule:")
      .appendField(new Blockly.FieldTextInput("0 0 * * *"), "CRON");
    this.setOutput(true, null);
    this.setColour(120);
    this.setTooltip("Configure schedule trigger with cron expression");
    this.setHelpUrl("");
  },
};

// Job Block
Blockly.Blocks["gha_job"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Job:")
      .appendField(new Blockly.FieldTextInput("build"), "JOB_NAME");
    this.appendDummyInput()
      .appendField("Runs on:")
      .appendField(
        new Blockly.FieldDropdown([
          ["ubuntu-latest", "ubuntu-latest"],
          ["windows-latest", "windows-latest"],
          ["macos-latest", "macos-latest"],
          ["ubuntu-20.04", "ubuntu-20.04"],
          ["ubuntu-22.04", "ubuntu-22.04"],
          ["self-hosted", "self-hosted"],
        ]),
        "RUNS_ON"
      );
    this.appendStatementInput("STEPS").setCheck(null).appendField("Steps");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Define a job with its runner and steps");
    this.setHelpUrl("");
  },
};

// Job Permissions Block
Blockly.Blocks["gha_job_permissions"] = {
  init: function () {
    this.appendDummyInput().appendField("Job Permissions");
    this.appendDummyInput()
      .appendField("Contents:")
      .appendField(
        new Blockly.FieldDropdown([
          ["read", "read"],
          ["write", "write"],
          ["none", "none"],
        ]),
        "CONTENTS"
      );
    this.appendDummyInput()
      .appendField("Deployments:")
      .appendField(
        new Blockly.FieldDropdown([
          ["none", "none"],
          ["read", "read"],
          ["write", "write"],
        ]),
        "DEPLOYMENTS"
      );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(210);
    this.setTooltip("Set job-level permissions");
    this.setHelpUrl("");
  },
};

// Step - Uses Action
Blockly.Blocks["gha_step_uses"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Step:")
      .appendField(new Blockly.FieldTextInput("Checkout"), "STEP_NAME");
    this.appendDummyInput()
      .appendField("Uses:")
      .appendField(new Blockly.FieldTextInput("actions/checkout@v4"), "USES");
    this.appendValueInput("WITH").setCheck(null).appendField("With");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
    this.setTooltip("Run a predefined action");
    this.setHelpUrl("");
  },
};

// Step - Run Command
Blockly.Blocks["gha_step_run"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Step:")
      .appendField(new Blockly.FieldTextInput("Run Command"), "STEP_NAME");
    this.appendDummyInput()
      .appendField("Run:")
      .appendField(new Blockly.FieldTextInput("echo 'Hello World'"), "RUN");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
    this.setTooltip("Run a shell command");
    this.setHelpUrl("");
  },
};

// Step - Multi-line Run
Blockly.Blocks["gha_step_run_multiline"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Step:")
      .appendField(new Blockly.FieldTextInput("Run Script"), "STEP_NAME");
    this.appendDummyInput()
      .appendField("Shell:")
      .appendField(
        new Blockly.FieldDropdown([
          ["bash", "bash"],
          ["sh", "sh"],
          ["cmd", "cmd"],
          ["powershell", "powershell"],
          ["python", "python"],
        ]),
        "SHELL"
      );
    this.appendDummyInput().appendField("Script:");
    this.appendDummyInput().appendField(
      new Blockly.FieldTextInput(
        "#!/bin/bash\necho 'Multi-line script'\nls -la"
      ),
      "SCRIPT"
    );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
    this.setTooltip("Run a multi-line script");
    this.setHelpUrl("");
  },
};

// With Parameters Block
Blockly.Blocks["gha_with_params"] = {
  init: function () {
    this.appendDummyInput().appendField("With Parameters");
    this.appendDummyInput()
      .appendField("Key:")
      .appendField(new Blockly.FieldTextInput("node-version"), "KEY1")
      .appendField("Value:")
      .appendField(new Blockly.FieldTextInput("18"), "VALUE1");
    this.appendDummyInput()
      .appendField("Key:")
      .appendField(new Blockly.FieldTextInput("cache"), "KEY2")
      .appendField("Value:")
      .appendField(new Blockly.FieldTextInput("npm"), "VALUE2");
    this.setOutput(true, null);
    this.setColour(330);
    this.setTooltip("Parameters for action steps");
    this.setHelpUrl("");
  },
};

// Environment Variables Block
Blockly.Blocks["gha_env_vars"] = {
  init: function () {
    this.appendDummyInput().appendField("Environment Variables");
    this.appendDummyInput()
      .appendField("Name:")
      .appendField(new Blockly.FieldTextInput("NODE_ENV"), "NAME1")
      .appendField("Value:")
      .appendField(new Blockly.FieldTextInput("production"), "VALUE1");
    this.appendDummyInput()
      .appendField("Name:")
      .appendField(new Blockly.FieldTextInput("API_URL"), "NAME2")
      .appendField("Value:")
      .appendField(
        new Blockly.FieldTextInput("${{ secrets.API_URL }}"),
        "VALUE2"
      );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
    this.setTooltip("Set environment variables for steps");
    this.setHelpUrl("");
  },
};

// Step Condition Block
Blockly.Blocks["gha_step_condition"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("If:")
      .appendField(
        new Blockly.FieldDropdown([
          ["success()", "success()"],
          ["failure()", "failure()"],
          ["always()", "always()"],
          ["cancelled()", "cancelled()"],
          [
            "github.ref == 'refs/heads/main'",
            "github.ref == 'refs/heads/main'",
          ],
          ["runner.os == 'Linux'", "runner.os == 'Linux'"],
          ["Custom", "custom"],
        ]),
        "CONDITION"
      );
    this.appendDummyInput()
      .appendField("Custom:")
      .appendField(new Blockly.FieldTextInput(""), "CUSTOM_CONDITION");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(210);
    this.setTooltip("Add condition to control step execution");
    this.setHelpUrl("");
  },
};

// Strategy Matrix Block
Blockly.Blocks["gha_strategy_matrix"] = {
  init: function () {
    this.appendDummyInput().appendField("Strategy Matrix");
    this.appendDummyInput()
      .appendField("OS:")
      .appendField(
        new Blockly.FieldTextInput("ubuntu-latest, windows-latest"),
        "OS"
      );
    this.appendDummyInput()
      .appendField("Node Version:")
      .appendField(new Blockly.FieldTextInput("16, 18, 20"), "NODE_VERSION");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(160);
    this.setTooltip("Define a matrix strategy for parallel jobs");
    this.setHelpUrl("");
  },
};

export const initializeGitHubActionsBlocks = () => {
  console.log("GitHub Actions blocks initialized");
};
