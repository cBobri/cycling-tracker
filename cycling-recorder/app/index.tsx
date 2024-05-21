import { Text, View, StyleSheet, Button } from "react-native";
import React, { useState } from "react";
import MagnitudeSensors from "../components/MagnitudeSensors";
import GPSSensor from "../components/GPSSensor";

export default function Index() {
    const [isRecording, setIsRecording] = useState<boolean>(false);

    const toggleRecording = () => {
        setIsRecording((prevState: boolean) => !prevState);
    };

    return (
        <View style={styles.container}>
            <Text>Edit app/index.tsx to edit this screen.</Text>
            <Button
                title={isRecording ? "Stop Recording" : "Start Recording"}
                onPress={toggleRecording}
            />
            {isRecording && (
                <>
                    <MagnitudeSensors />
                    <GPSSensor />
                </>
            )}
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
