# Indom implementation plan

## Requirements
Next.js company website in Arabic and English. Black futuristic design. Recreate supplied INDOM LABS logo as editable SVG in Figma. IN and DOM use independently configurable colors. Letter assembly animation: I appears, shifts and reveals N, followed by D, O, M. Respect reduced motion.
Landing page contains company profile, services, process, values and contact invitation. No individual project content or product imagery appears on the landing page. Projects belong exclusively on Our Projects.
Working slogan: From Innovation to Domination / من الابتكار إلى الريادة.
No invented clients, statistics, awards, testimonials, contact details or product status.

## Checklist
- [x] Verify GitHub, Vercel, Supabase, MagicPath and Figma connections.
- [x] Create plan.md, agent.md, AGENTS.md, skills.md and architecture.md before implementation.
- [x] Reconstruct and export layered SVG in Figma.
- [x] Create Figma letter assembly animation prototype.
- [x] Build and validate motion component in MagicPath.
- [x] Scaffold Next.js with locale routes /en and /ar.
- [x] Build home, about, services, projects and contact pages.
- [x] Verify bilingual text, RTL, mobile layout and reduced motion.
- [x] Create GitHub repository and push milestone commits.
- [ ] Deploy and verify Vercel production.
- [x] Add an accessible mobile menu, current-page indication and explicit desktop/SaaS services.

## Verified resources
GitHub: tranzillofficial
Supabase: Indom Site / nekzjsrheiwcxobgviuj
Vercel team: team_uSWcII9Ft57E10fR8aKDANoc
Figma: Mohamed Nedaa's team
MagicPath: Mohamed Nedaa personal workspace

## Blockers
The user created https://github.com/tranzillofficial/INDOM. Repository access is verified and source code has been pushed to main. Vercel deployment remains blocked by the unavailable deployment tool. Do not mark deployment complete before successful verification.

## Implementation notes
SVG paths were reconstructed from the supplied raster contours, converted to smooth Bézier geometry in Figma and exported. The exact original vector source was not supplied. IN uses steel blue; DOM uses white on black.
Contact currently downloads a local project brief. No inquiry is sent until company contact details and destination are configured.
Vercel deploy_to_vercel still returns Tool not found. GitHub repository creation was resolved by the user. Browser fallback for Vercel requires user approval.
Figma timeline video was generated remotely; its download was blocked by the environment, so a local MP4 is not included.

## Validation milestone
Production build, strict TypeScript and dependency audit passed. Twenty desktop/mobile route checks passed, with no hydration errors or horizontal overflow. Locale switching preserves the page and updates html lang/dir. Reduced motion and brief download passed. Screenshots reviewed.

## GitHub milestone
Repository: https://github.com/tranzillofficial/INDOM
Source commit: d38e0f0c7b023c91d44ca27556b87dc4a335677a
The complete application source, SVG assets, planning files and motion component source were published on main. Desktop/mobile design screenshots remain in the saved deliverable rather than the production repository. Next.js production build passed again after synchronization. Vercel production is still pending.

## Review on 2026-10-02
Existing GitHub source, Figma per-letter motion tracks, MagicPath component and healthy Supabase project were independently rechecked. Vercel lists no INDOM project and deploy_to_vercel still returns Tool not found. Mobile navigation now uses a collapsible bilingual menu with aria-expanded, current-page indication, close-on-navigation and Escape support. Software services explicitly cover desktop apps and SaaS. Production build and strict TypeScript passed. All ten prerendered pages passed language/direction and current-navigation checks; home has no product images or portfolio names, and SVG letter layers are present. New interactive browser checks could not run: this workspace has no Chromium executable and browser downloads returned invalid archives. Previous browser validation predates this navigation change.
