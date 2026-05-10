import { Pressable, View, type PressableProps, type ViewProps } from 'react-native';
import { type ReactNode } from 'react';

type CardProps = ViewProps & {
  children: ReactNode;
  onPress?: PressableProps['onPress'];
  tone?: 'white' | 'lavender';
  padding?: 'standard' | 'pillowy';
};

const TONE = {
  white: 'bg-white',
  lavender: 'bg-softLavender',
} as const;

const PADDING = {
  standard: 'p-4',
  pillowy: 'p-5',
} as const;

// Default container per DESIGN.md card token: white, 16px radius, 16px padding, soft Card Lift.
// Pillowy padding (20px) is reserved for result and signature surfaces per The Mix Rule.
export function Card({
  children,
  onPress,
  tone = 'white',
  padding = 'standard',
  className,
  style,
  ...rest
}: CardProps) {
  const base = `rounded-2xl ${TONE[tone]} ${PADDING[padding]} ${className ?? ''}`;
  const shadowStyle = {
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  } as const;

  if (onPress) {
    return (
      <Pressable onPress={onPress} accessibilityRole="button">
        {({ pressed }) => (
          <View
            className={`${base} ${pressed ? 'opacity-90' : ''}`}
            style={[shadowStyle, style as object]}
            {...rest}
          >
            {children}
          </View>
        )}
      </Pressable>
    );
  }

  return (
    <View className={base} style={[shadowStyle, style as object]} {...rest}>
      {children}
    </View>
  );
}
