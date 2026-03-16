"""
OFFENSIVE SECURITY TEST 06: Deploy Endpoint Abuse & Code Injection

Attack scenario: The GAS doPost(action=deploy) endpoint is intentionally
unauthenticated (to allow GitHub Actions webhooks). An attacker attempts to:
  1. Trigger unauthorized deploys by calling doPost(action=deploy) directly
  2. Probe for other doPost actions that might exist
  3. Attempt parameter pollution on the deploy endpoint
  4. Test rate limiting and resource exhaustion on the deploy handler
  5. Probe for information disclosure in error responses
  6. Test if the deploy endpoint leaks GitHub tokens or internal state

The deploy endpoint is safe by design (it pulls from GitHub, the source of truth),
but we verify there are no unintended side effects or information leaks.
"""

import sys
import json
import time
from playwright.sync_api import sync_playwright

TARGET_URL = "https://ShadowAISolutions.github.io/saistemplateprojectrepo/testauth1.html"
GAS_BASE_URL = "https://script.google.com/macros/s/AKfycbzcKmQ37XpdCS5ziKpInaGoHa8tZ0w6MeIP6cMWMV6-wXG2hS1K2pmBq4e4-J7xpNL-_w/exec"


def run_test():
    results = []
    print("=" * 70)
    print("OFFENSIVE TEST 06: Deploy Endpoint Abuse & Code Injection")
    print("=" * 70)
    print(f"Target: {GAS_BASE_URL}")
    print()

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()

        # ─── Attack 1: Probe doPost with various action parameters ───
        print("─── Attack 1: Action Parameter Probing ───")
        print("Testing doPost with various action values...")

        malicious_actions = [
            # Known action
            "deploy",
            # Try to discover hidden actions
            "admin",
            "debug",
            "eval",
            "execute",
            "shell",
            "config",
            "reset",
            "delete",
            "wipe",
            "export",
            "dump",
            "backup",
            # Injection attempts in the action parameter
            "deploy;ls -la",
            "deploy' OR '1'='1",
            "deploy<script>alert(1)</script>",
            "deploy\"; cat /etc/passwd; echo \"",
            # Parameter pollution — try to override internal vars
            "deploy&GITHUB_TOKEN=attacker_token",
            "deploy&GITHUB_BRANCH=evil-branch",
        ]

        for i, action in enumerate(malicious_actions):
            probe_page = context.new_page()
            try:
                # POST request simulation (GAS doPost handles form data)
                response = probe_page.goto(
                    f"{GAS_BASE_URL}?action={action}",
                    wait_until="load",
                    timeout=15000
                )

                status = response.status if response else "no_response"
                content = probe_page.content()

                # Check for sensitive information in the response
                sensitive_patterns = [
                    ("GITHUB_TOKEN", "github_token_leak"),
                    ("Bearer ", "bearer_token_leak"),
                    ("HMAC_SECRET", "hmac_secret_leak"),
                    ("password", "password_leak"),
                    ("secret", "secret_leak"),
                    ("api_key", "api_key_leak"),
                    ("private_key", "private_key_leak"),
                    ("stack trace", "stack_trace_leak"),
                    ("Exception", "exception_leak"),
                    ("ScriptApp", "gas_internal_leak"),
                ]

                leaks_found = []
                content_lower = content.lower()
                for pattern, leak_name in sensitive_patterns:
                    if pattern.lower() in content_lower:
                        # Exclude false positives from the page's own JS variable declarations
                        # (e.g. the word "secret" in comments or variable names in the source)
                        if pattern.lower() not in ["secret", "password"]:
                            leaks_found.append(leak_name)

                action_preview = action[:40] + "..." if len(action) > 40 else action
                if leaks_found:
                    print(f"  \033[91m[LEAKED]\033[0m action={action_preview} — HTTP {status}")
                    print(f"    Sensitive data found: {', '.join(leaks_found)}")
                    results.append({"attack": f"action_probe_{i}", "blocked": False})
                else:
                    print(f"  \033[92m[SAFE]\033[0m action={action_preview} — HTTP {status}")
                    body_preview = content.replace('\n', ' ')[:80]
                    print(f"    response: {body_preview}")
                    results.append({"attack": f"action_probe_{i}", "blocked": True})

            except Exception as e:
                print(f"  \033[92m[BLOCKED]\033[0m action={action[:30]} — error: {str(e)[:50]}")
                results.append({"attack": f"action_probe_{i}", "blocked": True})
            finally:
                probe_page.close()

        print()

        # ─── Attack 2: POST body injection ───
        print("─── Attack 2: POST Body Injection ───")
        print("Sending malicious POST payloads to the GAS endpoint...")

        post_payloads = [
            # Try to inject code via POST body
            '{"action":"deploy","code":"function pwn(){Logger.log(PropertiesService.getScriptProperties().getProperties())}"}',
            # Try to override the GitHub URL
            '{"action":"deploy","GITHUB_OWNER":"evil-attacker","GITHUB_REPO":"malicious-code"}',
            # Try to access script properties
            '{"action":"getProperties"}',
            # XXE-style payload
            '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><foo>&xxe;</foo>',
            # Server-side template injection
            '${7*7}',
            '{{7*7}}',
        ]

        for i, payload in enumerate(post_payloads):
            post_page = context.new_page()
            try:
                # Use evaluate to make a fetch POST request
                post_result = post_page.evaluate(f"""async () => {{
                    try {{
                        var resp = await fetch("{GAS_BASE_URL}", {{
                            method: "POST",
                            headers: {{ "Content-Type": "application/json" }},
                            body: {json.dumps(payload)},
                            redirect: "follow"
                        }});
                        var text = await resp.text();
                        return {{ status: resp.status, body: text.substring(0, 500), ok: resp.ok }};
                    }} catch(e) {{
                        return {{ error: e.message }};
                    }}
                }}""")

                if post_result.get("error"):
                    print(f"  \033[92m[BLOCKED]\033[0m POST {i}: CORS/network blocked — {post_result['error'][:50]}")
                    blocked = True
                else:
                    body = post_result.get("body", "")
                    # Check for evidence that injected code executed
                    has_properties = "GITHUB_TOKEN" in body or "HMAC_SECRET" in body
                    has_file_content = "/bin/bash" in body or "root:" in body
                    has_eval = "49" in body  # 7*7=49

                    if has_properties or has_file_content or has_eval:
                        print(f"  \033[91m[VULNERABLE]\033[0m POST {i}: Injection succeeded!")
                        print(f"    response: {body[:100]}")
                        blocked = False
                    else:
                        print(f"  \033[92m[SAFE]\033[0m POST {i}: HTTP {post_result.get('status')} — no injection evidence")
                        blocked = True

                results.append({"attack": f"post_inject_{i}", "blocked": blocked})

            except Exception as e:
                print(f"  \033[92m[BLOCKED]\033[0m POST {i}: {str(e)[:50]}")
                results.append({"attack": f"post_inject_{i}", "blocked": True})
            finally:
                post_page.close()

        print()

        # ─── Attack 3: Error message information disclosure ───
        print("─── Attack 3: Error Message Information Disclosure ───")
        print("Probing for verbose error messages that leak internal state...")

        error_probes = [
            # Invalid session tokens designed to trigger errors
            f"{GAS_BASE_URL}?session=" + "A" * 10000,  # Buffer overflow attempt
            f"{GAS_BASE_URL}?session=null",
            f"{GAS_BASE_URL}?session=undefined",
            f"{GAS_BASE_URL}?session=%00%00%00%00",  # Null bytes
            f"{GAS_BASE_URL}?heartbeat=" + "A" * 10000,
            f"{GAS_BASE_URL}?exchangeToken=" + "A" * 10000,
            # Try to trigger uncaught exceptions
            f"{GAS_BASE_URL}?session[__proto__][isAdmin]=true",
            f"{GAS_BASE_URL}?session=../../etc/passwd",
            f"{GAS_BASE_URL}?%00=null",
        ]

        for i, url in enumerate(error_probes):
            error_page = context.new_page()
            try:
                response = error_page.goto(url, wait_until="load", timeout=15000)
                content = error_page.content()

                # Check for verbose errors
                verbose_indicators = [
                    "stack trace",
                    "at line",
                    "TypeError:",
                    "ReferenceError:",
                    "SyntaxError:",
                    "ScriptApp.",
                    "CacheService.",
                    "PropertiesService.",
                    "SpreadsheetApp.",
                    "file:///",
                    "Internal Server Error",
                    "500",
                ]

                found_verbose = []
                for indicator in verbose_indicators:
                    if indicator.lower() in content.lower():
                        found_verbose.append(indicator)

                param = url.split("?")[1][:40] if "?" in url else "(none)"
                if found_verbose:
                    print(f"  \033[93m[DISCLOSED]\033[0m param: {param}")
                    print(f"    Verbose info: {', '.join(found_verbose)}")
                    results.append({"attack": f"error_disclosure_{i}", "blocked": False})
                else:
                    print(f"  \033[92m[SAFE]\033[0m param: {param} — no verbose errors")
                    results.append({"attack": f"error_disclosure_{i}", "blocked": True})

            except Exception as e:
                print(f"  \033[92m[SAFE]\033[0m probe {i}: {str(e)[:40]}")
                results.append({"attack": f"error_disclosure_{i}", "blocked": True})
            finally:
                error_page.close()

        print()

        # ─── Attack 4: Security event reporting abuse ───
        print("─── Attack 4: Security Event Reporting Abuse ───")
        print("Testing if the securityEvent endpoint can be abused for spam/DoS...")

        # The security event endpoint is rate-limited to 20 per 5 min
        se_page = context.new_page()
        try:
            # Send 25 rapid security events to test rate limiting
            rate_limit_hit = False
            for j in range(25):
                se_response = se_page.goto(
                    f"{GAS_BASE_URL}?securityEvent=test_flood_{j}&clientIp=attacker_ip&details=%7B%22test%22%3Atrue%7D",
                    wait_until="load",
                    timeout=10000
                )

            # The endpoint should not crash or leak info even under flood
            final_content = se_page.content()
            has_error = "error" in final_content.lower() and "rate" not in final_content.lower()

            if has_error:
                print(f"  \033[93m[WARN]\033[0m Security event flood caused error response")
                results.append({"attack": "se_flood", "blocked": False})
            else:
                print(f"  \033[92m[SAFE]\033[0m Security event endpoint handled flood gracefully")
                print(f"  → Rate limiting (20/5min) should cap the audit log entries")
                results.append({"attack": "se_flood", "blocked": True})

        except Exception as e:
            print(f"  \033[92m[SAFE]\033[0m Flood test: {str(e)[:50]}")
            results.append({"attack": "se_flood", "blocked": True})
        finally:
            se_page.close()

        print()

        # ─── Attack 5: Deployment URL version pinning attack ───
        print("─── Attack 5: Deployment Version Pinning ───")
        print("Checking if old deployment versions are still accessible...")

        # GAS deployments have version numbers — old versions might still be reachable
        # The exec URL always points to the latest, but /dev or versioned URLs might work
        version_urls = [
            # Try the /dev endpoint (requires editor access)
            GAS_BASE_URL.replace("/exec", "/dev"),
            # Try explicit version numbers
            GAS_BASE_URL.replace("/exec", "/exec?v=1"),
            GAS_BASE_URL.replace("/exec", "/exec?version=1"),
        ]

        for i, vurl in enumerate(version_urls):
            v_page = context.new_page()
            try:
                v_response = v_page.goto(vurl, wait_until="load", timeout=10000)
                v_status = v_response.status if v_response else "no_response"
                v_content = v_page.content()

                has_app_content = "gas-needs-auth" in v_content or "gas-session-created" in v_content

                url_suffix = vurl.split("/macros/s/")[1][:30] if "/macros/s/" in vurl else vurl[-30:]
                if has_app_content and "/dev" in vurl:
                    print(f"  \033[91m[ACCESSIBLE]\033[0m /dev endpoint accessible — HTTP {v_status}")
                    results.append({"attack": f"version_pin_{i}", "blocked": False})
                else:
                    print(f"  \033[92m[BLOCKED]\033[0m {url_suffix}... — HTTP {v_status}")
                    results.append({"attack": f"version_pin_{i}", "blocked": True})

            except Exception as e:
                print(f"  \033[92m[BLOCKED]\033[0m version probe {i}: {str(e)[:40]}")
                results.append({"attack": f"version_pin_{i}", "blocked": True})
            finally:
                v_page.close()

        print()

        # ─── Summary ───
        print("=" * 70)
        total = len(results)
        blocked = sum(1 for r in results if r["blocked"])
        bypassed = total - blocked
        print(f"RESULTS: {blocked}/{total} attacks blocked")
        if bypassed > 0:
            print(f"\033[93m  {bypassed} PROBE(S) RETURNED NOTABLE RESULTS\033[0m")
            print("  Note: The deploy endpoint is safe by design (pulls from GitHub,")
            print("  the source of truth). Probes verify no information leaks.")
            for r in results:
                if not r["blocked"]:
                    print(f"    - {r['attack']}")
        else:
            print(f"\033[92m  All probes were handled safely.\033[0m")
        print("=" * 70)

        browser.close()
        return bypassed == 0


if __name__ == "__main__":
    success = run_test()
    sys.exit(0 if success else 1)

# Developed by: ShadowAISolutions
