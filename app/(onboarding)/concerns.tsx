import { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

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
  const [selected, setSelected] = useState<string[]>([]);

  const toggleConcern = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
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
          <Text style={styles.title}>What are your main{'\n'}skin concerns?</Text>
          <Text style={styles.subtitle}>
            Choose all that apply so Nourah can personalize your routine.
          </Text>
        </View>

        {/* Concern cards grid */}
        <View style={styles.grid}>
          {CONCERNS.map((concern) => {
            const isSelected = selected.includes(concern.id);
            return (
              <Pressable
                key={concern.id}
                style={[
                  styles.card,
                  isSelected ? styles.cardSelected : styles.cardUnselected,
                ]}
                onPress={() => toggleConcern(concern.id)}
              >
                <Text style={styles.cardEmoji}>{concern.emoji}</Text>
                <Text
                  style={[
                    styles.cardLabel,
                    isSelected ? styles.cardLabelSelected : styles.cardLabelUnselected,
                  ]}
                >
                  {concern.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Continue button */}
      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [
            styles.continueButton,
            selected.length === 0 && styles.continueButtonDisabled,
            pressed && selected.length > 0 && styles.continueButtonPressed,
          ]}
          onPress={() => {
            if (selected.length > 0) {
              router.push({
                pathname: '/(onboarding)/skintype',
                params: { concerns: selected.join(',') },
              });
            }
          }}
          disabled={selected.length === 0}
        >
          <Text style={styles.continueText}>Continue</Text>
        </Pressable>

        <Text style={styles.selectedCount}>
          {selected.length === 0
            ? 'Select at least one concern'
            : `${selected.length} selected`}
        </Text>
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
    marginBottom: 28,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2D1B2E',
    marginBottom: 10,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 15,
    color: '#5A5A5A',
    lineHeight: 22,
  },

  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  // Cards
  card: {
    width: '47%',
    paddingVertical: 20,
    paddingHorizontal: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
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
  cardEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  cardLabelSelected: {
    color: '#FFFFFF',
  },
  cardLabelUnselected: {
    color: '#2D1B2E',
  },

  // Footer
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 12,
    alignItems: 'center',
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
  selectedCount: {
    marginTop: 12,
    fontSize: 13,
    color: '#5A5A5A',
  },
});
