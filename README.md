# Dr. Swati Vijay Shinde — Academic Portfolio & Admin CMS

This repository contains the full source code for the personal and academic portfolio website of **Dr. Swati Vijay Shinde** (Dean - MIS & Professor in Computer Engineering at PCCoE Pune), paired with an **Admin Content Management System (CMS)**.

## Live URLs
- **Public Portfolio:** https://swatishinde.vercel.app/
- **Admin Panel:** https://swatishinde.vercel.app/#/admin (or `/admin`)

## Overview & Documentation
See [`Admin/README.md`](../Admin/README.md) for full architecture specifications, database setup, environment variable configuration, and deployment guides.

### Development Setup
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
```

### Database Schema
See [`Admin/supabase_schema.sql`](../Admin/supabase_schema.sql) for the complete PostgreSQL database migration, Row Level Security (RLS) policies, and Supabase Storage bucket rules.
