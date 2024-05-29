import { Route, UploadableRoute } from "@/types";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    SafeAreaView,
    ScrollView,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { parseDateFromFilename } from "@/helpers/parseDateFromFilename";
import CustomMapView from "@/components/CustomMapView";
import { CustomColors } from "@/constants/Colors";
import { formatTime } from "@/helpers/formatTime";
import { TextInput } from "react-native-paper";
import api from "@/api/service";

const Upload = () => {
    const params = useLocalSearchParams();
    const { fileName } = params;
    const parsedFileName = parseDateFromFilename(fileName as string);

    const [route, setRoute] = useState<Route | null>(null);
    const [title, setTitle] = useState<string>("");
    const [cyclistWeight, setCyclistWeight] = useState<number | null>(70);
    const [bikeWeight, setBikeWeight] = useState<number | null>(12);

    const [uploading, setUploading] = useState<boolean>(false);

    useEffect(() => {
        if (fileName) {
            loadFile();
        }
    }, [fileName]);

    const loadFile = async () => {
        try {
            const fileUri = `${FileSystem.documentDirectory}${fileName}`;
            const fileContent = await FileSystem.readAsStringAsync(fileUri);
            const parsedRoute: Route = JSON.parse(fileContent);
            setRoute(parsedRoute);
            setTitle(parsedFileName);
        } catch (error) {
            console.error("Error loading file:", error);
        }
    };

    const handleUpload = async () => {
        if (
            !route ||
            !title ||
            !cyclistWeight ||
            !bikeWeight ||
            cyclistWeight <= 0 ||
            bikeWeight <= 0
        ) {
            alert("Please fill in all inputs");
            return;
        }

        const uploadableRoute: UploadableRoute = {
            data: route.data,
            recordingStart: route.recordingStart,
            recordingEnd: route.recordingEnd,
            title,
            cyclistWeight,
            bikeWeight,
        };

        console.log("Upload route:", uploadableRoute);

        setUploading(true);

        try {
            const res = await api.post("/routes", uploadableRoute);

            if (res.status === 200 || res.status === 201) {
                handleDelete();
                alert("Route successfully uploaded");
                router.navigate("/record");
            }
        } catch (error: any) {
            alert(error);
        }

        setUploading(false);
    };

    const handleDelete = async () => {
        try {
            await FileSystem.deleteAsync(
                `${FileSystem.documentDirectory}${fileName}`
            );

            router.navigate("/record");
        } catch (error) {
            console.error("Error deleting file:", error);
        }
    };

    return route ? (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.headContainer}>
                <View>
                    <Text style={styles.routeTitle}>{parsedFileName}</Text>
                    <Text style={styles.distanceText}>{`${
                        route.distance
                    } meters | ${formatTime(
                        new Date(route.recordingEnd).getTime() -
                            new Date(route.recordingStart).getTime()
                    )}`}</Text>
                </View>

                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handleDelete}
                >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.mapContainer}>
                <CustomMapView dataEntries={route.data} userShown={false} />
            </View>

            <View style={styles.formContainer}>
                <ScrollView>
                    <TextInput
                        label="Title"
                        value={title}
                        onChangeText={setTitle}
                        autoCapitalize="none"
                    />

                    <TextInput
                        label="Your Weight"
                        keyboardType="numeric"
                        value={cyclistWeight?.toString() || ""}
                        onChangeText={(text) =>
                            setCyclistWeight(parseInt(text) || 0)
                        }
                    />

                    <TextInput
                        label="Bike Weight"
                        keyboardType="numeric"
                        value={bikeWeight?.toString() || ""}
                        onChangeText={(text) =>
                            setBikeWeight(parseInt(text) || 0)
                        }
                    />
                </ScrollView>
            </View>

            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={handleUpload}
                    disabled={uploading}
                >
                    <Text style={styles.uploadButtonText}>Upload</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    ) : (
        <Text>Loading file...</Text>
    );
};

const styles = StyleSheet.create({
    mainContainer: { flex: 1, color: CustomColors.dark },
    headContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
    },
    routeTitle: {
        fontSize: 24,
        textAlign: "center",
        fontWeight: "bold",
    },
    distanceText: {
        fontSize: 16,
        color: "#aaa",
        fontWeight: "bold",
        textTransform: "uppercase",
    },
    mapContainer: {
        flex: 4,
        borderColor: CustomColors.secondary,
        borderBottomWidth: 1,
        borderTopWidth: 1,
    },
    formContainer: {
        flex: 8,
    },
    buttonsContainer: {
        flex: 2,
        flexDirection: "row",
        justifyContent: "space-evenly",
    },
    deleteButton: {
        backgroundColor: CustomColors.secondary,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: CustomColors.superLight,
        fontWeight: "bold",
        fontSize: 16,
        textTransform: "uppercase",
    },
    uploadButton: {
        width: "80%",
        borderRadius: 15,
        backgroundColor: CustomColors.primary,
        height: 70,
        alignItems: "center",
        justifyContent: "center",
    },
    uploadButtonText: {
        fontSize: 20,
        marginVertical: 5,
        color: "#fff",
        fontWeight: "bold",
        textTransform: "uppercase",
    },
});

export default Upload;
