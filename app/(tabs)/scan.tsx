import { useCallback, useRef, useState } from 'react';
import { Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions, type CameraView as CameraViewType } from 'expo-camera';

import { FaceGuide } from '../../components/scan/FaceGuide';
import { ScanningRing } from '../../components/scan/ScanningRing';
import * as Haptics from 'expo-haptics';
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
import { useTheme } from '../../hooks/useTheme';

type Phase = 'idle' | 'counting' | 'analyzing' | 'result' | 'error';

function completeScore(scan: ScanResult): number | null {
  return scan.status === 'complete' && scan.overall_score !== null ? scan.overall_score : null;
}

export default function ScanScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const [phase, setPhase] = useState<Phase>('idle');
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraViewType | null>(null);

  const startCountdown = useCallback(() => {
    setErrorMessage(null);
    setScan(null);
    setPhase('counting');
  }, []);

  const onCountdownComplete = useCallback(async () => {
    setPhase('analyzing');
    try {
      // Capture the current frame from the live camera and base64-encode it. quality:0.6
      // keeps the payload under ~300 KB so the edge function isn't oversized.
      const photo = await cameraRef.current?.takePictureAsync({
        base64: true,
        quality: 0.6,
        skipProcessing: true,
      });
      const base64 = photo?.base64;
      if (!base64) {
        throw new Error(t('scan.errorFallback'));
      }
      const result = await analyzeSkin(base64);
      setScan(result);
      
      // Haptic feedback on scan complete
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Live scans return a 'pending' row from the async kick-off — there are no scores
      // yet, so show the in-progress UI on Home instead of the ResultSheet here.
      if (result.status === 'pending') {
        router.replace('/(tabs)');
      } else {
        setPhase('result');
      }
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : t('scan.errorFallback'));
      setPhase('error');
    }
  }, [router, t]);

  const close = useCallback(() => {
    router.replace('/(tabs)');
  }, [router]);

  const reassurance = (s: ScanResult) => {
    const score = completeScore(s);
    if (score === null) return t('home.pending.title');

    const band = bandFromScore(score);
    if (band === 'green') return t('home.score.reassureGreen');
    if (band === 'amber') return t('home.score.reassureAmber');
    return t('home.score.reassureRed');
  };

  // Permission state branches:
  //   undefined → hook still initialising; render the scaffold with a dim backdrop.
  //   granted=false → ask the user; show an Allow button.
  //   granted=true → render the live CameraView behind the face guide.
  const permissionResolved = permission !== null;
  const cameraReady = !!permission?.granted;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.scanBg }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.scanBg} />

      <View style={{ flex: 1 }}>
        {/* Live camera fills the entire scan area behind every overlay. */}
        {cameraReady ? (
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFillObject}
            facing="front"
            mirror
          />
        ) : (
          <View style={[StyleSheet.absoluteFillObject, { backgroundColor: colors.scanBg }]} />
        )}

        {/* Deep-Mauve-tinted overlay (warmer than pure black) keeps the camera readable
            without flattening it. The brand hue makes the face glow against the backdrop
            instead of being washed gray. */}
        <View
          pointerEvents="none"
          style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(45, 27, 46, 0.35)' }]}
        />

        <Pressable
          onPress={close}
          accessibilityRole="button"
          accessibilityLabel={t('scan.closeA11y')}
          hitSlop={8}
          style={({ pressed }) => ({
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 20,
            width: 44,
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 22,
            backgroundColor: pressed ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)',
          })}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: '300', lineHeight: 22 }}>×</Text>
        </Pressable>

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {phase !== 'result' ? (
            <ScanCanvas phase={phase} onCountdownComplete={onCountdownComplete} />
          ) : null}

          {phase === 'idle' && cameraReady ? (
            <View
              style={{ position: 'absolute', bottom: 56, left: 24, right: 24, alignItems: 'center' }}
            >
              <Text className="mb-5 text-center text-[14px] leading-[22px] text-white opacity-80">
                {t('scan.instructions')}
              </Text>
              <Button label={t('scan.start')} onPress={startCountdown} />
            </View>
          ) : null}

          {phase === 'idle' && permissionResolved && !cameraReady ? (
            <View
              style={{
                position: 'absolute',
                bottom: 48,
                left: 24,
                right: 24,
                alignItems: 'center',
              }}
            >
              <Text
                className="text-white opacity-70"
                style={{
                  fontSize: 12,
                  fontWeight: '500',
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                }}
              >
                {t('scan.permission.eyebrow')}
              </Text>
              <Text
                className="mt-2 mb-3 text-center text-white"
                style={{
                  fontFamily: 'DMSerifDisplay-Regular',
                  fontSize: 24,
                  lineHeight: 30,
                  letterSpacing: -0.1,
                }}
              >
                {t('scan.permission.title')}
              </Text>
              <Text className="mb-5 text-center text-[14px] leading-[22px] text-white opacity-80">
                {t('scan.permission.body')}
              </Text>
              <Button
                label={t('scan.permission.allow')}
                onPress={() => {
                  void requestPermission();
                }}
              />
            </View>
          ) : null}

          {phase === 'analyzing' ? (
            <Text
              style={{
                position: 'absolute',
                bottom: 88,
                alignSelf: 'center',
                color: '#FFFFFF',
                opacity: 0.7,
                fontSize: 12,
                fontWeight: '500',
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}
            >
              {t('scan.analyzing')}
            </Text>
          ) : null}

          {phase === 'error' ? (
            <View
              style={{ position: 'absolute', bottom: 56, left: 24, right: 24, alignItems: 'center' }}
            >
              <Text className="mb-4 text-center text-[14px] leading-[22px] text-white opacity-85">
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
          style={{
            position: 'absolute',
            top: -56,
            alignSelf: 'center',
            color: '#FFFFFF',
            opacity: 0.7,
            fontSize: 12,
            fontWeight: '500',
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          {t('scan.holdStill')}
        </Text>
      ) : null}

      <FaceGuide pulsing={phase === 'analyzing'} />
      <ScanningRing active={phase === 'analyzing'} />

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
  const { colors: themeColors } = useTheme();
  const score = completeScore(scan);

  if (score === null) return null;

  const band = bandFromScore(score);
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
        backgroundColor: themeColors.surface,
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
          backgroundColor: themeColors.hairline,
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
        score={score}
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
