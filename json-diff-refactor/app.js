document.addEventListener('DOMContentLoaded', () => {
    const jsonA = document.getElementById('json-a');
    const jsonB = document.getElementById('json-b');
    const btnDiff = document.getElementById('btn-diff');
    const btnAiMerge = document.getElementById('btn-ai-merge');
    const btnSample = document.getElementById('btn-sample');
    const btnClear = document.getElementById('btn-clear');
    const btnCopy = document.getElementById('btn-copy');
    const results = document.getElementById('results');
    const diffOutput = document.getElementById('diff-output');
    const schemaOutput = document.getElementById('schema-output');
    const tabs = document.querySelectorAll('.tab');
    const schemaType = document.getElementById('schema-type');
    const toast = document.getElementById('toast');
    const apiKeyInput = document.getElementById('api-key-input');

    // Load API Key
    const savedKey = localStorage.getItem('tf_gemini_api_key');
    if (savedKey) apiKeyInput.value = savedKey;

    apiKeyInput.addEventListener('change', (e) => {
        localStorage.setItem('tf_gemini_api_key', e.target.value.trim());
    });

    const samples = {
        a: {
            "id": 101,
            "user": "jdoe",
            "status": "active",
            "metadata": {
                "created_at": "2026-01-01"
            }
        },
        b: {
            "id": 101,
            "username": "jdoe",
            "status": "pending",
            "tags": ["beta", "internal"],
            "metadata": {
                "created_at": "2026-01-01",
                "updated_at": "2026-05-11"
            }
        }
    };

    // Tab Switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
        });
    });

    btnSample.addEventListener('click', () => {
        jsonA.value = JSON.stringify(samples.a, null, 4);
        jsonB.value = JSON.stringify(samples.b, null, 4);
    });

    btnClear.addEventListener('click', () => {
        jsonA.value = '';
        jsonB.value = '';
        results.style.display = 'none';
    });

    btnDiff.addEventListener('click', () => {
        try {
            const a = JSON.parse(jsonA.value || '{}');
            const b = JSON.parse(jsonB.value || '{}');
            
            const diff = performDiff(a, b);
            renderDiff(diff);
            
            results.style.display = 'block';
            results.scrollIntoView({ behavior: 'smooth' });
        } catch (e) {
            showToast('Invalid JSON provided.');
        }
    });

    btnAiMerge.addEventListener('click', async () => {
        const apiKey = apiKeyInput.value.trim();
        if (!apiKey) {
            showToast('Please enter your Gemini API Key in the top right.');
            apiKeyInput.focus();
            return;
        }

        const aText = jsonA.value.trim() || '{}';
        const bText = jsonB.value.trim() || '{}';
        const targetFormat = schemaType.value; // 'zod' or 'typescript'

        const originalBtnHTML = btnAiMerge.innerHTML;
        btnAiMerge.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg> Analyzing...`;
        btnAiMerge.disabled = true;

        try {
            const prompt = `You are an expert developer. Analyze these two JSON payloads (A and B) representing different states or versions of an API response.
            Generate a single unified ${targetFormat === 'zod' ? 'Zod Schema (const schema = z.object(...))' : 'TypeScript Interface'} that can safely handle both formats.
            Make fields optional if they appear in one but not the other.
            Return ONLY the raw code block without markdown formatting or markdown backticks. Do not include any explanations.

            --- JSON A ---
            ${aText}

            --- JSON B ---
            ${bText}
            `;

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.1 }
                })
            });

            if (!response.ok) throw new Error('API Error: ' + response.statusText);
            
            const data = await response.json();
            let resultText = data.candidates[0].content.parts[0].text;
            
            // Clean up any potential markdown backticks that the model might stubbornly add
            resultText = resultText.replace(/^```(typescript|ts|javascript|js)?\\n/i, '').replace(/\\n```$/i, '').trim();

            schemaOutput.textContent = resultText;
            
            results.style.display = 'block';
            tabs[1].click();
            results.scrollIntoView({ behavior: 'smooth' });
            showToast('AI Schema Generated Successfully!');

        } catch (e) {
            showToast('AI Error: Check console or API key.');
            console.error(e);
        } finally {
            btnAiMerge.innerHTML = originalBtnHTML;
            btnAiMerge.disabled = false;
        }
    });

    btnCopy.addEventListener('click', () => {
        navigator.clipboard.writeText(schemaOutput.textContent).then(() => {
            showToast('Schema copied!');
        });
    });

    function performDiff(objA, objB, path = '') {
        const changes = [];
        const allKeys = new Set([...Object.keys(objA), ...Object.keys(objB)]);

        allKeys.forEach(key => {
            const valA = objA[key];
            const valB = objB[key];
            const currentPath = path ? `${path}.${key}` : key;

            if (!(key in objA)) {
                changes.push({ type: 'added', path: currentPath, value: valB });
            } else if (!(key in objB)) {
                changes.push({ type: 'removed', path: currentPath, value: valA });
            } else if (typeof valA !== typeof valB) {
                changes.push({ type: 'changed_type', path: currentPath, old: typeof valA, new: typeof valB });
            } else if (typeof valA === 'object' && valA !== null && valB !== null) {
                changes.push(...performDiff(valA, valB, currentPath));
            } else if (valA !== valB) {
                changes.push({ type: 'changed_value', path: currentPath, old: valA, new: valB });
            }
        });

        return changes;
    }

    function renderDiff(diff) {
        if (diff.length === 0) {
            diffOutput.innerHTML = '<div class="text-center py-8 text-slate-400 font-bold">No structural differences found.</div>';
            return;
        }

        diffOutput.innerHTML = diff.map(change => {
            let label = '';
            let content = '';
            switch (change.type) {
                case 'added':
                    label = `<span class="badge" style="background: var(--accent-green)">+ ADDED</span>`;
                    content = `<span class="diff-added">${JSON.stringify(change.value)}</span>`;
                    break;
                case 'removed':
                    label = `<span class="badge" style="background: var(--accent-red)">- REMOVED</span>`;
                    content = `<span class="diff-removed">${JSON.stringify(change.value)}</span>`;
                    break;
                case 'changed_type':
                    label = `<span class="badge" style="background: var(--primary)">TYPE CHANGE</span>`;
                    content = `${change.old} -> ${change.new}`;
                    break;
                case 'changed_value':
                    label = `<span class="badge" style="background: var(--text-muted)">VALUE CHANGE</span>`;
                    content = `${JSON.stringify(change.old)} -> ${JSON.stringify(change.new)}`;
                    break;
            }
            return `<div style="margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05)">
                <div style="font-weight: 800; font-size: 0.7rem; color: var(--text-muted); margin-bottom: 0.5rem;">${change.path.toUpperCase()}</div>
                <div style="display: flex; gap: 1rem; align-items: center;">${label} ${content}</div>
            </div>`;
        }).join('');
    }

    function generateMockMergedSchema(a, b) {
        // Simple mock generator for the demo
        const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])];
        let zod = "const MergedSchema = z.object({\n";
        keys.forEach(k => {
            const isOptional = !(k in a && k in b);
            const val = b[k] !== undefined ? b[k] : a[k];
            const type = typeof val === 'number' ? 'number()' : typeof val === 'boolean' ? 'boolean()' : 'string()';
            zod += `    ${k}: z.${type}${isOptional ? '.optional()' : ''},\n`;
        });
        zod += "});";
        return zod;
    }

    function showToast(msg) {
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
});
