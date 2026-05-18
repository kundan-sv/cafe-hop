import * as Location from 'expo-location';
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import customMarker from './assets/custom_marker.png';
import { colors, globalStyles } from './globalStyles';
import arrowImg from './assets/arrow.png';

export default function MapScreen({ navigation }) {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [cafes, setCafes] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [region, setRegion] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const mapRef = useRef(null);

  const radius = 1500;

  const fetchNearbyCafes = async (latitude, longitude) => {
    try {
      setErrorMsg(null);
      setLoadingMore(true);

      const query = `
        [out:json][timeout:25];
        (
          node["amenity"="cafe"](around:${radius},${latitude},${longitude});
          way["amenity"="cafe"](around:${radius},${latitude},${longitude});
          relation["amenity"="cafe"](around:${radius},${latitude},${longitude});
        );
        out center tags;
      `;

      const response = await fetch("https://overpass.kumi.systems/api/interpreter", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
          "Accept": "application/json",
        },
        body: query,
      });

      const text = await response.text();
      console.log(text);

      const data = JSON.parse(text);

      const formattedCafes = data.elements
        .map((item) => {
          const lat = item.lat || item.center?.lat;
          const lng = item.lon || item.center?.lon;

          if (!lat || !lng) return null;

          return {
            place_id: String(item.id),
            name: item.tags?.name || 'Unnamed Cafe',
            vicinity:
              item.tags?.['addr:street'] ||
              item.tags?.['addr:full'] ||
              item.tags?.['addr:city'] ||
              `Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
            geometry: {
              location: {
                lat,
                lng,
              },
            },
          };
        })
        .filter(Boolean);

      if (formattedCafes.length > 0) {
        setCafes(formattedCafes);
        setErrorMsg(null);
      } else {
        setErrorMsg('No cafes found nearby. Showing previous cafes.');
      }
    } catch (error) {
      console.log('Cafe fetch error:', error.message);
      setErrorMsg('Trying to load cafes... tap another location if it takes long.');
    }finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const getLocationAndFetchCafes = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          if (isMounted) setErrorMsg('Permission to access location was denied');
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});

        if (isMounted) {
          const coords = loc.coords;

          setSelectedLocation(coords);

          setRegion({
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          });

          fetchNearbyCafes(coords.latitude, coords.longitude);
        }
      } catch (error) {
        if (isMounted) setErrorMsg('Failed to get location');
      }
    };

    getLocationAndFetchCafes();

    return () => {
      isMounted = false;
    };
  }, []);



  const zoom = (type) => {
    if (!region) return;

    const factor = type === 'in' ? 0.5 : 2;

    const newRegion = {
      ...region,
      latitudeDelta: Math.min(Math.max(region.latitudeDelta * factor, 0.002), 1),
      longitudeDelta: Math.min(Math.max(region.longitudeDelta * factor, 0.002), 1),
    };

    setRegion(newRegion);

    if (mapRef.current) {
      mapRef.current.animateToRegion(newRegion, 300);
    }
  };

  if (!region) {
    return (
      <View style={styles.centered}>
        <Text style={globalStyles.title}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.map}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        onPress={(event) => {
          const { coordinate } = event.nativeEvent;
          setSelectedLocation(coordinate);
          fetchNearbyCafes(coordinate.latitude, coordinate.longitude);
        }}
        showsUserLocation={true}
        zoomEnabled={true}
      >
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            title="Selected Location"
            pinColor="blue"
          />
        )}

        {cafes.map((cafe) => (
          <Marker
            key={cafe.place_id}
            coordinate={{
              latitude: cafe.geometry.location.lat,
              longitude: cafe.geometry.location.lng,
            }}
            title={cafe.name}
            description={cafe.vicinity}
            image={customMarker}
            onPress={() => navigation.navigate('CafeDetails', { cafe })}
          >
            <Callout
              onPress={() => navigation.navigate('CafeDetails', { cafe })}
              tooltip
            >
              <View style={styles.calloutContainer}>
                <Text style={globalStyles.calloutTitle}>{cafe.name}</Text>
                <Text style={globalStyles.calloutAddress}>{cafe.vicinity}</Text>
                <Image source={arrowImg} style={globalStyles.calloutArrow} />
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {errorMsg && (
        <View style={styles.errorBox}>
          <Text style={styles.infoText}>{errorMsg}</Text>
        </View>
      )}

      <View style={styles.zoomContainer}>
        <TouchableOpacity style={globalStyles.zoomButton} onPress={() => zoom('in')}>
          <Text style={globalStyles.zoomText}>＋</Text>
        </TouchableOpacity>

        <TouchableOpacity style={globalStyles.zoomButton} onPress={() => zoom('out')}>
          <Text style={globalStyles.zoomText}>－</Text>
        </TouchableOpacity>
      </View>

      {loadingMore && (
        <ActivityIndicator size="small" color="#0000ff" style={styles.loadingIndicator} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomContainer: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    justifyContent: 'space-between',
    height: 100,
  },
  calloutContainer: {
    padding: 10,
    maxWidth: 220,
    backgroundColor: colors.rosyPink,
    borderRadius: 12,
    borderWidth: 0,
    overflow: 'hidden',
  },
  loadingIndicator: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  errorBox: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    maxWidth: '90%',
  },
  infoText: {
    color: colors.clayRed,
    textAlign: 'center',
  },
});