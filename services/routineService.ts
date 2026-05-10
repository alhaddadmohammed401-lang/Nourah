export type RoutineTimeOfDay = 'am' | 'pm';

export type RoutineSkinBand = 'green' | 'amber' | 'red';

export type RoutineStep = {
  id: string;
  timeOfDay: RoutineTimeOfDay;
  stepNumber: number;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  ingredientEn: string;
  ingredientAr: string;
};

export type RoutinePlan = {
  isPremium: boolean;
  skinBand: RoutineSkinBand;
  bandGlyph: string;
  bandLabelEn: string;
  bandLabelAr: string;
  reassuranceEn: string;
  reassuranceAr: string;
  amSteps: RoutineStep[];
  pmSteps: RoutineStep[];
  premiumHintEn: string;
  premiumHintAr: string;
};

export type RoutineServiceResult = {
  data: RoutinePlan | null;
  error: string | null;
};

const MOCK_AM_STEPS: RoutineStep[] = [
  {
    id: 'cleanse',
    timeOfDay: 'am',
    stepNumber: 1,
    titleEn: 'Cleanse',
    titleAr: 'تنظيف',
    descriptionEn: 'Use a gentle low-foam cleanser, then pat dry without rubbing.',
    descriptionAr: 'استخدمي منظفا لطيفا قليل الرغوة، ثم جففي البشرة بلطف.',
    ingredientEn: 'Barrier-friendly surfactants',
    ingredientAr: 'منظفات لطيفة على الحاجز',
  },
  {
    id: 'treat',
    timeOfDay: 'am',
    stepNumber: 2,
    titleEn: 'Treat',
    titleAr: 'عناية',
    descriptionEn: 'Apply a light niacinamide serum to calm shine and support tone.',
    descriptionAr: 'ضعي سيروم نياسيناميد خفيفا لتهدئة اللمعان وتوحيد المظهر.',
    ingredientEn: 'Niacinamide',
    ingredientAr: 'نياسيناميد',
  },
  {
    id: 'protect',
    timeOfDay: 'am',
    stepNumber: 3,
    titleEn: 'Protect',
    titleAr: 'حماية',
    descriptionEn: 'Finish with SPF 50, especially before UAE midday sun.',
    descriptionAr: 'اختتمي بواقي شمس SPF 50، خصوصا قبل شمس الظهيرة في الإمارات.',
    ingredientEn: 'Broad spectrum SPF',
    ingredientAr: 'حماية واسعة الطيف',
  },
];

const MOCK_PM_STEPS: RoutineStep[] = [
  {
    id: 'pm-cleanse',
    timeOfDay: 'pm',
    stepNumber: 1,
    titleEn: 'Cleanse',
    titleAr: 'تنظيف',
    descriptionEn: 'Remove sunscreen fully with a soft cleanse before treatment.',
    descriptionAr: 'أزيلي واقي الشمس بالكامل بتنظيف لطيف قبل خطوة العناية.',
    ingredientEn: 'Gentle cleanser',
    ingredientAr: 'منظف لطيف',
  },
  {
    id: 'pm-treat',
    timeOfDay: 'pm',
    stepNumber: 2,
    titleEn: 'Treat',
    titleAr: 'عناية',
    descriptionEn: 'Use a calm barrier serum on warm, humid nights.',
    descriptionAr: 'استخدمي سيروم داعم للحاجز في الليالي الدافئة والرطبة.',
    ingredientEn: 'Panthenol',
    ingredientAr: 'بانثينول',
  },
  {
    id: 'pm-restore',
    timeOfDay: 'pm',
    stepNumber: 3,
    titleEn: 'Restore',
    titleAr: 'ترميم',
    descriptionEn: 'Seal with a light moisturizer that will not feel heavy.',
    descriptionAr: 'اختمي بمرطب خفيف لا يترك شعورا ثقيلا.',
    ingredientEn: 'Ceramides',
    ingredientAr: 'سيراميدات',
  },
];

const MOCK_ROUTINE_PLAN: RoutinePlan = {
  isPremium: false,
  skinBand: 'green',
  bandGlyph: '✓',
  bandLabelEn: 'Green band',
  bandLabelAr: 'النطاق الأخضر',
  reassuranceEn: 'Your skin looks steady today. Keep the routine calm and consistent.',
  reassuranceAr: 'بشرتك تبدو مستقرة اليوم. حافظي على روتين هادئ وثابت.',
  amSteps: MOCK_AM_STEPS,
  pmSteps: MOCK_PM_STEPS,
  premiumHintEn: 'Unlock the evening routine for repair-focused PM care.',
  premiumHintAr: 'افتحي روتين المساء لعناية ليلية تركز على الترميم.',
};

// Returns a local mock plan so routine UI can ship before Gemini and RevenueCat are connected.
export async function getRoutinePlan(): Promise<RoutineServiceResult> {
  try {
    return { data: MOCK_ROUTINE_PLAN, error: null };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Routine plan could not be prepared. Please try again.';

    return { data: null, error: message };
  }
}
