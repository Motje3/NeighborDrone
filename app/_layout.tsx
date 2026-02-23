import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  FadeInUp,
  FadeInDown,
} from 'react-native-reanimated';
import { Image } from 'expo-image';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

function SplashScreen({ onFinish }: { onFinish: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      exiting={FadeOut.duration(400)}
      style={splash.container}
    >
      <Animated.View entering={FadeInUp.delay(200).duration(600).springify()}>
        <Image
          source={require('../appicon.png')}
          style={splash.logo}
          contentFit="contain"
        />
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(500).duration(600).springify()}>
        <Text style={splash.title}>RoboRadar</Text>
        <Text style={splash.subtitle}>Uw veiligheid, onze prioriteit</Text>
      </Animated.View>
    </Animated.View>
  );
}

const splash = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 280,
    height: 280,
    marginBottom: 32,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#1A202C',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: '#718096',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
