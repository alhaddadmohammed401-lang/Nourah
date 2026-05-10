import { SafeAreaView, ScrollView, StatusBar, Text, View } from 'react-native';
import { colors } from '../../constants/colors';
import { GeneratedIcon } from '../../components/ui/GeneratedIcon';

type ProductRecommendation = {
  id: string;
  name: string;
  category: string;
  halalStatus: string;
  reasonEn: string;
  reasonAr: string;
};

const PRODUCT_RECOMMENDATIONS: ProductRecommendation[] = [
  {
    id: 'cleanser',
    name: 'Gentle Gel Cleanser',
    category: 'Cleanse',
    halalStatus: 'Halal-friendly',
    reasonEn: 'Low-foam texture for humid mornings and barrier comfort.',
    reasonAr: 'قوام قليل الرغوة لصباح رطب وراحة حاجز البشرة.',
  },
  {
    id: 'serum',
    name: 'Niacinamide Serum',
    category: 'Treat',
    halalStatus: 'Check fragrance',
    reasonEn: 'Helps reduce shine while keeping the routine light.',
    reasonAr: 'يساعد على تقليل اللمعان مع الحفاظ على روتين خفيف.',
  },
  {
    id: 'sunscreen',
    name: 'SPF 50 Fluid',
    category: 'Protect',
    halalStatus: 'Halal-friendly',
    reasonEn: 'A practical daily finish for UAE UV and pigmentation risk.',
    reasonAr: 'خطوة يومية مناسبة لأشعة الإمارات وخطر التصبغ.',
  },
];

const productsIcon = require('../../assets/icons/nourah-products-icon.png');

// Shows a quiet product surface that previews halal-aware recommendations without commerce clutter.
export default function ProductsScreen() {
  return (
    <View className="flex-1 bg-softBlush">
      <SafeAreaView className="flex-1 bg-softBlush">
        <StatusBar barStyle="dark-content" backgroundColor={colors.softBlush} />

        <View className="flex-1 bg-softBlush">
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-5 pb-10 pt-8">
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-5">
                <Text className="text-[28px] font-semibold text-deepMauve">
                  Products
                </Text>
                <Text className="mt-1 text-[20px] leading-8 text-deepMauve">
                  المنتجات
                </Text>
                <Text className="mt-4 text-[15px] leading-6 text-darkGray">
                  Soft recommendations first. Shopping links come later, after halal and irritant checks are ready.
                </Text>
                <Text className="mt-1 text-[15px] leading-7 text-darkGray">
                  توصيات هادئة أولا. روابط الشراء تأتي لاحقا بعد فحص الحلال والمهيجات.
                </Text>
              </View>

              <View className="h-24 w-24 items-center justify-center rounded-2xl bg-white">
                <GeneratedIcon source={productsIcon} size="lg" />
              </View>
            </View>

            <View className="mt-6 rounded-2xl bg-white p-5">
              <Text className="text-[13px] font-semibold uppercase text-brandRose">
                Today's shelf
              </Text>
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-4">
                  <Text className="mt-3 text-[17px] font-semibold text-deepMauve">
                    Match products to your routine, not trends.
                  </Text>
                  <Text className="mt-2 text-[15px] leading-6 text-darkGray">
                    Pick the step you need, then check the ingredient list before buying.
                  </Text>
                </View>
                <View className="rounded-full bg-softBlush px-3 py-2">
                  <Text className="text-[12px] font-semibold text-brandRose">
                    Calm shelf
                  </Text>
                </View>
              </View>
            </View>

            <View className="mt-5">
              {PRODUCT_RECOMMENDATIONS.map((product) => (
                <View
                  key={product.id}
                  className="mb-4 rounded-2xl border border-lightGray bg-white p-5"
                >
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1 pr-4">
                      <Text className="text-[13px] font-semibold uppercase text-brandRose">
                        {product.category}
                      </Text>
                      <Text className="mt-2 text-[19px] font-semibold text-deepMauve">
                        {product.name}
                      </Text>
                    </View>

                    <View className="rounded-full bg-softLavender px-3 py-2">
                      <Text className="text-[12px] font-semibold text-deepMauve">
                        {product.halalStatus}
                      </Text>
                    </View>
                  </View>

                  <Text className="mt-4 text-[15px] leading-6 text-darkGray">
                    {product.reasonEn}
                  </Text>
                  <Text className="mt-1 text-[15px] leading-7 text-darkGray">
                    {product.reasonAr}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}
