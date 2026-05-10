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
import { flagLabel } from '../../constants/climate';
import { colors } from '../../constants/colors';

type Phase = 'idle' | 'counting' | 'analyzing' | 'result' | 'error';

export default function ScanScreen() {
  const router = useRouter();
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
      setErrorMessage(e instanceof Error ? e.message : 'Could not read your skin.');
      setPhase('error');
    }
  }, []);

  const close = useCallback(() => {
    router.replace('/(tabs)');
  }, [router]);

  const reassurance = (s: ScanResult) => {
    const band = bandFromScore(s.overall_score);
    if (band === 'green') return 'Your skin is doing well today.';
    if (band === 'amber') return 'A few things to watch. Nothing urgent.';
    return "Let's take it gentle today.";
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.scanBg }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.scanBg} />

      <View style={{ flex: 1 }}>
        <Pressable
          onPress={close}
          accessibilityRole="button"
          accessibilityLabel="Close scan"
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
                Center your face in the oval. Soft front light works best.
              </Text>
              <Button label="Start scan" onPress={startCountdown} />
            </View>
          ) : null}

          {phase === 'analyzing' ? (
            <Text
              style={{ position: 'absolute', bottom: 96, alignSelf: 'center' }}
              className="text-[15px] tracking-[2px] text-white opacity-80"
            >
              ANALYZING…
            </Text>
          ) : null}

          {phase === 'error' ? (
            <View
              style={{ position: 'absolute', bottom: 64, left: 20, right: 20, alignItems: 'center' }}
            >
              <Text className="mb-3 text-center text-[15px] leading-6 text-white">
                {errorMessage ?? 'Could not read your skin. Try again.'}
              </Text>
              <Button label="Try again" onPress={startCountdown} />
            </View>
          ) : null}
        </View>

        {phase === 'result' && scan ? (
          <ResultSheet
            scan={scan}
            reassurance={reassurance(scan)}
            onDone={close}
          />
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
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      {phase === 'idle' ? (
        <Text
          style={{ position: 'absolute', top: -64, alignSelf: 'center' }}
          className="text-[15px] tracking-[2px] text-white opacity-70"
        >
          HOLD STILL
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
  const band = bandFromScore(scan.overall_score);
  const label =
    band === 'green'
      ? 'Overall · looking good'
      : band === 'amber'
      ? 'Overall · keep an eye out'
      : 'Overall · take it easy';

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
      <View style={{ alignSelf: 'center', height: 4, width: 36, borderRadius: 2, backgroundColor: colors.lightGray, marginBottom: 16 }} />

      <Text className="text-[12px] font-medium uppercase tracking-[2px] text-darkGray">
        Your reading
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
        flags={scan.gcc_flags.map(flagLabel)}
      />

      <View style={{ marginTop: 16 }}>
        <Button label="Done" onPress={onDone} />
      </View>
    </View>
  );
}
