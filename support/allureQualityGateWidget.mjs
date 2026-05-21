import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const reportDir = process.argv[2] ?? 'allure-report';
const knownIssuesPath = process.argv[3] ?? 'allure/known.json';
const testResultsDir = join(reportDir, 'data', 'test-results');
const widgetPath = join(reportDir, 'widgets', 'quality-gate.json');

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

function isUnsuccessful(testResult) {
  return testResult.status === 'failed' || testResult.status === 'broken';
}

const knownIssues = await readJson(knownIssuesPath);
const knownHistoryIds = new Set(knownIssues.map((issue) => issue.historyId));
const files = await readdir(testResultsDir, { withFileTypes: true });
const testResults = [];

for (const file of files) {
  if (!file.isFile() || !file.name.endsWith('.json')) {
    continue;
  }

  testResults.push(await readJson(join(testResultsDir, file.name)));
}

const failedResults = testResults.filter((result) => !result.hidden && isUnsuccessful(result));
const unknownFailures = failedResults.filter((result) => !knownHistoryIds.has(result.historyId));
const knownFailures = failedResults.length - unknownFailures.length;
const success = unknownFailures.length === 0;

const qualityGate = {
  default: [
    {
      success,
      actual: unknownFailures.length,
      expected: 0,
      rule: 'knownIssues.maxUnknownFailures',
      message: success
        ? `No unknown failures. ${knownFailures} failing test(s) match allure/known.json.`
        : `${unknownFailures.length} unknown failure(s) outside allure/known.json: ${unknownFailures
            .map((result) => result.name)
            .join('; ')}`,
    },
  ],
};

await mkdir(join(reportDir, 'widgets'), { recursive: true });
await writeFile(widgetPath, JSON.stringify(qualityGate), 'utf8');

console.log(
  `Allure quality gate widget written: ${unknownFailures.length} unknown, ${knownFailures} known failure(s).`,
);
