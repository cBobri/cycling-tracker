import React, { createContext, useEffect, ReactNode } from "react";
import * as Notifications from "expo-notifications";
import * as Linking from "expo-linking";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import useCheckForAuthRequest from "@/hooks/CheckForAuthRequest";

const NotificationContext = createContext(null);

interface NotificationProviderProps {
  children: ReactNode;
}

const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const router = useRouter();
  useEffect(() => {
    const registerPushNotifications = async () => {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
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
    const registerNotificationReceivedListener = () => {
      return Notifications.addNotificationReceivedListener(
        async (notification) => {
          console.log("Notification received in foreground:", notification);
          // Optionally handle the notification (e.g., display an in-app alert)
          alert(notification.request.content.title);
          const token = await AsyncStorage.getItem("token");
          const mode = "2fa_web";
          router.push({
            pathname: "/auth/2fa",
            params: { token, mode },
          });
        }
      );
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
    const notificationReceivedSubscription =
      registerNotificationReceivedListener();

    return () => {
      console.log("Removing notification response listener");
      notificationSubscription.remove();
      notificationReceivedSubscription.remove();
    };
  }, []);

  return (
    <NotificationContext.Provider value={null}>
      {children}
    </NotificationContext.Provider>
  );
};

export { NotificationProvider, NotificationContext };
