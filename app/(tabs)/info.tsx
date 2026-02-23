import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const SPRING = { damping: 16, stiffness: 140, mass: 0.6 };

type FAQ = {
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
  bgColor: string;
  question: string;
  answer: string;
};

const FAQ_DATA: FAQ[] = [
  {
    icon: 'flight',
    color: '#2E86DE',
    bgColor: '#EBF4FF',
    question: 'Hoe werken hulpverlening drones?',
    answer:
      'Hulpverlening drones worden bestuurd door getrainde professionals van de hulpdiensten. Ze vliegen vaste routes en kunnen medische hulpmiddelen vervoeren, zoals een AED of EHBO-pakket. De drone vliegt automatisch naar de juiste locatie en wordt altijd op afstand begeleid door een operator.',
  },
  {
    icon: 'local-hospital',
    color: '#ED8936',
    bgColor: '#FEEBC8',
    question: 'Waarom vliegen er drones in mijn buurt?',
    answer:
      'Drones die u in uw buurt ziet, zijn bijna altijd van de hulpdiensten zoals ambulance, brandweer of politie. Ze kunnen sneller ter plaatse zijn dan een ambulance en leveren levensreddende spullen af. Zo kan een drone een AED binnen enkele minuten bezorgen bij een hartstilstand.',
  },
  {
    icon: 'verified-user',
    color: '#38A169',
    bgColor: '#E6FFFA',
    question: 'Zijn drones veilig?',
    answer:
      'Ja, hulpverlening drones zijn zeer veilig. Ze voldoen aan strenge regels van de overheid en worden bestuurd door gecertificeerde operators. De drones hebben ingebouwde veiligheidssystemen en vliegen alleen over toegestane routes. Bij slecht weer of technische problemen landen ze automatisch veilig.',
  },
];

function FAQCard({ item, index }: { item: FAQ; index: number }) {
  const [open, setOpen] = useState(false);
  const rotation = useSharedValue(0);
  const height = useSharedValue(0);
  const opacity = useSharedValue(0);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    rotation.value = withSpring(next ? 180 : 0, SPRING);
    height.value = withSpring(next ? 1 : 0, SPRING);
    opacity.value = withTiming(next ? 1 : 0, { duration: 250 });
  };

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const bodyStyle = useAnimatedStyle(() => ({
    maxHeight: height.value * 200,
    opacity: opacity.value,
    marginTop: height.value * 16,
  }));

  return (
    <Animated.View entering={FadeInUp.delay(200 + index * 120).duration(500)}>
      <Pressable onPress={toggle} style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconCircle, { backgroundColor: item.bgColor }]}>
            <MaterialIcons name={item.icon} size={26} color={item.color} />
          </View>
          <Text style={styles.question}>{item.question}</Text>
          <Animated.View style={chevronStyle}>
            <MaterialIcons name="expand-more" size={26} color="#A0AEC0" />
          </Animated.View>
        </View>
        <Animated.View style={[styles.answerWrap, bodyStyle]}>
          <Text style={styles.answer}>{item.answer}</Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

export default function InfoScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <Animated.View entering={FadeInUp.duration(500)}>
          <LinearGradient
            colors={['#EBF4FF', '#F7FAFC']}
            style={styles.hero}
          >
            <Image
              source={require('../../public/cutedrone.png')}
              style={styles.heroImage}
              contentFit="contain"
            />
            <Text style={styles.title}>Alles over drones</Text>
            <Text style={styles.subtitle}>
              Veel gestelde vragen over hulpverlening drones in uw buurt
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* FAQ Cards */}
        <View style={styles.faqList}>
          {FAQ_DATA.map((item, i) => (
            <FAQCard key={i} item={item} index={i} />
          ))}
        </View>

        {/* Footer note */}
        <Animated.View
          entering={FadeInUp.delay(700).duration(400)}
          style={styles.footer}
        >
          <MaterialIcons name="support-agent" size={20} color="#A0AEC0" />
          <Text style={styles.footerText}>
            Heeft u nog vragen? Stel ze via de chat!
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  scroll: {
    paddingBottom: 120,
  },
  // Hero
  hero: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 32,
  },
  heroImage: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A202C',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 24,
  },
  // FAQ
  faqList: {
    paddingHorizontal: 20,
    marginTop: 8,
    gap: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  question: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#1A202C',
    lineHeight: 22,
  },
  answerWrap: {
    overflow: 'hidden',
    paddingLeft: 62,
  },
  answer: {
    fontSize: 15,
    color: '#4A5568',
    lineHeight: 24,
  },
  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    gap: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#A0AEC0',
  },
});
