const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 1. Building static export for GitHub Pages...');
execSync('npm run build:pages', { stdio: 'inherit' });

console.log('🚀 2. Deploying out/ directory to origin/gh-pages...');
const outDir = path.join(__dirname, '..', 'out');

// Clean any previous git in out/ if present
const outGit = path.join(outDir, '.git');
if (fs.existsSync(outGit)) {
  fs.rmSync(outGit, { recursive: true, force: true });
}

// Get the remote origin URL from the main repo
const remoteUrl = execSync('git config --get remote.origin.url', { encoding: 'utf8' }).trim();

execSync('git init', { cwd: outDir, stdio: 'inherit' });
execSync('git config user.name "Derkitoo"', { cwd: outDir, stdio: 'inherit' });
execSync('git config user.email "laradjane@gmail.com"', { cwd: outDir, stdio: 'inherit' });
execSync('git checkout -b gh-pages', { cwd: outDir, stdio: 'inherit' });
execSync('git add -A', { cwd: outDir, stdio: 'inherit' });
execSync('git commit -m "Deploy: perfect light mode contrast, readable counters, and harmonious tracking"', { cwd: outDir, stdio: 'inherit' });
execSync(`git remote add origin ${remoteUrl}`, { cwd: outDir, stdio: 'inherit' });
execSync('git push -f origin gh-pages', { cwd: outDir, stdio: 'inherit' });

// Clean up .git from out/ after pushing
fs.rmSync(path.join(outDir, '.git'), { recursive: true, force: true });

console.log('🎉 Successfully deployed to GitHub Pages (gh-pages branch)!');
