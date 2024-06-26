import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from "react-native";
import { Button } from "react-native-paper";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter, useLocalSearchParams } from "expo-router";
import authStyles from "../../styles/authStyle";
import { djangoApi, localApi, setToken, api } from "@/api/service";

enum CameraType {
  BACK = "back",
  FRONT = "front",
}

const VerifyPhoto = () => {
  const [photo, setPhoto] = useState<string | undefined>();
  const router = useRouter();
  const { token, mode } = useLocalSearchParams();
  const [facing, setFacing] = useState(CameraType.FRONT);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
        <Button onPress={requestPermission}>
          <Text>Grant Permission</Text>
        </Button>
      </View>
    );
  }
  function toggleCameraFacing() {
    setFacing((current) =>
      current === CameraType.BACK ? CameraType.FRONT : CameraType.BACK
    );
  }

  const takePhoto = async () => {
    if (!cameraRef.current) {
      return;
    }
    const photo = await cameraRef.current.takePictureAsync({
      quality: 1,
      base64: true,
    });
    setPhoto(photo?.uri);
    console.log("Photo taken", photo?.uri);
  };
  const retry = () => {
    setPhoto(undefined);
  };
  const confirm = async () => {
    try {
      if (photo) {
        // Retrieve the filename from the video URI
        const fileName = photo.split("/").pop();
        const fileType = "image/jpeg";
        setIsLoading(true);

        const blob = await fetch(photo).then((r) => r.blob());

        // Convert the blob to a base64-encoded string
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async function () {
          if (reader.result !== null) {
            let base64data;
            if (typeof reader.result === "string") {
              base64data = reader.result.split(",")[1];
            }
            const jsonPayload = JSON.stringify({
              fileName: fileName,
              fileType: fileType,
              data: base64data,
            });
            var response = null;
            try {
              response = await djangoApi.post("/upload_photo/", jsonPayload, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
            } catch (error) {
              console.error("Error uploading photo:", error);
              alert("Error uploading photo, try again");
              setPhoto(undefined);
            }
            console.log(response?.data);
            if (mode === "2fa_phone") {
              if (response?.status === 200) {
                alert("2fa was successfull");
                await setToken(token);
                router.replace("/main/record");
              } else {
                alert("2fa failed");
                router.replace("/auth/login");
              }
            } else if (mode === "2fa_web") {
              if (response?.status === 200) {
                alert("2fa for website was successfull");
                var response2 = null;
                try{
                  response2 = await api.post("/auth/finish");
                }catch(error){
                  //console.error("Error finishing 2fa:", error);
                  alert("User was not recognized, try again.");
                }
                if (response2?.status === 200) {
                  alert("2fa for website was successfull");
                } else {
                  alert("2fa for website failed");
                }
                router.replace("/main/record");
              } else {
                alert("2fa for website failed");
                router.replace("/main/record");
              }
            }
          } else {
            // Handle the case when reader.result is null
            console.error("Failed to read the blob as data URL");
          }
        };
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Error uploading video");
    }
  };

  if (photo) {
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Image
            source={{ uri: photo }}
            style={[styles.video, styles.mirror]}
          />
        </View>
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.button} onPress={retry}>
            <Text style={styles.text}>Retry</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={
              !isLoading
                ? () => {
                    confirm();
                  }
                : undefined
            }
          >
            <Text style={styles.text}>
              {isLoading ? "Checking..." : "Confirm"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.topContainer, styles.zoom]}>
        <CameraView
          mode="picture"
          style={styles.camera}
          facing={facing}
          ref={cameraRef}
        >
          <View style={styles.faceOval}></View>
        </CameraView>
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.text}>Flip Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Text style={styles.text}>Take photo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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

export default VerifyPhoto;
