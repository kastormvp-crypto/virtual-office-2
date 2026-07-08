const fs = require('fs');
const files = [
  'c:/Users/ks_mv/.gemini/antigravity/scratch/Virtual Office 2/src/views/SetupIdentityView.js',
  'c:/Users/ks_mv/.gemini/antigravity/scratch/Virtual Office 2/src/views/InterviewView.js',
  'c:/Users/ks_mv/.gemini/antigravity/scratch/Virtual Office 2/src/views/PartnerDashboard.js'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/class="([^"]*)glass([^"]*)"/g, (match, p1, p2) => {
      if (match.includes('btn') || match.includes('cancel')) {
        return 'class="' + p1 + 'btn-secondary' + p2 + '"';
      }
      return 'class="' + p1 + 'premium-card' + p2 + '"';
    });
    content = content.replace(/\.add\('glass'\)/g, ".add('btn-secondary')");
    content = content.replace(/\.remove\('glass'\)/g, ".remove('btn-secondary')");
    fs.writeFileSync(file, content);
    console.log('Replaced in', file);
  }
});
