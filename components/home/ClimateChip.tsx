import { Pressable, Text, View } from 'react-native';
import type { TodayClimate } from '../../constants/climate';

type ClimateChipProps = {
  climate: TodayClimate;
  onPress?: () => void;
};

// Compact climate readout for the Home greeting band. Sage green when conditions are calm,
// soft amber when UV or humidity warrant attention. Color is paired with text per
// The Score-Triplet Rule: the label always carries the meaning.
export function ClimateChip({ climate, onPress }: ClimateChipProps) {
  const elevated = climate.flags.length > 0;
  const tone = elevated ? 'bg-warning/20' : 'bg-success/20';
  const dotColor = elevated ? 'bg-warning' : 'bg-success';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Today's climate. UV ${climate.uvLabel}, humidity ${climate.humidityLabel}.`}
    >
      {({ pressed }) => (
        <View
          className={`flex-row items-center self-start rounded-full px-3 py-1.5 ${tone} ${
            pressed ? 'opacity-80' : ''
          }`}
        >
          <View className={`mr-2 h-1.5 w-1.5 rounded-full ${dotColor}`} />
          <Text className="text-[12px] font-medium text-deepMauve">
            UV {climate.uvIndex} · {climate.humidityLabel} humidity
          </Text>
        </View>
      )}
    </Pressable>
  );
}
