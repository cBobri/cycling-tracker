import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, ScrollView, Text, Button, View } from "react-native";
import * as FileSystem from "expo-file-system";
import Recorder from "@/components/Recorder";
import CustomMapView from "@/components/CustomMapView";
import { GPSData } from "@/types";


const Record = () => {
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [recordings, setRecordings] = useState<string[]>([]);
    const [gpsData, setGPSData] = useState<GPSData[]>([]);

    useEffect(() => {
        if (isRecording) {
            console.log("Started recording");
            setGPSData([]); // Resetam gps pot da se zacne na novo risat
        } else {
            console.log("Stopped recording");
            loadRecordings();
        }
    }, [isRecording]);

    const loadRecordings = async () => {
        try {
            const files = await FileSystem.readDirectoryAsync(
                FileSystem.documentDirectory || ""
            );
            const recordingFiles = files.filter(
                (file) =>
                    file.startsWith("recording_") && file.endsWith(".json")
            );
            setRecordings(recordingFiles);
        } catch (error) {
            console.error("Error reading files:", error);
        }
    };

    const toggleRecording = () => {
        setIsRecording((prevState: boolean) => !prevState);
    };

    const handleNewGPSData = (newGPS: GPSData) => {
        setGPSData((prevGPSData) => [...prevGPSData, newGPS]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.mapContainer}>
                <CustomMapView gpsData={gpsData} />
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    title={isRecording ? "Stop Recording" : "Start Recording"}
                    onPress={toggleRecording}
                />
                {isRecording ? (
                    <Recorder onNewGPSData={handleNewGPSData} />
                ) : (
                    <ScrollView style={styles.scrollView}>
                        {recordings.map((recording, index) => (
                            <Text key={index} style={styles.text}>
                                {recording}
                            </Text>
                        ))}
                    </ScrollView>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    mapContainer: {
        flex: 8,
    },
    buttonContainer: {
        flex: 2,
        justifyContent: "center",
        alignItems: "center",
    },
    scrollView: {
        width: "100%",
        padding: 10,
    },
    text: {
        fontSize: 18,
        marginVertical: 5,
    },
});

export default Record;
