import { useRouter } from 'expo-router';
import { SafeAreaView, Text, View } from 'react-native';
import { Button } from '../components/ui/Button';

export default function PaywallScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-softBlush justify-center items-center px-6">
      <View className="bg-white p-6 rounded-2xl w-full max-w-sm items-center shadow-sm">
        <Text
          style={{ fontFamily: 'DMSerifDisplay-Regular' }}
          className="text-2xl text-deepMauve text-center"
        >
          Nourah Premium
        </Text>
        <Text
          style={{ fontFamily: 'DMSans-Regular' }}
          className="text-[15px] text-darkGray text-center mt-3 mb-6"
        >
          Unlock unlimited face scans, AM & PM routines, and full ingredient analysis.
        </Text>
        <Button
          label="Back"
          onPress={() => router.back()}
          fullWidth={true}
        />
      </View>
    </SafeAreaView>
  );
}
