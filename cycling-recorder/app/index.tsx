import { Text, View, StyleSheet } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { registerRootComponent } from 'expo';
import AppNavigator from '@components/navigation/AppNavigator';

export default function Index() {
    return <AppNavigator />;
}

/* export default function Index() {
    return (
        <View style={styles.container}>
            <Text>Edit app/index.tsx to edit this screen</Text>
            <Link href="/record">Record</Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        gap: 50,
    },
});
 */