import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';
import { colors } from '../../constants/colors';

type TabIconProps = {
  label: string;
  focused: boolean;
};

// Draws a small text-based tab mark so web preview does not show default placeholder icons.
function TabIcon({ label, focused }: TabIconProps) {
  return (
    <View
      className={`h-7 w-7 items-center justify-center rounded-full ${
        focused ? 'bg-brandRose' : 'bg-softBlush'
      }`}
    >
      <Text
        className={`text-[11px] font-semibold ${
          focused ? 'text-white' : 'text-darkGray'
        }`}
      >
        {label}
      </Text>
    </View>
  );
}

// Sets up the four main Nourah tabs and keeps the routine route hidden from the tab bar.
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brandRose,
        tabBarInactiveTintColor: colors.darkGray,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon label="H" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          tabBarIcon: ({ focused }) => <TabIcon label="S" focused={focused} />,
        }}
      />
      <Tabs.Screen name="routine" options={{ href: null }} />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Products',
          tabBarIcon: ({ focused }) => <TabIcon label="P" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon label="Me" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
