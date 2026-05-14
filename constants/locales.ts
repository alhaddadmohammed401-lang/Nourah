// All user-facing strings for the post-auth surface. Pre-auth flows (login, signup,
// onboarding) are seen once per lifetime and currently retain their bilingual stacked
// copy; they migrate here when next touched. Keep en and ar shape-identical so t()
// never returns a missing key.

export type Lang = 'en' | 'ar';

const en = {
  tabs: {
    home: 'Home',
    scan: 'Scan',
    products: 'Products',
    profile: 'Profile',
  },
  common: {
    back: 'Back',
    done: 'Done',
    tryAgain: 'Try again',
    cancel: 'Cancel',
  },
  home: {
    greeting: {
      morning: 'Good morning',
      afternoon: 'Good afternoon',
      evening: 'Good evening',
      night: 'Still up',
    },
    cta: {
      firstScan: 'Start your first scan',
      scanNow: 'Scan now',
      scanAgain: 'Scan again',
      staleHint: "It's been a while. Quick check?",
    },
    score: {
      categoryGreen: 'Overall, looking good',
      categoryAmber: 'Overall, keep an eye out',
      categoryRed: 'Overall, take it easy',
      reassureGreen: 'Your skin is doing well today.',
      reassureAmber: 'A few things to watch. Nothing urgent.',
      reassureRed: "Let's take it gentle today.",
      lastScanFmt: 'Last scan {days} days ago',
      loadingLabel: 'Loading your latest scan',
    },
    firstScan: {
      eyebrow: 'First step',
      title: "Let's read your skin.",
      body: 'A quick scan tells us where you are today. Everything we suggest after this is built on what we find.',
      cta: 'Start your first scan',
    },
    tip: {
      eyebrow: "Today's tip",
    },
    error: {
      title: "Can't reach your data right now.",
      retry: 'Pull down to retry',
    },
    routinePreview: {
      eyebrowAm: 'Today, AM',
      eyebrowPm: 'Today, PM',
      stepsSuffixFmt: '{count} steps →',
      unlockPm: 'Unlock PM with Premium',
      stepCleanse: 'Cleanse',
      stepTreat: 'Treat',
      stepProtect: 'Protect',
      ingredientCleanse: 'Gentle gel cleanser',
      ingredientTreat: 'Niacinamide 5%',
      ingredientProtect: 'SPF 50 mineral filter',
    },
    climate: {
      uvShort: 'UV',
      humiditySuffix: 'humidity',
      uvLabel: { Low: 'Low', Moderate: 'Moderate', High: 'High', 'Very High': 'Very High', Extreme: 'Extreme' },
      humidityLabel: { Dry: 'Dry', Moderate: 'Moderate', High: 'High', 'Very High': 'Very High' },
      a11yFmt: "Today's climate. UV {uv}, humidity {humidity}.",
    },
    flags: {
      high_uv: 'High UV',
      humidity_warning: 'High humidity',
      melasma_risk: 'Melasma watch',
    },
  },
  scan: {
    closeA11y: 'Close scan',
    holdStill: 'HOLD STILL',
    instructions: 'Center your face in the oval. Soft front light works best.',
    start: 'Start scan',
    analyzing: 'ANALYZING…',
    errorFallback: 'Could not read your skin. Try again.',
    yourReading: 'Your reading',
    done: 'Done',
  },
  routine: {
    titleAm: 'Your morning.',
    titlePm: 'Your evening.',
    intro: 'Three calm steps for GCC heat, sunscreen days, and steady skin.',
    tabAm: 'AM',
    tabPm: 'PM',
    premiumChip: 'Premium',
    tunedForFmt: 'Tuned for your {band} skin today.',
    bandLabelGreen: 'green-band',
    bandLabelAmber: 'amber-band',
    bandLabelRed: 'red-band',
    reassureGreen: 'Your skin looks steady today. Keep the routine calm and consistent.',
    reassureAmber: 'A few things to watch. Stay gentle.',
    reassureRed: "Let's take it easy today.",
    stepsToday: 'Steps today',
    completedFmt: 'Completed: {done} of {total}',
    premiumEyebrow: 'Premium PM routine',
    premiumTitle: 'Evening care, tuned for repair.',
    premiumBody: 'Unlock the evening routine for repair-focused PM care.',
    back: 'Back to home',
    loadingTitle: 'Preparing your routine',
    loadingBody: 'A calm moment while we tune today.',
    needsRefresh: 'Routine needs a refresh.',
    retry: 'Try again',
    stepSaveError: 'This step could not be saved. Please try again.',
    progressLoadError: 'Saved routine progress could not be loaded. You can still use the routine.',
    a11yStepFmt: '{title}, {state}',
    a11yStateCompleted: 'completed',
    a11yStateNotCompleted: 'not completed',
    step: {
      'am-cleanse': { title: 'Cleanse', body: 'Use a gentle low-foam cleanser, then pat dry without rubbing.', ingredient: 'Barrier-friendly surfactants' },
      'am-treat': { title: 'Treat', body: 'Apply a light niacinamide serum to calm shine and support tone.', ingredient: 'Niacinamide' },
      'am-protect': { title: 'Protect', body: 'Finish with SPF 50, especially before UAE midday sun.', ingredient: 'Broad spectrum SPF' },
      'pm-cleanse': { title: 'Cleanse', body: 'Remove sunscreen fully with a soft cleanse before treatment.', ingredient: 'Gentle cleanser' },
      'pm-treat': { title: 'Treat', body: 'Use a calm barrier serum on warm, humid nights.', ingredient: 'Panthenol' },
      'pm-restore': { title: 'Restore', body: 'Seal with a light moisturizer that will not feel heavy.', ingredient: 'Ceramides' },
    },
  },
  profile: {
    title: 'Profile',
    subtitle: 'Your skin record, settings, and subscription status in one calm place.',
    memberFallback: 'Nourah member',
    previewAccount: 'Preview account',
    freePlan: 'Free plan',
    premiumPlan: 'Premium',
    statsTitle: 'Your skin record',
    statScans: 'Scans',
    statRoutineDays: 'Routine days',
    statCheckedProducts: 'Checked products',
    settingsTitle: 'Settings',
    languageLabel: 'Language',
    languageEnglish: 'English',
    languageArabic: 'العربية',
    restartHint: 'Restart the app to fully apply right-to-left layout.',
    dermEyebrow: 'Dermatologist-backed',
    dermBody: 'Nourah is guided by quiet expertise from a licensed dermatologist in Dubai.',
    signOut: 'Sign out',
  },
  products: {
    title: 'Products',
    intro: 'Soft recommendations first. Shopping links come later, after halal and irritant checks are ready.',
    todayShelfEyebrow: "Today's shelf",
    todayShelfTitle: 'Match products to your routine, not trends.',
    todayShelfBody: 'Pick the step you need, then check the ingredient list before buying.',
    calmShelf: 'Calm shelf',
    catalog: {
      cleanser: { name: 'Gentle Gel Cleanser', category: 'Cleanse', halal: 'Halal-friendly', reason: 'Low-foam texture for humid mornings and barrier comfort.' },
      serum: { name: 'Niacinamide Serum', category: 'Treat', halal: 'Check fragrance', reason: 'Helps reduce shine while keeping the routine light.' },
      sunscreen: { name: 'SPF 50 Fluid', category: 'Protect', halal: 'Halal-friendly', reason: 'A practical daily finish for UAE UV and pigmentation risk.' },
    },
  },
} as const;

const ar: typeof en = {
  tabs: {
    home: 'الرئيسية',
    scan: 'فحص',
    products: 'المنتجات',
    profile: 'الملف',
  },
  common: {
    back: 'رجوع',
    done: 'تم',
    tryAgain: 'حاولي مرة أخرى',
    cancel: 'إلغاء',
  },
  home: {
    greeting: {
      morning: 'صباح الخير',
      afternoon: 'مساء جميل',
      evening: 'مساء الخير',
      night: 'لا تزالين مستيقظة',
    },
    cta: {
      firstScan: 'ابدئي فحصك الأول',
      scanNow: 'افحصي الآن',
      scanAgain: 'افحصي مرة أخرى',
      staleHint: 'مرّ وقت. فحص سريع؟',
    },
    score: {
      categoryGreen: 'بشكل عام، تبدين بخير',
      categoryAmber: 'بشكل عام، انتبهي قليلا',
      categoryRed: 'بشكل عام، خذي يومك بهدوء',
      reassureGreen: 'بشرتك بخير اليوم.',
      reassureAmber: 'بعض الأمور تستدعي الانتباه. لا شيء عاجل.',
      reassureRed: 'لنأخذ اليوم بلطف.',
      lastScanFmt: 'آخر فحص قبل {days} يوم',
      loadingLabel: 'جاري تحميل آخر فحص',
    },
    firstScan: {
      eyebrow: 'الخطوة الأولى',
      title: 'لنقرأ بشرتك.',
      body: 'فحص سريع يخبرنا أين أنت اليوم. كل ما نقترحه بعد ذلك مبني على ما نجده.',
      cta: 'ابدئي فحصك الأول',
    },
    tip: {
      eyebrow: 'نصيحة اليوم',
    },
    error: {
      title: 'لا يمكننا الوصول إلى بياناتك الآن.',
      retry: 'اسحبي للأسفل للمحاولة',
    },
    routinePreview: {
      eyebrowAm: 'اليوم، صباحا',
      eyebrowPm: 'اليوم، مساء',
      stepsSuffixFmt: '{count} خطوات ←',
      unlockPm: 'افتحي روتين المساء مع Premium',
      stepCleanse: 'تنظيف',
      stepTreat: 'عناية',
      stepProtect: 'حماية',
      ingredientCleanse: 'منظف جل لطيف',
      ingredientTreat: 'نياسيناميد ٥٪',
      ingredientProtect: 'واقي شمس SPF 50 معدني',
    },
    climate: {
      uvShort: 'الأشعة',
      humiditySuffix: 'رطوبة',
      uvLabel: { Low: 'منخفضة', Moderate: 'معتدلة', High: 'عالية', 'Very High': 'مرتفعة جدا', Extreme: 'قصوى' },
      humidityLabel: { Dry: 'جافة', Moderate: 'معتدلة', High: 'عالية', 'Very High': 'مرتفعة جدا' },
      a11yFmt: 'مناخ اليوم. الأشعة {uv}، الرطوبة {humidity}.',
    },
    flags: {
      high_uv: 'أشعة قوية',
      humidity_warning: 'رطوبة عالية',
      melasma_risk: 'احتمال كلف',
    },
  },
  scan: {
    closeA11y: 'إغلاق الفحص',
    holdStill: 'لا تتحركي',
    instructions: 'ضعي وجهك داخل البيضاوي. الإضاءة الأمامية اللطيفة تعطي أفضل نتيجة.',
    start: 'ابدئي الفحص',
    analyzing: 'جاري التحليل…',
    errorFallback: 'لم نتمكن من قراءة بشرتك. حاولي مرة أخرى.',
    yourReading: 'قراءتك',
    done: 'تم',
  },
  routine: {
    titleAm: 'صباحك.',
    titlePm: 'مساؤك.',
    intro: 'ثلاث خطوات هادئة تناسب حرارة الخليج وأيام واقي الشمس.',
    tabAm: 'صباح',
    tabPm: 'مساء',
    premiumChip: 'بريميوم',
    tunedForFmt: 'مهيأ لبشرتك في {band} اليوم.',
    bandLabelGreen: 'النطاق الأخضر',
    bandLabelAmber: 'النطاق البرتقالي',
    bandLabelRed: 'النطاق الأحمر',
    reassureGreen: 'بشرتك تبدو مستقرة اليوم. حافظي على روتين هادئ وثابت.',
    reassureAmber: 'بعض الأمور تستدعي الانتباه. ابقي لطيفة.',
    reassureRed: 'لنأخذ اليوم بهدوء.',
    stepsToday: 'خطوات اليوم',
    completedFmt: 'أنجزت: {done} من {total}',
    premiumEyebrow: 'روتين بريميوم المسائي',
    premiumTitle: 'عناية مسائية مهيأة للترميم.',
    premiumBody: 'افتحي روتين المساء لعناية ليلية تركز على الترميم.',
    back: 'العودة للرئيسية',
    loadingTitle: 'نجهز روتينك',
    loadingBody: 'لحظة هادئة بينما نهيّئ يومك.',
    needsRefresh: 'الروتين بحاجة إلى تحديث.',
    retry: 'حاولي مرة أخرى',
    stepSaveError: 'تعذر حفظ هذه الخطوة. حاولي مرة أخرى.',
    progressLoadError: 'تعذر تحميل تقدمك المحفوظ. لا يزال بإمكانك متابعة الروتين.',
    a11yStepFmt: '{title}، {state}',
    a11yStateCompleted: 'مكتملة',
    a11yStateNotCompleted: 'غير مكتملة',
    step: {
      'am-cleanse': { title: 'تنظيف', body: 'استخدمي منظفا لطيفا قليل الرغوة، ثم جففي البشرة بلطف.', ingredient: 'منظفات لطيفة على الحاجز' },
      'am-treat': { title: 'عناية', body: 'ضعي سيروم نياسيناميد خفيفا لتهدئة اللمعان وتوحيد المظهر.', ingredient: 'نياسيناميد' },
      'am-protect': { title: 'حماية', body: 'اختمي بواقي شمس SPF 50، خصوصا قبل شمس الظهيرة في الإمارات.', ingredient: 'حماية واسعة الطيف' },
      'pm-cleanse': { title: 'تنظيف', body: 'أزيلي واقي الشمس بالكامل بتنظيف لطيف قبل خطوة العناية.', ingredient: 'منظف لطيف' },
      'pm-treat': { title: 'عناية', body: 'استخدمي سيروم داعم للحاجز في الليالي الدافئة والرطبة.', ingredient: 'بانثينول' },
      'pm-restore': { title: 'ترميم', body: 'اختمي بمرطب خفيف لا يترك شعورا ثقيلا.', ingredient: 'سيراميدات' },
    },
  },
  profile: {
    title: 'الملف الشخصي',
    subtitle: 'سجل بشرتك، إعداداتك، واشتراكك في مكان هادئ واحد.',
    memberFallback: 'عضوة في نورة',
    previewAccount: 'حساب تجريبي',
    freePlan: 'الخطة المجانية',
    premiumPlan: 'بريميوم',
    statsTitle: 'سجل بشرتك',
    statScans: 'الفحوصات',
    statRoutineDays: 'أيام الروتين',
    statCheckedProducts: 'منتجات مفحوصة',
    settingsTitle: 'الإعدادات',
    languageLabel: 'اللغة',
    languageEnglish: 'English',
    languageArabic: 'العربية',
    restartHint: 'أعيدي تشغيل التطبيق لتفعيل الاتجاه من اليمين إلى اليسار بالكامل.',
    dermEyebrow: 'مدعومة من طبيبة جلدية',
    dermBody: 'نورة مبنية على خبرة هادئة من طبيبة جلدية مرخصة في دبي.',
    signOut: 'تسجيل الخروج',
  },
  products: {
    title: 'المنتجات',
    intro: 'توصيات هادئة أولا. روابط الشراء تأتي لاحقا بعد فحص الحلال والمهيجات.',
    todayShelfEyebrow: 'رف اليوم',
    todayShelfTitle: 'اختاري المنتجات بحسب روتينك، لا الموضة.',
    todayShelfBody: 'حددي الخطوة التي تحتاجين، ثم راجعي قائمة المكونات قبل الشراء.',
    calmShelf: 'رف هادئ',
    catalog: {
      cleanser: { name: 'منظف جل لطيف', category: 'تنظيف', halal: 'حلال', reason: 'قوام قليل الرغوة لصباح رطب وراحة حاجز البشرة.' },
      serum: { name: 'سيروم نياسيناميد', category: 'عناية', halal: 'راجعي العطر', reason: 'يساعد على تقليل اللمعان مع الحفاظ على روتين خفيف.' },
      sunscreen: { name: 'واقي شمس SPF 50', category: 'حماية', halal: 'حلال', reason: 'خطوة يومية مناسبة لأشعة الإمارات وخطر التصبغ.' },
    },
  },
};

export const LOCALES: Record<Lang, typeof en> = { en, ar };

// Resolves a dotted key path against a locale dictionary; returns the key as fallback so a
// missing translation never crashes the screen, only shows debug-shaped text.
export function resolve(
  lang: Lang,
  key: string,
  vars?: Record<string, string | number>
): string {
  const parts = key.split('.');
  let cursor: unknown = LOCALES[lang];

  for (const part of parts) {
    if (cursor && typeof cursor === 'object' && part in (cursor as Record<string, unknown>)) {
      cursor = (cursor as Record<string, unknown>)[part];
    } else {
      return key;
    }
  }

  if (typeof cursor !== 'string') return key;
  if (!vars) return cursor;

  return cursor.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? ''));
}
