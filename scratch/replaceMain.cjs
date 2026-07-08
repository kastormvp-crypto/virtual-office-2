const fs = require('fs');
const file = 'c:/Users/ks_mv/.gemini/antigravity/scratch/Virtual Office 2/src/main.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/background:#000/g, "background:var(--bg-surface)");
content = content.replace(/background:#0a0b10/g, "background:var(--bg-deep)");
content = content.replace(/background:#0f1018/g, "background:var(--bg-deep)");
content = content.replace(/color:#fff/g, "color:var(--text-main)");
content = content.replace(/color:#c5a059/g, "color:var(--primary)");

fs.writeFileSync(file, content);
console.log('Replaced in main.js');
