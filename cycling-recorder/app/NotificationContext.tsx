import React, { createContext, useEffect, ReactNode } from "react";
import * as Notifications from "expo-notifications";
import * as Linking from "expo-linking";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NotificationContext = createContext(null);

interface NotificationProviderProps {
    children: ReactNode;
}

const NotificationProvider = ({ children }: NotificationProviderProps) => {
    useEffect(() => {
        const registerPushNotifications = async () => {
            const { status: existingStatus } =
                await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== "granted") {
                const { status } =
                    await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== "granted") {
                console.log("Notification permission not granted");
                return;
            }

            const token = (await Notifications.getExpoPushTokenAsync()).data;
            console.log("Expo Push Token:", token);
            await AsyncStorage.setItem("expoPushToken", token);
            return token;
        };

        const handleNotificationResponse = (
            response: Notifications.NotificationResponse
        ) => {
            const url = response.notification.request.content.data.url;
            console.log("Handling notification response with URL:", url);
            if (url) {
                // Handle the URL appropriately
                Linking.openURL(url).catch((err) => {
                    console.error("Failed to open URL:", err);
                });
            }
        };

        const registerNotificationListener = () => {
            const subscription =
                Notifications.addNotificationResponseReceivedListener(
                    handleNotificationResponse
                );
            console.log("Notification response listener registered");
            return subscription;
        };

        registerPushNotifications().catch((err) => {
            console.error("Failed to register push notifications:", err);
        });

        const notificationSubscription = registerNotificationListener();

        return () => {
            console.log("Removing notification response listener");
            notificationSubscription.remove();
        };
    }, []);

    return (
        <NotificationContext.Provider value={null}>
            {children}
        </NotificationContext.Provider>
    );
};

export { NotificationProvider, NotificationContext };
