import React, { useEffect, useRef, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import * as FileSystem from "expo-file-system";
import MagnitudeSensors from "./MagnitudeSensors";
import { haversineDistance } from "@/helpers/haversineDistance";
import { getLocation } from "@/helpers/getLocation";
import { formatTime } from "@/helpers/formatTime";
import { GPSData, dataEntry, isGPSData, magnitudeData } from "@/types";
import { formatDateTime } from "@/helpers/formatDateTime";

const ENTRY_INTERVAL = 10000; // 10 seconds in ms

const Recorder = ({ onNewGPSData }: { onNewGPSData: any }) => {
    const [magnitudeData, setMagnitudeData] = useState<magnitudeData | null>(
        null
    );
    const [prevGPS, setPrevGPS] = useState<any>(null);
    const [distance, setDistance] = useState<number>(0);
    const [speed, setSpeed] = useState<number>(0);
    const [time, setTime] = useState<number>(0);
    const [recordingData, setRecordingData] = useState<dataEntry[]>([]);

    const prevGPSRef = useRef(prevGPS);
    const magnitudeDataRef = useRef(magnitudeData);
    const recordingDataRef = useRef(recordingData);

    useEffect(() => {
        prevGPSRef.current = prevGPS;
        magnitudeDataRef.current = magnitudeData;
        recordingDataRef.current = recordingData;
    }, [magnitudeData, recordingData]);

    useEffect(() => {
        //console.log("---------updated data-----------");
        //console.log(recordingData);
    }, [recordingData]);

    useEffect(() => {
        const recordingStart = new Date();

        readGPS();

        const interval = setInterval(() => {
            readGPS();
        }, ENTRY_INTERVAL);

        const timer = setInterval(() => {
            setTime(Date.now() - recordingStart.getTime());
        }, 1000);

        return () => {
            clearInterval(interval);
            clearInterval(timer);

            console.log("Save to file");
            saveRecordingData(recordingDataRef.current, recordingStart);

            console.log(recordingStart);
            console.log(recordingDataRef.current);
        };
    }, []);

    const saveRecordingData = async (
        data: dataEntry[],
        recordingStart: Date
    ) => {
        const formattedDateTime = formatDateTime(recordingStart);
        const filePath = `${FileSystem.documentDirectory}recording_${formattedDateTime}.json`;
        try {
            await FileSystem.writeAsStringAsync(
                filePath,
                JSON.stringify(data),
                { encoding: FileSystem.EncodingType.UTF8 }
            );
            console.log("Data saved to", filePath);
        } catch (error) {
            console.error("Failed to save data:", error);
        }
    };

    const storeDataEntry = (newGPS: GPSData) => {
        const newData: dataEntry = {
            timestamp: Date.now(),
            gps: newGPS,
            magnitude: magnitudeDataRef.current,
        };

        setRecordingData([...recordingDataRef.current, newData]);
        onNewGPSData(newGPS);
    };

    const handleMagnitudeData = (data: magnitudeData) => {
        setMagnitudeData(data);
    };

    const readGPS = async () => {
        const newGPS = await getLocation();
        if (!isGPSData(newGPS)) return;

        if (prevGPSRef.current) {
            const entryDistance = haversineDistance(newGPS, prevGPSRef.current);
            setDistance(distance + entryDistance);
            setSpeed((entryDistance / 10) * 3.6);
        }

        storeDataEntry(newGPS);
        setPrevGPS(newGPS);
    };

    return (
        <View style={styles.container}>
            <>
                <Text style={styles.text}>
                    Data entries: {recordingData.length}
                </Text>
                <MagnitudeSensors
                    returnNewData={handleMagnitudeData}
                    entryInterval={ENTRY_INTERVAL}
                />
                <Text style={styles.text}>
                    Distance: {distance.toFixed(2)} meters
                </Text>
                <Text style={styles.text}>Speed: {speed.toFixed(2)} km/h</Text>
                <Text style={styles.text}>{`Time: ${formatTime(time)}`}</Text>
            </>
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

export default Recorder;
