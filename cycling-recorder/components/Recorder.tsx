import React, { useEffect, useRef, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import * as FileSystem from "expo-file-system";
import MagnitudeSensors from "./MagnitudeSensors";
import { haversineDistance } from "@/helpers/haversineDistance";
import { getLocation } from "@/helpers/getLocation";
import { formatTime } from "@/helpers/formatTime";
import { GPSData, Route, dataEntry, isGPSData, magnitudeData } from "@/types";
import { formatDateTime } from "@/helpers/formatDateTime";
import CustomMapView from "./CustomMapView";

const ENTRY_INTERVAL = 10000; // 10 seconds in ms
const MINIMAL_DISTANCE = 5; // how many meters to be considered moving

const Recorder = ({ onNewGPSData }: { onNewGPSData: any }) => {
    const [magnitudeData, setMagnitudeData] = useState<magnitudeData | null>(
        null
    );
    const [prevGPS, setPrevGPS] = useState<any>(null);
    const [distance, setDistance] = useState<number>(0);
    const [speed, setSpeed] = useState<number>(0);
    const [time, setTime] = useState<number>(0);
    const [recordingData, setRecordingData] = useState<dataEntry[]>([]);
    const [moving, setMoving] = useState<boolean>(false);

    const prevGPSRef = useRef(prevGPS);
    const magnitudeDataRef = useRef(magnitudeData);
    const recordingDataRef = useRef(recordingData);
    const movingRef = useRef(moving);

    useEffect(() => {
        prevGPSRef.current = prevGPS;
        magnitudeDataRef.current = magnitudeData;
        recordingDataRef.current = recordingData;
        movingRef.current = moving;
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
            saveRecordingData(
                recordingDataRef.current,
                recordingStart,
                new Date()
            );

            console.log(recordingStart);
            console.log(recordingDataRef.current);
        };
    }, []);

    const saveRecordingData = async (
        data: dataEntry[],
        recordingStart: Date,
        recordingEnd: Date
    ) => {
        const formattedDateTime = formatDateTime(recordingEnd);
        const filePath = `${FileSystem.documentDirectory}recording_${formattedDateTime}.json`;

        const routeData: Route = {
            recordingStart,
            recordingEnd,
            distance,
            data: data,
        };

        try {
            await FileSystem.writeAsStringAsync(
                filePath,
                JSON.stringify(routeData),
                {
                    encoding: FileSystem.EncodingType.UTF8,
                }
            );
            console.log("Data saved to", filePath);
            console.log(routeData);
        } catch (error) {
            console.error("Failed to save data:", error);
        }
    };

    const storeDataEntry = (newGPS: GPSData) => {
        const newData: dataEntry = {
            timestamp: Date.now(),
            gps: newGPS,
            magnitude: magnitudeDataRef.current,
            moving: movingRef.current,
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
            let entryDistance = haversineDistance(newGPS, prevGPSRef.current);

            const entryMoving = entryDistance > MINIMAL_DISTANCE;

            if (!entryMoving) {
                entryDistance = 0;
            }

            setDistance((prevDistance) => prevDistance + entryDistance);
            setSpeed((entryDistance / (ENTRY_INTERVAL / 1000)) * 3.6);
            setMoving(entryMoving);
        }

        storeDataEntry(newGPS);
        setPrevGPS(newGPS);
    };

    return (
        <>
            <View style={styles.mapContainer}>
                <CustomMapView dataEntries={recordingData} />
            </View>

            <MagnitudeSensors
                returnNewData={handleMagnitudeData}
                entryInterval={ENTRY_INTERVAL}
            />

            <View style={styles.infoContainer}>
                <View style={styles.dataContainer}>
                    <Text style={styles.textHeader}>Duration</Text>
                    <Text style={styles.text}>{formatTime(time)}</Text>
                </View>
                <View style={styles.dataContainer}>
                    <Text style={styles.textHeader}>Distance</Text>
                    <Text style={styles.text}>{distance.toFixed(2)} m</Text>
                </View>
                <View style={styles.dataContainer}>
                    <Text style={styles.textHeader}>Speed</Text>
                    <Text style={styles.text}>{speed.toFixed(2)} km/h</Text>
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    mapContainer: {
        flex: 10,
        position: "relative",
    },
    infoContainer: {
        flex: 7,
        flexDirection: "column",
        justifyContent: "flex-start",
        flexWrap: "wrap",
        gap: 3,
        alignItems: "center",
        padding: 10,
    },
    dataContainer: {
        width: "100%",
        borderBottomColor: "#ccc",
        borderBottomWidth: 1,
        padding: 10,
    },
    textHeader: {
        fontSize: 16,
        color: "#aaa",
        fontWeight: "bold",
        textTransform: "uppercase",
        marginBottom: 5,
    },
    text: {
        fontSize: 23,
    },
});

export default Recorder;
