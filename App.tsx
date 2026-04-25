import './global.css';

import { Text, View } from 'react-native';

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-softBlush">
      <Text className="text-3xl font-bold text-brandRose">
        Nourah
      </Text>
      <Text className="mt-2 text-base text-deepMauve">
        Your skin, understood.
      </Text>
    </View>
  );
}
