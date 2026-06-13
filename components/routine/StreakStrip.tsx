import { Text, View } from 'react-native';
import { colors as brandColors } from '../../constants/colors';
import { useLanguage } from '../../hooks/useLanguage';
import { useTheme } from '../../hooks/useTheme';
import type { DayCompletion } from '../../hooks/useRoutineHistory';

type StreakStripProps = {
  days: DayCompletion[]; // 7 entries, newest first (index 0 = today)
  amStreak: number;
  // Today's "live" completion state from the routine screen so the strip updates
  // immediately when the user toggles a step (without waiting for AsyncStorage refresh).
  todayAm: boolean;
  todayPm: boolean;
};

// Streak counter + 7-day completion strip. Sits on the Blush ground (no card) to keep
// the page rhythm calm — the only card-surfaced area of Routine remains the step cards.
// Each day column shows a day letter + two stacked dots (AM top, PM bottom). Filled dots
// = completed, hairline outline = skipped. Today gets a quiet Brand-Rose ring around its
// column to anchor the eye.
export function StreakStrip({ days, amStreak, todayAm, todayPm }: StreakStripProps) {
  const { t, lang } = useLanguage();
  const { colors: theme } = useTheme();

  // Render oldest → newest left to right (display order is reverse of array order).
  const ordered = [...days].reverse();

  const streakLabel =
    amStreak === 0
      ? t('routine.streakNone')
      : amStreak === 1
      ? t('routine.streakSingular')
      : t('routine.streakFmt', { count: amStreak });

  const dayInitial = (date: Date): string => {
    return date.toLocaleDateString(lang === 'ar' ? 'ar-AE' : 'en-US', { weekday: 'narrow' });
  };

  return (
    <View className="mt-5">
      <View className="flex-row items-baseline justify-between">
        <Text
          className="text-deepMauve"
          style={{
            fontFamily: 'DMSerifDisplay-Regular',
            fontSize: 18,
            lineHeight: 22,
            letterSpacing: -0.1,
          }}
        >
          {streakLabel}
        </Text>
        <Text
          className="text-darkGray"
          style={{
            fontSize: 11,
            fontWeight: '600',
            letterSpacing: 1.6,
            textTransform: 'uppercase',
          }}
        >
          {t('routine.weekStrip')}
        </Text>
      </View>

      <View className="mt-3 flex-row justify-between">
        {ordered.map((day, idx) => {
          const isToday = idx === ordered.length - 1;
          // Today's AM/PM uses the live state passed from the parent; everything else
          // uses what was read from AsyncStorage on mount.
          const am = isToday ? todayAm : day.am;
          const pm = isToday ? todayPm : day.pm;

          return (
            <View
              key={day.iso}
              style={{
                alignItems: 'center',
                paddingVertical: 6,
                paddingHorizontal: 4,
                borderRadius: 12,
                borderWidth: isToday ? 1 : 0,
                borderColor: 'rgba(232, 99, 122, 0.45)',
                minWidth: 30,
              }}
            >
              <Text
                style={{
                  // Today is anchored by Brand Rose (theme-invariant); other days
                  // use the secondary ink token which flips with the theme.
                  color: isToday ? brandColors.brandRose : theme.inkSecondary,
                  fontSize: 10,
                  fontWeight: '600',
                  letterSpacing: 0.6,
                  textTransform: 'uppercase',
                }}
              >
                {dayInitial(day.date)}
              </Text>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  marginTop: 8,
                  // Filled dot uses brand-invariant Rose; empty dot uses the theme
                  // hairline so it reads as "not yet" on both light and dark.
                  backgroundColor: am ? brandColors.brandRose : 'transparent',
                  borderWidth: am ? 0 : 1,
                  borderColor: theme.inkMuted,
                }}
              />
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  marginTop: 4,
                  backgroundColor: pm ? brandColors.brandRose : 'transparent',
                  borderWidth: pm ? 0 : 1,
                  borderColor: theme.inkMuted,
                  opacity: 0.7,
                }}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}
