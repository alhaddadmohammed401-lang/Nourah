import { Text, View } from 'react-native';
import { Button } from '../ui/Button';

type StickyScanCTAProps = {
  label: string;
  hint?: string;
  onPress: () => void;
};

// Bottom-anchored primary action. Lives above the tab bar, with a soft gradient-free
// blush band behind it so the button has somewhere to sit when content scrolls underneath.
// Single-purpose: take the user to a fresh scan. Nothing else competes here.
export function StickyScanCTA({ label, hint, onPress }: StickyScanCTAProps) {
  return (
    <View className="bg-softBlush px-5 pb-4 pt-3">
      {hint ? (
        <Text className="mb-2 text-center text-[13px] text-darkGray">{hint}</Text>
      ) : null}
      <Button label={label} variant="primary" onPress={onPress} />
    </View>
  );
}
