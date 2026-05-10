import { Pressable, Text, View } from 'react-native';

export type ScoreBand = 'green' | 'amber' | 'red';

type ScoreCardProps = {
  score: number;
  band: ScoreBand;
  label: string;
  reassurance: string;
  flags?: string[];
  caption?: string;
  onPress?: () => void;
};

const BAND = {
  green: { bg: 'bg-scoreGreen', glyph: '✓' },
  amber: { bg: 'bg-scoreAmber', glyph: '◐' },
  red: { bg: 'bg-scoreRed', glyph: '○' },
} as const;

// Signature pillowy surface from DESIGN.md §5. Reassures before prescribing:
// label glyph and category, then the score in DM Serif Display 32px, then a plain-language line,
// then the GCC climate flags. Score colors never carry meaning alone (the Score-Triplet Rule).
export function ScoreCard({
  score,
  band,
  label,
  reassurance,
  flags = [],
  caption,
  onPress,
}: ScoreCardProps) {
  const tone = BAND[band];
  const shadow = {
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  } as const;

  const Container = onPress ? Pressable : View;
  const containerProps = onPress
    ? ({ onPress, accessibilityRole: 'button' as const, accessibilityLabel: `${label} score ${score}` })
    : {};

  return (
    <Container
      className={`${tone.bg} rounded-2xl p-5`}
      style={shadow}
      {...containerProps}
    >
      <View className="flex-row items-center">
        <Text className="text-[14px] font-medium text-white opacity-95">{tone.glyph}</Text>
        <Text className="ml-2 text-[13px] font-medium tracking-wide text-white opacity-95">
          {label}
        </Text>
      </View>

      <Text
        className="mt-2 text-white"
        style={{ fontSize: 32, fontWeight: '400', lineHeight: 38, letterSpacing: -0.2 }}
      >
        {score}
      </Text>

      <Text className="mt-1 text-[15px] leading-6 text-white opacity-95">{reassurance}</Text>

      {flags.length > 0 ? (
        <View className="mt-3 flex-row flex-wrap">
          {flags.map((flag) => (
            <View
              key={flag}
              className="mr-1.5 mt-1 rounded-full bg-white/20 px-2.5 py-1"
            >
              <Text className="text-[11px] font-medium tracking-wide text-white">{flag}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {caption ? (
        <Text className="mt-3 text-[11px] tracking-wide text-white opacity-80">{caption}</Text>
      ) : null}
    </Container>
  );
}
