const { execSync } = require('child_process');
const fs = require('fs');

console.log('Building BJJ Nexus for GitHub Pages (with basePath /nexus)...');
process.env.DEPLOY_TARGET = 'gh-pages';
execSync('npx next build', { 
  stdio: 'inherit', 
  env: { ...process.env, DEPLOY_TARGET: 'gh-pages' } 
});

// CRITICAL: GitHub Pages runs Jekyll by default which ignores directories starting with _ (_next).
// Creating an empty .nojekyll file in the root of the output directory disables Jekyll.
fs.writeFileSync('out/.nojekyll', '');
console.log('✅ Created out/.nojekyll successfully! GitHub Pages will now serve _next assets properly.');
