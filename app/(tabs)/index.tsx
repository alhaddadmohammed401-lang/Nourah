import { Text, View } from 'react-native';
import { colors } from '../../constants/colors';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.softBlush }}>
      <Text style={{ fontSize: 32, fontWeight: '700', color: colors.brandRose }}>
        Nourah
      </Text>
      <Text style={{ marginTop: 8, fontSize: 15, color: colors.deepMauve }}>
        Your skin, understood.
      </Text>
    </View>
  );
}
