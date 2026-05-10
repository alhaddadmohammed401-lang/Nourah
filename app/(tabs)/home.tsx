import { useRouter } from 'expo-router';
import {
  Pressable,
  SafeAreaView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { colors } from '../../constants/colors';
import { GeneratedIcon } from '../../components/ui/GeneratedIcon';

type HomeRoutineStep = {
  id: string;
  order: string;
  labelEn: string;
  labelAr: string;
};

const HOME_ROUTINE_STEPS: HomeRoutineStep[] = [
  { id: 'cleanse', order: '01', labelEn: 'Cleanse', labelAr: 'تنظيف' },
  { id: 'treat', order: '02', labelEn: 'Treat', labelAr: 'عناية' },
  { id: 'protect', order: '03', labelEn: 'Protect', labelAr: 'حماية' },
];

const homeIcon = require('../../assets/icons/nourah-home-icon.png');
const scanIcon = require('../../assets/icons/nourah-scan-icon.png');

// Shows the daily landing surface and routes users into their routine.
export default function HomeScreen() {
  const router = useRouter();

  // Opens the full routine screen from the home preview card.
  function handleRoutinePress() {
    router.push('/(tabs)/routine');
  }

  return (
    <View className="flex-1 bg-softBlush">
      <SafeAreaView className="flex-1 bg-softBlush">
        <StatusBar barStyle="dark-content" backgroundColor={colors.softBlush} />

        <View className="flex-1 bg-softBlush px-5 pt-8">
        <View className="mb-7 flex-row items-start justify-between">
          <View className="flex-1 pr-5">
            <Text className="text-[34px] font-semibold text-brandRose">
              Nourah
            </Text>
            <Text className="mt-1 text-[19px] leading-8 text-deepMauve">
              نورة
            </Text>
            <Text className="mt-3 text-[15px] leading-6 text-darkGray">
              Your skin, understood.
            </Text>
            <Text className="mt-1 text-[15px] leading-7 text-darkGray">
              بشرتك مفهومة بعناية.
            </Text>
          </View>

          <View className="h-24 w-24 items-center justify-center rounded-2xl bg-white">
            <GeneratedIcon source={homeIcon} size="lg" />
          </View>
        </View>

        <View className="mb-5 rounded-2xl bg-white p-5">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-4">
              <Text className="text-[13px] font-semibold uppercase text-brandRose">
                Today
              </Text>
              <Text className="mt-3 text-[24px] font-semibold text-deepMauve">
                Keep it calm.
              </Text>
              <Text className="mt-2 text-[15px] leading-6 text-darkGray">
                Your morning routine is ready for UAE heat, humidity, and sunscreen days.
              </Text>
              <Text className="mt-1 text-[15px] leading-7 text-darkGray">
                روتينك الصباحي جاهز لحرارة الإمارات والرطوبة وأيام واقي الشمس.
              </Text>
            </View>

            <View className="rounded-full bg-softBlush px-3 py-2">
              <Text className="text-[12px] font-semibold text-brandRose">
                UAE UV
              </Text>
            </View>
          </View>
        </View>

        <Pressable
          className="rounded-2xl border border-lightGray bg-white p-5 active:opacity-80"
          onPress={handleRoutinePress}
          accessibilityRole="button"
          accessibilityLabel="Open today's routine"
        >
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-4">
              <Text className="text-[17px] font-semibold text-deepMauve">
                Morning routine
              </Text>
              <Text className="mt-1 text-[15px] leading-7 text-darkGray">
                روتين الصباح
              </Text>
            </View>

            <View className="items-end">
              <View className="h-14 w-14 items-center justify-center rounded-2xl bg-softBlush">
                <GeneratedIcon source={scanIcon} size="sm" />
              </View>
              <View className="mt-3 rounded-full bg-softBlush px-3 py-2">
                <Text className="text-[13px] font-semibold text-brandRose">
                  Open
                </Text>
              </View>
            </View>
          </View>

          <View className="mt-5">
            {HOME_ROUTINE_STEPS.map((step) => (
              <View key={step.id} className="mb-3 flex-row items-center">
                <View className="mr-3 h-7 w-7 items-center justify-center rounded-full bg-softLavender">
                  <Text className="text-[13px] font-semibold text-brandRose">
                    {step.order}
                  </Text>
                </View>
                <Text className="flex-1 text-[15px] font-medium text-deepMauve">
                  {step.labelEn} | {step.labelAr}
                </Text>
              </View>
            ))}
          </View>

          <Text className="mt-2 text-[13px] leading-5 text-darkGray">
            Tap to check off each step for today.
          </Text>
        </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
