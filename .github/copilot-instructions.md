# Maria Luiza's 4th Birthday - Event Management System

## Project Overview

A focused event management system for Maria Luiza's 4th birthday party (Aug 30, 2025, 10:00-14:00). The system prioritizes simplicity and quick deployment, with core RSVP functionality needed within 3 days.

## Quick Start

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Visit: http://localhost:3000

## Core Features

1. ✨ Unique 6-digit invitation codes
2. 📝 RSVP form system
3. 🎮 Admin dashboard
4. 🎁 Gift registry
5. ⏰ Event countdown (Aug 30, 2025, 10:00-14:00)
6. 📸 Private photo gallery
7. 📊 Post-event survey

## Tech Stack & Architecture

| Layer       | Technology | Notes |
|------------|------------|-------|
| Framework   | Nuxt 4.0.1 | Using latest features, SSR-enabled |
| UI Library  | @nuxt/ui   | Theme: violet, cool grays |
| Database    | PostgreSQL + Prisma | Schema in `prisma/schema.prisma` |
| Deployment  | Vercel     | Auto-deploys from main branch |

## Project Structure

```files
/
├─ app/generated/prisma/  # Prisma client output
├─ prisma/               # Database schema & migrations
├─ server/api/          # REST endpoints
├─ components/          # Vue components
└─ pages/              # Nuxt routes
```

## Development Guidelines

### 1. Vue / Nuxt

- **Always** `<script setup lang="ts>` + Composition API
- Use `useFetch` / `useAsyncData` for HTTP + suspense
- Global reactive state ➜ `useState()`; introduce **Pinia** *only* after written approval

### 2. API Routes

- REST endpoints in `server/api/**/*.ts`
- Interface: **pure REST** (no GraphQL):
  - `POST /api/guests`     → create (RSVP)
  - `GET  /api/guests`     → list (admin)
  - `PUT  /api/guests/:id` → update status
  - `GET  /api/guest-code/:code` → lookup by invite code
- Use **Zod** for validation
- Proper error handling with RFC 7807

### 3. Database Guidelines

- Migrations: `pnpm dlx prisma migrate dev --name <desc>` (one per PR)
- Seeding: `pnpm dlx prisma db seed` to create dummy guests
- Schema: Maintained in `prisma/schema.prisma`

### 4. Styling

- Use PrimeVue components (`<Button>`, `<DataTable>`, `<Dialog>`)
- PrimeFlex for layouts (`p-col-12`, `p-md-6`, etc.)
- Mobile-first design approach
- Theme via CSS variables
- Minimal custom styles

### 5. Logging & Error Handling

- No `console.log` in production code
- Use `useLogger()` composable
- Map to Sentry in production

### 6. Code Quality

- ESLint extends `@nuxt/eslint-config-typescript`
- Prettier for consistent formatting

## Security & Privacy

- Invite-code gate on `/tips`, `/gifts`, `/photos`
- Admin dashboard: Vercel Password Protection
- LGPD compliance with photo consent
- No indexing (`robots.txt`)

## Git Workflow

- Main branch → production
- Feature branches: `feat/<concise-slug>`
- Conventional Commits only
- Squash-merge PRs

## Dev Container Setup

```jsonc
{
  "image": "mcr.microsoft.com/devcontainers/typescript-node:1-22-bookworm",
  "dockerComposeFile": "docker-compose.yml",
  "service": "app",
  "runServices": ["db"],
  "remoteEnv": {
    "DATABASE_URL": "postgresql://postgres:postgres@db:5432/party"
  },
  "postCreateCommand": "pnpm install && pnpm dlx prisma generate",
  "forwardPorts": ["3000"],
  "remoteUser": "node"
}
```

## Languages & Tone

| Context                           | Language               |
| --------------------------------- | ---------------------- |
| **Code, comments, docs, commits** | **English**            |
| **UI/UX strings**                 | **Português (Brasil)** |
| **Assistant replies**             | Professional & concise |

## Documentation, TODO's, Tasks and plans

- **Comments**: Use comments to explain complex logic or decisions in the code. Avoid commenting on obvious code.
- **Documentation**: Keep the `README.md` and `tasks/` directory updated with any new features or architectural changes. Every time you finish some work update it in checklist file. If your action is not there, add it there and check it.
- **Task Tracking**: Use the `tasks/` directory to track ongoing work, document tasks, and outline implementation plans. Each task should have a clear description and checklist for completion.
- **Implementation Plans**: For complex features, create an `implementation-plan.md` in the `tasks/` directory to outline the steps and considerations for implementation.
- **Checklist**: Use `checklist.md` in the `tasks/` directory to track progress on complex features. This should include steps like updating the store, router, components, and tests.
- **Recent Edits**: Always check the recent edits in the codebase to avoid suggesting changes to files that have been recently modified. This helps prevent conflicts and ensures that the latest logic is respected.

### 🔑 Remember

*This document overrides any contradictory suggestion an AI model might come up with.* Always cross-check your output against these rules before returning an answer.
