---
paths:
  - "repository-information/**"
  - "README.md"
  - "CONTRIBUTING.md"
  - "SECURITY.md"
  - "CODE_OF_CONDUCT.md"
---

# Repository Documentation Rules

*Actionable rules: see Pre-Commit Checklist items #6, #8, #11, #12, #13 in CLAUDE.md.*

## REPO-ARCHITECTURE.md Structural Updates

The Mermaid diagrams in `repository-information/REPO-ARCHITECTURE.md` show the repo-wide architecture: how environments (pages) connect to each other and to shared infrastructure (CI/CD, GitHub Pages, templates, versioning, developer tools). Diagrams are updated only when the project structure changes (files added, moved, or deleted) — **not** on version bumps. Version numbers are not displayed in diagram nodes; STATUS.md serves as the version dashboard.

### Environment scope rule
REPO-ARCHITECTURE.md must NOT include the internal processes of **individual** environments (page lifecycle states, maintenance mode internals, splash screen flows, environment-specific workflows). Environments appear as **nodes** that show their connections to other environments and shared repo components — but their internal behavior is documented in per-environment diagrams under `repository-information/diagrams/`. When adding or modifying REPO-ARCHITECTURE.md diagrams, keep environment nodes as opaque boxes — show what they connect to, not what happens inside them. If internal process detail is needed, add it to the corresponding per-environment diagram instead.

**Exception — template-level behaviors**: the auto-refresh loop, GAS iframe interaction, and maintenance mode state machine ARE included in REPO-ARCHITECTURE.md (section 3) as a combined state diagram because they are inherited by **all pages** via the HTML/GAS templates. This diagram is generic (not referencing specific environments) and should only change when the templates (`HtmlAndGasTemplateAutoUpdate.html.txt` or the GAS script template) change — not when individual environments change.

### Diagram accuracy requirements

Every diagram must faithfully represent the actual source code it documents. **Do not invent, simplify, or assume behaviors** — read the code first. These criteria apply to all diagrams in `REPO-ARCHITECTURE.md`, `repository-information/diagrams/`, and any future diagram files:

1. **Cross-reference against source code** — before creating or modifying a diagram, read the actual source file(s) it describes. For template-level behaviors, read `HtmlAndGasTemplateAutoUpdate.html.txt` and the GAS script template. For per-environment diagrams, read the specific page's HTML and `.gs` files. Never diagram from memory or assumption
2. **No invented interactions** — only show messages, events, and state transitions that exist in the code. If a `postMessage` handler doesn't exist, don't diagram it. If a function isn't called, don't show it being called. The most common error is inventing plausible-sounding interactions that seem like they should exist but don't (e.g. a `gas-reload` postMessage that was never implemented)
3. **Distinguish server-side vs. client-side** — GAS scripts run on Google's servers (triggered by HTTP requests), not in the browser. Sequence diagrams must show server-side operations as interactions between the GAS participant and external services (GitHub API, Apps Script API), not as browser-to-GAS messages. Client-side detection of changes (e.g. gs.version.txt polling) is a separate flow from the server-side update itself
4. **State machines must reflect real code paths** — every state, transition, and condition in a `stateDiagram-v2` must map to an actual code construct (variable check, function call, setTimeout, event listener). Include error states, conditional branches, and timing values (delays, intervals) that exist in the code. Don't collapse distinct code paths into a single transition for "simplicity" if it misrepresents the behavior
5. **Show timing and sequencing accurately** — if the code uses a 15s initial delay before starting a polling loop, show it. If there's an anti-sync mechanism that adds padding when two polls overlap, show it. These details matter for understanding actual runtime behavior
6. **Maintenance mode is a conditional, not a separate machine** — in the template source, maintenance mode is checked as a flag within the HTML version polling loop, not as an independent state machine. Diagrams should reflect this structural relationship
7. **Verify mermaid.live URLs decompress correctly** — after every URL update, run the decompression verification (see "Mandatory verification" in the mermaid.live URL section below). A URL that looks valid but fails to decompress is useless

### Adding new pages
When a new embedding page is created (see New Embedding Page Setup Checklist in `.claude/rules/html-pages.md`), add:
- A page node in the "Environments (Pages)" subgraph: `NEWPAGE["[template] page-name.html\n(Display Name)"]`
- Connection edges showing how the page relates to shared resources (version polling, iframe embedding, etc.)
- A per-environment diagram in `repository-information/diagrams/` for the page's internal processes

## Mermaid Diagram Compatibility Reference

REPO-ARCHITECTURE.md contains 9 diagrams across different mermaid types. Each has different rendering support and theme requirements. **Follow these rules when adding or modifying diagrams.**

### Rendering support by diagram type

| # | Type | Mermaid Syntax | GitHub Renders? | Theme Required? |
|---|------|---------------|-----------------|-----------------|
| 1 | Flowchart | `graph TB` | Yes | No — use per-node `style` directives for colors |
| 2 | Sequence | `sequenceDiagram` | Yes | No — works natively |
| 3 | State (Template Behaviors) | `stateDiagram-v2` | Yes | No — works natively |
| 4 | Git Graph | `gitGraph` | Yes | No — works natively |
| 5 | Architecture | `architecture-beta` | **No** | N/A — mermaid.live link only |
| 6 | C4 Context | `C4Context` | **No** | N/A — mermaid.live link only |
| 7 | Mindmap | `mindmap` | Yes | **Yes** — requires `base` theme with custom colors (see below) |
| 8 | ER Diagram | `erDiagram` | Yes | No — works natively |
| 9 | Class Diagram | `classDiagram` | Yes | No — works natively |

### Diagrams that GitHub cannot render

`architecture-beta` and `C4Context` are not supported by GitHub's mermaid renderer. For these:
- Do **not** include a `` ```mermaid `` code block (it would show an error on GitHub)
- Provide only a mermaid.live link with a note: *"This diagram type is not supported by GitHub's mermaid renderer — use the link above to view it."*

### Diagrams that GitHub renders — all must include both

For all 7 GitHub-renderable types, always include:
1. A mermaid.live link above the code block (for interactive editing, pan/zoom, export)
2. A `` ```mermaid `` code block (for inline rendering on GitHub)

### Dark-mode text readability — the Mindmap problem

GitHub and mermaid.live both support dark mode. Most diagram types handle dark-mode text automatically — the renderer inverts text colors to stay readable. **Mindmaps are the exception.** Without theme overrides, mindmap nodes get colored backgrounds (via `cScale`) but the text color may remain light/white on light backgrounds, making labels unreadable.

**The fix** — use the `base` theme with explicit color overrides:

```
%%{init: {'theme':'base', 'themeVariables': {
  'primaryColor': '#7ba3d4',
  'primaryTextColor': '#000000',
  'cScale0': '#e8b4b8',
  'cScale1': '#b8d4e8',
  'cScale2': '#b8e8c8',
  'cScale3': '#e8d4b8',
  'cScale4': '#d4b8e8',
  'cScaleLabel0': '#000000',
  'cScaleLabel1': '#000000',
  'cScaleLabel2': '#000000',
  'cScaleLabel3': '#000000',
  'cScaleLabel4': '#000000',
  'cScaleInv0': '#000000',
  'cScaleInv1': '#000000',
  'cScaleInv2': '#000000',
  'cScaleInv3': '#000000',
  'cScaleInv4': '#000000'
}}}%%
```

**What each variable controls:**
- `primaryColor` / `primaryTextColor` — the root node's fill and text color
- `cScale0`–`cScale4` — background colors for branch depth levels 1–5 (pastel palette for readability)
- `cScaleLabel0`–`cScaleLabel4` — text color per depth level (force `#000000` for black text)
- `cScaleInv0`–`cScaleInv4` — inverted/alternate text color per depth level (also force `#000000`)

**Why `base` theme, not `default` or `neutral`:**
- `default` theme: ignores `cScaleLabel` and `cScaleInv` — text stays white on dark mode
- `neutral` theme: makes the entire diagram grayscale — loses the colorful branch distinction
- `base` theme: gives full control over all theme variables — colors and text both respond to overrides

**Why all three text variables are needed:**
- `cScaleLabel` alone is insufficient — mermaid's mindmap renderer uses different CSS classes at different depths
- `cScaleInv` catches the alternate text path used by some depth levels
- `primaryTextColor` catches the root node specifically
- Setting all three to `#000000` guarantees black text at every depth in both light and dark mode

### Flowchart node colors

Flowcharts use per-node `style` directives instead of theme variables:
```
style NODE_ID fill:#4a90d9,color:#fff
```
These work in both light and dark mode because the fill and text color are explicitly set per node. No theme directive is needed.

### Mermaid.live URL generation — the pako encoding process

Every diagram in REPO-ARCHITECTURE.md has a clickable "Open in mermaid.live" link. These links use pako-compressed, base64url-encoded JSON that mermaid.live decodes to populate its editor. **Getting these URLs right was the hardest part of the diagram setup** — multiple failure modes exist.

#### How the URL format works

mermaid.live URLs have the format: `https://mermaid.live/edit#pako:<encoded-string>`

The encoded string is created by:
1. Building a JSON state object: `{"code": "<mermaid code>", "mermaid": "{\"theme\":\"default\"}", "autoSync": true, "updateDiagram": true}`
2. Deflating it with pako (zlib compression, level 9)
3. Base64url-encoding the compressed bytes (URL-safe alphabet, no padding)

#### Required npm dependencies

The generation uses **the exact same libraries** as mermaid.live itself:
```bash
npm install --prefix /tmp pako js-base64
```
These must be installed in `/tmp` before any URL generation. They persist across tool calls within a session but not across sessions — reinstall if needed.

#### The generation command (per diagram)

The CLAUDE.md Pre-Commit #6 command only handles the **first** `` ```mermaid `` block in the file. For multiple diagrams, the extraction must target the specific diagram by searching for its unique content or link label.

**Generic approach for any diagram** — extract the mermaid code between `` ```mermaid\n `` and `` \n``` `` for a specific section:

```javascript
node -e "
const pako=require('/tmp/node_modules/pako');
const{fromUint8Array}=require('/tmp/node_modules/js-base64');
const fs=require('fs');
const f=fs.readFileSync('repository-information/REPO-ARCHITECTURE.md','utf8');
// Find the specific code block by searching for content unique to this diagram
const marker='<UNIQUE_FIRST_LINE>';  // e.g. 'graph TB' or 'sequenceDiagram' or 'mindmap'
const startSearch=f.indexOf(marker);
const codeStart=f.lastIndexOf('\`\`\`mermaid\n', startSearch)+'\`\`\`mermaid\n'.length;
const codeEnd=f.indexOf('\n\`\`\`', startSearch);
const code=f.substring(codeStart, codeEnd);
const state={code:code,mermaid:JSON.stringify({theme:'default'}),autoSync:true,updateDiagram:true};
const compressed=pako.deflate(new TextEncoder().encode(JSON.stringify(state)),{level:9});
const url='https://mermaid.live/edit#pako:'+fromUint8Array(compressed,true);
fs.writeFileSync('/tmp/mermaid_url.txt', url);
console.log('done, code length:', code.length);
"
```

**For mermaid.live-only diagrams** (no code block in the file), the mermaid code must be passed as a string literal or read from a temporary file.

#### Critical rule: NEVER use Edit tool to insert raw pako URLs

The encoded URLs are ~1000–3000 characters of dense base64. **The Edit tool can corrupt individual characters** during replacement — a single-character change produces a valid-looking URL that fails to decompress.

**The safe approach:**
1. Write the URL to a temp file: `fs.writeFileSync('/tmp/mermaid_url.txt', url)`
2. Use Python regex replacement to swap the URL in REPO-ARCHITECTURE.md:
```python
python3 << 'PYEOF'
import re
with open('repository-information/REPO-ARCHITECTURE.md') as f:
    content = f.read()
with open('/tmp/mermaid_url.txt') as f:
    new_url = f.read().strip()
# Use the link label to target the specific diagram's URL
old_pattern = r'(\[Open in mermaid\.live — DIAGRAM_NAME\]\()https://mermaid\.live/edit#pako:[^)]+(\))'
new_repl = r'\g<1>' + new_url + r'\g<2>'
content_new = re.sub(old_pattern, new_repl, content)
with open('repository-information/REPO-ARCHITECTURE.md', 'w') as f:
    f.write(content_new)
PYEOF
```
Replace `DIAGRAM_NAME` with the specific link label (e.g. `Flowchart`, `Sequence`, `Mindmap`).

#### Mandatory verification after every URL update

After writing the URL into the file, **always** verify it decompresses correctly:
```python
python3 -c "
import base64,zlib,json,re
f=open('repository-information/REPO-ARCHITECTURE.md').read()
m=re.search(r'mermaid\.live/edit#pako:([^\)]+)',f)
e=m.group(1)
p=e+'='*((4-len(e)%4)%4)
d=zlib.decompress(base64.urlsafe_b64decode(p))
j=json.loads(d)
print('OK —',len(j['code']),'chars')
"
```
If this fails with a checksum or decompression error, the URL was corrupted — regenerate it.

**For verifying a specific diagram's URL** (not just the first match), use the link label in the regex:
```python
m=re.search(r'DIAGRAM_NAME\]\(https://mermaid\.live/edit#pako:([^\)]+)', f)
```

#### Common failure modes (lessons learned)

1. **Edit tool character corruption** — the #1 cause of broken URLs. The Edit tool's `old_string`/`new_string` matching can silently alter characters in long base64 strings. Always use the Python regex file-write approach instead
2. **Wrong code extraction boundaries** — if the `indexOf` for `` ```mermaid\n `` or `` \n``` `` is off by even one character, the mermaid code will include the fence markers or miss the init directive, producing a URL that opens mermaid.live with a syntax error. Always log `code.length` and sanity-check it matches expectations
3. **Multiple code blocks** — the simple `indexOf('```mermaid\n')` finds the **first** code block. For diagrams later in the file, use a unique content marker (like the diagram's first keyword) to locate the right block, then search backwards for the fence
4. **mermaid.live-only diagrams have no code block** — `architecture-beta` and `C4Context` diagrams exist only as mermaid.live links (no `` ```mermaid `` block). Their code must be stored as the URL's encoded payload. When modifying these, decode the existing URL to get the code, edit it, re-encode, and update the link
5. **Theme in the state object vs. in the code** — the JSON state object has a `mermaid` field (set to `{"theme":"default"}`) that controls mermaid.live's editor theme, and the diagram code itself may have a `%%{init: ...}%%` directive. These are independent — the `%%{init}%%` directive in the code takes precedence for rendering. Always set the state object's theme to `"default"` regardless of what the code's init directive says
6. **Base64url vs. standard base64** — mermaid.live uses base64url encoding (URL-safe alphabet: `-` and `_` instead of `+` and `/`, no `=` padding). The `js-base64` library's `fromUint8Array(bytes, true)` produces this format (the `true` flag enables URL-safe mode). Python's `base64.urlsafe_b64decode` handles the decoding side, but you must re-add padding (`=`) before decoding since the URL strips it

#### Batch generation for all 9 diagrams

When regenerating all URLs at once (e.g. after a major restructure), process each diagram sequentially — extract its code, generate the URL, write to a temp file, and use Python to update the specific link. Do not try to batch all 9 into a single command — the risk of cross-contamination (wrong code in wrong URL) is too high.

### Adding new diagrams

When adding a new diagram to REPO-ARCHITECTURE.md:
1. Check if the diagram type is GitHub-renderable (test on GitHub or check the mermaid docs)
2. If renderable: include both mermaid.live link + code block
3. If not renderable: include only mermaid.live link + explanatory note
4. If the diagram type uses `cScale` for colored regions (mindmap, timeline, etc.): apply the `base` theme fix above
5. For all other renderable types: no theme directive needed — they handle dark mode automatically
6. Generate the mermaid.live pako URL using the process above — never construct it manually
7. Always verify the URL decompresses correctly before committing
8. Always include the collapsible `<details>` raw code section below the diagram (for GitHub-renderable types)

## Keeping Documentation Files in Sync

*Mandatory rules: see Pre-Commit Checklist items #5, #6, #7, #8 in CLAUDE.md. Reference table below for additional files to consider.*

| File | Update when... |
|------|---------------|
| `.gitignore` | New file types or tooling is introduced that generates artifacts (e.g. adding Node tooling, Python venvs, build outputs) |
| `.editorconfig` | New file types are introduced that need specific formatting rules |
| `CONTRIBUTING.md` | Development workflow changes, new conventions are added to CLAUDE.md that contributors need to know |
| `SECURITY.md` | New attack surfaces are added (e.g. new API endpoints, new OAuth flows, new deployment targets) |
| `CITATION.cff` | Project name, description, authors, or URLs change |
| `.github/ISSUE_TEMPLATE/*.yml` | New project areas are added (update the "Affected Area" / "Area" dropdown options) |
| `.github/PULL_REQUEST_TEMPLATE.md` | New checklist items become relevant (e.g. new conventions, new mandatory checks) |

Update these only when the change is genuinely relevant — don't force unnecessary edits.

## Internal Link Reference

*Rule: see Pre-Commit Checklist item #12 in CLAUDE.md.*

Files live in three locations: repo root, `.github/`, and `repository-information/`. Cross-directory links must use `../` to traverse up before descending into the target directory.

### Why community health files live at root (not `.github/`)
Community health files (`CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`) live at root so relative links resolve correctly in both GitHub blob-view and sidebar-tab contexts — files inside `.github/` break in the sidebar tab because `../` traverses GitHub's URL structure differently there.

### File locations
| File | Actual path |
|------|-------------|
| README.md | `./README.md` (root) |
| CLAUDE.md | `./CLAUDE.md` (root) |
| LICENSE.md | `./LICENSE.md` (root) |
| CODE_OF_CONDUCT.md | `./CODE_OF_CONDUCT.md` (root) |
| CONTRIBUTING.md | `./CONTRIBUTING.md` (root) |
| SECURITY.md | `./SECURITY.md` (root) |
| PULL_REQUEST_TEMPLATE.md | `.github/PULL_REQUEST_TEMPLATE.md` |
| REPO-ARCHITECTURE.md | `repository-information/REPO-ARCHITECTURE.md` |
| CHANGELOG.md | `repository-information/CHANGELOG.md` |
| CHANGELOG-archive.md | `repository-information/CHANGELOG-archive.md` |
| GOVERNANCE.md | `repository-information/GOVERNANCE.md` |
| IMPROVEMENTS.md | `repository-information/IMPROVEMENTS.md` |
| STATUS.md | `repository-information/STATUS.md` |
| SUPPORT.md | `repository-information/SUPPORT.md` |
| TODO.md | `repository-information/TODO.md` |
| Per-page HTML changelogs | `live-site-pages/html-changelogs/<name>html.changelog.md` |
| Per-page HTML changelog archives | `live-site-pages/html-changelogs/<name>html.changelog-archive.md` |
| Per-page GAS changelogs | `live-site-pages/gs-changelogs/<name>gs.changelog.md` |
| Per-page GAS changelog archives | `live-site-pages/gs-changelogs/<name>gs.changelog-archive.md` |

### Common cross-directory link patterns
| From directory | To file in `repository-information/` | Correct relative path |
|----------------|--------------------------------------|----------------------|
| `.github/` | `repository-information/SUPPORT.md` | `../repository-information/SUPPORT.md` |
| `.github/` | `repository-information/CHANGELOG.md` | `../repository-information/CHANGELOG.md` |

| From directory | To root files | Correct relative path |
|----------------|--------------|----------------------|
| `repository-information/` | `README.md` | `../README.md` |
| `repository-information/` | `CLAUDE.md` | `../CLAUDE.md` |
| `repository-information/` | `CONTRIBUTING.md` | `../CONTRIBUTING.md` |
| `repository-information/` | `SECURITY.md` | `../SECURITY.md` |
| `repository-information/` | `CODE_OF_CONDUCT.md` | `../CODE_OF_CONDUCT.md` |
| `.github/` | `README.md` | `../README.md` |
| `.github/` | `CLAUDE.md` | `../CLAUDE.md` |

## Relative Path Resolution on GitHub

Relative links in markdown files resolve from the blob-view URL directory (`/org/repo/blob/main/...`). Each `../` climbs one URL segment. Root files need 2 `../` to reach `/org/repo/`, subdirectory files need 3. This works on any fork because the org/repo name is part of the URL itself.

### When relative paths work vs. don't

| Context | Works? | Reason |
|---------|--------|--------|
| Markdown files (`.md`) rendered on GitHub | Yes | GitHub renders links as `<a href="...">`, browser resolves relative paths from blob-view URL |
| YAML config files (`config.yml`, `CITATION.cff`) | No | GitHub processes these as structured data, not rendered markdown — relative URLs may not be resolved |
| Mermaid diagram text labels | No | Text content inside code blocks, not rendered as clickable links |
| GitHub Pages URLs (`org.github.io/repo`) | No | Different domain entirely — can't be reached via relative path from `github.com`. Use a placeholder (e.g. `*(deploy to activate)*`) and replace via drift check step #4 |

### Adding new relative links

When creating a new markdown file with links to GitHub web app routes (issues, security advisories, settings, etc.):

1. Determine the file's directory depth relative to the repo root
2. Add 2 for `blob/main/` (or `blob/{branch}/`) to get the total `../` count needed to reach `/org/repo/`
3. Append the GitHub route (e.g. `security/advisories/new`, `issues/new`)
4. **Never** hardcode the org or repo name in markdown links that can use this pattern
5. **For GitHub Pages links** — `github.io` URLs can't be made dynamic via relative paths. Use placeholder text (e.g. `*(deploy to activate)*`) and document the replacement in drift check step #4

## Markdown Formatting

When editing `.md` files and you need multiple lines to render as **separate rows** (not collapsed into a single paragraph), use HTML inline elements:
- **Line breaks:** end each line (except the last) with `<br>` to force a newline
- **Indentation:** start each line with `&emsp;` (em space) to add a visual indent

Example source:
```markdown
The framework handles:

&emsp;First item<br>
&emsp;Second item<br>
&emsp;Third item
```

Plain markdown collapses consecutive indented lines into one paragraph — `<br>` and `&emsp;` are the reliable way to get separate indented rows on GitHub.

## Mermaid Diagrams — mermaid.live Links

Every Mermaid diagram in the repo — whether in `REPO-ARCHITECTURE.md`, `repository-information/diagrams/`, or any other file — must include an "Open in mermaid.live" link above the ```` ```mermaid ```` code block. This gives the reader one-click access to an interactive editor with pan, zoom, and export.

**When to generate:** whenever a new Mermaid diagram is created or an existing diagram's code is modified, generate (or regenerate) the mermaid.live URL using the pako + js-base64 compression method documented in Pre-Commit Checklist item #6. After generating, verify the URL decompresses correctly.

**Format:** place the link on its own line before the mermaid code block, with a blank line between:
```
> [Open in mermaid.live](https://mermaid.live/edit#pako:...) — *interactive editor with pan, zoom, and export*

` ` `mermaid
...
` ` `
```

**README tree page entry icon cluster:** each live-site page entry in the README tree groups its action icons together after a `→` arrow, using `·` as dividers between icons, closed with `—` before versions. Layout: `filename  →  🌐 · 📊 · 📋 · 📁  — versions | description`. The icons are:
- **🌐** — live site URL link. Format: `<a href="https://ORG.github.io/REPO/page.html">🌐</a>`
- **📊** — diagram link. Format: `<a href="...diagram.md">📊</a>`
- **📋** — spreadsheet link. Format: `<a href="https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/">📋</a>`. The `SPREADSHEET_ID` is read from the page's `<page-name>.config.json` in `googleAppsScripts/`
- **📁** — Google Drive folder link. Format: `<a href="https://drive.google.com/drive/folders/FOLDER_ID">📁</a>`. Links to the Drive folder containing all files for that page's environment
- **✕** — placeholder for a missing spreadsheet (no GAS project or placeholder `SPREADSHEET_ID`). Subtle thin x
- **◇** — placeholder for a missing Google Drive folder (folder ID not yet provided). White diamond

When `setup-gas-project.sh` creates a new project, it should add the icon cluster with 📋 if the spreadsheet ID is not a placeholder, or `✕` if it is. Use `◇` for the folder position until a folder ID is provided.

Developed by: ShadowAISolutions
