# PDFMaster

Production-ready PDF tools built with Next.js App Router, TypeScript, Tailwind CSS, ShadCN-style UI, MongoDB metadata, Cloudinary private storage, JWT auth, and animated UX.

## Features
- Merge PDFs with drag-and-drop reordering and upload progress
- Compress PDFs with before/after size comparison
- Convert PDF to Word (.docx) via ConvertAPI
- JWT auth (signup/login/logout) using HttpOnly cookies
- Private file history dashboard with owner-only download links
- 24-hour auto-delete flow (TTL index + cleanup cron route)
- Rate limiting, file validation, toast notifications, dark/light mode, framer-motion transitions
- SEO basics (`metadata`, `robots`, `sitemap`)

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- ShadCN-style reusable UI components
- MongoDB + Mongoose
- Cloudinary (private raw storage)
- JWT via `jose`

## Folder Structure
```text
src/
  app/
    (marketing)/
      page.tsx
      merge/page.tsx
      compress/page.tsx
      pdf-to-word/page.tsx
    (auth)/
      actions.ts
      login/page.tsx
      signup/page.tsx
    dashboard/page.tsx
    api/
      auth/(signup|login|logout)/route.ts
      tools/(merge|compress|pdf-to-word)/route.ts
      files/history/route.ts
      files/[id]/download/route.ts
      cron/cleanup/route.ts
    globals.css
    layout.tsx
    robots.ts
    sitemap.ts
  components/
    auth-form.tsx
    dashboard/file-history.tsx
    layout/*
    tools/*
    ui/*
    upload/dropzone.tsx
  lib/
    auth/*
    db/models/*
    db/mongoose.ts
    pdf/*
    rate-limit/memory.ts
    storage/cloudinary.ts
    utils/*
  types/files.ts
middleware.ts
.env.example
```

## Setup
1. Install dependencies:
```bash
npm install
```

2. Copy env file:
```bash
cp .env.example .env.local
```

3. Fill required values in `.env.local`:
- `JWT_SECRET`
- `MONGODB_URI`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CONVERTAPI_SECRET`
- `CRON_SECRET`

4. Run development server:
```bash
npm run dev
```

5. Open:
- `http://localhost:3000`

## Production Build
```bash
npm run build
npm run start
```

## Notes
- PDF compression uses `pdf-lib` optimization and may vary by input file complexity.
- PDF to Word conversion requires a valid ConvertAPI account key.
- Schedule `GET /api/cron/cleanup` (with `Authorization: Bearer <CRON_SECRET>`) using your platform cron.
