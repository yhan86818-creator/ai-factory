const fs = require('fs');

const indexFile = 'c:\\Users\\kouki\\ai-factory\\financial-expense-analyzer\\index.html';
const previewFile = 'c:\\Users\\kouki\\ai-factory\\financial-expense-analyzer\\lp_preview.html';

let indexContent = fs.readFileSync(indexFile, 'utf8');
const previewContent = fs.readFileSync(previewFile, 'utf8');

// 1. CLEAN UP: Remove all previous automated injections in <head>
// We look for the end of the original CSS block (which ends with </style>)
// and everything between that and </head>
indexContent = indexContent.replace(/<\/style>[\s\S]*?<\/head>/, '</style>\n</head>');

// 2. EXTRACT LP DATA
const tailwindConfigStart = previewContent.indexOf('tailwind.config = {');
const tailwindConfigEnd = previewContent.indexOf('</script>', tailwindConfigStart);
let tailwindConfig = previewContent.substring(tailwindConfigStart, tailwindConfigEnd);

// Scope Tailwind to #lp-container
tailwindConfig = tailwindConfig.replace('theme: {', "important: '#lp-container',\n            corePlugins: { preflight: false },\n            theme: {");

const styleStart = previewContent.indexOf('<style>', tailwindConfigEnd);
const styleEnd = previewContent.indexOf('</style>', styleStart);
let styles = previewContent.substring(styleStart + 7, styleEnd);

// Scope Styles to #lp-container
styles = styles.split('\n').map(line => {
    if (line.includes('body {')) return line.replace('body {', '#lp-container { min-height: 100vh; ');
    if (line.trim().startsWith('.') || line.trim().startsWith('#') || line.trim().match(/^[a-z]/)) {
        if (!line.includes('#lp-container')) return '#lp-container ' + line;
    }
    return line;
}).join('\n');

const headInjection = `
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script>
    ${tailwindConfig}
</script>
<style>
    #lp-container { background-color: #FFFFFF; color: #111827; font-family: "Plus Jakarta Sans", sans-serif; overflow-x: hidden; }
    ${styles}
    #lp-container a { text-decoration: none; }
    #lp-container button { border: none; cursor: pointer; }
</style>
</head>`;

indexContent = indexContent.replace('</style>\n</head>', '</style>' + headInjection);

// 3. EXTRACT LP BODY
const startNav = previewContent.indexOf('<nav class="fixed w-full top-0');
const endBody = previewContent.indexOf('</body>');
const lpBody = previewContent.substring(startNav, endBody);

// 4. FIX STRUCTURE: Remove all content between <section id="s-home" and <section id="s-upload"
const startSection = indexContent.indexOf('<section id="s-home"');
const nextSection = indexContent.indexOf('<section id="s-upload"');

if (startSection !== -1 && nextSection !== -1) {
    const sectionHeader = '<section id="s-home" class="sec on">\n';
    const sectionFooter = '\n</section>\n';
    
    const newHomeSection = `${sectionHeader}<div id="lp-container">${lpBody}</div>${sectionFooter}`;
    
    const before = indexContent.substring(0, startSection);
    const after = indexContent.substring(nextSection);
    
    indexContent = before + newHomeSection + after;
}

// 5. NAV FUNCTION FIX
if (!indexContent.includes("document.getElementById('hdr').style.display")) {
    indexContent = indexContent.replace('function nav(id){', 'function nav(id){\n  document.getElementById(\'hdr\').style.display = (id === \'home\') ? \'none\' : \'flex\';');
}

fs.writeFileSync(indexFile, indexContent);
console.log('REPAIR COMPLETE: Cleaned up structure and styles.');
