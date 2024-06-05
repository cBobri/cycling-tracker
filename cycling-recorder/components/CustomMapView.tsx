import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import MapView, { Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { dataEntry } from "@/types";

interface LocationObject {
    coords: {
        latitude: number;
        longitude: number;
    };
}

type Coordinates = {
    latitude: number;
    longitude: number;
};

interface CustomMapViewProps {
    dataEntries: dataEntry[];
    userShown: boolean;
}

const CustomMapView = ({ dataEntries, userShown }: CustomMapViewProps) => {
    const [location, setLocation] = useState<LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [coordinates, setCoordinates] = useState<Coordinates[]>([]);

    useEffect(() => {
        setCoordinates(
            dataEntries.map((data) => {
                return {
                    latitude: data.gps.latitude,
                    longitude: data.gps.longitude,
                };
            })
        );
    }, [dataEntries]);

    useEffect(() => {
        const getLocation = async () => {
            try {
                let { status } =
                    await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                    setErrorMsg("Permission to access location was denied");
                    setLoading(false);
                    return;
                }

                let location = await Location.getCurrentPositionAsync({});
                setLocation(location);
            } catch (error: any) {
                setErrorMsg("Error getting location: " + error.message);
            } finally {
                setLoading(false);
            }
        };

        getLocation();
    }, []);

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Waiting for location...</Text>
            </View>
        );
    }

    if (errorMsg) {
        return (
            <View style={styles.centered}>
                <Text>{errorMsg}</Text>
            </View>
        );
    }

    if (!location) {
        return (
            <View style={styles.centered}>
                <Text>Unable to get location.</Text>
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
                    coordinates={coordinates}
                    strokeColor="red"
                    strokeWidth={6}
                />
            )}
        </MapView>
    );
};

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default CustomMapView;
