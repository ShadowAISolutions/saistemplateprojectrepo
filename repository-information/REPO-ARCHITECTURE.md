# Project Architecture

> **Scope** — this document covers the repo-wide architecture: how environments connect to each other and to shared infrastructure (CI/CD, GitHub Pages, templates, versioning, developer tools). It does **not** cover the internal processes of individual environments (auto-refresh polling, GAS self-update loops, page lifecycle states, etc.) — those are documented in per-environment diagrams under `repository-information/diagrams/`.

## 1. Flowchart — System Overview

> [Open in mermaid.live — Flowchart](https://mermaid.live/edit#pako:eNqtWG1v2zYQ_iuE-qXpKjvoS9oE6AbXVhyvSmJYTreiLgxaomU2tCiQklOvKbAfsV-4X7IjKcmyXhJvWL4EkJ577u7h3fHk75bPA2KdWaHA8QpN388iBH8yXZgHM2tCYi5pwsX2DElMZULWMcMJiQX_SvxEwOuZZazUX0AFPKU80ly75yXGAdkQxmMi0G9c3C4ZvysTqL-B8_FzGddFfYbTgKA-BDuzvuyj--8B7GtA9xlaCBz5qxoIKJFt_3w_s-JUwut7MNshSBS0BNsfdfsD9PeffyGcJtxeExES2zjrbNcMfc71-FJNYl-J8pvpZDQcOpPvM2sMsaCEozz6X2bWj2pyKuzcpJFH5_WJyHvkXfTm_Qun_wGo-3y9pol6NJtF7xDDMrHhzHwiJQnqfgrTHdvAcZ2pM_emPdfRx8FIQhCNVkTQhAS50rPoqbylMdLSHNWE3ye-4vfo0pkMFeGlMgA-yH-NaVSz1Did_c140FORXPTA7CYOQG5wu5-S7euEO3KFa0w7e003GJ2fA1F_RfxbFIJIAV0u6xUDqKxkGN0QG5qA2DEOiewif4WjkASqjMa9oePNz93eECj1azt7i96hRKTkIeJOKMtcw543Hzhj9_qT1jtmfKueoQ3FyE8FQ-Nrb1rj21mZ7MyxvZ-0qVkAdof6WPfskswYlLe5ftpeksCuWwDFWZWbU75vMW_vwSFNLtIFGitxkZFlTaKkPjV2tDv9ameXcKidMmUtW3f0UdWnC5bIo7rWvBUO-F1v5HGWqp6WHaibVbroUN5tnYpf2uPTMio_h-TvRBsqeKRyluipjvmofdq4lYMfXQ2c3yGd3aSCngvIt84qWTPVvS6OAhqFWox6_04db6pj3qdICOS8i6sgm8JzVAr4qKlcp2O3gTLE0s70s31BMNw5Ba3qgrF5h_rm3T7zA9XDecgI6sWxRJ4vaAwiHjK1qzqqNmvVMpSNbanEe1i3imF7GlCBAmbKhEieChh5_ymHq-tfnQ-fXHc_pk4Ewt5uGasP76vBPhScR4Hs1oAX00t3_tGZePtwdXz2hgipWqZuNfQabEL5gIX203cbvJgxynjY7KdqE8pWi_YzqM6SnA6mSvtpQLHvu76AcHtRMMRymj3rwWphrjVd8J3kW6KKXiWLlCeUG-tFJIK9SKBFuo5J0NCvY30Qh7vUHjPFteeWhu1fDx5vWFutk52vMk9B9a3UTVfkcGjfFu3OoyUNHxC47_ZuBs78slKq5nFnHag4sjChWyXcybo5ZF27yY3rVKqxk12NImVwzIoKszu8lTbjOIB-_AkOKFnZ0odFNUAa1bADfRi5bgsx7E6MGWYabfgtXsCwussWY2TeNkTqjK_rxyyKXf3BAx2MesNJ79JrM7ZptORijZVK3YBiOJG1iRCWcbs0vRAW_grawU9SQVCObMjfmU5HV8M2BUiSwP0joWx4pLyoleyZ2bcxAxWaylytlecjt1KR2a3cbV8Ntcz7GywKUyyCQ8vy8StkdDWazr3-ZDSuzH7TCLJLI5rYSm6ISAXEI5gqK54gUP0WqbcUM_qH1r_x_pyDoDfjZnJQM43tUmtmTlQn5l2wpFBjumMbPZQSQHZHb3L6MAKijloiLsKu3nBmEfxjWN1GL15oVqm_rPKGrOhZERaGSk4P3bPV30EqJrVvReROTz7Np29dY1OaRbltMRvNxai_Rxo0OMoX7P-XTd3whkzz5jRkvSCB1Is7XUJTkAbvxWb1qNHOiVoZc7gkYlMTqBlQuHoIVFrMCnmKD4tMHUHDECYLkoQt7dR8iTXq-i8Md9nlTZ1bQTVAk24VsPiMNMjyF53B3qmWljlUsRhksZnkwGwyopgzBmOnot8h8Iqah5jsaZv9xpJsoQvV7xLQOOzsySt8ehycPvc54-LsyRK-SEswfWIGd3KyWJzgFlyhoMGS5euXr49bsOXv-wJ_ik8L7uPj4zJe9auBLZf4zYuTFlhRCwX4zfGrly0xlHQ5hLuYLBnYJ6cvg7ctYH2bHwI01_MhyPJkNPA3b0-PT_1SdtZza03g8qSBdWZ9h8pfEdXIZzMrIEucMriOfwBGDVRvG_nWmfqN4LllWmJgrlDz8Mc_qB8PpA) — *interactive editor with pan, zoom, and export*

```mermaid
graph TB
    subgraph "Repository: saistemplateprojectrepo"
        direction TB

        subgraph "Developer Workflow"
            DEV["Developer / Claude Code"]
            CB["claude/* branch"]
            DEV -->|"push"| CB
        end

        subgraph "CI/CD — auto-merge-claude.yml [template]"
            direction TB
            TRIGGER{"Push to claude/*?"}
            CB --> TRIGGER
            TRIGGER -->|Yes| SHA_CHECK{"Commit SHA\n= last-processed?"}
            SHA_CHECK -->|Yes| DELETE_STALE["Delete inherited branch\n(skip merge)"]
            SHA_CHECK -->|No| MERGE["Merge into main"]
            MERGE --> UPDATE_SHA["Update\nlast-processed-commit.sha"]
            UPDATE_SHA --> DIFF["Check git diff"]
            DIFF -->|"live-site-pages/ changed"| PAGES_FLAG["pages-changed = true"]
            DIFF -->|".gs changed"| GAS_DEPLOY["Deploy GAS via curl POST"]
            GAS_DEPLOY --> DELETE_BR
            MERGE --> DELETE_BR["Delete claude/* branch"]
            PAGES_FLAG --> DEPLOY_PAGES
            TRIGGER -->|"Direct push to main"| DEPLOY_PAGES
        end

        subgraph "GitHub Pages Deployment"
            DEPLOY_PAGES["Deploy live-site-pages/ to\nGitHub Pages"]
            LIVE["Live Site\nShadowAISolutions.github.io/saistemplateprojectrepo"]
            DEPLOY_PAGES --> LIVE
        end

        subgraph "Environments (Pages)"
            direction LR
            INDEX["[template] index.html\n(Landing Page)"]
            TEST_PAGE["[template] testenvironment.html\n(Test Environment)"]
            GASTPL_PAGE["[template] gas-project-creator.html\n(GAS Project Creator)"]
        end

        subgraph "Google Apps Scripts [template]"
            direction LR
            GAS_INDEX["[template] index.gs"]
            GAS_TEST["[template] testenvironment.gs"]
        end

        subgraph "Shared Resources [template]"
            direction LR
            NOJEKYLL["[template] .nojekyll"]
            SND["[template] sounds/"]
            HTML_VERS["[template] html-versions/"]
            GS_VERS["[template] gs-versions/"]
            HTML_CL["[template] html-changelogs/"]
            GS_CL["[template] gs-changelogs/"]
        end

        subgraph "live-site-pages/templates/ [template]"
            TPL["[template] HtmlAndGasTemplateAutoUpdate.html.txt\n(HTML page template — never bumped)"]
            TPL_VER["[template] HtmlAndGasTemplateAutoUpdatehtml.version.txt"]
            GASTPL_CODE["[template] gas-project-creator-code.js.txt\n(GAS script template)"]
        end

        subgraph "Project Config [template]"
            CLAUDE_MD["[template] CLAUDE.md\n(project instructions)"]
            RULES["[template] .claude/rules/\n(always-loaded + path-scoped rules)"]
            SKILLS["[template] .claude/skills/\n(invokable workflow skills)"]
            REPO_VER["[template] repository.version.txt"]
            DIAGRAMS["[template] repository-information/diagrams/\n(per-environment architecture diagrams)"]
            SETTINGS["[template] .claude/settings.json\n(git * auto-allowed)"]
            SHA_FILE["[template] .github/last-processed-commit.sha\n(inherited branch guard)"]
        end

        subgraph "Scripts [template]"
            INIT_SCRIPT["[template] scripts/init-repo.sh\n(one-shot fork initialization)"]
            GAS_SETUP["[template] scripts/setup-gas-project.sh\n(GAS project file creation)"]
            INIT_SCRIPT -.->|"auto-detects org/repo\nreplaces 22 files"| CLAUDE_MD
        end
    end

    TPL -.->|"copy to create\nnew pages"| INDEX
    GASTPL_CODE -.->|"template source\n(setup-gas-project.sh)"| GAS_INDEX
    GASTPL_CODE -.->|"template source\n(setup-gas-project.sh)"| GAS_TEST
    INDEX -.->|"embeds via iframe"| GAS_INDEX
    TEST_PAGE -.->|"embeds via iframe"| GAS_TEST
    LIVE -.->|"serves"| INDEX
    LIVE -.->|"serves"| TEST_PAGE
    LIVE -.->|"serves"| GASTPL_PAGE
    GAS_DEPLOY -.->|"triggers self-update"| GAS_INDEX
    GAS_DEPLOY -.->|"triggers self-update"| GAS_TEST
    SHA_FILE -.->|"read by"| SHA_CHECK
    UPDATE_SHA -.->|"writes"| SHA_FILE
    HTML_VERS -.->|"version polling"| INDEX
    HTML_VERS -.->|"version polling"| TEST_PAGE
    HTML_VERS -.->|"version polling"| GASTPL_PAGE

    style DEV fill:#4a90d9,color:#fff
    style LIVE fill:#66bb6a,color:#fff
    style SHA_FILE fill:#ef5350,color:#fff
    style DELETE_STALE fill:#ef9a9a,color:#000
    style TPL fill:#ffa726,color:#000
    style GAS_INDEX fill:#ff7043,color:#fff
    style GASTPL_PAGE fill:#ffa726,color:#000
    style CLAUDE_MD fill:#ce93d8,color:#000
    style RULES fill:#ce93d8,color:#000
    style SKILLS fill:#ce93d8,color:#000
    style INIT_SCRIPT fill:#78909c,color:#fff
```

## 2. Sequence Diagram — Deploy & Runtime Flows

> [Open in mermaid.live — Sequence](https://mermaid.live/edit#pako:eNqNVs1u2zgQfpWBTnYTxe3VaAK4yTou0LRBnK4vvjDSSCJCkSxJ2TWCXPcB9hH3SXZIyj-yFTS-CDLn7_u-maFekkzlmIwTi78alBnecFYaVi8l0E8z43jGNZMObnAFzPoHCqXRwOjzkxldXQvW5AjXFOXU53bmXW65mzVPwXqQBfPRB3gyTGbV8NRnMfU-k8ap9A5NicFvocxzIdT61PyOcekdav-MQU-N7lmJdl9KfD81-2LU2hIyMvzpn-17D67JPERTqhQIE61tqHKeGa7dqfm8QnT2wCP-sZTR9LtyCGpFCYnc83g2hsvLS3rXQm1gSsj9-9aBzNKrq9vZGEruQDe2gi2v0eB2RueL6RgeDS9LCrzu8LeYtsfXFWbPkKm6pjjz2SSgWFkQzLpUG5WhtZhHJyYcfJUVGu4wh4F1TOCww_gutK_sBgUSrHhO5s9cQ-31bCVHYRG-47rNfhTBqzqGoP8OGvz3z79B5iNbD-Snzhll69adxtAXtmI9LhG7JzDnRbE38DgFX2FqCWiqfaeMIKuYLLdMdEKFVhpvlXKqp8UCXJl3U1yUFgpOvfB2aOqyMWSNEXD_Y_4IubpX1g1Y5riSl3lIOOy6kUdL_xQd0S6IFBtzrTjblja5_9rr5tPNURRpE9k8A4MxzRs4jsU-Gu5WaO_xp0YP4_6AhUHq5W9KaRg8Yq19_fAFK7biygwPRyDQS9nbEfWFmxXC7PHuG3jNopXwkf6ihBv49BEsZkrmB6K0znsVI2uVq8UFOVni-cL9dl3h_o4H_brtIx4URiNKJHBZplY1ModCsPItt7aQB9qxLD9Asv29gTsq1ufQV1FF62SZLPDJtzjlYvlmmYTZt0Q5KXAG9NxAKLdH-3dJ6ndk6KZ2Nt-j6kEj6kaIiczjXE2NqmPzDoYdy12nh3EiK2pZrXZLcBvsAV1jpMdjMmrT3V11kO8HYVj73UbgM4O-xLYF4CxQ0w5FHIgapTsMseNW04je0fYhHQYvbqORdjSzqQl6vrbF92jSCu5J4wXdv_hngh8a6XiNcMMcO7ki3jcf-0ICB-HS49KhiUsGBrGWDufbEnzbjCJjREy7YePhMe_7cx-iC1vmlJPGXitpMTlP6I6gHZ_TF8nLMnEVEhPJeJnkWLBGuGXySjaMtsV8I7Nk7EyD50mUpv1yiX--_g9v99EW) — *interactive editor with pan, zoom, and export*

```mermaid
sequenceDiagram
    participant Dev as Developer /<br/>Claude Code
    participant GH as GitHub<br/>(claude/* branch)
    participant WF as Auto-Merge<br/>Workflow
    participant Main as main branch
    participant Pages as GitHub Pages
    participant Browser as User Browser
    participant GAS as Google Apps<br/>Script
    participant Sheets as Google Sheets

    Note over Dev,Sheets: === Deploy Flow ===

    Dev->>GH: git push claude/*
    GH->>WF: Trigger workflow
    WF->>WF: Check commit SHA<br/>vs last-processed
    alt Inherited (stale) branch
        WF->>GH: Delete branch (skip merge)
    else New commit
        WF->>Main: Merge claude/* → main
        WF->>WF: Update last-processed-commit.sha
        WF->>WF: Check git diff
        alt live-site-pages/ changed
            WF->>Pages: Deploy to GitHub Pages
        end
        alt .gs file changed
            WF->>GAS: curl POST doPost(action=deploy)
            GAS->>GH: Fetch latest .gs via GitHub API
            GAS->>GAS: Self-update + redeploy
        end
        WF->>GH: Delete claude/* branch
    end

    Note over Dev,Sheets: === Auto-Refresh Loop (Template Behavior) ===

    Pages->>Browser: Serve HTML page
    loop Every 10 seconds
        Browser->>Pages: Fetch html.version.txt
        alt Version changed
            Browser->>Browser: Set pending-sound flag
            Browser->>Pages: Reload page
            Pages->>Browser: Serve updated page
            Browser->>Browser: Show "Website Ready"<br/>splash + play sound
        end
    end

    Note over Dev,Sheets: === GAS Self-Update Loop (Template Behavior) ===

    GAS->>GAS: pullAndDeployFromGitHub()
    GAS->>GH: Fetch .gs from repo
    GH-->>GAS: Return source code
    GAS->>GAS: Overwrite + create version +<br/>update deployment
    GAS->>Browser: postMessage({type: gas-reload})
    Browser->>Browser: Reload GAS iframe

    Note over Dev,Sheets: === Runtime Data Flow ===

    Pages->>Browser: Serve HTML page
    Browser->>GAS: User interaction (iframe)
    GAS->>Sheets: Read/write data
    Sheets-->>GAS: Return data
    GAS-->>Browser: Render response
```

## 3. Template-Level Behaviors & Per-Environment Diagrams

The following behaviors are inherited by **all pages** via the HTML/GAS templates (`HtmlAndGasTemplateAutoUpdate.html.txt` and GAS script template). They are documented here because they are template-level — they only change when the templates change, not when individual environments change.

### Auto-Refresh Loop (from HTML template)

```mermaid
flowchart TB
    subgraph "Auto-Refresh Loop (Template Behavior)"
        direction TB
        BROWSER["Browser loads any page"]
        POLL["Poll page's html.version.txt\nevery 10s"]
        COMPARE{"Remote version\n≠ loaded version?"}
        RELOAD["Set web-pending-sound\nReload page"]
        SPLASH["Show green 'Website Ready'\nsplash + play sound"]
        BROWSER --> POLL
        POLL --> COMPARE
        COMPARE -->|Yes| RELOAD
        RELOAD --> SPLASH
        COMPARE -->|No| POLL
    end

    style BROWSER fill:#4a90d9,color:#fff
    style RELOAD fill:#66bb6a,color:#fff
    style SPLASH fill:#66bb6a,color:#fff
```

### GAS Self-Update Loop (from GAS template)

```mermaid
flowchart TB
    subgraph "GAS Self-Update Loop (Template Behavior)"
        direction TB
        GAS_APP["GAS Web App\n(any Apps Script project)"]
        GAS_PULL["pullAndDeployFromGitHub()\nfetches .gs from GitHub"]
        GAS_DEPLOY_STEP["Overwrites project +\ncreates new version +\nupdates deployment"]
        GAS_POSTMSG["postMessage\n{type: gas-reload}"]
        GAS_APP --> GAS_PULL
        GAS_PULL --> GAS_DEPLOY_STEP
        GAS_DEPLOY_STEP --> GAS_POSTMSG
    end

    style GAS_APP fill:#ff7043,color:#fff
    style GAS_DEPLOY_STEP fill:#ffa726,color:#000
```

### Per-Environment Diagrams

Environment-specific internals (page lifecycle states, maintenance mode, splash screens, environment-specific workflows) are documented in dedicated per-environment diagrams:

| Environment | Diagram |
|-------------|---------|
| Landing Page (index) | [`repository-information/diagrams/index-diagram.md`](diagrams/index-diagram.md) |
| Test Environment | [`repository-information/diagrams/testenvironment-diagram.md`](diagrams/testenvironment-diagram.md) |
| GAS Project Creator | [`repository-information/diagrams/gas-project-creator-diagram.md`](diagrams/gas-project-creator-diagram.md) |

## 4. Git Graph — Branching Strategy

> [Open in mermaid.live — Git Graph](https://mermaid.live/edit#pako:eNqVktFqwjAUhl_lcK51s91d7wYyHWwwmHfLLmJy2oY2TYjJZhHffWFx4lBLDeQm58_385HsUBhJWGCl_MJxW7MO4hJGa-VByQIYrkjblnsCR9YwTIm1452oQbQ8SLovifvgaJodrtckGhP8tfEp_WuW3c0yB08pA9_GNX8lR47mqktHmlxFZ9wD6zF4M02Jj02jLAj1eWSdls7JtqYHb-CNV7RhCL63VMDyebF8iXs1JJkPS-bXJHMHryYaipp3v6W3SeYDkjDGEsZprkNVqu1lx3-zM8GH-IpqCzE01i3xhsTGmV1QwwlGVuyV8XfvGPqaNDEsGEoqeWg9w33M8Fj63ncCC-8CTTBYGb_6XPHKcZ0O9z9fQQfz) — *interactive editor with pan, zoom, and export*

```mermaid
gitGraph
    commit id: "Template repo"
    branch claude/feature-1
    checkout claude/feature-1
    commit id: "v01.01r Feature work"
    checkout main
    merge claude/feature-1 id: "Auto-merge [skip ci]"
    commit id: "Deploy to Pages" type: HIGHLIGHT
    branch claude/feature-2
    checkout claude/feature-2
    commit id: "v01.02r More changes"
    checkout main
    merge claude/feature-2 id: "Auto-merge [skip ci] "
    commit id: "Deploy to Pages " type: HIGHLIGHT
    branch claude/bugfix
    checkout claude/bugfix
    commit id: "v01.03r Fix bug"
    checkout main
    merge claude/bugfix id: "Auto-merge [skip ci]  "
    commit id: "Deploy to Pages  " type: HIGHLIGHT
```

## 5. Architecture — System Topology (mermaid.live only)

> [Open in mermaid.live — Architecture](https://mermaid.live/edit#pako:eNp9UstugzAQ_BXLJ5CSH-CWh5QeGqlKWvUAOSx4A1YAo7WdKIry7zV2oKRSyml3dsY7HnzjhRLIEw5UVNJgYSzhPEcDWcvcV5KyHSPsVFTUyoo43UjzZnO2c5CWRtH1MGWWSpU1jlzfsVXfOVogaqSzLJAJPEeyNUgtmjhd4xlr1SEdnlk5QVtUkZD6FKerGqxAtvTYgcnWO3sWXBSdjrW6RD2AFKcLaxTbIpX4QtGAbB8Ltq78__gOStQT3484Pnr4haQEPZrZLPbsG3O26DrPDnk983WFaHQkwEAOGscY9x5_KctJXVw98fblWncbD4_xu9iTJZvP2WcSsg1wqIfJEGKYDd0w7QMLk74aUJ9MgH35u8Ub-HPUrh--Jy6bx_OBURDuP9jy4gmdz3iD5BYL92pvGTcVNpjxJOMCj2Brk_G744D76_trW_DEkMUZt53LE9cSSoImgPcfYI4D2A) — *interactive editor with pan, zoom, and export*
>
> *This diagram type (`architecture-beta`) is not supported by GitHub's mermaid renderer — use the link above to view it.*

## 6. C4 Context — System Boundaries (mermaid.live only)

> [Open in mermaid.live — C4 Context](https://mermaid.live/edit#pako:eNp1VMGO2jAQ_ZVRTrQCcemJG0uqZaVdFRGqvUSqnHgS3DW2ZTuwCK3Uj-gX9ks6trMBtoUL2J437_nNM6es1hyzWbb4stDK46svFdDHCy8RiqPzuIP-BP78-g2OibBnJPNorP6JtbdodKkSboXWaTXiuB9DmeW4R6kNWpjCQrKOI_XiWGbh8NkKjw4C_xhM57a08BrqWDf9DJVlqqbNMvv03j3p-XGnO8WZPY4Cc2h1L_yyq2BNSye8tkfCwClhzrjRQduXRupDgMw7rydNaFuE5347yVo8TBf5DHbhyJ3VCEXadkyoMXA0Uh8dGEYVY_BWtC1dG-7nBXSGkzFJ8wf2vnxQuwrrxLnUzjuQYo8T0o-TWDoF5sB55kUNYRcOwm-BBd0WG4tuC0ZLKVQ7sL3dMqrVupUYyeMvmobu-P9dapm7KJwb46CorTC-HxtWwIwB3FXIOXLYCwaisWxH_R3KZtJ7AI3VO-gvGzPyryl5NaK5o79kLOJGIsuZZ1Cx-gUVh0bb6LGLatzNW3999aPK6oNDG3p8p2-4S-vU9VEzPowveOhi7z0NUWgF9ZapeHTp9VUO1yhTxC8TtUoRroeAt8LHXA8hGhQH_Bk6BCNPwUro3rh57UmTuwHtZ7V5j2CKZmpQd1bC6luxucL2ZBf-FGj3pHu5eXrs07jZrIor0FDd8yUD09BvYWLpebhrJMj0kN485YMl3EW8YL56iB2ycUavj94ap_-lU5n5LQaaWZlxbFgnKYhvVBOmUxxVnc287XCcpdjlgrUkK22-_QUoHp5t) — *interactive editor with pan, zoom, and export*
>
> *This diagram type (`C4Context`) is not supported by GitHub's mermaid renderer — use the link above to view it.*

## 7. Mindmap — Concept Hierarchy

> [Open in mermaid.live — Mindmap](https://mermaid.live/edit#pako:eNp1VU2P2jAU_CtWKsSuBC27IBVxQ1DtIm2lVUO3Fy6O_RIs_KVnhxYh_nvtkBYSiCUOzIyf7Xlj55gwwyGZJb3eUWjhZ-TY91tQ0J_1M-qgPyDn_x8UBc0kuH6UWBSK4mFhpMEA9D99zeiYT6K6ptbwx1_oUTUizVJGJYwqFKbZJJte0KcKzaZ8Alfoc43ClF2h47oCb1SYVGjEriu80Qzk6O5GKuqpm3rupsbd1OQutdL7URfx1EU8dxHjLqKx-Ol06vU2WgnNFbUbTcJAY_zDwxqUldQD-QHWPD6eqTiWYKU5KND-gsXxIvxrmZF3WoBrMnHMS2-GCDmC2xJrpBS6uFV9ADph9DBGixMEaSi_VaWm1Jxo40UuGPVhQmvBxerLYkl-Gdzl0vzu2IwCLIAwSUsOJEOq2fbexlMfbKt5wsEDiwve6qpzB0E055Z9mac1RzyKogC8aF6MKcISc2sdSRkK2zI2BZkPS8tjM3I0qna6dWSjc1EMOYo9aOLAl7ZVxSJQ7rYAnmSU7UC3nF3lSBUQUBlw3uhO3ZWbjsVkOOENHsj-LCFDgk1NtOWKbTUj2nIhW-UXW6qLEIHCEQtIciGhKZgj24bjhsB62mzKEvZhYpy1Nka20_E2_7n89llxIrTzWLI7CXpHGDKjlPAkxILtpHD-VmHLEOYOPgVXHYsZ7cNb13Yu3rhw8Av8_76lB-dBNfWv6-9vxEYrfS279dFV0ekQrMLb_U-RG4y_nWtvOGTmWhOKJoMkXBNFBQ-fgOMmqZ76TTLbJBxyWkq_SU5BQ8N9Sg-aJbNgJwySc1iXghYhUmfw9BdgTcVG) — *interactive editor with pan, zoom, and export*

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'primaryColor': '#7ba3d4', 'primaryTextColor': '#000000', 'cScale0': '#e8b4b8', 'cScale1': '#b8d4e8', 'cScale2': '#b8e8c8', 'cScale3': '#e8d4b8', 'cScale4': '#d4b8e8', 'cScaleLabel0': '#000000', 'cScaleLabel1': '#000000', 'cScaleLabel2': '#000000', 'cScaleLabel3': '#000000', 'cScaleLabel4': '#000000', 'cScaleInv0': '#000000', 'cScaleInv1': '#000000', 'cScaleInv2': '#000000', 'cScaleInv3': '#000000', 'cScaleInv4': '#000000'}}}%%
mindmap
    root((Template Repo))
        Deployment
            GitHub Pages
                Auto-refresh polling
                Version-based reload
                Sound notifications
            CI/CD Workflow
                Auto-merge claude branches
                Stale branch detection
                Pages deploy
                GAS deploy trigger
        Google Apps Script
            Self-update from GitHub
            Config-driven setup
            Spreadsheet backend
            Iframe embedding
        Versioning
            Repository version - r
            Page version - w
            GAS version - g
            Changelogs per file
            Archive rotation
        Developer Tools
            CLAUDE.md instructions
            Pre-commit checklist
            Pre-push checklist
            Session context
            Reminders
        Template System
            HTML page template
            GAS script template
            Init script for forks
            Setup script for GAS
```

## 8. Entity Relationship — File Dependencies

> [Open in mermaid.live — ER Diagram](https://mermaid.live/edit#pako:eNqNldtuozAQhl_F4qqVmh5U7V7kDgVvwiqQCGjUlSIhBybEWoKRbVJFSd99zSEbc2gVLo2_-eefGdsnI2IxGGMDuEVJwsl-nSH1zQJnHi7NKUbn82h0PtcLK-z59sINg_cAjdHaOAAXlGVIchL9hRhtjmvjO34yM90pni-mFR3tSJaAQClLEgXTbBhmZzQ1_dCfePayloX9BmKBDpQgulUpQwu8igxKh6Y3mdkrXEXiTBKpUpCsDFEH0cSaAOXK7daH-RutfwEv3F_2NPztL9waZ9mWJgXv6fa8txZvsq5r6QWs-lGC4phFCqMyhQb-Bu10rmYPhLd1PbxctCrc0O2iXUouWMEjQFvGL-I927dY_k7YD8zgzQ8dq-JiKvKUHFuN-or0sGk5-CtSG9MAO8u5GTQzfuoUOeJQpZrBh17hLtQpb4eqOeyuQss2p57poM-hhsYsKvaQSaGSlMAzkgrEtp10q92neqH8hOQ0S9CmoGk8unRmbexBEiRJgu5ophq0J1Ktk_T-YkJD66M7EjxSnDKCYshTdiwzQW_e_EJ8akno9e7ncs0CHpNHdHh-eXx5_UB3Qv1Us9qMDduqM1vI3X1HQCtlP3QjrId-_pEMmLLwcr7442A3CG1LbTfzXCA_4jSXjT9kWwPK-tHpywd2MMcqWk4SqE_eDdLXkmqS2n5_Wc6qP8O4AWKiercpr7MsHtpf7XRNp8xEEp6ARGIHIDt2eifjpk79fOWdOPrc9kOkLKpmqzzWkDNBJePHkTZ0T3H9nomn_3GNBzWf6jeN1YN3UiZ2UL4dY2UdtqRIlZNyDykk89VFZYzVoMCDUeSqMtA8j_Xi5z82gTVI) — *interactive editor with pan, zoom, and export*

```mermaid
erDiagram
    HTML_PAGE ||--|| HTML_VERSION_TXT : "version tracked by"
    HTML_PAGE ||--|| HTML_CHANGELOG : "changes logged in"
    HTML_PAGE ||--o| GAS_SCRIPT : "embeds via iframe"
    HTML_CHANGELOG ||--|| HTML_CHANGELOG_ARCHIVE : "rotates to"

    GAS_SCRIPT ||--|| GAS_VERSION_TXT : "version tracked by"
    GAS_SCRIPT ||--|| GAS_CHANGELOG : "changes logged in"
    GAS_SCRIPT ||--|| GAS_CONFIG_JSON : "configured by"
    GAS_CHANGELOG ||--|| GAS_CHANGELOG_ARCHIVE : "rotates to"

    GAS_CONFIG_JSON ||--|| HTML_PAGE : "syncs title to"
    GAS_CONFIG_JSON ||--|| GAS_SCRIPT : "syncs vars to"

    REPO_VERSION_TXT ||--|| CHANGELOG : "version source for"
    CHANGELOG ||--|| CHANGELOG_ARCHIVE : "rotates to"
    REPO_VERSION_TXT ||--|| STATUS_MD : "displayed in"
    REPO_VERSION_TXT ||--|| README_MD : "displayed in"

    HTML_TEMPLATE ||--o{ HTML_PAGE : "creates new"
    GAS_TEMPLATE ||--o{ GAS_SCRIPT : "creates new"

    ENV_DIAGRAM }|--|| HTML_PAGE : "documents internals of"

    HTML_PAGE {
        string build-version "meta tag (informational)"
        string iframe-src "GAS deployment URL"
    }
    HTML_VERSION_TXT {
        string version "e.g. v01.13w (single source of truth)"
    }
    GAS_SCRIPT {
        string VERSION "e.g. v01.05g"
        string DEPLOYMENT_ID "Apps Script deploy ID"
    }
    GAS_CONFIG_JSON {
        string TITLE "page title"
        string DEPLOYMENT_ID "GAS deploy ID"
        string SPREADSHEET_ID "data backend"
        string SHEET_NAME "target sheet"
    }
    REPO_VERSION_TXT {
        string version "e.g. v01.63r"
    }
    ENV_DIAGRAM {
        string location "repository-information/diagrams/"
    }
```

## 9. Class Diagram — Component Model

> [Open in mermaid.live — Class Diagram](https://mermaid.live/edit#pako:eNqtVdtu4jAQ_RXLT3spaPc1DyuhElokbmrYVqtlZRl7SKw6dmQ7dBHqv69DAsSQti-bp2TOnJnjuTh7zDQHHGEmqbVDQVND85VC_jlY0P1yOlnQFNC-tlbP18QZoVK0LoXkvS0YK7S6hsXGx4KeNayFFVpK0lA-fW4BtHSaGNgYsFkA2Ey_EFt4NaHdW3bE6lLxo_m1LfxukCTMiMJ1KX-MH5LxfHYNDOPFZP5rGs-WZDy8hpPFQzwYJvdxfIFzfQcukMf1QtvQVJRSDhQfQiH1bmR0fifcfbl-S_6tVhuRdslfjpeT-P-JP-IHZDaYdoRO5j9nQzIaT-ITNZD7WHd0JGTnpFzPiLenqbf6lktNu1t4m1GVeviiBsCcj_X7DyqVJwO1wDvhJqltgUY76oD4SaOGZWILnXkHfhSnYFJ40uZ5I_VLkJ9lwJ6JzWjQ27zyJ2tDFQvHlB-6TQq_QzYAmgqQlFpSO13wJLjLiIHMJeR-B1xnwf1eGAakWu72ABrtdTQVCBQFgWO1FUarHJRrboSuFFIz6sKmcs3KimWJUA6MorKdoH45XSgr_H2FUa_3o3lrj1CEMpfLftPBvvvr3iF_6_erj_PCRwjyNXCLtoI2t9AHuc-TVmdG7Gj4gNhRqgidDo-OBQHujXWos8z3C5Da6-O_zW0fILWX8t_mna-ZCLHDS2m82PXuRGzg2r3fPxJPFYmQ3SlmkRNONmU-DWab9CUkMQPew35AaPc0YFyvaEVqxa836l3vdvDjdYTKgvss-Ab7hc6p4P7XuF9hl4GfIRytMIcNLaVb4VfvU_2zEn96HDlTwg2uyc0g1MbXfze3PRE) — *interactive editor with pan, zoom, and export*

```mermaid
classDiagram
    class HTMLPage {
        +String build-version
        +String iframe-src
        +poll_version()
        +auto_refresh()
        +show_splash()
        +play_sound()
    }
    class GASScript {
        +String VERSION
        +String DEPLOYMENT_ID
        +String SPREADSHEET_ID
        +doGet()
        +doPost()
        +pullAndDeployFromGitHub()
    }
    class GASConfig {
        +String TITLE
        +String DEPLOYMENT_ID
        +String SPREADSHEET_ID
        +String SHEET_NAME
        +String SOUND_FILE_ID
    }
    class VersionFile {
        +String version
        +triggers_reload()
    }
    class Changelog {
        +Section[] unreleased
        +Section[] versions
        +rotate_to_archive()
    }
    class AutoMergeWorkflow {
        +check_sha()
        +merge_branch()
        +deploy_pages()
        +trigger_gas_deploy()
        +delete_branch()
    }
    class Template {
        +String source_code
        +propagate_to_pages()
    }
    class EnvironmentDiagram {
        +String location
        +documents_internals()
    }

    HTMLPage "1" --> "1" VersionFile : html.version.txt
    HTMLPage "1" --> "0..1" GASScript : embeds via iframe
    HTMLPage "1" --> "1" Changelog : html changelog
    HTMLPage "1" --> "1" EnvironmentDiagram : internals documented in
    GASScript "1" --> "1" VersionFile : gs.version.txt
    GASScript "1" --> "1" Changelog : gs changelog
    GASScript "1" --> "1" GASConfig : configured by
    GASConfig "1" ..> "1" HTMLPage : syncs title
    Template "1" ..> "*" HTMLPage : creates
    Template "1" ..> "*" GASScript : creates
    AutoMergeWorkflow ..> HTMLPage : deploys
    AutoMergeWorkflow ..> GASScript : triggers update
```

Developed by: ShadowAISolutions
