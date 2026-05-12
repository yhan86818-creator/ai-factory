const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const projects = [
  'api-to-typescript',
  'zod-schema-generator',
  'deep-nested-converter',
  'error-response-types',
  'pagination-response',
  'netflix-only',
  'subscription-simulator',
  'upcoming-renewals',
  'csv-auto-import',
  'free-trial-tracker',
  'local-dev-tools'
];

projects.forEach(proj => {
  const projDir = path.join(__dirname, proj);
  if (!fs.existsSync(projDir)) {
    console.log(`Skipping ${proj} - directory not found`);
    return;
  }

  console.log(`Deploying ${proj}...`);
  try {
    // Note: Using --project-name same as directory name based on pattern
    const output = execSync(`npx wrangler pages deploy . --project-name ${proj}`, {
      cwd: projDir,
      encoding: 'utf-8'
    });
    console.log(output);
    console.log(`Successfully deployed ${proj}`);
  } catch (err) {
    console.error(`Failed to deploy ${proj}:`, err.message);
  }
});
