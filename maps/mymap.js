import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';
import markersData from './markers.json'; //zelfde folder

export default function MyMap() {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    setMarkers(markersData); // laad je JSON
  }, []);

  const initialRegion = {
    latitude: markers[0]?.latitude || 52.3676,
    longtitude: markers[0]?.longtitude || 4.9041, // let op spelling uit JSON
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion}>
        {markers.map((marker, index) =>
          marker.latitude && marker.longtitude ? (
            <Marker
              key={index}
              coordinate={{ latitude: marker.latitude, longitude: marker.longtitude }}
            >
              <Callout>
                <ScrollView style={{ maxHeight: 200 }}>
                  {Object.entries(marker).map(([key, value]) =>
                    value ? <Text key={key}><Text style={{fontWeight: 'bold'}}>{key}:</Text> {value}</Text> : null
                  )}
                </ScrollView>
              </Callout>
            </Marker>
          ) : null
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});             



