# Git workflow

How this repo is run. Short version: **`main` is always the latest working version.** New work happens on a branch, comes back through a pull request, and every release gets a tag.

## The pieces

| Term | What it means here |
|---|---|
| **Repository (repo)** | This whole project folder, plus its full history. |
| **Commit** | A saved snapshot with a one-line message saying what changed and why. |
| **Branch** | A parallel line of work. `main` is the official one. |
| **Pull request (PR)** | A request to merge a branch into `main`. It's where the before and after get reviewed. |
| **Tag** | A permanent name on one commit, e.g. `v1.0.0`. |
| **Release** | A tag published on GitHub with notes and files attached. |

## Branches

- `main`: the latest working version, and what `cutaway.sarvesh.co.uk` serves. Never edit it directly.
- `redesign/v1.2.0`, `ui/round-3` and so on: one branch per UI design round (your Figma iterations).
- `content/…`: copy, costs or layer data, e.g. `content/real-costs`.
- `fix/…`: small fixes, e.g. `fix/mobile-card-overflow`.

## A normal round of work

1. **Start a branch from `main`.** In GitHub Desktop: *Current branch › New branch*, e.g. `ui/round-2`.
2. **Make changes and commit as you go.** Keep each commit about one thing.
3. **Push the branch to GitHub.** Check it locally first (`python -m http.server 8765 -d dist`). Branches aren't published, so share screenshots with PTG, or merge to put it live.
4. **Open a pull request** into `main`. Describe what changed and add before and after screenshots. This is the part worth showing on the portfolio.
5. **Merge the PR** once it's checked. Cloudflare deploys `main` to `cutaway.sarvesh.co.uk` by itself.
6. **Release it.** `VERSION` and `CHANGELOG.md` are bumped on the branch. After the merge, tag the merge commit (e.g. `v1.2.0`) and publish a GitHub Release with the changelog notes.

## Commit messages

Format: `type(area): what changed`

- `feat(ui): layer card opens beside the selected label`
- `fix(engine): frames no longer skip on fast trackpad scroll`
- `content(data): real costs for all 11 layers`
- `docs: add round 2 notes`

Types: `feat` (new behaviour), `fix`, `refactor` (same behaviour, cleaner code), `content`, `docs`, `chore` (housekeeping).

## Version numbers

`MAJOR.MINOR.PATCH`, e.g. `1.2.0`

- **MAJOR:** the engine or animation changes.
- **MINOR:** a UI redesign round or a new feature.
- **PATCH:** fixes and copy changes.

## History so far

| Version | Date | What |
|---|---|---|
| prototype | 26 Sept 2026 | Single-file scroll prototype, 12 fps with frame blending |
| prototype | 26 Sept 2026 | 24 fps, no blending, smoother scroll |
| v1.0.0 | 27 Sept 2026 | Split into engine, UI and data. Build script |
| v1.1.0 | 6 Oct 2026 | Standalone build: one `dist/index.html`, frames from any folder or server |
| v1.2.0 | 12 Oct 2026 | UI redesign to the Figma V1 design system, PTG-branded, Cloudflare hosting |

## Hosting

Cloudflare (a Worker with Workers Builds) builds every push to `main` with `python3 build/build.py`, then `npx wrangler deploy` publishes `dist/` to `cutaway.sarvesh.co.uk`. Other branches aren't built. The old GitHub Pages staging (`ci/staging`) is retired. Setup steps are in `docs/hosting-cloudflare.md`.

## Useful commands

| Command | What it does |
|---|---|
| `git switch -c ui/round-3` | Make a new branch from where you are and move onto it |
| `git status` | What's changed and not yet committed |
| `git add <file>` then `git commit -m "..."` | Pick the files, then save the snapshot |
| `git push -u origin ui/round-3` | Send the branch to GitHub (first push; afterwards just `git push`) |
| `git tag v1.2.0` then `git push origin v1.2.0` | Name a release commit and send the tag to GitHub |
