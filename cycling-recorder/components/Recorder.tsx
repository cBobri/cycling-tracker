import { Text, View, StyleSheet, Button } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import MagnitudeSensors from "./MagnitudeSensors";
import { haversineDistance } from "@/helpers/haversineDistance";
import { getLocation } from "@/helpers/getLocation";
import { formatTime } from "@/helpers/formatTime";
import { GPSData, dataEntry, isGPSData, magnitudeData } from "@/types";

const ENTRY_INTERVAL = 10000; // 10 seconds in ms

const Recorder = () => {
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
        console.log("---------updated data-----------");
        console.log(recordingData);
    }, [recordingData]);

    useEffect(() => {
        const recordingStart = Date.now();

        readGPS();

        const interval = setInterval(() => {
            readGPS();
        }, ENTRY_INTERVAL);

        const timer = setInterval(() => {
            setTime(Date.now() - recordingStart);
        }, 1000);

        return () => {
            clearInterval(interval);
            clearInterval(timer);

            console.log("Save to file");

            console.log(new Date(recordingStart));
            console.log(recordingDataRef.current);
        };
    }, []);

    const storeDataEntry = (newGPS: GPSData) => {
        const newData: dataEntry = {
            timestamp: Date.now(),
            gps: newGPS,
            magnitude: magnitudeDataRef.current,
        };

        setRecordingData([...recordingDataRef.current, newData]);
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
