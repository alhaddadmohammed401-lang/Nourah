import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { colors } from '../../constants/colors';

// Shows a camera-ready scan surface without calling paid scan APIs during preview.
export default function ScanScreen() {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState('');

  // Runs a mock scan so the preview behaves like the real flow without using quota.
  async function handleMockScanPress() {
    setScanning(true);
    setScanError('');

    try {
      await new Promise((resolve) => {
        setTimeout(resolve, 900);
      });

      router.push('/(tabs)/routine');
    } catch {
      setScanError('The preview scan could not finish. Please try again.');
    } finally {
      setScanning(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-scanBg">
      <StatusBar barStyle="light-content" backgroundColor={colors.scanBg} />

      <View className="flex-1 bg-scanBg px-5 pb-8 pt-8">
        <View>
          <Text className="text-[28px] font-semibold text-white">
            Face scan
          </Text>
          <Text className="mt-1 text-[20px] leading-8 text-softBlush">
            فحص البشرة
          </Text>
          <Text className="mt-4 text-[15px] leading-6 text-lightGray">
            Soft lighting, no filters, and one scan when you are ready.
          </Text>
          <Text className="mt-1 text-[15px] leading-7 text-lightGray">
            إضاءة هادئة، بدون فلاتر، وفحص واحد عند الاستعداد.
          </Text>
        </View>

        <View className="flex-1 items-center justify-center">
          <View className="h-72 w-56 items-center justify-center rounded-full border-4 border-brandRose">
            <View className="h-64 w-48 rounded-full border border-dustyPink" />
          </View>

          <View className="mt-8 rounded-full bg-deepMauve px-4 py-3">
            <Text className="text-center text-[13px] font-semibold text-softBlush">
              Preview mode, no paid scan call
            </Text>
          </View>
        </View>

        {scanError ? (
          <View className="mb-4 rounded-2xl border border-error bg-deepMauve p-4">
            <Text className="text-[14px] leading-5 text-softBlush">
              {scanError}
            </Text>
          </View>
        ) : null}

        <Pressable
          className={`h-[52px] items-center justify-center rounded-xl ${
            scanning ? 'bg-dustyPink' : 'bg-brandRose'
          }`}
          onPress={handleMockScanPress}
          disabled={scanning}
          accessibilityRole="button"
        >
          {scanning ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text className="text-[17px] font-semibold text-white">
              Start preview scan
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
