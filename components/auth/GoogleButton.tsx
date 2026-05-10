import { createElement } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

type GoogleButtonProps = {
  onPress: () => void;
  loading?: boolean;
};

// Official Google G mark from Google's brand guidelines, encoded as a data URI so we
// don't need react-native-svg or a binary asset. Drawn from the canonical 48x48 path
// data — four arcs in #4285F4 / #34A853 / #FBBC05 / #EA4335.
const GOOGLE_G_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">' +
  '<path fill="#4285F4" d="M47.5 24.55c0-1.63-.15-3.2-.43-4.7H24v9.05h13.18c-.57 3.05-2.3 5.63-4.9 7.36v6.13h7.92c4.63-4.27 7.3-10.55 7.3-17.84z"/>' +
  '<path fill="#34A853" d="M24 48c6.6 0 12.13-2.2 16.18-5.94l-7.92-6.13c-2.2 1.47-5 2.34-8.26 2.34-6.35 0-11.73-4.28-13.66-10.04H2.18v6.32C6.2 42.55 14.5 48 24 48z"/>' +
  '<path fill="#FBBC05" d="M10.34 28.23c-.5-1.47-.78-3.04-.78-4.66s.28-3.2.78-4.66v-6.32H2.18A23.94 23.94 0 0 0 0 23.57c0 3.87.93 7.53 2.18 10.98l8.16-6.32z"/>' +
  '<path fill="#EA4335" d="M24 9.55c3.58 0 6.8 1.23 9.34 3.65l7.02-7.02C36.13 2.36 30.6 0 24 0 14.5 0 6.2 5.45 2.18 13.4l8.16 6.32C12.27 13.83 17.65 9.55 24 9.55z"/>' +
  '</svg>';

const GOOGLE_G_URI = `data:image/svg+xml;utf8,${encodeURIComponent(GOOGLE_G_SVG)}`;

// Google sign-in CTA. Stubbed in dev: tap shows an inline notice elsewhere on the screen.
export function GoogleButton({ onPress, loading = false }: GoogleButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      accessibilityRole="button"
      accessibilityLabel="Continue with Google"
    >
      {({ pressed }) => (
        <View
          className={`h-[52px] w-full flex-row items-center justify-center rounded-xl border border-lightGray bg-white px-6 ${
            pressed ? 'opacity-90' : ''
          }`}
        >
          <GGlyph />
          <Text className="ml-3 text-[17px] font-medium text-deepMauve">
            Continue with Google
          </Text>
        </View>
      )}
    </Pressable>
  );
}

// On web we render a real <img> with the SVG data URI — this gives crisp Google brand
// colors at any size with zero native-module dependency. On native (iOS/Android) we
// fall back to a stylized monochrome circle with a "G" letter; the auth flow will be
// replaced with the official Google SDK button in a later craft run anyway.
function GGlyph() {
  if (Platform.OS === 'web') {
    return createElement('img', {
      src: GOOGLE_G_URI,
      width: 20,
      height: 20,
      alt: '',
      'aria-hidden': true,
      style: { display: 'inline-block', verticalAlign: 'middle' },
    });
  }
  return (
    <View
      style={{
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#4285F4',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
      }}
    >
      <Text style={{ color: '#4285F4', fontSize: 13, fontWeight: '700', lineHeight: 14 }}>
        G
      </Text>
    </View>
  );
}
