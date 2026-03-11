---
name: skill-creator
description: Create new Claude Code skills, modify existing skills, and measure skill performance. Use when the user wants to create a skill from scratch, update or optimize an existing skill, test a skill with evals, or optimize a skill description for better triggering accuracy.
user-invocable: true
disable-model-invocation: true
---

# Skill Creator

*Imported from [anthropics/skills](https://github.com/anthropics/skills) — Anthropic's official skills repository.*

A meta-skill for creating new skills and iteratively improving them.

## Process Overview

1. **Capture Intent** — understand what the skill should do, when it triggers, expected outputs
2. **Interview & Research** — ask clarifying questions about edge cases, formats, dependencies
3. **Write SKILL.md** — create the skill with proper structure
4. **Test** — draft 2-3 realistic prompts and run them
5. **Evaluate** — review results qualitatively
6. **Iterate** — improve based on feedback

## Skill Directory Structure

```
skill-name/
├── SKILL.md (required)
│   ├── YAML frontmatter (name, description required)
│   └── Markdown instructions
└── Optional Resources
    ├── scripts/     — Executable code for deterministic tasks
    ├── references/  — Docs loaded into context as needed
    └── assets/      — Files used in output (templates, icons)
```

## SKILL.md Anatomy

### Frontmatter (YAML)

```yaml
---
name: my-skill
description: When to trigger and what it does. Be specific about contexts.
user-invocable: true
disable-model-invocation: false
allowed-tools: Read, Grep, Glob, Bash
argument-hint: [optional-args]
---
```

### Key Frontmatter Fields

| Field | Purpose |
|-------|---------|
| `name` | Slash command name (lowercase, hyphens, max 64 chars) |
| `description` | When to use + what it does (primary triggering mechanism) |
| `user-invocable` | `true` = available via `/name`, `false` = Claude-only |
| `disable-model-invocation` | `true` = only manual invocation, no auto-trigger |
| `allowed-tools` | Tools Claude can use without per-use permission |
| `context` | `fork` = run in isolated subagent |
| `agent` | Subagent type: `Explore`, `Plan`, `general-purpose` |
| `argument-hint` | Autocomplete hint: `[issue-number]`, `[file path]` |

### Body (Markdown)

Instructions Claude follows when the skill is invoked. Keep under 500 lines.

## Writing Guide

- Use imperative form in instructions
- Explain *why* things matter instead of heavy-handed MUSTs
- Include examples showing input/output patterns
- Make descriptions slightly "pushy" — Claude tends to under-trigger skills
- Use progressive disclosure: SKILL.md body < 500 lines, references for detail

## Applying to This Repo

When creating skills for this repo:
- Place in `.claude/skills/` for project scope
- Use `imported--` prefix for skills adapted from external sources
- Use plain names for repo-specific custom skills
- Add `Developed by: ShadowAISolutions` as the last line (Pre-Commit #10)
- Update REPO-ARCHITECTURE.md and README.md tree when adding new skill directories

Developed by: ShadowAISolutions
