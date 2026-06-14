import { Pressable, SafeAreaView, ScrollView, StatusBar, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';
import { useLanguage } from '../../hooks/useLanguage';
import { useTheme } from '../../hooks/useTheme';

const PRODUCT_IDS = ['cleanser', 'serum', 'sunscreen'] as const;

// Maps the locale's free-form halal verdict string to a UI tone. The English copy currently
// only ships two states ("Halal-friendly" and "Check fragrance"); we keep the mapping
// resilient so when the live product-lookup edge function returns 'halal' / 'haram' /
// 'doubtful' / 'unknown' the same tag UI flexes without rework.
function verdictTone(text: string, themeColors: ReturnType<typeof useTheme>['colors']): {
  color: string;
  bg: string;
} {
  const t = text.toLowerCase();
  if (t.includes('halal') && !t.includes('check')) {
    return { color: themeColors.success, bg: 'rgba(123, 168, 146, 0.12)' };
  }
  if (t.includes('check') || t.includes('doubt')) {
    return { color: themeColors.warning, bg: 'rgba(217, 167, 106, 0.14)' };
  }
  if (t.includes('haram')) {
    return { color: themeColors.error, bg: 'rgba(199, 74, 96, 0.12)' };
  }
  return { color: themeColors.inkSecondary, bg: themeColors.hairlineSoft };
}

// Shows a quiet product surface that previews halal-aware recommendations without
// commerce clutter. PRODUCT.md positions this as "a recommendation from someone who
// knows your skin, not a marketplace," so the page leans on type and quiet hierarchy
// rather than icon-cards and chips.
export default function ProductsScreen() {
  const { t } = useLanguage();
  const router = useRouter();
  const { theme, colors: themeColors } = useTheme();

  return (
    <View className="flex-1 bg-softBlush" style={{ backgroundColor: themeColors.surface }}>
      <SafeAreaView className="flex-1 bg-softBlush" style={{ backgroundColor: themeColors.surface }}>
        <StatusBar
          barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={themeColors.surface}
        />

        <ScrollView
          style={{ flex: 1, backgroundColor: themeColors.surface }}
          contentContainerStyle={{ paddingBottom: 96 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="px-5 pb-10 pt-6">
            <Text
              className="text-deepMauve"
              style={{
                fontFamily: 'DMSerifDisplay-Regular',
                fontSize: 32,
                fontWeight: '400',
                lineHeight: 38,
                letterSpacing: -0.3,
              }}
            >
              {t('products.title')}
            </Text>
            <Text className="mt-2 text-[14px] leading-[22px] text-darkGray">
              {t('products.intro')}
            </Text>

            {/* "Scan a product" CTA — primary action of this tab now that the barcode
              scanner is wired. Brand-Rose pill button + a one-line hint below. Sits
              above the day's shelf so it's the first action a user sees. */}
            <Pressable
              onPress={() => router.push('/(tabs)/scan-product')}
              accessibilityRole="button"
              style={({ pressed }) => ({
                marginTop: 24,
                paddingVertical: 14,
                paddingHorizontal: 20,
                borderRadius: 16,
                backgroundColor: pressed ? '#D4547A' : colors.brandRose,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              })}
            >
              <Text
                style={{
                  color: themeColors.inkOnAccent,
                  fontSize: 15,
                  fontWeight: '600',
                  letterSpacing: 0.4,
                }}
              >
                {t('products.scan.cta')}
              </Text>
              <Text
                style={{ color: themeColors.inkOnAccent, fontSize: 15, marginLeft: 8, opacity: 0.9 }}
              >
                →
              </Text>
            </Pressable>
            <Text className="mt-2 text-center text-[12px] text-darkGray">
              {t('products.scan.ctaHint')}
            </Text>

            {/* Inline section eyebrow + mood tag on the Blush ground (no card). Frames
              the list below without competing with the product surfaces themselves. */}
            <View
              className="mt-8 flex-row items-center"
              style={{
                borderBottomWidth: 1,
                borderBottomColor: themeColors.hairline,
                paddingBottom: 10,
              }}
            >
              <Text
                className="text-darkGray"
                style={{
                  fontSize: 12,
                  fontWeight: '600',
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                }}
              >
                {t('products.todayShelfEyebrow')}
              </Text>
              <View
                className="ml-auto px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: themeColors.accent,
                }}
              >
                <Text
                  className="text-deepMauve"
                  style={{
                    fontSize: 11,
                    fontWeight: '600',
                    letterSpacing: 0.4,
                  }}
                >
                  {t('products.calmShelf')}
                </Text>
              </View>
            </View>

            <View className="mt-4">
              {PRODUCT_IDS.map((id, idx) => {
                const name = t(`products.catalog.${id}.name`);
                const category = t(`products.catalog.${id}.category`);
                const halal = t(`products.catalog.${id}.halal`);
                const reason = t(`products.catalog.${id}.reason`);
                const tone = verdictTone(halal, themeColors);

                return (
                  <View
                    key={id}
                    className={`${idx === 0 ? '' : 'mt-3'} rounded-2xl bg-white p-5`}
                    style={{
                      borderWidth: 1,
                      borderColor: themeColors.hairlineSoft,
                    }}
                  >
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1 pr-3">
                        <Text
                          className="text-brandRose"
                          style={{
                            fontSize: 11,
                            fontWeight: '600',
                            letterSpacing: 1.6,
                            textTransform: 'uppercase',
                          }}
                        >
                          {category}
                        </Text>
                        <Text
                          className="mt-2 text-deepMauve"
                          style={{
                            fontFamily: 'DMSerifDisplay-Regular',
                            fontSize: 22,
                            lineHeight: 28,
                            letterSpacing: -0.1,
                          }}
                        >
                          {name}
                        </Text>
                      </View>

                      <View
                        className="rounded-full px-2.5 py-1.5"
                        style={{ backgroundColor: tone.bg }}
                      >
                        <Text
                          style={{
                            color: tone.color,
                            fontSize: 11,
                            fontWeight: '600',
                            letterSpacing: 0.6,
                          }}
                        >
                          {halal}
                        </Text>
                      </View>
                    </View>

                    <Text className="mt-3 text-[14px] leading-[22px] text-darkGray">
                      {reason}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
