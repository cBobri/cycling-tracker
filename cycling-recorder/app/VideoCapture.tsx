import { CameraView, useCameraPermissions, Camera } from "expo-camera";
import { useState, useEffect, useRef } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ResizeMode, Video } from "expo-av";
import { SafeAreaView } from "react-native-safe-area-context";
import * as FileSystem from "expo-file-system";
import { djangoApi, localApi } from "@/api/service";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

enum CameraType {
  BACK = "back",
  FRONT = "front",
}
const Duration = 3;
export default function App() {
  const [facing, setFacing] = useState(CameraType.FRONT);
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState<string | undefined>();
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(
    null
  );
  const [recordingDuration, setRecordingDuration] = useState<number>(Duration);
  const cameraRef = useRef<CameraView | null>(null);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isRecording) {
      intervalId = setInterval(() => {
        setRecordingDuration((prevCountdown) => {
          if (prevCountdown > 1) {
            return prevCountdown - 1;
          } else {
            stopRecording(); // Stop recording when countdown reaches 0
            return 0; // Or keep it at 0 if you prefer
          }
        });
      }, 1000); // Update every 1000 milliseconds (1 second)
    }

    return () => clearInterval(intervalId); // Clear interval on unmount or when recording stops
  }, [isRecording]); // Run effect whenever isRecording changes

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status: cameraStatus } =
      await Camera.requestCameraPermissionsAsync();
    const { status: audioStatus } =
      await Camera.requestMicrophonePermissionsAsync(); // Request audio permission

    if (
      cameraStatus !== "granted" ||
      audioStatus !== "granted" // Check audio permission
    ) {
      alert(
        "Permission to access camera, microphone and media library is required!"
      );
    }
  };

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) =>
      current === CameraType.BACK ? CameraType.FRONT : CameraType.BACK
    );
  }

  const startRecording = async () => {
    if (cameraRef.current) {
      try {
        const videoRecordPromise = cameraRef.current.recordAsync(); // Start recording
        setOpacity(1);
        setIsRecording(true);
        setRecordingStartTime(Date.now());
        setRecordingDuration(Duration);
        const data = await videoRecordPromise;
        setVideo(data?.uri);
        console.log("Video recording completed", data?.uri);
      } catch (error) {
        console.error("Error recording video:", error);
      }
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      // Accessing the ref with .current
      cameraRef.current.stopRecording();
      setOpacity(0);
      setIsRecording(false);
      setRecordingStartTime(null);
      setRecordingDuration(5);
    }
  };
  const retry = () => {
    setVideo(undefined);
  };

  const confirm = async () => {
    try {
      if (video) {
        // Retrieve the filename from the video URI
        const fileName = video.split("/").pop();
        const fileType = "video/mp4";

        const blob = await fetch(video).then(r => r.blob());

        // Convert the blob to a base64-encoded string
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async function() {
          if (reader.result !== null) {
            let base64data;
            if (typeof reader.result === 'string') {
              base64data = reader.result.split(',')[1];
            }
            const jsonPayload = JSON.stringify({
                fileName: fileName,
                fileType: fileType,
                data: base64data
            });

            const response = await localApi.post("/upload_video/", jsonPayload);
            console.log(response.data);
            
          } else {
            // Handle the case when reader.result is null
            console.error('Failed to read the blob as data URL');
          }
        };        
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Error uploading video");
    }
  };

  if (video) {
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Video
            source={{ uri: video }}
            style={styles.video}
            isLooping
            isMuted
            shouldPlay
            resizeMode={ResizeMode.COVER}
            videoStyle={styles.mirror}
          />
        </View>
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.button} onPress={retry}>
            <Text style={styles.text}>Retry</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={confirm}>
            <Text style={styles.text}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.topContainer, styles.zoom]}>
        <CameraView
          mode="video"
          style={styles.camera}
          facing={facing}
          ref={cameraRef}
        >
          <View style={styles.buttonContainer}>
            <Text style={[styles.countdown, { opacity }]}>
              {recordingDuration}
            </Text>
          </View>
          <View style={styles.faceOval}></View>
        </CameraView>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.text}>Flip Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={isRecording ? () => {} : startRecording}
        >
          <Text style={styles.text}>
            {isRecording ? "Recording..." : "Start recording"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  topContainer: {
    flex: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomContainer: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#1c1c1c",
  },
  camera: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  buttonContainer: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  button: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f4511e",
    borderRadius: 10,
    marginHorizontal: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  video: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  countdown: {
    fontSize: 48,
    fontWeight: "bold",
    color: "red",
  },
  faceOval: {
    position: "absolute",
    top: "25%",
    left: "25%",
    width: "50%",
    height: "50%",
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 100,
    borderStyle: "dotted",
  },
  mirror: {
    transform: [{ scaleX: -1 }],
  },
  zoom: {
    transform: [{ scale: 1.3 }],
  },
});
