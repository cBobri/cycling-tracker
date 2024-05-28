import { Text, View, StyleSheet, Button } from "react-native";
import React, { useEffect, useState } from "react";
import MagnitudeSensors from "../components/MagnitudeSensors";
import { haversineDistance } from "@/helpers/haversineDistance";
import { getLocation } from "@/helpers/getLocation";
import { formatTime } from "@/helpers/formatTime";
import { GPSData, dataEntry, isGPSData, magnitudeData } from "@/types";
import Recorder from "@/components/Recorder";

const ENTRY_INTERVAL = 10000; // 10 seconds in ms

const Record = () => {
    const [isRecording, setIsRecording] = useState<boolean>(false);

    useEffect(() => {
        if (isRecording) {
            console.log("Started recording");
        } else {
            console.log("Stopped recording");
        }
    }, [isRecording]);

    const toggleRecording = () => {
        setIsRecording((prevState: boolean) => !prevState);
    };

    return (
        <View style={styles.container}>
            <Button
                title={isRecording ? "Stop Recording" : "Start Recording"}
                onPress={toggleRecording}
            />
            {isRecording && <Recorder />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    text: {
        fontSize: 18,
        margin: 10,
    },
});

export default Record;
