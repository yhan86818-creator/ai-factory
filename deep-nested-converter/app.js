document.addEventListener('DOMContentLoaded', () => {
    const jsonInput = document.getElementById('json-input');
    const tsOutput = document.getElementById('ts-output');
    const inputDepth = document.getElementById('input-depth');
    const btnCopy = document.getElementById('btn-copy');
    const btnLoadSample = document.getElementById('btn-load-sample');
    const checkRecursive = document.getElementById('check-recursive');
    const checkComments = document.getElementById('check-comments');
    const checkStrict = document.getElementById('check-strict');
    const toast = document.getElementById('toast');

    const DEEP_SAMPLE = {
        id: "org_001",
        name: "Global Tech Corp",
        infrastructure: {
            regions: [
                {
                    name: "us-east-1",
                    clusters: [
                        {
                            id: "cl_1",
                            nodes: [
                                {
                                    hostname: "node-01",
                                    specs: {
                                        cpu: 64,
                                        ram: "128GB",
                                        storage: [
                                            { type: "ssd", size: "1TB", health: { status: "good", last_check: "2023-10-01" } }
                                        ]
                                    },
                                    services: {
                                        api: {
                                            port: 8080,
                                            health_check: { path: "/health", interval: "10s", retry: 3 }
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        // For recursive demonstration
        file_system: {
            name: "root",
            type: "dir",
            children: [
                {
                    name: "home",
                    type: "dir",
                    children: [
                        { name: "config.json", type: "file" }
                    ]
                }
            ]
        }
    };

    let maxDepthFound = 0;
    let typeRegistry = new Map();
    let seenObjects = new Map();

    function getTypeName(key) {
        if (!key) return "Root";
        return key.charAt(0).toUpperCase() + key.slice(1).replace(/(_[a-z])/g, m => m.toUpperCase().replace('_', ''));
    }

    function detectMaxDepth(obj, currentDepth = 0) {
        if (obj === null || typeof obj !== 'object') return currentDepth;
        let max = currentDepth;
        for (let key in obj) {
            max = Math.max(max, detectMaxDepth(obj[key], currentDepth + 1));
        }
        return max;
    }

    function generateTS(obj, name = "Root", depth = 0, path = []) {
        if (depth > maxDepthFound) maxDepthFound = depth;

        if (obj === null) return `<span class="hl-type">null</span>`;
        const type = typeof obj;

        if (type === "string") return `<span class="hl-type">string</span>`;
        if (type === "number") return `<span class="hl-type">number</span>`;
        if (type === "boolean") return `<span class="hl-type">boolean</span>`;

        if (Array.isArray(obj)) {
            if (obj.length === 0) return `<span class="hl-type">any[]</span>`;
            const innerType = generateTS(obj[0], name + "Item", depth + 1, path);
            return `${innerType}[]`;
        }

        if (type === "object") {
            // Circular Detection
            if (seenObjects.has(obj)) {
                return `<span class="hl-warning">// Circular Reference detected to ${seenObjects.get(obj)}</span>\n<span class="hl-type">any</span>`;
            }
            seenObjects.set(obj, path.join('.'));

            // Recursive detection logic (simple version: compare keys)
            if (checkRecursive.checked) {
                const currentKeys = Object.keys(obj).sort().join(',');
                for (const [registeredKeys, registeredName] of typeRegistry) {
                    if (currentKeys === registeredKeys && registeredKeys.length > 0) {
                        return `<span class="hl-recursive">${registeredName}</span> <span class="hl-comment">// Recursive match</span>`;
                    }
                }
                typeRegistry.set(Object.keys(obj).sort().join(','), name);
            }

            let ts = `{\n`;
            if (checkComments.checked && depth > 0) {
                ts = `<span class="hl-comment">// Layer ${depth}</span>\n` + ts;
            }

            const indent = "  ".repeat(depth + 1);
            const childIndent = "  ".repeat(depth);
            
            for (const key in obj) {
                const childName = getTypeName(key);
                const value = obj[key];
                const optional = checkStrict.checked ? "" : "?";
                
                ts += `${indent}<span class="hl-key">${key}</span>${optional}: ${generateTS(value, childName, depth + 1, [...path, key])};\n`;
            }

            ts += `${childIndent}}`;
            return ts;
        }

        return `<span class="hl-type">any</span>`;
    }

    function update() {
        try {
            const raw = jsonInput.value.trim();
            if (!raw) {
                tsOutput.innerHTML = "";
                inputDepth.textContent = "Max Depth: 0";
                return;
            }

            const data = JSON.parse(raw);
            maxDepthFound = 0;
            typeRegistry.clear();
            seenObjects.clear();

            const depth = detectMaxDepth(data);
            inputDepth.textContent = `Max Depth: ${depth}`;
            if (depth > 5) {
                inputDepth.classList.add('depth-high');
            } else {
                inputDepth.classList.remove('depth-high');
            }

            const finalTS = `<span class="hl-keyword">export type</span> <span class="hl-type">RootType</span> = ${generateTS(data)};`;
            tsOutput.innerHTML = finalTS;

        } catch (e) {
            tsOutput.innerHTML = `<span class="hl-warning">// Error parsing JSON: ${e.message}</span>`;
        }
    }

    // --- Events ---
    jsonInput.addEventListener('input', update);
    [checkRecursive, checkComments, checkStrict].forEach(el => el.addEventListener('change', update));

    btnLoadSample.addEventListener('click', () => {
        jsonInput.value = JSON.stringify(DEEP_SAMPLE, null, 2);
        update();
    });

    btnCopy.addEventListener('click', () => {
        const text = tsOutput.innerText;
        navigator.clipboard.writeText(text).then(() => {
            toast.style.display = 'block';
            setTimeout(() => toast.style.display = 'none', 2000);
        });
    });

    // Initial
    btnLoadSample.click();
});
