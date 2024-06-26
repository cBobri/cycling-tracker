import { Stack, Tabs } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#124559",
        },
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="Login" options={{ headerShown: true }} />
      <Stack.Screen name="Register" options={{ headerShown: true }} />
    </Stack>
  );
}
