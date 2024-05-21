import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Accelerometer, Gyroscope } from "expo-sensors";

const SHAKING_LEVELS = [
    { level: 0, threshold: 1.0 }, // No shaking
    { level: 1, threshold: 1.2 }, // Mild shaking
    { level: 2, threshold: 1.4 }, // Moderate shaking
    { level: 3, threshold: 1.7 }, // Strong shaking
    { level: 4, threshold: 2.0 }, // Very strong shaking
    { level: 5, threshold: 2.5 }, // Extreme shaking
];

const DURATION = 10000; // 10 seconds in milliseconds

const getShakingLevel = (magnitude: number) => {
    for (let i = SHAKING_LEVELS.length - 1; i >= 0; i--) {
        if (magnitude > SHAKING_LEVELS[i].threshold) {
            return SHAKING_LEVELS[i].level;
        }
    }
    return 0; // No shaking
};

type Props = {
    handleNewResult: (data: any) => void;
};

export default function MagnitudeSensors({ handleNewResult }: Props) {
    const [data, setData] = useState({
        ax: 0,
        ay: 0,
        az: 0,
        gx: 0,
        gy: 0,
        gz: 0,
    });
    const [avgMagnitude, setAvgMagnitude] = useState(0);
    const [shakingLevel, setShakingLevel] = useState(0);
    const [dataArray, setDataArray] = useState([]);

    useEffect(() => {
        if (avgMagnitude != 0) {
            handleNewResult({ value: avgMagnitude, level: shakingLevel });
        }
    }, [avgMagnitude]);

    useEffect(() => {
        // Subscribe to sensor updates
        const accelerometerSubscription = Accelerometer.addListener(
            (accelerometerData) => {
                setData((prevData) => ({
                    ...prevData,
                    ax: accelerometerData.x,
                    ay: accelerometerData.y,
                    az: accelerometerData.z,
                }));
                handleNewData({
                    ...data,
                    ax: accelerometerData.x,
                    ay: accelerometerData.y,
                    az: accelerometerData.z,
                });
            }
        );

        const gyroscopeSubscription = Gyroscope.addListener((gyroscopeData) => {
            setData((prevData) => ({
                ...prevData,
                gx: gyroscopeData.x,
                gy: gyroscopeData.y,
                gz: gyroscopeData.z,
            }));
            handleNewData({
                ...data,
                gx: gyroscopeData.x,
                gy: gyroscopeData.y,
                gz: gyroscopeData.z,
            });
        });

        // Unsubscribe from sensors updates on component unmount
        return () => {
            accelerometerSubscription && accelerometerSubscription.remove();
            gyroscopeSubscription && gyroscopeSubscription.remove();
        };
    }, [data]);

    const handleNewData = (sensorData: any) => {
        const { ax, ay, az, gx, gy, gz } = sensorData;
        const accMagnitude = Math.sqrt(ax * ax + ay * ay + az * az);
        const gyroMagnitude = Math.sqrt(gx * gx + gy * gy + gz * gz);

        const combinedMagnitude = Math.sqrt(
            accMagnitude * accMagnitude + gyroMagnitude * gyroMagnitude
        );

        setDataArray((prevData: any): any => {
            const currentTime = Date.now();
            const newData = [
                ...prevData,
                { combinedMagnitude, time: currentTime },
            ];
            const validData = newData.filter(
                ({ time }) => currentTime - time <= DURATION
            );

            const averageMagnitude =
                validData.reduce(
                    (sum, { combinedMagnitude }) => sum + combinedMagnitude,
                    0
                ) / validData.length;

            const newShakingLevel = getShakingLevel(averageMagnitude);

            setAvgMagnitude(averageMagnitude);
            setShakingLevel(newShakingLevel);
            return validData;
        });
    };

    // const { ax, ay, az, gx, gy, gz } = data;

    return (
        <>
            {/* <Text style={styles.text}>Accelerometer Data:</Text>
            <Text style={styles.text}>x: {ax.toFixed(2)}</Text>
            <Text style={styles.text}>y: {ay.toFixed(2)}</Text>
            <Text style={styles.text}>z: {az.toFixed(2)}</Text>
            <Text style={styles.text}>Gyroscope Data:</Text>
            <Text style={styles.text}>x: {gx.toFixed(2)}</Text>
            <Text style={styles.text}>y: {gy.toFixed(2)}</Text>
            <Text style={styles.text}>z: {gz.toFixed(2)}</Text> */}
            <Text style={styles.text}>
                Average Magnitude ({dataArray.length} readings):{" "}
                {avgMagnitude.toFixed(2)}
            </Text>
            <Text style={styles.text}>Shaking Level: {shakingLevel}</Text>
        </>
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
