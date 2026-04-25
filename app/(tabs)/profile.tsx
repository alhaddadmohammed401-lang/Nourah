import { Text, View } from 'react-native';
import { colors } from '../../constants/colors';

export default function ProfileScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white }}>
      <Text style={{ fontSize: 24, fontWeight: '700', color: colors.deepMauve }}>
        Profile
      </Text>
    </View>
  );
}
