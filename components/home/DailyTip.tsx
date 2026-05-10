import { Text, View } from 'react-native';

type DailyTipProps = {
  tip: string;
};

// Inline daily tip on the Blush ground (no card per The Flat-Ground Rule). A small
// glyph cues that this is a tip; the body sits in DM Sans Body 15px Charcoal.
export function DailyTip({ tip }: DailyTipProps) {
  return (
    <View className="flex-row px-5 py-3">
      <View className="mt-1 mr-3 h-1.5 w-1.5 rounded-full bg-success" />
      <View className="flex-1">
        <Text className="text-[12px] font-medium uppercase tracking-[2px] text-success">
          Today's tip
        </Text>
        <Text className="mt-1 text-[15px] leading-[22px] text-charcoal">{tip}</Text>
      </View>
    </View>
  );
}
