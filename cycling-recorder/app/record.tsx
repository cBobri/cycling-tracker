import React, { useEffect, useState } from "react";
import { View, StyleSheet, Button, Text, ScrollView } from "react-native";
import * as FileSystem from "expo-file-system";
import Recorder from "@/components/Recorder";
import { SafeAreaView } from 'react-native-safe-area-context';

const Record = () => {
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [recordings, setRecordings] = useState<string[]>([]);

    useEffect(() => {
        if (isRecording) {
            console.log("Started recording");
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

    return (
        <SafeAreaView style={styles.container}>
            <Button
                title={isRecording ? "Stop Recording" : "Start Recording"}
                onPress={toggleRecording}
            />
            {isRecording ? (
                <Recorder />
            ) : (
                <ScrollView style={styles.scrollView}>
                    {recordings.map((recording, index) => (
                        <Text key={index} style={styles.text}>
                            {recording}
                        </Text>
                    ))}
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
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
