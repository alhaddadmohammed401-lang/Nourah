import { ActivityIndicator, Pressable, Text, View, type PressableProps } from 'react-native';
import { type ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

type ButtonProps = Omit<PressableProps, 'children'> & {
  label: string;
  variant?: Variant;
  loading?: boolean;
  fullWidth?: boolean;
  trailing?: ReactNode;
};

const VARIANT = {
  primary: {
    rest: 'bg-brandRose',
    pressed: 'bg-dustyPink',
    label: 'text-white',
    spinner: '#FFFFFF',
  },
  secondary: {
    rest: 'bg-softBlush',
    pressed: 'bg-softLavender',
    label: 'text-deepMauve',
    spinner: '#2D1B2E',
  },
  ghost: {
    rest: 'bg-transparent',
    pressed: 'bg-softLavender',
    label: 'text-deepMauve',
    spinner: '#2D1B2E',
  },
} as const;

// Primary call-to-action surface. Sized to DESIGN.md button-primary token: 52px tall, 12px radius,
// 17px Body Large label. The One-Voice Rule keeps brandRose on primary only.
export function Button({
  label,
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = true,
  trailing,
  ...rest
}: ButtonProps) {
  const inactive = disabled || loading;
  const v = VARIANT[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      {...rest}
    >
      {({ pressed }) => {
        const bg = inactive ? 'bg-lightGray' : pressed ? v.pressed : v.rest;
        const labelColor = inactive ? 'text-darkGray' : v.label;
        const width = fullWidth ? 'w-full' : 'self-start';
        return (
          <View
            className={`h-[52px] flex-row items-center justify-center rounded-xl px-6 ${bg} ${width}`}
          >
            {loading ? (
              <ActivityIndicator color={v.spinner} />
            ) : (
              <>
                <Text className={`text-[17px] font-medium ${labelColor}`}>{label}</Text>
                {trailing ? <View className="ml-2">{trailing}</View> : null}
              </>
            )}
          </View>
        );
      }}
    </Pressable>
  );
}
