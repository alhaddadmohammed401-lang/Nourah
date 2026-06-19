import { Linking, Pressable, SafeAreaView, ScrollView, StatusBar, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';
import { useLanguage } from '../../hooks/useLanguage';
import { useTheme } from '../../hooks/useTheme';
import { useProfile } from '../../hooks/useProfile';
import { usePremiumStatus } from '../../hooks/usePremiumStatus';
import { getRecommendedProducts } from '../../services/affiliateService';
import { type Product } from '../../constants/products';

// Dynamic localization of category badges
const getCategoryLabel = (category: string, lang: string): string => {
  const labels: Record<string, Record<string, string>> = {
    en: {
      cleanser: 'Cleanse',
      moisturizer: 'Hydrate',
      serum: 'Treat',
      sunscreen: 'Protect',
    },
    ar: {
      cleanser: 'تنظيف',
      moisturizer: 'ترطيب',
      serum: 'معالجة',
      sunscreen: 'حماية',
    },
  };
  return labels[lang]?.[category] ?? category;
};

export default function ProductsScreen() {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const { theme, colors: themeColors } = useTheme();
  const { profile } = useProfile();
  const { isPremium } = usePremiumStatus();

  // Load recommended products dynamically based on profile and subscription status
  const recommendedProducts = getRecommendedProducts({
    skinType: profile?.skin_type,
    concerns: profile?.concerns ?? [],
    isPremium,
  });

  const handleShopPress = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (err) {
      console.warn('Could not open affiliate link:', err);
    }
  };

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
              {lang === 'ar'
                ? 'توصيات هادئة مبنية على تحليلات بشرتك. تسوقي مباشرة عبر الروابط الموثوقة.'
                : 'Personalized recommendations tailored to your GCC skin profile. Shop via trusted platforms.'}
            </Text>

            {/* "Scan a product" CTA */}
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

            {/* Section Header */}
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

            {/* Recommended Products List */}
            <View className="mt-4">
              {recommendedProducts.length > 0 ? (
                recommendedProducts.map((product, idx) => {
                  const name = product.name;
                  const category = getCategoryLabel(product.category, lang);
                  const reason = lang === 'ar' ? product.reason_ar : product.reason_en;
                  const halalLabel =
                    product.halal_verdict === 'halal'
                      ? t('products.scan.verdictHalal')
                      : t('products.scan.verdictDoubtful');

                  const isHalal = product.halal_verdict === 'halal';
                  const halalTone = {
                    color: isHalal ? themeColors.success : themeColors.warning,
                    bg: isHalal ? 'rgba(123, 168, 146, 0.12)' : 'rgba(217, 167, 106, 0.14)',
                  };

                  return (
                    <View
                      key={product.id}
                      className={`${idx === 0 ? '' : 'mt-4'} rounded-2xl bg-white p-5`}
                      style={{
                        borderWidth: 1,
                        borderColor: themeColors.hairlineSoft,
                      }}
                    >
                      {/* Product Header */}
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
                            {product.brand} • {category}
                          </Text>
                          <Text
                            className="mt-1 text-deepMauve"
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
                          style={{ backgroundColor: halalTone.bg }}
                        >
                          <Text
                            style={{
                              color: halalTone.color,
                              fontSize: 11,
                              fontWeight: '600',
                              letterSpacing: 0.6,
                            }}
                          >
                            {halalLabel}
                          </Text>
                        </View>
                      </View>

                      {/* Product Description */}
                      <Text className="mt-3 text-[14px] leading-[22px] text-darkGray">
                        {reason}
                      </Text>

                      {/* Affiliate Shopping Buttons */}
                      <View className="mt-4 pt-4 border-t border-lightGray/35 flex-col gap-2">
                        {product.affiliate.amazon_ae && (
                          <Pressable
                            onPress={() => handleShopPress(product.affiliate.amazon_ae)}
                            style={({ pressed }) => ({
                              height: 48,
                              borderRadius: 12,
                              borderWidth: 1,
                              borderColor: themeColors.hairline,
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: pressed ? '#F5F5F5' : '#FFFFFF',
                            })}
                          >
                            <Text
                              style={{
                                color: colors.deepMauve,
                                fontSize: 13,
                                fontWeight: '600',
                              }}
                            >
                              {lang === 'ar' ? 'تسوقي من أمازون الإمارات' : 'Shop on Amazon.ae'}
                            </Text>
                          </Pressable>
                        )}

                        {product.affiliate.iherb && (
                          <Pressable
                            onPress={() => handleShopPress(product.affiliate.iherb!)}
                            style={({ pressed }) => ({
                              height: 48,
                              borderRadius: 12,
                              borderWidth: 1,
                              borderColor: themeColors.hairline,
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: pressed ? '#F5F5F5' : '#FFFFFF',
                            })}
                          >
                            <Text
                              style={{
                                color: colors.deepMauve,
                                fontSize: 13,
                                fontWeight: '600',
                              }}
                            >
                              {lang === 'ar' ? 'تسوقي من آي هيرب' : 'Shop on iHerb'}
                            </Text>
                          </Pressable>
                        )}

                        {product.affiliate.yesstyle && (
                          <Pressable
                            onPress={() => handleShopPress(product.affiliate.yesstyle!)}
                            style={({ pressed }) => ({
                              height: 48,
                              borderRadius: 12,
                              borderWidth: 1,
                              borderColor: themeColors.hairline,
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: pressed ? '#F5F5F5' : '#FFFFFF',
                            })}
                          >
                            <Text
                              style={{
                                color: colors.deepMauve,
                                fontSize: 13,
                                fontWeight: '600',
                              }}
                            >
                              {lang === 'ar' ? 'تسوقي من يس ستايل' : 'Shop on YesStyle'}
                            </Text>
                          </Pressable>
                        )}
                      </View>
                    </View>
                  );
                })
              ) : (
                <View className="p-8 items-center bg-white rounded-2xl">
                  <Text className="text-[14px] text-darkGray text-center">
                    {lang === 'ar'
                      ? 'لا توجد توصيات حالياً تناسب ملفك.'
                      : 'No recommendations match your current profile filters.'}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
