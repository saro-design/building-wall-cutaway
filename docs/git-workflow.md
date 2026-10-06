# Git workflow

How this repo is run. Short version: **`main` is always what's live on Webflow.** New work happens on a branch, comes back through a pull request, and every release gets a tag.

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

- `main`: matches the live Webflow page. Never edit it directly.
- `ui/round-2`, `ui/round-3` and so on: one branch per UI design round (your Figma iterations).
- `content/…`: copy, costs or layer data, e.g. `content/real-costs`.
- `fix/…`: small fixes, e.g. `fix/mobile-card-overflow`.

## A normal round of work

1. **Start a branch from `main`.** In GitHub Desktop: *Current branch › New branch*, e.g. `ui/round-2`.
2. **Make changes and commit as you go.** Keep each commit about one thing.
3. **Push the branch to GitHub.**
4. **Open a pull request** into `main`. Describe what changed and add before and after screenshots. This is the part worth showing on the portfolio.
5. **Merge the PR** once it's checked and pushed to Webflow.
6. **Release it.** Bump `VERSION`, update `CHANGELOG.md`, tag `v1.1.0`, and publish a GitHub Release with the two Webflow files attached.

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
| v1.0.0 | 27 Sept 2026 | Split into engine, UI and data. Build script. Live on Webflow (draft) |
