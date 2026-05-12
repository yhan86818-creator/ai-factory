document.addEventListener('DOMContentLoaded', () => {
    const errorCodesInput = document.getElementById('error-codes');
    const interfaceNameInput = document.getElementById('interface-name');
    const exportStyleSelect = document.getElementById('export-style');
    const presetBtns = document.querySelectorAll('.preset-btn');
    const outputCode = document.getElementById('output-code');
    const btnCopy = document.getElementById('btn-copy');
    const toast = document.getElementById('toast');

    let currentPreset = 'standard';

    const PRESETS = {
        standard: {
            codes: "NOT_FOUND\nBAD_REQUEST\nINTERNAL_ERROR",
            name: "ApiError"
        },
        validation: {
            codes: "VALIDATION_FAILED\nINVALID_INPUT",
            name: "ValidationError"
        },
        auth: {
            codes: "UNAUTHORIZED\nFORBIDDEN\nTOKEN_EXPIRED",
            name: "AuthError"
        },
        result: {
            codes: "API_FAILURE\nNETWORK_ERROR",
            name: "ActionResult"
        },
        either: {
            codes: "LEFT_FAILURE\nRIGHT_SUCCESS",
            name: "Either"
        }
    };

    function highlight(code) {
        return code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\b(export|type|interface|type|const)\b/g, '<span class="keyword">$1</span>')
            .replace(/\b(string|number|boolean|any|unknown|T|E|Record)\b/g, '<span class="type">$1</span>')
            .replace(/'([^']*)'/g, '<span class="string">\'$1\'</span>')
            .replace(/"([^"]*)"/g, '<span class="string">"$1"</span>')
            .replace(/\b([a-zA-Z0-9_]+):/g, '<span class="property">$1</span>:')
            .replace(/(\/\/.*)/g, '<span class="comment">$1</span>');
    }

    function generate() {
        const codes = errorCodesInput.value.split('\n').map(c => c.trim()).filter(c => c.length > 0);
        const name = interfaceNameInput.value.trim() || "Error";
        const style = exportStyleSelect.value;
        const exportPrefix = style === 'none' ? 'const' : style === 'interface' ? 'export interface' : 'export type';
        
        const codeUnion = codes.length > 0 ? codes.map(c => `'${c}'`).join(' | ') : 'string';
        
        let template = '';

        if (currentPreset === 'standard') {
            template = `${style === 'interface' ? '' : ' = '}{\n  code: ${codeUnion};\n  message: string;\n  status: number;\n  timestamp: string;\n};`;
        } else if (currentPreset === 'validation') {
            template = `${style === 'interface' ? '' : ' = '}{\n  code: ${codeUnion};\n  message: string;\n  errors: Record<string, string[]>; // Field-specific error messages\n};`;
        } else if (currentPreset === 'auth') {
            template = `${style === 'interface' ? '' : ' = '}{\n  code: ${codeUnion};\n  message: string;\n  expiredAt?: string;\n  realm?: string;\n};`;
        } else if (currentPreset === 'result') {
            const codeType = codes.length > 0 ? `export type ${name}Code = ${codeUnion};\n\n` : '';
            template = ` = \n  | { success: true; data: T }\n  | { success: false; error: {\n      code: ${codes.length > 0 ? name + 'Code' : 'string'};\n      message: string;\n    } };`;
            
            outputCode.innerHTML = highlight(`${codeType}export type ${name}<T> ${template}`);
            return;
        } else if (currentPreset === 'either') {
            template = ` = \n  | { _tag: 'Left'; error: E }\n  | { _tag: 'Right'; value: T };\n\n// Usage Helper\nexport const isLeft = <E, T>(e: ${name}<E, T>): e is { _tag: 'Left'; error: E } => e._tag === 'Left';`;
            outputCode.innerHTML = highlight(`export type ${name}<E, T> ${template}`);
            return;
        }

        const finalCode = `${exportPrefix} ${name}${template}`;
        outputCode.innerHTML = highlight(finalCode);
    }

    // --- Events ---

    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            presetBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentPreset = btn.dataset.preset;
            
            errorCodesInput.value = PRESETS[currentPreset].codes;
            interfaceNameInput.value = PRESETS[currentPreset].name;
            
            generate();
        });
    });

    [errorCodesInput, interfaceNameInput, exportStyleSelect].forEach(el => {
        el.addEventListener('input', generate);
        el.addEventListener('change', generate);
    });

    btnCopy.addEventListener('click', () => {
        const text = outputCode.innerText;
        navigator.clipboard.writeText(text).then(() => {
            toast.style.display = 'block';
            setTimeout(() => toast.style.display = 'none', 2000);
        });
    });

    // Initial load
    generate();
});
