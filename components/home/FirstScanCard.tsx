import { Pressable, Text, View } from 'react-native';

type FirstScanCardProps = {
  onPress?: () => void;
};

// Empty-state surface that takes the place of the Score Card before the user has scanned.
// Soft Lavender ground sets it apart from a real result without alarming. Reassurance-first
// copy per PRODUCT.md: "Let's read your skin" leads, the action follows.
export function FirstScanCard({ onPress }: FirstScanCardProps) {
  const shadow = {
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  } as const;

  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      {({ pressed }) => (
        <View
          className={`rounded-2xl bg-softLavender p-5 ${pressed ? 'opacity-90' : ''}`}
          style={shadow}
        >
          <Text className="text-[12px] font-medium uppercase tracking-[2px] text-deepMauve opacity-70">
            First step
          </Text>
          <Text
            className="mt-2 text-deepMauve"
            style={{
              fontFamily: 'DMSerifDisplay-Regular',
              fontSize: 24,
              fontWeight: '400',
              lineHeight: 30,
            }}
          >
            Let's read your skin.
          </Text>
          <Text className="mt-2 text-[15px] leading-6 text-deepMauve opacity-80">
            A quick scan tells us where you are today. Everything we suggest after this
            is built on what we find.
          </Text>
          <View className="mt-4 flex-row items-center">
            <Text className="text-[13px] font-medium text-brandRose">Start your first scan</Text>
            <Text className="ml-1 text-[13px] font-medium text-brandRose">→</Text>
          </View>
        </View>
      )}
    </Pressable>
  );
}
