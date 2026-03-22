# SSO Implementation — Revert Instructions

**Backup date:** 2026-03-21
**Backup version:** portal.html v01.18w, testauth1.html v02.61w
**Repo version at backup:** v05.80r

## What was backed up

These files capture the **pre-SSO state** — independent authentication per page, page-scoped session keys, separate CLIENT_IDs:

- `portal.html.pre-sso.bak` — portal before shared session changes
- `testauth1.html.pre-sso.bak` — testauth1 before SSO auto-detect changes

## How to revert

If the SSO implementation doesn't work or causes issues, restore the original files:

```bash
# From the repo root:
cp repository-information/backups/portal.html.pre-sso.bak live-site-pages/portal.html
cp repository-information/backups/testauth1.html.pre-sso.bak live-site-pages/testauth1.html
```

Then commit and push normally. The pages will return to independent auth with page-scoped sessions.

## What SSO changed (summary)

1. **Portal**: changed session storage keys from `portal_gas_session_token` / `portal_gas_user_email` to shared global keys (`sais_session_token` / `sais_user_email` / `sais_access_token`). Added cross-page sign-out broadcast.
2. **Testauth1**: changed CLIENT_ID to match portal's. Added auto-detect of shared session on load. Changed session keys to global. Added fallback sign-in if no shared session found.
3. **GAS scripts**: no GAS changes needed — each script still validates tokens independently.

## Cleanup

Once the SSO implementation is verified and stable, these backup files can be safely deleted.

Developed by: ShadowAISolutions
