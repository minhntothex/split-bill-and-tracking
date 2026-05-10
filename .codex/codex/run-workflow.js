#!/usr/bin/env node

const { spawnSync } = require("node:child_process");
const path = require("node:path");
const fs = require("node:fs");

const issueId = process.argv[2];

if (!issueId) {
  console.error("Usage: node .codex/codex/run-workflow.js <issue-id>");
  process.exit(1);
}

const rootDir = process.cwd();
const codexDir = __dirname;
const promptsDir = path.join(codexDir, "prompts");
const workflowDir = path.join(rootDir, "tmp", "workflow");

const type = {
  error: (text) => `\x1b[31m${text}\x1b[0m`,
  success: (text) => `\x1b[32m${text}\x1b[0m`,
  warning: (text) => `\x1b[33m${text}\x1b[0m`,
  info: (text) => `\x1b[36m${text}\x1b[0m`,
};

const steps = [
  {
    name: "collect-issue",
    model: "gpt-5.4-mini",
    promptFile: "01-collect.md",
    outputFile: "dev_01-issue.md",
    input: `Issue ID: #${issueId}`,
    enabled: true,
  },
  {
    name: "analyze",
    model: "gpt-5.5",
    promptFile: "02-analyze.md",
    outputFile: "dev_02-analyze.md",
    enabled: true,
  },
  {
    name: "plan",
    model: "gpt-5.4",
    promptFile: "03-plan.md",
    outputFile: "dev_03-plan.md",
    enabled: true,
  },
    {
    name: "execute",
    model: "gpt-5.4",
    promptFile: "04-execute.md",
    enabled: true,
  },
  {
    name: "review",
    model: "gpt-5.4",
    promptFile: "05-review.md",
    outputFile: "dev_05-review.md",
    enabled: true,
  },
];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readPrompt(fileName) {
  const filePath = path.join(promptsDir, fileName);

  if (!fs.existsSync(filePath)) {
    console.error(`Prompt not found: ${filePath}`);
    process.exit(1);
  }

  return fs.readFileSync(filePath, "utf8");
}

function buildPrompt(step) {
  const prompt = readPrompt(step.promptFile);

  const runtimeInput = step.input
    ? `## Runtime Input\n\n${step.input}`
    : "";

  return [prompt, runtimeInput].filter(Boolean).join("\n\n");
}

function runCommand(command, args) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: process.env,
  });

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

function runCodexStep(step) {
  const finalPrompt = buildPrompt(step);

  console.log(type.info(`\n========== Running step: ${step.name} ==========\n`));

  const result = spawnSync(
    "codex",
    ["exec", "--model", step.model, "-"],
    {
      input: finalPrompt,
      encoding: "utf8",
      shell: process.platform === "win32",
      stdio: ["pipe", "pipe", "pipe"],
      env: process.env,
    }
  );

  if (result.status !== 0) {
    console.error(result.stderr);
    process.exit(result.status || 1);
  }

  const output = result.stdout.trim();

  if (step.outputFile) {
    const outputPath = path.join(workflowDir, step.outputFile);
    fs.writeFileSync(outputPath, output + "\n", "utf8");
    console.log(type.success(`Saved output: ${path.relative(rootDir, outputPath)}`));
  }
  else {
    console.log(type.success(output))
  }
}

function main() {
  ensureDir(workflowDir);

  runCommand("gh", ["auth", "status"]);
  runCommand("codex", ["--version"]);

  for (const step of steps) {
    if (step.enabled) { runCodexStep(step); }
  }

  console.log(type.success("\nWorkflow completed successfully."));
}

main();