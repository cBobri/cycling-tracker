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

const Record = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [showRecordings, setShowRecordings] = useState<boolean>(false);
  const [recordings, setRecordings] = useState<string[]>([]);

  const [gpsData, setGPSData] = useState<GPSData[]>([]);
  const [speed, setSpeed] = useState<number>(0);

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
        (file) => file.startsWith("recording_") && file.endsWith(".json")
      );
      setRecordings(recordingFiles);
    } catch (error) {
      console.error("Error reading files:", error);
    }
  };

  const toggleRecording = () => {
    setIsRecording((prevState: boolean) => !prevState);
  };
  const toggleShowRecordings = () => {
    setShowRecordings((prevState: boolean) => !prevState);
  };

  //to dvoje je da dobim gps pa speed iz Recorder.tsx
  const handleNewGPSData = (newGPS: GPSData) => {
    setGPSData((prevGPSData) => [...prevGPSData, newGPS]);
  };

  const handleNewSpeed = (newSpeed: number) => {
    setSpeed(newSpeed);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapContainer}>
        <CustomMapView gpsData={gpsData} />
        {showRecordings && (
          <ScrollView style={styles.scrollView}>
            {recordings.map((recording, index) => (
              <Text key={index} style={styles.textHeader}>
                {recording}
              </Text>
            ))}
          </ScrollView>
        )}
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.dataContainer}>
          <Text style={styles.textHeader}>Duration:</Text>
          <Text style={styles.text}> 00:00</Text>
        </View>
        <View style={styles.dataContainer}>
          <Text style={styles.textHeader}>Distance:</Text>
          <Text style={styles.text}>0 m</Text>
        </View>
        <View style={styles.dataContainer}>
          <Text style={styles.textHeader}>Speed</Text>
          <Text style={styles.text}>0 km/h</Text>
        </View>
        <View style={styles.bottomDataContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleRecording}>
            <Text style={styles.text}>
              {isRecording ? "Stop Recording" : "Start Recording"}
            </Text>
          </TouchableOpacity>
        </View>
        {/* <Button
                    title={isRecording ? "Stop Recording" : "Start Recording"}
                    onPress={toggleRecording}
                />
                <Button
                    title={showRecordings ? "Hide Recordings" : "Show Recordings"}
                    onPress={toggleShowRecordings}
                />
                {isRecording && (
                    <Recorder onNewGPSData={handleNewGPSData} onNewSpeed={handleNewSpeed} />
                )} */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 50,
  },
  mapContainer: {
    flex: 4,
    position: "relative",
  },
  bottomContainer: {
    flex: 6,
  },
  dataContainer: {
    flex: 3,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    padding: 10,
  },
  bottomDataContainer: {
    flex: 1,
  },
  paddingLeftSmall: {
    paddingLeft: 10,
  },
  scrollView: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Slightly transparent background
  },
  textHeader: {
    fontSize: 30,
    marginVertical: 5,
    paddingBottom: 20,
  },
  text: {
    fontSize: 20,
    marginVertical: 5,
  },
  button: {
    width: '100%',
    backgroundColor: "#f4511e",
    height: '100%',
    alignItems: "center",
  },
});

export default Record;
