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

// Renders one routine step with bilingual copy and a tap target for completion.
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
  const checkClassName = completed
    ? 'border-brandRose bg-brandRose'
    : 'border-lightGray bg-softBlush';
  const checkTextClassName = completed ? 'text-white' : 'text-darkGray';
  const savingClassName = saving ? 'opacity-70' : 'opacity-100';

  return (
    <Pressable
      className={`mb-3 rounded-2xl border border-lightGray bg-white px-4 py-4 active:opacity-80 ${savingClassName}`}
      onPress={() => onToggle(step.id)}
      disabled={saving}
      accessibilityRole="button"
      accessibilityLabel={`${step.titleEn}, ${completed ? 'completed' : 'not completed'}`}
    >
      <View className="flex-row items-start">
        <View className="mr-4 h-10 w-10 items-center justify-center rounded-full bg-softBlush">
          <Text className="text-[15px] font-semibold text-brandRose">
            {String(step.stepNumber).padStart(2, '0')}
          </Text>
        </View>

        <View className="flex-1">
          <View className="flex-row items-start">
            <View className="flex-1 pr-3">
              <Text className="text-[19px] font-semibold text-deepMauve">
                {step.titleEn}
              </Text>
              <Text className="mt-1 text-[16px] leading-7 text-deepMauve">
                {step.titleAr}
              </Text>
            </View>

            <View
              className={`h-9 w-9 items-center justify-center rounded-full border ${checkClassName}`}
            >
              <Text className={`text-[17px] font-semibold ${checkTextClassName}`}>
                {completed ? '✓' : ''}
              </Text>
            </View>
          </View>

          <Text className="mt-3 text-[15px] leading-6 text-darkGray">
            {step.descriptionEn}
          </Text>
          <Text className="mt-1 text-[15px] leading-7 text-darkGray">
            {step.descriptionAr}
          </Text>

          <View className="mt-4 self-start rounded-full bg-softLavender px-3 py-2">
            <Text className="text-[13px] font-medium text-deepMauve">
              {step.ingredientEn} | {step.ingredientAr}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

// Builds the daily AM routine surface and keeps completion saved on the device.
export default function RoutineScreen() {
  const router = useRouter();
  const [plan, setPlan] = useState<RoutinePlan | null>(null);
  const [selectedTimeOfDay, setSelectedTimeOfDay] =
    useState<RoutineTimeOfDay>('am');
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

  const headerTitleEn =
    selectedTimeOfDay === 'am' ? 'Your morning.' : 'Your evening.';
  const headerTitleAr =
    selectedTimeOfDay === 'am' ? 'صباحك.' : 'مساؤك.';

  // Loads the mock routine plan behind a service layer so real Gemini output can replace it later.
  async function loadPlan() {
    setLoadingPlan(true);
    setPlanError('');

    const { data, error } = await getRoutinePlan();

    if (error || !data) {
      setPlanError(error ?? 'Routine plan could not be prepared. Please try again.');
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
      setCompletionError(
        'Saved routine progress could not be loaded. You can still use the routine.'
      );
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

  // Keeps free users on AM while still showing the PM value clearly as a premium upgrade.
  function handleTimeOfDayPress(timeOfDay: RoutineTimeOfDay) {
    if (timeOfDay === 'pm' && !plan?.isPremium) {
      setSelectedTimeOfDay('am');
      return;
    }

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
      setCompletionError('This step could not be saved. Please try again.');
    } finally {
      setSavingStepId(null);
    }
  }

  // Returns users to the landing tab after they finish reviewing the routine.
  function handleBackHomePress() {
    router.replace('/(tabs)/home');
  }

  if (loadingPlan || loadingCompletion) {
    return (
      <SafeAreaView className="flex-1 bg-softBlush">
        <StatusBar barStyle="dark-content" backgroundColor={colors.softBlush} />
        <View className="flex-1 items-center justify-center px-5">
          <ActivityIndicator color={colors.brandRose} />
          <Text className="mt-5 text-center text-[17px] font-semibold text-deepMauve">
            Preparing your routine
          </Text>
          <Text className="mt-2 text-center text-[15px] leading-7 text-darkGray">
            نجهز روتينك اليومي بهدوء
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
              Routine needs a refresh.
            </Text>
            <Text className="mt-3 text-[15px] leading-6 text-darkGray">
              {planError}
            </Text>
            <Pressable
              className="mt-6 h-[52px] items-center justify-center rounded-xl bg-brandRose active:bg-dustyPink"
              onPress={loadPlan}
              accessibilityRole="button"
            >
              <Text className="text-[17px] font-semibold text-white">
                Try again
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-softBlush">
      <SafeAreaView className="flex-1 bg-softBlush">
        <StatusBar barStyle="dark-content" backgroundColor={colors.softBlush} />

        <ScrollView
          className="flex-1 bg-softBlush"
          showsVerticalScrollIndicator={false}
        >
          <View className="px-5 pb-10 pt-6">
            <View className="mb-6 flex-row items-start justify-between">
              <View className="flex-1 pr-5">
                <Text className="text-[28px] font-semibold text-deepMauve">
                  {headerTitleEn}
                </Text>
                <Text className="mt-1 text-[21px] leading-8 text-deepMauve">
                  {headerTitleAr}
                </Text>
                <Text className="mt-4 text-[15px] leading-6 text-darkGray">
                  Three calm steps for GCC heat, sunscreen days, and steady skin.
                </Text>
                <Text className="mt-1 text-[15px] leading-7 text-darkGray">
                  ثلاث خطوات هادئة تناسب حرارة الخليج وأيام واقي الشمس.
                </Text>
              </View>

              <View className="h-24 w-24 items-center justify-center rounded-2xl bg-white">
                <GeneratedIcon source={routineIcon} size="lg" />
              </View>
            </View>

          <View className="mb-5 flex-row rounded-2xl bg-white p-1">
            <Pressable
              className={`h-12 flex-1 items-center justify-center rounded-xl ${
                selectedTimeOfDay === 'am' ? 'bg-brandRose' : 'bg-white'
              }`}
              onPress={() => handleTimeOfDayPress('am')}
              accessibilityRole="button"
            >
              <Text
                className={`text-[15px] font-semibold ${
                  selectedTimeOfDay === 'am' ? 'text-white' : 'text-deepMauve'
                }`}
              >
                AM | صباح
              </Text>
            </Pressable>

            <Pressable
              className={`ml-1 h-12 flex-1 items-center justify-center rounded-xl ${
                selectedTimeOfDay === 'pm' ? 'bg-brandRose' : 'bg-softBlush'
              }`}
              onPress={() => handleTimeOfDayPress('pm')}
              accessibilityRole="button"
              accessibilityState={{ disabled: !plan.isPremium }}
            >
              <View className="flex-row items-center">
                <Text
                  className={`text-[15px] font-semibold ${
                    selectedTimeOfDay === 'pm' ? 'text-white' : 'text-deepMauve'
                  }`}
                >
                  PM | مساء
                </Text>
                {!plan.isPremium ? (
                  <Text className="ml-2 text-[11px] font-semibold text-gold">
                    Premium
                  </Text>
                ) : null}
              </View>
            </Pressable>
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
                  Tuned for your {plan.bandLabelEn.toLowerCase()} skin today.
                </Text>
                <Text className="mt-1 text-[15px] leading-6 text-darkGray">
                  {plan.reassuranceEn}
                </Text>
                <Text className="mt-1 text-[15px] leading-7 text-darkGray">
                  {plan.reassuranceAr}
                </Text>
              </View>
            </View>
          </View>

          <View className="mb-4 flex-row items-center justify-between">
            <View>
              <Text className="text-[17px] font-semibold text-deepMauve">
                Steps today
              </Text>
              <Text className="mt-1 text-[13px] text-darkGray">
                Completed: {completedCount} of {visibleSteps.length}
              </Text>
            </View>
            <View className="rounded-full bg-white px-3 py-2">
              <Text className="text-[13px] font-semibold text-brandRose">
                {completedCount}/{visibleSteps.length}
              </Text>
            </View>
          </View>

          {completionError ? (
            <View className="mb-4 rounded-2xl border border-error bg-white p-4">
              <Text className="text-[14px] leading-5 text-error">
                {completionError}
              </Text>
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
              <Text className="text-[13px] font-semibold uppercase text-gold">
                Premium PM routine
              </Text>
              <Text className="mt-3 text-[17px] font-semibold text-deepMauve">
                Evening care, tuned for repair.
              </Text>
              <Text className="mt-2 text-[15px] leading-6 text-darkGray">
                {plan.premiumHintEn}
              </Text>
              <Text className="mt-1 text-[15px] leading-7 text-darkGray">
                {plan.premiumHintAr}
              </Text>
            </View>
          ) : null}

          <Pressable
            className="mt-7 h-[52px] items-center justify-center rounded-xl border border-brandRose bg-white active:bg-softBlush"
            onPress={handleBackHomePress}
            accessibilityRole="button"
          >
            <Text className="text-[17px] font-semibold text-brandRose">
              Back to home
            </Text>
          </Pressable>
        </View>
      </ScrollView>
      </SafeAreaView>
    </View>
  );
}
