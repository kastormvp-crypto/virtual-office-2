const fs = require('fs');
const file = 'c:/Users/ks_mv/.gemini/antigravity/scratch/Virtual Office 2/src/components/AiAssistant.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/className = 'glass'/g, "className = 'premium-card'");
content = content.replace(/rgba\(10,\s*11,\s*16,\s*0\.85\)/g, "var(--bg-surface)");
content = content.replace(/rgba\(10,11,16,0\.9\)/g, "var(--bg-surface)");
content = content.replace(/rgba\(20,30,50,0\.9\)/g, "var(--bg-deep)");
content = content.replace(/color:\s*#fff/g, "color: var(--text-main)");
content = content.replace(/color:\s*#e0e0e0/g, "color: var(--text-main)");
content = content.replace(/color:\s*#0a0b10/g, "color: #fff");
content = content.replace(/rgba\(255,\s*255,\s*255,\s*0\.1\)/g, "var(--border-glass)");
content = content.replace(/rgba\(255,255,255,0\.05\)/g, "var(--bg-deep)");
content = content.replace(/box-shadow: 0 8px 32px rgba\(0, 0, 0, 0\.5\)[^;]+;/g, "box-shadow: var(--shadow-lg);");

fs.writeFileSync(file, content);
console.log('Replaced in AiAssistant.js');
