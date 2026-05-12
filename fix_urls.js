const fs = require('fs');
const path = require('path');

const projects = [
  'incinerator',
  'netflix-only',
  'subscription-simulator',
  'upcoming-renewals',
  'csv-auto-import',
  'free-trial-tracker',
  'local-dev-tools'
];

projects.forEach(proj => {
    const projDir = path.join(__dirname, proj);
    if (!fs.existsSync(projDir)) return;

    const idxPath = path.join(projDir, 'index.html');
    if (fs.existsSync(idxPath)) {
        let html = fs.readFileSync(idxPath, 'utf-8');

        // 1. Change pushState in showBlog
        html = html.replace(
            /history\.pushState\(\{view:\s*'blog',\s*id\},\s*'',\s*'#blog='\s*\+\s*id\);/g,
            "history.pushState({view: 'blog', id}, '', '/blog/' + id);"
        );

        // 2. Change logic in hideBlog
        html = html.replace(
            /if\s*\(history\.state\?\.view\s*===\s*'blog'\)\s*history\.pushState\(\{view:\s*'main'\}\,\s*''\,\s*window\.location\.pathname\);/g,
            "if (window.location.pathname.startsWith('/blog/')) history.pushState({view: 'main'}, '', '/');"
        );

        // 3. Change popstate listener
        html = html.replace(
            /if\s*\(\s*window\.location\.hash\.startsWith\('#blog='\)\s*\)\s*\{\s*showBlog\(window\.location\.hash\.replace\('#blog=',\s*''\)\);\s*\}\s*else\s*\{\s*hideBlog\(\);\s*\}/g,
            "if (window.location.pathname.startsWith('/blog/')) { showBlog(window.location.pathname.replace('/blog/', '')); } else { hideBlog(); }"
        );

        // 4. Change initBlog check
        html = html.replace(
            /if\s*\(\s*window\.location\.hash\.startsWith\('#blog='\)\s*\)\s*\{\s*showBlog\(window\.location\.hash\.replace\('#blog=',\s*''\)\);\s*\}/g,
            "if (window.location.pathname.startsWith('/blog/')) { showBlog(window.location.pathname.replace('/blog/', '')); }"
        );

        // 5. Update the generated grid cards to use proper <a> tags for true SEO crawling
        // Original: <div onclick="showBlog('${post.id}')" style="...">
        html = html.replace(
            /<div onclick="showBlog\('\$\{post\.id\}'\)"/g,
            `<a href="/blog/\${post.id}" onclick="event.preventDefault(); showBlog('\${post.id}');"`
        );
        // We also need to change the closing </div> of the card to </a>
        // It's a bit tricky with regex, but since we know the template:
        // <p style="...">${post.excerpt}</p>\n            </div>
        html = html.replace(
            /<p style="color:#a1a1aa; font-size:14px; line-height:1.5;">\$\{post\.excerpt\}<\/p>\s*<\/div>/g,
            `<p style="color:#a1a1aa; font-size:14px; line-height:1.5;">\${post.excerpt}</p>\n            </a>`
        );
        // Add text-decoration none and display block to the <a>
        html = html.replace(
            /onclick="event\.preventDefault\(\);\s*showBlog\('\$\{post\.id\}'\);"\s*style="/g,
            `onclick="event.preventDefault(); showBlog('\${post.id}');" style="display:block; text-decoration:none; `
        );

        fs.writeFileSync(idxPath, html);
        console.log('Fixed URLs for ' + proj);
    }
});
