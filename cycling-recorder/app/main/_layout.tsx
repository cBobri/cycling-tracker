import React from "react";
import { Tabs } from "expo-router";
import { Text } from 'react-native';

export default function Layout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: () => null, // Hide icons
        tabBarLabel: ({ focused, color }) => {
          let label;
          if (route.name === "record") {
            label = "Record";
          } else if (route.name === "profile") {
            label = "Profile";
          }
          return <Text style={{ color }}>{label}</Text>;
        },
        tabBarLabelPosition: "beside-icon", // Ensure label is displayed properly
      })}
    >
      <Tabs.Screen name="record" options={{ headerShown: false }} />
      <Tabs.Screen name="profile" options={{ headerShown: false }} />
    </Tabs>
  );
}
