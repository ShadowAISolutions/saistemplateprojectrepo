# Offensive Security Tests — testauth1

These tests simulate real attacks against the testauth1 authentication system.
Unlike the built-in defensive tests (which inspect code structure), these tests
act as an **outside attacker** — sending malicious payloads and observing how
the system responds in real time.

## Prerequisites

```bash
pip install playwright
playwright install chromium
```

## How to Run

Each test is a standalone Python script. Run them one at a time:

```bash
python tests/offensive-security/test_01_xss_postmessage.py
python tests/offensive-security/test_02_session_forgery.py
python tests/offensive-security/test_03_message_type_injection.py
python tests/offensive-security/test_04_csrf_token_replay.py
```

## What These Tests Do

| Test | Attack Vector | What It Verifies |
|------|--------------|-----------------|
| 01 | XSS via postMessage injection | Message allowlist blocks unknown types; signature verification rejects unsigned messages |
| 02 | Session token forgery & fixation | Forged session tokens are rejected by the GAS backend; localStorage can't be poisoned |
| 03 | Message type spoofing | Attacker-crafted messages mimicking legitimate GAS types are rejected by signature verification |
| 04 | OAuth token replay & CSRF | Replayed/fabricated OAuth tokens fail server-side validation; nonce prevents CSRF |

## Safety

- These tests run against the **live deployed page** on GitHub Pages
- They do NOT modify any server-side state permanently
- They do NOT require valid credentials
- They operate in an isolated browser context (Playwright)
- All attacks are contained to the test browser session

## Expected Results

Every test should show the attack being **blocked** by one or more defense layers.
If any attack succeeds, you've found a real vulnerability that needs fixing.

Developed by: ShadowAISolutions
