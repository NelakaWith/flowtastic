import * as Blockly from "blockly";

// Define a reusable dark theme for the Flowtastic workspace.
// Export the theme so other modules (or a theme toggle) can reuse it.
export const flowtasticDark = Blockly.Theme.defineTheme("flowtastic_dark", {
  name: "flowtastic_dark",
  base: Blockly.Themes.Classic,

  blockStyles: {
    // Default colour groups — tweak as needed
    colour_blocks: {
      colourPrimary: "#4f46e5",
      colourSecondary: "#4338ca",
      colourTertiary: "#312e81",
    },
    list_blocks: {
      colourPrimary: "#0ea5a4",
      colourSecondary: "#0891b2",
      colourTertiary: "#075985",
    },
    logic_blocks: {
      colourPrimary: "#7c3aed",
      colourSecondary: "#6d28d9",
      colourTertiary: "#5b21b6",
    },
    text_blocks: {
      colourPrimary: "#0ea5a4",
      colourSecondary: "#0891b2",
      colourTertiary: "#075985",
    },
  },

  categoryStyles: {
    // categories in toolbox
    workflow_category: {
      colour: "#10b981",
    },
    parameters_category: {
      colour: "#06b6d4",
    },
    logic_category: {
      colour: "#8b5cf6",
    },
    text_category: {
      colour: "#06b6d4",
    },
  },

  componentStyles: {
    workspaceBackgroundColour: "#071024",
    toolboxBackgroundColour: "#0b1220",
    toolboxForegroundColour: "#e6eef8",
    flyoutBackgroundColour: "#071024",
    flyoutForegroundColour: "#cbd5e1",
    flyoutOpacity: 1,
    scrollbarColour: "#334155",
    insertionMarkerColour: "#60a5fa",
    markerColour: "#60a5fa",
    insertionMarkerOpacity: 0.3,
  },

  fontStyle: {
    family:
      'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    weight: "400",
  },

  // no start hats for now (depends on UX preference)
  startHats: false,
});

export default flowtasticDark;
