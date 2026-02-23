import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';
import Ionicons from '@expo/vector-icons/Ionicons';

const INITIAL_REGION = {
  latitude: 51.9225,
  longitude: 4.4792,
  latitudeDelta: 0.04,
  longitudeDelta: 0.04,
};

const MAP_STYLE = [
  // Hide all POIs (restaurants, museums, shops, etc.) - icons and labels
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },

  // Hide transit (bus stops, tram, metro icons)
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },

  // Hide highway names and numbers (A1, A4, snelwegen etc.)
  { featureType: 'road.highway', elementType: 'labels', stylers: [{ visibility: 'off' }] },

  // Hide arterial road labels (keeps map clean, main roads still visible)
  { featureType: 'road.arterial', elementType: 'labels', stylers: [{ visibility: 'off' }] },

  // Keep local road labels off too - only city names matter
  { featureType: 'road.local', elementType: 'labels', stylers: [{ visibility: 'off' }] },

  // Nice vivid water blue
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#4da6d9' }] },
  { featureType: 'water', elementType: 'labels.text', stylers: [{ visibility: 'off' }] },

  // Nice natural green for parks and nature
  { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#a8d5a2' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#a8d5a2' }, { visibility: 'on' }] },
  { featureType: 'poi.park', elementType: 'labels', stylers: [{ visibility: 'off' }] },

  // Keep city and district names - important for orientation
  { featureType: 'administrative.locality', elementType: 'labels', stylers: [{ visibility: 'on' }] },
  { featureType: 'administrative.neighborhood', elementType: 'labels', stylers: [{ visibility: 'off' }] },
];

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);

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
      />

      {/* My location button */}
      <TouchableOpacity
        style={styles.locationBtn}
        onPress={() => mapRef.current?.animateToRegion(INITIAL_REGION, 500)}
        activeOpacity={0.8}
      >
        <Ionicons name="locate" size={22} color="#2E86DE" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  locationBtn: {
    position: 'absolute',
    right: 16,
    bottom: 110,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
});
