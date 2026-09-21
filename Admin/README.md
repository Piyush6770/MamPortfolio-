# Dr. Swati Vijay Shinde - Portfolio Admin Portal

A standalone CMS Admin Panel built with React, Vite, Tailwind CSS, and Supabase.

## Vercel Deployment Instructions (for https://adminswatishinde.vercel.app/)

### Option 1: Deploy using GitHub & Vercel Dashboard (Recommended)
1. Initialize git in this `Admin` folder (or push to a dedicated GitHub repo e.g., `dr-swati-shinde-admin`):
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Admin Portal"
   ```
2. Go to [Vercel Dashboard](https://vercel.com/new).
3. Import the `Admin` repository.
4. Set the **Project Name** to: `adminswatishinde` (so the URL becomes `https://adminswatishinde.vercel.app`).
5. Under **Environment Variables**, add:
   * `VITE_SUPABASE_URL` = `https://rfsfrhmnuaovxaipcfcv.supabase.co`
   * `VITE_SUPABASE_ANON_KEY` = `sb_publishable_E3EhiSLwbyRiy6WLxdHQag_rLxLefRF`
   * `VITE_PUBLIC_PORTFOLIO_URL` = `https://swatishinde.vercel.app/`
6. Click **Deploy**.

### Option 2: Deploy using Vercel CLI
```bash
npm install -g vercel
vercel
```
* Link to existing project or create new: **Create new**
* Project name: `adminswatishinde`
* In Vercel Project Settings -> Domains, assign `adminswatishinde.vercel.app`.

---

## Supabase Real-Time Cloud Sync (1-Click SQL)
To allow changes made on `https://adminswatishinde.vercel.app/` to immediately reflect on `https://swatishinde.vercel.app/`:
1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Open your project -> Click **SQL Editor** on the left menu.
3. Copy the contents of `supabase_complete_setup.sql` and click **Run**.
