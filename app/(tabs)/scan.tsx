import { useCallback, useState } from 'react';
import { Pressable, SafeAreaView, StatusBar, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { FaceGuide } from '../../components/scan/FaceGuide';
import { Countdown } from '../../components/scan/Countdown';
import { ScoreCard } from '../../components/ui/ScoreCard';
import { Button } from '../../components/ui/Button';
import {
  analyzeSkin,
  bandFromScore,
  type ScanResult,
} from '../../services/scanService';
import { colors } from '../../constants/colors';
import { useLanguage } from '../../hooks/useLanguage';

type Phase = 'idle' | 'counting' | 'analyzing' | 'result' | 'error';

export default function ScanScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const [phase, setPhase] = useState<Phase>('idle');
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const startCountdown = useCallback(() => {
    setErrorMessage(null);
    setScan(null);
    setPhase('counting');
  }, []);

  const onCountdownComplete = useCallback(async () => {
    setPhase('analyzing');
    try {
      const result = await analyzeSkin('mock-image-base64');
      setScan(result);
      setPhase('result');
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : t('scan.errorFallback'));
      setPhase('error');
    }
  }, [t]);

  const close = useCallback(() => {
    router.replace('/(tabs)');
  }, [router]);

  const reassurance = (s: ScanResult) => {
    const band = bandFromScore(s.overall_score);
    if (band === 'green') return t('home.score.reassureGreen');
    if (band === 'amber') return t('home.score.reassureAmber');
    return t('home.score.reassureRed');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.scanBg }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.scanBg} />

      <View style={{ flex: 1 }}>
        <Pressable
          onPress={close}
          accessibilityRole="button"
          accessibilityLabel={t('scan.closeA11y')}
          style={{ position: 'absolute', top: 16, left: 16, zIndex: 20, padding: 8 }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: '300' }}>×</Text>
        </Pressable>

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {phase !== 'result' ? (
            <ScanCanvas phase={phase} onCountdownComplete={onCountdownComplete} />
          ) : null}

          {phase === 'idle' ? (
            <View
              style={{ position: 'absolute', bottom: 64, left: 20, right: 20, alignItems: 'center' }}
            >
              <Text className="mb-4 text-center text-[15px] leading-6 text-white opacity-90">
                {t('scan.instructions')}
              </Text>
              <Button label={t('scan.start')} onPress={startCountdown} />
            </View>
          ) : null}

          {phase === 'analyzing' ? (
            <Text
              style={{ position: 'absolute', bottom: 96, alignSelf: 'center' }}
              className="text-[15px] tracking-[2px] text-white opacity-80"
            >
              {t('scan.analyzing')}
            </Text>
          ) : null}

          {phase === 'error' ? (
            <View
              style={{ position: 'absolute', bottom: 64, left: 20, right: 20, alignItems: 'center' }}
            >
              <Text className="mb-3 text-center text-[15px] leading-6 text-white">
                {errorMessage ?? t('scan.errorFallback')}
              </Text>
              <Button label={t('common.tryAgain')} onPress={startCountdown} />
            </View>
          ) : null}
        </View>

        {phase === 'result' && scan ? (
          <ResultSheet scan={scan} reassurance={reassurance(scan)} onDone={close} />
        ) : null}
      </View>
    </SafeAreaView>
  );
}

function ScanCanvas({
  phase,
  onCountdownComplete,
}: {
  phase: Phase;
  onCountdownComplete: () => void;
}) {
  const { t } = useLanguage();

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      {phase === 'idle' ? (
        <Text
          style={{ position: 'absolute', top: -64, alignSelf: 'center' }}
          className="text-[15px] tracking-[2px] text-white opacity-70"
        >
          {t('scan.holdStill')}
        </Text>
      ) : null}

      <FaceGuide pulsing={phase === 'analyzing'} />

      {phase === 'counting' ? (
        <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center' }}>
          <Countdown from={3} onComplete={onCountdownComplete} />
        </View>
      ) : null}
    </View>
  );
}

function ResultSheet({
  scan,
  reassurance,
  onDone,
}: {
  scan: ScanResult;
  reassurance: string;
  onDone: () => void;
}) {
  const { t } = useLanguage();
  const band = bandFromScore(scan.overall_score);
  const label =
    band === 'green'
      ? t('home.score.categoryGreen')
      : band === 'amber'
      ? t('home.score.categoryAmber')
      : t('home.score.categoryRed');

  const flagLabels = scan.gcc_flags.map((f) => t(`home.flags.${f}`));

  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.softBlush,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        paddingBottom: 32,
      }}
    >
      <View
        style={{
          alignSelf: 'center',
          height: 4,
          width: 36,
          borderRadius: 2,
          backgroundColor: colors.lightGray,
          marginBottom: 16,
        }}
      />

      <Text className="text-[12px] font-medium uppercase tracking-[2px] text-darkGray">
        {t('scan.yourReading')}
      </Text>
      <Text
        className="mt-1 mb-4 text-deepMauve"
        style={{
          fontFamily: 'DMSerifDisplay-Regular',
          fontSize: 24,
          fontWeight: '400',
          lineHeight: 30,
        }}
      >
        {reassurance}
      </Text>

      <ScoreCard
        score={scan.overall_score}
        band={band}
        label={label}
        reassurance={reassurance}
        flags={flagLabels}
      />

      <View style={{ marginTop: 16 }}>
        <Button label={t('scan.done')} onPress={onDone} />
      </View>
    </View>
  );
}
