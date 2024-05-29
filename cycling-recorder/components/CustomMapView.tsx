import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { dataEntry } from "@/types";

interface LocationObject {
    coords: {
        latitude: number;
        longitude: number;
    };
}
interface CustomMapViewProps {
    dataEntries: dataEntry[];
    userShown: boolean;
}

const CustomMapView = ({ dataEntries, userShown }: CustomMapViewProps) => {
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
        return (
            <View>
                <Text>Waiting for location...</Text>
            </View>
        );
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
            showsUserLocation={userShown}
        >
            {dataEntries && dataEntries.length > 0 && (
                <Polyline
                    coordinates={dataEntries.map((data: dataEntry) => ({
                        latitude: data.gps.latitude,
                        longitude: data.gps.altitude,
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
        backgroundColor: "red",
    },
});

export default CustomMapView;
