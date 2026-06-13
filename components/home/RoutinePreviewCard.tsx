import { Text, View } from 'react-native';
import { Card } from '../ui/Card';
import { useLanguage } from '../../hooks/useLanguage';
import { useTheme } from '../../hooks/useTheme';
import { colors as brandColors } from '../../constants/colors';

type RoutineWindow = 'AM' | 'PM';

type Step = { name: string; ingredient: string };

type RoutinePreviewCardProps = {
  window: RoutineWindow;
  steps: Step[];
  isPremium: boolean;
  onPress?: () => void;
};

// Today's routine, collapsed. Each step is anchored by a serif ordinal in Brand Rose with
// a Dusty-Pink hairline rule above it — typography-led, not icon-led, in line with the
// Glossier reference in PRODUCT.md. Free users see AM only with a single Gold premium
// nudge in the footer (Gold sits on White per The Premium-Gold Rule).
export function RoutinePreviewCard({
  window,
  steps,
  isPremium,
  onPress,
}: RoutinePreviewCardProps) {
  const { t } = useLanguage();
  const { colors: theme } = useTheme();
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

      <View className="mt-4">
        {steps.map((step, idx) => (
          <View key={step.name}>
            <View
              style={{
                height: 1,
                // Dusty-pink hairline rule between steps — reads as the same
                // affordance on both themes (mute divider, not a sharp line).
                backgroundColor: theme.inkMuted,
                opacity: 0.35,
                marginBottom: 12,
              }}
            />
            <View className={`flex-row items-baseline ${idx === steps.length - 1 ? 'pb-1' : 'pb-3'}`}>
              <Text
                style={{
                  fontFamily: 'DMSerifDisplay-Regular',
                  fontSize: 22,
                  lineHeight: 24,
                  // Brand-invariant — Rose stays the same on both themes.
                  color: brandColors.brandRose,
                  width: 36,
                  letterSpacing: 0.5,
                }}
              >
                {String(idx + 1).padStart(2, '0')}
              </Text>
              <View className="flex-1">
                <Text className="text-[15px] font-medium text-deepMauve">{step.name}</Text>
                <Text className="mt-0.5 text-[13px] text-darkGray">{step.ingredient}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {!isPremium ? (
        <View
          className="mt-3 pt-3"
          // Hairline divider above the premium nudge — softer in dark mode so it
          // doesn't visually compete with the gold copy below.
          style={{ borderTopWidth: 1, borderTopColor: theme.hairline }}
        >
          <Text
            className="text-[12px] font-medium uppercase tracking-[1.5px]"
            // Gold premium nudge is brand-invariant — same hex on both themes.
            style={{ color: brandColors.gold }}
          >
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
