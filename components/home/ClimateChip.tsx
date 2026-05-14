import { Pressable, Text, View } from 'react-native';
import type { TodayClimate } from '../../constants/climate';
import { useLanguage } from '../../hooks/useLanguage';

type ClimateChipProps = {
  climate: TodayClimate;
  onPress?: () => void;
};

// Compact climate readout for the Home greeting band. Sage green when conditions are calm,
// soft amber when UV or humidity warrant attention. Color is paired with text per
// The Score-Triplet Rule: the label always carries the meaning.
export function ClimateChip({ climate, onPress }: ClimateChipProps) {
  const { t } = useLanguage();
  const elevated = climate.flags.length > 0;
  const tone = elevated ? 'bg-warning/20' : 'bg-success/20';
  const dotColor = elevated ? 'bg-warning' : 'bg-success';

  const humidity = t(`home.climate.humidityLabel.${climate.humidityLabel}`);
  const uvText = t(`home.climate.uvLabel.${climate.uvLabel}`);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={t('home.climate.a11yFmt', { uv: uvText, humidity })}
    >
      {({ pressed }) => (
        <View
          className={`flex-row items-center self-start rounded-full px-3 py-1.5 ${tone} ${
            pressed ? 'opacity-80' : ''
          }`}
        >
          <View className={`mr-2 h-1.5 w-1.5 rounded-full ${dotColor}`} />
          <Text className="text-[12px] font-medium text-deepMauve">
            {t('home.climate.uvShort')} {climate.uvIndex} · {humidity} {t('home.climate.humiditySuffix')}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
