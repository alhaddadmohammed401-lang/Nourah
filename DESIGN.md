# Design System Inspired by Nourah

## 1. Visual Theme & Atmosphere

Nourah embodies a contemporary luxury aesthetic rooted in the sophistication of the Gulf region, blending minimalist restraint with warm, inviting femininity. The design system celebrates subtle complexity—soft, muted color palettes punctuated by moments of richness, paired with considered typography and generous whitespace. The overall mood is calming yet professional, creating a sanctuary for skincare discovery that feels both scientifically trustworthy and personally indulgent. The design respects cultural values through thoughtful use of Arabic typography and acknowledges the unique climate and skincare concerns of GCC users, expressing this not through novelty but through refined, understated elegance.

**Key Characteristics**

- Soft, warm color palette dominated by blush, rose, and mauve tones with gold accents
- Minimal visual language prioritizing clarity and purposeful spacing
- Luxurious typography pairing serif headings with humanist sans-serif body text
- Native support for Arabic language hierarchy with Tajawal
- Serene, uncluttered layouts that emphasize progress and discovery
- Science-backed visual language with clean data visualization
- Emphasis on skin-centric imagery framed within generous whitespace
- Accessibility-first approach with sufficient contrast and readable hierarchy

## 2. Color Palette & Roles

### Primary

- **Brand Rose** (`#E8637A`): Primary call-to-action buttons, active states, and core brand expression. Used sparingly to maintain impact and luxury positioning.
- **Deep Mauve** (`#2D1B2E`): Primary text color for headings and dense content areas. Provides depth while maintaining the warm, sophisticated tone.

### Accent Colors

- **Soft Blush** (`#F9E8E8`): Secondary background for cards, dividers, and subtle highlights. Creates a gentle, enveloping atmosphere.
- **Dusty Pink** (`#D4A0A7`): Interactive overlays, hover states on secondary buttons, and visual feedback elements.
- **Soft Lavender** (`#F0E6F6`): Tertiary background for feature highlights, progress indicators, and success states.
- **Gold** (`#C9A84C`): Premium accents, premium badges, luxury indicators, and special feature callouts.

### Interactive

- **Interactive Primary** (`#E8637A`): Button backgrounds, active links, focus states.
- **Interactive Hover** (`#D4547A`): Darker rose for button hover states and interactive feedback.
- **Interactive Disabled** (`#E8C8CF`): Reduced opacity interactive elements and disabled button states.
- **Success State** (`#7BA892`): Confirmation messages, completed scans, routine achievements.
- **Warning State** (`#D9A76A`): Caution indicators, product warnings, incomplete profile alerts.
- **Error State** (`#C74A60`): Error messages, critical alerts, failed scan attempts.

### Neutral Scale

- **Charcoal** (`#2D2D2D`): Primary text, body copy, dense information.
- **Dark Gray** (`#5A5A5A`): Secondary text, metadata, timestamps, helper text.
- **Medium Gray** (`#9B9B9B`): Disabled text, tertiary labels, subtle annotations.
- **Light Gray** (`#E0E0E0`): Dividers, borders, input field edges.
- **Off-White** (`#FAFAFA`): Default background, card surfaces in light contexts.
- **Pure White** (`#FFFFFF`): Primary background, elevated surfaces, text backgrounds.

### Surface & Borders

- **Card Surface** (`#FAFAFA`): Default container background with soft separation from page background.
- **Elevated Surface** (`#FFFFFF`): Highest elevation surfaces with full white background.
- **Border Subtle** (`#E8E8E8`): Soft borders between sections and card edges.
- **Border Prominent** (`#D4A0A7`): Accent borders for featured cards or important boundaries.

## 3. Typography Rules

### Font Family

**Primary Headings:** DM Serif Display (`font-family: 'DM Serif Display', Georgia, serif;`) with fallback to Georgia for serif elegance and prestige.

**Body & UI:** DM Sans (`font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;`) with system font fallbacks for consistent humanist warmth.

**Arabic Text:** Tajawal (`font-family: 'Tajawal', 'DM Sans', sans-serif;`) prioritized for all Arabic language content to ensure authentic, readable typography that respects Arabic letterforms.

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|-----------------|-------|
| Display (Large) | DM Serif Display | 48px | 400 | 1.2 | -0.5px | Hero titles, major section breaks |
| Display (Medium) | DM Serif Display | 36px | 400 | 1.3 | -0.3px | Page titles, large headings |
| Heading 1 | DM Serif Display | 32px | 400 | 1.4 | -0.2px | Primary section headings |
| Heading 2 | DM Serif Display | 28px | 400 | 1.4 | 0px | Secondary section titles |
| Heading 3 | DM Sans | 20px | 600 | 1.5 | 0px | Tertiary headings, card titles |
| Heading 4 | DM Sans | 18px | 600 | 1.5 | 0.25px | Subsection titles, labels |
| Body Large | DM Sans | 16px | 400 | 1.6 | 0.25px | Primary body text, detailed descriptions |
| Body | DM Sans | 15px | 400 | 1.6 | 0.25px | Standard body copy, routine descriptions |
| Body Small | DM Sans | 14px | 400 | 1.5 | 0.25px | Secondary text, helper text, tags |
| Button | DM Sans | 16px | 600 | 1.5 | 0.5px | All button labels |
| Caption | DM Sans | 12px | 400 | 1.4 | 0.3px | Timestamps, metadata, footnotes |
| Code | Monaco, Courier | 13px | 400 | 1.5 | 0px | Ingredient INCI names, technical data |

### Principles

- **Serif for Prestige:** DM Serif Display reserves typography for headings exclusively, signaling luxury and trustworthiness without overwhelming the interface.
- **Warmth Over Coldness:** DM Sans humanist letterforms create approachability and calm, avoiding technical sterility.
- **Arabic-First Consideration:** Tajawal is not a fallback but a co-equal choice, with Arabic content never smaller or de-emphasized versus English equivalents.
- **Generous Line Height:** All text uses elevated line height (1.4–1.6) to promote readability in the bright, glare-prone Gulf sunlight.
- **Letter Spacing Subtlety:** Slight positive letter spacing on body text improves legibility for Arabic and English alike without appearing forced.
- **Hierarchy Through Weight:** Secondary headings use weight variation rather than size alone, reducing visual noise while maintaining structure.

## 4. Component Stylings

### Buttons

#### Primary Button

```css
background-color: #E8637A;
color: #FFFFFF;
padding: 12px 24px;
border-radius: 8px;
border: none;
font-family: 'DM Sans', sans-serif;
font-size: 16px;
font-weight: 600;
line-height: 1.5;
letter-spacing: 0.5px;
cursor: pointer;
transition: all 0.2s ease-out;
box-shadow: 0 2px 8px rgba(232, 99, 122, 0.15);
```

**Hover State:**
```css
background-color: #D4547A;
box-shadow: 0 4px 12px rgba(232, 99, 122, 0.25);
transform: translateY(-2px);
```

**Active State:**
```css
background-color: #C44A6F;
box-shadow: 0 1px 4px rgba(232, 99, 122, 0.2);
transform: translateY(0);
```

**Disabled State:**
```css
background-color: #E8C8CF;
color: #FFFFFF;
cursor: not-allowed;
box-shadow: none;
```

#### Secondary Button

```css
background-color: transparent;
color: #E8637A;
padding: 12px 24px;
border-radius: 8px;
border: 2px solid #E8637A;
font-family: 'DM Sans', sans-serif;
font-size: 16px;
font-weight: 600;
line-height: 1.5;
letter-spacing: 0.5px;
cursor: pointer;
transition: all 0.2s ease-out;
```

**Hover State:**
```css
background-color: #F9E8E8;
color: #D4547A;
border-color: #D4547A;
```

**Active State:**
```css
background-color: #F0E6F6;
color: #C44A6F;
border-color: #C44A6F;
```

**Disabled State:**
```css
background-color: transparent;
color: #E8C8CF;
border-color: #E8C8CF;
cursor: not-allowed;
```

#### Ghost Button

```css
background-color: transparent;
color: #2D1B2E;
padding: 12px 24px;
border-radius: 8px;
border: none;
font-family: 'DM Sans', sans-serif;
font-size: 16px;
font-weight: 600;
line-height: 1.5;
letter-spacing: 0.5px;
cursor: pointer;
transition: all 0.15s ease-out;
```

**Hover State:**
```css
background-color: #FAFAFA;
color: #E8637A;
```

**Active State:**
```css
background-color: #F9E8E8;
color: #D4547A;
```

#### Icon Button

```css
background-color: transparent;
color: #2D1B2E;
width: 44px;
height: 44px;
padding: 0;
border-radius: 8px;
border: none;
display: flex;
align-items: center;
justify-content: center;
cursor: pointer;
transition: all 0.15s ease-out;
```

**Hover State:**
```css
background-color: #F9E8E8;
color: #E8637A;
```

### Cards & Containers

#### Default Card

```css
background-color: #FFFFFF;
border-radius: 12px;
padding: 20px;
border: 1px solid #E8E8E8;
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
transition: all 0.2s ease-out;
```

**Hover State:**
```css
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
border-color: #D4A0A7;
```

#### Featured Card (Premium/Routine)

```css
background-color: #FFFFFF;
border-radius: 12px;
padding: 24px;
border: 2px solid #D4A0A7;
box-shadow: 0 4px 16px rgba(232, 99, 122, 0.1);
transition: all 0.2s ease-out;
```

**Hover State:**
```css
box-shadow: 0 8px 24px rgba(232, 99, 122, 0.15);
transform: translateY(-2px);
```

#### Scan Result Card

```css
background: linear-gradient(135deg, #F9E8E8 0%, #F0E6F6 100%);
border-radius: 12px;
padding: 24px;
border: none;
box-shadow: 0 2px 8px rgba(232, 99, 122, 0.08);
```

#### Product Card

```css
background-color: #FFFFFF;
border-radius: 12px;
padding: 16px;
border: 1px solid #E8E8E8;
box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
display: flex;
flex-direction: column;
gap: 12px;
```

**Image Container:**
```css
width: 100%;
height: 160px;
background-color: #FAFAFA;
border-radius: 8px;
overflow: hidden;
```

#### Success Message Card

```css
background-color: #F0F5F3;
border-radius: 12px;
padding: 16px;
border-left: 4px solid #7BA892;
display: flex;
gap: 12px;
align-items: flex-start;
```

**Text Color:**
```css
color: #4A6B5F;
```

#### Warning Message Card

```css
background-color: #FBF6F0;
border-radius: 12px;
padding: 16px;
border-left: 4px solid #D9A76A;
display: flex;
gap: 12px;
align-items: flex-start;
```

**Text Color:**
```css
color: #7B5A3A;
```

#### Error Message Card

```css
background-color: #FAF1F3;
border-radius: 12px;
padding: 16px;
border-left: 4px solid #C74A60;
display: flex;
gap: 12px;
align-items: flex-start;
```

**Text Color:**
```css
color: #8B3A4B;
```

### Inputs & Forms

#### Text Input / Textarea

```css
background-color: #FFFFFF;
border: 1px solid #E0E0E0;
border-radius: 8px;
padding: 12px 16px;
font-family: 'DM Sans', sans-serif;
font-size: 15px;
line-height: 1.6;
color: #2D2D2D;
transition: all 0.15s ease-out;
```

**Focus State:**
```css
border-color: #E8637A;
outline: none;
box-shadow: 0 0 0 3px rgba(232, 99, 122, 0.1);
```

**Disabled State:**
```css
background-color: #FAFAFA;
border-color: #E8E8E8;
color: #9B9B9B;
cursor: not-allowed;
```

**Error State:**
```css
border-color: #C74A60;
box-shadow: 0 0 0 3px rgba(199, 74, 96, 0.1);
```

#### Label

```css
font-family: 'DM Sans', sans-serif;
font-size: 14px;
font-weight: 600;
color: #2D1B2E;
margin-bottom: 8px;
display: block;
```

**Required Indicator:**
```css
::after {
  content: ' *';
  color: #E8637A;
}
```

#### Checkbox

```css
width: 20px;
height: 20px;
border: 2px solid #E0E0E0;
border-radius: 4px;
cursor: pointer;
transition: all 0.15s ease-out;
background-color: #FFFFFF;
```

**Checked State:**
```css
background-color: #E8637A;
border-color: #E8637A;
```

**Hover State (Unchecked):**
```css
border-color: #D4A0A7;
```

#### Radio Button

```css
width: 20px;
height: 20px;
border: 2px solid #E0E0E0;
border-radius: 50%;
cursor: pointer;
transition: all 0.15s ease-out;
background-color: #FFFFFF;
```

**Checked State:**
```css
border-color: #E8637A;
box-shadow: inset 0 0 0 6px #E8637A;
```

**Hover State (Unchecked):**
```css
border-color: #D4A0A7;
```

#### Select Dropdown

```css
background-color: #FFFFFF;
border: 1px solid #E0E0E0;
border-radius: 8px;
padding: 12px 16px;
font-family: 'DM Sans', sans-serif;
font-size: 15px;
color: #2D2D2D;
cursor: pointer;
transition: all 0.15s ease-out;
appearance: none;
background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232D2D2D' stroke-width='2'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
background-repeat: no-repeat;
background-position: right 12px center;
background-size: 20px;
padding-right: 40px;
```

**Focus State:**
```css
border-color: #E8637A;
outline: none;
box-shadow: 0 0 0 3px rgba(232, 99, 122, 0.1);
```

#### Progress Indicator (Linear)

```css
background-color: #E0E0E0;
height: 4px;
border-radius: 2px;
overflow: hidden;
```

**Fill:**
```css
background: linear-gradient(90deg, #E8637A 0%, #D4A0A7 100%);
height: 100%;
border-radius: 2px;
transition: width 0.3s ease-out;
```

### Navigation

#### Top Navigation Bar

```css
background-color: #FFFFFF;
border-bottom: 1px solid #E8E8E8;
padding: 16px 24px;
display: flex;
align-items: center;
justify-content: space-between;
height: 64px;
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
position: sticky;
top: 0;
z-index: 100;
```

#### Navigation Link (Active)

```css
font-family: 'DM Sans', sans-serif;
font-size: 15px;
font-weight: 600;
color: #E8637A;
text-decoration: none;
padding-bottom: 4px;
border-bottom: 2px solid #E8637A;
transition: all 0.15s ease-out;
```

#### Navigation Link (Inactive)

```css
font-family: 'DM Sans', sans-serif;
font-size: 15px;
font-weight: 400;
color: #5A5A5A;
text-decoration: none;
padding-bottom: 4px;
border-bottom: 2px solid transparent;
transition: all 0.15s ease-out;
```

**Hover State:**
```css
color: #E8637A;
```

#### Bottom Tab Navigation

```css
background-color: #FFFFFF;
border-top: 1px solid #E8E8E8;
padding: 0;
display: flex;
justify-content: space-around;
position: fixed;
bottom: 0;
width: 100%;
height: 64px;
z-index: 100;
```

**Tab Item (Active):**
```css
flex: 1;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
gap: 4px;
color: #E8637A;
font-size: 12px;
font-weight: 600;
border-top: 3px solid #E8637A;
```

**Tab Item (Inactive):**
```css
flex: 1;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
gap: 4px;
color: #9B9B9B;
font-size: 12px;
font-weight: 400;
border-top: 3px solid transparent;
```

### Badges

#### Default Badge

```css
background-color: #F0E6F6;
color: #2D1B2E;
padding: 6px 12px;
border-radius: 6px;
font-family: 'DM Sans', sans-serif;
font-size: 12px;
font-weight: 600;
letter-spacing: 0.3px;
display: inline-block;
border: none;
```

#### Halal Badge

```css
background-color: #F0F5F3;
color: #4A6B5F;
padding: 6px 12px;
border-radius: 6px;
font-family: 'DM Sans', sans-serif;
font-size: 12px;
font-weight: 600;
letter-spacing: 0.3px;
display: inline-block;
border: 1px solid #7BA892;
```

#### Premium Badge

```css
background: linear-gradient(135deg, #F9E8E8 0%, #F0E6F6 100%);
color: #C9A84C;
padding: 6px 12px;
border-radius: 6px;
font-family: 'DM Sans', sans-serif;
font-size: 12px;
font-weight: 600;
letter-spacing: 0.3px;
display: inline-block;
border: 1px solid #C9A84C;
```

#### Warning Badge

```css
background-color: #FBF6F0;
color: #7B5A3A;
padding: 6px 12px;
border-radius: 6px;
font-family: 'DM Sans', sans-serif;
font-size: 12px;
font-weight: 600;
letter-spacing: 0.3px;
display: inline-block;
border: 1px solid #D9A76A;
```

### Tabs

#### Tab Container

```css
display: flex;
gap: 0;
border-bottom: 1px solid #E8E8E8;
overflow-x: auto;
```

#### Tab Item (Inactive)

```css
padding: 16px 20px;
font-family: 'DM Sans', sans-serif;
font-size: 15px;
font-weight: 500;
color: #5A5A5A;
cursor: pointer;
border-bottom: 3px solid transparent;
transition: all 0.2s ease-out;
white-space: nowrap;
```

**Hover State:**
```css
color: #E8637A;
```

#### Tab Item (Active)

```css
padding: 16px 20px;
font-family: 'DM Sans', sans-serif;
font-size: 15px;
font-weight: 600;
color: #E8637A;
cursor: pointer;
border-bottom: 3px solid #E8637A;
white-space: nowrap;
```

### Modal / Dialog

#### Modal Backdrop

```css
background-color: rgba(45, 27, 46, 0.5);
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
z-index: 200;
transition: opacity 0.2s ease-out;
```

#### Modal Container

```css
background-color: #FFFFFF;
border-radius: 16px;
padding: 32px;
box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
position: fixed;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
max-width: 600px;
width: 90%;
max-height: 80vh;
overflow-y: auto;
z-index: 201;
```

#### Modal Close Button

```css
position: absolute;
top: 20px;
right: 20px;
background-color: transparent;
border: none;
color: #9B9B9B;
font-size: 28px;
cursor: pointer;
width: 40px;
height: 40px;
display: flex;
align-items: center;
justify-content: center;
transition: all 0.15s ease-out;
```

**Hover State:**
```css
color: #E8637A;
```

## 5. Layout Principles

### Spacing System

**Base Unit:** 8px

**Spacing Scale:**
- `4px` (0.5x): Micro-spacing between tightly grouped elements, icon-to-label gaps
- `8px` (1x): Minimal spacing, field labels to inputs, list item gaps
- `12px` (1.5x): Small spacing, button internals, card content top padding
- `16px` (2x): Standard spacing, section gaps, card padding, bottom navigation height
- `20px` (2.5x): Medium spacing, card padding on desktop, form sections
- `24px` (3x): Large spacing, main content padding, featured card padding
- `32px` (4x): Extra large spacing, page margin, major section breaks
- `40px` (5x): Hero spacing, between page sections, top padding on full-screen layouts
- `48px` (6x): Exceptional spacing, between major content blocks

**Usage Context:**
- Page margins and container padding: 24px mobile, 32px tablet, 40px desktop
- Section gaps: 32px–48px
- Card internal padding: 16px–24px
- Component gaps: 8px–12px
- Form field spacing: 16px vertical, 12px label-to-field

### Grid & Container

**Max Widths:**
- Mobile: 100% (no max, full width with 24px padding)
- Tablet: 744px (including 32px padding on each side)
- Desktop: 1200px (including 40px padding on each side)

**Column Strategy:**
- Mobile: Single column (100% width)
- Tablet: 2 columns (50% width each)
- Desktop: 3 columns (33.3% width each) for product grids; 2 columns for routine/scan sections

**Gutters:** 16px between columns at all breakpoints

**Section Patterns:**
- Hero section: Full viewport height, centered content, 40px top/bottom padding
- Product grid: 3-column on desktop, 2-column on tablet, 1-column on mobile with consistent 16px gutters
- Form sections: Single column, max-width 600px, centered on desktop
- Routine builder: 2-column (left: routine steps, right: product recommendations) on desktop, stack on tablet/mobile

### Whitespace Philosophy

Whitespace is a strategic design element, not empty space. The design system embraces generous margins and padding to create visual clarity and psychological calm. Cards and sections are separated by at least 24px to prevent visual clutter. Inputs and buttons within forms use 16px vertical spacing to create breathing room between interactive elements. Text blocks maintain 1.6 line height to encourage comfortable reading in bright Gulf sunlight. Imagery is surrounded by whitespace to emphasize its importance. The overall philosophy prioritizes legibility and mental clarity over information density.

### Border Radius Scale

- `4px`: Small interactive elements, checkboxes, small badges
- `6px`: Badge borders, subtle UI elements, minor components
- `8px`: Input fields, ghost buttons, secondary buttons, icon buttons, small cards
- `12px`: Primary cards, standard cards, most container elements
- `16px`: Featured cards, premium UI elements, modals
- `24px`: Large hero sections, full-width container bottoms (if applicable)
- `50%`: Circular elements, avatar images, perfect circles

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat | No shadow | Background, base page surface |
| Raised (1) | `0 1px 4px rgba(0, 0, 0, 0.04)` | Product cards, subtle separation |
| Raised (2) | `0 2px 8px rgba(0, 0, 0, 0.04)` | Default cards, small modals |
| Raised (3) | `0 4px 16px rgba(0, 0, 0, 0.08)` | Hovered cards, medium UI elements, navigation |
| Elevated (4) | `0 8px 24px rgba(0, 0, 0, 0.12)` | Prominent cards, floating buttons, popovers |
| Floating (5) | `0 10px 40px rgba(0, 0, 0, 0.15)` | Modals, full-screen overlays, highest interactive elements |

**Shadow Philosophy:**

Shadows in Nourah are intentionally subtle and warm-toned. Elevation is conveyed through minimal shadow increases rather than dramatic depth shifts, maintaining the minimal aesthetic while preserving hierarchy. Colored shadows (with rose/mauve tints at 0.08–0.15 opacity) are used sparingly on primary interactive elements to reinforce brand color. The shadow system respects the luxury positioning—shadows should feel refined and restrained, never heavy or industrial. Hover states introduce slight shadow elevation (from level 2 to level 3) to provide tactile feedback without visual disruption.

**Colored Shadow on Brand Elements:**
- Primary buttons: `0 2px 8px rgba(232, 99, 122, 0.15)` (hover: `0 4px 12px rgba(232, 99, 122, 0.25)`)
- Featured cards: `0 4px 16px rgba(232, 99, 122, 0.1)` (hover: `0 8px 24px rgba(232, 99, 122, 0.15)`)

## 7. Do's and Don'ts

### Do

- **Do use soft blush (#F9E8E8) as a secondary background** to create visual separation and warmth without harshness.
- **Do prioritize Arabic typography parity** — never reduce Tajawal font size or weight below its English equivalent, and ensure Arabic lines break naturally without forced hyphenation.
- **Do embrace generous whitespace** — if an area feels crowded, add 8–12px more spacing rather than reducing font size.
- **Do use rose pink (#E8637A) sparingly** — reserve it for primary CTAs, active states, and brand moments. Overuse dilutes its impact.
- **Do pair DM Serif Display headings with generous line height (1.2–1.4)** to maintain readability and luxury positioning.
- **Do include Halal badges and ingredient transparency** as core design elements, not afterthoughts—use the success-state green (#7BA892) with confidence.
- **Do provide multiple pathways to skincare discovery** (Face Scan, Ingredient Scanner, Routine Builder) — avoid linear, prescriptive flows.
- **Do test scan result visualizations against Gulf climate context** — highlight hydration, sun damage, and melasma concerns with clear, actionable language.
- **Do use the 8px spacing grid consistently** — no custom spacing values unless there's a specific, documented exception.
- **Do ensure minimum 44px touch targets** for all mobile interactive elements (buttons, tabs, links).
- **Do communicate premium/subscription features** using gold (#C9A84C) accent borders or gradient backgrounds, not aggressive upsell language.
- **Do provide clear visual feedback** on form validation (error state borders, success checkmarks, warning icons) immediately upon user interaction.

### Don't

- **Don't use deep mauve (#2D1B2E) for backgrounds** — it's reserved for text and accents. Use off-white (#FAFAFA) or pure white (#FFFFFF) for surfaces.
- **Don't mix Tajawal and DM Sans for the same text block** — choose one consistently per element, though bilingual content may span both in separate, aligned lines.
- **Don't apply more than 2 font families per page** — the system uses 3 (DM Serif Display, DM Sans, Tajawal), and using all 3 simultaneously creates visual chaos.
- **Don't create custom color values** — always reference the defined palette. Ad-hoc hex values break cohesion.
- **Don't reduce line height below 1.4 for body text** — it sacrifices readability, especially critical for Arabic users and in bright sunlight.
- **Don't use more than 3 elevation levels in a single screen** — excess depth hierarchy confuses spatial relationships.
- **Don't hide halal or safety information behind tabs or accordions** — surface it prominently for users making trust-based decisions.
- **Don't apply multiple shadows simultaneously** (e.g., a card with both an outer shadow and an inset shadow) — complexity obscures clarity.
- **Don't force English on users** — support right-to-left (RTL) layouts natively, not as a reactive adaptation. Mirror layouts, adjust text alignment, and reverse carousel directions.
- **Don't use the warning or error color (#D9A76A, #C74A60) for decorative elements** — reserve them for genuine warnings and errors only.
- **Don't create form fields with placeholder text only** — always include a visible label above the input.
- **Don't disable hover states on mobile/touch devices** — use active/pressed states instead, but maintain interactive feedback.
- **Don't use gold (#C9A84C) for standard UI elements** — it's exclusively for premium badges, luxury accents, and special indicators.

## 8. Responsive Behavior

### Breakpoints

| Breakpoint | Width | Key Changes | Context |
|------------|-------|-------------|---------|
| Mobile | 320px–743px | Single column, bottom tab navigation, 24px padding, touch targets 44px, simplified forms, abbreviated labels | Smartphones, small tablets in portrait |
| Tablet | 744px–1199px | 2-column grids, top navigation bar, 32px padding, medium-sized cards, collapsing sidebars, expanded forms | iPad, large phones in landscape |
| Desktop | 1200px+ | 3-column grids, full navigation, 40px padding, full card layouts, dual-pane forms, wide product showcases | Desktop browsers, large screens |

**Specific Behavior Changes:**

- **Typography:** No changes to font sizes across breakpoints (use 15px body text at all widths for consistency); increase spacing scale instead
- **Navigation:** Mobile uses bottom tab navigation (Scan, Recipes, Ingredients, Profile); Tablet transitions to sticky top bar; Desktop maintains top bar with optional sidebar
- **Cards:** Mobile: 100% width, 16px padding; Tablet: 50% width with 16px gutter, 20px padding; Desktop: 33.3% width with 16px gutter, 24px padding
- **Modals:** Mobile: Full-screen on smaller devices (<600px), 90% width on larger phones; Tablet/Desktop: Centered, max-width 600px
- **Forms:** Mobile: Single column, 100% width inputs; Tablet/Desktop: Can expand to 2 columns if logical grouping exists
- **Hero Sections:** Mobile: 60vh minimum height, centered text; Tablet: 70vh; Desktop: 100vh
- **Product Images:** Mobile: 160px square; Tablet: 200px square; Desktop: 280px square

### Touch Targets

**Minimum Sizes:**
- Buttons: 44px × 44px (icon buttons), 44px height (text buttons with flexible width)
- Form controls: Checkboxes/radios 20px × 20px (visual), 44px × 44px interaction zone
- Links/tabs: 44px height, minimum 44px width
- Bottom navigation tabs: 64px height, equal width distribution
- Spacing between touch targets: Minimum 8px (but 12px preferred to prevent accidental taps)

**Mobile Optimization:**
- Never stack buttons vertically with less than 12px spacing
- Ensure form labels are at least 14px and create large tap zones (consider full row as tap area for radio/checkbox groups)
- Use larger fonts (16px+) for interactive text to improve legibility and tap accuracy

### Collapsing Strategy

**Navigation:**
- Mobile: Hide primary nav, use bottom tab bar (5 core actions max)
- Tablet: Show sticky top nav with 2-3 key links, menu button for secondary
- Desktop: Full top nav with all links visible, optional sidebar for advanced options

**Sidebars / Secondary Content:**
- Mobile: Hide sidebars, promote content into main column or use modal overlay
- Tablet: Collapse sidebars into collapsed width (60px) or hide below fold with toggle
- Desktop: Full sidebars visible, 25% width

**Product Grids:**
- Mobile: 1 column
- Tablet: 2 columns with 16px gutter
- Desktop: 3 columns with 16px gutter

**Routine Cards:**
- Mobile: Stack all routine steps and product recs vertically (no column split)
- Tablet/Desktop: Split into 2 columns (left: steps, right: products)

**Form Layouts:**
- Mobile: Single column, full-width inputs
- Tablet: Stack logically related fields vertically, use 50/50 split for date/dropdown pairs if space allows
- Desktop: Multi-column if logical (e.g., First Name | Last Name on same row)

**Hero/Call-to-Action Areas:**
- Mobile: Single column, center-aligned, button below text
- Tablet: Center-aligned, button below text, increased padding
- Desktop: Can accommodate side-by-side layouts with 2-column grid if needed, but center-align text as default

## 9. Agent Prompt Guide

### Quick Color Reference

Use this mapping when implementing UI components in code:

- **Primary CTA / Active States:** Brand Rose (`#E8637A`)
- **Primary Text / Headings:** Deep Mauve (`#2D1B2E`)
- **Default Backgrounds / Cards:** Pure White (`#FFFFFF`) with soft border (`#E8E8E8`)
- **Secondary Backgrounds / Soft Sections:** Soft Blush (`#F9E8E8`)
- **Interactive Overlays / Hover Backgrounds:** Dusty Pink (`#D4A0A7`)
- **Premium/Feature Highlights:** Soft Lavender (`#F0E6F6`) or Gold (`#C9A84C`)
- **Success Indicators / Halal Badges:** Green (`#7BA892`)
- **Warning Alerts:** Dusty Orange (`#D9A76A`)
- **Error States / Alerts:** Deep Red (`#C74A60`)
- **Secondary Text / Metadata:** Dark Gray (`#5A5A5A`)
- **Disabled / Tertiary Text:** Medium Gray (`#9B9B9B`)
- **Borders / Dividers:** Light Gray (`#E0E0E0`)

### Iteration Guide

Follow these rules in priority order when implementing Nourah UI:

1. **All text 15px and below must use DM Sans; all headings 18px and above use DM Serif Display.** Arabic text always uses Tajawal as primary, with DM Sans as fallback. Line height for body text is always 1.6; headings use 1.2–1.4.

2. **Every interactive element must have four states: default, hover, active, and disabled.** Use the color palette provided; do not create custom hover colors. Hover state = darker variant or lifted shadow. Active state = even darker or pressed shadow. Disabled state = grayed out with medium gray text.

3. **Spacing always uses the 8px grid.** Padding inside components (buttons, cards, inputs) must be a multiple of 8px (8px, 12px, 16px, 20px, 24px, 32px). Gaps between elements must also be multiples of 8px.

4. **Cards always have rounded corners (12px for default, 16px for featured).** Default shadow is `0 2px 8px rgba(0, 0, 0, 0.04)`. On hover (desktop), shadow increases to `0 4px 16px rgba(0, 0, 0, 0.08)`. Never use drop-shadow filters; use box-shadow only.

5. **Forms require visible labels (never placeholder-only).** Labels are 14px, 600 weight, deep mauve. Inputs are 15px with 1.6 line height, 12px vertical padding, 16px horizontal padding. Focus state adds a 3px rose-tinted box-shadow: `0 0 0 3px rgba(232, 99, 122, 0.1)`.

6. **All images and empty states use soft blush or lavender backgrounds** (200px × 200px minimum for scan previews, 160px square for product cards). Never use gray or white placeholder backgrounds.

7. **Buttons always have text (no label = bad UX).** Primary button: brand rose background, white text, 16px, 600 weight, 12px vertical padding, 24px horizontal padding, 8px radius. Secondary button: transparent background with 2px rose border, rose text. Ghost button: transparent background, deep mauve text.

8. **Navigation responds to screen size: mobile uses 64px bottom tabs with 5 icons max; tablet/desktop uses sticky top bar with full labels.** Active navigation item is always brand rose color with matching bottom border (3px for tabs, 2px for top nav).

9. **Modals always have rounded corners (16px), white background, 32px padding, and a close icon in the top-right corner.** The backdrop is semi-transparent deep mauve (`rgba(45, 27, 46, 0.5)`). Modals are centered, max-width 600px, and do not exceed 80vh height.

10. **Success, warning, and error messages are always message cards with left border (4px).** Use soft backgrounds (light green for success, light orange for warning, light red for error) with corresponding darker text color. Icons can be added but are not required.

11. **Halal badges, premium indicators, and safety information are always visible** — never buried behind clicks. Use the success-state green background with 1px border for halal, gold gradient for premium, orange for warnings.

12. **Touch targets are minimum 44px × 44px on mobile.** Buttons, form controls, and navigation items must meet this size. Space between touch targets is at least 8px (12px preferred). Test on real devices, not just browser emulation.

13. **RTL support is built-in, not bolted-on.** For Arabic language mode, flip all layouts horizontally, reverse carousel directions, and ensure Arabic text is naturally right-aligned without forced centering. Do not "mirror" the entire app — maintain semantic layout direction.

14. **All copy (headings, labels, button text) must support Arabic translations without overflow.** Use flexible widths and wrapping rather than fixed-width constraints. Test with 30% longer Arabic text strings.

15. **Performance and accessibility are non-negotiable.** Every interactive element must have a focus state visible to keyboard users. Color alone must not convey meaning (use icons + color, or text + color). Contrast must meet WCAG AA standards (4.5:1 for text, 3:1 for graphics).