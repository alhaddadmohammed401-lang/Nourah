import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Nourah
      </Text>
      <Text style={styles.subtitle}>
        Your skin, understood.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9E8E8',
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: 'bold',
    color: '#E8637A',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 24,
    color: '#2D1B2E',
  },
});
