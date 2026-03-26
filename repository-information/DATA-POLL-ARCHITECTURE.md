# Data Poll vs Heartbeat — Architecture & Quota Reference

> **Context:** In v06.66r, data polling was decoupled from the heartbeat pipeline. Previously, the heartbeat piggybacked `liveData` on its response — data delivery flipped between heartbeat (when active) and data poll (when idle). Now each pipeline has a single responsibility: heartbeat = session extension, data poll = data freshness. In v06.68r, the data poll was upgraded to require session authentication (HIPAA compliance).

## Architecture Overview

### Two Independent Pipelines

| Aspect | Heartbeat | Data Poll |
|---|---|---|
| **Purpose** | Session extension (keep-alive) | Data freshness (spreadsheet updates) |
| **Fires when** | User is active (mouse/keyboard/touch/scroll) | Always (continuous, independent of activity) |
| **Interval** | `HEARTBEAT_INTERVAL` (30s test / 5min prod) | `DATA_POLL_INTERVAL` (15s) |
| **GAS function** | `processHeartbeat(token)` | `processDataPoll(token)` |
| **Auth method** | Full session validation + HMAC | Session existence check (CacheService lookup) |
| **Session extension** | Yes (resets `createdAt`) | No |
| **Token delivery** | Phase 7 postMessage (never in URL) | Phase 7 postMessage (never in URL) |
| **Transport** | Hidden iframe (`gas-heartbeat`) | Hidden iframe (`gas-data-poll`) |
| **Ready signal** | `gas-heartbeat-ready` | `gas-data-poll-ready` |
| **Token message** | `heartbeat-token` | `data-poll-token` |
| **Response type** | `gas-heartbeat-ok` | `live-data` |

### Why Two Pipelines (Not One)

1. **Different cadences** — session management needs slow intervals (5min), data freshness needs fast intervals (15s). Merging forces one to be wrong.
2. **Independent tuning** — `HEARTBEAT_INTERVAL` and `DATA_POLL_INTERVAL` are configured separately, each optimized for its purpose.
3. **Fault isolation** — heartbeat failure doesn't stop data updates; data poll failure doesn't expire your session.
4. **Quota optimization** — idle users drop the expensive heartbeat (5 CacheService calls + 3 crypto ops) while keeping the cheap data poll (2 CacheService reads).

### Why Not Piggyback Data on Heartbeat

The original design piggybacked `liveData = getCachedData()` on the heartbeat response. This was removed because:

1. Data delivery flipped between pipelines based on activity state — two code paths for the same thing
2. Data freshness was coupled to heartbeat timing (30s/5min), not its own interval (15s)
3. If heartbeat failed or was rate-limited, data delivery was also lost
4. Two response handlers needed to know about data extraction
5. After HIPAA review, the unauthenticated data poll needed its own auth — making it almost as self-contained as the heartbeat anyway

---

## Per-Call Cost Comparison

| Operation | `processHeartbeat()` | `processDataPoll()` |
|---|---|---|
| **GAS function called** | `processHeartbeat(token)` | `processDataPoll(token)` |
| CacheService read (rate limit) | 1x `cache.get(hb_ratelimit_*)` | — |
| CacheService write (rate limit) | 1x `cache.put(hb_ratelimit_*)` | — |
| CacheService read (session) | 1x `cache.get(session_*)` | 1x `cache.get(session_*)` |
| JSON parse (session) | 1x `JSON.parse(raw)` | — |
| HMAC verification | 1x `verifySessionHmac()` | — |
| Session expiry checks | 2x (absolute + rolling) | — |
| Session timestamp update | 1x `hbData.createdAt = ...` | — |
| HMAC re-sign session | 1x `generateSessionHmac()` | — |
| JSON stringify (session) | 1x `JSON.stringify(hbData)` | — |
| CacheService write (session) | 1x `cache.put(session_*)` | — |
| CacheService read (live data) | — | 1x `cache.get(livedata_*)` |
| JSON parse (live data) | — | 1x `JSON.parse(cached)` |
| HMAC sign response | 1x `signMessage()` | — |
| postMessage handshake | Yes (token via postMessage) | Yes (token via postMessage) |
| **Total CacheService calls** | **5** (3 reads + 2 writes) | **2** (2 reads) |
| **Total crypto operations** | **3** (verify + re-sign + sign response) | **0** |
| **Total JSON parse/stringify** | **3** | **1** |
| **Estimated execution time** | **~50-100ms** | **~10-15ms** |
| **Estimated GAS quota units** | **~1 URL fetch equivalent** | **~0.2 URL fetch equivalent** |
| **Session authenticated?** | Yes (full validation) | Yes (existence check) |
| **HIPAA compliant?** | Yes | Yes |

---

## Quota Usage by Activity State

### When User is Active (both pipelines fire)

| Pipeline | Interval | CacheService calls/tick | Crypto ops/tick | Ticks/min | CacheService calls/min |
|---|---|---|---|---|---|
| Heartbeat | 30s | 5 | 3 | 2 | 10 |
| Data Poll | 15s | 2 | 0 | 4 | 8 |
| **Total** | | | | | **18** |

### When User is Idle (only data poll fires)

| Pipeline | Interval | CacheService calls/tick | Crypto ops/tick | Ticks/min | CacheService calls/min |
|---|---|---|---|---|---|
| Heartbeat | — (skipped) | 0 | 0 | 0 | 0 |
| Data Poll | 15s | 2 | 0 | 4 | 8 |
| **Total** | | | | | **8** |

**Idle users consume less than half the quota of active users.** The expensive heartbeat (5 CacheService calls + 3 crypto ops) drops to zero.

---

## Scaling Comparison

| Metric | Heartbeat only (30s) | Data Poll (15s) | Data Poll (20s) | Data Poll (30s) |
|---|---|---|---|---|
| **Calls/hour (1 viewer)** | 120 | 240 | 180 | 120 |
| **Compute/hour (1 viewer)** | ~9s | ~3s | ~2.3s | ~1.5s |
| **Calls/hour (10 viewers)** | 1,200 | 2,400 | 1,800 | 1,200 |
| **Compute/hour (10 viewers)** | ~90s | ~30s | ~23s | ~15s |
| **Calls/hour (50 viewers)** | 6,000 | 12,000 | 9,000 | 6,000 |
| **Compute/hour (50 viewers)** | ~450s | ~150s | ~113s | ~75s |
| **Data freshness** | ≤30s | ≤15s | ≤20s | ≤30s |
| **Cost vs Heartbeat** | 1x (baseline) | 0.33x | 0.25x | 0.17x |

### Combined Cost (Active User — Heartbeat @ 30s + Data Poll)

| Metric | HB 30s + DP 15s | HB 30s + DP 20s | HB 30s + DP 30s |
|---|---|---|---|
| **Calls/hour (1 viewer)** | 120 + 240 = 360 | 120 + 180 = 300 | 120 + 120 = 240 |
| **Compute/hour (1 viewer)** | ~9s + ~3s = ~12s | ~9s + ~2.3s = ~11.3s | ~9s + ~1.5s = ~10.5s |
| **Calls/hour (50 viewers)** | 6,000 + 12,000 = 18,000 | 6,000 + 9,000 = 15,000 | 6,000 + 6,000 = 12,000 |
| **Compute/hour (50 viewers)** | ~450s + ~150s = ~600s | ~450s + ~113s = ~563s | ~450s + ~75s = ~525s |

---

## HIPAA Compliance Summary

| Requirement | §164.312 Section | Heartbeat | Data Poll (old) | Data Poll (new) |
|---|---|---|---|---|
| Access Control | §164.312(a)(1) — Required | Compliant | **Non-compliant** | Compliant |
| Person/Entity Auth | §164.312(d) — Required | Compliant | **Non-compliant** | Compliant |
| Audit Controls | §164.312(b) — Required | Compliant | **Non-compliant** | Compliant |
| Integrity (HMAC) | §164.312(c)(1) — Addressable | Compliant | **Non-compliant** | N/A (no data modification) |
| Transmission Security | §164.312(e)(1) — Addressable | Compliant (HTTPS) | Compliant (HTTPS) | Compliant (HTTPS) |

The old data poll (`getCachedData()` called directly with no auth) violated 3 required HIPAA specifications. The new `processDataPoll(token)` validates session existence via CacheService lookup before returning data.

---

## Configuration Reference

```javascript
// In HTML_CONFIG (testauth1.html)
ENABLE_HEARTBEAT: true,
HEARTBEAT_INTERVAL: 30000,    // 30s test / 300000 (5min) production
DATA_POLL_INTERVAL: 15000,    // 15s — continuous lightweight data poll
```

| Config | Purpose | Tuning guidance |
|---|---|---|
| `HEARTBEAT_INTERVAL` | How often to check for activity and extend session | Increase for lower session management overhead. Production: 5min. |
| `DATA_POLL_INTERVAL` | How often to fetch fresh data | Decrease for more real-time data (more quota). Increase to save quota. |

These are fully independent — changing one has zero effect on the other.

---

## File Reference

| File | What it contains |
|---|---|
| `googleAppsScripts/Testauth1/testauth1.gs` | `processHeartbeat()` (line ~2419), `processDataPoll()` (line ~2502), `getCachedData()` (line ~575) |
| `live-site-pages/testauth1.html` | `sendHeartbeat()` (line ~3116), `_sendDataPoll()` (line ~3093), `_startDataPoll()` / `_stopDataPoll()` (line ~3079), heartbeat/data-poll ready handlers (line ~1925) |

Developed by: ShadowAISolutions
