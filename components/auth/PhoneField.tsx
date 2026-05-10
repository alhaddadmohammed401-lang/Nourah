import { Text, View } from 'react-native';
import { TextField } from '../ui/TextField';

type PhoneFieldProps = {
  value: string;
  onChangeText: (value: string) => void;
  error?: string | null;
};

// UAE-prefixed phone input. The +971 chip sits inline as the leading element so the user
// only enters the local number. Stored as the full E.164 value at submit time.
export function PhoneField({ value, onChangeText, error }: PhoneFieldProps) {
  return (
    <TextField
      label="Phone"
      placeholder="50 123 4567"
      keyboardType="phone-pad"
      autoComplete="tel"
      value={value}
      onChangeText={onChangeText}
      error={error}
      leading={
        <View className="flex-row items-center border-r border-lightGray pr-3">
          <Text className="text-[15px]">🇦🇪</Text>
          <Text className="ml-1.5 text-[15px] font-medium text-deepMauve">+971</Text>
        </View>
      }
    />
  );
}
