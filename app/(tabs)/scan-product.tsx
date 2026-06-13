// Barcode scanner sub-route inside the Products flow. Lives in (tabs)/ so the tab bar
// stays visible (matches the face Scan tab's pattern). Hidden from the tab bar itself
// via `href: null` in (tabs)/_layout.tsx — reachable only by push from products.tsx.

import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions, type BarcodeType } from 'expo-camera';
import { colors } from '../../constants/colors';
import { useLanguage } from '../../hooks/useLanguage';
import { useProfile } from '../../hooks/useProfile';
import {
  lookupProduct,
  type ProductLookupResult,
  type HalalVerdict,
} from '../../services/productService';
import {
  personalizeIngredients,
  type PersonalizedMatch,
} from '../../lib/personalize';

type Phase = 'permission' | 'scanning' | 'looking-up' | 'result' | 'not-found' | 'error';

const SUPPORTED_BARCODES: BarcodeType[] = ['ean13', 'ean8', 'upc_a', 'upc_e'];

// Web laptops only have a front-facing webcam, and that's what `facing="front"` selects.
// Native phones default to the back camera which is what you'd actually point at a
// product. Either way expo-camera falls back gracefully if the requested camera doesn't
// exist on the device.
const DEFAULT_FACING: 'front' | 'back' = Platform.OS === 'web' ? 'front' : 'back';

// Two demo barcodes wired through productService's mock + real paths. Tapping them
// simulates a successful scan without needing a physical product in frame — useful for
// testing the result / not-found UI on a laptop. Real users will scan real barcodes.
const DEMO_BARCODES = [
  { label: 'Demo · halal product', value: '5901234123457' },
  { label: 'Demo · doubtful product', value: '0123456789012' },
];

// Maps a YouCam-style halal verdict to a (color, copy-key) pair. Color paired with
// label per the Score-Triplet Rule — color is never the only carrier of meaning.
function verdictTone(verdict: HalalVerdict): { color: string; bg: string; key: string } {
  switch (verdict) {
    case 'halal':
      return { color: colors.success, bg: 'rgba(123, 168, 146, 0.12)', key: 'products.scan.verdictHalal' };
    case 'haram':
      return { color: colors.error, bg: 'rgba(199, 74, 96, 0.12)', key: 'products.scan.verdictHaram' };
    case 'doubtful':
      return { color: colors.warning, bg: 'rgba(217, 167, 106, 0.14)', key: 'products.scan.verdictDoubtful' };
    default:
      return { color: colors.darkGray, bg: 'rgba(90, 90, 90, 0.08)', key: 'products.scan.verdictUnknown' };
  }
}

export default function ScanProductScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const [permission, requestPermission] = useCameraPermissions();
  const [phase, setPhase] = useState<Phase>('scanning');
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);
  const [product, setProduct] = useState<ProductLookupResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // The barcode scanner can fire many events per second. Once we've captured one and
  // started the lookup, gate subsequent fires so we don't spam Open Food Facts.
  const handlingRef = useRef(false);

  const cameraReady = !!permission?.granted;
  const permissionResolved = permission !== null;

  const close = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)/products');
  }, [router]);

  const handleBarcode = useCallback(
    async ({ data }: { data: string }) => {
      if (handlingRef.current) return;
      if (phase !== 'scanning') return;
      handlingRef.current = true;

      setScannedBarcode(data);
      setPhase('looking-up');

      const result = await lookupProduct(data);

      if (result.data) {
        setProduct(result.data);
        setPhase('result');
      } else if (result.code === 'NOT_FOUND') {
        setPhase('not-found');
      } else {
        setErrorMessage(result.error ?? null);
        setPhase('error');
      }
    },
    [phase],
  );

  const tryAgain = useCallback(() => {
    handlingRef.current = false;
    setProduct(null);
    setScannedBarcode(null);
    setErrorMessage(null);
    setPhase('scanning');
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.scanBg }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.scanBg} />

      <View style={{ flex: 1 }}>
        {cameraReady ? (
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing={DEFAULT_FACING}
            onBarcodeScanned={phase === 'scanning' ? handleBarcode : undefined}
            barcodeScannerSettings={{ barcodeTypes: SUPPORTED_BARCODES }}
          />
        ) : (
          <View style={[StyleSheet.absoluteFillObject, { backgroundColor: colors.scanBg }]} />
        )}

        {/* Warm Deep-Mauve tinted overlay, matching the face Scan tab. */}
        <View
          pointerEvents="none"
          style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(45, 27, 46, 0.45)' }]}
        />

        {/* Close button — top-right, 44pt touch target, matches face Scan tab. */}
        <Pressable
          onPress={close}
          accessibilityRole="button"
          accessibilityLabel={t('products.scan.closeA11y')}
          hitSlop={8}
          style={({ pressed }) => ({
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 30,
            width: 44,
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 22,
            backgroundColor: pressed ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)',
          })}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: '300' }}>×</Text>
        </Pressable>

        {/* Barcode guide frame + eyebrow + body, centered. Matches the face-scan
            language: tracked-uppercase eyebrow above, serif headline below, body small.
            Below the guide: demo-barcode buttons so the lookup flow can be exercised
            without a physical product in frame (essential on a laptop webcam pointed at
            your face). Real users with a real barcode will get a hit before tapping. */}
        {phase === 'scanning' && cameraReady ? (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 32,
            }}
          >
            <BarcodeGuide />
            <Text
              style={{
                marginTop: 28,
                color: '#FFFFFF',
                opacity: 0.7,
                fontSize: 12,
                fontWeight: '500',
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}
            >
              {t('products.scan.aimEyebrow')}
            </Text>
            <Text className="mt-2 text-center text-[14px] leading-[22px] text-white opacity-80">
              {t('products.scan.aimBody')}
            </Text>

            <View
              style={{
                marginTop: 28,
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {DEMO_BARCODES.map((demo) => (
                <Pressable
                  key={demo.value}
                  onPress={() => handleBarcode({ data: demo.value })}
                  accessibilityRole="button"
                  style={({ pressed }) => ({
                    marginHorizontal: 4,
                    marginVertical: 4,
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 999,
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.45)',
                    backgroundColor: pressed
                      ? 'rgba(255,255,255,0.18)'
                      : 'rgba(255,255,255,0.08)',
                  })}
                >
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: 12,
                      fontWeight: '500',
                      letterSpacing: 0.3,
                    }}
                  >
                    {demo.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}

        {/* Permission denied — same warm pattern as the face Scan permission card. */}
        {permissionResolved && !cameraReady ? (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 32,
            }}
          >
            <Text
              style={{
                color: '#FFFFFF',
                opacity: 0.7,
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
            <Pressable
              onPress={() => void requestPermission()}
              style={({ pressed }) => ({
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 14,
                backgroundColor: pressed ? '#D4547A' : colors.brandRose,
              })}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '600', letterSpacing: 0.4 }}>
                {t('scan.permission.allow')}
              </Text>
            </Pressable>

            {/* Demo buttons mirror those shown once the camera is granted — let users
              poke the lookup flow without granting camera (useful on a laptop where
              barcode detection is awkward). */}
            <View
              style={{
                marginTop: 32,
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {DEMO_BARCODES.map((demo) => (
                <Pressable
                  key={demo.value}
                  onPress={() => handleBarcode({ data: demo.value })}
                  accessibilityRole="button"
                  style={({ pressed }) => ({
                    marginHorizontal: 4,
                    marginVertical: 4,
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 999,
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.45)',
                    backgroundColor: pressed
                      ? 'rgba(255,255,255,0.18)'
                      : 'rgba(255,255,255,0.08)',
                  })}
                >
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: 12,
                      fontWeight: '500',
                      letterSpacing: 0.3,
                    }}
                  >
                    {demo.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}

        {/* Looking-up — small spinner over the live camera preview. */}
        {phase === 'looking-up' ? (
          <View
            style={{
              position: 'absolute',
              left: 24,
              right: 24,
              bottom: 56,
              alignItems: 'center',
            }}
          >
            <ActivityIndicator color="#FFFFFF" />
            <Text
              style={{
                marginTop: 12,
                color: '#FFFFFF',
                opacity: 0.8,
                fontSize: 12,
                fontWeight: '500',
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}
            >
              {t('products.scan.lookingUp')}
            </Text>
            {scannedBarcode ? (
              <Text className="mt-1 text-[13px] text-white opacity-60">{scannedBarcode}</Text>
            ) : null}
          </View>
        ) : null}

        {/* Result bottom sheet (success). */}
        {phase === 'result' && product ? (
          <ResultSheet product={product} onTryAnother={tryAgain} onClose={close} />
        ) : null}

        {/* Result bottom sheet (not found). */}
        {phase === 'not-found' ? (
          <NotFoundSheet barcode={scannedBarcode} onTryAnother={tryAgain} onClose={close} />
        ) : null}

        {/* Result bottom sheet (lookup error). */}
        {phase === 'error' ? (
          <ErrorSheet message={errorMessage} onTryAnother={tryAgain} onClose={close} />
        ) : null}
      </View>
    </SafeAreaView>
  );
}

// Rounded-rectangle barcode guide. Wider than tall to match a real barcode's aspect.
// Brand-Rose border, with two short serif tick marks on the long sides to suggest the
// scan line. Quieter than animated overlays; intentionally still.
function BarcodeGuide() {
  return (
    <View
      style={{
        width: 280,
        height: 140,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: colors.brandRose,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          width: 240,
          height: 1,
          backgroundColor: 'rgba(212, 160, 167, 0.6)',
        }}
      />
    </View>
  );
}

// Shared sheet base — Soft-Blush surface, rounded-top, generous padding. Used by all
// three result states (found / not-found / error) for visual consistency.
function SheetBase({ children }: { children: React.ReactNode }) {
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
        paddingHorizontal: 20,
        paddingTop: 16,
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
      {children}
    </View>
  );
}

function ResultSheet({
  product,
  onTryAnother,
  onClose,
}: {
  product: ProductLookupResult;
  onTryAnother: () => void;
  onClose: () => void;
}) {
  const { t, lang } = useLanguage();
  const { profile } = useProfile();
  const tone = verdictTone(product.halal_verdict);

  // Personalize against the signed-in user's skin_type + concerns. The matcher returns
  // empty arrays when there's no profile (mock-auth dev) or when no ingredient matched
  // either direction — in that case the sections are simply hidden.
  const personalization = personalizeIngredients(product.ingredients, profile);
  const hasPersonalization =
    personalization.recommended.length > 0 || personalization.avoid.length > 0;
  // Profile completion check — used to surface a quiet onboarding nudge when the lookup
  // is otherwise empty (no halal flags AND no personalization possible because the
  // profile is sparse). We don't show this when there are flags or matches, since the
  // user is already getting value from the sheet.
  const profileIncomplete =
    !profile ||
    (!profile.skin_type && (!profile.concerns || profile.concerns.length === 0));

  return (
    <SheetBase>
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          {product.brand ? (
            <Text
              style={{
                color: colors.brandRose,
                fontSize: 11,
                fontWeight: '600',
                letterSpacing: 1.6,
                textTransform: 'uppercase',
              }}
            >
              {product.brand}
            </Text>
          ) : null}
          <Text
            className="mt-1 text-deepMauve"
            style={{
              fontFamily: 'DMSerifDisplay-Regular',
              fontSize: 22,
              lineHeight: 28,
              letterSpacing: -0.1,
            }}
          >
            {product.name ?? product.barcode}
          </Text>
        </View>

        <View className="rounded-full px-2.5 py-1.5" style={{ backgroundColor: tone.bg }}>
          <Text
            style={{ color: tone.color, fontSize: 11, fontWeight: '600', letterSpacing: 0.6 }}
          >
            {t(tone.key)}
          </Text>
        </View>
      </View>

      {product.flagged_ingredients.length > 0 ? (
        <View className="mt-4">
          <Text
            style={{
              color: colors.darkGray,
              fontSize: 11,
              fontWeight: '600',
              letterSpacing: 1.6,
              textTransform: 'uppercase',
            }}
          >
            {t('products.scan.flaggedHeader')}
          </Text>
          <View className="mt-2 flex-row flex-wrap">
            {product.flagged_ingredients.map((flag) => (
              <View
                key={flag}
                className="mr-2 mt-2 rounded-full px-2.5 py-1"
                style={{ backgroundColor: tone.bg }}
              >
                <Text
                  style={{ color: tone.color, fontSize: 12, fontWeight: '500' }}
                >
                  {flag}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {product.ingredients.length === 0 ? (
        <Text className="mt-4 text-[13px] leading-5 text-darkGray">
          {t('products.scan.noIngredients')}
        </Text>
      ) : null}

      {personalization.recommended.length > 0 ? (
        <PersonalizedSection
          tone="good"
          header={t('products.scan.recommendedHeader')}
          matches={personalization.recommended}
          lang={lang}
        />
      ) : null}

      {personalization.avoid.length > 0 ? (
        <PersonalizedSection
          tone="watch"
          header={t('products.scan.avoidHeader')}
          matches={personalization.avoid}
          lang={lang}
        />
      ) : null}

      {/* Nudge — only shown when there's nothing else useful on the sheet. Prevents the
          result from feeling empty when both the halal rules and personalization came up
          dry. Quiet copy, no CTA — onboarding is reachable from Profile if they want. */}
      {!hasPersonalization &&
      product.flagged_ingredients.length === 0 &&
      product.ingredients.length > 0 ? (
        <Text className="mt-5 text-[13px] leading-5 text-darkGray">
          {profileIncomplete
            ? t('products.scan.noPersonalization')
            : t('products.scan.noMatches')}
        </Text>
      ) : null}

      <View className="mt-6 flex-row">
        <Pressable
          onPress={onTryAnother}
          style={({ pressed }) => ({
            flex: 1,
            height: 48,
            borderRadius: 14,
            backgroundColor: pressed ? '#D4547A' : colors.brandRose,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 8,
          })}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 15 }}>
            {t('products.scan.tryAnother')}
          </Text>
        </Pressable>
        <Pressable
          onPress={onClose}
          style={({ pressed }) => ({
            flex: 1,
            height: 48,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: colors.brandRose,
            backgroundColor: pressed ? 'rgba(232, 99, 122, 0.08)' : 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 8,
          })}
        >
          <Text style={{ color: colors.brandRose, fontWeight: '600', fontSize: 15 }}>
            {t('scan.done')}
          </Text>
        </Pressable>
      </View>
    </SheetBase>
  );
}

// PersonalizedSection — renders one of the two new lists on the result sheet. Direct,
// clinical voice per the design brief: tracked-uppercase header, then one row per
// matched ingredient with a quiet marker (✓ or !) + ingredient name + reason + a
// micro-line saying which of the user's concerns/skin type this ties to.
function PersonalizedSection({
  tone,
  header,
  matches,
  lang,
}: {
  tone: 'good' | 'watch';
  header: string;
  matches: PersonalizedMatch[];
  lang: 'en' | 'ar';
}) {
  const { t } = useLanguage();
  const accent = tone === 'good' ? colors.success : colors.warning;
  const marker = tone === 'good' ? '✓' : '!';

  return (
    <View className="mt-5">
      <Text
        style={{
          color: accent,
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 1.6,
          textTransform: 'uppercase',
        }}
      >
        {header}
      </Text>
      <View className="mt-2">
        {matches.map((m) => {
          const reason = lang === 'ar' ? m.reason_ar : m.reason_en;
          const tieIn = buildTieInLabel(m, t);
          return (
            <View
              key={m.name}
              className="flex-row"
              style={{ marginTop: 10, alignItems: 'flex-start' }}
            >
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor:
                    tone === 'good'
                      ? 'rgba(123, 168, 146, 0.16)'
                      : 'rgba(217, 167, 106, 0.18)',
                  marginRight: 10,
                  marginTop: 1,
                }}
              >
                <Text style={{ color: accent, fontSize: 12, fontWeight: '700' }}>
                  {marker}
                </Text>
              </View>
              <View className="flex-1">
                <Text style={{ color: colors.deepMauve, fontSize: 14, fontWeight: '600' }}>
                  {m.name}
                </Text>
                <Text
                  className="mt-0.5"
                  style={{ color: colors.darkGray, fontSize: 13, lineHeight: 18 }}
                >
                  {reason}
                </Text>
                {tieIn ? (
                  <Text
                    className="mt-0.5"
                    style={{
                      color: colors.deepMauve,
                      opacity: 0.55,
                      fontSize: 11,
                      fontWeight: '500',
                      fontStyle: 'italic',
                    }}
                  >
                    {tieIn}
                  </Text>
                ) : null}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

// "for acne", "for acne and dryness", or "for your oily skin" — picked by which slots
// the matcher populated. Concerns beat skin type since they're the higher-signal match.
function buildTieInLabel(
  m: PersonalizedMatch,
  t: (key: string, vars?: Record<string, string | number>) => string,
): string | null {
  if (m.matchedConcerns.length >= 2) {
    const a = t(`products.scan.concernLabels.${m.matchedConcerns[0]}`);
    const b = t(`products.scan.concernLabels.${m.matchedConcerns[1]}`);
    return t('products.scan.forConcerns', { a, b });
  }
  if (m.matchedConcerns.length === 1) {
    const concern = t(`products.scan.concernLabels.${m.matchedConcerns[0]}`);
    return t('products.scan.forConcern', { concern });
  }
  if (m.matchedSkinType) {
    const skin = t(`products.scan.skinLabels.${m.matchedSkinType}`);
    return t('products.scan.forSkin', { skin });
  }
  return null;
}

function NotFoundSheet({
  barcode,
  onTryAnother,
  onClose,
}: {
  barcode: string | null;
  onTryAnother: () => void;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  return (
    <SheetBase>
      <Text
        style={{
          color: colors.deepMauve,
          opacity: 0.6,
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 1.6,
          textTransform: 'uppercase',
        }}
      >
        {t('products.scan.notFoundEyebrow')}
      </Text>
      <Text
        className="mt-2 text-deepMauve"
        style={{
          fontFamily: 'DMSerifDisplay-Regular',
          fontSize: 22,
          lineHeight: 28,
          letterSpacing: -0.1,
        }}
      >
        {t('products.scan.notFoundTitle')}
      </Text>
      <Text className="mt-2 text-[14px] leading-[22px] text-darkGray">
        {t('products.scan.notFoundBody')}
      </Text>
      {barcode ? (
        <Text
          className="mt-3 text-darkGray"
          style={{
            fontSize: 12,
            fontWeight: '600',
            letterSpacing: 1.4,
            textTransform: 'uppercase',
          }}
        >
          {barcode}
        </Text>
      ) : null}

      <View className="mt-6 flex-row">
        <Pressable
          onPress={onTryAnother}
          style={({ pressed }) => ({
            flex: 1,
            height: 48,
            borderRadius: 14,
            backgroundColor: pressed ? '#D4547A' : colors.brandRose,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 8,
          })}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 15 }}>
            {t('products.scan.tryAnother')}
          </Text>
        </Pressable>
        <Pressable
          onPress={onClose}
          style={({ pressed }) => ({
            flex: 1,
            height: 48,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: colors.brandRose,
            backgroundColor: pressed ? 'rgba(232, 99, 122, 0.08)' : 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 8,
          })}
        >
          <Text style={{ color: colors.brandRose, fontWeight: '600', fontSize: 15 }}>
            {t('scan.done')}
          </Text>
        </Pressable>
      </View>
    </SheetBase>
  );
}

function ErrorSheet({
  message,
  onTryAnother,
  onClose,
}: {
  message: string | null;
  onTryAnother: () => void;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  return (
    <SheetBase>
      <Text
        style={{
          color: colors.error,
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 1.6,
          textTransform: 'uppercase',
        }}
      >
        {t('products.scan.errorTitle')}
      </Text>
      {message ? (
        <Text className="mt-3 text-[14px] leading-[22px] text-darkGray">{message}</Text>
      ) : null}

      <View className="mt-6 flex-row">
        <Pressable
          onPress={onTryAnother}
          style={({ pressed }) => ({
            flex: 1,
            height: 48,
            borderRadius: 14,
            backgroundColor: pressed ? '#D4547A' : colors.brandRose,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 8,
          })}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 15 }}>
            {t('products.scan.tryAnother')}
          </Text>
        </Pressable>
        <Pressable
          onPress={onClose}
          style={({ pressed }) => ({
            flex: 1,
            height: 48,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: colors.brandRose,
            backgroundColor: pressed ? 'rgba(232, 99, 122, 0.08)' : 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 8,
          })}
        >
          <Text style={{ color: colors.brandRose, fontWeight: '600', fontSize: 15 }}>
            {t('scan.done')}
          </Text>
        </Pressable>
      </View>
    </SheetBase>
  );
}
