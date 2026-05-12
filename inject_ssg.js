const fs = require('fs');
const path = require('path');

const projects = [
  { name: 'netflix-only', url: 'https://netflix-only.pages.dev' },
  { name: 'subscription-simulator', url: 'https://subscription-simulator-ev7.pages.dev' },
  { name: 'upcoming-renewals', url: 'https://upcoming-renewals.pages.dev' },
  { name: 'csv-auto-import', url: 'https://csv-auto-import.pages.dev' },
  { name: 'free-trial-tracker', url: 'https://free-trial-tracker.pages.dev' },
  { name: 'local-dev-tools', url: 'https://local-dev-tools.pages.dev' },
  { name: 'privacy-money-portal', url: 'https://privacy-money-portal.pages.dev' },
  { name: 'category-burner', url: 'https://category-burner.pages.dev' }
];

projects.forEach(proj => {
    const projDir = path.join(__dirname, proj.name);
    if (!fs.existsSync(projDir)) return;

    // Read blog posts
    const blogJSPath = path.join(projDir, 'blogPosts.js');
    if (!fs.existsSync(blogJSPath)) return;
    
    let blogPostsJS = fs.readFileSync(blogJSPath, 'utf-8');
    const sandbox = { window: {} };
    require('vm').runInNewContext(blogPostsJS, sandbox);
    const posts = sandbox.window.blogPosts;

    // Read base index.html
    const indexPath = path.join(projDir, 'index.html');
    let baseHtml = fs.readFileSync(indexPath, 'utf-8');

    // Ensure blog directory exists
    const blogDir = path.join(projDir, 'blog');
    if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir);

    posts.forEach(post => {
        const postDir = path.join(blogDir, post.id);
        if (!fs.existsSync(postDir)) fs.mkdirSync(postDir);
        
        let html = baseHtml;
        
        // Extract project name for Title
        const titleMatch = html.match(/<title>(.*?)<\/title>/);
        const originalTitle = titleMatch ? titleMatch[1].split('—')[0].trim() : proj.name;

        // Replace Meta Tags
        html = html.replace(/<title>.*?<\/title>/, `<title>\${post.title} | \${originalTitle} Blog</title>`);
        
        // Handle missing meta tags by injecting them if they don't exist
        const metaTags = `
        <meta name="description" content="\${post.excerpt}">
        <meta property="og:title" content="\${post.title}">
        <meta property="og:description" content="\${post.excerpt}">
        `;
        
        if (html.includes('<meta name="description"')) {
            html = html.replace(/<meta name="description" content=".*?">/, `<meta name="description" content="\${post.excerpt}">`);
        } else {
            html = html.replace('</title>', '</title>\\n' + metaTags);
        }

        // Create pre-rendered content for the blog-view
        // We will just replace the innerHTML of <div id="blog-content">
        const preRenderedContent = `
            <div style="color:#f97316; font-weight:bold; font-size:12px; text-transform:uppercase; margin-bottom:16px;">${post.category}</div>
            <h1 style="font-size:3rem; font-weight:bold; margin-bottom:24px; line-height:1.2; color:#fff;">${post.title}</h1>
            <div style="color:#a1a1aa; font-size:14px; margin-bottom:40px; padding-bottom:24px; border-bottom:1px solid rgba(255,255,255,0.1);">
                By ${post.author} • ${post.date}
            </div>
            <div style="font-size:1.1rem; line-height:1.8; color:#d4d4d8;">
                ${post.content}
            </div>
        `;
        
        // Replace empty <div id="blog-content"></div> with pre-rendered content
        html = html.replace(/<div.*?id="blog-content">[\s\S]*?<\/div>/, `<div style="max-width:800px; margin:0 auto; padding:40px 24px;" id="blog-content">${preRenderedContent}</div>`);
        
        // Make the blog view display by default and hide the app
        const jsInitMod = `
            // SSG INITIALIZATION OVERRIDE
            document.addEventListener('DOMContentLoaded', () => {
                Array.from(document.body.children).forEach(child => {
                    if (child.id !== 'blog-view' && child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE') {
                        child.dataset.oldDisplay = child.style.display || '';
                        child.style.display = 'none';
                    }
                });
                const bv = document.getElementById('blog-view');
                if(bv) bv.style.display = 'block';
            });
        </script>`;
        html = html.replace(/<\/script>(?![\s\S]*<\/script>)/, jsInitMod); // replace last script tag close
        
        // Fix relative paths for assets
        html = html.replace(/src="\//g, 'src="%%SLASH%%');
        html = html.replace(/src="([^http|%%].*?)"/g, 'src="/$1"');
        html = html.replace(/href="([^http|#].*?)"/g, 'href="/$1"');
        html = html.replace(/%%SLASH%%/g, '/');
 
        // Add JSON-LD Structured Data
        const jsonLd = `
        <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "${post.title}",
          "description": "${post.excerpt}",
          "datePublished": "${post.date}",
          "author": { "@type": "Person", "name": "${post.author}" }
        }
        </script>`;
        html = html.replace('</head>', `${jsonLd}\n</head>`);

        fs.writeFileSync(path.join(postDir, 'index.html'), html);
    });

    // Update Sitemap
    let sitemapPath = path.join(projDir, 'sitemap.xml');
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\\n`;
    sitemap += `  <url><loc>\${proj.url}/</loc><priority>1.0</priority></url>\\n`;
    posts.forEach(post => {
        sitemap += `  <url><loc>\${proj.url}/blog/\${post.id}</loc><priority>0.8</priority></url>\\n`;
    });
    sitemap += `</urlset>`;
    fs.writeFileSync(sitemapPath, sitemap);

    // Create a basic _redirects file if not exists
    const redirectsPath = path.join(projDir, '_redirects');
    if (!fs.existsSync(redirectsPath)) {
        fs.writeFileSync(redirectsPath, '/blog/* /blog/:splat/index.html 200\\n');
    }

    console.log('SSG Build Complete for ' + proj.name);
});
