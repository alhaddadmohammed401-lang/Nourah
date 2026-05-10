---
name: Nourah
description: Bilingual, halal-aware, GCC-calibrated AI skincare app. Soft, beauty-forward, never clinical.
colors:
  brand-rose: "#E8637A"
  deep-mauve: "#2D1B2E"
  soft-blush: "#F9E8E8"
  dusty-pink: "#D4A0A7"
  soft-lavender: "#F0E6F6"
  gold: "#C9A84C"
  success: "#7BA892"
  warning: "#D9A76A"
  error: "#C74A60"
  charcoal: "#2D2D2D"
  dark-gray: "#5A5A5A"
  light-gray: "#E0E0E0"
  white: "#FFFFFF"
  scan-black: "#0D0D0D"
  score-green: "#7DB87A"
  score-amber: "#E8A838"
  score-red: "#E07070"
typography:
  display:
    fontFamily: "DMSerifDisplay-Regular, 'DM Serif Display', Georgia, serif"
    fontSize: "40px"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "DMSerifDisplay-Regular, 'DM Serif Display', Georgia, serif"
    fontSize: "32px"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "-0.005em"
  title:
    fontFamily: "DMSerifDisplay-Regular, 'DM Serif Display', Georgia, serif"
    fontSize: "24px"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "normal"
  body-large:
    fontFamily: "DMSans-Regular, 'DM Sans', system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "normal"
  body:
    fontFamily: "DMSans-Regular, 'DM Sans', system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "DMSans-Medium, 'DM Sans', system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.01em"
  caption:
    fontFamily: "DMSans-Regular, 'DM Sans', system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.02em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  sheet: "24px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  xxl: "32px"
  screen: "20px"
components:
  button-primary:
    backgroundColor: "{colors.brand-rose}"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "16px 24px"
    height: "52px"
    typography: "{typography.body-large}"
  button-primary-pressed:
    backgroundColor: "{colors.dusty-pink}"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
  button-secondary:
    backgroundColor: "{colors.soft-blush}"
    textColor: "{colors.deep-mauve}"
    rounded: "{rounded.md}"
    padding: "16px 24px"
    height: "52px"
    typography: "{typography.body-large}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.deep-mauve}"
    rounded: "{rounded.md}"
    padding: "16px 24px"
    height: "52px"
    typography: "{typography.body-large}"
  card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.deep-mauve}"
    rounded: "{rounded.lg}"
    padding: "16px"
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.deep-mauve}"
    rounded: "{rounded.md}"
    padding: "14px 16px"
    height: "52px"
    typography: "{typography.body-large}"
  chip-unselected:
    backgroundColor: "{colors.soft-lavender}"
    textColor: "{colors.deep-mauve}"
    rounded: "{rounded.full}"
    padding: "8px 14px"
    typography: "{typography.label}"
  chip-selected:
    backgroundColor: "{colors.dusty-pink}"
    textColor: "{colors.white}"
    rounded: "{rounded.full}"
    padding: "8px 14px"
    typography: "{typography.label}"
  halal-badge:
    backgroundColor: "{colors.success}"
    textColor: "{colors.white}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
    typography: "{typography.caption}"
  score-card-good:
    backgroundColor: "{colors.score-green}"
    textColor: "{colors.white}"
    rounded: "{rounded.lg}"
    padding: "20px"
---

# Design System: Nourah

## 1. Overview

**Creative North Star: "The Soft Brief"**

Nourah is the knowledgeable friend who happens to be a dermatologist's daughter. The visual system carries that voice in soft surfaces, generous spacing, and a rose-and-mauve identity that reads as beauty-and-wellness, never as a clinic and never as a SaaS tool. The reference lane is Flo crossed with the Glossier app: friendly, accessible-feminine, mass-market warm, with quiet expertise sitting underneath every screen.

Density is deliberately low. Type breathes. Cards are pillowy on result and scoring surfaces (where the user needs to feel reassured before she is instructed) and tighter on auth and form surfaces (where she needs to move quickly). Arabic and English are equal first-class citizens, neither is a fallback. Tajawal carries the same hierarchy as DM Sans.

This system explicitly rejects: generic SaaS-dashboard aesthetics (flat blue-and-gray, dense KPI grids, hero-metric templates, side-stripe alert borders); clinical or pharmacy styling (sterile white-and-teal, stock medical iconography, warning-heavy red flags); Sephora-style commerce density (sale stickers, neon banners, fighting product tiles); and Gen-Z neon beauty (hot pink on black, gradient text, glassmorphism).

**Key Characteristics:**
- Rose-and-mauve as identity, lavender as gentle counterweight, blush as a quiet ground.
- Pillowy on results and scoring, tighter on forms and auth (the Mix Rule).
- A single dark surface (the face-scan camera) in an otherwise light app.
- Soft, low-opacity shadows. Nothing sharp, nothing harsh.
- Serif headings + humanist sans body. Tajawal at full hierarchy in Arabic.
- Score colors and halal status always paired with iconography and a label.

## 2. Colors: The Bilingual Vanity Palette

A warm, feminine, low-saturation palette anchored on rose and mauve, with three poetic hero hues and a plain-descriptive supporting cast. Functional colors stay muted to avoid the clinical-warning aesthetic.

### Primary
- **Blush at Dawn** (`#E8637A`): The brand rose. Primary calls to action, active tab icon, focus borders, primary scoring accents. The single most identifying color in the system.
- **Mauve Evening** (`#2D1B2E`): All headings and primary text. Warm enough to never read as sterile black, dark enough to anchor every surface.

### Secondary
- **First Light Blush** (`#F9E8E8`): Default screen background and secondary-button fill. The ground the system sits on.
- **Dusty Pink** (`#D4A0A7`): Pressed states for primary buttons, selected chip fill, secondary accents.
- **Soft Lavender** (`#F0E6F6`): Feature highlights, unselected chips, progress backdrops, gentle counterweight to the rose family.

### Tertiary
- **Gold** (`#C9A84C`): Premium and subscription affordances only. Never decoration.

### Functional
- **Sage Success** (`#7BA892`): Halal-friendly badge, positive confirmations.
- **Amber Warning** (`#D9A76A`): Caution indicators, non-blocking notices.
- **Garnet Error** (`#C74A60`): Error messages, blocking states.
- **Score Green** (`#7DB87A`): Scan score 70–100. Always paired with the number and a label.
- **Score Amber** (`#E8A838`): Scan score 40–70. Paired.
- **Score Red** (`#E07070`): Scan score 0–40. Paired and softened by reassuring copy.
- **Scan Black** (`#0D0D0D`): The face-scan camera surface. Nowhere else.

### Neutral
- **Charcoal** (`#2D2D2D`): Body text on light surfaces.
- **Slate Gray** (`#5A5A5A`): Secondary text, captions, inactive tab labels.
- **Mist Gray** (`#E0E0E0`): Borders, dividers, low-emphasis strokes.
- **White** (`#FFFFFF`): Cards, modals, input fills.

### Named Rules

**The Premium-Gold Rule.** Gold appears only on premium badges, subscription affordances, and paywall surfaces. Never as decoration, never on free-tier UI.

**The Scan-Black Rule.** `#0D0D0D` appears only on the face-scan camera surface. The rest of the app is light. There is no dark mode.

**The Score-Triplet Rule.** Score colors (green, amber, red) are never the sole signal. Always paired with the score number, a label, and an icon glyph.

**The One-Voice Rule.** Brand Rose carries CTAs and active states. It does not also carry decoration, illustration accents, or background gradients. Its rarity is the point.

## 3. Typography

**Display Font:** DM Serif Display (with Georgia fallback)
**Body Font:** DM Sans (with system-ui fallback)
**Arabic Font:** Tajawal (Regular and Medium)

**Character:** A warm serif at the top of every screen, a humanist sans for everything you read or tap, and a clean Arabic geometric that mirrors the warmth of the Latin pairing. The serif gives the app its editorial, beauty-magazine register; the sans keeps it modern and tappable; Tajawal carries both qualities into Arabic without compromise.

### Hierarchy
- **Display** (DM Serif Display, 400, 40px, line-height 1.1): Onboarding hero copy and scan-result headlines only.
- **Headline** (DM Serif Display, 400, 32px, line-height 1.15): Score numbers and big-display moments.
- **Title** (DM Serif Display, 400, 24px, line-height 1.25): Screen titles.
- **Body Large** (DM Sans, 400, 17px, line-height 1.45): Section headers, button labels.
- **Body** (DM Sans, 400, 15px, line-height 1.5): Default reading text. Cap line length around 60–70 characters.
- **Label** (DM Sans Medium, 500, 13px, letter-spacing 0.01em): Secondary labels, captions, chip text.
- **Caption** (DM Sans, 400, 11px, letter-spacing 0.02em): Timestamps, fine print, badge text.

### Named Rules

**The Bilingual-Parity Rule.** Arabic and English receive equal hierarchy at every level. Tajawal Regular maps to DM Sans Regular, Tajawal Medium maps to DM Sans Medium. Heading sizes hold; line-height bumps by ~10% in Arabic to give Tajawal's taller glyphs room to breathe. Never down-tier Arabic to a fallback role.

**The Serif-Heading Rule.** DM Serif Display is reserved for screen titles, score numbers, and hero copy. Never used for body, buttons, labels, or chips. Keep its appearance rare so it stays special.

## 4. Elevation

Flat by default. The system uses one soft shadow vocabulary at low opacity, applied to floating surfaces (cards, bottom sheets, modals, the active bottom-tab indicator on lift). Depth is mostly conveyed through tinted backgrounds (Blush ground vs. White card) rather than shadows. There is no dark mode and no tonal-elevation ramp.

### Shadow Vocabulary
- **Card Lift** (`box-shadow: 0 2px 12px rgba(26, 26, 26, 0.06)`): Standard card and bottom-sheet shadow. The default lift.
- **Modal Lift** (`box-shadow: 0 8px 32px rgba(26, 26, 26, 0.10)`): Reserved for full modals and the paywall surface. The maximum allowed shadow weight.

### Named Rules

**The Soft-Only Rule.** Shadow opacity never exceeds 0.10. Shadow blur never goes under 8px. Anything sharper reads as generic-medical or AI-template.

**The Flat-Ground Rule.** Screen backgrounds (Blush, White) carry no shadow. Only floating surfaces lift.

## 5. Components

### Buttons
- **Shape:** Rounded 12px (`{rounded.md}`). Minimum height 52px. Full-width by default on primary actions, content-width on inline secondary or ghost.
- **Primary:** Brand Rose fill, White text, Body Large weight. Padding 16px / 24px. Pressed state shifts fill to Dusty Pink (`#D4A0A7`) with a 120ms ease-out fade.
- **Secondary:** First Light Blush fill, Mauve Evening text. Same shape, used for secondary CTAs and quiet confirmations.
- **Ghost:** Transparent fill, Mauve Evening text, no border at rest. Pressed state adds a Soft Lavender fill at 60% opacity.
- **Disabled:** Mist Gray fill, Slate Gray text, no press response.

### Score Cards (signature component)
The reassurance-first surface. A pillowy card with the score number set in DM Serif Display 32px (Headline), a one-line plain-language label below in Body Large, and GCC climate flag chips along the bottom. The card background reflects the score band (Score Green / Amber / Red) but text is always paired with an icon and label. Padding 20px, rounded 16px, soft Card Lift shadow.

The opening line of every score card is reassuring. The action list comes after.

### Cards / Containers
- **Corner Style:** Rounded 16px (`{rounded.lg}`).
- **Background:** White by default. Scoring contexts use the Score Green/Amber/Red token. Premium contexts use White with a Gold border accent at 1px.
- **Shadow Strategy:** Card Lift only. Never Modal Lift on a non-modal surface.
- **Border:** None by default. Mist Gray 1px when a divider role is needed.
- **Internal Padding:** 16px standard. 20px on Score Cards. Never nest cards inside cards.

### Inputs / Fields
- **Style:** White fill, Mist Gray 1px border, rounded 12px, 52px tall. Body Large text in Mauve Evening.
- **Focus:** Border shifts to Brand Rose (`#E8637A`) at 1.5px. No glow, no halo.
- **Error:** Border shifts to Garnet Error (`#C74A60`); error message in 13px Label below the field.
- **Disabled:** Light Gray fill, Slate Gray text.

### Chips
- **Style:** Rounded full, Body Label text, padding 8px / 14px.
- **Unselected:** Soft Lavender fill, Mauve Evening text. Used in skin-concern picker, filter contexts.
- **Selected:** Dusty Pink fill, White text. Pressed state adds a 95% opacity flash for 120ms.

### Halal Badge
- Pill, Sage Success fill, White text, 11px Caption, 4px / 10px padding. Always paired with a small leaf or check glyph at 12px. Sits on the top-right corner of an ingredient-result card. Never appears without an icon.

### Bottom Sheet
- 24px top corners (`{rounded.sheet}`). White surface. Card Lift shadow on the top edge. Drag handle (4px tall, 36px wide, Mist Gray) centered above content. Content padding 20px / screen-padding (20px).

### Bottom Tab Navigation
- 4 tabs only: Home, Scan, Products, Profile.
- Active tab: Brand Rose icon and label, Body Label weight.
- Inactive tab: Slate Gray icon and label.
- No icon-only tabs. Labels always present in both English and Arabic.
- The Scan tab is visually first-among-equals: 8% larger icon than the others, no other special treatment.

## 6. Do's and Don'ts

### Do:
- **Do** use DM Serif Display only for screen titles, score numbers, and hero copy. Body and labels are always DM Sans (or Tajawal in Arabic).
- **Do** pair every score color with the score number, a plain-language label, and an icon glyph. Color alone never carries score state.
- **Do** confine Scan Black (`#0D0D0D`) to the face-scan camera surface. The rest of the app is light, full stop.
- **Do** use 16px (`rounded-2xl`) on cards, 12px (`rounded-xl`) on buttons and inputs, and rounded-full on chips and badges.
- **Do** tint shadows with warm gray at low opacity: `rgba(26, 26, 26, 0.06)` for Card Lift, `rgba(26, 26, 26, 0.10)` ceiling for Modal Lift.
- **Do** give Tajawal equal hierarchy at every level. Bump Arabic line-height ~10% to let Tajawal's glyphs breathe.
- **Do** lead reassurance copy before prescription copy on every result surface. Score, then plain-language explanation, then action list.
- **Do** restrict Gold (`#C9A84C`) to premium badges, subscription affordances, and the paywall.

### Don't:
- **Don't** use generic SaaS-dashboard patterns: dense KPI grids, hero-metric templates, side-stripe colored borders, flat blue-and-gray admin aesthetics.
- **Don't** use clinical or pharmacy styling: sterile white-and-teal medical look, stock medical iconography, warning-heavy red-flag visuals.
- **Don't** use Sephora-style commerce density: bold sale stickers, neon promotional banners, dense product grids fighting for attention.
- **Don't** use Gen-Z neon beauty: hot pink on black, gradient text, glassmorphism, filtered-influencer aesthetics.
- **Don't** use raw `#000` or `#fff`. Use Charcoal (`#2D2D2D`), Mauve Evening (`#2D1B2E`), or the White token.
- **Don't** down-tier Arabic. Tajawal hierarchy must equal DM Sans hierarchy in every screen, with line-height tuned for the script.
- **Don't** apply shadows with opacity above 0.10 or blur under 8px. Sharp shadows are forbidden.
- **Don't** put Gold anywhere except premium badges and subscription affordances. Decoration with Gold is forbidden.
- **Don't** nest cards. A card inside a card is always wrong here.
- **Don't** use `border-left` or `border-right` greater than 1px as a colored accent on cards, list items, callouts, or alerts. Forbidden across the system.
- **Don't** introduce a dark mode. The Scan Black surface is the only dark surface.
