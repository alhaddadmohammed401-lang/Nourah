// TODO(i18n): Pre-auth surface. Migrate strings to useLanguage().t() and the locales
// dictionary on the next touch.
import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const SKIN_TYPES = [
  { id: 'oily', label: 'Oily', description: 'Shiny all over, visible pores', emoji: '💧' },
  { id: 'dry', label: 'Dry', description: 'Flaky, tight, or rough texture', emoji: '🏜️' },
  { id: 'combination', label: 'Combination', description: 'Oily T-zone, dry or normal cheeks', emoji: '⚖️' },
  { id: 'sensitive', label: 'Sensitive', description: 'Prone to redness and irritation', emoji: '🌸' },
];

export default function SkinTypeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleComplete = async () => {
    if (!selectedType) return;

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
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9E8E8" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>What is your{'\n'}skin type?</Text>
          <Text style={styles.subtitle}>
            This helps us build a base routine perfectly suited for your skin.
          </Text>
        </View>

        {/* Options List */}
        <View style={styles.list}>
          {SKIN_TYPES.map((type) => {
            const isSelected = selectedType === type.id;
            return (
              <Pressable
                key={type.id}
                style={[
                  styles.card,
                  isSelected ? styles.cardSelected : styles.cardUnselected,
                ]}
                onPress={() => setSelectedType(type.id)}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardEmoji}>{type.emoji}</Text>
                  <Text
                    style={[
                      styles.cardLabel,
                      isSelected ? styles.cardLabelSelected : styles.cardLabelUnselected,
                    ]}
                  >
                    {type.label}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.cardDescription,
                    isSelected ? styles.cardDescriptionSelected : styles.cardDescriptionUnselected,
                  ]}
                >
                  {type.description}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Complete Onboarding Button */}
      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [
            styles.continueButton,
            !selectedType && styles.continueButtonDisabled,
            pressed && selectedType && styles.continueButtonPressed,
          ]}
          onPress={handleComplete}
          disabled={!selectedType}
        >
          <Text style={styles.continueText}>Complete Setup</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9E8E8',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 16,
  },

  // Header
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2D1B2E',
    marginBottom: 12,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    color: '#5A5A5A',
    lineHeight: 24,
  },

  // List
  list: {
    gap: 16,
  },

  // Cards
  card: {
    width: '100%',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  cardSelected: {
    backgroundColor: '#E8637A',
    borderColor: '#E8637A',
  },
  cardUnselected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E0E0',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  cardLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardLabelSelected: {
    color: '#FFFFFF',
  },
  cardLabelUnselected: {
    color: '#2D1B2E',
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
    paddingLeft: 36, // align with text, indent past emoji
  },
  cardDescriptionSelected: {
    color: '#F9E8E8',
  },
  cardDescriptionUnselected: {
    color: '#5A5A5A',
  },

  // Footer
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 12,
  },
  continueButton: {
    width: '100%',
    height: 54,
    backgroundColor: '#E8637A',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E8637A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonDisabled: {
    backgroundColor: '#D4A0A7',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonPressed: {
    backgroundColor: '#D4556C',
    transform: [{ scale: 0.98 }],
  },
  continueText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});
