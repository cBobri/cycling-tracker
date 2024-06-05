import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { TextInput, Button } from "react-native-paper";
import authStyles from "../../styles/authStyle";
import axios from "axios";
import { useRouter } from "expo-router";
import { api, setToken } from "../../api/service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

const Login = () => {
    const [email_username, setEmail_Username] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const registerPushNotifications = async () => {
        const { status: existingStatus } =
            await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== "granted") {
            return;
        }

        const token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
        return token;
    };

    const handleNotification = (notification: any) => {
        console.log(notification);
    };

    const handleLogin = async () => {
        if (email_username === "" || password === "") {
            alert("Please fill all the fields");
            return;
        }

        try {
            const client_token = await registerPushNotifications();

            if (client_token) {
                Notifications.addNotificationReceivedListener(
                    handleNotification
                );
            }

            const res = await api.post("/users/login", {
                email_username: email_username.trim(),
                password,
                client_token,
            });

            if (res.status === 200) {
                const { token, user } = res.data;
                console.log("user", user);
                //check if user has 2fa enabled
                if (user.enabled_2fa) {
                    router.replace({
                        pathname: "/auth/2fa",
                        params: { token },
                    });
                } else {
                    // No 2FA, proceed with setting the token
                    await setToken(token);
                    alert("User logged in successfully");
                    router.replace("/main/record");
                }
            }
        } catch (error: any) {
            if (error.response.status === 401) {
                alert("User not found");
            } else if (error.response.status === 402) {
                alert("Incorrect password");
            } else {
                alert("An error occurred");
            }
        }
    };

    return (
        <View style={authStyles.container}>
            <TextInput
                label="Email or Username"
                value={email_username}
                onChangeText={setEmail_Username}
                style={authStyles.input}
                autoCapitalize="none"
                theme={{ roundness: 10 }}
            />
            <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                style={authStyles.input}
                secureTextEntry
                theme={{ roundness: 10 }}
            />
            <Button
                mode="contained"
                onPress={handleLogin}
                style={authStyles.button}
            >
                <Text style={authStyles.buttonText}>Login</Text>
            </Button>
        </View>
    );
};

export default Login;
