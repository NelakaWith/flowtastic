export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: "CI/CD" | "Deployment" | "Testing" | "Release" | "Automation";
  blocks: string; // XML representation of Blockly workspace
}

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: "nodejs-ci",
    name: "Node.js CI",
    description: "Build and test Node.js application on multiple versions",
    category: "CI/CD",
    blocks: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="gha_workflow_name" x="10" y="10">
    <field name="NAME">Node.js CI</field>
    <next>
      <block type="gha_trigger">
        <field name="TRIGGER_TYPE">push</field>
        <next>
          <block type="gha_trigger">
            <field name="TRIGGER_TYPE">pull_request</field>
            <next>
              <block type="gha_job">
                <field name="JOB_NAME">build</field>
                <field name="RUNS_ON">ubuntu-latest</field>
                <field name="NEEDS"></field>
                <statement name="STEPS">
                  <block type="gha_step_uses">
                    <field name="STEP_NAME">Checkout code</field>
                    <field name="USES">actions/checkout@v4</field>
                    <next>
                      <block type="gha_step_uses">
                        <field name="STEP_NAME">Setup Node.js</field>
                        <field name="USES">actions/setup-node@v4</field>
                        <value name="WITH">
                          <block type="gha_with_params">
                            <field name="KEY">node-version</field>
                            <field name="VALUE">20</field>
                          </block>
                        </value>
                        <next>
                          <block type="gha_step_run">
                            <field name="STEP_NAME">Install dependencies</field>
                            <field name="RUN">npm ci</field>
                            <next>
                              <block type="gha_step_run">
                                <field name="STEP_NAME">Run tests</field>
                                <field name="RUN">npm test</field>
                                <next>
                                  <block type="gha_step_run">
                                    <field name="STEP_NAME">Build project</field>
                                    <field name="RUN">npm run build</field>
                                  </block>
                                </next>
                              </block>
                            </next>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </statement>
              </block>
            </next>
          </block>
        </next>
      </block>
    </next>
  </block>
</xml>`,
  },
  {
    id: "docker-build-push",
    name: "Docker Build & Push",
    description: "Build Docker image and push to container registry",
    category: "CI/CD",
    blocks: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="gha_workflow_name" x="10" y="10">
    <field name="NAME">Docker Build and Push</field>
    <next>
      <block type="gha_trigger">
        <field name="TRIGGER_TYPE">push</field>
        <next>
          <block type="gha_job">
            <field name="JOB_NAME">build</field>
            <field name="RUNS_ON">ubuntu-latest</field>
            <field name="NEEDS"></field>
            <statement name="STEPS">
              <block type="gha_step_uses">
                <field name="STEP_NAME">Checkout</field>
                <field name="USES">actions/checkout@v4</field>
                <next>
                  <block type="gha_step_run">
                    <field name="STEP_NAME">Build Docker</field>
                    <field name="RUN">docker build -t myapp .</field>
                  </block>
                </next>
              </block>
            </statement>
          </block>
        </next>
      </block>
    </next>
  </block>
</xml>`,
  },
  {
    id: "python-test",
    name: "Python Testing",
    description: "Test Python application with pytest across multiple versions",
    category: "Testing",
    blocks: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="gha_workflow_name" x="10" y="10">
    <field name="NAME">Python Tests</field>
    <next>
      <block type="gha_trigger">
        <field name="TRIGGER_TYPE">push</field>
        <next>
          <block type="gha_trigger">
            <field name="TRIGGER_TYPE">pull_request</field>
            <next>
              <block type="gha_job">
        <field name="JOB_NAME">test</field>
        <field name="RUNS_ON">ubuntu-latest</field>
        <field name="NEEDS"></field>
        <value name="STRATEGY">
          <block type="gha_strategy_matrix">
            <field name="MATRIX_KEY">python-version</field>
            <field name="MATRIX_VALUES">3.9, 3.10, 3.11, 3.12</field>
          </block>
        </value>
        <statement name="STEPS">
          <block type="gha_step_uses">
            <field name="STEP_NAME">Checkout</field>
            <field name="USES">actions/checkout@v4</field>
            <next>
              <block type="gha_step_uses">
                <field name="STEP_NAME">Setup Python</field>
                <field name="USES">actions/setup-python@v5</field>
                <value name="WITH">
                  <block type="gha_with_params">
                    <field name="KEY">python-version</field>
                    <field name="VALUE">\${{ matrix.python-version }}</field>
                  </block>
                </value>
                <next>
                  <block type="gha_step_run">
                    <field name="STEP_NAME">Install dependencies</field>
                    <field name="RUN">pip install -r requirements.txt</field>
                    <next>
                      <block type="gha_step_run">
                        <field name="STEP_NAME">Run tests</field>
                        <field name="RUN">pytest</field>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
              </block>
            </next>
          </block>
        </next>
      </block>
    </next>
  </block>
</xml>`,
  },
  {
    id: "release-npm",
    name: "NPM Release",
    description: "Publish package to NPM registry on release",
    category: "Release",
    blocks: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="gha_workflow_name" x="10" y="10">
    <field name="NAME">Publish to NPM</field>
    <next>
      <block type="gha_trigger">
        <field name="TRIGGER_TYPE">release</field>
        <value name="CONFIG">
          <block type="gha_release_config">
            <field name="TYPES">published</field>
          </block>
        </value>
        <next>
          <block type="gha_job">
            <field name="JOB_NAME">publish</field>
            <field name="RUNS_ON">ubuntu-latest</field>
            <field name="NEEDS"></field>
            <statement name="STEPS">
              <block type="gha_step_uses">
                <field name="STEP_NAME">Checkout</field>
                <field name="USES">actions/checkout@v4</field>
            <next>
              <block type="gha_step_uses">
                <field name="STEP_NAME">Setup Node</field>
                <field name="USES">actions/setup-node@v4</field>
                <next>
                  <block type="gha_step_run">
                    <field name="STEP_NAME">Install</field>
                    <field name="RUN">npm ci</field>
                    <next>
                      <block type="gha_step_run">
                        <field name="STEP_NAME">Build</field>
                        <field name="RUN">npm run build</field>
                        <next>
                          <block type="gha_step_run">
                            <field name="STEP_NAME">Publish</field>
                            <field name="RUN">NODE_AUTH_TOKEN=\${{ secrets.NPM_TOKEN }} npm publish</field>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
          </block>
        </next>
      </block>
    </next>
  </block>
</xml>`,
  },
  {
    id: "deploy-pages",
    name: "Deploy to GitHub Pages",
    description: "Build and deploy static site to GitHub Pages",
    category: "Deployment",
    blocks: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="gha_workflow_name" x="10" y="10">
    <field name="NAME">Deploy to GitHub Pages</field>
    <value name="PERMISSIONS">
      <block type="gha_permissions">
        <field name="PERMISSION_TYPE">contents</field>
        <field name="PERMISSION_LEVEL">read</field>
        <next>
          <block type="gha_permissions">
            <field name="PERMISSION_TYPE">pages</field>
            <field name="PERMISSION_LEVEL">write</field>
            <next>
              <block type="gha_permissions">
                <field name="PERMISSION_TYPE">id-token</field>
                <field name="PERMISSION_LEVEL">write</field>
              </block>
            </next>
          </block>
        </next>
      </block>
    </value>
    <next>
      <block type="gha_trigger">
        <field name="TRIGGER_TYPE">push</field>
        <value name="CONFIG">
          <block type="gha_push_config">
            <field name="BRANCHES">main</field>
          </block>
        </value>
        <next>
          <block type="gha_job">
            <field name="JOB_NAME">build</field>
            <field name="RUNS_ON">ubuntu-latest</field>
            <field name="NEEDS"></field>
            <statement name="STEPS">
          <block type="gha_step_uses">
            <field name="STEP_NAME">Checkout</field>
            <field name="USES">actions/checkout@v4</field>
            <next>
              <block type="gha_step_uses">
                <field name="STEP_NAME">Setup Pages</field>
                <field name="USES">actions/configure-pages@v4</field>
                <next>
                  <block type="gha_step_run">
                    <field name="STEP_NAME">Build</field>
                    <field name="RUN">npm ci &amp;&amp; npm run build</field>
                    <next>
                      <block type="gha_step_uses">
                        <field name="STEP_NAME">Upload artifact</field>
                        <field name="USES">actions/upload-pages-artifact@v3</field>
                        <value name="WITH">
                          <block type="gha_with_params">
                            <field name="KEY">path</field>
                            <field name="VALUE">./dist</field>
                          </block>
                        </value>
                      </block>
                          </block>
                        </statement>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
            </block>
          <next>
            <block type="gha_job">
              <field name="JOB_NAME">deploy</field>
              <field name="RUNS_ON">ubuntu-latest</field>
              <field name="NEEDS">build</field>
              <statement name="STEPS">
                <block type="gha_step_uses">
                  <field name="STEP_NAME">Deploy to GitHub Pages</field>
                  <field name="USES">actions/deploy-pages@v4</field>
                </block>
              </statement>
            </block>
          </next>
        </block>
      </next>
    </block>
  </next>
</xml>`,
  },
];
