import { useEffect, useRef, useState } from 'react';
import { Animated, Text } from 'react-native';

type CountdownProps = {
  from: number;
  onComplete: () => void;
};

// 3-2-1 countdown. Each number fades in, holds, then fades out before the next.
// Sits inside the FaceGuide oval. Skip animation if reduce-motion is on (system handles
// the Animated transforms accordingly).
export function Countdown({ from, onComplete }: CountdownProps) {
  const [n, setN] = useState(from);
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    const tick = (current: number) => {
      opacity.setValue(0);
      scale.setValue(0.85);
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 320, useNativeDriver: true }),
      ]).start();

      const fadeOut = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }).start(() => {
          if (current <= 1) {
            onComplete();
            return;
          }
          setN(current - 1);
        });
      }, 700);

      return () => clearTimeout(fadeOut);
    };

    const cleanup = tick(n);
    return cleanup;
  }, [n, onComplete, opacity, scale]);

  return (
    <Animated.View style={{ opacity, transform: [{ scale }] }}>
      <Text
        style={{
          fontFamily: 'DMSerifDisplay-Regular',
          fontSize: 80,
          fontWeight: '400',
          lineHeight: 88,
          color: '#FFFFFF',
          letterSpacing: -1,
        }}
      >
        {n}
      </Text>
    </Animated.View>
  );
}
