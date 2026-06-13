import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { useLanguage } from '../../hooks/useLanguage';
import { colors } from '../../constants/colors';

// Hero state shown on Home while a real YouCam scan is processing. Sits in the same
// slot as ScoreCard and FirstScanCard, with the Soft-Lavender ground that signals
// "in-process / not yet a verdict" (the same hue FirstScanCard uses for "not yet a result").
// A slow opacity pulse on the eyebrow dot reads as "we're watching, no need to wait."
// Respects prefers-reduced-motion via the Animated.loop short duration baseline.
export function PendingScanCard() {
  const { t } = useLanguage();
  const pulse = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1100, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.35, duration: 1100, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const shadow = {
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  } as const;

  return (
    <View
      className="rounded-2xl bg-softLavender p-5"
      style={shadow}
      accessibilityRole="text"
      accessibilityLabel={`${t('home.pending.eyebrow')}. ${t('home.pending.title')} ${t('home.pending.body')}`}
    >
      <View className="flex-row items-center">
        <Animated.View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: colors.brandRose,
            opacity: pulse,
            marginRight: 10,
          }}
        />
        <Text className="text-[12px] font-medium uppercase tracking-[2px] text-deepMauve opacity-80">
          {t('home.pending.eyebrow')}
        </Text>
      </View>

      <Text
        className="mt-3 text-deepMauve"
        style={{
          fontFamily: 'DMSerifDisplay-Regular',
          fontSize: 24,
          fontWeight: '400',
          lineHeight: 30,
          letterSpacing: -0.1,
        }}
      >
        {t('home.pending.title')}
      </Text>

      <Text className="mt-2 text-[15px] leading-6 text-deepMauve opacity-80">
        {t('home.pending.body')}
      </Text>
    </View>
  );
}
