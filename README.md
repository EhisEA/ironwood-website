# Ironwood Insights Group: website

A static website (HTML, CSS, JavaScript; no build step) generated from the version 4 design blueprint.
24 pages, matching the page mockups in the PDF from Home onward.

## Run it
- Quick look: open `index.html` in a browser.
- Better (recommended): serve the folder, e.g. `python3 -m http.server 8000` then open http://localhost:8000
- Deploy: upload the folder as-is to any static host (Netlify, Vercel, Cloudflare Pages, S3, or your current host).

## Structure
```
index.html                      Home
ironwood-online.html            Field Services
ironwoodconnect.html
quantitative.html
qualitative.html
strategic-research.html         Research & Insights
product-development.html
branding-communications.html
customer-user-experience.html
data-analytics.html
co-intelligence.html            SI Solution Suite
research-design.html
blog.html  blog-post.html       Knowledge Hub
presentations.html  case-studies.html  white-papers.html  everything-is-connected.html
about.html  locations.html  clients.html  press-releases.html      About
contact.html  opinion-share-panel.html
assets/css/site.css             All styles. Design tokens are at the top (:root).
assets/js/site.js               Grid signals, mega menus, page transitions, scroll reveal, form demo
assets/fonts/                   Geist and Geist Mono (variable)
assets/img/                     Photos, logos, favicon
```

## What is built, as in the design
- Straight-line design system: Geist (Bold headings), teal / copper / clear blue, pastel backgrounds, no rounded corners, no shadows.
- 80px spaced grid behind every header, hero, call-to-action and footer, with blue and orange signals moving along its lines (canvas; paused off-screen; frozen for reduced-motion users).
- Real navigation with the four mega menus (hover, click or keyboard), mobile drawer, utility links.
- Page transitions (straight-edged panel wipe), scroll reveals, button fill and link underline hovers, card hovers. All respect `prefers-reduced-motion`.
- Responsive: desktop, tablet, mobile. Content is capped at 1280px and centered on wide screens.

## Needs your input before launch
1. **Links still pointing to `#`** (marked `data-todo`): Employment, Client Project Portal, Opinion Share register / log in / FAQs / privacy / terms, CCPA Consumer Form, CCPA Notice, Privacy Policy, LinkedIn, Facebook, all "Download", "Download PDF", "Read PDF", "More" (press-release detail), "Download the report", "Download speaker packet", "Apply online". Find them with: `grep -rn 'data-todo' *.html`
2. **Forms:** the contact form validates required fields and shows a demo message only. Connect it to your form handler. The reCAPTCHA box is a visual placeholder; add your Google reCAPTCHA keys. The "How did you hear about us?" options are placeholders; confirm the list.
3. **Photos:** hero and section photos reuse your 8 location photos and 11 team portraits (black and white, cropped from screenshots, low resolution) as stand-ins, so some repeat. Replace with page-specific photography (see the Imagery board in the PDF for briefs). Swap files in `assets/img/` or edit the `<img src>` in each page. Confirm the team photo-to-name matching.
4. **Team "Full bio" links** open the live site's About page in a new tab.
5. **Content to verify:** all figures, client names, titles and quotes come from the existing site; the Co-Intelligence page uses "SI" and "superintelligence" wording and "ProbeSI" per direction (existing publication, talk and award titles keep "AI").
6. **Logo:** the supplied SVG is used in white, teal and black (`assets/img/logo-*.svg`). Add a proper favicon set.
7. **Not yet added:** analytics, cookie banner / CCPA controls, sitemap.xml, per-page social images, a CMS for the blog.

## Notes
- Fonts are free (Geist, Geist Mono); please verify license terms for production.
- `assets/css/site.css` is plain CSS. Colors: `--teal`, `--copper`, `--action` (buttons/links), `--dusk` (SI sections), `--p-blue`, `--cloud`.
