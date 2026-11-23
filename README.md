# dray-energy
Official website for D'Ray Energy Ltd, Diesel supply company in Abuja, Nigeria.

Single page static site for GitHub Pages. No build step.

## Structure
- `index.html`: the whole site (sections: hero, trust, about, services, why, who, process, testimonials (hidden), contact, footer)
- `css/styles.css`, `js/main.js`: styles and behaviour (no frameworks)
- `services.html`, `contact.html`, `resources.html`, `more.html`, `link.html`: redirect stubs to the matching section of `index.html`
- `IMAGES/`: originals plus optimised WebP/JPEG copies. Regenerate with `python3 tools/optimize_images.py` (needs Pillow)
- `sitemap.xml`, `robots.txt`: SEO files

## Adding the two tank photos
Upload these exact filenames to `IMAGES/` (GitHub > IMAGES > Add file > Upload files):
- `IMAGES/ibc-tank.jpeg` (IBC tote tank): in `index.html`, About section, follow the comment above the `<picture>` to swap the photo.
- `IMAGES/storage-tanks.jpeg` (grey storage tanks): in `index.html`, Who We Serve section, uncomment the `<img>` line in the "Storage tanks slot" comment.

Until the files exist they are not referenced, so nothing is broken.

## Turning on testimonials and portfolio
Both are built but hidden. In `index.html`, remove the `hidden` attribute from `#testimonials` (add real quotes with permission) or from `#portfolio` (add `<figure>` items).

## Draft copy pending owner approval
- About paragraph: "D'Ray Energy Ltd supplies diesel to businesses and residential estates across Abuja, from scheduled bulk deliveries to urgent top-ups when the power is out."
- About tagline line: "Diesel supply that keeps your operations running."
- Three values: Dependable ("We show up when we say we will."), Transparent ("A clear price and delivery time before we dispatch."), Responsive ("Call us any time for urgent supply.")
- Hero subtext, Why D'Ray one-line descriptions, "Storage and supply you can plan around." (tanks slot), "Request a quote, message us on WhatsApp or call. We will get back to you quickly."

## Notes
- Canonical URL `https://ikennaemejuru1-hash.github.io/dray-energy/` is an assumption (default GitHub Pages address). Update it in `index.html` (canonical, og:url, og:image, JSON-LD), `sitemap.xml` and `robots.txt` if a custom domain is used.
- The logo file has a baked-in black background, so it is only used on the dark footer. A transparent PNG or SVG logo would allow use on light areas.
- Contact form posts to Formspree (`xqpklole`).
