import { SafeAreaView, ScrollView, StatusBar, Text, View } from 'react-native';
import { colors } from '../../constants/colors';
import { GeneratedIcon } from '../../components/ui/GeneratedIcon';
import { useLanguage } from '../../hooks/useLanguage';

const productsIcon = require('../../assets/icons/nourah-products-icon.png');

const PRODUCT_IDS = ['cleanser', 'serum', 'sunscreen'] as const;

// Shows a quiet product surface that previews halal-aware recommendations without commerce clutter.
export default function ProductsScreen() {
  const { t } = useLanguage();

  return (
    <View className="flex-1 bg-softBlush">
      <SafeAreaView className="flex-1 bg-softBlush">
        <StatusBar barStyle="dark-content" backgroundColor={colors.softBlush} />

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-5 pb-10 pt-8">
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-5">
                <Text className="text-[28px] font-semibold text-deepMauve">{t('products.title')}</Text>
                <Text className="mt-3 text-[15px] leading-6 text-darkGray">{t('products.intro')}</Text>
              </View>

              <View className="h-24 w-24 items-center justify-center rounded-2xl bg-white">
                <GeneratedIcon source={productsIcon} size="lg" />
              </View>
            </View>

            <View className="mt-6 rounded-2xl bg-white p-5">
              <Text className="text-[13px] font-semibold uppercase tracking-[2px] text-brandRose">
                {t('products.todayShelfEyebrow')}
              </Text>
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-4">
                  <Text className="mt-3 text-[17px] font-semibold text-deepMauve">
                    {t('products.todayShelfTitle')}
                  </Text>
                  <Text className="mt-2 text-[15px] leading-6 text-darkGray">
                    {t('products.todayShelfBody')}
                  </Text>
                </View>
                <View className="rounded-full bg-softBlush px-3 py-2">
                  <Text className="text-[12px] font-semibold text-brandRose">
                    {t('products.calmShelf')}
                  </Text>
                </View>
              </View>
            </View>

            <View className="mt-5">
              {PRODUCT_IDS.map((id) => {
                const name = t(`products.catalog.${id}.name`);
                const category = t(`products.catalog.${id}.category`);
                const halal = t(`products.catalog.${id}.halal`);
                const reason = t(`products.catalog.${id}.reason`);

                return (
                  <View
                    key={id}
                    className="mb-4 rounded-2xl border border-lightGray bg-white p-5"
                  >
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1 pr-4">
                        <Text className="text-[13px] font-semibold uppercase tracking-[2px] text-brandRose">
                          {category}
                        </Text>
                        <Text className="mt-2 text-[19px] font-semibold text-deepMauve">{name}</Text>
                      </View>

                      <View className="rounded-full bg-softLavender px-3 py-2">
                        <Text className="text-[12px] font-semibold text-deepMauve">{halal}</Text>
                      </View>
                    </View>

                    <Text className="mt-4 text-[15px] leading-6 text-darkGray">{reason}</Text>
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
