# index.html — Component Interaction Diagram

System architecture showing how the template subsystems interact on the landing page.

```mermaid
flowchart TB
    subgraph PageLoad["Page Load"]
        Init["Page Loads"]
        Init --> SplashCheck{"web-pending-sound<br>in sessionStorage?"}
        SplashCheck -->|Yes| WebSplash["🟢 Website Ready Splash<br>+ Sound Playback"]
        SplashCheck -->|No| Normal["Normal Load"]
        Init --> AudioInit["AudioContext Created<br>+ Auto-Resume Attempt"]
        Init --> CacheSound["Pre-load Sound Files<br>to localStorage"]
        Init --> WakeLock["Request Screen Wake Lock"]
    end

    subgraph AutoRefresh["HTML Auto-Refresh Loop"]
        Poll["Fetch indexhtml.version.txt<br>every 10s"]
        Poll --> Parse["Parse: maintenance|version|timestamp"]
        Parse --> VersionCheck{"Version<br>Changed?"}
        VersionCheck -->|Yes| Reload["Set web-pending-sound<br>→ Reload Page"]
        VersionCheck -->|No| MaintCheck{"Maintenance<br>Flag?"}
        MaintCheck -->|Yes| MaintOverlay["🟠 Maintenance Overlay<br>+ Timestamp Display"]
        MaintCheck -->|No| HideMaint["Hide Maintenance<br>if showing"]
        HideMaint --> Countdown["Countdown Dot<br>5..4..3..2..1"]
        MaintOverlay --> Countdown
        Countdown --> Poll
    end

    subgraph VersionUI["Version Indicator Pill"]
        Pill["Bottom-right pill<br>shows vXX.XXw"]
        Pill --> DotStates["Dot States:<br>⬛ idle → 🟠 checking<br>→ 🟢 found → 🔴 error"]
        Pill -->|Click| ChangelogPopup["📋 HTML Changelog Popup<br>fetches indexhtml.changelog.md"]
    end

    subgraph Audio["Audio System"]
        AudioInit --> UAv2{"User Activation<br>v2 Poll"}
        UAv2 -->|hasBeenActive| Unlock["Resume AudioContext"]
        Click["User Click/Touch"] --> Unlock
        Unlock --> Ready["🔊 Sound Ready"]
    end

    subgraph Maintenance["Maintenance Bypass"]
        MaintOverlay --> TripleClick["Triple-click 🔧"]
        TripleClick --> Dismiss["Dismiss overlay<br>sessionStorage flag"]
    end

    subgraph GASPoll["GAS Version Poll (Dormant)"]
        GASCheck["Fetch indexgs.version.txt"]
        GASCheck -->|404| Hidden["GAS pill stays hidden<br>No polling starts"]
    end

    Init --> Poll
    Init --> GASCheck
    Reload --> WebSplash
```

## Key Design Notes

- **No GAS project connected** — the `_e` variable is empty, so no iframe is injected. The GAS version poll fires once, gets a 404, and goes dormant
- **Version sourced from file** — no hardcoded version in HTML; `indexhtml.version.txt` is the single source of truth
- **Sound system** — uses localStorage caching of sound files + AudioContext for playback. UAv2 polling handles audio unlock when a GAS iframe covers the page (not applicable here since no GAS iframe)
- **Maintenance mode** — controlled by prepending `maintenance|` to the version file content. Bypass via hidden triple-click on the wrench emoji

Developed by: ShadowAISolutions
