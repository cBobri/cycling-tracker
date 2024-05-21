import { Text, View, StyleSheet } from "react-native";
import React from "react";
import MagnitudeSensors from "../components/MagnitudeSensors";

export default function Index() {
    return (
        <View style={styles.container}>
            <Text>Edit app/index.tsx to edit this screen.</Text>
            <MagnitudeSensors />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
});
