import { Animated } from 'react-native';
import { useEffect, useRef } from 'react';

type FaceGuideProps = {
  width?: number;
  height?: number;
  pulsing?: boolean;
};

// Brand-Rose primary oval ring with a Dusty-Pink hairline ring nested inside (14px inset).
// The double-ring reads as "considered" rather than "default camera UI" — same affordance,
// quieter craft. When pulsing is true the whole pair breathes between 1.0 and 1.06 scale
// to signal "analyzing". Idle state is static. 280x360 by default per the brief.
export function FaceGuide({ width = 280, height = 360, pulsing = false }: FaceGuideProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const innerInset = 14;
  const innerW = width - innerInset * 2;
  const innerH = height - innerInset * 2;

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
        alignItems: 'center',
        justifyContent: 'center',
      }}
      accessibilityRole="image"
      accessibilityLabel="Face guide oval"
    >
      <Animated.View
        pointerEvents="none"
        style={{
          width: innerW,
          height: innerH,
          borderRadius: innerW,
          borderWidth: 1,
          borderColor: 'rgba(212, 160, 167, 0.55)',
        }}
      />
    </Animated.View>
  );
}
