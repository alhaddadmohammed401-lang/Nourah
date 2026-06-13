-- Starter halal ingredient rules. This is a domain question, not a code question; the
-- list below is a conservative baseline for skincare ingredients commonly flagged in
-- halal cosmetics discussions. A dermatology / Islamic-finance review should refine it
-- before production launch. Sources cited per row.

insert into public.halal_ingredient_rules (ingredient, verdict, reason, source) values
  ('gelatin',           'doubtful', 'Animal-derived; halal only if sourced from halal-slaughtered animals or fish.', 'General halal cosmetics guidance'),
  ('carmine',           'doubtful', 'Derived from cochineal insects; rulings vary across madhhabs.',                  'General halal cosmetics guidance'),
  ('cochineal extract', 'doubtful', 'Same as carmine.',                                                                'General halal cosmetics guidance'),
  ('lard',              'haram',    'Pig-derived fat.',                                                                'Quranic prohibition on pork derivatives'),
  ('porcine collagen',  'haram',    'Pig-derived collagen.',                                                           'Quranic prohibition on pork derivatives'),
  ('tallow',            'doubtful', 'Animal fat; halal only if from halal-slaughtered cattle.',                       'General halal cosmetics guidance'),
  ('alcohol denat',     'doubtful', 'Ethyl alcohol use in topicals is contested; many scholars permit non-ingested topical use.', 'GCC cosmetics scholarship'),
  ('ethyl alcohol',     'doubtful', 'Same as alcohol denat.',                                                          'GCC cosmetics scholarship'),
  ('isopropyl alcohol', 'halal',    'Synthetic non-intoxicating alcohol; widely accepted for topical use.',           'GCC cosmetics scholarship'),
  ('beeswax',           'halal',    'Bee-derived; widely accepted.',                                                   'General halal cosmetics guidance'),
  ('lanolin',           'halal',    'Sheep wool wax; halal when sourced from living animals.',                         'General halal cosmetics guidance'),
  ('hyaluronic acid',   'halal',    'Synthetic or bacterial-fermentation derived in modern cosmetics.',                'Industry standard'),
  ('niacinamide',       'halal',    'Synthetic vitamin B3.',                                                           'Industry standard'),
  ('retinol',           'halal',    'Synthetic vitamin A derivative.',                                                 'Industry standard'),
  ('salicylic acid',    'halal',    'Synthetic BHA.',                                                                  'Industry standard'),
  ('glycerin',          'doubtful', 'Can be plant-, synthetic-, or animal-derived; verify source.',                    'General halal cosmetics guidance'),
  ('squalene',          'doubtful', 'Originally shark-liver-derived; modern squalane is olive- or sugarcane-based.',   'General halal cosmetics guidance'),
  ('keratin',           'doubtful', 'Often animal hair/wool-derived; vegan keratin alternatives exist.',               'General halal cosmetics guidance'),
  ('placenta extract',  'haram',    'Human or animal placenta derivatives are widely considered impermissible.',      'Major fatwa councils')
on conflict (ingredient) do nothing;
