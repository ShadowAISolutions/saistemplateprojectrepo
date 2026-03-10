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

## ARCHITECTURE.md Structural Updates

The Mermaid diagram in `repository-information/ARCHITECTURE.md` shows the project's file structure and relationships. It is updated only when the project structure changes (files added, moved, or deleted) — **not** on version bumps. Version numbers are not displayed in diagram nodes; STATUS.md serves as the version dashboard.

### Adding new pages
When a new embedding page is created (see New Embedding Page Setup Checklist in `.claude/rules/html-pages.md`), add corresponding nodes to the diagram:
- A page node: `NEWPAGE["page-name.html"]`
- A version file node: `NEWVER["page-namehtml.version.txt"]`

## Mermaid Diagram Compatibility Reference

ARCHITECTURE.md contains 9 diagrams across different mermaid types. Each has different rendering support and theme requirements. **Follow these rules when adding or modifying diagrams.**

### Rendering support by diagram type

| # | Type | Mermaid Syntax | GitHub Renders? | Theme Required? |
|---|------|---------------|-----------------|-----------------|
| 1 | Flowchart | `graph TB` | Yes | No — use per-node `style` directives for colors |
| 2 | Sequence | `sequenceDiagram` | Yes | No — works natively |
| 3 | State | `stateDiagram-v2` | Yes | No — works natively |
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

### Adding new diagrams

When adding a new diagram to ARCHITECTURE.md:
1. Check if the diagram type is GitHub-renderable (test on GitHub or check the mermaid docs)
2. If renderable: include both mermaid.live link + code block
3. If not renderable: include only mermaid.live link + explanatory note
4. If the diagram type uses `cScale` for colored regions (mindmap, timeline, etc.): apply the `base` theme fix above
5. For all other renderable types: no theme directive needed — they handle dark mode automatically
6. Always regenerate the mermaid.live pako URL when diagram code changes (see Pre-Commit #6)
7. Always include the collapsible `<details>` raw code section below the diagram

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
| ARCHITECTURE.md | `repository-information/ARCHITECTURE.md` |
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

Developed by: ShadowAISolutions
