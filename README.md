# Indom Labs
Bilingual Next.js company website. Home contains company information only; portfolio appears exclusively at /en/work and /ar/work; own products appear at /en/products and /ar/products.

## Development
npm ci
npm run dev

## Validation
npm run build
npx tsc --noEmit

## Design
Figma: https://www.figma.com/design/ppYV4XWRhjXlDVLw1m96oD
MagicPath project: 456608419584032768
Reference logo reconstructed from the supplied raster image as per-letter SVG paths, with a Figma vector export in public/indom-logo-dark.svg.

## Contact
The current form downloads a project brief locally. Company contact details and a delivery destination must be supplied before enabling inquiry submission.

## Deployment
Import the repository into Vercel, select Next.js and run npm run build. No environment variables are required for the initial informational site. Supabase project is verified but has no application data flow yet.
