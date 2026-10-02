# Architecture
Next.js App Router, bilingual /ar and /en, RTL Arabic. Self-hosted Tajawal and Manrope fonts. Light theme defaults; indom-theme stores the visitor preference.

Routes: home, about, services, products (own products), work (client portfolio), contact, privacy, terms, storage. Legacy projects redirects to products; legacy aion redirects home with the welcome assistant open. No product images appear on the landing page. No published client case studies or verified product URLs have been supplied.

WelcomeChat is a text-only, user-opened dialog with keyboard focus containment, Escape, quick questions, clear conversation and allowlisted page links. No avatar, 3D, voice SDK, automatic popup or microphone access. Memory is in-page only.

POST /api/chat uses AI SDK 6 with Vercel AI Gateway and google/gemini-2.5-flash-lite, verified in the live model catalog on October 2, 2026. Vercel OIDC supplies deployed authentication; no client secrets. Short bounded replies, eight-message maximum, request validation, timeout and per-instance rate limiting. Rate limiting is not distributed across instances. JSON routes from the model are validated against the site sitemap. Provider failure returns an explicit unavailable message with useful navigation links. No tools perform external actions. Production gateway access must be verified before claiming live AI availability.

Brief downloads a local text file only; it does not submit leads. No analytics, advertising trackers, application chat database or payment functionality. Hosting/model providers may keep operational logs. The privacy policy describes these limits. A dedicated privacy contact and case studies remain publication inputs, not invented content.
