import { useState, type ReactNode } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';

type TextFieldProps = Omit<TextInputProps, 'style'> & {
  label: string;
  error?: string | null;
  leading?: ReactNode;
};

// Form input per DESIGN.md input token: white fill, 12px radius, 52px tall, mauve text.
// Border shifts to brand-rose on focus, garnet on error. Label sits above in 13px Slate.
export function TextField({ label, error, leading, onFocus, onBlur, ...rest }: TextFieldProps) {
  const [focused, setFocused] = useState(false);

  const borderClass = error
    ? 'border-error'
    : focused
    ? 'border-brandRose'
    : 'border-lightGray';
  const borderWidth = focused || error ? 1.5 : 1;

  return (
    <View>
      <Text className="mb-1.5 text-[13px] font-medium tracking-wide text-darkGray">
        {label}
      </Text>
      <View
        className={`flex-row items-center rounded-xl bg-white px-4 ${borderClass}`}
        style={{ borderWidth, height: 52 }}
      >
        {leading ? <View className="mr-2">{leading}</View> : null}
        <TextInput
          className="flex-1 text-[17px] text-deepMauve"
          placeholderTextColor="#5A5A5A"
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
      </View>
      {error ? (
        <Text className="mt-1.5 text-[13px] text-error">{error}</Text>
      ) : null}
    </View>
  );
}
