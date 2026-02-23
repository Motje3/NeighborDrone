import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ComponentProps } from 'react';

type IconName = ComponentProps<typeof Ionicons>['name'];

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

function SettingsToggle({
  icon,
  iconColor,
  label,
  description,
  value,
  onToggle,
}: {
  icon: IconName;
  iconColor: string;
  label: string;
  description?: string;
  value: boolean;
  onToggle: (val: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={[styles.rowIcon, { backgroundColor: iconColor + '18' }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        {description && <Text style={styles.rowDesc}>{description}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#E2E8F0', true: '#BEE3F8' }}
        thumbColor={value ? '#2E86DE' : '#CBD5E0'}
      />
    </View>
  );
}

function SettingsLink({
  icon,
  iconColor,
  label,
  value,
  onPress,
}: {
  icon: IconName;
  iconColor: string;
  label: string;
  value?: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.6}>
      <View style={[styles.rowIcon, { backgroundColor: iconColor + '18' }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      {value && <Text style={styles.rowValue}>{value}</Text>}
      <Ionicons name="chevron-forward" size={18} color="#CBD5E0" />
    </TouchableOpacity>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

export default function SettingsScreen() {
  const [droneAlerts, setDroneAlerts] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [locationSharing, setLocationSharing] = useState(false);
  const [largeText, setLargeText] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.pageTitle}>Instellingen</Text>

        {/* Profile */}
        <TouchableOpacity style={styles.profileCard} activeOpacity={0.7}>
          <View style={styles.profileAvatar}>
            <Ionicons name="person" size={32} color="#FFFFFF" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Opa Gerrit</Text>
            <Text style={styles.profileEmail}>gerrit.geen.idee@hotmail.nl</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CBD5E0" />
        </TouchableOpacity>

        {/* Notifications */}
        <SettingsSection title="Meldingen">
          <SettingsToggle
            icon="notifications"
            iconColor="#2E86DE"
            label="Drone meldingen"
            description="Ontvang een melding bij drones in uw buurt"
            value={droneAlerts}
            onToggle={setDroneAlerts}
          />
          <Divider />
          <SettingsToggle
            icon="volume-high"
            iconColor="#9F7AEA"
            label="Geluid"
            description="Speel een geluid af bij meldingen"
            value={soundAlerts}
            onToggle={setSoundAlerts}
          />
          <Divider />
          <SettingsToggle
            icon="phone-portrait"
            iconColor="#ED8936"
            label="Trillen"
            value={vibration}
            onToggle={setVibration}
          />
        </SettingsSection>

        {/* Privacy */}
        <SettingsSection title="Privacy">
          <SettingsToggle
            icon="location"
            iconColor="#48BB78"
            label="Locatie delen"
            description="Deel uw locatie voor nauwkeurige meldingen"
            value={locationSharing}
            onToggle={setLocationSharing}
          />
        </SettingsSection>

        {/* Accessibility */}
        <SettingsSection title="Toegankelijkheid">
          <SettingsToggle
            icon="text"
            iconColor="#E53E3E"
            label="Grote tekst"
            description="Maak alle tekst groter en beter leesbaar"
            value={largeText}
            onToggle={setLargeText}
          />
          <Divider />
          <SettingsLink
            icon="language"
            iconColor="#2E86DE"
            label="Taal"
            value="Nederlands"
          />
        </SettingsSection>

        {/* Safety */}
        <SettingsSection title="Veiligheid">
          <SettingsLink
            icon="call"
            iconColor="#E53E3E"
            label="Noodcontact"
            value="112"
          />
          <Divider />
          <SettingsLink
            icon="shield-checkmark"
            iconColor="#48BB78"
            label="Drone meldpunt"
            value="Politie"
          />
        </SettingsSection>

        {/* About */}
        <SettingsSection title="Over">
          <SettingsLink
            icon="information-circle"
            iconColor="#718096"
            label="App versie"
            value="1.0.0"
          />
          <Divider />
          <SettingsLink
            icon="document-text"
            iconColor="#718096"
            label="Privacybeleid"
          />
          <Divider />
          <SettingsLink
            icon="help-circle"
            iconColor="#718096"
            label="Hulp & Ondersteuning"
          />
        </SettingsSection>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A202C',
    marginTop: 8,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  // Profile
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2E86DE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },
  profileName: {
    fontSize: 19,
    fontWeight: '700',
    color: '#1A202C',
  },
  profileEmail: {
    fontSize: 14,
    color: '#718096',
    marginTop: 2,
  },
  // Sections
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#A0AEC0',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  // Row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowText: {
    flex: 1,
    marginLeft: 12,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A202C',
  },
  rowDesc: {
    fontSize: 13,
    color: '#A0AEC0',
    marginTop: 2,
  },
  rowValue: {
    fontSize: 14,
    color: '#A0AEC0',
    marginRight: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 62,
  },
});
