# EURO DRIVE — final responsive website

A responsive single-page website for EURO DRIVE, based on the supplied Instagram materials and the brand information provided in the conversation.

## Open locally

Open `index.html` in a browser, or run a local static server from this folder:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Brand and visual system

- The supplied logo image has a checkerboard pattern baked into the pixels (its alpha channel is fully opaque), so it cannot be used as a transparent logo as-is. `assets/euro-drive-logo.svg` is a clean, scalable vector interpretation of the supplied wordmark: white serif lettering, red arrow-style U, red route-pin symbol, and the “UKRAINE – ENGLAND” descriptor.
- The logo is used consistently in the header and footer; the favicon uses the same red route-pin mark.
- Typography pairs Noto Serif for the brand wordmark with Manrope for headings and DM Sans for interface/body copy.
- The visual system uses graphite, warm ivory, white and the brand red, with pill-shaped buttons and softened card corners.

## Included

- Responsive desktop, tablet and mobile layouts.
- Rounded buttons, navigation and service cards.
- Weekly route information: Ukraine → London (Wednesday), London → Ukraine (Sunday).
- Departure cities listed in the supplied posts: Buchach, Ternopil, Ivano-Frankivsk and Lviv.
- Service cards for passenger travel, parcels, vehicle transport and oversized cargo.
- Fleet/comfort section reflecting the published 8-seat, Wi-Fi, charging and climate-control details.
- FAQ accordion and mobile navigation.
- Booking form with required fields and a pre-filled WhatsApp message to **+44 7927 521756**.
- Phone links for all three contacts from the supplied profile.

## WhatsApp form

The form opens `https://wa.me/447927521756` with the visitor's details pre-filled. The visitor reviews the message and taps **Send** in WhatsApp; a website cannot silently send a WhatsApp message on their behalf.

## Photo provenance

The London hero and a separate road/van photograph are standalone generated images. The parcel, vehicle-transport and fleet photographs are adapted from the EURO DRIVE Instagram images supplied in the conversation, cropped to remove Instagram controls and most post text. They were retained to show the actual business context rather than substitute invented vehicle photos. No fabricated customer testimonials or ratings are included.

## Confirm before production

The supplied materials do not state current ticket prices, parcel tariffs, exact pickup/drop-off addresses or times, baggage limits, or legal company details. The site intentionally directs visitors to confirm these with the manager instead of inventing them.

## Deploy

This is a static site with no build step or backend. Upload the contents of this folder to a static host such as Vercel, Netlify or GitHub Pages. Keep the `assets` folder alongside `index.html`.


## Hero video background

- The supplied London video is used as a muted, looping, inline background in the hero section.
- Original upload: 4K / 60 fps / about 19 MB.
- Web-optimized website version: 2560 × 1440, 30 fps, H.264, about 8.3 MB (below the requested 25 MB limit).
- A lightweight WebP poster is included for the initial paint and browsers that do not autoplay video.
- The video pauses when the hero is off-screen, when the tab is hidden, when reduced motion is enabled, or when the browser reports Data Saver.


## Motion and mobile performance (November 2026)

- Restrained scroll reveals for content sections and cards, with a short stagger.
- Small hover/press feedback on buttons, cards, arrows and imagery; no parallax-heavy effects.
- Respects `prefers-reduced-motion` and disables entrance/reveal motion when requested.
- Mobile and tablet use the optimized static hero image/poster instead of downloading the 4K source video.
- Desktop attaches and plays the optimized H.264 hero video only while the hero is visible.
- Mobile navigation has a larger touch target, closes after navigation, and closes on outside click or Escape.
- Form controls use 16px text on mobile to avoid unwanted browser zoom.
- Layout checked at 320, 360, 390, 430, 768, 900, 1024 and 1440px widths: no horizontal overflow in the browser QA pass.
