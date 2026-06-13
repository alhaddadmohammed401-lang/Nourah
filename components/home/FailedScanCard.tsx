import { Pressable, Text, View } from 'react-native';
import { useLanguage } from '../../hooks/useLanguage';
import { colors } from '../../constants/colors';

type FailedScanCardProps = {
  rawError: string | null | undefined;
  onRetake: () => void;
};

// Translates technical YouCam errors into brand-voice hints. The raw error never reaches
// the user — PRODUCT.md says reassuring before prescriptive. Each known signature maps
// to a short, actionable line that names the fix in the user's terms.
function humanizeError(raw: string | null | undefined): 'faceTooSmall' | 'lowLight' | 'fallback' {
  if (!raw) return 'fallback';
  const r = raw.toLowerCase();
  if (r.includes('face') && (r.includes('small') || r.includes('too_small'))) return 'faceTooSmall';
  if (r.includes('light') || r.includes('exposure') || r.includes('dark')) return 'lowLight';
  return 'fallback';
}

// Hero state shown on Home when the latest scan failed. Same surface slot as ScoreCard,
// same Soft-Lavender ground as PendingScanCard (so the absence of a green/amber/red band
// reads as "no verdict yet"). The retry CTA lives inside the card — there's no point
// surfacing the global "Scan again" button below when this is the user's only next move.
export function FailedScanCard({ rawError, onRetake }: FailedScanCardProps) {
  const { t } = useLanguage();
  const hintKey = humanizeError(rawError);
  const hintText = t(
    hintKey === 'faceTooSmall'
      ? 'home.failed.hintFaceTooSmall'
      : hintKey === 'lowLight'
      ? 'home.failed.hintLowLight'
      : 'home.failed.hintFallback',
  );

  const shadow = {
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  } as const;

  return (
    <View className="rounded-2xl bg-softLavender p-5" style={shadow}>
      <Text className="text-[12px] font-medium uppercase tracking-[2px] text-deepMauve opacity-70">
        {t('home.failed.eyebrow')}
      </Text>

      <Text
        className="mt-2 text-deepMauve"
        style={{
          fontFamily: 'DMSerifDisplay-Regular',
          fontSize: 24,
          fontWeight: '400',
          lineHeight: 30,
          letterSpacing: -0.1,
        }}
      >
        {t('home.failed.title')}
      </Text>

      <Text className="mt-2 text-[15px] leading-6 text-deepMauve opacity-80">{hintText}</Text>

      <Pressable
        onPress={onRetake}
        accessibilityRole="button"
        accessibilityLabel={t('home.failed.retake')}
        style={({ pressed }) => ({
          marginTop: 16,
          alignSelf: 'flex-start',
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 10,
          backgroundColor: pressed ? '#D4547A' : colors.brandRose,
        })}
      >
        <Text
          style={{
            // Text on Brand-Rose accent — semantically "ink on accent", always
            // white regardless of theme. Don't theme this.
            color: '#FFFFFF',
            fontSize: 14,
            fontWeight: '600',
            letterSpacing: 0.3,
          }}
        >
          {t('home.failed.retake')}
        </Text>
      </Pressable>
    </View>
  );
}
