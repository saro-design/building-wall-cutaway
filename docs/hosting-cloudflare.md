# Hosting Building Cutaway on Cloudflare Pages

Goal: `https://cutaway.sarvesh.co.uk` serves the live experience. It deploys automatically from GitHub, and your Webflow case study links to it.

Do Part A after Claude Code has pushed the redesign branch and you've merged it into `main`. You can set up hosting earlier; the first deploy will just show the current `main`.

---

## Part A. Create the Pages project (about 10 min)

1. Go to **dash.cloudflare.com** and sign up (free plan). Verify your email.
2. In the left menu, open **Workers & Pages**.
3. Click **Create application** → **Pages** tab → **Connect to Git**.
4. Choose **GitHub** and sign in.
   - When GitHub asks which repos to allow, pick **Only select repositories** → `building-wall-cutaway`. Click **Install & Authorize**.
5. Select `building-wall-cutaway`, then click **Begin setup**.
6. Fill in:
   - **Project name:** `building-cutaway`. This gives you `building-cutaway.pages.dev`.
   - **Production branch:** `main`
   - **Framework preset:** `None`
   - **Build command:** `python3 build/build.py`
   - **Build output directory:** `dist`
7. Click **Save and Deploy**. Wait for the green "Success" (1–2 min).
8. Open `https://building-cutaway.pages.dev` and scroll through to check it.

> **If the build fails:** open the deployment, then **View build log**. Copy the last 20 lines into Claude Code and ask it to fix the build.

**What you get from now on:**
- Every push to `main` updates the live site automatically.
- Every other branch (e.g. `ui/round-2`) gets its own preview link, like `ui-round-2.building-cutaway.pages.dev`. Send that link to PTG for feedback before you merge.

---

## Part B. Add the subdomain cutaway.sarvesh.co.uk (about 10 min + waiting)

Order matters. Add the domain in Cloudflare **first**, then the DNS record. Doing it the other way round can cause a "522" error.

1. In Cloudflare: **Workers & Pages** → `building-cutaway` → **Custom domains** tab → **Set up a domain**.
2. Type `cutaway.sarvesh.co.uk` and click **Continue**. Cloudflare shows the record you need to add; leave this tab open.
3. Find where sarvesh.co.uk's **DNS** is managed. This is your domain registrar (e.g. GoDaddy, 123-reg, Namecheap, Google/Squarespace Domains), not Webflow.
   - If you're not sure: in Webflow, go to **Site settings → Publishing → Production → Custom domains**. The DNS records listed there are the ones you added at your registrar, so that's where to go.
4. At the registrar, open the DNS settings for `sarvesh.co.uk` and **add a record**:
   - **Type:** `CNAME`
   - **Name / Host:** `cutaway`
   - **Value / Target / Points to:** `building-cutaway.pages.dev`
   - **TTL:** Auto (or 1 hour)
   - Save.
   - Don't touch the existing Webflow records (`@`, `www`). Your portfolio keeps working as before.
5. Back in Cloudflare, wait until the domain shows **Active**. Usually 5–30 min; can be up to 24 h. Cloudflare issues the HTTPS certificate automatically.
6. Visit `https://cutaway.sarvesh.co.uk`.

> **Stuck on "Pending" for over a day?** Check the registrar for a **CAA** record. If one exists, it must allow `letsencrypt.org` and `pki.goog`, or delete it. Then click **Retry** in Cloudflare.

---

## Part C. Link it from Webflow (5 min)

1. Open the case study page (`/ptg-building-cutaway`) in the Webflow Designer.
2. Select the **Launch the experience** button (there's one in Overview and one in Final Design).
3. In **Link settings**, change it from the page link to **URL**: `https://cutaway.sarvesh.co.uk`, and tick **Open in new tab**.
4. Do the same for the project card on the Projects page, if it links to the experience.
5. Publish the Webflow site.
6. Later, delete the old draft Webflow page **Building Wall Cutaway** (`/building-wall-cutaway`). It's no longer needed.

---

## Part D. Tidy GitHub (2 min)

1. On github.com, open the pull request for `ci/staging` and click **Close pull request** (don't merge). Then **Delete branch**.
2. Repo **Settings → Pages**: if GitHub Pages is on, set **Source** to **None**.

---

## Your routine from now on

1. Design the change in Figma.
2. Ask Claude Code to build it on a new branch (e.g. `ui/round-2`) and push.
3. Cloudflare posts a preview link. Check it and send it to PTG.
4. Merge the pull request on GitHub. `cutaway.sarvesh.co.uk` updates by itself.
5. Tag the release (e.g. `v1.3.0`).

Sources: Cloudflare docs, [Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/) and [Custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/).
