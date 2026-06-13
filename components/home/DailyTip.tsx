import { Text, View } from 'react-native';
import { useLanguage } from '../../hooks/useLanguage';
import { useTheme } from '../../hooks/useTheme';

type DailyTipProps = {
  tip: string;
};

// Inline daily tip on the Blush ground (no card per The Flat-Ground Rule). Anchored by a
// thin Soft-Lavender vertical bar instead of a dot — same affordance, more crafted, gives
// the section a deliberate left edge that doesn't compete with the routine card above.
// Per the impeccable absolute bans, the bar is decorative atmosphere (not a side-stripe
// alert), so it's deliberately on the section's own ground, not on a card.
export function DailyTip({ tip }: DailyTipProps) {
  const { t } = useLanguage();
  const { colors } = useTheme();

  return (
    <View className="flex-row px-5 py-3">
      <View
        style={{
          width: 2,
          // Tiny tint variant — same role on both themes (left-edge atmosphere bar).
          backgroundColor: colors.surfaceMuted,
          marginRight: 14,
          borderRadius: 1,
        }}
      />
      <View className="flex-1">
        <Text className="text-[12px] font-medium uppercase tracking-[2px] text-darkGray">
          {t('home.tip.eyebrow')}
        </Text>
        <Text className="mt-1.5 text-[15px] leading-[22px] text-charcoal">{tip}</Text>
      </View>
    </View>
  );
}
