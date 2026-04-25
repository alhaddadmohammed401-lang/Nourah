import { Text, View } from 'react-native';
import { colors } from '../../constants/colors';

export default function ScanScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.scanBg }}>
      <Text style={{ fontSize: 24, fontWeight: '700', color: colors.white }}>
        Face Scan
      </Text>
    </View>
  );
}
