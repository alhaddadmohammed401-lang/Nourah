# AGENTS.md — Skincare App Master Context
# READ THIS ENTIRE FILE BEFORE TOUCHING ANY CODE
# Last updated: [UPDATE THIS AFTER EVERY SESSION]

---

## ⚠️ AGENT RULES — NON-NEGOTIABLE

1. Read this entire file before writing a single line of code
2. Run `git pull origin main` before starting any task
3. Do ONE task at a time — never start the next until the current is committed
4. After completing a task: update the checklist below + commit with a descriptive message
5. Never hardcode API keys — all keys live in `.env` and are accessed via `process.env`
6. Never use inline styles — use NativeWind utility classes only
7. Every reusable component goes in `/components` — never duplicate UI logic
8. Test on a real physical device after every screen build, not on simulator
9. If you are unsure about something, stop and ask rather than guessing
10. Always commit with this format: `feat: [screen/feature name] — [what was done]`

---

## PROJECT IDENTITY

**App Name:** Nourah (placeholder — confirm before App Store submission)
**Tagline:** Your skin, understood.
**Platform:** iOS + Android (React Native / Expo)
**Target Market:** GCC region, primarily UAE. Arabic + English speakers.
**Primary Users:** Women aged 18–45 dealing with acne, oily skin, pigmentation, sun damage, or damaged skin barrier in a hot/humid climate.
**Core Problem We Solve:** No AI skincare app exists that is Arabic-first, halal-ingredient-aware, and calibrated for GCC skin concerns (melasma, extreme UV, high humidity).

**Three things that make this app different:**
1. Halal ingredient flagging — no competitor does this
2. GCC-climate-specific skin scoring (UV, humidity, melasma)
3. Dermatologist-backed content (mom is a licensed dermatologist in Dubai)

---

## TECH STACK — COMPLETE

### Mobile Framework
- **React Native** via **Expo SDK 52** (managed workflow)
- **TypeScript** — strict mode enabled, no `any` types allowed
- **Expo Router v3** — file-based routing

### Styling
- **NativeWind v4** — Tailwind utility classes for React Native
- Do NOT use StyleSheet.create() — use className props only
- Custom theme configured in `tailwind.config.js`

### Backend & Database
- **Supabase** — PostgreSQL database, Auth, Storage, Edge Functions
- Client: `@supabase/supabase-js`
- Auth: Email/password + Google OAuth
- Database: PostgreSQL with Row Level Security (RLS) enabled on all tables
- Storage: For user scan photos (processed, never raw face images stored)

### AI / Scan APIs
- **Perfect Corp Beauty Tech API** — face scan and skin analysis
  - Free tier: 1,000 scans/month
  - Detects: hydration, pores, pigmentation, acne severity, wrinkles
  - SDK: `@perfectcorp/react-native-sdk`
- **Open Food Facts API** — barcode scanning for ingredient lookup
  - Endpoint: `https://world.openfoodfacts.org/api/v2/product/{barcode}.json`
  - Completely free, no key required
  - Fallback: manual INCI ingredient input if barcode not found

### Monetization
- **RevenueCat** — subscription management
  - SDK: `react-native-purchases`
  - Free tier: up to $2,500 MRR
  - Products: monthly (AED 29 / $7.99) + annual (AED 199 / $54.99)
  - Free trial: 5 days

### In-App AI (recommendations engine)
- **Google Gemini Flash 2.0** via Google AI Studio API
  - Free tier: 1M tokens/day
  - Used for: routine recommendations, ingredient explanations, skin advice
  - Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`

### Notifications
- **Expo Notifications** — push notifications
  - Daily PM routine reminder: 8:00 PM
  - Weekly skin check: Sunday 10:00 AM

### Internationalization
- **react-i18next** + **i18next**
- Supported languages: English (`en`), Arabic (`ar`)
- RTL support: `I18nManager.allowRTL(true)` for Arabic
- Translation files: `/locales/en.json` and `/locales/ar.json`
- Font switches automatically: DM Sans → Tajawal when Arabic active

### Navigation
- **Expo Router** file-based navigation
- Bottom tab navigator: Home, Scan, Products, Profile
- Stack navigator: wraps Scan flow (Scan → Results → Routine)

### Other Libraries
- `react-native-reanimated` — animations (scanning ring pulse, screen transitions)
- `expo-camera` — camera access for face scan + barcode
- `expo-barcode-scanner` — barcode detection
- `@gorhom/bottom-sheet` — ingredient result slide-up panel
- `victory-native` — line charts for progress tracking
- `expo-haptics` — haptic feedback on scan complete
- `expo-sharing` — share app button in profile
- `expo-notifications` — push notifications
- `react-native-purchases` — RevenueCat SDK

---

## FILE STRUCTURE — EXACT

```
/app                          ← Expo Router screens (file = route)
  /(auth)
    login.tsx                 ← Login screen
    signup.tsx                ← Sign up screen
  /(onboarding)
    index.tsx                 ← Welcome screen
    concerns.tsx              ← Pick skin concerns
    skintype.tsx              ← Pick skin type
  /(tabs)
    index.tsx                 ← Home screen
    scan.tsx                  ← Face scan screen
    products.tsx              ← Products + affiliate screen
    profile.tsx               ← Profile screen
  /scan-results.tsx           ← Results screen (post-scan)
  /routine.tsx                ← Routine screen
  /ingredient-scanner.tsx     ← Barcode ingredient scanner
  /progress.tsx               ← Progress tracking (premium)
  /paywall.tsx                ← Subscription paywall

/components
  /ui
    Button.tsx                ← Primary/secondary/ghost variants
    Card.tsx                  ← Standard card wrapper
    ScoreCard.tsx             ← Skin metric score card
    HalalBadge.tsx            ← Green halal status badge
    SkincareStep.tsx          ← Single routine step item
    ProductCard.tsx           ← Affiliate product card
    ProgressRing.tsx          ← Animated circular progress
    LanguageToggle.tsx        ← EN/AR switcher
  /scan
    FaceGuide.tsx             ← Oval overlay on camera
    ScanningRing.tsx          ← Pulsing animation ring
    GCCBadge.tsx              ← Climate/melasma warning badge

/services
  supabase.ts                 ← Supabase client init
  auth.ts                     ← Login, signup, logout, session
  scanService.ts              ← Perfect Corp API calls
  ingredientService.ts        ← Open Food Facts API + halal logic
  routineService.ts           ← Routine generation logic
  geminiService.ts            ← Gemini Flash API calls
  affiliateService.ts         ← Product data + affiliate link builder
  revenueCatService.ts        ← Subscription status checks

/constants
  colors.ts                   ← Full design token color palette
  fonts.ts                    ← Font family names
  spacing.ts                  ← Spacing scale (4, 8, 12, 16, 24, 32px)
  halalFlags.ts               ← Array of haram/questionable ingredients
  irritants.ts                ← Array of known skin irritants
  routines.ts                 ← Routine templates (oily/dry/combination)
  products.ts                 ← Curated product list with affiliate links

/hooks
  useAuth.ts                  ← Auth state + user session
  useScan.ts                  ← Face scan flow state
  useSubscription.ts          ← RevenueCat premium status
  useLanguage.ts              ← i18n language switching

/locales
  en.json                     ← English translations
  ar.json                     ← Arabic translations

/types
  index.ts                    ← All TypeScript interfaces + types

/.env                         ← API keys (NEVER commit this)
/AGENTS.md                    ← This file
/tailwind.config.js           ← NativeWind theme
```

---

## DESIGN SYSTEM — EXACT VALUES

### Color Palette (use these exact hex values, no others)
```typescript
// /constants/colors.ts
export const colors = {
  brandRose:    '#E8637A',  // Primary CTA, active states
  deepMauve:    '#2D1B2E',  // All headings and primary text
  softBlush:    '#F9E8E8',  // Screen backgrounds, card fills
  dustyPink:    '#D4A0A7',  // Secondary accents, press states
  softLavender: '#F0E6F6',  // Feature highlights, progress
  gold:         '#C9A84C',  // Premium badges only
  success:      '#7BA892',  // Halal badges, good scores
  warning:      '#D9A76A',  // Caution indicators
  error:        '#C74A60',  // Error messages
  charcoal:     '#2D2D2D',  // Body text
  darkGray:     '#5A5A5A',  // Secondary text
  lightGray:    '#E0E0E0',  // Borders, dividers
  white:        '#FFFFFF',  // Cards, modals
  scanBg:       '#0D0D0D',  // Scan screen ONLY
  scoreGreen:   '#7DB87A',  // Score 70-100%
  scoreAmber:   '#E8A838',  // Score 40-70%
  scoreRed:     '#E07070',  // Score 0-40%
}
```

### Typography
```typescript
// /constants/fonts.ts
export const fonts = {
  heading:  'DMSerifDisplay-Regular',  // Screen titles, large numbers
  body:     'DMSans-Regular',          // Body text, buttons, labels
  bodyBold: 'DMSans-Medium',           // Emphasized body text
  arabic:   'Tajawal-Regular',         // All Arabic text
  arabicBold: 'Tajawal-Medium',        // Arabic headings
}

// Font sizes (use these exact sizes, no others)
export const fontSize = {
  xs:   11,   // Timestamps, fine print
  sm:   13,   // Secondary labels, captions
  base: 15,   // Body text default
  md:   17,   // Section headers
  lg:   20,   // Card titles
  xl:   24,   // Screen titles
  xxl:  32,   // Score numbers, big display
  hero: 40,   // Onboarding hero text
}
```

### Spacing Scale
```typescript
// Always use multiples of 4
export const spacing = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  24,
  xxl: 32,
  screen: 20,  // Default horizontal screen padding
}
```

### Border Radius
- Cards: `rounded-2xl` (16px)
- Buttons: `rounded-xl` (12px)
- Badges/pills: `rounded-full`
- Input fields: `rounded-xl` (12px)
- Bottom sheets: top corners only, 24px

### Shadows
- Cards: `shadow-sm` with `shadowColor: '#1A1A1A', opacity: 0.06`
- No harsh shadows anywhere — keep it soft and premium

### Component Patterns
- All buttons: minimum height 52px, full width unless specified
- All cards: white background, 16px padding, 16px border radius
- Score cards: colored background based on score range (green/amber/red)
- Scan screen: ONLY screen with dark (#0D0D0D) background
- Bottom navigation: 4 tabs only — Home, Scan, Products, Profile

---

## DATABASE SCHEMA (Supabase PostgreSQL)

```sql
-- Users table (extends Supabase Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  name TEXT,
  skin_type TEXT CHECK (skin_type IN ('oily', 'dry', 'combination', 'sensitive')),
  skin_concerns TEXT[],           -- ['acne', 'pigmentation', 'dryness', 'aging']
  language TEXT DEFAULT 'en',
  is_premium BOOLEAN DEFAULT FALSE,
  revenuecat_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scan results table
CREATE TABLE scans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  hydration_score INTEGER,        -- 0-100
  pores_score TEXT,               -- 'small', 'medium', 'large'
  pigmentation_score INTEGER,     -- 0-100
  acne_count INTEGER,
  overall_score INTEGER,          -- computed average
  gcc_flags TEXT[],               -- ['melasma_risk', 'high_uv', 'humidity_warning']
  routine_type TEXT,              -- 'oily', 'dry', 'combination'
  raw_api_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ingredient scans table
CREATE TABLE ingredient_scans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_name TEXT,
  barcode TEXT,
  halal_status TEXT CHECK (halal_status IN ('halal_friendly', 'check_required', 'not_scanned')),
  ingredients JSONB,              -- [{name, status, concern}]
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (enable on all tables)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredient_scans ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can only see their own data)
CREATE POLICY "Users own their profile"
  ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users own their scans"
  ON scans FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own their ingredient scans"
  ON ingredient_scans FOR ALL USING (auth.uid() = user_id);
```

---

## API INTEGRATIONS — DETAILED

### Perfect Corp Face Scan
```typescript
// /services/scanService.ts pattern
// Input: base64 image string
// Output: skin analysis object
// Rate limit: 1,000 scans/month on free tier
// On rate limit: show "Daily scan limit reached" — do NOT crash

const analyzeSkin = async (imageBase64: string) => {
  // Call Perfect Corp SDK
  // Map response to our ScanResult type
  // Save to Supabase scans table
  // Return typed ScanResult
}
```

### Open Food Facts Ingredient Lookup
```typescript
// /services/ingredientService.ts pattern
// Input: barcode string (EAN-13)
// Output: product name + ingredient list
// No API key required
// If product not found: prompt user to enter ingredients manually

const lookupBarcode = async (barcode: string) => {
  const res = await fetch(
    `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`
  )
  // Extract ingredients_text_en or ingredients_text_ar
  // Run through halalCheck() and irritantCheck()
  // Return IngredientResult type
}
```

### Halal Flagging Logic
```typescript
// /constants/halalFlags.ts — these ingredients trigger a "check required" badge
const HARAM_UNCERTAIN = [
  'carmine', 'cochineal', 'e120',           // Red dye from insects
  'lard', 'tallow',                          // Pig/animal fat
  'porcine collagen', 'porcine gelatin',     // Pig-derived
  'animal-derived glycerin',                 // Could be pork
  'alcohol denat',                           // Denatured alcohol
  'ethanol',                                 // If used as solvent
  'sodium stearate',                         // Could be animal-derived
  'cetyl alcohol',                           // If animal-derived
  'stearic acid',                            // Could be animal-derived
  'oleic acid',                              // Could be animal-derived
]
// Check: lowercase the ingredient name, check if it includes any flag
// Result: 'halal_friendly' if none found, 'check_required' if any found
```

### Gemini Flash Recommendation
```typescript
// /services/geminiService.ts pattern
// Used for: generating personalized routine text + ingredient explanations

const getRoutineRecommendation = async (scanResult: ScanResult) => {
  const prompt = `
    You are a dermatologist assistant for a GCC skincare app.
    User skin type: ${scanResult.routineType}
    Skin concerns: ${scanResult.gcc_flags.join(', ')}
    Hydration: ${scanResult.hydration_score}%
    Acne count: ${scanResult.acne_count}
    
    Suggest a 5-step AM routine. Format as JSON array:
    [{step: number, category: string, instruction: string, key_ingredient: string}]
    Keep each instruction under 20 words. Return ONLY valid JSON.
  `
  // Call Gemini Flash API
  // Parse JSON response
  // Return RoutineStep[]
}
```

---

## BUSINESS LOGIC RULES

### Skin Type Determination
```
IF hydration_score < 35 AND pores_score = 'small' → 'dry'
IF hydration_score > 65 AND pores_score = 'large' → 'oily'
IF acne_count > 5 AND pores_score = 'medium' → 'combination'
ELSE → use skin_type from user onboarding profile
```

### GCC Climate Flags
```
IF pigmentation_score > 55 → add 'melasma_risk' flag
IF current month IN [May, Jun, Jul, Aug, Sep] → add 'high_uv' flag
IF skin_type = 'oily' AND pores_score = 'large' → add 'humidity_warning' flag
```

### Premium Paywall Gates
```
FREE users get:
- 1 face scan per day
- AM routine only (5 steps)
- Basic ingredient halal check
- 10 product recommendations

PREMIUM users get:
- Unlimited face scans
- AM + PM full routines
- Full ingredient analysis with irritant flagging
- All product recommendations
- Progress tracking with charts
- Priority recommendations
```

### Overall Skin Score Calculation
```typescript
const overallScore = Math.round(
  (hydration_score * 0.3) +
  (pigmentation_score * 0.3) +
  ((5 - acne_count) / 5 * 100 * 0.2) +  // normalize acne count
  (pores_score === 'small' ? 100 : pores_score === 'medium' ? 60 : 30) * 0.2
)
```

---

## ENVIRONMENT VARIABLES

```bash
# /.env — NEVER commit this file
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_PERFECT_CORP_KEY=your_perfect_corp_api_key
EXPO_PUBLIC_GEMINI_KEY=your_google_ai_studio_key
EXPO_PUBLIC_REVENUECAT_IOS_KEY=your_revenuecat_ios_key
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=your_revenuecat_android_key
```

Note: `EXPO_PUBLIC_` prefix makes variables available in the React Native bundle.
Never use variables without this prefix for client-side keys.

---

## CURRENT PROGRESS TRACKER
# UPDATE THIS CHECKLIST AT THE END OF EVERY SESSION

### Phase 1 — Structure (Weeks 1–2)
- [ ] Apple Developer Account created (mom's account)
- [ ] Google Play Console created (mom's account)
- [x] GitHub repo created and initialized
- [x] Expo project created (`npx create-expo-app@latest nourah --template blank-typescript`)
- [ ] Supabase project created at supabase.com
- [ ] Perfect Corp developer account created
- [ ] RevenueCat account created
- [ ] Google AI Studio account + Gemini key generated
- [ ] Domain registered (Namecheap)
- [ ] Privacy policy hosted at domain
- [ ] Terms of service hosted at domain

### Phase 2 — Craft (Weeks 2–3)
- [ ] Figma design file created with brand page
- [ ] Color palette + fonts set up in Figma
- [ ] App icon designed (1024×1024px)
- [ ] Onboarding screens wireframed (3 screens)
- [ ] Home screen wireframed
- [ ] Scan screen wireframed
- [ ] Results screen wireframed
- [ ] Products screen wireframed
- [ ] Ingredient scanner wireframed
- [ ] Profile screen wireframed
- [ ] All wireframes converted to high fidelity
- [ ] Mom reviewed and approved all designs

### Phase 3 — Assemble (Weeks 3–7)
#### Project Setup
- [x] NativeWind v4 installed and configured
  Note: NativeWind is installed but Metro config is temporarily disabled due to Windows config issue. Re-enable after base screens are stable.
- [ ] tailwind.config.js configured with design tokens
- [x] /constants/colors.ts created
- [x] /constants/fonts.ts created
- [ ] Google Fonts loaded (DMSerifDisplay, DMSans, Tajawal)
- [x] Expo Router navigation structure created
- [ ] All placeholder screens created

#### Authentication
- [ ] Supabase client initialized (`/services/supabase.ts`)
- [ ] Supabase database schema applied (SQL above)
- [ ] RLS policies applied
- [ ] Login screen built
- [ ] Sign up screen built
- [ ] Auth service built (`/services/auth.ts`)
- [ ] useAuth hook built

#### Onboarding
- [ ] Welcome screen (Screen 1)
- [ ] Skin concerns picker (Screen 2)
- [ ] Skin type selector (Screen 3)
- [ ] Onboarding data saved to Supabase profiles table

#### Core Screens
- [ ] Home screen built
- [ ] Face scan screen built (camera + oval guide)
- [ ] Perfect Corp API integrated
- [ ] Scan results screen built
- [ ] GCC badge overlays added to results
- [ ] Routine screen built (AM/PM toggle)
- [ ] Gemini Flash API integrated for routine text

#### Ingredient Scanner
- [ ] Barcode scanner screen built
- [ ] Open Food Facts API integrated
- [ ] Halal flagging logic built (`/constants/halalFlags.ts`)
- [ ] Irritant detection logic built (`/constants/irritants.ts`)
- [ ] Ingredient result bottom sheet built

#### Commerce
- [ ] Products screen built
- [ ] Affiliate product data created (`/constants/products.ts`)
- [ ] Amazon.ae affiliate links integrated
- [ ] iHerb affiliate links integrated
- [ ] YesStyle affiliate links integrated
- [ ] RevenueCat SDK installed
- [ ] Subscription products created in App Store Connect
- [ ] Paywall screen built
- [ ] Premium gates implemented

#### Polish
- [ ] Progress tracking screen built (premium)
- [ ] Push notifications set up
- [ ] Profile screen built
- [ ] Settings screen built (language, notifications)
- [ ] Arabic translations complete (`/locales/ar.json`)
- [ ] English translations complete (`/locales/en.json`)
- [ ] RTL layout working for Arabic
- [ ] Micro-animations added (scan ring, transitions)
- [ ] Haptic feedback on scan complete
- [ ] App icon + splash screen finalized

### Phase 4 — Network (Weeks 7–8)
- [ ] EAS Build configured
- [ ] iOS build generated
- [ ] TestFlight beta submitted
- [ ] Beta feedback collected (Google Form)
- [ ] Bugs fixed from beta
- [ ] App Store screenshots created (all sizes)
- [ ] App Store listing written (EN + AR)
- [ ] Google Play listing written (EN + AR)
- [ ] App Store submitted for review
- [ ] Google Play submitted for review
- [ ] Launch content filmed with mom
- [ ] App approved — LIVE 🚀

---

## AGENT-SPECIFIC INSTRUCTIONS

### For Antigravity
- Use as your primary planning and multi-agent orchestration tool
- Ideal for: scaffolding new screens, setting up Firebase services, large refactors
- Always tell Antigravity to read AGENTS.md first using: "Read the AGENTS.md file in the project root before you begin"
- When Antigravity hits rate limits → switch to Claude Code

### For Claude Code (in terminal)
- Best for: precise single-file edits, debugging complex logic, TypeScript types
- Run from the project root directory: `claude`
- First message in every session: "Read AGENTS.md then tell me the next unchecked task"
- When Claude Code hits limits → switch to Codex/ChatGPT

### For Codex / ChatGPT
- Best for: isolated problems, writing specific functions, debugging errors
- Paste the relevant file content + the error/task into ChatGPT
- Tell it: "This is a React Native Expo app using NativeWind and Supabase. Here is the context from AGENTS.md: [paste relevant sections]"
- Copy solution back into your project manually

### Switching Between Agents (Rate Limit Protocol)
```
When any agent hits a rate limit:
1. Ask it to commit what it has: "commit what you have with a descriptive message"
2. Update this file's checklist
3. Switch to the next agent
4. Give the new agent: "Read AGENTS.md, run git pull, then continue from where we left off"
```

---

## GIT WORKFLOW

```bash
# Commit format — always follow this exactly
feat: login screen — Firebase Auth connected, Google OAuth added
feat: scan screen — camera permissions + face guide oval
fix: results screen — pigmentation score calculation corrected
style: home screen — spacing adjusted to match Figma
refactor: auth service — split into separate auth + session files

# Branch naming (if you create branches)
main           ← production-ready code only
dev            ← active development
feature/[name] ← specific feature work

# Daily commit rule
# Never end a session without committing. Even incomplete work.
# Use: git commit -m "wip: [screen name] — [what's done, what's left"
```

---

## CURRENT TASK
# ⬇️ AGENT: READ AND DO ONLY THIS SECTION ⬇️

**Status:** Project setup committed to GitHub

**Next task:** Build onboarding welcome screen

**Steps:**
1. Create `/app/(onboarding)/index.tsx`
2. Match DESIGN.md visual style
3. Add app name, tagline, intro copy, and CTA
4. Link CTA to concerns screen placeholder
5. Test in Expo Go
6. Commit changes