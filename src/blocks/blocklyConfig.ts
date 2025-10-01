export const toolboxConfig = {
  kind: "categoryToolbox",
  contents: [
    {
      kind: "category",
      name: "Workflow",
      colour: "120",
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
      ],
    },
    {
      kind: "category",
      name: "Parameters",
      colour: "290",
      contents: [
        {
          kind: "block",
          type: "workflow_parameter",
        },
        {
          kind: "block",
          type: "workflow_simple_condition",
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
          type: "logic_boolean",
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
