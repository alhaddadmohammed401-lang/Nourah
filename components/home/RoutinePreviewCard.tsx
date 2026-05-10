import { Pressable, Text, View } from 'react-native';
import { Card } from '../ui/Card';

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
  return (
    <Card onPress={onPress}>
      <View className="flex-row items-baseline justify-between">
        <Text className="text-[12px] font-medium uppercase tracking-[2px] text-darkGray">
          Today, {window}
        </Text>
        <Text className="text-[12px] font-medium text-brandRose">
          {steps.length} steps →
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
            Unlock PM with Premium
          </Text>
        </View>
      ) : null}
    </Card>
  );
}

export const SAMPLE_AM_STEPS: Step[] = [
  { name: 'Cleanse', ingredient: 'Gentle gel cleanser' },
  { name: 'Treat', ingredient: 'Niacinamide 5%' },
  { name: 'Protect', ingredient: 'SPF 50 mineral filter' },
];
