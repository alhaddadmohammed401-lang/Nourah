import { createElement } from 'react';
import { Image, Platform, type ImageSourcePropType } from 'react-native';

type GeneratedIconSize = 'tab' | 'sm' | 'md' | 'lg' | 'hero';

type GeneratedIconProps = {
  source: ImageSourcePropType;
  size: GeneratedIconSize;
  opacity?: string;
};

const iconSizeClasses: Record<GeneratedIconSize, string> = {
  tab: 'h-7 w-7',
  sm: 'h-12 w-12',
  md: 'h-16 w-16',
  lg: 'h-20 w-20',
  hero: 'h-24 w-24',
};

// Reads the web URI Expo creates for required image assets.
function getWebImageUri(source: ImageSourcePropType) {
  const sourceValue = source as unknown;

  if (typeof sourceValue === 'string') return sourceValue;

  if (
    sourceValue &&
    typeof sourceValue === 'object' &&
    'uri' in sourceValue &&
    typeof sourceValue.uri === 'string'
  ) {
    return sourceValue.uri;
  }

  return '';
}

// Keeps generated PNG icons constrained on web, where React Native Image can use natural asset size.
export function GeneratedIcon({
  source,
  size,
  opacity = 'opacity-100',
}: GeneratedIconProps) {
  const className = `${iconSizeClasses[size]} ${opacity} object-contain`;

  if (Platform.OS === 'web') {
    return createElement('img', {
      alt: '',
      className,
      src: getWebImageUri(source),
    });
  }

  return (
    <Image
      source={source}
      className={className}
      resizeMode="contain"
    />
  );
}
