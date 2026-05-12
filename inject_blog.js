const fs = require('fs');
const path = require('path');

const consumerProjects = [
  'netflix-only',
  'subscription-simulator',
  'upcoming-renewals',
  'csv-auto-import',
  'free-trial-tracker'
];

const devProjects = [
  'local-dev-tools',
  'api-to-typescript',
  'zod-schema-generator',
  'deep-nested-converter',
  'error-response-types',
  'pagination-response'
];

const metaTag = '<meta name="google-site-verification" content="dyitLt80YqDWnYz6__XIEwhrunV4U1-KU8ODTGzuK_s" />';

const blogViewHTML = `
<!-- BLOG VIEW -->
<div id="blog-view" style="display: none; background-color: #000; min-height: 100vh; padding-top: 80px; color: #fff; font-family: sans-serif;">
    <nav style="position:fixed; top:0; width:100%; z-index:50; background:rgba(0,0,0,0.8); backdrop-filter:blur(10px); border-bottom:1px solid rgba(255,255,255,0.1);">
        <div style="max-width:800px; margin:0 auto; padding:0 24px; height:70px; display:flex; align-items:center; justify-content:space-between;">
            <div style="font-size:20px; font-weight:bold; cursor:pointer;" onclick="hideBlog()">← Back</div>
        </div>
    </nav>
    <div style="max-width:800px; margin:0 auto; padding:40px 24px;" id="blog-content"></div>
</div>
`;

const blogListHTML = `
<!-- BLOG LIST SECTION -->
<section id="blog-section" style="max-width:900px; margin:40px auto; padding:40px 24px; border-top:1px solid rgba(255,255,255,0.1);">
    <h2 style="font-size:2rem; margin-bottom:1rem; color:#fff;">Engineering Insights & Privacy</h2>
    <div id="lp-blog-grid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(250px, 1fr)); gap:20px;"></div>
</section>
`;

const blogScriptHTML = `
<script>
function showBlog(id) {
    const post = window.blogPosts.find(p => p.id === id);
    if (!post) return;
    
    // Hide all main body children except blog-view and scripts
    Array.from(document.body.children).forEach(child => {
        if (child.id !== 'blog-view' && child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE') {
            child.dataset.oldDisplay = child.style.display;
            child.style.display = 'none';
        }
    });
    
    document.getElementById('blog-view').style.display = 'block';
    
    const content = \`
        <div style="color:#f97316; font-weight:bold; font-size:12px; text-transform:uppercase; margin-bottom:16px;">\${post.category}</div>
        <h1 style="font-size:3rem; font-weight:bold; margin-bottom:24px; line-height:1.2;">\${post.title}</h1>
        <div style="color:#a1a1aa; font-size:14px; margin-bottom:40px; padding-bottom:24px; border-bottom:1px solid rgba(255,255,255,0.1);">
            By \${post.author} • \${post.date}
        </div>
        <div style="font-size:1.1rem; line-height:1.8; color:#d4d4d8;">
            \${post.content}
        </div>
    \`;
    document.getElementById('blog-content').innerHTML = content;
    window.scrollTo(0, 0);
    if (history.state?.id !== id) history.pushState({view: 'blog', id}, '', '#blog=' + id);
}

function hideBlog() {
    document.getElementById('blog-view').style.display = 'none';
    Array.from(document.body.children).forEach(child => {
        if (child.id !== 'blog-view' && child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE' && child.dataset.oldDisplay !== undefined) {
            child.style.display = child.dataset.oldDisplay;
        }
    });
    window.scrollTo(0, 0);
    if (history.state?.view === 'blog') history.pushState({view: 'main'}, '', window.location.pathname);
}

window.addEventListener('popstate', (e) => {
    if (window.location.hash.startsWith('#blog=')) {
        showBlog(window.location.hash.replace('#blog=', ''));
    } else {
        hideBlog();
    }
});

function initBlog() {
    const grid = document.getElementById('lp-blog-grid');
    if (grid && window.blogPosts) {
        grid.innerHTML = window.blogPosts.map(post => \`
            <div onclick="showBlog('\${post.id}')" style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:16px; padding:24px; cursor:pointer; transition:all 0.2s;">
                <div style="color:#f97316; font-size:10px; font-weight:bold; text-transform:uppercase; margin-bottom:12px;">\${post.category}</div>
                <h3 style="color:#fff; font-size:1.2rem; font-weight:bold; margin-bottom:12px;">\${post.title}</h3>
                <p style="color:#a1a1aa; font-size:14px; line-height:1.5;">\${post.excerpt}</p>
            </div>
        \`).join('');
    }
    if (window.location.hash.startsWith('#blog=')) {
        showBlog(window.location.hash.replace('#blog=', ''));
    }
}
document.addEventListener('DOMContentLoaded', initBlog);
// If already loaded
if (document.readyState === 'interactive' || document.readyState === 'complete') initBlog();
</script>
`;

function processProject(proj, blogSource) {
  const projDir = path.join(__dirname, proj);
  if (!fs.existsSync(projDir)) {
    console.log('Skipping ' + proj + ' - not found');
    return;
  }
  
  // 1. Copy blogPosts.js
  const blogJSContent = fs.readFileSync(blogSource, 'utf-8');
  fs.writeFileSync(path.join(projDir, 'blogPosts.js'), blogJSContent);
  
  // 2. Modify index.html
  const idxPath = path.join(projDir, 'index.html');
  if (fs.existsSync(idxPath)) {
    let html = fs.readFileSync(idxPath, 'utf-8');
    
    // Inject Meta Tag
    if (!html.includes('google-site-verification')) {
      html = html.replace('<head>', `<head>\n    ${metaTag}`);
      console.log('Injected meta tag into ' + proj);
    }

    // Check if already injected blog
    if (html.includes('id="blog-view"')) {
      console.log('Blog already injected in ' + proj);
    } else {
      // Inject script tag
      if (html.includes('<head>')) {
        html = html.replace('</head>', '  <script src="blogPosts.js"></script>\n</head>');
      }
      
      // Inject Blog List before footer or at end of body
      if (html.includes('<footer')) {
        html = html.replace(/(<footer[^>]*>)/i, blogListHTML + '\n$1');
      } else {
        html = html.replace('</body>', blogListHTML + '\n</body>');
      }
      
      // Inject Blog View and Script at end of body
      html = html.replace('</body>', blogViewHTML + '\n' + blogScriptHTML + '\n</body>');
      console.log('Successfully injected blog into ' + proj);
    }
    
    fs.writeFileSync(idxPath, html);
  }
}

consumerProjects.forEach(proj => {
  processProject(proj, path.join(__dirname, 'incinerator', 'blogPosts.js'));
});

devProjects.forEach(proj => {
  processProject(proj, path.join(__dirname, 'local-dev-tools', 'blogPosts.js'));
});
