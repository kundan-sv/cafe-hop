import * as Location from 'expo-location';
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { colors, globalStyles } from './globalStyles';


export default function MapScreen({ navigation }) {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [cafes, setCafes] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(false);
  const webViewRef = useRef(null);

  const radius = 1500;

  const fetchNearbyCafes = async (latitude, longitude) => {
    try {
      setErrorMsg(null);
      setLoading(true);

      const query = `
        [out:json][timeout:25];
        (
          node["amenity"="cafe"](around:${radius},${latitude},${longitude});
          way["amenity"="cafe"](around:${radius},${latitude},${longitude});
          relation["amenity"="cafe"](around:${radius},${latitude},${longitude});
        );
        out center tags;
      `;

      const response = await fetch('https://overpass.kumi.systems/api/interpreter', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          Accept: 'application/json',
        },
        body: query,
      });

      const text = await response.text();
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
        setErrorMsg('No cafes found nearby. Try another location.');
      }
    } catch (error) {
      console.log('Cafe fetch error:', error.message);
      setErrorMsg('Trying to load cafes... tap another location if it takes long.');
    } finally {
      setLoading(false);
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
        const coords = loc.coords;

        if (isMounted) {
          const initialLocation = {
            latitude: coords.latitude,
            longitude: coords.longitude,
          };

          setSelectedLocation(initialLocation);
          setRegion(initialLocation);
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

  const openCafeDetails = (cafe) => {
    navigation.navigate('CafeDetails', { cafe });
  };

  const generateMapHtml = () => {
    const lat = selectedLocation?.latitude || region?.latitude || 16.5062;
    const lng = selectedLocation?.longitude || region?.longitude || 80.6480;

    const cafesJson = JSON.stringify(cafes);

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link
            rel="stylesheet"
            href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          />
          <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

          <style>
            html, body, #map {
              height: 100%;
              width: 100%;
              margin: 0;
              padding: 0;
            }

            .popup-btn {
              background: #8B5E3C;
              color: white;
              border: none;
              padding: 8px 10px;
              border-radius: 8px;
              font-weight: bold;
              margin-top: 6px;
            }
          </style>
        </head>

        <body>
          <div id="map"></div>

          <script>
            const userLat = ${lat};
            const userLng = ${lng};
            const cafes = ${cafesJson};

            const map = L.map('map').setView([userLat, userLng], 15);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 19,
              attribution: '© OpenStreetMap'
            }).addTo(map);

            const userIcon = L.divIcon({
              html: '<div style="width:18px;height:18px;background:#2478ff;border-radius:50%;border:3px solid white;"></div>',
              className: '',
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            });

            L.marker([userLat, userLng], { icon: userIcon })
              .addTo(map)
              .bindPopup('Selected Location');

            cafes.forEach((cafe, index) => {
              const cafeLat = cafe.geometry.location.lat;
              const cafeLng = cafe.geometry.location.lng;

              const cafeIcon = L.icon({
                iconUrl: 'https://raw.githubusercontent.com/kundan-sv/cafe-hop/main/assets/custom_marker.png',
                iconSize: [38, 38],
                iconAnchor: [19, 38],
                popupAnchor: [0, -38]
              });

              const marker = L.marker([cafeLat, cafeLng], { icon: cafeIcon }).addTo(map);

              marker.bindPopup(
                '<b>' + cafe.name + '</b><br/>' +
                cafe.vicinity + '<br/>' +
                '<button class="popup-btn" onclick="openCafe(' + index + ')">Open Details</button>' +
                '<br/>' +
                '<button class="popup-btn" onclick="openDirections(' + cafeLat + ',' + cafeLng + ')">Directions</button>'
              );
            });

            function openDirections(lat, lng) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'OPEN_DIRECTIONS',
                latitude: lat,
                longitude: lng
              }));
            }

            function openCafe(index) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'OPEN_CAFE',
                cafe: cafes[index]
              }));
            }            

            map.on('click', function(e) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'MAP_CLICK',
                latitude: e.latlng.lat,
                longitude: e.latlng.lng
              }));
            });
          </script>
        </body>
      </html>
    `;
  };

  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.type === 'OPEN_DIRECTIONS') {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${data.latitude},${data.longitude}`;
        Linking.openURL(url);
      }

      if (data.type === 'OPEN_CAFE') {
        openCafeDetails(data.cafe);
      }

      if (data.type === 'MAP_CLICK') {
        const newLocation = {
          latitude: data.latitude,
          longitude: data.longitude,
        };

        setSelectedLocation(newLocation);
        setRegion(newLocation);
        fetchNearbyCafes(data.latitude, data.longitude);
      }
    } catch (error) {
      console.log('WebView message error:', error.message);
    }
  };

  if (!region) {
    return (
      <View style={styles.centered}>
        <Text style={globalStyles.title}>Finding cafes near you...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: generateMapHtml() }}
        style={styles.map}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={handleWebViewMessage}
      />

      {errorMsg && (
        <View style={styles.errorBox}>
          <Text style={styles.infoText}>{errorMsg}</Text>
        </View>
      )}

      {loading && (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="small" color="#0000ff" />
          <Text style={styles.loadingText}>Loading cafes...</Text>
        </View>
      )}
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  loadingBox: {
    position: 'absolute',
    bottom: 25,
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    marginLeft: 8,
    color: '#333',
  },
});