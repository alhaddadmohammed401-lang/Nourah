import { Pressable, Text, View } from 'react-native';
import { useLanguage } from '../../hooks/useLanguage';

type FirstScanCardProps = {
  onPress?: () => void;
};

// Empty-state surface that takes the place of the Score Card before the user has scanned.
// Soft Lavender ground sets it apart from a real result without alarming. Reassurance-first
// copy per PRODUCT.md: "Let's read your skin" leads, the action follows.
export function FirstScanCard({ onPress }: FirstScanCardProps) {
  const { t } = useLanguage();
  const shadow = {
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  } as const;

  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      {({ pressed }) => (
        <View
          className={`rounded-2xl bg-softLavender p-5 ${pressed ? 'opacity-90' : ''}`}
          style={shadow}
        >
          <Text className="text-[12px] font-medium uppercase tracking-[2px] text-deepMauve opacity-70">
            {t('home.firstScan.eyebrow')}
          </Text>
          <Text
            className="mt-2 text-deepMauve"
            style={{
              fontFamily: 'DMSerifDisplay-Regular',
              fontSize: 24,
              fontWeight: '400',
              lineHeight: 30,
            }}
          >
            {t('home.firstScan.title')}
          </Text>
          <Text className="mt-2 text-[15px] leading-6 text-deepMauve opacity-80">
            {t('home.firstScan.body')}
          </Text>
          <View className="mt-4 flex-row items-center">
            <Text className="text-[13px] font-medium text-brandRose">{t('home.firstScan.cta')}</Text>
            <Text className="ml-1 text-[13px] font-medium text-brandRose">→</Text>
          </View>
        </View>
      )}
    </Pressable>
  );
}
