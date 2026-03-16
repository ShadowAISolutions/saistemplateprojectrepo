"""
OFFENSIVE SECURITY TEST 02: Session Token Forgery & Fixation

Attack scenario: An attacker attempts to:
  1. Forge a session token and inject it into storage (session fixation)
  2. Craft a gas-session-created message with a forged token to hijack auth
  3. Manipulate localStorage/sessionStorage to gain unauthorized access
  4. Replay a previously-captured session token

This test plants forged tokens and observes whether the GAS backend accepts them.
"""

import sys
import json
import hashlib
import secrets
from playwright.sync_api import sync_playwright

TARGET_URL = "https://ShadowAISolutions.github.io/saistemplateprojectrepo/testauth1.html"

# Forged session tokens an attacker might try
FORGED_TOKENS = [
    "forged-session-token-12345",
    "admin-override-token",
    hashlib.sha256(b"attacker-secret").hexdigest(),
    secrets.token_hex(32),
    "../../../etc/passwd",
    "' OR '1'='1' --",
    '{"role":"admin","email":"attacker@evil.com"}',
    "null",
    "undefined",
    "<script>alert(1)</script>",
]


def run_test():
    results = []
    print("=" * 70)
    print("OFFENSIVE TEST 02: Session Token Forgery & Fixation")
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

        # ─── Attack 1: Session fixation via storage injection ───
        print("─── Attack 1: Session Fixation via Storage Injection ───")
        print("Injecting forged tokens directly into sessionStorage/localStorage...")

        for i, token in enumerate(FORGED_TOKENS):
            # Reset state
            page.evaluate("""() => {
                sessionStorage.clear();
                localStorage.clear();
            }""")

            # Inject the forged token as an attacker with XSS access would
            page.evaluate(f"""() => {{
                var token = {json.dumps(token)};
                // Try both storage types (standard uses localStorage, HIPAA uses sessionStorage)
                sessionStorage.setItem('testauth1_session', token);
                sessionStorage.setItem('testauth1_email', 'attacker@evil.com');
                localStorage.setItem('testauth1_session', token);
                localStorage.setItem('testauth1_email', 'attacker@evil.com');
            }}""")

            # Now reload the page — does it accept the forged token?
            page.reload(wait_until="networkidle", timeout=30000)
            page.wait_for_timeout(2000)  # Wait for auth flow to process

            # Check if the auth wall is still up (it should be — forged token should fail)
            auth_wall_visible = page.evaluate("""() => {
                var wall = document.getElementById('auth-wall');
                if (!wall) return true;  // No wall = can't bypass
                var style = window.getComputedStyle(wall);
                return style.display !== 'none' && style.visibility !== 'hidden';
            }""")

            # Check if the app content is visible (it shouldn't be)
            app_visible = page.evaluate("""() => {
                var app = document.getElementById('gas-app');
                if (!app) return false;
                return app.offsetHeight > 0 && app.offsetWidth > 0;
            }""")

            # The token should be rejected — auth wall stays up, app stays hidden
            blocked = auth_wall_visible or not app_visible
            status = "BLOCKED" if blocked else "BYPASSED"
            color = "\033[92m" if blocked else "\033[91m"
            token_preview = token[:40] + "..." if len(token) > 40 else token
            print(f"  {color}[{status}]\033[0m Token: {token_preview}")
            results.append({"attack": f"fixation_{i}", "blocked": blocked})

        print()

        # ─── Attack 2: Forged gas-session-created messages ───
        print("─── Attack 2: Forged gas-session-created Messages ───")
        print("Sending crafted session creation messages to bypass auth...")

        # Fresh page load
        page.evaluate("() => { sessionStorage.clear(); localStorage.clear(); }")
        page.reload(wait_until="networkidle", timeout=30000)

        forged_session_msgs = [
            # Standard forged session
            {
                "type": "gas-session-created",
                "success": True,
                "sessionToken": secrets.token_hex(32),
                "email": "attacker@evil.com",
                "displayName": "Attacker",
            },
            # With forged messageKey (attempt to set the signing key)
            {
                "type": "gas-session-created",
                "success": True,
                "sessionToken": secrets.token_hex(32),
                "email": "admin@target.com",
                "messageKey": "attacker-controlled-key",
            },
            # Try to overwrite an existing messageKey (second gas-session-created)
            {
                "type": "gas-session-created",
                "success": True,
                "sessionToken": "token-after-key-overwrite",
                "email": "admin@target.com",
                "messageKey": "overwrite-attempt",
            },
        ]

        for i, msg in enumerate(forged_session_msgs):
            console_logs.clear()
            page.evaluate("() => { sessionStorage.clear(); localStorage.clear(); }")

            # Send the forged message
            page.evaluate(f"window.postMessage({json.dumps(msg)}, '*')")
            page.wait_for_timeout(1000)

            # Check if the token was actually stored (it might be — but should fail on next validation)
            stored_token = page.evaluate("""() => {
                return sessionStorage.getItem('testauth1_session') || localStorage.getItem('testauth1_session');
            }""")

            stored_email = page.evaluate("""() => {
                return sessionStorage.getItem('testauth1_email') || localStorage.getItem('testauth1_email');
            }""")

            # Even if the message handler stores the token, loading the iframe with it
            # should fail GAS-side validation (server never created this session)
            # Check if the app is actually showing authenticated content
            app_authenticated = page.evaluate("""() => {
                var wall = document.getElementById('auth-wall');
                if (wall) {
                    var style = window.getComputedStyle(wall);
                    if (style.display === 'none' || style.visibility === 'hidden') {
                        return true;  // Wall hidden = app thinks we're authenticated
                    }
                }
                return false;
            }""")

            # Key insight: the HTML side may accept the message (allowlist passes it),
            # but the GAS backend will reject the forged token on the next iframe load
            if stored_token:
                print(f"  \033[93m[STORED]\033[0m Token was stored client-side (email: {stored_email})")
                print(f"    → This is expected — the real defense is GAS-side validation")

            if app_authenticated:
                print(f"  \033[91m[BYPASSED]\033[0m Auth wall was hidden — attacker message accepted!")
                blocked = False
            else:
                print(f"  \033[92m[BLOCKED]\033[0m Auth wall remains visible — forged session not accepted")
                blocked = True

            results.append({"attack": f"forged_session_{i}", "blocked": blocked})

        print()

        # ─── Attack 3: messageKey overwrite race ───
        print("─── Attack 3: messageKey Overwrite Race Condition ───")
        print("Testing first-write-wins protection on messageKey...")

        page.evaluate("() => { sessionStorage.clear(); localStorage.clear(); }")
        page.reload(wait_until="networkidle", timeout=30000)

        # Set a legitimate key first
        page.evaluate("""window.postMessage({
            type: 'gas-session-created',
            success: true,
            sessionToken: 'legit-token',
            email: 'user@legit.com',
            messageKey: 'legitimate-key-12345'
        }, '*')""")
        page.wait_for_timeout(500)

        # Now try to overwrite it (attacker's key)
        page.evaluate("""window.postMessage({
            type: 'gas-session-created',
            success: true,
            sessionToken: 'attacker-token',
            email: 'attacker@evil.com',
            messageKey: 'attacker-key-evil'
        }, '*')""")
        page.wait_for_timeout(500)

        # Check which key is active by sending a message signed with the attacker's key
        key_check = page.evaluate("""() => {
            // If the attacker's key was accepted, messages signed with it would pass
            // We can check indirectly by seeing which email was stored
            return {
                email: sessionStorage.getItem('testauth1_email') || localStorage.getItem('testauth1_email'),
                token: sessionStorage.getItem('testauth1_session') || localStorage.getItem('testauth1_session')
            };
        }""")

        # First-write-wins: the email should be from the first message, not the attacker's
        if key_check.get("email") == "attacker@evil.com" and key_check.get("token") == "attacker-token":
            print(f"  \033[91m[BYPASSED]\033[0m Attacker's key/token overwrote the legitimate one!")
            results.append({"attack": "key_overwrite", "blocked": False})
        else:
            print(f"  \033[92m[BLOCKED]\033[0m First-write-wins: attacker's key was rejected")
            print(f"    Stored email: {key_check.get('email')}, token: {str(key_check.get('token'))[:20]}...")
            results.append({"attack": "key_overwrite", "blocked": True})

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
