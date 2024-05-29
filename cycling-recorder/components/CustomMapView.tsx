import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";

interface LocationObject {
  coords: {
    latitude: number;
    longitude: number;
  };
}
interface GPSData {
  latitude: number;
  longitude: number;
}

interface CustomMapViewProps {
  gpsData: GPSData[];
}

const CustomMapView = ({ gpsData }: CustomMapViewProps) => {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  if (!location) {
    //return null;
    return(
      <View>
        <Text>Waiting for location...</Text>
      </View>
    )
  }

  const { latitude, longitude } = location.coords;

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      showsUserLocation={true}
    >
      {gpsData && gpsData.length > 0 && (
        <Polyline
          coordinates={gpsData.map(({ latitude, longitude }) => ({
            latitude,
            longitude,
          }))}
          strokeColor="red"
          strokeWidth={6}
        />
      )}
      {/*gpsData.map((coord, index) => (
        <Marker
          key={index}
          coordinate={{ latitude: coord.latitude, longitude: coord.longitude }}
        >
          <View style={styles.dot} />
        </Marker>
      ))*/}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
  },
});

export default CustomMapView;
