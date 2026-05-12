document.addEventListener('DOMContentLoaded', () => {
    const jsonInput = document.getElementById('json-input');
    const outputZod = document.getElementById('output-zod');
    const outputTs = document.getElementById('output-ts');
    const outputUsage = document.getElementById('output-usage');
    const btnCopy = document.getElementById('btn-copy');
    const btnLoadSample = document.getElementById('btn-load-sample');
    const checkStrict = document.getElementById('check-strict');
    const checkOptional = document.getElementById('check-optional');
    const checkPassthrough = document.getElementById('check-passthrough');
    const tabs = document.querySelectorAll('.tab');
    const toast = document.getElementById('toast');
    const validationStatus = document.getElementById('validation-status');

    let currentTab = 'zod';

    const SAMPLE_JSON = {
        id: "usr_01H2X9",
        username: "johndoe",
        email: "john@example.com",
        age: 28,
        isActive: true,
        profile: {
            bio: "Software Engineer",
            avatar_url: null,
            socials: ["twitter", "github"]
        },
        metadata: {
            last_login: "2023-10-01T12:00:00Z",
            tags: [1, 2, 3]
        }
    };

    // --- Core Logic ---

    function highlight(code, lang = 'ts') {
        if (!code) return "";
        // Simple regex highlighting
        let html = code
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

        // Keywords
        html = html.replace(/\b(const|export|type|import|from|try|catch|instanceof|console)\b/g, '<span class="syntax-keyword">$1</span>');
        // Functions/Methods
        html = html.replace(/\b(z\.[a-z]+|parse|log|error)\b/g, '<span class="syntax-fn">$1</span>');
        // Types
        html = html.replace(/\b(string|number|boolean|any|null|Root|MyType)\b/g, '<span class="syntax-type">$1</span>');
        // Strings
        html = html.replace(/"([^"]*)"/g, '<span class="syntax-string">"$1"</span>');
        // Comments
        html = html.replace(/(\/\/.*)/g, '<span class="syntax-comment">$1</span>');

        return html;
    }

    function generateZodSchema(data, indent = "") {
        const type = typeof data;
        
        if (data === null) return "z.null()";
        if (type === "string") return "z.string()";
        if (type === "number") return "z.number()";
        if (type === "boolean") return "z.boolean()";
        
        if (Array.isArray(data)) {
            if (data.length === 0) return "z.array(z.any())";
            
            // Check for mixed types in array
            const types = new Set(data.map(item => typeof item));
            if (types.size > 1) {
                const uniqueSchemas = [...new Set(data.map(item => generateZodSchema(item, "")))];
                return `z.array(z.union([${uniqueSchemas.join(", ")}]))`;
            }
            
            const innerSchema = generateZodSchema(data[0], indent);
            return `z.array(${innerSchema})`;
        }
        
        if (type === "object") {
            let schema = "z.object({\n";
            const keys = Object.keys(data);
            keys.forEach((key, index) => {
                const value = data[key];
                const isLast = index === keys.length - 1;
                let innerSchema = generateZodSchema(value, indent + "  ");
                
                if (value === null) {
                    innerSchema = "z.any().nullable()"; // Better default for null in Zod
                }
                
                const isOptional = checkOptional.checked && (value === null || value === undefined);
                const suffix = isOptional ? ".optional()" : "";
                
                schema += `${indent}  ${key}: ${innerSchema}${suffix}${isLast ? "" : ","}\n`;
            });
            
            schema += `${indent}})`;
            
            if (checkStrict.checked) schema += ".strict()";
            if (checkPassthrough.checked) schema += ".passthrough()";
            
            return schema;
        }
        
        return "z.any()";
    }

    function generateTypeScript(data, name = "Root", indent = "") {
        const type = typeof data;
        
        if (data === null) return "null";
        if (type === "string") return "string";
        if (type === "number") return "number";
        if (type === "boolean") return "boolean";
        
        if (Array.isArray(data)) {
            if (data.length === 0) return "any[]";
            const types = new Set(data.map(item => typeof item));
            if (types.size > 1) {
                const uniqueTypes = [...new Set(data.map(item => generateTypeScript(item, "", "")))];
                return `(${uniqueTypes.join(" | ")})[]`;
            }
            const innerType = generateTypeScript(data[0], "", indent);
            return `${innerType}[]`;
        }
        
        if (type === "object") {
            let ts = "{\n";
            const keys = Object.keys(data);
            keys.forEach((key, index) => {
                const value = data[key];
                const isLast = index === keys.length - 1;
                const innerType = generateTypeScript(value, "", indent + "  ");
                ts += `${indent}  ${key}: ${innerType}${isLast ? "" : ";"}\n`;
            });
            ts += `${indent}}`;
            return ts;
        }
        
        return "any";
    }

    function generateUsage(schemaName) {
        const rawJson = jsonInput.value || "{}";
        let parsedJson = "{}";
        try {
            parsedJson = JSON.stringify(JSON.parse(rawJson), null, 2).replace(/\n/g, "\n  ");
        } catch(e) {}

        return `import { z } from 'zod';

// 1. Define Schema
const ${schemaName} = ${generateZodSchema(JSON.parse(rawJson), "")};

// 2. Infer Type
type ${schemaName.charAt(0).toUpperCase() + schemaName.slice(1)} = z.infer<typeof ${schemaName}>;

// 3. Example Validation
try {
  const data = ${parsedJson};
  
  const validatedData = ${schemaName}.parse(data);
  console.log("Validation successful!", validatedData);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error("Validation failed:", error.errors);
  }
}`;
    }

    // --- Live Validation ---
    function getDynamicZodSchema(data) {
        if (typeof zod === 'undefined') return null;
        const z = zod.z;
        
        const type = typeof data;
        if (data === null) return z.null();
        if (type === "string") return z.string();
        if (type === "number") return z.number();
        if (type === "boolean") return z.boolean();
        
        if (Array.isArray(data)) {
            if (data.length === 0) return z.array(z.any());
            const types = new Set(data.map(item => typeof item));
            if (types.size > 1) {
                const uniqueSchemas = [...new Set(data.map(item => getDynamicZodSchema(item)))].filter(Boolean);
                return z.array(z.union(uniqueSchemas));
            }
            return z.array(getDynamicZodSchema(data[0]));
        }
        
        if (type === "object") {
            const shape = {};
            for (const key in data) {
                let s = getDynamicZodSchema(data[key]);
                if (checkOptional.checked && (data[key] === null || data[key] === undefined)) {
                    s = s.optional();
                }
                shape[key] = s;
            }
            let schema = z.object(shape);
            if (checkStrict.checked) schema = schema.strict();
            if (checkPassthrough.checked) schema = schema.passthrough();
            return schema;
        }
        return z.any();
    }

    function updateOutputs() {
        try {
            const raw = jsonInput.value.trim();
            if (!raw) {
                clearOutputs();
                return;
            }
            
            const data = JSON.parse(raw);
            
            // Generate Strings
            const zodSchemaStr = `const schema = ${generateZodSchema(data)};`;
            const tsInterfaceStr = `export type MyType = ${generateTypeScript(data)};`;
            const usageCodeStr = generateUsage("mySchema");

            outputZod.innerHTML = highlight(zodSchemaStr);
            outputTs.innerHTML = highlight(tsInterfaceStr);
            outputUsage.innerHTML = highlight(usageCodeStr);

            // Live Validation
            if (typeof zod !== 'undefined') {
                try {
                    const schema = getDynamicZodSchema(data);
                    const result = schema.safeParse(data);
                    
                    if (result.success) {
                        validationStatus.innerHTML = `
                            <div style="color: #4ade80; font-weight: 600; margin-bottom: 0.5rem;">✓ Schema matches input data</div>
                            <pre style="font-size: 0.8rem; opacity: 0.8;">${JSON.stringify(result.data, null, 2)}</pre>
                        `;
                        validationStatus.style.borderLeft = "4px solid #4ade80";
                    } else {
                        validationStatus.innerHTML = `
                            <div style="color: #f87171; font-weight: 600; margin-bottom: 0.5rem;">✖ Validation Error</div>
                            <pre style="font-size: 0.8rem; opacity: 0.8;">${JSON.stringify(result.error.format(), null, 2)}</pre>
                        `;
                        validationStatus.style.borderLeft = "4px solid #f87171";
                    }
                } catch (err) {
                    validationStatus.innerHTML = `<span style="color: #facc15;">⚠ Could not run live validation: ${err.message}</span>`;
                }
            } else {
                validationStatus.innerHTML = '<span style="color: #4ade80;">✓ Valid JSON Detected</span>';
                validationStatus.style.borderLeft = "4px solid #4ade80";
            }
            
        } catch (e) {
            validationStatus.innerHTML = `<span style="color: #f87171;">✖ Invalid JSON: ${e.message}</span>`;
            validationStatus.style.borderLeft = "4px solid #f87171";
        }
    }


    function clearOutputs() {
        outputZod.textContent = "";
        outputTs.textContent = "";
        outputUsage.textContent = "";
        validationStatus.textContent = "Waiting for input...";
        validationStatus.style.borderLeft = "none";
    }

    // --- Event Listeners ---

    jsonInput.addEventListener('input', updateOutputs);
    [checkStrict, checkOptional, checkPassthrough].forEach(el => {
        el.addEventListener('change', updateOutputs);
    });

    btnLoadSample.addEventListener('click', () => {
        jsonInput.value = JSON.stringify(SAMPLE_JSON, null, 2);
        updateOutputs();
    });

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            currentTab = tab.dataset.tab;
            
            outputZod.style.display = 'none';
            outputTs.style.display = 'none';
            outputUsage.style.display = 'none';
            
            document.getElementById(`output-${currentTab}`).style.display = 'block';
        });
    });

    btnCopy.addEventListener('click', () => {
        const activeOutput = document.getElementById(`output-${currentTab}`);
        const text = activeOutput.textContent;
        
        navigator.clipboard.writeText(text).then(() => {
            toast.style.display = 'block';
            setTimeout(() => {
                toast.style.display = 'none';
            }, 2000);
        });
    });

    // Initial load
    btnLoadSample.click();
});
