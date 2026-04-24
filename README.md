# amitheredflag.lol

A brutally honest relationship red flag self-assessment quiz. Find out if you're the problem. (You probably are.)

---

## Tech Stack

- Static HTML/CSS/JS, no framework
- Deployed on Netlify
- Fonts: Bebas Neue + DM Mono via Google Fonts
- Form handling: Netlify Forms (badminton sign-up)

---

## File Structure

```
/
├── index.html          # Main page
├── style.css           # All styles
├── app.js              # App logic
├── data.js             # Quiz data, verdicts, therapist links
├── site.webmanifest    # PWA manifest
├── netlify.toml        # Netlify config (headers + redirects)
├── favicon.ico
├── favicon-16x16.png
├── favicon-32x32.png
├── apple-touch-icon.png
├── android-chrome-192x192.png
├── android-chrome-512x512.png
└── og-image.png        # 1200x630px OG image for social sharing
```

---

## Google AdSense Integration

**Publisher ID:** `ca-pub-5571545548884056`

### Global Script (in `<head>` of index.html)

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5571545548884056" crossorigin="anonymous"></script>
```

### Ad Slots

The page has two ad slots. Both use auto ads format with responsive sizing:

**Top slot** (`#adTop`) - appears below the answer box, above the checklist. Loads on page load.

**Mid slot** (`#adMid`) - appears after the result card. Hidden until the user clicks "Get My Diagnosis", then revealed via `classList.remove("hidden")`.

Both slots use this markup pattern:

```html
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-5571545548884056"
     data-ad-slot="auto"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
```

**Note:** Replace `data-ad-slot="auto"` with your actual ad unit slot IDs once you've created them in your AdSense dashboard. AdSense auto ads will also automatically inject additional placements if you enable that feature in the dashboard, which works fine with this layout.

### AdSense Approval Checklist

Before submitting for review:
- [ ] Site has real, original content (it does)
- [ ] Privacy policy page linked in footer (add one)
- [ ] Site is live and publicly accessible
- [ ] `og-image.png` is in place (1200x630px recommended)
- [ ] All favicon files are in place
- [ ] No placeholder or lorem ipsum content

---

## SEO

### Structured Data

Three JSON-LD blocks are in `<head>`:

1. **WebApplication** - describes the site as an app to Google
2. **FAQPage** - targets FAQ rich results for queries like "am i the red flag", "what is a red flag in a relationship"
3. **Speakable** - marks key content sections for voice search (Google Assistant)

### Meta

- Title: `Am I The Red Flag? Take the Quiz 🚩` (53 chars)
- Description: 147 chars, conversational
- Canonical: `https://amitheredflag.lol/`
- Full OG + Twitter Card tags including `og:image` pointing to `https://amitheredflag.lol/og-image.png`

---

## Favicon Generation

Use [realfavicongenerator.net](https://realfavicongenerator.net/) with the 🚩 emoji or a custom red flag icon. Download the package and drop all files in the root. The manifest and HTML tags are already wired up.

OG image (`og-image.png`) should be 1200x630px. Recommended: red background (#E24B4A), white "AM I THE RED FLAG?" in Bebas Neue, 🚩 emoji large. Tools: Figma, Canva, or generate with a script.

---

## Sister Sites Network

The footer "from the same unhinged mind" section links to:

- [isitadrydaytoday.lol](https://isitadrydaytoday.lol)
- [isitabankholidaytoday.lol](https://isitabankholidaytoday.lol)
- [shouldibreakup.lol](https://shouldibreakup.lol)
- [doihavedepression.org](https://doihavedepression.org)

Each sister site should link back to `amitheredflag.lol` in its own footer network section. This creates internal link equity across the network.

---

## Netlify Forms

The badminton sign-up form uses Netlify Forms for zero-backend form handling.

The `form-name: "badminton-signup"` hidden field tells Netlify which form it is. Form submissions appear in the Netlify dashboard under Forms.

To set up email notifications: Netlify dashboard > Forms > badminton-signup > Form notifications > Add email notification.

---

## Deployment

```bash
# Just push to main. Netlify handles the rest.
git add .
git commit -m "deploy"
git push origin main
```

No build step required. Everything is static.

---

## Dark Mode

Full dark mode support via `@media (prefers-color-scheme: dark)` with CSS custom properties. All new elements (sister sites section, share watermark, form selects) are covered.
