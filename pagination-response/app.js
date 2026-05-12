document.addEventListener('DOMContentLoaded', () => {
    const typeBtns = document.querySelectorAll('.type-btn');
    const presetSelect = document.getElementById('preset-select');
    const entityInput = document.getElementById('entity-name');
    const wrapperInput = document.getElementById('wrapper-name');
    const outputTs = document.getElementById('output-ts');
    const outputJson = document.getElementById('output-json');
    const toast = document.getElementById('toast');

    let currentType = 'offset';

    const PRESETS = {
        github: {
            type: 'offset',
            wrapper: 'GitHubSearchResponse',
            entity: 'T',
            fields: {
                items: 'T[]',
                total_count: 'number',
                incomplete_results: 'boolean'
            }
        },
        stripe: {
            type: 'cursor',
            wrapper: 'StripeList',
            entity: 'T',
            fields: {
                object: "'list'",
                url: 'string',
                has_more: 'boolean',
                data: 'T[]'
            }
        },
        notion: {
            type: 'cursor',
            wrapper: 'NotionList',
            entity: 'T',
            fields: {
                object: "'list'",
                results: 'T[]',
                next_cursor: 'string | null',
                has_more: 'boolean'
            }
        }
    };

    function highlight(code) {
        return code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\b(export|type|interface|string|number|boolean|null|T)\b/g, '<span class="hl-keyword">$1</span>')
            .replace(/\b([A-Z][a-zA-Z0-9]+)\b/g, '<span class="hl-type">$1</span>')
            .replace(/'([^']*)'/g, '<span class="hl-string">\'$1\'</span>')
            .replace(/\b([a-z_]+):/g, '<span class="hl-key">$1</span>:')
            .replace(/(\/\/.*)/g, '<span class="hl-comment">$1</span>');
    }

    function generate() {
        const entity = entityInput.value.trim() || 'T';
        const wrapper = wrapperInput.value.trim() || 'PaginatedResponse';
        const preset = presetSelect.value;
        
        let tsCode = '';
        let jsonCode = {};

        if (preset !== 'custom') {
            const p = PRESETS[preset];
            tsCode = `export interface ${p.wrapper}<${p.entity}> {\n`;
            Object.entries(p.fields).forEach(([k, v]) => {
                tsCode += `  ${k}: ${v};\n`;
            });
            tsCode += `}`;
            
            // Mock JSON
            const mock = {};
            Object.entries(p.fields).forEach(([k, v]) => {
                if (v === 'number') mock[k] = 100;
                else if (v === 'boolean') mock[k] = true;
                else if (v === 'string' || v === 'string | null') mock[k] = "abc_123";
                else if (v === 'T[]' || v === 'data' || v === 'results') mock[k] = [{}, {}];
                else if (v.startsWith("'")) mock[k] = v.replace(/'/g, "");
                else mock[k] = null;
            });
            jsonCode = mock;
        } else {
            tsCode = `export interface ${wrapper}<${entity}> {\n`;
            const itemsKey = (currentType === 'stripe') ? 'data' : (currentType === 'notion') ? 'results' : 'items';
            
            if (currentType === 'offset') {
                tsCode += `  ${itemsKey}: ${entity}[];\n  totalCount: number;\n  offset: number;\n  limit: number;\n  hasNextPage: boolean;\n`;
                jsonCode = { [itemsKey]: [], totalCount: 1250, offset: 20, limit: 10, hasNextPage: true };
            } else if (currentType === 'cursor') {
                tsCode += `  ${itemsKey}: ${entity}[];\n  nextCursor: string | null;\n  hasMore: boolean;\n  pageSize: number;\n`;
                jsonCode = { [itemsKey]: [], nextCursor: "Y3Vyc29yXzEw", hasMore: true, pageSize: 50 };
            } else if (currentType === 'page') {
                tsCode += `  ${itemsKey}: ${entity}[];\n  currentPage: number;\n  totalPages: number;\n  totalItems: number;\n  itemsPerPage: number;\n`;
                jsonCode = { [itemsKey]: [], currentPage: 2, totalPages: 15, totalItems: 142, itemsPerPage: 10 };
            } else if (currentType === 'infinite') {
                tsCode += `  ${itemsKey}: ${entity}[];\n  nextPage: number | null;\n  isLoading: boolean;\n  hasMore: boolean;\n`;
                jsonCode = { [itemsKey]: [], nextPage: 3, isLoading: false, hasMore: true };
            }
            tsCode += `}`;
        }

        outputTs.innerHTML = highlight(tsCode);
        outputJson.textContent = JSON.stringify(jsonCode, null, 2);
    }

    // --- Events ---
    typeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            typeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentType = btn.dataset.type;
            presetSelect.value = 'custom';
            generate();
        });
    });

    presetSelect.addEventListener('change', () => {
        if (presetSelect.value !== 'custom') {
            typeBtns.forEach(b => b.classList.remove('active'));
        }
        generate();
    });

    [entityInput, wrapperInput].forEach(el => {
        el.addEventListener('input', generate);
    });

    const copy = (id) => {
        const text = document.getElementById(id).innerText;
        navigator.clipboard.writeText(text).then(() => {
            toast.style.display = 'block';
            setTimeout(() => toast.style.display = 'none', 2000);
        });
    };

    document.getElementById('btn-copy-ts').addEventListener('click', () => copy('output-ts'));
    document.getElementById('btn-copy-json').addEventListener('click', () => copy('output-json'));

    // Initial load
    generate();
});
