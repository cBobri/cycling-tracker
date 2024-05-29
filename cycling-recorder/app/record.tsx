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
  const [recordings, setRecordings] = useState<string[]>([]);

  const [gpsData, setGPSData] = useState<GPSData[]>([]);


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

  //to dvoje je da dobim gps pa speed iz Recorder.tsx
  const handleNewGPSData = (newGPS: GPSData) => {
    setGPSData((prevGPSData) => [...prevGPSData, newGPS]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapContainer}>
        <CustomMapView gpsData={gpsData} />
      </View>
      <View style={styles.bottomContainer}>
        {!isRecording && (<><View style={styles.dataContainer}>
          <Text style={styles.textHeader}>Duration:</Text>
          <Text style={styles.text}> 00:00</Text>
        </View><View style={styles.dataContainer}>
            <Text style={styles.textHeader}>Distance:</Text>
            <Text style={styles.text}>0.00 m</Text>
          </View><View style={styles.dataContainer}>
            <Text style={styles.textHeader}>Speed</Text>
            <Text style={styles.text}>0.00 km/h</Text>
          </View></>)}
          {isRecording && (
            <Recorder onNewGPSData={handleNewGPSData} />
          )}
        
        <View style={styles.bottomDataContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleRecording}>
            <Text style={styles.text}>
              {isRecording ? "Stop Recording" : "Start Recording"}
            </Text>
          </TouchableOpacity>
        </View>
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
    flex: 1
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
  textSmall:{
    fontSize: 10,
  },
  button: {
    width: '100%',
    backgroundColor: "#f4511e",
    height: '100%',
    alignItems: "center",
  },
});

export default Record;
