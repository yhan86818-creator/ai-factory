const fs = require('fs');

const indexFile = 'c:\\Users\\kouki\\ai-factory\\financial-expense-analyzer\\index.html';
let content = fs.readFileSync(indexFile, 'utf8');

// 1. Restore Header (Ensure only the original head remains)
content = content.replace(/<\/style>[\s\S]*?<\/head>/, '</style>\n</head>');

// 2. Restore s-home with EXACT classes from the CSS
const startHome = content.indexOf('<section id="s-home"');
const startUpload = content.indexOf('<section id="s-upload"');

if (startHome !== -1 && startUpload !== -1) {
    const originalHome = `<section id="s-home" class="sec on">
  <div class="eyebrow"><span class="dot-pulse"></span> 100% LOCAL & PRIVATE</div>
  <h1 class="hero-h">KNOW YOUR<br><em>MONEY.</em></h1>
  <p class="hero-p">Drop your bank CSV — get instant spending analysis. Everything runs in your browser. Nothing leaves your device.</p>
  
  <div class="cta-row">
    <button class="btn-main" onclick="nav('upload')">Start Analyzing</button>
    <button class="btn-out" onclick="loadSample('Chase Bank')">Try Sample Data</button>
  </div>

  <div class="flow">
    <div class="flow-s">
      <div class="flow-ico">📄</div>
      <div class="flow-lbl">Export CSV</div>
    </div>
    <div class="flow-s">
      <div class="flow-ico">☁️</div>
      <div class="flow-lbl">Drop Here</div>
    </div>
    <div class="flow-s">
      <div class="flow-ico">📊</div>
      <div class="flow-lbl">Gain Insight</div>
    </div>
  </div>

  <div class="trust">
    <div class="trust-i"><span class="trust-ico">🔒</span> Privacy First</div>
    <div class="trust-i"><span class="trust-ico">⚡</span> No Account</div>
    <div class="trust-i"><span class="trust-ico">💎</span> Pro Tools</div>
  </div>
</section>
`;
    const before = content.substring(0, startHome);
    const after = content.substring(startUpload);
    content = before + originalHome + after;
}

// 3. Ensure no extra fragments are left behind
content = content.replace(/<\/section>[\s\S]*?<section id="s-upload"/, '</section>\n<section id="s-upload"');

fs.writeFileSync(indexFile, content);
console.log('REVERT COMPLETE: Restored EXACT original UI.');
