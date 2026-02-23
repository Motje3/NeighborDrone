import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_SIZE = (SCREEN_WIDTH - 20 * 2 - 12) / 2;

const MELDINGEN = [
  {
    id: '1',
    time: '14:32',
    title: 'Brandmelding Beurs',
    desc: 'Drone ingezet om brand in kaart te brengen bij de Beurs.',
    icon: 'flame-outline' as const,
    color: '#E53E3E',
  },
  {
    id: '2',
    time: '12:15',
    title: 'Medische noodhulp Blijdorp',
    desc: 'AED bezorgd per drone bij Diergaarde Blijdorp.',
    icon: 'medkit-outline' as const,
    color: '#ED8936',
  },
  {
    id: '3',
    time: '09:47',
    title: 'Verkeerscontrole De Kuip',
    desc: 'Verkenningsdrone ingezet bij evenement Feyenoord.',
    icon: 'car-outline' as const,
    color: '#38A169',
  },
];

const CATEGORIES = [
  { id: 'aed',          title: 'AED',              image: require('../../public/1.jpeg') },
  { id: 'brandweer',    title: 'Brandweer',        image: require('../../public/2.jpeg') },
  { id: 'ehbo',         title: 'EHBO-Kit',         image: require('../../public/3.jpeg') },
  { id: 'criminaliteit',title: 'Criminaliteit',    image: require('../../public/4.jpeg') },
  { id: 'ouderen',      title: 'Hulp bij ouderen', image: require('../../public/5.jpeg') },
  { id: 'huisdieren',   title: 'Huisdieren',       image: require('../../public/6.jpeg') },
];

export default function ReportScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Zelf een 112{'\n'}melding doen</Text>
            <Text style={styles.headerSubtitle}>
              Met 1 klik regel je een drone en bel je de noodkamer
            </Text>
          </View>
          <View style={styles.headerIcon}>
            <Ionicons name="call-outline" size={28} color="#fff" />
          </View>
        </View>

        {/* Grid */}
        <View style={styles.grid}>
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat.id}
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            >
              {cat.image ? (
                <Image
                  source={cat.image}
                  style={styles.cardImage}
                  contentFit="cover"
                />
              ) : (
                <View style={styles.cardPlaceholder}>
                  <Ionicons name="image-outline" size={36} color="#CBD5E0" />
                </View>
              )}
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.65)']}
                style={styles.cardGradient}
              >
                <Text style={styles.cardTitle}>{cat.title}</Text>
              </LinearGradient>
            </Pressable>
          ))}
        </View>

        {/* Meldingen van vandaag */}
        <View style={styles.meldingenSection}>
          <View style={styles.meldingenHeader}>
            <Ionicons name="notifications" size={20} color="#2E86DE" />
            <Text style={styles.meldingenTitle}>Meldingen van vandaag</Text>
          </View>
          {MELDINGEN.map((m) => (
            <View key={m.id} style={styles.meldingRow}>
              <View style={[styles.meldingIcon, { backgroundColor: m.color + '15' }]}>
                <Ionicons name={m.icon} size={18} color={m.color} />
              </View>
              <View style={styles.meldingContent}>
                <View style={styles.meldingTopRow}>
                  <Text style={styles.meldingName}>{m.title}</Text>
                  <Text style={styles.meldingTime}>{m.time}</Text>
                </View>
                <Text style={styles.meldingDesc} numberOfLines={1}>{m.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const CARD_GAP = 12;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },

  // Header
  header: {
    backgroundColor: '#E53E3E',
    borderRadius: 20,
    padding: 24,
    marginTop: 12,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 32,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 8,
    maxWidth: 240,
    lineHeight: 20,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Meldingen van vandaag
  meldingenSection: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
  },
  meldingenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  meldingenTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A202C',
  },
  meldingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F4F8',
  },
  meldingIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  meldingContent: {
    flex: 1,
  },
  meldingTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  meldingName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
  },
  meldingTime: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  meldingDesc: {
    fontSize: 12,
    color: '#718096',
  },

  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: CARD_GAP,
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
  },
  cardPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EDF2F7',
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 14,
    paddingBottom: 14,
    paddingTop: 40,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
