import { SafeAreaView, StyleSheet, Text } from 'react-native';

export default function SkinTypeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Skin Type</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9E8E8',
  },
  text: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D1B2E',
  },
});
