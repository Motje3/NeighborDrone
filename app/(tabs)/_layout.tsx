import { Tabs } from 'expo-router';
import React from 'react';
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import { Image } from 'expo-image';

const SPRING_CONFIG = {
  damping: 16,
  stiffness: 140,
  mass: 0.6,
};

const TAB_COUNT = 5;
const BAR_MARGIN = 16;
const BAR_H_PADDING = 8;
const SCREEN_WIDTH = Dimensions.get('window').width;
const BAR_INNER_WIDTH = SCREEN_WIDTH - BAR_MARGIN * 2 - BAR_H_PADDING * 2;
const TAB_WIDTH = BAR_INNER_WIDTH / TAB_COUNT;
const BUBBLE_WIDTH = 62;

const TAB_ICONS = {
  info: require('../../public/drone.png'),
  chat: require('../../public/chat.png'),
  index: require('../../public/location.png'),
  report: require('../../public/alert.png'),
  notifications: require('../../public/setting.png'),
};

const TABS = [
  { key: 'info', title: 'Info' },
  { key: 'chat', title: 'Chat' },
  { key: 'index', title: 'Kaart' },
  { key: 'report', title: 'Melden' },
  { key: 'notifications', title: 'Instellingen' },
];

function getBubbleX(index: number) {
  return BAR_H_PADDING + index * TAB_WIDTH + (TAB_WIDTH - BUBBLE_WIDTH) / 2;
}

function MyTabBar({ state, navigation }: any) {
  const activeRouteName = state.routes[state.index]?.name;
  const visibleIndex = TABS.findIndex((t) => t.key === activeRouteName);
  const safeIndex = visibleIndex >= 0 ? visibleIndex : 0;

  const bubbleX = useSharedValue(getBubbleX(safeIndex));

  React.useEffect(() => {
    bubbleX.value = withSpring(getBubbleX(safeIndex), SPRING_CONFIG);
  }, [safeIndex]);

  const bubbleAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: bubbleX.value }],
  }));

  return (
    <View style={styles.barOuter}>
      <View style={styles.bar}>
        <Animated.View style={[styles.bubble, bubbleAnimStyle]} />

        <View style={styles.tabsRow}>
          {TABS.map((tab, index) => {
            const isFocused = safeIndex === index;
            return (
              <Pressable
                key={tab.key}
                onPress={() => {
                  if (!isFocused) {
                    navigation.navigate(tab.key);
                  }
                }}
                style={styles.tabButton}
              >
                <Image
                  source={TAB_ICONS[tab.key as keyof typeof TAB_ICONS]}
                  style={[
                    styles.tabIcon,
                    { opacity: isFocused ? 1 : 0.4 },
                  ]}
                  contentFit="contain"
                  tintColor={isFocused ? '#2E86DE' : '#A0AEC0'}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    { color: isFocused ? '#2E86DE' : '#A0AEC0' },
                  ]}
                >
                  {tab.title}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <MyTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: '#F7FAFC' },
      }}
    >
      <Tabs.Screen name="info" options={{ title: 'Info' }} />
      <Tabs.Screen name="chat" options={{ title: 'Chat' }} />
      <Tabs.Screen name="index" options={{ title: 'Kaart' }} />
      <Tabs.Screen name="report" options={{ title: 'Melden' }} />
      <Tabs.Screen name="notifications" options={{ title: 'Instellingen' }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  barOuter: {
    position: 'absolute',
    bottom: 20,
    left: BAR_MARGIN,
    right: BAR_MARGIN,
  },
  bar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    height: 68,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    overflow: 'hidden',
  },
  bubble: {
    position: 'absolute',
    width: BUBBLE_WIDTH,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(46, 134, 222, 0.12)',
    top: 8,
    left: 0,
  },
  tabsRow: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: BAR_H_PADDING,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    width: 24,
    height: 24,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 3,
  },
});
