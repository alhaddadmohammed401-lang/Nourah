import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { colors } from '../constants/colors';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import {
  initializePurchases,
  getActiveOffering,
  purchasePackage,
  restorePurchases,
} from '../services/revenueCatService';
import { Button } from '../components/ui/Button';

type PlanOption = {
  id: string;
  pkg: any; // RevenueCat package
  title: string;
  price: string;
  badge?: string;
};

export default function PaywallScreen() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const { theme, colors: themeColors } = useTheme();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('annual');
  const [plans, setPlans] = useState<PlanOption[]>([]);

  useEffect(() => {
    async function loadOfferings() {
      if (user?.id) {
        await initializePurchases(user.id);
      }
      const offering = await getActiveOffering();
      
      if (offering && offering.availablePackages.length > 0) {
        const parsed = offering.availablePackages.map((pkg) => {
          const isAnnual = pkg.packageType === 'ANNUAL';
          return {
            id: isAnnual ? 'annual' : 'monthly',
            pkg,
            title: isAnnual ? t('paywall.annual') : t('paywall.monthly'),
            price: pkg.product.priceString,
            badge: isAnnual ? t('paywall.bestValue') : t('paywall.trial'),
          };
        });
        setPlans(parsed);
        // Default to annual if available, otherwise first plan
        const hasAnnual = parsed.some((p) => p.id === 'annual');
        setSelectedPlan(hasAnnual ? 'annual' : parsed[0].id);
      } else {
        // Fallback plans if RevenueCat is not fully configured/unreachable
        setPlans([
          {
            id: 'monthly',
            pkg: null,
            title: t('paywall.monthly'),
            price: t('paywall.monthlyPrice'),
            badge: t('paywall.trial'),
          },
          {
            id: 'annual',
            pkg: null,
            title: t('paywall.annual'),
            price: t('paywall.annualPrice'),
            badge: t('paywall.bestValue'),
          },
        ]);
        setSelectedPlan('annual');
      }
      setLoading(false);
    }
    void loadOfferings();
  }, [user?.id, t]);

  const handleSubscribe = async () => {
    const selected = plans.find((p) => p.id === selectedPlan);
    if (!selected) return;

    setPurchasing(true);
    if (selected.pkg) {
      const success = await purchasePackage(selected.pkg);
      if (success) {
        Alert.alert(
          lang === 'ar' ? 'تم التفعيل!' : 'Premium Activated!',
          lang === 'ar' ? 'شكراً لك على اشتراكك في نورة بريميوم.' : 'Thank you for subscribing to Nourah Premium.',
          [{ text: t('scan.done'), onPress: () => router.replace('/(tabs)') }]
        );
      } else {
        Alert.alert(
          lang === 'ar' ? 'فشل الاشتراك' : 'Subscription Failed',
          lang === 'ar' ? 'لم نتمكن من إتمام عملية الشراء.' : 'Could not complete your purchase. Please try again.'
        );
      }
    } else {
      // Mock activation when offline/local fallback
      Alert.alert(
        lang === 'ar' ? 'طلب تجريبي' : 'Sandbox Mode',
        lang === 'ar' ? 'سيتم تفعيل الوضع التجريبي المميز.' : 'Activating premium sandbox mode.',
        [{ text: t('scan.done'), onPress: () => router.replace('/(tabs)') }]
      );
    }
    setPurchasing(false);
  };

  const handleRestore = async () => {
    setPurchasing(true);
    const success = await restorePurchases();
    if (success) {
      Alert.alert(
        lang === 'ar' ? 'تمت الاستعادة!' : 'Purchases Restored!',
        lang === 'ar' ? 'تم تفعيل اشتراكك المميز بنجاح.' : 'Your premium access has been successfully restored.',
        [{ text: t('scan.done'), onPress: () => router.replace('/(tabs)') }]
      );
    } else {
      Alert.alert(
        lang === 'ar' ? 'لا توجد مشتريات' : 'No Purchases Found',
        lang === 'ar' ? 'لا يوجد اشتراك نشط لاستعادته.' : 'No active premium subscriptions found to restore.'
      );
    }
    setPurchasing(false);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-softBlush justify-center items-center" style={{ backgroundColor: themeColors.surface }}>
        <ActivityIndicator size="large" color={colors.brandRose} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-softBlush" style={{ backgroundColor: themeColors.surface }}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={themeColors.surface}
      />
      
      {/* Header bar */}
      <View className="px-5 py-4 flex-row items-center justify-between">
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Back"
          hitSlop={12}
          className="w-10 h-10 items-center justify-center rounded-full bg-lightGray/10"
        >
          <Text style={{ color: themeColors.ink, fontSize: 24, fontWeight: '300' }}>×</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
        <View className="px-5 items-center">
          {/* Brand/Product Identity */}
          <View className="items-center mt-2 mb-8">
            <Text
              style={{
                fontFamily: 'DMSerifDisplay-Regular',
                fontSize: 36,
                lineHeight: 42,
                color: colors.deepMauve,
                textAlign: 'center',
              }}
            >
              {t('paywall.title')}
            </Text>
            <Text className="mt-2 text-[15px] text-darkGray text-center px-4">
              {t('paywall.subtitle')}
            </Text>
          </View>

          {/* Premium Benefits Card */}
          <View
            className="w-full bg-white p-6 rounded-2xl mb-8"
            style={{
              borderWidth: 1,
              borderColor: 'rgba(212, 160, 167, 0.25)',
              shadowColor: '#1A1A1A',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.05,
              shadowRadius: 16,
              elevation: 3,
            }}
          >
            {[1, 2, 3, 4].map((num) => (
              <View key={num} className={`flex-row items-start ${num === 1 ? '' : 'mt-4'}`}>
                <View className="w-5 h-5 rounded-full bg-brandRose/12 items-center justify-center mr-3 mt-0.5">
                  <Text className="text-brandRose text-[12px] font-bold">✓</Text>
                </View>
                <Text className="flex-1 text-[14px] leading-5 text-charcoal">
                  {t(`paywall.feature${num}` as any)}
                </Text>
              </View>
            ))}
          </View>

          {/* Plans Selection */}
          <View className="w-full gap-3 mb-8">
            {plans.map((plan) => {
              const isSelected = selectedPlan === plan.id;
              return (
                <Pressable
                  key={plan.id}
                  onPress={() => setSelectedPlan(plan.id)}
                  className={`w-full p-5 rounded-2xl flex-row items-center justify-between ${
                    isSelected ? 'bg-white border-2' : 'bg-white/60 border'
                  }`}
                  style={{
                    borderColor: isSelected ? colors.brandRose : 'rgba(212, 160, 167, 0.25)',
                  }}
                >
                  <View className="flex-row items-center flex-1">
                    <View
                      className={`w-5 h-5 rounded-full border items-center justify-center mr-3 ${
                        isSelected ? 'border-brandRose bg-brandRose' : 'border-lightGray'
                      }`}
                    >
                      {isSelected && <View className="w-2.5 h-2.5 rounded-full bg-white" />}
                    </View>
                    <View className="flex-1">
                      <Text
                        className="text-[16px] text-deepMauve"
                        style={{ fontFamily: 'DMSans-Medium' }}
                      >
                        {plan.title}
                      </Text>
                      {plan.badge && (
                        <Text className="text-[11px] font-semibold text-brandRose uppercase tracking-wider mt-0.5">
                          {plan.badge}
                        </Text>
                      )}
                    </View>
                  </View>
                  <Text
                    className="text-[18px] text-deepMauve"
                    style={{ fontFamily: 'DMSerifDisplay-Regular' }}
                  >
                    {plan.price}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Subscribe Call to Action */}
          <View className="w-full px-1">
            <Button
              label={t('paywall.subscribe')}
              onPress={handleSubscribe}
              loading={purchasing}
              fullWidth={true}
            />
            
            <Pressable
              onPress={handleRestore}
              disabled={purchasing}
              className="mt-5 py-2 self-center active:opacity-70"
            >
              <Text className="text-[13px] font-medium tracking-wide text-darkGray underline">
                {t('paywall.restore')}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
