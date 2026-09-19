# Budgie website

A responsive, static landing page for potential Budgie users. The layout follows the supplied Al Rajhi reference screenshots, using Budgie's navy, blue, cyan, mint, and orange palette and existing artwork.

## Edit the website

No build tools or installation are needed. Open `index.html`, or run `python3 -m http.server 8000` in this directory and visit `http://localhost:8000`.

| What to change                                  | Where                                                                                 |
| ----------------------------------------------- | ------------------------------------------------------------------------------------- |
| Headings, paragraphs, team names, links         | `index.html`; search for the visible wording or a section ID below                    |
| Pictures                                        | Replace the matching file in `images/`, or change its `src` and `alt` in `index.html` |
| Brand colors                                    | The named `:root` tokens at the top of `styles.css`                                   |
| Spacing, type, corners, mobile layouts          | `styles.css`                                                                          |
| Carousel, menu, image preview, entrance effects | `site.js`                                                                             |
| App Store destination and optional promo video  | `site-config.js`                                                                      |

Text is real HTML and independent of the imagery. Some **existing** feature poster PNGs have text baked into them; replace those image files to change their artwork. Newly added card headings and descriptions remain editable HTML.

### Page sections

- `home`: centered introduction and four-feature carousel (three visible on desktop).
- `features`: expanding hover/focus cards; all features remain usable on touch.
- `about`: why Budgie was created.
- `how-it-works`: the three setup steps.
- `widgets`: widget overview using the existing feature poster.
- `our-approach`: full original value proposition.
- `app`: iPhone app overview and mockup.
- `how-we-built-it`: original five-stage process plus SwiftUI / Shortcuts implementation overview.
- `research`: the original 114-participant research and four survey findings.
- `team`: all five original team members and roles.
- `explore-more`: complete app/problem copy, design system, category-budget flow, and all 23 app screens in expandable sections. Direct links to `design`, `budget-guide`, or `screens` automatically open their section when JavaScript is enabled.
- `faq`: answers based on the existing product description.

To add a hero feature, copy a `.hero-card` and its corresponding dot, then give both a matching sequential `data-slide` / `data-goto` index. Other feature cards and content can be duplicated directly in HTML.

## Content retained and missing assets

All existing image files are retained unchanged. The complete original page is also retained in `content/original-page.html` for exact text and asset-reference recovery. This is an editing archive, not a linked public navigation page; image references inside it describe the original root-level paths.

The original file referenced `videos/budgie-promo.mp4`, `images/video-cover.png`, and `images/widget-01.png` through `widget-03.png`, none of which exist in the source repository. The public landing page uses the available widget poster and omits the broken video. To enable the video, add the actual media and set `promoVideo` in `site-config.js`; the working video section then appears after the app overview.

The original page had four generic `linkedin.com` homepage links. Those are omitted until real profiles are available; Ruba's existing individual profile is retained. Add verified links beside each team member in `index.html`.

No exact App Store listing URL was present. Set `appStoreUrl` in `site-config.js` to the verified `https://apps.apple.com/...` destination to reveal the download button. The default “Explore Budgie” buttons navigate within the page.

The original 65%+ loan / 1.6% national savings figures are preserved in the original-page archive rather than presented as current statistics without dates or sources. The four product-research figures remain on the page, explicitly described as early product research.

## Motion and accessibility

Each main content section reveals on entry. Cards and images have hover transitions, with keyboard focus alternatives. The carousel never auto-rotates. It supports arrows, dot buttons, and Left/Right keys; previews use a native dialog with Escape dismissal. The header has a mobile menu. OS reduced-motion preferences are respected, with an additional saved motion toggle in the utility bar. Main content remains visible if JavaScript is unavailable.

## Review and publication

This is a plain HTML/CSS/JS GitHub Pages-compatible site. Review the pull request before merging it into `main`. Existing hosting can serve these files directly; no backend, account signup, or analytics service was added.
