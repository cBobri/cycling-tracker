import React, { useCallback, useEffect, useState } from "react";
import {
    TouchableOpacity,
    SafeAreaView,
    StyleSheet,
    ScrollView,
    Text,
    View,
} from "react-native";
import * as FileSystem from "expo-file-system";
import Recorder from "@/components/Recorder";
import { parseDateFromFilename } from "@/helpers/parseDateFromFilename";
import { CustomColors } from "@/constants/Colors";
import { Link, useFocusEffect } from "expo-router";

const Record = () => {
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [recordings, setRecordings] = useState<string[]>([]);

    useEffect(() => {
        if (!isRecording) {
            loadRecordings();
        }
    }, [isRecording]);

    useFocusEffect(
        useCallback(() => {
            loadRecordings();
        }, [])
    );

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
                                    <Link
                                        href={{
                                            pathname: "/Upload",
                                            params: { fileName: recording },
                                        }}
                                        key={index}
                                        style={styles.recordingItem}
                                    >
                                        <Text style={styles.recordingText}>
                                            {parseDateFromFilename(recording)}
                                        </Text>
                                    </Link>
                                ))
                        ) : (
                            <Text style={styles.noRecordingsText}>
                                No recordings available.
                            </Text>
                        )}
                    </ScrollView>
                )}
                {isRecording && <Recorder />}
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
        color: CustomColors.dark,
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
        borderBottomColor: CustomColors.secondary,
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
        backgroundColor: CustomColors.primary,
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
