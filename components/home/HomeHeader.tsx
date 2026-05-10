import { Text, View } from 'react-native';
import { ClimateChip } from './ClimateChip';
import type { TodayClimate } from '../../constants/climate';

type HomeHeaderProps = {
  greeting: string;
  name?: string | null;
  dateLabel: string;
  climate: TodayClimate;
  onClimatePress?: () => void;
};

// Top of Home: warm serif greeting, secondary date, climate chip. No card, sits on Blush
// ground per The Flat-Ground Rule. Type breathes here per The Mix Rule (loose region).
export function HomeHeader({
  greeting,
  name,
  dateLabel,
  climate,
  onClimatePress,
}: HomeHeaderProps) {
  const fullGreeting = name ? `${greeting}, ${name}.` : `${greeting}.`;

  return (
    <View className="px-5 pb-4 pt-2">
      <Text className="text-[12px] font-medium uppercase tracking-[2px] text-darkGray">
        {dateLabel}
      </Text>
      <Text
        className="mt-1 text-deepMauve"
        style={{
          fontFamily: 'DMSerifDisplay-Regular',
          fontSize: 28,
          fontWeight: '400',
          lineHeight: 34,
          letterSpacing: -0.2,
        }}
      >
        {fullGreeting}
      </Text>
      <View className="mt-3">
        <ClimateChip climate={climate} onPress={onClimatePress} />
      </View>
    </View>
  );
}
