import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { colors } from '../../constants/colors';

type ScanningRingProps = {
  active?: boolean;
};

export function ScanningRing({ active = false }: ScanningRingProps) {
  const pulseAnim1 = useRef(new Animated.Value(1)).current;
  const pulseAnim2 = useRef(new Animated.Value(1)).current;
  const opacityAnim1 = useRef(new Animated.Value(0.4)).current;
  const opacityAnim2 = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    if (!active) {
      pulseAnim1.setValue(1);
      pulseAnim2.setValue(1);
      opacityAnim1.setValue(0);
      opacityAnim2.setValue(0);
      return;
    }

    // Outer pulse animation 1
    const pulse1 = Animated.loop(
      Animated.parallel([
        Animated.timing(pulseAnim1, {
          toValue: 1.3,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(opacityAnim1, {
            toValue: 0.6,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim1, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    // Inner pulse animation 2 (delayed offset)
    const pulse2 = Animated.loop(
      Animated.sequence([
        Animated.delay(1000),
        Animated.parallel([
          Animated.timing(pulseAnim2, {
            toValue: 1.3,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(opacityAnim2, {
              toValue: 0.6,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim2, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ])
    );

    pulse1.start();
    pulse2.start();

    return () => {
      pulse1.stop();
      pulse2.stop();
    };
  }, [active, pulseAnim1, pulseAnim2, opacityAnim1, opacityAnim2]);

  if (!active) return null;

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none" className="items-center justify-center">
      {/* Outer Pulse */}
      <Animated.View
        style={[
          styles.ring,
          {
            transform: [{ scale: pulseAnim1 }],
            opacity: opacityAnim1,
          },
        ]}
      />
      {/* Inner Delayed Pulse */}
      <Animated.View
        style={[
          styles.ring,
          {
            transform: [{ scale: pulseAnim2 }],
            opacity: opacityAnim2,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    position: 'absolute',
    width: 290,
    height: 370,
    borderRadius: 200,
    borderWidth: 2,
    borderColor: colors.brandRose,
    backgroundColor: 'rgba(232, 99, 122, 0.05)',
  },
});
