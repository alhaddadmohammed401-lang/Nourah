// Daily skincare tips, derm-backed and short. Rotated by day-of-month modulo so the same
// tip appears on the same day across all users. The voice is reassuring, never alarmist,
// per PRODUCT.md design principle "Reassure first, prescribe second".
// TODO(i18n): Currently English-only. When the Arabic-side derm review is ready, add an
// ar tips array and route through useLanguage().lang in the Home screen consumer.

export const DAILY_TIPS: string[] = [
  'Reapply SPF every two hours when you are outside. Gulf sun does not negotiate.',
  'Hyaluronic acid works best on damp skin. Pat your face after cleansing, then apply.',
  'Niacinamide and vitamin C can be layered. The "do not mix" warning is mostly a myth.',
  'Retinol at night, sunscreen by day. The pairing is non-negotiable.',
  'Drink water for your body. For skin, the moisturizer matters more.',
  'Pat your face dry. Rubbing inflames the barrier and feeds redness.',
  'Cleanse twice at night when you wear sunscreen. Once is rarely enough.',
  'AC dries skin out. A simple humidifier in the bedroom can soften everything.',
  'A new product needs three to four weeks before you judge it. Be patient.',
  'Avoid harsh scrubs. Chemical exfoliants are gentler and more even.',
  'Pigmentation fades slowly. Six months of consistent SPF beats any quick fix.',
  'Wash your pillowcase weekly if you are breaking out. It carries oil and product residue.',
  'Sunscreen on cloudy days too. UV passes through clouds at full strength here.',
  'A pea-size of retinol is enough for the whole face. More causes irritation, not faster results.',
  'Do not pop. Pressure scars take far longer to heal than the spot itself.',
  'Heat damages collagen. Hot showers feel good, lukewarm is kinder.',
  'Vitamin C in the morning brightens and protects. Store it away from light.',
  'Melasma worsens with heat, not just sun. Avoid saunas and very hot showers.',
  'Silicone primers feel smooth but trap sweat in humid weather. Lighter formulas breathe better.',
  'Slug at night when your barrier feels stripped. A thin layer of petrolatum locks moisture in.',
  'Salicylic acid clears clogged pores. Glycolic acid evens tone. Pick the one that matches the goal.',
  'Sleep on your back if you can. Side-sleeping presses lines into the same spot every night.',
  'Tinted SPF doubles as foundation on light days. Less product, less stress on the skin.',
  'Cold water at the end of cleansing tightens, but warm to lukewarm gets the actual cleaning done.',
  'Read ingredient lists from the top. The first five carry most of the formula.',
  'A streak in sunscreen application is a streak of unprotected skin. Spread carefully.',
  'Snail mucin is an excellent humectant. Halal users should check the source if unsure.',
  'Spot treatments work best on a clean dry surface. Dab, do not rub.',
  'If a product stings every time, it is not working with you. Stop and ask.',
  'A simple routine done daily beats an elaborate one done occasionally.',
];

export function tipForToday(date: Date = new Date()): string {
  const day = date.getDate(); // 1-31
  return DAILY_TIPS[(day - 1) % DAILY_TIPS.length] ?? DAILY_TIPS[0];
}
