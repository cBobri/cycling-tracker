import React, { useEffect, useState } from "react";
import {
    TouchableOpacity,
    SafeAreaView,
    StyleSheet,
    ScrollView,
    Text,
    Button,
    View,
} from "react-native";
import * as FileSystem from "expo-file-system";
import Recorder from "@/components/Recorder";
import CustomMapView from "@/components/CustomMapView";
import { GPSData } from "@/types";
import { parseDateFromFilename } from "@/helpers/parseDateFromFilename";

const Record = () => {
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [recordings, setRecordings] = useState<string[]>([]);
    const [gpsData, setGPSData] = useState<GPSData[]>([]);

    useEffect(() => {
        if (isRecording) {
            setGPSData([]); // Reset GPS data to start a new recording
        } else {
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

    const deleteRecording = async (filename: string) => {
        try {
            await FileSystem.deleteAsync(
                `${FileSystem.documentDirectory}${filename}`
            );
            setRecordings((prevRecordings) =>
                prevRecordings.filter((recording) => recording !== filename)
            );
        } catch (error) {
            console.error("Error deleting file:", error);
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
            <View style={styles.contentContainer}>
                {!isRecording && (
                    <ScrollView style={styles.recordingList}>
                        <Text style={styles.savedRecordingsText}>
                            Saved recordings
                        </Text>
                        {recordings.length > 0 ? (
                            recordings
                                .sort((a, b) => b.localeCompare(a))
                                .map((recording, index) => (
                                    <View
                                        key={index}
                                        style={styles.recordingItem}
                                    >
                                        <Text style={styles.recordingText}>
                                            {parseDateFromFilename(recording)}
                                        </Text>
                                        <Button
                                            title="Delete"
                                            onPress={() =>
                                                deleteRecording(recording)
                                            }
                                            color="#f4511e"
                                        />
                                    </View>
                                ))
                        ) : (
                            <Text style={styles.noRecordingsText}>
                                No recordings available.
                            </Text>
                        )}
                    </ScrollView>
                )}
                {isRecording && <Recorder onNewGPSData={handleNewGPSData} />}
            </View>
            <TouchableOpacity style={styles.button} onPress={toggleRecording}>
                <Text style={styles.buttonText}>
                    {isRecording ? "Stop Recording" : "Start Recording"}
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        marginTop: 50,
        gap: 5,
    },
    contentContainer: {
        flex: 1,
    },
    recordingList: {
        flex: 1,
        padding: 10,
    },
    recordingItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomColor: "#ccc",
        borderBottomWidth: 1,
    },
    recordingText: {
        fontSize: 18,
    },
    savedRecordingsText: {
        fontSize: 24,
        paddingVertical: 5,
        textAlign: "center",
    },
    noRecordingsText: {
        fontSize: 18,
        paddingVertical: 5,
        textAlign: "center",
        color: "#999",
    },
    bottomDataContainer: {
        flex: 1,
    },
    text: {
        fontSize: 20,
        marginVertical: 5,
    },
    textSmall: {
        fontSize: 10,
    },
    button: {
        margin: 15,
        borderRadius: 15,
        backgroundColor: "#f4511e",
        height: 70,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        fontSize: 20,
        marginVertical: 5,
        color: "#fff",
        fontWeight: "bold",
        textTransform: "uppercase",
    },
});

export default Record;
