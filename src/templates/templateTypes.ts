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
    <field name="WORKFLOW_NAME">Node.js CI</field>
    <statement name="TRIGGERS">
      <block type="gha_trigger">
        <field name="TRIGGER_TYPE">push</field>
        <next>
          <block type="gha_trigger">
            <field name="TRIGGER_TYPE">pull_request</field>
          </block>
        </next>
      </block>
    </statement>
    <statement name="JOBS">
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
                <statement name="WITH">
                  <block type="gha_with_params">
                    <field name="KEY">node-version</field>
                    <field name="VALUE">20</field>
                  </block>
                </statement>
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
                            <field name="STEP_NAME">Build</field>
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
    </statement>
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
    <field name="WORKFLOW_NAME">Docker Build and Push</field>
    <statement name="TRIGGERS">
      <block type="gha_trigger">
        <field name="TRIGGER_TYPE">push</field>
        <statement name="CONFIG">
          <block type="push_pull_request_config">
            <field name="BRANCHES">main</field>
            <field name="TAGS">v*</field>
          </block>
        </statement>
      </block>
    </statement>
    <statement name="JOBS">
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
                <field name="STEP_NAME">Login to Docker Hub</field>
                <field name="USES">docker/login-action@v3</field>
                <statement name="WITH">
                  <block type="gha_with_params">
                    <field name="KEY">username</field>
                    <field name="VALUE">\${{ secrets.DOCKER_USERNAME }}</field>
                    <next>
                      <block type="gha_with_params">
                        <field name="KEY">password</field>
                        <field name="VALUE">\${{ secrets.DOCKER_PASSWORD }}</field>
                      </block>
                    </next>
                  </block>
                </statement>
                <next>
                  <block type="gha_step_uses">
                    <field name="STEP_NAME">Build and push</field>
                    <field name="USES">docker/build-push-action@v5</field>
                    <statement name="WITH">
                      <block type="gha_with_params">
                        <field name="KEY">push</field>
                        <field name="VALUE">true</field>
                        <next>
                          <block type="gha_with_params">
                            <field name="KEY">tags</field>
                            <field name="VALUE">user/app:latest</field>
                          </block>
                        </next>
                      </block>
                    </statement>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </statement>
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
    <field name="WORKFLOW_NAME">Python Tests</field>
    <statement name="TRIGGERS">
      <block type="gha_trigger">
        <field name="TRIGGER_TYPE">push</field>
        <next>
          <block type="gha_trigger">
            <field name="TRIGGER_TYPE">pull_request</field>
          </block>
        </next>
      </block>
    </statement>
    <statement name="JOBS">
      <block type="gha_job">
        <field name="JOB_NAME">test</field>
        <field name="RUNS_ON">ubuntu-latest</field>
        <field name="NEEDS"></field>
        <statement name="STRATEGY">
          <block type="gha_strategy_matrix">
            <field name="MATRIX_KEY">python-version</field>
            <field name="MATRIX_VALUES">3.9, 3.10, 3.11, 3.12</field>
          </block>
        </statement>
        <statement name="STEPS">
          <block type="gha_step_uses">
            <field name="STEP_NAME">Checkout</field>
            <field name="USES">actions/checkout@v4</field>
            <next>
              <block type="gha_step_uses">
                <field name="STEP_NAME">Setup Python</field>
                <field name="USES">actions/setup-python@v5</field>
                <statement name="WITH">
                  <block type="gha_with_params">
                    <field name="KEY">python-version</field>
                    <field name="VALUE">\${{ matrix.python-version }}</field>
                  </block>
                </statement>
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
    </statement>
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
    <field name="WORKFLOW_NAME">Publish to NPM</field>
    <statement name="TRIGGERS">
      <block type="gha_trigger">
        <field name="TRIGGER_TYPE">release</field>
        <statement name="CONFIG">
          <block type="release_config">
            <field name="TYPES">published</field>
          </block>
        </statement>
      </block>
    </statement>
    <statement name="JOBS">
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
                <statement name="WITH">
                  <block type="gha_with_params">
                    <field name="KEY">node-version</field>
                    <field name="VALUE">20</field>
                    <next>
                      <block type="gha_with_params">
                        <field name="KEY">registry-url</field>
                        <field name="VALUE">https://registry.npmjs.org/</field>
                      </block>
                    </next>
                  </block>
                </statement>
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
                            <field name="RUN">npm publish</field>
                            <statement name="ENV">
                              <block type="gha_env_vars">
                                <field name="KEY">NODE_AUTH_TOKEN</field>
                                <field name="VALUE">\${{ secrets.NPM_TOKEN }}</field>
                              </block>
                            </statement>
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
    </statement>
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
    <field name="WORKFLOW_NAME">Deploy to GitHub Pages</field>
    <statement name="PERMISSIONS">
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
    </statement>
    <statement name="TRIGGERS">
      <block type="gha_trigger">
        <field name="TRIGGER_TYPE">push</field>
        <statement name="CONFIG">
          <block type="push_pull_request_config">
            <field name="BRANCHES">main</field>
          </block>
        </statement>
      </block>
    </statement>
    <statement name="JOBS">
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
                        <statement name="WITH">
                          <block type="gha_with_params">
                            <field name="KEY">path</field>
                            <field name="VALUE">./dist</field>
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
    </statement>
  </block>
</xml>`,
  },
];
