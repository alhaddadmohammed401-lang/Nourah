const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const scratchDir = path.join(rootDir, 'scratch');
const outputFile = path.join(scratchDir, 'chatgpt_context.txt');

// Ensure scratch directory exists
if (!fs.existsSync(scratchDir)) {
  fs.mkdirSync(scratchDir, { recursive: true });
}

// 1. Get files to bundle
let files = process.argv.slice(2);

if (files.length === 0) {
  try {
    // Try to get unstaged and staged modified files via Git
    const gitDiff = execSync('git diff --name-only', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    const gitUntracked = execSync('git ls-files --others --exclude-standard', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    
    const excludePatterns = [
      /node_modules/,
      /\.expo/,
      /\.git/,
      /graphify-out/,
      /scratch/,
      /\.vscode/,
      /\.claude/,
      /\.codex/,
      /package-lock\.json/,
      /\.(png|jpe?g|gif|webp|pdf|mp[34]|zip|tar|gz)$/i
    ];

    const gitFiles = [
      ...gitDiff.split('\n'),
      ...gitUntracked.split('\n')
    ]
      .map(f => f.trim())
      .filter(f => {
        if (!f) return false;
        if (excludePatterns.some(pattern => pattern.test(f))) return false;
        const fullPath = path.join(rootDir, f);
        return fs.existsSync(fullPath) && fs.statSync(fullPath).isFile();
      });
    
    files = [...new Set(gitFiles)];
  } catch (error) {
    // If not a git repo or git is missing, files remains empty
  }
}

let output = '';

// Add a system system instruction for ChatGPT/Codex
output += `=== SYSTEM INSTRUCTIONS ===\n`;
output += `You are ChatGPT/Codex helping me vibe code our React Native Expo app (Nourah).\n`;
output += `Below is the project context, including the current AGENTS.md checklist and the files I am working on.\n`;
output += `Please help me implement the next task, keeping in mind the styling guidelines (NativeWind only, colors/fonts from constants), and the Supabase/Supabase Auth setup.\n\n`;

// 2. Add AGENTS.md content
const agentsPath = path.join(rootDir, 'AGENTS.md');
if (fs.existsSync(agentsPath)) {
  output += `=== AGENTS.md ===\n`;
  output += fs.readFileSync(agentsPath, 'utf8');
  output += `\n\n`;
}

// 3. Add file contents
output += `=== FILE CONTENTS ===\n`;
if (files.length === 0) {
  output += `No active files specified or changed in Git. Pass file paths as arguments to include them: node scripts/bundle-context.js path/to/file.tsx\n`;
} else {
  files.forEach(file => {
    const fullPath = path.join(rootDir, file);
    if (fs.existsSync(fullPath)) {
      output += `\n--- File: ${file} ---\n`;
      output += fs.readFileSync(fullPath, 'utf8');
      output += `\n`;
    }
  });
}

// Write to scratch output file
fs.writeFileSync(outputFile, output, 'utf8');

console.log(`\n======================================================`);
console.log(`🎉 Context successfully bundled!`);
console.log(`📁 Output saved to: scratch/chatgpt_context.txt`);
console.log(`👉 Copy the contents of this file and paste it into Codex / ChatGPT.`);
console.log(`======================================================\n`);
if (files.length > 0) {
  console.log(`Bundled ${files.length} active files:`);
  files.forEach(f => console.log(` - ${f}`));
} else {
  console.log(`No active files bundled. Run with: npm run bundle-context [file1] [file2]`);
}
