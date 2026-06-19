export type AffiliateLinks = {
  amazon_ae: string;
  iherb?: string;
  yesstyle?: string;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: 'cleanser' | 'moisturizer' | 'serum' | 'sunscreen';
  skinType: 'oily' | 'dry' | 'combination' | 'sensitive' | 'all';
  concerns: string[];
  halal_verdict: 'halal' | 'doubtful';
  reason_en: string;
  reason_ar: string;
  affiliate: AffiliateLinks;
};

// Curated specifically for the GCC climate (extreme UV, high humidity, melasma risk)
// Sourced from reputable brands with tagged affiliate parameters
export const CURATED_PRODUCTS: Product[] = [
  {
    id: 'cerave-hydrating-cleanser',
    name: 'Hydrating Facial Cleanser',
    brand: 'CeraVe',
    category: 'cleanser',
    skinType: 'dry',
    concerns: ['dryness', 'damaged_barrier'],
    halal_verdict: 'halal',
    reason_en: 'Non-foaming cleanser with ceramides to restore the skin barrier in dry GCC summers.',
    reason_ar: 'منظف غير رغوي بالسيراميد لإعادة بناء حاجز البشرة خلال صيف الخليج الجاف.',
    affiliate: {
      amazon_ae: 'https://www.amazon.ae/dp/B01MSSDEPK?tag=nourahapp-21',
      iherb: 'https://ae.iherb.com/pr/cerave-hydrating-facial-cleanser-16-fl-oz-473-ml/109015?rcode=NOURAH10',
    },
  },
  {
    id: 'cosrx-salicylic-cleanser',
    name: 'Salicylic Acid Daily Gentle Cleanser',
    brand: 'COSRX',
    category: 'cleanser',
    skinType: 'oily',
    concerns: ['acne', 'large_pores', 'oily_skin'],
    halal_verdict: 'halal',
    reason_en: 'Formulated with salicylic acid to dissolve sebum and unclog pores under high humidity.',
    reason_ar: 'تركيبة بحمض الساليسيليك لتذويب الدهون وتنظيف المسام في الطقس عالي الرطوبة.',
    affiliate: {
      amazon_ae: 'https://www.amazon.ae/dp/B01C5P98EE?tag=nourahapp-21',
      yesstyle: 'https://www.yesstyle.com/en/info.html/pid.1052684724?rco=NOURAH22',
    },
  },
  {
    id: 'la-roche-posay-effaclar',
    name: 'Effaclar Duo+ Acne Treatment',
    brand: 'La Roche-Posay',
    category: 'serum',
    skinType: 'combination',
    concerns: ['acne', 'pigmentation'],
    halal_verdict: 'halal',
    reason_en: 'Targeted acne correction that reduces red marks and prevents GCC summer breakouts.',
    reason_ar: 'علاج حبوب موضعي يقلل العلامات الحمراء ويمنع الحبوب في صيف الخليج.',
    affiliate: {
      amazon_ae: 'https://www.amazon.ae/dp/B07B9582J8?tag=nourahapp-21',
      iherb: 'https://ae.iherb.com/pr/la-roche-posay-effaclar-duo-dual-action-acne-treatment-0-7-fl-oz-20-ml/112345?rcode=NOURAH10',
    },
  },
  {
    id: 'the-ordinary-niacinamide',
    name: 'Niacinamide 10% + Zinc 1%',
    brand: 'The Ordinary',
    category: 'serum',
    skinType: 'oily',
    concerns: ['oily_skin', 'pigmentation', 'large_pores'],
    halal_verdict: 'halal',
    reason_en: 'High-strength vitamin serum to regulate sebum and clear pigmentation from UV exposure.',
    reason_ar: 'سيروم فيتامين عالي التركيز لضبط الإفرازات الدهنية وتخفيف البقع الداكنة الناتجة عن الشمس.',
    affiliate: {
      amazon_ae: 'https://www.amazon.ae/dp/B0711KZNNC?tag=nourahapp-21',
      iherb: 'https://ae.iherb.com/pr/the-ordinary-niacinamide-10-zinc-1-2-fl-oz-60-ml/109312?rcode=NOURAH10',
    },
  },
  {
    id: 'isntree-watery-sun-gel',
    name: 'Hyaluronic Acid Watery Sun Gel SPF 50+',
    brand: 'Isntree',
    category: 'sunscreen',
    skinType: 'combination',
    concerns: ['sun_damage', 'dryness', 'pigmentation'],
    halal_verdict: 'halal',
    reason_en: 'Lightweight watery texture that leaves no white cast, perfect for GCC sun protection.',
    reason_ar: 'واقي شمسي مائي خفيف للغاية لا يترك أثراً أبيض، مثالي للحماية من شمس الخليج القوية.',
    affiliate: {
      amazon_ae: 'https://www.amazon.ae/dp/B08D3PHK4G?tag=nourahapp-21',
      yesstyle: 'https://www.yesstyle.com/en/info.html/pid.1094400527?rco=NOURAH22',
    },
  },
  {
    id: 'bioderma-photoderm-max',
    name: 'Photoderm Max Aquafluide SPF 50+',
    brand: 'Bioderma',
    category: 'sunscreen',
    skinType: 'sensitive',
    concerns: ['sun_damage', 'pigmentation', 'sensitivity'],
    halal_verdict: 'halal',
    reason_en: 'Ultra-safe fluid sunscreen offering maximum protection for easily irritated GCC skin.',
    reason_ar: 'واقي شمسي سائل فائق الأمان يوفر حماية قصوى للبشرة الحساسة وسريعة التهيج.',
    affiliate: {
      amazon_ae: 'https://www.amazon.ae/dp/B00V4J7Z16?tag=nourahapp-21',
    },
  },
  {
    id: 'cosrx-snail-mucin-cream',
    name: 'Advanced Snail 92 All in One Cream',
    brand: 'COSRX',
    category: 'moisturizer',
    skinType: 'dry',
    concerns: ['dryness', 'damaged_barrier', 'sensitivity'],
    halal_verdict: 'doubtful', // Snail secretion filtrate status can be contested
    reason_en: 'Deeply nourishing cream containing snail mucin to soothe and rehydrate dry skin.',
    reason_ar: 'كريم مغذي بعمق يحتوي على هلام الحلزون لترطيب وتهدئة البشرة الجافة.',
    affiliate: {
      amazon_ae: 'https://www.amazon.ae/dp/B013G73G5Y?tag=nourahapp-21',
      yesstyle: 'https://www.yesstyle.com/en/info.html/pid.1052684732?rco=NOURAH22',
    },
  },
  {
    id: 'cetaphil-moisturizing-lotion',
    name: 'Daily Moisturizing Lotion',
    brand: 'Cetaphil',
    category: 'moisturizer',
    skinType: 'sensitive',
    concerns: ['dryness', 'sensitivity', 'damaged_barrier'],
    halal_verdict: 'halal',
    reason_en: 'Lightweight lotion with niacinamide and panthenol to continuously hydrate sensitive skin.',
    reason_ar: 'لوشن خفيف بالنياسيناميد والبانثينول لترطيب مستمر للبشرة الحساسة.',
    affiliate: {
      amazon_ae: 'https://www.amazon.ae/dp/B07CX7F678?tag=nourahapp-21',
      iherb: 'https://ae.iherb.com/pr/cetaphil-daily-hydrating-lotion-3-fl-oz-88-ml/108912?rcode=NOURAH10',
    },
  },
];
