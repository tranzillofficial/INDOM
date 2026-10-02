# Architecture
Next.js App Router with /en and /ar route prefixes. A shared bilingual dictionary supplies every visible string. Server-render pages, isolate motion and interactive navigation in client components. SVG uses paths rather than font-dependent lettering.
Routes: home, about, services, projects, contact. Landing page never renders portfolio data. Projects use separate content records and no imagery in the initial scope.
Styling: black canvas, muted gray surfaces, high-contrast type, independently configurable IN/DOM brand tokens. Responsive layouts and reduced-motion fallback.
No backend changes until a concrete data flow is specified. Contact details must be user-supplied or verified.

Locale layouts own their html lang and dir. The root redirect uses a separate (entry) layout. Localized not-found content follows the current pathname.
