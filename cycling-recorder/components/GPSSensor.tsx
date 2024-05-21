import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import * as Location from "expo-location";

const GPSSensor = () => {
    const [location, setLocation] = useState<any>(null);
    const [errorMsg, setErrorMsg] = useState("");
    const [distance, setDistance] = useState(0);
    const [readings, setReadings] = useState(0);

    const toRadians = (degrees: number) => {
        return degrees * (Math.PI / 180);
    };

    const haversineDistance = (coords1: any, coords2: any): number => {
        const R = 6371e3; // Radius of the Earth in meters
        const lat1 = toRadians(coords1.latitude);
        const lat2 = toRadians(coords2.latitude);
        const deltaLat = toRadians(coords2.latitude - coords1.latitude);
        const deltaLon = toRadians(coords2.longitude - coords1.longitude);

        const a =
            Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1) *
                Math.cos(lat2) *
                Math.sin(deltaLon / 2) *
                Math.sin(deltaLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distance in meters
    };

    const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            setErrorMsg("Permission to access location was denied");
            return;
        }

        let newLocation = await Location.getCurrentPositionAsync({});

        //console.log(`Current location: ${JSON.stringify(newLocation)}`);

        if (location) {
            const dist = haversineDistance(location.coords, newLocation.coords);
            setDistance(dist);
        }
        setLocation(newLocation);
        setReadings(readings + 1);
    };

    useEffect(() => {
        let isMounted = true;

        if (location === null) {
            getLocation();
        }

        const interval = setInterval(() => {
            if (isMounted) {
                getLocation();
            }
        }, 15000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [location]);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>GPS Sensor ({readings} readings):</Text>
            {location && (
                <Text
                    style={styles.text}
                >{`Lat: ${location.coords.latitude}, Lon: ${location.coords.longitude}, Alt: ${location.coords.altitude}`}</Text>
            )}

            <Text style={styles.text}>Distance: {distance} meters</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: 18,
        margin: 10,
    },
});

export default GPSSensor;
