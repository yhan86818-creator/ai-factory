const fs = require('fs');
let c = fs.readFileSync('src/app/page.jsx', 'utf8');

// Remove aurora orbs
c = c.replace(/<div className="aurora-orb[^>]+><\/div>/g, '');
c = c.replace(/<div className="aurora-orb[^>]+\/>/g, '');

// Replace specific class names
c = c.replace(/\bglass\b/g, 'fintech-card');
c = c.replace(/\bcard-dark\b/g, 'fintech-input');
c = c.replace(/\bglow-teal\b/g, '');

// Save back
fs.writeFileSync('src/app/page.jsx', c);
console.log('Fixed classes in page.jsx');
