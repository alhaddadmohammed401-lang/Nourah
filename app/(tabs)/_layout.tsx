import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';
import { useLanguage } from '../../hooks/useLanguage';
import { useTheme } from '../../hooks/useTheme';

type IconKind = 'home' | 'scan' | 'products' | 'profile';

const GLYPH: Record<IconKind, string> = {
  home: '⌂',
  scan: '◎',
  products: '◇',
  profile: '◔',
};

// Renders a tab icon as a soft glyph. Brand Rose when active, Slate Gray otherwise.
// Scan tab is rendered slightly larger per DESIGN.md §5 (first-among-equals).
function TabGlyph({
  kind,
  color,
  size,
}: {
  kind: IconKind;
  color: string;
  size: number;
}) {
  return (
    <View style={{ height: size + 4, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: size, color, lineHeight: size + 2 }}>{GLYPH[kind]}</Text>
    </View>
  );
}

export default function TabsLayout() {
  const { t } = useLanguage();
  const { colors: themeColors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: themeColors.brandRose,
        tabBarInactiveTintColor: themeColors.inkSecondary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          letterSpacing: 0.2,
          marginBottom: 4,
        },
        tabBarStyle: {
          backgroundColor: themeColors.surfaceElevated,
          borderTopColor: themeColors.hairline,
          borderTopWidth: 1,
          height: 64,
          paddingTop: 6,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color }) => <TabGlyph kind="home" color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: t('tabs.scan'),
          tabBarIcon: ({ color }) => <TabGlyph kind="scan" color={color} size={24} />,
        }}
      />
      <Tabs.Screen name="routine" options={{ href: null }} />
      <Tabs.Screen name="scan-product" options={{ href: null }} />
      <Tabs.Screen name="scan-history" options={{ href: null }} />
      <Tabs.Screen
        name="products"
        options={{
          title: t('tabs.products'),
          tabBarIcon: ({ color }) => <TabGlyph kind="products" color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ color }) => <TabGlyph kind="profile" color={color} size={22} />,
        }}
      />
    </Tabs>
  );
}
