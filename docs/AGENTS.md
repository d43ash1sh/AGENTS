# AGENTS.md

## Project
RoomNearRGU

## Vision
Become the default accommodation platform for students around Rajiv Gandhi University.

## Current Phase
Phase 1 — MVP Foundation

## Current Goal
Build the fastest path from:

Student needs room
→ finds room
→ contacts owner
→ moves in

## Tech Stack
- Next.js
- TypeScript
- TailwindCSS
- ShadCN UI
- Supabase
- PostgreSQL
- OpenStreetMap
- Leaflet
- Vercel

## Development Philosophy

Plan → Build → Verify

Always:

1. Understand requirements.
2. Create implementation plan.
3. Implement only one feature.
4. Test feature.
5. Move to next feature.

## MVP Features

- Authentication
- Room Listings
- Search & Filters
- Distance From RGU
- Map View
- Availability Status
- Contact Owner
- Photo Upload
- Admin Dashboard

## Not In MVP

- Payments
- Booking
- Reviews
- AI Matching
- Chat

## Rules

- No `any` types.
- No direct database calls in UI.
- Use service layer.
- Mobile-first.
- Test every feature before moving forward.

## Anti Patterns

- Do not delete files without confirmation.
- Do not modify schemas without migration.
- Do not add features outside roadmap.