import type { Workflow, WorkflowStep } from "./blockToWorkflow";

/**
 * A single step in the generated GitHub Actions workflow structure.
 * This mirrors common properties used by GitHub Actions YAML steps.
 * @public
 */
export interface GitHubActionsStep {
  name: string;
  uses?: string;
  run?: string;
  with?: Record<string, unknown>;
  env?: Record<string, string>;
  if?: string;
  "continue-on-error"?: boolean;
}

export interface GitHubActionsStep {
  name: string;
  uses?: string;
  run?: string;
  with?: Record<string, unknown>;
  env?: Record<string, string>;
  if?: string;
  "continue-on-error"?: boolean;
}

/**
 * Top-level shape for a generated GitHub Actions workflow.
 * The converter produces objects compatible with js-yaml serialization
 * to create a .github/workflows/*.yml file.
 * @public
 */
export interface GitHubActionsWorkflow {
  name: string;
  permissions?: Record<string, string>;
  on: Record<string, unknown>;
  jobs: {
    [jobName: string]: {
      "runs-on": string;
      permissions?: Record<string, string>;
      steps: GitHubActionsStep[];
    };
  };
}

/**
 * Convert a generic WorkflowStep representing the trigger into the
 * GitHub Actions `on:` object. This is intentionally permissive and
 * supplies sensible defaults when the trigger is missing.
 * @param trigger - Optional workflow trigger produced by the workspace
 * @returns object suitable for the `on` key in a GitHub Actions workflow
 */
const convertTriggerToOn = (
  trigger?: WorkflowStep
): Record<string, unknown> => {
  if (!trigger) {
    return { workflow_dispatch: {} };
  }

  const triggerType = trigger.triggerType as string;

  switch (triggerType) {
    case "webhook":
      return {
        push: {
          branches: ["main"],
        },
      };
    case "schedule":
      return {
        schedule: [
          { cron: "0 0 * * *" }, // Daily at midnight
        ],
      };
    case "manual":
      return {
        workflow_dispatch: {},
      };
    case "event":
      return {
        pull_request: {
          branches: ["main"],
        },
      };
    default:
      return { workflow_dispatch: {} };
  }
};

/**
 * Map a generic workflow action step (from blockly `WorkflowStep`) to
 * a GitHub Actions step object. This function covers several
 * high-level action types (checkout, setup-node, deploy helpers, etc.).
 * @param step - WorkflowStep from the generic converter
 * @param index - index used to create a fallback name when missing
 */
const convertActionToStep = (
  step: WorkflowStep,
  index: number
): GitHubActionsStep => {
  const stepName = (step.name as string) || `Step ${index + 1}`;
  const actionType = step.actionType as string;

  switch (actionType) {
    case "api_call":
      return {
        name: `🌐 ${stepName}`,
        run: `curl -X GET "https://api.example.com/endpoint" \\
  -H "Authorization: Bearer \${{ secrets.API_TOKEN }}" \\
  -H "Content-Type: application/json"`,
      };

    case "function": {
      // Map common function names to GitHub Actions
      const lowerName = stepName.toLowerCase();
      if (lowerName.includes("checkout")) {
        return {
          name: "📦 Checkout Repository",
          uses: "actions/checkout@v4",
        };
      } else if (lowerName.includes("setup") && lowerName.includes("node")) {
        return {
          name: "🔧 Setup Node.js",
          uses: "actions/setup-node@v4",
          with: {
            "node-version": "18",
            cache: "npm",
          },
        };
      } else if (lowerName.includes("deploy")) {
        return {
          name: `🚀 ${stepName}`,
          uses: "appleboy/ssh-action@v1.0.0",
          with: {
            host: "${{ secrets.HOST }}",
            username: "${{ secrets.USERNAME }}",
            key: "${{ secrets.SSH_PRIVATE_KEY }}",
            script: 'echo "Add your deployment script here"',
          },
        };
      } else {
        return {
          name: `⚡ ${stepName}`,
          run: `echo "Execute ${stepName}"`,
        };
      }
    }

    case "email":
      return {
        name: `📧 ${stepName}`,
        uses: "dawidd6/action-send-mail@v3",
        with: {
          server_address: "${{ secrets.SMTP_SERVER }}",
          server_port: 587,
          username: "${{ secrets.SMTP_USERNAME }}",
          password: "${{ secrets.SMTP_PASSWORD }}",
          subject: "Workflow Notification",
          body: "Your workflow has completed successfully.",
        },
      };

    case "database":
      return {
        name: `🗄️ ${stepName}`,
        run: `echo "Database operation: ${stepName}"`,
      };

    default:
      return {
        name: stepName,
        run: `echo "Action: ${actionType}"`,
      };
  }
};

/**
 * Convert a generic WorkflowStep (which may represent control flow,
 * http requests, notifications, or action/run steps) into one or more
 * GitHub Actions steps. Some complex blocks expand into multiple
 * sequential steps (e.g. condition blocks).
 * @param step - WorkflowStep to convert
 * @param index - index of the step in the overall workflow
 * @returns a GitHubActionsStep or an array of steps
 */
const convertStepToGitHubActions = (
  step: WorkflowStep,
  index: number
): GitHubActionsStep | GitHubActionsStep[] => {
  switch (step.type) {
    case "workflow_action":
      return convertActionToStep(step, index);

    case "workflow_condition": {
      const conditionSteps: GitHubActionsStep[] = [];

      // Add condition check step
      conditionSteps.push({
        name: "🔍 Check Condition",
        run: `echo "Evaluating condition"`,
      });

      // Add then steps
      if (step.then && Array.isArray(step.then)) {
        step.then.forEach((thenStep: WorkflowStep, thenIndex: number) => {
          const converted = convertStepToGitHubActions(thenStep, thenIndex);
          if (Array.isArray(converted)) {
            converted.forEach((s) => {
              s.name = `✅ ${s.name}`;
              s.if = "success()";
            });
            conditionSteps.push(...converted);
          } else {
            converted.name = `✅ ${converted.name}`;
            converted.if = "success()";
            conditionSteps.push(converted);
          }
        });
      }

      return conditionSteps;
    }

    case "workflow_http_request": {
      const method = (step.METHOD as string) || "GET";
      const url = (step.URL as string) || "https://api.example.com";

      return {
        name: `🌐 HTTP ${method}`,
        run: `curl -X ${method} "${url}" \\
  -H "Content-Type: application/json" \\
  -d '{"data": "example"}'`,
      };
    }

    case "workflow_notification": {
      const notificationType = (step.NOTIFICATION_TYPE as string) || "slack";

      if (notificationType === "slack") {
        return {
          name: "💬 Send Slack Notification",
          uses: "rtCamp/action-slack-notify@v2",
          env: {
            SLACK_WEBHOOK: "${{ secrets.SLACK_WEBHOOK }}",
          },
        };
      } else if (notificationType === "email") {
        return {
          name: "📧 Send Email Notification",
          uses: "dawidd6/action-send-mail@v3",
          with: {
            server_address: "${{ secrets.SMTP_SERVER }}",
            server_port: 587,
            username: "${{ secrets.SMTP_USERNAME }}",
            password: "${{ secrets.SMTP_PASSWORD }}",
            subject: "Workflow Notification",
            body: (step.MESSAGE as string) || "Workflow completed",
          },
        };
      }

      return {
        name: `📢 ${notificationType} Notification`,
        run: `echo "Send ${notificationType} notification"`,
      };
    }

    case "workflow_delay": {
      const duration = (step.DURATION as number) || 1;
      const unit = (step.UNIT as string) || "seconds";

      return {
        name: `⏳ Wait ${duration} ${unit}`,
        run: `sleep ${unit === "minutes" ? duration * 60 : duration}`,
      };
    }

    case "workflow_try_catch":
      return {
        name: "🛡️ Execute with Error Handling",
        run: 'echo "Execute with error handling"',
        "continue-on-error": true,
      };

    case "workflow_end": {
      const status = (step.status as string) || "success";
      return {
        name: `🏁 Workflow ${status}`,
        run: `echo "Workflow completed with status: ${status}"`,
      };
    }

    default:
      return {
        name: `❓ ${step.type}`,
        run: `echo "Unknown step type: ${step.type}"`,
      };
  }
};

/**
 * Convert the generic Workflow (produced by `blocklyToWorkflow`) into a
 * GitHub Actions workflow object.
 *
 * The returned object is suitable for serialization to YAML via
 * `js-yaml` and follows the minimal structure required by GitHub.
 *
 * @example
 * const gha = workflowToGitHubActions(workflow);
 * const yaml = yaml.dump(gha);
 *
 * @param workflow - Workflow object from the workspace converter
 * @returns a GitHubActionsWorkflow shaped object
 * @public
 */
export const workflowToGitHubActions = (
  workflow: Workflow
): GitHubActionsWorkflow => {
  const githubWorkflow: GitHubActionsWorkflow = {
    name: workflow.name || "Generated Workflow",
    permissions: {
      contents: "read",
    },
    on: convertTriggerToOn(workflow.trigger),
    jobs: {
      workflow: {
        "runs-on": "ubuntu-latest",
        steps: [],
      },
    },
  };

  // Add default checkout step if not present
  const hasCheckout = workflow.steps.some(
    (step) =>
      step.type === "workflow_action" &&
      step.actionType === "function" &&
      (step.name as string)?.toLowerCase().includes("checkout")
  );

  if (!hasCheckout && workflow.steps.length > 0) {
    githubWorkflow.jobs.workflow.steps.push({
      name: "📦 Checkout Repository",
      uses: "actions/checkout@v4",
    });
  }

  // Convert workflow steps
  workflow.steps.forEach((step, index) => {
    const converted = convertStepToGitHubActions(step, index);

    if (Array.isArray(converted)) {
      githubWorkflow.jobs.workflow.steps.push(...converted);
    } else {
      githubWorkflow.jobs.workflow.steps.push(converted);
    }
  });

  // Add permissions based on step types
  const hasDeployment = workflow.steps.some(
    (step) =>
      (step.name as string)?.toLowerCase().includes("deploy") ||
      (step.type === "workflow_action" && step.actionType === "function")
  );

  if (hasDeployment) {
    githubWorkflow.permissions!.deployments = "write";
    githubWorkflow.jobs.workflow.permissions = {
      deployments: "write",
    };
  }

  return githubWorkflow;
};
