# Architecture
Next.js App Router with /en and /ar route prefixes. A shared bilingual dictionary supplies every visible string. Server-render pages, isolate motion and interactive navigation in client components. SVG uses paths rather than font-dependent lettering.
Routes: home, about, services, projects, contact. Landing page never renders portfolio data. Projects use separate content records and no imagery in the initial scope.
Styling: default ivory light palette and optional deep green dark palette. Shared CSS variables drive text, controls and independent IN/DOM logo colors. A pre-render theme initializer applies a saved preference; a client toggle updates it. The logo intro uses document-lifetime memory, so client route changes do not replay it, while refresh/new documents do. Compact desktop navigation becomes an anchored dropdown on mobile. Responsive layouts and reduced-motion fallback.
No backend changes until a concrete data flow is specified. Contact details must be user-supplied or verified.

Locale layouts own their html lang and dir. The root redirect uses a separate (entry) layout. Localized not-found content follows the current pathname.
