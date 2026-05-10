import { Animated } from 'react-native';
import { useEffect, useRef } from 'react';

type FaceGuideProps = {
  width?: number;
  height?: number;
  pulsing?: boolean;
};

// Brand-rose oval ring, centered on the scan canvas. When pulsing is true the ring
// breathes between 1.0 and 1.06 scale to signal "analyzing". Idle state is static.
// 280x360 by default per the brief.
export function FaceGuide({ width = 280, height = 360, pulsing = false }: FaceGuideProps) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!pulsing) {
      scale.setValue(1);
      return;
    }
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.06,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [pulsing, scale]);

  return (
    <Animated.View
      style={{
        width,
        height,
        borderRadius: width,
        borderWidth: 2.5,
        borderColor: '#E8637A',
        transform: [{ scale }],
      }}
      accessibilityRole="image"
      accessibilityLabel="Face guide oval"
    />
  );
}
