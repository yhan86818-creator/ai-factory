const fs = require('fs');

const indexFile = 'c:\\Users\\kouki\\ai-factory\\incinerator\\index.html';
const previewFile = 'c:\\Users\\kouki\\ai-factory\\incinerator\\lp_preview.html';

let indexContent = fs.readFileSync(indexFile, 'utf8');
const previewContent = fs.readFileSync(previewFile, 'utf8');

// 1. Inject Tailwind in head
const tailwindInjection = `</style>
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script>
    tailwind.config = {
        important: '#landing-page',
        corePlugins: { preflight: false },
        theme: {
            extend: {
                fontFamily: { sans: ['"Plus Jakarta Sans"', 'sans-serif'] },
                colors: { black: '#000000', offblack: '#121212', accent: '#2563EB', accentHover: '#1D4ED8', grayText: '#9CA3AF' }
            }
        }
    }
</script>
<style>
    #landing-page { background-color: #000000; color: #FFFFFF; font-family: "Plus Jakarta Sans", sans-serif; }
    #landing-page .glow-bg {
        position: absolute; width: 600px; height: 600px;
        background: radial-gradient(circle, rgba(37,99,235,0.15) 0%, rgba(0,0,0,0) 70%);
        top: -200px; left: 50%; transform: translateX(-50%); z-index: -1; pointer-events: none;
    }
    #landing-page .btn-micro {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        will-change: transform, filter;
    }
    #landing-page .btn-micro:hover {
        filter: brightness(1.15); transform: translateY(-2px);
    }
    #landing-page a { text-decoration: none; }
</style>
</head>`;
indexContent = indexContent.replace('</style>\r\n</head>', tailwindInjection);
indexContent = indexContent.replace('</style>\n</head>', tailwindInjection); // fallback

// 2. Extract LP from preview
const startBody = previewContent.indexOf('<!-- Navbar -->');
const endBody = previewContent.indexOf('</body>');
let lpBody = previewContent.substring(startBody, endBody);

// Change href="#" for primary buttons to call startApp()
// "Go to App" Navbar
lpBody = lpBody.replace(/<a href="#" class="bg-white text-black[^>]+>Go to App<\/a>/g, '<button onclick="startApp()" class="bg-white text-black px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-200 transition border-0 cursor-pointer">Go to App</button>');

// "Start Auditing Free" buttons
lpBody = lpBody.replace(/<a href="#" class="btn-micro[^>]+>\s*Start Auditing Free\s*<\/a>/g, '<button onclick="startApp()" class="btn-micro bg-accent text-white px-8 py-4 rounded-full font-semibold text-lg w-full sm:w-auto text-center border-0 cursor-pointer">Start Auditing Free</button>');

// Mobile sticky CTA button
lpBody = lpBody.replace(/<a href="#" class="btn-micro block w-full[^>]+>\s*Start Auditing Free\s*<\/a>/g, '<button onclick="startApp()" class="btn-micro block w-full bg-accent text-white py-4 rounded-full font-bold text-center text-lg shadow-[0_0_20px_rgba(37,99,235,0.4)] border border-white/10 cursor-pointer">Start Auditing Free</button>');

// "Unlock Pro" button
lpBody = lpBody.replace(/<a href="#" class="block w-full py-4 rounded-full bg-white text-accent[^>]+>Unlock Pro<\/a>/g, '<button onclick="openProModal()" class="block w-full py-4 rounded-full bg-white text-accent text-center font-bold hover:bg-gray-100 transition shadow-lg border-0 cursor-pointer">Unlock Pro</button>');

// "Open App Now" button
lpBody = lpBody.replace(/<a href="#" class="btn-micro inline-block bg-accent[^>]+>\s*Open App Now\s*<\/a>/g, '<button onclick="startApp()" class="btn-micro inline-block bg-accent text-white px-10 py-5 rounded-full font-bold text-lg relative z-10 border-0 cursor-pointer">Open App Now</button>');


// 3. Replace <div id="landing-page"> ... </div> in index.html
const startIndex = indexContent.indexOf('<!-- LANDING PAGE -->');
const endIndex = indexContent.indexOf('<!-- APP CONTAINER -->');

if (startIndex !== -1 && endIndex !== -1) {
    const originalLP = indexContent.substring(startIndex, endIndex);
    const newLP = `<!-- LANDING PAGE -->\n<div id="landing-page">\n${lpBody}\n</div>\n\n`;
    indexContent = indexContent.replace(originalLP, newLP);
    fs.writeFileSync(indexFile, indexContent);
    console.log('Successfully replaced Landing Page!');
} else {
    console.log('Error: Could not find LANDING PAGE markers.');
}
