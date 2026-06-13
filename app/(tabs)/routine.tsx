import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { colors as brandColors } from '../../constants/colors';
import {
  getRoutinePlan,
  type RoutinePlan,
  type RoutineStep,
  type RoutineTimeOfDay,
} from '../../services/routineService';
import { useLanguage } from '../../hooks/useLanguage';
import { useRoutineHistory } from '../../hooks/useRoutineHistory';
import { useTheme } from '../../hooks/useTheme';
import { StreakStrip } from '../../components/routine/StreakStrip';

// Builds a local date key so routine completion resets when the user's device date changes.
function getLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

// Keeps routine progress scoped to one day and one AM or PM routine.
function getRoutineCompletionStorageKey(timeOfDay: RoutineTimeOfDay) {
  return `routine:${getLocalDateKey(new Date())}:${timeOfDay}`;
}

// Renders one routine step with a tap target for completion. Step copy resolves through
// the locale dictionary so the active language is the only one rendered.
function RoutineStepCard({
  step,
  completed,
  saving,
  onToggle,
}: {
  step: RoutineStep;
  completed: boolean;
  saving: boolean;
  onToggle: (stepId: string) => void;
}) {
  const { t, lang } = useLanguage();
  const { colors: theme } = useTheme();

  // Gemini-generated steps ship pre-localized title_en/title_ar/why_en/why_ar fields
  // directly on the step. Mock steps (am-cleanse, am-treat, am-protect) rely on locale
  // dictionary lookups by step.id. Prefer the live fields when they exist; fall back to
  // the dictionary; finally fall back to the id so we never render a raw locale key.
  const liveTitle = lang === 'ar' ? step.title_ar : step.title_en;
  const liveWhy = lang === 'ar' ? step.why_ar : step.why_en;
  const localeTitle = t(`routine.step.${step.id}.title`);
  const localeBody = t(`routine.step.${step.id}.body`);
  const localeIngredient = t(`routine.step.${step.id}.ingredient`);
  const looksLikeMissingKey = (s: string) => s.startsWith('routine.step.');
  const title = liveTitle ?? (looksLikeMissingKey(localeTitle) ? step.id : localeTitle);
  const body = liveWhy ?? (looksLikeMissingKey(localeBody) ? '' : localeBody);
  const ingredient = looksLikeMissingKey(localeIngredient) ? '' : localeIngredient;

  const checkClassName = completed
    ? 'border-brandRose bg-brandRose'
    : 'border-lightGray bg-softBlush';
  const checkTextClassName = completed ? 'text-white' : 'text-darkGray';
  const savingClassName = saving ? 'opacity-70' : 'opacity-100';

  return (
    <Pressable
      className={`mb-3 rounded-2xl bg-white px-5 py-5 active:opacity-80 ${savingClassName}`}
      style={{
        borderWidth: 1,
        borderColor: 'rgba(212, 160, 167, 0.25)',
      }}
      onPress={() => onToggle(step.id)}
      disabled={saving}
      accessibilityRole="button"
      accessibilityLabel={t('routine.a11yStepFmt', {
        title,
        state: completed ? t('routine.a11yStateCompleted') : t('routine.a11yStateNotCompleted'),
      })}
    >
      <View className="flex-row items-start">
        <Text
          style={{
            fontFamily: 'DMSerifDisplay-Regular',
            fontSize: 24,
            lineHeight: 26,
            // Brand-invariant — Rose stays the same on both themes.
            color: brandColors.brandRose,
            width: 42,
            letterSpacing: 0.5,
          }}
        >
          {String(step.stepNumber).padStart(2, '0')}
        </Text>

        <View className="flex-1">
          <View className="flex-row items-start">
            <View className="flex-1 pr-3">
              <Text className="text-[18px] font-semibold text-deepMauve">{title}</Text>
            </View>

            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                borderWidth: completed ? 0 : 1,
                // Hairline outline when empty flips with the theme; filled state stays
                // Brand Rose (invariant) because it carries the action affordance.
                borderColor: theme.inkMuted,
                backgroundColor: completed ? brandColors.brandRose : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {completed ? (
                // Checkmark on Brand-Rose accent — always white regardless of theme.
                <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '700' }}>✓</Text>
              ) : null}
            </View>
          </View>

          {body ? (
            <Text className="mt-2 text-[14px] leading-[22px] text-darkGray">{body}</Text>
          ) : null}

          {ingredient ? (
            <Text
              className="mt-4 text-darkGray"
              style={{
                fontSize: 11,
                fontWeight: '600',
                letterSpacing: 1.6,
                textTransform: 'uppercase',
              }}
            >
              {ingredient}
            </Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

// Builds the daily AM routine surface and keeps completion saved on the device.
export default function RoutineScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const { theme, colors: themeColors } = useTheme();
  const [plan, setPlan] = useState<RoutinePlan | null>(null);
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<RoutineTimeOfDay>('am');
  const [completedStepIds, setCompletedStepIds] = useState<string[]>([]);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [loadingCompletion, setLoadingCompletion] = useState(true);
  const [planError, setPlanError] = useState('');
  const [completionError, setCompletionError] = useState('');
  const [savingStepId, setSavingStepId] = useState<string | null>(null);

  const completionStorageKey = useMemo(
    () => getRoutineCompletionStorageKey(selectedTimeOfDay),
    [selectedTimeOfDay]
  );

  // Pull the last 7 days of routine completion from AsyncStorage. Refresh on every
  // toggle so the streak + strip stay in sync with reality. The refresh key bundles
  // both the count of completed steps and the selected tab so AM→PM tab changes also
  // re-fetch (the per-window state is owned by completedStepIds at any one time).
  const history = useRoutineHistory(`${selectedTimeOfDay}:${completedStepIds.length}`);
  const todayFromHistory = history.days[0];
  const todayAm =
    selectedTimeOfDay === 'am' ? completedStepIds.length > 0 : !!todayFromHistory?.am;
  const todayPm =
    selectedTimeOfDay === 'pm' ? completedStepIds.length > 0 : !!todayFromHistory?.pm;
  // Recompute the AM streak using the live `todayAm` rather than the (possibly stale)
  // AsyncStorage read for today — keeps the counter honest right after a fresh toggle.
  let liveAmStreak = todayAm ? 1 : 0;
  for (let i = 1; i < history.days.length; i++) {
    if (history.days[i].am) liveAmStreak++;
    else break;
  }

  const visibleSteps = useMemo(() => {
    if (!plan) return [];

    return selectedTimeOfDay === 'am' ? plan.amSteps : plan.pmSteps;
  }, [plan, selectedTimeOfDay]);

  const completedCount = visibleSteps.filter((step) =>
    completedStepIds.includes(step.id)
  ).length;

  const headerTitle =
    selectedTimeOfDay === 'am' ? t('routine.titleAm') : t('routine.titlePm');

  // Loads the mock routine plan behind a service layer so real Gemini output can replace it later.
  async function loadPlan() {
    setLoadingPlan(true);
    setPlanError('');

    const { data, error } = await getRoutinePlan();

    if (error || !data) {
      setPlanError(error ?? t('routine.needsRefresh'));
      setPlan(null);
    } else {
      setPlan(data);
    }

    setLoadingPlan(false);
  }

  // Reads saved completion after the plan or selected routine changes.
  async function loadCompletion() {
    setLoadingCompletion(true);
    setCompletionError('');

    try {
      const storedStepIds = await AsyncStorage.getItem(completionStorageKey);
      const parsedStepIds: unknown = storedStepIds ? JSON.parse(storedStepIds) : [];

      setCompletedStepIds(
        Array.isArray(parsedStepIds) &&
          parsedStepIds.every((stepId) => typeof stepId === 'string')
          ? parsedStepIds
          : []
      );
    } catch {
      setCompletedStepIds([]);
      setCompletionError(t('routine.progressLoadError'));
    } finally {
      setLoadingCompletion(false);
    }
  }

  useEffect(() => {
    void loadPlan();
  }, []);

  useEffect(() => {
    if (!plan) return;

    void loadCompletion();
  }, [completionStorageKey, plan]);

  // Free users cannot enter the PM tab. The PM segment renders disabled rather than
  // snapping back silently, so the user understands the gate before tapping.
  function handleTimeOfDayPress(timeOfDay: RoutineTimeOfDay) {
    if (timeOfDay === 'pm' && !plan?.isPremium) return;
    setSelectedTimeOfDay(timeOfDay);
  }

  // Saves completed step IDs immediately so progress survives closing Expo Go.
  async function handleStepToggle(stepId: string) {
    const nextCompletedStepIds = completedStepIds.includes(stepId)
      ? completedStepIds.filter((completedStepId) => completedStepId !== stepId)
      : [...completedStepIds, stepId];

    setSavingStepId(stepId);
    setCompletionError('');
    setCompletedStepIds(nextCompletedStepIds);

    try {
      await AsyncStorage.setItem(
        completionStorageKey,
        JSON.stringify(nextCompletedStepIds)
      );
    } catch {
      setCompletedStepIds(completedStepIds);
      setCompletionError(t('routine.stepSaveError'));
    } finally {
      setSavingStepId(null);
    }
  }

  // Returns users to the landing tab after they finish reviewing the routine.
  // Routine is reached via router.push from Home, so back() is the correct affordance,
  // replace() would flatten history.
  function handleBackHomePress() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  }

  if (loadingPlan || loadingCompletion) {
    return (
      <SafeAreaView className="flex-1 bg-softBlush">
        <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={themeColors.surface} />
        <View className="flex-1 items-center justify-center px-5">
          <ActivityIndicator color={brandColors.brandRose} />
          <Text className="mt-5 text-center text-[17px] font-semibold text-deepMauve">
            {t('routine.loadingTitle')}
          </Text>
          <Text className="mt-2 text-center text-[15px] leading-7 text-darkGray">
            {t('routine.loadingBody')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (planError || !plan) {
    return (
      <SafeAreaView className="flex-1 bg-softBlush">
        <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={themeColors.surface} />
        <View className="flex-1 justify-center px-5">
          <View className="rounded-2xl border border-lightGray bg-white p-6">
            <Text className="text-[24px] font-semibold text-deepMauve">
              {t('routine.needsRefresh')}
            </Text>
            <Text className="mt-3 text-[15px] leading-6 text-darkGray">{planError}</Text>
            <Pressable
              className="mt-6 h-[52px] items-center justify-center rounded-xl bg-brandRose active:bg-dustyPink"
              onPress={loadPlan}
              accessibilityRole="button"
            >
              <Text className="text-[17px] font-semibold text-white">{t('routine.retry')}</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const bandLabelKey =
    plan.skinBand === 'green'
      ? 'routine.bandLabelGreen'
      : plan.skinBand === 'amber'
      ? 'routine.bandLabelAmber'
      : 'routine.bandLabelRed';
  const reassureKey =
    plan.skinBand === 'green'
      ? 'routine.reassureGreen'
      : plan.skinBand === 'amber'
      ? 'routine.reassureAmber'
      : 'routine.reassureRed';

  return (
    <View className="flex-1 bg-softBlush">
      <SafeAreaView className="flex-1 bg-softBlush">
        <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={themeColors.surface} />

        <ScrollView
          style={{ flex: 1, backgroundColor: themeColors.surface }}
          contentContainerStyle={{ paddingBottom: 96 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="px-5 pb-10 pt-6">
            <Text
              className="text-deepMauve"
              style={{
                fontFamily: 'DMSerifDisplay-Regular',
                fontSize: 32,
                fontWeight: '400',
                lineHeight: 38,
                letterSpacing: -0.3,
              }}
            >
              {headerTitle}
            </Text>
            <Text className="mt-2 text-[14px] leading-[22px] text-darkGray">
              {t('routine.intro')}
            </Text>

            {/* Inline AM/PM tabs with a Brand-Rose underline on the active segment. The
              old bordered-segment-control read as a hard chrome chip; this version reads
              as type-led tabs, in line with the typography-led routine numbering. */}
            <View
              className="mt-6 flex-row"
              style={{
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(212, 160, 167, 0.35)',
              }}
            >
              <InlineTab
                active={selectedTimeOfDay === 'am'}
                disabled={false}
                label={t('routine.tabAm')}
                onPress={() => handleTimeOfDayPress('am')}
              />
              <InlineTab
                active={selectedTimeOfDay === 'pm'}
                disabled={!plan.isPremium}
                label={t('routine.tabPm')}
                premiumChip={!plan.isPremium ? t('routine.premiumChip') : undefined}
                onPress={() => handleTimeOfDayPress('pm')}
              />
            </View>

            {/* Tuned-for-band line lives directly on the Blush ground (no card) so the
              step cards below stay the only surfaced elements. Calmer hierarchy. */}
            <View className="mt-5 flex-row items-start">
              <Text
                className="mr-2 text-brandRose"
                style={{
                  fontFamily: 'DMSerifDisplay-Regular',
                  fontSize: 18,
                  lineHeight: 22,
                }}
              >
                {plan.bandGlyph}
              </Text>
              <View className="flex-1">
                <Text className="text-[14px] font-semibold text-deepMauve">
                  {t('routine.tunedForFmt', { band: t(bandLabelKey) })}
                </Text>
                <Text className="mt-1 text-[14px] leading-[22px] text-darkGray">
                  {t(reassureKey)}
                </Text>
              </View>
            </View>

            {/* Streak counter + 7-day completion strip. Sits between the band reassurance
              and the "Steps today" header — frames the current session in context of the
              user's history without becoming a card. */}
            <StreakStrip
              days={history.days}
              amStreak={liveAmStreak}
              todayAm={todayAm}
              todayPm={todayPm}
            />

            {/* Progress dots replace "Completed: N of M" text. A row of hairline-bordered
              circles, filled Brand-Rose as steps are completed. Quieter, more crafted,
              and works for any step count without copy. */}
            <View className="mt-7 mb-3 flex-row items-center">
              <Text className="text-[17px] font-semibold text-deepMauve">
                {t('routine.stepsToday')}
              </Text>
              <View className="ml-3 flex-row items-center">
                {visibleSteps.map((step, idx) => {
                  const isDone = completedStepIds.includes(step.id);
                  return (
                    <View
                      key={step.id}
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        marginLeft: idx === 0 ? 0 : 6,
                        // Filled = Brand Rose (invariant); empty = theme hairline.
                        backgroundColor: isDone ? brandColors.brandRose : 'transparent',
                        borderWidth: isDone ? 0 : 1,
                        borderColor: themeColors.inkMuted,
                      }}
                    />
                  );
                })}
              </View>
            </View>

            {completionError ? (
              <View className="mb-4 rounded-2xl border border-error bg-white p-4">
                <Text className="text-[14px] leading-5 text-error">{completionError}</Text>
              </View>
            ) : null}

            {visibleSteps.map((step) => (
              <RoutineStepCard
                key={step.id}
                step={step}
                completed={completedStepIds.includes(step.id)}
                saving={savingStepId === step.id}
                onToggle={handleStepToggle}
              />
            ))}

            {!plan.isPremium ? (
              <View
                className="mt-2 rounded-2xl bg-white p-5"
                style={{
                  borderWidth: 1,
                  borderColor: 'rgba(201, 168, 76, 0.45)',
                }}
              >
                <Text
                  style={{
                    // Gold premium nudge is brand-invariant.
                    color: brandColors.gold,
                    fontSize: 11,
                    fontWeight: '600',
                    letterSpacing: 1.8,
                    textTransform: 'uppercase',
                  }}
                >
                  {t('routine.premiumEyebrow')}
                </Text>
                <Text
                  className="mt-3 text-deepMauve"
                  style={{
                    fontFamily: 'DMSerifDisplay-Regular',
                    fontSize: 20,
                    lineHeight: 26,
                  }}
                >
                  {t('routine.premiumTitle')}
                </Text>
                <Text className="mt-2 text-[14px] leading-[22px] text-darkGray">
                  {t('routine.premiumBody')}
                </Text>
              </View>
            ) : null}

            {/* Back-to-home is a quiet ghost link, not a competing button. The user came
              from Home; this is an exit hatch, not a primary action. */}
            <Pressable
              className="mt-8 self-center px-4 py-2 active:opacity-60"
              onPress={handleBackHomePress}
              accessibilityRole="button"
            >
              <Text className="text-[14px] font-medium text-brandRose">
                {t('routine.back')}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// Type-led tab for the AM/PM split. Active state earns a 2px Brand-Rose underline that
// crosses the parent hairline; inactive sits quiet on the same line. Disabled (free
// account on PM) drops opacity and surfaces the Premium chip inline so the user
// understands the gate before tapping.
function InlineTab({
  active,
  disabled,
  label,
  premiumChip,
  onPress,
}: {
  active: boolean;
  disabled: boolean;
  label: string;
  premiumChip?: string;
  onPress: () => void;
}) {
  const { colors: theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ selected: active, disabled }}
      style={{
        opacity: disabled ? 0.5 : 1,
        marginRight: 24,
        paddingBottom: 10,
        marginBottom: -1,
        borderBottomWidth: active ? 2 : 0,
        // Brand-invariant rose underline anchors the active tab on both themes.
        borderBottomColor: brandColors.brandRose,
      }}
    >
      <View className="flex-row items-center">
        <Text
          style={{
            fontSize: 15,
            fontWeight: active ? '600' : '500',
            // Active = Brand Rose (invariant). Inactive = theme primary ink so it
            // reads correctly against both Soft Blush and Warm Dark surfaces.
            color: active ? brandColors.brandRose : theme.ink,
            letterSpacing: 0.3,
          }}
        >
          {label}
        </Text>
        {premiumChip ? (
          <View
            className="ml-2 rounded-full px-2 py-0.5"
            // Gold premium chip is brand-invariant on both themes.
            style={{ borderWidth: 1, borderColor: brandColors.gold }}
          >
            <Text
              style={{
                color: brandColors.gold,
                fontSize: 10,
                fontWeight: '600',
                letterSpacing: 0.6,
              }}
            >
              {premiumChip}
            </Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}
