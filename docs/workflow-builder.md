# Workflow Builder MVP Plan

## 🎯 Goal

Build a block-based **CI/CD Workflow Builder** that lets developers
visually design workflows and export them to YAML (starting with GitHub
Actions).

------------------------------------------------------------------------

## 🚀 Phase 1: MVP (Blockly + React)

-   **Tech stack**:

    -   React + TypeScript + Vite\
    -   [Blockly](https://developers.google.com/blockly) (for block
        coding UI)\
    -   [yaml](https://www.npmjs.com/package/yaml) (convert JSON → YAML)

-   **Features**:

    -   Palette with basic workflow blocks:
        -   **Workflow** (root)\
        -   **Job** (name, runner, needs)\
        -   **Step** (run, uses, with)\
    -   Export button → Generate `.yml` file\
    -   Import button → Parse YAML → Render blocks

-   **Data Flow**:

    1.  **Blocks → JSON** (Blockly workspace → custom serializer)\
    2.  **JSON → YAML** (using `yaml` package)\
    3.  **YAML → JSON → Blocks** (for imports)

-   **Example JSON model**:

    ``` json
    {
      "name": "CI Build",
      "jobs": {
        "build": {
          "runs-on": "ubuntu-latest",
          "steps": [
            { "uses": "actions/checkout@v3" },
            { "run": "npm install" },
            { "run": "npm test" }
          ]
        }
      }
    }
    ```

------------------------------------------------------------------------

## 📦 Packaging Strategy

-   **npm package (devDependency)**:
    -   Installed via `npm i -D workflow-builder`\
    -   Run locally with `npx workflow-builder` → launches UI server\
-   Later: **Electron/Tauri app** for desktop users

------------------------------------------------------------------------

## 🔄 Phase 2: Improvements

-   Templates for common workflows (Node.js CI, Docker build, Deploy to
    Netlify, etc.)\
-   Validation of blocks (missing job name, runner, etc.)\
-   Live preview: show YAML as you build\
-   Theme: light/dark mode

------------------------------------------------------------------------

## 🌐 Phase 3: React Flow Migration

-   Replace Blockly with **React Flow** for a graph-style editor\
-   Map jobs as **nodes** and dependencies as **edges**\
-   Hybrid mode: blocks for step details + graph for job dependencies\
-   Future expansion: support **GitLab CI**, **Bitbucket Pipelines**,
    **Azure DevOps**

------------------------------------------------------------------------

## 📂 Suggested Project Structure

    workflow-builder/
    ├── public/
    ├── src/
    │   ├── blocks/          # Blockly custom blocks
    │   ├── components/      # React UI components
    │   │   ├── BlocklyEditor.tsx
    │   │   ├── ExportButton.tsx
    │   │   └── ImportButton.tsx
    │   ├── utils/
    │   │   ├── yamlConverter.ts
    │   │   └── jsonMapper.ts
    │   ├── App.tsx
    │   └── main.tsx
    ├── package.json
    └── vite.config.ts

------------------------------------------------------------------------

## ✅ Next Steps

1.  Scaffold project:

    ``` bash
    npx create-vite@latest workflow-builder --template react-ts
    cd workflow-builder
    npm install blockly yaml
    ```

2.  Create minimal **BlocklyEditor** with one block
    (`workflow → job → step`).\

3.  Build JSON → YAML exporter.\

4.  Build YAML → JSON importer.\

5.  Package as npm CLI (`bin/workflow-builder.js`).
