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
import { colors } from '../../constants/colors';
import {
  getRoutinePlan,
  type RoutinePlan,
  type RoutineStep,
  type RoutineTimeOfDay,
} from '../../services/routineService';
import { GeneratedIcon } from '../../components/ui/GeneratedIcon';
import { useLanguage } from '../../hooks/useLanguage';

const routineIcon = require('../../assets/icons/nourah-scan-icon.png');

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
  const { t } = useLanguage();
  const title = t(`routine.step.${step.id}.title`);
  const body = t(`routine.step.${step.id}.body`);
  const ingredient = t(`routine.step.${step.id}.ingredient`);

  const checkClassName = completed
    ? 'border-brandRose bg-brandRose'
    : 'border-lightGray bg-softBlush';
  const checkTextClassName = completed ? 'text-white' : 'text-darkGray';
  const savingClassName = saving ? 'opacity-70' : 'opacity-100';

  return (
    <Pressable
      className={`mb-4 rounded-2xl border border-lightGray bg-white px-4 py-5 active:opacity-80 ${savingClassName}`}
      onPress={() => onToggle(step.id)}
      disabled={saving}
      accessibilityRole="button"
      accessibilityLabel={t('routine.a11yStepFmt', {
        title,
        state: completed ? t('routine.a11yStateCompleted') : t('routine.a11yStateNotCompleted'),
      })}
    >
      <View className="flex-row items-start">
        <View className="mr-4 h-11 w-11 items-center justify-center rounded-full bg-softBlush">
          <Text
            className="text-brandRose"
            style={{
              fontFamily: 'DMSerifDisplay-Regular',
              fontSize: 19,
              fontWeight: '400',
              lineHeight: 22,
            }}
          >
            {String(step.stepNumber).padStart(2, '0')}
          </Text>
        </View>

        <View className="flex-1">
          <View className="flex-row items-start">
            <View className="flex-1 pr-3">
              <Text className="text-[19px] font-semibold text-deepMauve">{title}</Text>
            </View>

            <View
              className={`h-11 w-11 items-center justify-center rounded-full border ${checkClassName}`}
            >
              <Text className={`text-[17px] font-semibold ${checkTextClassName}`}>
                {completed ? '✓' : ''}
              </Text>
            </View>
          </View>

          <Text className="mt-3 text-[15px] leading-6 text-darkGray">{body}</Text>

          <View className="mt-5 self-start rounded-full bg-softLavender px-4 py-2">
            <Text className="text-[13px] font-medium text-deepMauve">{ingredient}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

// Builds the daily AM routine surface and keeps completion saved on the device.
export default function RoutineScreen() {
  const router = useRouter();
  const { t } = useLanguage();
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
        <StatusBar barStyle="dark-content" backgroundColor={colors.softBlush} />
        <View className="flex-1 items-center justify-center px-5">
          <ActivityIndicator color={colors.brandRose} />
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
        <StatusBar barStyle="dark-content" backgroundColor={colors.softBlush} />
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
        <StatusBar barStyle="dark-content" backgroundColor={colors.softBlush} />

        <ScrollView className="flex-1 bg-softBlush" showsVerticalScrollIndicator={false}>
          <View className="px-5 pb-10 pt-6">
            <View className="mb-6 flex-row items-start justify-between">
              <View className="flex-1 pr-5">
                <Text
                  className="text-deepMauve"
                  style={{
                    fontFamily: 'DMSerifDisplay-Regular',
                    fontSize: 28,
                    fontWeight: '400',
                    lineHeight: 34,
                    letterSpacing: -0.2,
                  }}
                >
                  {headerTitle}
                </Text>
                <Text className="mt-3 text-[15px] leading-6 text-darkGray">
                  {t('routine.intro')}
                </Text>
              </View>

              <View className="h-24 w-24 items-center justify-center rounded-2xl border border-lightGray bg-white">
                <GeneratedIcon source={routineIcon} size="lg" />
              </View>
            </View>

            <View className="mb-6 flex-row rounded-2xl border border-lightGray bg-softBlush p-1">
              <TimeSegment
                active={selectedTimeOfDay === 'am'}
                disabled={false}
                label={t('routine.tabAm')}
                onPress={() => handleTimeOfDayPress('am')}
              />
              <TimeSegment
                active={selectedTimeOfDay === 'pm'}
                disabled={!plan.isPremium}
                label={t('routine.tabPm')}
                premiumChip={!plan.isPremium ? t('routine.premiumChip') : undefined}
                onPress={() => handleTimeOfDayPress('pm')}
              />
            </View>

            <View className="mb-5 rounded-2xl bg-white p-5">
              <View className="flex-row items-start">
                <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-softLavender">
                  <Text className="text-[17px] font-semibold text-brandRose">
                    {plan.bandGlyph}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-[15px] font-semibold text-deepMauve">
                    {t('routine.tunedForFmt', { band: t(bandLabelKey) })}
                  </Text>
                  <Text className="mt-1 text-[15px] leading-6 text-darkGray">
                    {t(reassureKey)}
                  </Text>
                </View>
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-[17px] font-semibold text-deepMauve">
                {t('routine.stepsToday')}
              </Text>
              <Text className="mt-1 text-[13px] text-darkGray">
                {t('routine.completedFmt', { done: completedCount, total: visibleSteps.length })}
              </Text>
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
              <View className="mt-1 rounded-2xl border border-gold bg-white p-5">
                <Text className="text-[13px] font-semibold uppercase tracking-[2px] text-gold">
                  {t('routine.premiumEyebrow')}
                </Text>
                <Text className="mt-3 text-[17px] font-semibold text-deepMauve">
                  {t('routine.premiumTitle')}
                </Text>
                <Text className="mt-2 text-[15px] leading-6 text-darkGray">
                  {t('routine.premiumBody')}
                </Text>
              </View>
            ) : null}

            <Pressable
              className="mt-7 h-[52px] items-center justify-center rounded-xl border border-brandRose bg-white active:bg-softBlush"
              onPress={handleBackHomePress}
              accessibilityRole="button"
            >
              <Text className="text-[17px] font-semibold text-brandRose">
                {t('routine.back')}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// One half of the AM/PM segmented control. Inactive segments stay transparent so the
// soft blush track still reads through, and disabled (free PM) drops opacity rather
// than vanishing.
function TimeSegment({
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
  const tint = active ? 'bg-brandRose' : 'bg-transparent';
  const text = active ? 'text-white' : 'text-deepMauve';
  const wrap = `${disabled ? 'opacity-50' : 'opacity-100'} h-12 flex-1 items-center justify-center rounded-xl ${tint}`;

  return (
    <Pressable
      className={wrap}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ selected: active, disabled }}
    >
      <View className="flex-row items-center">
        <Text className={`text-[15px] font-semibold ${text}`}>{label}</Text>
        {premiumChip ? (
          <View className="ml-2 rounded-full border border-gold px-2 py-0.5">
            <Text className="text-[11px] font-semibold text-gold">{premiumChip}</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}
