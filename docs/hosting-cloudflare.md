# Hosting on Cloudflare

`https://cutaway.sarvesh.co.uk` serves the experience. It is a Cloudflare **Worker** (static assets only, no server code) that rebuilds itself from GitHub on every push to `main`. Sarvesh's Webflow portfolio links to it.

## How it is set up

| Piece | Where | What |
|---|---|---|
| Worker | Cloudflare → Workers & Pages → `building-cutaway` | Serves `dist/` as static files |
| Build | Same Worker → Settings → Build | Repo `saro-design/building-wall-cutaway`, branch `main`, build `python3 build/build.py`, deploy `npx wrangler deploy` |
| Config | `wrangler.jsonc` in the repo | Name, `dist/` as the assets folder, the custom domain, `workers.dev` and preview URLs off |
| Cache | `dist/_headers` (made by the build) | Frames and assets cached for a year |
| DNS | Cloudflare → `sarvesh.co.uk` → DNS | Moved from Wix on 13 Oct 2026 (nameservers `lucy` / `skip.ns.cloudflare.com`) |
| Domain registration | Wix | Wix still holds and renews `sarvesh.co.uk`; only the DNS moved |

### DNS records for sarvesh.co.uk

| Type | Name | Points to | Proxy | For |
|---|---|---|---|---|
| A | `sarvesh.co.uk` | `198.202.211.1` | Off (grey) | Webflow portfolio |
| CNAME | `www` | `cdn.webflow.com` | Off (grey) | Webflow portfolio |
| TXT | `_webflow` | `one-time-verification=…` | — | Webflow domain verification |
| Worker | `cutaway` | `building-cutaway` Worker | On | Added by Cloudflare from `wrangler.jsonc` |

Keep the Webflow records grey (DNS only). Webflow issues its own HTTPS certificate and expects traffic to reach it directly.

## Your routine

1. Design the change in Figma.
2. Ask Claude Code to build it on a new branch (e.g. `ui/round-3`) and push.
3. Check it locally (`python -m http.server 8765 -d dist`) and review the pull request.
4. Merge the pull request. Cloudflare builds `main` and `cutaway.sarvesh.co.uk` updates by itself in 1–2 minutes.
5. Tag the release (e.g. `v1.3.0`) and publish a GitHub Release.

Only `main` is built. Branches don't get their own Cloudflare preview link; review them locally or in the pull request.

## If something goes wrong

- **Build failed:** Workers & Pages → `building-cutaway` → Deployments → the failed build → View logs. Copy the last 20 lines into Claude Code.
- **Frames don't load:** check the build log says it uploaded about 200 files, not 1. If only `index.html` went up, `frames/` is missing from the commit.
- **Portfolio down:** check the three Webflow records above are still there and grey.
- **Roll back:** Workers & Pages → `building-cutaway` → Deployments → pick an earlier version → Deploy.

## The free plan

Free covers this project comfortably: unlimited bandwidth, static asset requests aren't metered, 25 MiB per file and 20,000 files per deploy (we use about 205 files, the largest under 0.5 MB), free HTTPS and DDoS protection. A paid plan only matters for heavy server-side code, which this site doesn't have.
