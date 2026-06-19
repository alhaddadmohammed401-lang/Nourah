import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import Svg, { Line, Circle } from 'react-native-svg';
import { colors } from '../constants/colors';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { usePremiumStatus } from '../hooks/usePremiumStatus';
import { listScans, type ScanResult } from '../services/scanService';
import { Button } from '../components/ui/Button';

export default function ProgressScreen() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const { theme, colors: themeColors } = useTheme();
  const { user } = useAuth();
  const { isPremium, loading: checkingPremium } = usePremiumStatus();
  
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [loadingScans, setLoadingScans] = useState(true);

  useEffect(() => {
    async function loadScans() {
      if (user?.id && isPremium) {
        const history = await listScans(user.id);
        setScans(history);
      }
      setLoadingScans(false);
    }
    if (!checkingPremium) {
      void loadScans();
    }
  }, [user?.id, isPremium, checkingPremium]);

  if (checkingPremium || (isPremium && loadingScans)) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-softBlush" style={{ backgroundColor: themeColors.surface }}>
        <ActivityIndicator size="large" color={colors.brandRose} />
      </SafeAreaView>
    );
  }

  // 1. Locked State (Premium Gate)
  if (!isPremium) {
    return (
      <SafeAreaView className="flex-1 bg-softBlush justify-center items-center px-6" style={{ backgroundColor: themeColors.surface }}>
        <View
          className="bg-white p-6 rounded-2xl w-full max-w-sm items-center border"
          style={{
            borderColor: 'rgba(201, 168, 76, 0.45)',
            shadowColor: '#1A1A1A',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.06,
            shadowRadius: 16,
            elevation: 3,
          }}
        >
          {/* Lock Glyph */}
          <View
            className="w-12 h-12 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: 'rgba(201, 168, 76, 0.12)' }}
          >
            <Text style={{ color: colors.gold, fontSize: 22 }}>🔒</Text>
          </View>

          <Text
            style={{ fontFamily: 'DMSerifDisplay-Regular' }}
            className="text-2xl text-deepMauve text-center"
          >
            {lang === 'ar' ? 'مخطط تقدم البشرة' : 'Skin Progress Tracking'}
          </Text>
          
          <Text
            style={{ fontFamily: 'DMSans-Regular' }}
            className="text-[14px] leading-5 text-darkGray text-center mt-3 mb-6"
          >
            {lang === 'ar'
              ? 'تابعي تغيرات بشرتك بمرور الوقت مع تحليلات ورسوم بيانية متقدمة.'
              : 'Track how your skin changes and improves over time with advanced analysis and trend charts.'}
          </Text>

          <Button
            label={lang === 'ar' ? 'افتحي المزايا المميزة' : 'Unlock Premium'}
            onPress={() => router.push('/paywall')}
            fullWidth={true}
          />
          
          <Pressable
            onPress={() => router.back()}
            className="mt-4 py-2"
          >
            <Text className="text-[13px] text-darkGray underline">
              {lang === 'ar' ? 'رجوع' : 'Back'}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // 2. Active Premium State
  return (
    <SafeAreaView className="flex-1 bg-softBlush" style={{ backgroundColor: themeColors.surface }}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={themeColors.surface}
      />
      
      {/* Header */}
      <View className="px-5 py-4 flex-row items-center justify-between border-b border-lightGray/35">
        <Text
          style={{
            fontFamily: 'DMSerifDisplay-Regular',
            fontSize: 22,
            color: colors.deepMauve,
          }}
        >
          {lang === 'ar' ? 'رحلة بشرتك' : 'Your Skin Journey'}
        </Text>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          hitSlop={12}
          className="w-8 h-8 items-center justify-center rounded-full bg-lightGray/20"
        >
          <Text style={{ color: themeColors.ink, fontSize: 18 }}>×</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-6">
          <Text className="text-[14px] leading-[22px] text-darkGray mb-6">
            {lang === 'ar'
              ? 'تتبعي مستويات ترطيب وتصبغ بشرتك خلال الفحوصات الأخيرة.'
              : 'Analyze updates in your skin moisture and tone across your recent readings.'}
          </Text>

          {/* Render Trend Chart via custom SVG */}
          {scans.length > 1 ? (
            <View className="bg-white p-5 rounded-2xl mb-6 border border-lightGray/40">
              <Text className="text-[12px] font-bold text-brandRose uppercase tracking-wider mb-4">
                {lang === 'ar' ? 'مؤشر الصحة العام' : 'Overall Health Index'}
              </Text>
              
              <View className="h-44 justify-center items-center w-full">
                <Svg height="140" width="280" viewBox="0 0 280 140">
                  {/* Grid lines */}
                  <Line x1="0" y1="20" x2="280" y2="20" stroke="#F0F0F0" strokeWidth="1" />
                  <Line x1="0" y1="70" x2="280" y2="70" stroke="#F0F0F0" strokeWidth="1" />
                  <Line x1="0" y1="120" x2="280" y2="120" stroke="#F0F0F0" strokeWidth="1" />
                  
                  {/* Connect points */}
                  {scans.slice().reverse().map((scan, idx, arr) => {
                    if (idx === arr.length - 1) return null;
                    const nextScan = arr[idx + 1];
                    const x1 = (idx / (arr.length - 1)) * 240 + 20;
                    const y1 = 140 - ((scan.overall_score || 50) / 100) * 100 - 10;
                    const x2 = ((idx + 1) / (arr.length - 1)) * 240 + 20;
                    const y2 = 140 - ((nextScan.overall_score || 50) / 100) * 100 - 10;
                    
                    return (
                      <Line
                        key={`line-${idx}`}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={colors.brandRose}
                        strokeWidth="3"
                      />
                    );
                  })}

                  {/* Draw points */}
                  {scans.slice().reverse().map((scan, idx, arr) => {
                    const x = (idx / (arr.length - 1)) * 240 + 20;
                    const y = 140 - ((scan.overall_score || 50) / 100) * 100 - 10;
                    
                    return (
                      <Circle
                        key={`point-${idx}`}
                        cx={x}
                        cy={y}
                        r="5"
                        fill="#FFFFFF"
                        stroke={colors.brandRose}
                        strokeWidth="3"
                      />
                    );
                  })}
                </Svg>
              </View>
              
              <View className="flex-row justify-between px-2 mt-2">
                <Text className="text-[11px] text-darkGray">
                  {new Date(scans[scans.length - 1].created_at).toLocaleDateString(lang, { month: 'short', day: 'numeric' })}
                </Text>
                <Text className="text-[11px] text-darkGray">
                  {new Date(scans[0].created_at).toLocaleDateString(lang, { month: 'short', day: 'numeric' })}
                </Text>
              </View>
            </View>
          ) : null}

          {/* List of past scans */}
          <Text className="text-[12px] font-bold text-deepMauve uppercase tracking-wider mb-3">
            {lang === 'ar' ? 'سجل الفحوصات' : 'Scan History'}
          </Text>

          {scans.length > 0 ? (
            scans.map((item) => {
              const dateString = new Date(item.created_at).toLocaleDateString(lang, {
                weekday: 'long',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });
              
              return (
                <View
                  key={item.id}
                  className="bg-white p-4 rounded-2xl mb-3 flex-row items-center justify-between border border-lightGray/35"
                >
                  <View className="flex-1 pr-3">
                    <Text className="text-[14px] font-semibold text-deepMauve">
                      {dateString}
                    </Text>
                    <Text className="text-[12px] text-darkGray mt-1">
                      {lang === 'ar'
                        ? `الترطيب: %${item.hydration_score || 0} • الحبوب: ${item.acne_count || 0}`
                        : `Moisture: ${item.hydration_score || 0}% • Acne: ${item.acne_count || 0}`}
                    </Text>
                  </View>
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center"
                    style={{ backgroundColor: colors.softBlush }}
                  >
                    <Text
                      style={{ fontFamily: 'DMSerifDisplay-Regular', fontSize: 16, color: colors.brandRose }}
                    >
                      {item.overall_score || 0}
                    </Text>
                  </View>
                </View>
              );
            })
          ) : (
            <View className="bg-white p-8 rounded-2xl items-center justify-center border border-lightGray/35">
              <Text className="text-[14px] text-darkGray text-center">
                {lang === 'ar' ? 'لم تقومي بأي فحص بعد.' : 'No scans performed yet.'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
