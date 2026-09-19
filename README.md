# Budgie website

A static, responsive landing page using Budgie’s existing colors and artwork. No build step is required. Run `python3 -m http.server 8000` to preview locally.

## Homepage order

1. `home`: introduction and feature carousel.
2. `numbers`: early research with 114 participants and the original survey findings.
3. `app`: one iPhone preview with overlapping feature cards.
4. `news`: three product stories, with full text in accessible dialogs.

All other homepage sections have been removed. The original source is retained in `content/original-page.html` as an editing archive. Existing image assets remain available for future edits.

## Editing

| Change                                                | File                                         |
| ----------------------------------------------------- | -------------------------------------------- |
| Homepage copy, story text, images and links           | `index.html`                                 |
| Terms, privacy and cookies copy                       | `terms.html`, `privacy.html`, `cookies.html` |
| Colors, typography, spacing and responsive layouts    | `styles.css`                                 |
| Carousel, dialogs, mobile menu and motion preferences | `site.js`                                    |
| Verified App Store listing URL                        | `site-config.js`                             |

Text is editable HTML. Existing poster images may contain baked-in text; replace their files to edit that artwork. Set `appStoreUrl` to a verified `https://apps.apple.com/...` URL to reveal the download link. No listing URL was available in the original repository.

## Policy scope

The three policy pages cover this website. They do not claim to describe the iPhone app’s data processing. Confirm the app’s actual data flows, service providers and owner/contact details before preparing a separate app policy.

The site adds no analytics or tracking cookies. An explicit motion-toggle choice is saved as `budgie-reduce-motion` in local storage; the Cookies page provides a reset button. Hosting-provider technical logging is described separately, with a link to GitHub’s privacy statement.

## Interaction and accessibility

The carousel supports buttons and arrow keys, with no automatic rotation. Story dialogs support Escape and return focus to the triggering button. Mobile navigation, keyboard focus styles, section entrance effects and hover transitions are included. Device reduced-motion settings are respected, with an optional saved override in the utility bar.

This is a GitHub Pages-compatible HTML/CSS/JS site. Merge the pull request to update the repository’s main branch; publication follows the repository’s hosting configuration.
