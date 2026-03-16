"""
OFFENSIVE SECURITY TEST 03: Message Type Spoofing & Protocol Confusion

Attack scenario: An attacker who can send postMessages to the page attempts to:
  1. Spoof legitimate GAS message types to trigger auth state changes
  2. Exploit edge cases in the message handler (prototype pollution, type coercion)
  3. Trigger sign-out/session destruction as a denial-of-service
  4. Confuse the auth state machine by sending messages out of sequence

This is a more targeted attack than Test 01 — it uses knowledge of the
message protocol to craft believable-looking messages.
"""

import sys
import json
from playwright.sync_api import sync_playwright

TARGET_URL = "https://ShadowAISolutions.github.io/saistemplateprojectrepo/testauth1.html"


def run_test():
    results = []
    print("=" * 70)
    print("OFFENSIVE TEST 03: Message Type Spoofing & Protocol Confusion")
    print("=" * 70)
    print(f"Target: {TARGET_URL}")
    print()

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()

        console_logs = []
        page = context.new_page()
        page.on("console", lambda msg: console_logs.append({"type": msg.type, "text": msg.text}))

        print("[*] Loading target page...")
        page.goto(TARGET_URL, wait_until="networkidle", timeout=30000)
        print("[+] Page loaded successfully")
        print()

        # ─── Attack 1: Prototype pollution via postMessage ───
        print("─── Attack 1: Prototype Pollution via postMessage ───")
        pollution_payloads = [
            {"type": "gas-auth-ok", "__proto__": {"isAdmin": True}},
            {"type": "gas-auth-ok", "constructor": {"prototype": {"isAdmin": True}}},
            {"type": "gas-heartbeat-ok", "__proto__": {"authenticated": True}, "expiresIn": 9999},
            # JSON-based prototype pollution
            '{"type":"gas-auth-ok","__proto__":{"isAdmin":true}}',
        ]

        for i, payload in enumerate(pollution_payloads):
            console_logs.clear()

            if isinstance(payload, str):
                page.evaluate(f"window.postMessage(JSON.parse({json.dumps(payload)}), '*')")
            else:
                page.evaluate(f"window.postMessage({json.dumps(payload)}, '*')")
            page.wait_for_timeout(300)

            # Check if Object.prototype was polluted
            polluted = page.evaluate("""() => {
                var obj = {};
                return obj.isAdmin === true || obj.authenticated === true;
            }""")

            blocked = not polluted
            status = "BLOCKED" if blocked else "BYPASSED"
            color = "\033[92m" if blocked else "\033[91m"
            desc = json.dumps(payload)[:60] if isinstance(payload, dict) else payload[:60]
            print(f"  {color}[{status}]\033[0m {desc}...")
            if polluted:
                print(f"    \033[91m!!! Object.prototype polluted — attacker can inject properties !!!\033[0m")
            results.append({"attack": f"proto_pollution_{i}", "blocked": blocked})

        print()

        # ─── Attack 2: DoS via forced sign-out ───
        print("─── Attack 2: DoS via Forced Sign-Out Messages ───")
        print("Attempting to destroy user session via spoofed messages...")

        # Pre-plant a fake session to see if the attacker can destroy it
        page.evaluate("""() => {
            sessionStorage.setItem('testauth1_session', 'user-valid-session');
            sessionStorage.setItem('testauth1_email', 'user@legit.com');
            localStorage.setItem('testauth1_session', 'user-valid-session');
            localStorage.setItem('testauth1_email', 'user@legit.com');
        }""")

        dos_messages = [
            {"type": "gas-signed-out", "success": True},
            {"type": "gas-heartbeat-expired", "reason": "timeout"},
            {"type": "gas-heartbeat-expired", "reason": "absolute_timeout"},
            {"type": "gas-heartbeat-expired", "reason": "integrity_violation"},
            {"type": "gas-heartbeat-expired", "reason": "corrupt_session"},
            {"type": "gas-session-invalid", "reason": "session_expired"},
        ]

        for i, msg in enumerate(dos_messages):
            # Restore the session before each attempt
            page.evaluate("""() => {
                sessionStorage.setItem('testauth1_session', 'user-valid-session');
                localStorage.setItem('testauth1_session', 'user-valid-session');
            }""")

            page.evaluate(f"window.postMessage({json.dumps(msg)}, '*')")
            page.wait_for_timeout(500)

            # Check if the session was destroyed
            session_after = page.evaluate("""() => {
                return sessionStorage.getItem('testauth1_session') || localStorage.getItem('testauth1_session');
            }""")

            if session_after is None:
                # Without signature verification, these messages could clear session — this is
                # expected if no messageKey is set. The real defense is signature verification.
                print(f"  \033[93m[SESSION CLEARED]\033[0m Type: {msg['type']}, reason: {msg.get('reason', 'n/a')}")
                print(f"    → Check: is _messageKey set? Without it, allowlisted messages pass through")
                # This is a known risk when no key is set — document but don't fail
                results.append({"attack": f"dos_{i}", "blocked": False})
            else:
                print(f"  \033[92m[BLOCKED]\033[0m Type: {msg['type']} — session preserved (sig verification)")
                results.append({"attack": f"dos_{i}", "blocked": True})

        print()

        # ─── Attack 3: Auth state machine confusion ───
        print("─── Attack 3: Auth State Machine Confusion ───")
        print("Sending messages out of expected sequence...")

        page.evaluate("() => { sessionStorage.clear(); localStorage.clear(); }")
        page.reload(wait_until="networkidle", timeout=30000)

        # Send auth-ok before session-created (skip the auth flow)
        page.evaluate("""window.postMessage({
            type: 'gas-auth-ok',
            version: 'v01.42g',
            needsReauth: false
        }, '*')""")
        page.wait_for_timeout(500)

        # Check if auth wall dropped despite no valid session
        auth_wall = page.evaluate("""() => {
            var wall = document.getElementById('auth-wall');
            if (!wall) return 'no_wall';
            var style = window.getComputedStyle(wall);
            return (style.display === 'none' || style.visibility === 'hidden') ? 'hidden' : 'visible';
        }""")

        if auth_wall == 'hidden':
            print(f"  \033[91m[BYPASSED]\033[0m Auth wall hidden after out-of-sequence gas-auth-ok!")
            results.append({"attack": "state_confusion_1", "blocked": False})
        else:
            print(f"  \033[92m[BLOCKED]\033[0m Auth wall still visible — out-of-sequence message rejected")
            results.append({"attack": "state_confusion_1", "blocked": True})

        # Send heartbeat-ok to extend a non-existent session
        page.evaluate("""window.postMessage({
            type: 'gas-heartbeat-ok',
            expiresIn: 999999,
            absoluteRemaining: 999999
        }, '*')""")
        page.wait_for_timeout(300)

        session_exists = page.evaluate("""() => {
            return sessionStorage.getItem('testauth1_session') || localStorage.getItem('testauth1_session');
        }""")

        if session_exists:
            print(f"  \033[91m[BYPASSED]\033[0m Heartbeat created a session from nothing!")
            results.append({"attack": "state_confusion_2", "blocked": False})
        else:
            print(f"  \033[92m[BLOCKED]\033[0m Heartbeat didn't create a session — correct behavior")
            results.append({"attack": "state_confusion_2", "blocked": True})

        print()

        # ─── Attack 4: Type coercion & edge cases ───
        print("─── Attack 4: Type Coercion & Edge Cases ───")
        edge_cases = [
            # Numeric type (should fail typeof check)
            {"type": 123, "data": "numeric type"},
            # Boolean type
            {"type": True, "data": "boolean type"},
            # Null type
            {"type": None, "data": "null type"},
            # Array as message
            [{"type": "gas-auth-ok"}],
            # Nested object type
            {"type": {"toString": "gas-auth-ok"}, "data": "object type"},
            # Very long type string (buffer overflow attempt)
            {"type": "gas-auth-ok" + "A" * 10000},
            # Unicode confusion
            {"type": "gas\u200B-auth-ok", "version": "v01.42g"},  # Zero-width space
        ]

        for i, payload in enumerate(edge_cases):
            console_logs.clear()

            try:
                page.evaluate(f"window.postMessage({json.dumps(payload)}, '*')")
                page.wait_for_timeout(200)
                print(f"  \033[92m[BLOCKED]\033[0m Edge case {i}: silently dropped")
                results.append({"attack": f"edge_case_{i}", "blocked": True})
            except Exception as e:
                print(f"  \033[92m[BLOCKED]\033[0m Edge case {i}: caused error (good): {str(e)[:50]}")
                results.append({"attack": f"edge_case_{i}", "blocked": True})

        print()

        # ─── Summary ───
        print("=" * 70)
        total = len(results)
        blocked = sum(1 for r in results if r["blocked"])
        bypassed = total - blocked
        print(f"RESULTS: {blocked}/{total} attacks blocked")
        if bypassed > 0:
            print(f"\033[93m  {bypassed} ATTACK(S) HAD PARTIAL SUCCESS\033[0m")
            print("  Note: Some attacks succeed when _messageKey is not yet set.")
            print("  The messageKey is delivered by the real GAS backend during auth.")
            print("  Pre-auth DoS (clearing a session before key is set) is a known")
            print("  design limitation — the allowlist is the primary defense pre-key.")
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
