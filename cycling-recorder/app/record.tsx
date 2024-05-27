import { Text, View, StyleSheet, Button } from "react-native";
import React, { useEffect, useState } from "react";
import MagnitudeSensors from "../components/MagnitudeSensors";
import { haversineDistance } from "@/helpers/haversineDistance";
import { getLocation } from "@/helpers/getLocation";
import { formatTime } from "@/helpers/formatTime";
import { GPSData, dataEntry, isGPSData, magnitudeData } from "@/types";

const Record = () => {
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [magnitudeData, setMagnitudeData] = useState<magnitudeData | null>(
        null
    );
    const [GPSData, setGPSData] = useState<any>(null);
    const [distance, setDistance] = useState<number>(0);
    const [speed, setSpeed] = useState<number>(0);
    const [recordingStart, setRecordingStart] = useState<number | null>(null);
    const [recordingData, setRecordingData] = useState<dataEntry[]>([]);

    useEffect(() => {
        console.log("---------updated data-----------");
        console.log(recordingData);
    }, [recordingData]);

    useEffect(() => {
        if (isRecording) setRecordingStart(Date.now());

        if (GPSData == null) {
            readGPS();
        }

        const interval = setInterval(() => {
            if (isRecording) readGPS();
        }, 10000);

        return () => {
            clearInterval(interval);
        };
    }, [isRecording]);

    const toggleRecording = () => {
        setIsRecording((prevState: boolean) => !prevState);
    };

    const storeDataEntry = (newGPS: GPSData) => {
        const newData: dataEntry = {
            timestamp: Date.now(),
            gps: newGPS,
            magnitude: magnitudeData,
        };

        setRecordingData([...recordingData, newData]);
    };

    const handleMagnitudeData = (data: magnitudeData) => {
        console.log("got new magnitude data");
        setMagnitudeData(data);
    };

    const readGPS = async () => {
        const newGPS = await getLocation();

        if (!isGPSData(newGPS)) return;

        if (GPSData) {
            const entryDistance = haversineDistance(newGPS, GPSData);
            setDistance(distance + entryDistance);
            setSpeed((entryDistance / 10) * 3.6);
        }

        storeDataEntry(newGPS);
        setGPSData(newGPS);
    };

    return (
        <View style={styles.container}>
            <Button
                title={isRecording ? "Stop Recording" : "Start Recording"}
                onPress={toggleRecording}
            />
            {isRecording && (
                <>
                    <Text style={styles.text}>
                        Data entries: {recordingData.length}
                    </Text>
                    <MagnitudeSensors returnNewData={handleMagnitudeData} />
                    <Text style={styles.text}>Distance: {distance} meters</Text>
                    <Text style={styles.text}>Speed: {speed} km/h</Text>
                    <Text style={styles.text}>
                        {`Time: ${formatTime(Date.now() - recordingStart!)}`}
                    </Text>
                </>
            )}
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
