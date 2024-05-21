import { Text, View, StyleSheet, Button } from "react-native";
import React, { useEffect, useState } from "react";
import MagnitudeSensors from "../components/MagnitudeSensors";
import { haversineDistance } from "@/helpers/haversineDistance";
import { getLocation } from "@/helpers/getLocation";

export default function Index() {
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [magnitude, setMagnitude] = useState<any>(null);
    const [GPS, setGPS] = useState<any>(null);
    const [distance, setDistance] = useState<number>(0);
    const [recordingStart, setRecordingStart] = useState<number | null>(null);

    useEffect(() => {
        if (GPS && magnitude) {
            const data = {
                routeID: "lol",
                timestamp: Date.now(),
                gps: GPS,
                magnitude,
            };

            console.log("-----Data to send");
            console.log(JSON.stringify(data));
        }
    }, [GPS]);

    useEffect(() => {
        if (isRecording) setRecordingStart(Date.now());

        if (GPS == null) {
            updateGPS();
        }

        const interval = setInterval(() => {
            if (isRecording) updateGPS();
        }, 10000);

        return () => {
            clearInterval(interval);
        };
    }, [isRecording]);

    const toggleRecording = () => {
        setIsRecording((prevState: boolean) => !prevState);
    };

    const handleMagnitudeData = (data: any) => {
        setMagnitude(data);
    };

    const updateGPS = async () => {
        const data = await getLocation();
        if (GPS) setDistance(distance + haversineDistance(data, GPS));
        setGPS(data);
    };

    return (
        <View style={styles.container}>
            <Button
                title={isRecording ? "Stop Recording" : "Start Recording"}
                onPress={toggleRecording}
            />
            {isRecording && (
                <>
                    <MagnitudeSensors handleNewResult={handleMagnitudeData} />
                    <Text style={styles.text}>Distance: {distance} meters</Text>
                    <Text style={styles.text}>
                        Time: {(Date.now() - recordingStart!) / 1000} seconds
                    </Text>
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
    text: {
        fontSize: 18,
        margin: 10,
    },
});
