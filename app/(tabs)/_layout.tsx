import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ComponentProps } from 'react';

type IconName = ComponentProps<typeof Ionicons>['name'];

const SPRING_CONFIG = {
  damping: 15,
  stiffness: 150,
  mass: 0.5,
};

function AnimatedTabIcon({
  name,
  color,
  focused,
}: {
  name: IconName;
  color: string;
  focused: boolean;
}) {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  React.useEffect(() => {
    if (focused) {
      scale.value = withSpring(1.25, SPRING_CONFIG);
      translateY.value = withSpring(-3, SPRING_CONFIG);
    } else {
      scale.value = withSpring(1, SPRING_CONFIG);
      translateY.value = withSpring(0, SPRING_CONFIG);
    }
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Ionicons name={name} size={24} color={color} />
    </Animated.View>
  );
}

function TabIcon({
  name,
  color,
  focused,
}: {
  name: IconName;
  color: string;
  focused: boolean;
}) {
  return (
    <View style={{ alignItems: 'center' }}>
      <AnimatedTabIcon name={name} color={color} focused={focused} />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2E86DE',
        tabBarInactiveTintColor: '#A0AEC0',
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          marginHorizontal: 16,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          borderRadius: 28,
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 16,
          height: 68,
          paddingBottom: 8,
          paddingTop: 8,
        },
        sceneStyle: {
          backgroundColor: '#F7FAFC',
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Kaart',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'map' : 'map-outline'} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="info"
        options={{
          title: 'Info',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'information-circle' : 'information-circle-outline'} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: 'Melden',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'warning' : 'warning-outline'} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'notifications' : 'notifications-outline'} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}
