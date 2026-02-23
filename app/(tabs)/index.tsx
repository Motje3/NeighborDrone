import React, { useRef, useState } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Animated,
  Text, Pressable,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';

const INITIAL_REGION = {
  latitude: 51.9225,
  longitude: 4.4792,
  latitudeDelta: 0.04,
  longitudeDelta: 0.04,
};

const MAP_STYLE = [
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'road.highway', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'road.arterial', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'road.local', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#4da6d9' }] },
  { featureType: 'water', elementType: 'labels.text', stylers: [{ visibility: 'off' }] },
  { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#a8d5a2' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#a8d5a2' }, { visibility: 'on' }] },
  { featureType: 'poi.park', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative.locality', elementType: 'labels', stylers: [{ visibility: 'on' }] },
  { featureType: 'administrative.neighborhood', elementType: 'labels', stylers: [{ visibility: 'off' }] },
];

interface DroneData {
  id: string;
  name: string;
  color: string;
  status: 'Actief' | 'Terugkerend' | 'Wachtend';
  from: { name: string; latitude: number; longitude: number };
  to: { name: string; latitude: number; longitude: number };
  mission: string;
  altitude: string;
}

const DRONES: DroneData[] = [
  {
    id: 'DR-01',
    name: 'DR-01 Brandweer',
    color: '#2E86DE',
    status: 'Actief',
    from: { name: 'Erasmusbrug', latitude: 51.9047, longitude: 4.4821 },
    to: { name: 'Rotterdam Centraal', latitude: 51.9249, longitude: 4.4690 },
    mission: 'Verkenning na brandmelding',
    altitude: '80m',
  },
  {
    id: 'DR-02',
    name: 'DR-02 Medisch',
    color: '#ED8936',
    status: 'Actief',
    from: { name: 'Blijdorp', latitude: 51.9284, longitude: 4.4558 },
    to: { name: 'Alexandrium', latitude: 51.9373, longitude: 4.5300 },
    mission: 'Medische hulpverlening',
    altitude: '60m',
  },
  {
    id: 'DR-03',
    name: 'DR-03 Verkenning',
    color: '#38A169',
    status: 'Wachtend',
    from: { name: 'Kop van Zuid', latitude: 51.8998, longitude: 4.4862 },
    to: { name: 'De Kuip', latitude: 51.8936, longitude: 4.5230 },
    mission: 'Verkeersmonitoring',
    altitude: '100m',
  },
  {
    id: 'DR-04',
    name: 'DR-04 Spoed',
    color: '#E53E3E',
    status: 'Terugkerend',
    from: { name: 'Schiedam Centrum', latitude: 51.9208, longitude: 4.3868 },
    to: { name: 'Rotterdam Airport', latitude: 51.9557, longitude: 4.4377 },
    mission: 'Spoedinterventie',
    altitude: '120m',
  },
];

const SHEET_HEIGHT = 420;

const STATUS_COLORS: Record<DroneData['status'], string> = {
  'Actief':      '#38A169',
  'Terugkerend': '#ED8936',
  'Wachtend':    '#A0AEC0',
};

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const [selectedDrone, setSelectedDrone] = useState<DroneData | null>(null);
  const sheetAnim   = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  const openSheet = (drone: DroneData) => {
    setSelectedDrone(drone);
    Animated.parallel([
      Animated.spring(sheetAnim, {
        toValue: 0,
        damping: 22,
        stiffness: 220,
        useNativeDriver: true,
      }),
      Animated.timing(backdropAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeSheet = () => {
    Animated.parallel([
      Animated.timing(sheetAnim, {
        toValue: SHEET_HEIGHT,
        duration: 240,
        useNativeDriver: true,
      }),
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setSelectedDrone(null));
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        showsMyLocationButton={false}
        showsPointsOfInterest={false}
        showsBuildings={false}
        showsTraffic={false}
        customMapStyle={MAP_STYLE}
      >
        {DRONES.map((drone) => (
          <React.Fragment key={drone.id}>
            {/* Dashed flight path */}
            <Polyline
              coordinates={[drone.from, drone.to]}
              strokeColor={drone.color}
              strokeWidth={2.5}
              lineDashPattern={[12, 8]}
            />

            {/* Drone marker — current position */}
            <Marker
              coordinate={drone.from}
              onPress={() => openSheet(drone)}
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <Image
                source={require('../../public/mapdrone.png')}
                style={styles.droneIcon}
                contentFit="contain"
              />
            </Marker>

            {/* Destination marker */}
            <Marker
              coordinate={drone.to}
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <View style={[styles.destOuter, { borderColor: drone.color }]}>
                <View style={[styles.destInner, { backgroundColor: drone.color }]} />
              </View>
            </Marker>
          </React.Fragment>
        ))}
      </MapView>

      {/* Locate button */}
      <TouchableOpacity
        style={styles.locationBtn}
        onPress={() => mapRef.current?.animateToRegion(INITIAL_REGION, 500)}
        activeOpacity={0.8}
      >
        <Ionicons name="locate" size={22} color="#2E86DE" />
      </TouchableOpacity>

      {/* Filter button — placeholder for future filtering */}
      <TouchableOpacity style={styles.filterBtn} activeOpacity={0.8}>
        <Ionicons name="options-outline" size={22} color="#2E86DE" />
      </TouchableOpacity>

      {/* Dim backdrop */}
      {selectedDrone !== null && (
        <Animated.View
          pointerEvents="auto"
          style={[styles.backdrop, { opacity: backdropAnim }]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={closeSheet} />
        </Animated.View>
      )}

      {/* Bottom sheet */}
      <Animated.View
        pointerEvents={selectedDrone ? 'auto' : 'none'}
        style={[styles.sheet, { transform: [{ translateY: sheetAnim }] }]}
      >
        {selectedDrone && (
          <>
            {/* Drag handle */}
            <View style={styles.handle} />

            {/* Header row */}
            <View style={styles.sheetHeader}>
              <View style={styles.sheetTitleRow}>
                <View style={[styles.colorDot, { backgroundColor: selectedDrone.color }]} />
                <Text style={styles.sheetTitle}>{selectedDrone.name}</Text>
              </View>
              <TouchableOpacity onPress={closeSheet} hitSlop={12}>
                <Ionicons name="close" size={22} color="#718096" />
              </TouchableOpacity>
            </View>

            {/* Status badge */}
            <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[selectedDrone.status] + '20' }]}>
              <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[selectedDrone.status] }]} />
              <Text style={[styles.statusText, { color: STATUS_COLORS[selectedDrone.status] }]}>
                {selectedDrone.status}
              </Text>
            </View>

            {/* Route */}
            <View style={styles.routeCard}>
              <View style={styles.routeRow}>
                <View style={[styles.routeIconCircle, { backgroundColor: selectedDrone.color + '20' }]}>
                  <Ionicons name="radio-button-on" size={16} color={selectedDrone.color} />
                </View>
                <View>
                  <Text style={styles.routeLabel}>Vertrek</Text>
                  <Text style={styles.routeLocation}>{selectedDrone.from.name}</Text>
                </View>
              </View>

              <View style={[styles.routeConnector, { borderColor: selectedDrone.color + '50' }]} />

              <View style={styles.routeRow}>
                <View style={[styles.routeIconCircle, { backgroundColor: selectedDrone.color + '20' }]}>
                  <Ionicons name="location" size={16} color={selectedDrone.color} />
                </View>
                <View>
                  <Text style={styles.routeLabel}>Bestemming</Text>
                  <Text style={styles.routeLocation}>{selectedDrone.to.name}</Text>
                </View>
              </View>
            </View>

            {/* Details */}
            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <Ionicons name="clipboard-outline" size={15} color="#718096" />
                <Text style={styles.detailText}>{selectedDrone.mission}</Text>
              </View>
              <View style={styles.detailDivider} />
              <View style={styles.detailItem}>
                <Ionicons name="trending-up-outline" size={15} color="#718096" />
                <Text style={styles.detailText}>{selectedDrone.altitude} hoogte</Text>
              </View>
            </View>
          </>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },

  // Drone marker icon
  droneIcon: {
    width: 44,
    height: 44,
  },

  // Destination marker
  destOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  destInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  // Floating buttons
  locationBtn: {
    position: 'absolute',
    right: 16,
    bottom: 110,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  filterBtn: {
    position: 'absolute',
    right: 16,
    bottom: 164,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },

  // Backdrop
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },

  // Bottom sheet — full width, extends to screen bottom, content padded above tab bar
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_HEIGHT,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 104,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 16,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
    marginTop: 12,
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sheetTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A202C',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 16,
    gap: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },

  // Route
  routeCard: {
    backgroundColor: '#F7FAFC',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  routeIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeConnector: {
    marginLeft: 15,
    height: 18,
    borderLeftWidth: 2,
    borderStyle: 'dashed',
    marginVertical: 4,
  },
  routeLabel: {
    fontSize: 11,
    color: '#A0AEC0',
    fontWeight: '500',
    marginBottom: 1,
  },
  routeLocation: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
  },

  // Details
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  detailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  detailDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 10,
  },
  detailText: {
    fontSize: 13,
    color: '#4A5568',
    flexShrink: 1,
  },
});
