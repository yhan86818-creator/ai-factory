const fs = require('fs');
const path = require('path');

// Read blog posts
const blogJSPath = path.join(__dirname, 'blogPosts.js');
let blogPostsJS = fs.readFileSync(blogJSPath, 'utf-8');
// Evaluate the JS file to get the array
const sandbox = { window: {} };
require('vm').runInNewContext(blogPostsJS, sandbox);
const posts = sandbox.window.blogPosts;

// Read base index.html
const indexPath = path.join(__dirname, 'index.html');
const baseHtml = fs.readFileSync(indexPath, 'utf-8');

// Ensure blog directory exists
const blogDir = path.join(__dirname, 'blog');
if (!fs.existsSync(blogDir)) {
    fs.mkdirSync(blogDir);
}

// Generate static pages for each post
posts.forEach(post => {
    const postDir = path.join(blogDir, post.id);
    if (!fs.existsSync(postDir)) {
        fs.mkdirSync(postDir);
    }
    
    let html = baseHtml;
    
    // Replace Meta Tags
    html = html.replace(/<title>.*?<\/title>/, `<title>${post.title} | Incinerator Blog</title>`);
    html = html.replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${post.excerpt}">`);
    html = html.replace(/<meta property="og:title" content=".*?">/, `<meta property="og:title" content="${post.title}">`);
    html = html.replace(/<meta property="og:description" content=".*?">/, `<meta property="og:description" content="${post.excerpt}">`);
    
    // Create pre-rendered content
    const preRenderedContent = `
        <div class="text-accent font-bold uppercase tracking-widest text-sm mb-4">${post.category}</div>
        <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white">${post.title}</h1>
        <div class="flex items-center gap-4 text-grayText text-sm mb-12 border-b border-white/10 pb-8">
            <span>By ${post.author}</span>
            <span>•</span>
            <span>${post.date}</span>
        </div>
        <div class="text-lg leading-relaxed text-gray-200 space-y-6 blog-article-body">
            ${post.content}
        </div>
        <div class="mt-20 pt-12 border-t border-white/10 text-center">
            <h3 class="text-2xl font-bold mb-6 text-white">Ready to incinerate your waste?</h3>
            <button onclick="startApp()" class="bg-accent text-white px-8 py-4 rounded-full font-bold hover:bg-accentHover transition border-0 cursor-pointer">Open Incinerator App</button>
        </div>
    `;
    
    // Inject pre-rendered content
    html = html.replace(/<div class="max-w-3xl mx-auto px-6 py-20" id="blog-content">[\s\S]*?<\/div>/, 
                        `<div class="max-w-3xl mx-auto px-6 py-20" id="blog-content">${preRenderedContent}</div>`);
    
    // Modify initial JS state to show blog by default and hide landing/app
    const jsInitMod = `
        // SSG INITIALIZATION OVERRIDE
        document.addEventListener('DOMContentLoaded', () => {
            const lp = document.getElementById('landing-page');
            const app = document.getElementById('app-container');
            const bv = document.getElementById('blog-view');
            if(lp) lp.style.display = 'none';
            if(app) app.classList.remove('active');
            if(bv) bv.style.display = 'block';
            currentView = 'blog';
        });
    </script>`;
    html = html.replace(/<\/script>(?![\s\S]*<\/script>)/, jsInitMod); // replace last script tag close
    
    // Fix relative paths for assets (since we are in /blog/id/)
    // Change src="blogPosts.js" to src="/blogPosts.js", etc.
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
let sitemapPath = path.join(__dirname, 'sitemap.xml');
let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://incinerator-c3z.pages.dev/</loc><priority>1.0</priority></url>
`;
posts.forEach(post => {
    sitemap += `  <url><loc>https://incinerator-c3z.pages.dev/blog/${post.id}</loc><priority>0.8</priority></url>\n`;
});
sitemap += `</urlset>`;
fs.writeFileSync(sitemapPath, sitemap);

console.log('SSG Build Complete. Generated static pages for ' + posts.length + ' blog posts.');
