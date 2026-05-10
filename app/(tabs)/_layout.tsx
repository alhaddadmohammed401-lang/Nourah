import { Tabs } from 'expo-router';
import { type ImageSourcePropType, View } from 'react-native';
import { colors } from '../../constants/colors';
import { GeneratedIcon } from '../../components/ui/GeneratedIcon';

type TabIconProps = {
  icon: ImageSourcePropType;
  focused: boolean;
};

const homeIcon = require('../../assets/icons/nourah-home-icon.png');
const scanIcon = require('../../assets/icons/nourah-scan-icon.png');
const productsIcon = require('../../assets/icons/nourah-products-icon.png');
const profileIcon = require('../../assets/icons/nourah-profile-icon.png');

// Draws a small generated Nourah icon inside the tab mark.
function TabIcon({ icon, focused }: TabIconProps) {
  return (
    <View
      className={`h-9 w-9 items-center justify-center rounded-full ${
        focused ? 'bg-softBlush' : 'bg-white'
      }`}
    >
      <GeneratedIcon
        source={icon}
        size="tab"
        opacity={focused ? 'opacity-100' : 'opacity-70'}
      />
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
          tabBarIcon: ({ focused }) => <TabIcon icon={homeIcon} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          tabBarIcon: ({ focused }) => <TabIcon icon={scanIcon} focused={focused} />,
        }}
      />
      <Tabs.Screen name="routine" options={{ href: null }} />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Products',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={productsIcon} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={profileIcon} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
