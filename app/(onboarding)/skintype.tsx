// TODO(i18n): Pre-auth surface. Migrate strings to useLanguage().t() and the locales
// dictionary on the next touch.
import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, SafeAreaView, ScrollView, StatusBar, Text, View } from 'react-native';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../hooks/useTheme';
import { savePendingOnboardingLocal } from '../../services/profileService';

const SKIN_TYPES = [
  { id: 'oily', label: 'Oily', description: 'Shiny all over, visible pores', emoji: '💧' },
  { id: 'dry', label: 'Dry', description: 'Flaky, tight, or rough texture', emoji: '🏜️' },
  {
    id: 'combination',
    label: 'Combination',
    description: 'Oily T-zone, dry or normal cheeks',
    emoji: '⚖️',
  },
  {
    id: 'sensitive',
    label: 'Sensitive',
    description: 'Prone to redness and irritation',
    emoji: '🌸',
  },
];

export default function SkinTypeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { theme, colors } = useTheme();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  function handleComplete() {
    if (!selectedType) return;

    // Save onboarding answers locally to support OAuth and robust signup flows
    const concernsArray = params.concerns
      ? (params.concerns as string).split(',').filter(Boolean)
      : [];
    void savePendingOnboardingLocal({
      skinType: selectedType,
      concerns: concernsArray,
    });

    // The user has finished the unauthenticated onboarding interview. Carry their
    // answers into signup so the account creation step can persist them. Going
    // straight to /(tabs) here would bounce back through the auth guard since no
    // session exists yet.
    router.push({
      pathname: '/(auth)/signup',
      params: {
        concerns: (params.concerns as string) ?? '',
        skinType: selectedType,
      },
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
          <View className="mb-8">
            <Text className="mb-3 font-serif text-[28px] leading-[36px] text-deepMauve">
              What is your{'\n'}skin type?
            </Text>
            <Text className="text-[15px] leading-6 text-darkGray">
              This helps us build a base routine perfectly suited for your skin.
            </Text>
          </View>

          <View>
            {SKIN_TYPES.map((type) => {
              const isSelected = selectedType === type.id;

              return (
                <Pressable
                  key={type.id}
                  className={`mb-4 min-h-[104px] w-full rounded-2xl border-[1.5px] px-5 py-4 active:opacity-80 focus:border-brandRose ${
                    isSelected
                      ? 'border-brandRose bg-brandRose/20'
                      : 'border-lightGray bg-white'
                  }`}
                  onPress={() => setSelectedType(type.id)}
                  accessibilityRole="radio"
                  accessibilityLabel={type.label}
                  accessibilityHint={type.description}
                  accessibilityState={{ checked: isSelected }}
                >
                  <View className="flex-row items-center">
                    <Text className="mr-3 text-[24px]" accessible={false}>
                      {type.emoji}
                    </Text>
                    <View className="flex-1">
                      <Text className="text-[18px] font-semibold text-deepMauve">
                        {type.label}
                      </Text>
                      <Text className="mt-1 text-[14px] leading-5 text-darkGray">
                        {type.description}
                      </Text>
                    </View>
                    <View
                      className={`ml-3 h-5 w-5 items-center justify-center rounded-full border-2 ${
                        isSelected ? 'border-brandRose' : 'border-lightGray'
                      }`}
                      accessible={false}
                    >
                      {isSelected ? (
                        <View className="h-2.5 w-2.5 rounded-full bg-brandRose" />
                      ) : null}
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View className="bg-softBlush px-6 pb-8 pt-3">
        <Button
          label="Complete Setup"
          onPress={handleComplete}
          disabled={!selectedType}
          accessibilityHint="Opens signup with your onboarding answers"
        />
      </View>
    </SafeAreaView>
  );
}
