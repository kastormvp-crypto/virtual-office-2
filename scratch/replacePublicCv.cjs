const fs = require('fs');
const file = 'c:/Users/ks_mv/.gemini/antigravity/scratch/Virtual Office 2/src/views/PublicCvView.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/background:#000/g, "background:var(--bg-surface)");
content = content.replace(/background:#0a0b10/g, "background:var(--bg-deep)");
content = content.replace(/color:#fff/g, "color:var(--text-main)");
content = content.replace(/color:#c5a059/g, "color:var(--primary)");
content = content.replace(/rgba\(20,22,30,0\.9\)/g, "var(--bg-deep)");
content = content.replace(/rgba\(20,22,30,0\.94\)/g, "var(--bg-surface)");
content = content.replace(/rgba\(255,255,255,0\.08\)/g, "var(--border-glass)");
content = content.replace(/rgba\(255,255,255,0\.05\)/g, "var(--border-glass)");
content = content.replace(/rgba\(255,255,255,0\.1\)/g, "var(--border-glass)");
content = content.replace(/rgba\(255,255,255,0\.04\)/g, "var(--bg-deep)");
content = content.replace(/color:var\(--text-main\);text-decoration:none;border-radius:12px;padding:0.6rem 0;font-size:0.7rem;font-weight:700;transition:0.2s;text-align:center;">\s*<span style="font-size:1.15rem;">💬<\/span> WhatsApp/g, `color:#fff;text-decoration:none;border-radius:12px;padding:0.6rem 0;font-size:0.7rem;font-weight:700;transition:0.2s;text-align:center;">\n          <span style="font-size:1.15rem;">💬</span> WhatsApp`);

fs.writeFileSync(file, content);
console.log('Replaced in PublicCvView.js');
