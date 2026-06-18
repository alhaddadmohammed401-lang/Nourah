// TODO(i18n): Pre-auth surface. Migrate strings to useLanguage().t() and the locales
// dictionary on the next touch.
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, SafeAreaView, ScrollView, StatusBar, Text, View } from 'react-native';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../hooks/useTheme';

const CONCERNS = [
  { id: 'acne', label: 'Acne', emoji: '🔴' },
  { id: 'pigmentation', label: 'Pigmentation', emoji: '🟤' },
  { id: 'oily_skin', label: 'Oily skin', emoji: '💧' },
  { id: 'dryness', label: 'Dryness', emoji: '🏜️' },
  { id: 'damaged_barrier', label: 'Damaged barrier', emoji: '🛡️' },
  { id: 'sun_damage', label: 'Sun damage', emoji: '☀️' },
  { id: 'large_pores', label: 'Large pores', emoji: '🔍' },
  { id: 'sensitivity', label: 'Sensitivity', emoji: '🌸' },
];

export default function SkinConcernsScreen() {
  const router = useRouter();
  const { theme, colors } = useTheme();
  const [selected, setSelected] = useState<string[]>([]);

  function toggleConcern(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  function handleContinue() {
    if (selected.length === 0) return;

    router.push({
      pathname: '/(onboarding)/skintype',
      params: { concerns: selected.join(',') },
    });
  }

  return (
    <SafeAreaView className="flex-1 bg-softBlush">
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.surface}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-6 pb-4 pt-12">
          <View className="mb-7">
            <Text className="mb-2.5 font-serif text-[26px] leading-[34px] text-deepMauve">
              What are your main{'\n'}skin concerns?
            </Text>
            <Text className="text-[15px] leading-[24px] text-darkGray">
              Choose all that apply so Nourah can personalize your routine.
            </Text>
          </View>

          <View className="flex-row flex-wrap justify-between">
            {CONCERNS.map((concern) => {
              const isSelected = selected.includes(concern.id);

              return (
                <Pressable
                  key={concern.id}
                  className={`mb-4 min-h-28 w-[48%] items-center justify-center rounded-2xl border-[1.5px] px-3.5 py-5 active:opacity-80 focus:border-brandRose ${
                    isSelected
                      ? 'border-brandRose bg-brandRose/20'
                      : 'border-lightGray bg-white'
                  }`}
                  onPress={() => toggleConcern(concern.id)}
                  accessibilityRole="checkbox"
                  accessibilityLabel={concern.label}
                  accessibilityState={{ checked: isSelected }}
                >
                  <Text className="mb-2 text-[28px]" accessible={false}>
                    {concern.emoji}
                  </Text>
                  <Text className="text-center text-[14px] font-semibold text-deepMauve">
                    {concern.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View className="items-center bg-softBlush px-6 pb-8 pt-3">
        <Button
          label="Continue"
          onPress={handleContinue}
          disabled={selected.length === 0}
          accessibilityHint="Opens the skin type step"
        />

        <Text className="mt-3 text-[13px] text-darkGray">
          {selected.length === 0
            ? 'Select at least one concern'
            : `${selected.length} selected`}
        </Text>
      </View>
    </SafeAreaView>
  );
}
