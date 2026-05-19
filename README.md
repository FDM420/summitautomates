# Summit AI Automation Services

Enterprise AI Automation • Workflow Engineering • Intelligent Business Systems

This repository contains the Summit AI Automation Services marketing site built as an enterprise AI command center experience. The site is positioned around operational automation infrastructure rather than generic agency messaging.

## Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- Three.js with React Three Fiber

## Experience Direction

- Dark enterprise visual system with gradients, glow, and glass panels
- Motion-led sections for workflow pipelines and dashboard reveals
- 3D network visualization in the hero area
- Systems catalog focused on automation, recruitment, communication, operations, and industrial AI
- Dedicated SEO landing pages for the five main service areas with plain-language copy and interactive workflow visuals
- Public architecture section covering frontend, backend, AI stack, and infrastructure

## Project Structure

- `src/app/layout.tsx` sets metadata, fonts, and the global shell.
- `src/app/page.tsx` loads the landing page.
- `src/app/services/page.tsx` renders the service directory for the five SEO landing pages.
- `src/app/services/[slug]/page.tsx` renders static service pages with route-specific metadata and JSON-LD.
- `src/components/command-center-page.tsx` contains the main marketing experience.
- `src/components/service-page-entry.tsx` and `src/components/service-landing-client.tsx` render the interactive dedicated service pages.
- `src/lib/service-pages.ts` stores the content model for the service directory and each service route.
- `src/components/network-canvas.tsx` renders the 3D network scene.
- `src/app/globals.css` defines the visual theme, gradients, panels, and utility styles.

## Scripts

- `npm run dev` starts the local development server.
- `npm run build` creates the production build.
- `npm run start` serves the production build.
- `npm run lint` runs ESLint.

## Optional Environment Configuration

- `NEXT_PUBLIC_SITE_URL` sets the canonical site URL used in metadata, sitemap, and robots output.
- `NEXT_PUBLIC_CONTACT_EMAIL` sets the public contact email used by the discovery form and direct email CTA.
- `NEXT_PUBLIC_CRM_FORM_URL` points the main CTA to a live external CRM or intake form.
- `NEXT_PUBLIC_CRM_FORM_EMBED_URL` optionally embeds the live CRM form directly inside the contact section.
- `NEXT_PUBLIC_CALENDAR_URL` points the discovery CTA to a live booking page. If both form and calendar are set, the form becomes primary and the calendar stays available as a secondary action.

## Validation

The project has been validated with a successful production build using `npm run build`.
