import { Text, View } from 'react-native';
import { Card } from '../ui/Card';
import { useLanguage } from '../../hooks/useLanguage';

type RoutineWindow = 'AM' | 'PM';

type Step = { name: string; ingredient: string };

type RoutinePreviewCardProps = {
  window: RoutineWindow;
  steps: Step[];
  isPremium: boolean;
  onPress?: () => void;
};

// Today's routine, collapsed. Three steps: name + key ingredient. Tap to open the full
// routine screen. Free users see AM only with a single Gold premium nudge in the footer
// (Gold sits on White, where contrast is fine, per The Premium-Gold Rule).
export function RoutinePreviewCard({
  window,
  steps,
  isPremium,
  onPress,
}: RoutinePreviewCardProps) {
  const { t } = useLanguage();
  const eyebrow =
    window === 'AM' ? t('home.routinePreview.eyebrowAm') : t('home.routinePreview.eyebrowPm');

  return (
    <Card onPress={onPress}>
      <View className="flex-row items-baseline justify-between">
        <Text className="text-[12px] font-medium uppercase tracking-[2px] text-darkGray">
          {eyebrow}
        </Text>
        <Text className="text-[12px] font-medium text-brandRose">
          {t('home.routinePreview.stepsSuffixFmt', { count: steps.length })}
        </Text>
      </View>

      <View className="mt-3">
        {steps.map((step, idx) => (
          <View
            key={step.name}
            className={`flex-row items-center ${idx === 0 ? '' : 'mt-2.5'}`}
          >
            <View className="h-6 w-6 items-center justify-center rounded-full bg-softBlush">
              <Text className="text-[12px] font-medium text-brandRose">{idx + 1}</Text>
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-[15px] font-medium text-deepMauve">{step.name}</Text>
              <Text className="mt-0.5 text-[12px] text-darkGray">{step.ingredient}</Text>
            </View>
          </View>
        ))}
      </View>

      {!isPremium ? (
        <View className="mt-4 border-t border-lightGray pt-3">
          <Text className="text-[12px] font-medium tracking-wide text-gold">
            {t('home.routinePreview.unlockPm')}
          </Text>
        </View>
      ) : null}
    </Card>
  );
}

// The Home preview lives outside React render context for the t() function so it accepts
// a translator. Keeping the steps small and stable here mirrors the routine service mock.
export function buildSampleAmSteps(t: (key: string) => string): Step[] {
  return [
    { name: t('home.routinePreview.stepCleanse'), ingredient: t('home.routinePreview.ingredientCleanse') },
    { name: t('home.routinePreview.stepTreat'), ingredient: t('home.routinePreview.ingredientTreat') },
    { name: t('home.routinePreview.stepProtect'), ingredient: t('home.routinePreview.ingredientProtect') },
  ];
}
