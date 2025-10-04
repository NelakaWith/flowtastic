import * as Blockly from "blockly";

/**
 * GitHub Actions Blockly block definitions.
 *
 * This module registers a set of `gha_*` blocks modelling the common
 * GitHub Actions workflow concepts (workflow name, triggers, jobs,
 * steps, permissions, etc.). Blocks are registered on import via
 * the global `Blockly.Blocks` registry.
 */

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
          ["Pull Request Target", "pull_request_target"],
          ["Schedule", "schedule"],
          ["Manual", "workflow_dispatch"],
          ["Release", "release"],
          ["Issues", "issues"],
          ["Repository Dispatch", "repository_dispatch"],
          ["Workflow Call", "workflow_call"],
          ["Watch", "watch"],
          ["Fork", "fork"],
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

// Pull Request Config Block
Blockly.Blocks["gha_pull_request_config"] = {
  init: function () {
    this.appendDummyInput().appendField("Pull Request Config");
    this.appendDummyInput()
      .appendField("Types:")
      .appendField(
        new Blockly.FieldTextInput("opened,synchronize,closed"),
        "TYPES"
      );
    this.appendDummyInput()
      .appendField("Branches:")
      .appendField(new Blockly.FieldTextInput("main"), "BRANCHES");
    this.appendDummyInput()
      .appendField("Paths:")
      .appendField(new Blockly.FieldTextInput(""), "PATHS");
    this.setOutput(true, null);
    this.setColour(120);
    this.setTooltip("Configure pull request trigger (comma-separated values)");
    this.setHelpUrl("");
  },
};

// Workflow Dispatch Config Block
Blockly.Blocks["gha_workflow_dispatch_config"] = {
  init: function () {
    this.appendDummyInput().appendField("Manual Trigger Config");
    this.appendDummyInput()
      .appendField("Input Name:")
      .appendField(new Blockly.FieldTextInput("environment"), "INPUT_NAME");
    this.appendDummyInput()
      .appendField("Description:")
      .appendField(
        new Blockly.FieldTextInput("Environment to deploy"),
        "DESCRIPTION"
      );
    this.appendDummyInput()
      .appendField("Type:")
      .appendField(
        new Blockly.FieldDropdown([
          ["string", "string"],
          ["choice", "choice"],
          ["boolean", "boolean"],
          ["environment", "environment"],
        ]),
        "INPUT_TYPE"
      );
    this.appendDummyInput()
      .appendField("Default:")
      .appendField(new Blockly.FieldTextInput("staging"), "DEFAULT");
    this.appendDummyInput()
      .appendField("Required:")
      .appendField(
        new Blockly.FieldDropdown([
          ["true", "true"],
          ["false", "false"],
        ]),
        "REQUIRED"
      );
    this.appendDummyInput()
      .appendField("Options:")
      .appendField(new Blockly.FieldTextInput("staging,production"), "OPTIONS");
    this.setOutput(true, null);
    this.setColour(120);
    this.setTooltip("Configure manual workflow trigger with inputs");
    this.setHelpUrl("");
  },
};

// Release Config Block
Blockly.Blocks["gha_release_config"] = {
  init: function () {
    this.appendDummyInput().appendField("Release Config");
    this.appendDummyInput()
      .appendField("Types:")
      .appendField(
        new Blockly.FieldDropdown([
          ["published", "published"],
          ["created", "created"],
          ["released", "released"],
          ["prereleased", "prereleased"],
          ["edited", "edited"],
          ["deleted", "deleted"],
        ]),
        "TYPES"
      );
    this.setOutput(true, null);
    this.setColour(120);
    this.setTooltip("Configure release trigger types");
    this.setHelpUrl("");
  },
};

// Issues Config Block
Blockly.Blocks["gha_issues_config"] = {
  init: function () {
    this.appendDummyInput().appendField("Issues Config");
    this.appendDummyInput()
      .appendField("Types:")
      .appendField(
        new Blockly.FieldTextInput("opened,closed,labeled"),
        "TYPES"
      );
    this.setOutput(true, null);
    this.setColour(120);
    this.setTooltip("Configure issues trigger types (comma-separated)");
    this.setHelpUrl("");
  },
};

// Repository Dispatch Config Block
Blockly.Blocks["gha_repository_dispatch_config"] = {
  init: function () {
    this.appendDummyInput().appendField("Repository Dispatch Config");
    this.appendDummyInput()
      .appendField("Types:")
      .appendField(new Blockly.FieldTextInput("deploy,test"), "TYPES");
    this.setOutput(true, null);
    this.setColour(120);
    this.setTooltip(
      "Configure repository dispatch event types (comma-separated)"
    );
    this.setHelpUrl("");
  },
};

// Workflow Call Config Block
Blockly.Blocks["gha_workflow_call_config"] = {
  init: function () {
    this.appendDummyInput().appendField("Workflow Call Config");
    this.appendDummyInput()
      .appendField("Input Name:")
      .appendField(new Blockly.FieldTextInput("config"), "INPUT_NAME");
    this.appendDummyInput()
      .appendField("Type:")
      .appendField(
        new Blockly.FieldDropdown([
          ["string", "string"],
          ["number", "number"],
          ["boolean", "boolean"],
        ]),
        "INPUT_TYPE"
      );
    this.appendDummyInput()
      .appendField("Required:")
      .appendField(
        new Blockly.FieldDropdown([
          ["true", "true"],
          ["false", "false"],
        ]),
        "REQUIRED"
      );
    this.setOutput(true, null);
    this.setColour(120);
    this.setTooltip("Configure reusable workflow inputs");
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
    this.appendDummyInput()
      .appendField("Needs (comma-separated):")
      .appendField(new Blockly.FieldTextInput(""), "NEEDS");
    this.appendValueInput("PERMISSIONS")
      .setCheck(null)
      .appendField("Permissions");
    this.appendStatementInput("STEPS").setCheck(null).appendField("Steps");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip(
      "Define a job with its runner, dependencies, permissions, and steps"
    );
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
    this.setOutput(true, null); // Changed to output block
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
    this.appendDummyInput()
      .appendField("Working Directory:")
      .appendField(new Blockly.FieldTextInput(""), "WORKING_DIRECTORY");
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
    this.setTooltip("Run a multi-line script with optional working directory");
    this.setHelpUrl("");
  },
};

// Step - Enhanced Run (with working directory)
Blockly.Blocks["gha_step_run_enhanced"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Enhanced Step:")
      .appendField(new Blockly.FieldTextInput("Build"), "STEP_NAME");
    this.appendDummyInput()
      .appendField("Working Directory:")
      .appendField(new Blockly.FieldTextInput(""), "WORKING_DIRECTORY");
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
    this.appendDummyInput().appendField("Commands:");
    this.appendDummyInput().appendField(
      new Blockly.FieldTextInput("npm ci --ignore-scripts\nnpm run build"),
      "COMMANDS"
    );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
    this.setTooltip(
      "Enhanced step with working directory and multi-line commands"
    );
    this.setHelpUrl("");
  },
};

// With Parameters Block
Blockly.Blocks["gha_with_params"] = {
  init: function () {
    this.appendDummyInput().appendField("With Parameters");
    this.appendDummyInput()
      .appendField("Key:")
      .appendField(new Blockly.FieldTextInput(""), "KEY")
      .appendField("Value:")
      .appendField(new Blockly.FieldTextInput(""), "VALUE");
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

/**
 * Optional initializer called by the application to indicate the
 * GitHub Actions blocks are available. The registration happens on
 * import, so this function is a no-op used for clarity in the app
 * initialization sequence.
 *
 * @public
 */
export const initializeGitHubActionsBlocks = () => {
  console.log("GitHub Actions blocks initialized");
};
