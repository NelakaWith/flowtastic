export const toolboxConfig = {
  kind: "categoryToolbox",
  contents: [
    {
      kind: "category",
      name: "Workflow",
      colour: "230",
      contents: [
        {
          kind: "block",
          type: "workflow_trigger",
        },
        {
          kind: "block",
          type: "workflow_action",
        },
        {
          kind: "block",
          type: "workflow_condition",
        },
        {
          kind: "block",
          type: "workflow_end",
        },
        {
          kind: "block",
          type: "workflow_simple_condition",
        },
        {
          kind: "block",
          type: "workflow_loop",
        },
        {
          kind: "block",
          type: "workflow_try_catch",
        },
        {
          kind: "block",
          type: "workflow_delay",
        },
        {
          kind: "block",
          type: "workflow_parallel",
        },
      ],
    },
    {
      kind: "category",
      name: "GitHub Actions",
      colour: "160",
      contents: [
        {
          kind: "block",
          type: "gha_workflow_name",
        },
        {
          kind: "block",
          type: "gha_permissions",
        },
        {
          kind: "block",
          type: "gha_trigger",
        },
        {
          kind: "block",
          type: "gha_push_config",
        },
        {
          kind: "block",
          type: "gha_pull_request_config",
        },
        {
          kind: "block",
          type: "gha_workflow_dispatch_config",
        },
        {
          kind: "block",
          type: "gha_release_config",
        },
        {
          kind: "block",
          type: "gha_issues_config",
        },
        {
          kind: "block",
          type: "gha_repository_dispatch_config",
        },
        {
          kind: "block",
          type: "gha_workflow_call_config",
        },
        {
          kind: "block",
          type: "gha_schedule_config",
        },
        {
          kind: "block",
          type: "gha_job",
        },
        {
          kind: "block",
          type: "gha_job_permissions",
        },
        {
          kind: "block",
          type: "gha_step_uses",
        },
        {
          kind: "block",
          type: "gha_step_run",
        },
        {
          kind: "block",
          type: "gha_step_run_multiline",
        },
        {
          kind: "block",
          type: "gha_step_run_enhanced",
        },
        {
          kind: "block",
          type: "gha_with_params",
        },
        {
          kind: "block",
          type: "gha_env_vars",
        },
        {
          kind: "block",
          type: "gha_step_condition",
        },
        {
          kind: "block",
          type: "gha_strategy_matrix",
        },
      ],
    },
    {
      kind: "category",
      name: "Data & Variables",
      colour: "330",
      contents: [
        {
          kind: "block",
          type: "workflow_parameter",
        },
        {
          kind: "block",
          type: "workflow_variable",
        },
        {
          kind: "block",
          type: "workflow_transform",
        },
      ],
    },
    {
      kind: "category",
      name: "Actions",
      colour: "260",
      contents: [
        {
          kind: "block",
          type: "workflow_http_request",
        },
        {
          kind: "block",
          type: "workflow_notification",
        },
      ],
    },
    {
      kind: "category",
      name: "Logic",
      colour: "210",
      contents: [
        {
          kind: "block",
          type: "controls_if",
        },
        {
          kind: "block",
          type: "logic_compare",
        },
        {
          kind: "block",
          type: "logic_operation",
        },
        {
          kind: "block",
          type: "logic_negate",
        },
        {
          kind: "block",
          type: "logic_boolean",
        },
        {
          kind: "block",
          type: "logic_null",
        },
        {
          kind: "block",
          type: "logic_ternary",
        },
      ],
    },
    {
      kind: "category",
      name: "Text",
      colour: "160",
      contents: [
        {
          kind: "block",
          type: "text",
        },
        {
          kind: "block",
          type: "text_join",
        },
        {
          kind: "block",
          type: "text_append",
        },
        {
          kind: "block",
          type: "text_length",
        },
        {
          kind: "block",
          type: "text_isEmpty",
        },
        {
          kind: "block",
          type: "text_indexOf",
        },
        {
          kind: "block",
          type: "text_charAt",
        },
      ],
    },
    {
      kind: "category",
      name: "Math",
      colour: "230",
      contents: [
        {
          kind: "block",
          type: "math_number",
        },
        {
          kind: "block",
          type: "math_arithmetic",
        },
        {
          kind: "block",
          type: "math_single",
        },
        {
          kind: "block",
          type: "math_trig",
        },
        {
          kind: "block",
          type: "math_constant",
        },
        {
          kind: "block",
          type: "math_number_property",
        },
        {
          kind: "block",
          type: "math_round",
        },
        {
          kind: "block",
          type: "math_modulo",
        },
        {
          kind: "block",
          type: "math_constrain",
        },
        {
          kind: "block",
          type: "math_random_int",
        },
        {
          kind: "block",
          type: "math_random_float",
        },
      ],
    },
    {
      kind: "category",
      name: "Lists",
      colour: "260",
      contents: [
        {
          kind: "block",
          type: "lists_create_with",
        },
        {
          kind: "block",
          type: "lists_repeat",
        },
        {
          kind: "block",
          type: "lists_length",
        },
        {
          kind: "block",
          type: "lists_isEmpty",
        },
        {
          kind: "block",
          type: "lists_indexOf",
        },
        {
          kind: "block",
          type: "lists_getIndex",
        },
        {
          kind: "block",
          type: "lists_setIndex",
        },
        {
          kind: "block",
          type: "lists_getSublist",
        },
        {
          kind: "block",
          type: "lists_split",
        },
        {
          kind: "block",
          type: "lists_sort",
        },
      ],
    },
  ],
};

export const blocklyOptions = {
  toolbox: toolboxConfig,
  collapse: true,
  comments: true,
  disable: true,
  maxBlocks: Infinity,
  trashcan: true,
  horizontalLayout: false,
  toolboxPosition: "start",
  css: true,
  media: "https://unpkg.com/blockly/media/",
  rtl: false,
  scrollbars: true,
  sounds: true,
  oneBasedIndex: true,
  grid: {
    spacing: 20,
    length: 1,
    colour: "#888",
    snap: true,
  },
  zoom: {
    controls: true,
    wheel: true,
    startScale: 1.0,
    maxScale: 3,
    minScale: 0.3,
    scaleSpeed: 1.2,
  },
};
