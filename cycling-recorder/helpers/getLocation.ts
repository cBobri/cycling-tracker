import * as Location from "expo-location";

export const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
        return null;
    }

    let newLocation = await Location.getCurrentPositionAsync({});

    return {
        latitude: newLocation.coords.latitude,
        longitude: newLocation.coords.longitude,
        altitude: newLocation.coords.altitude,
    };
};
