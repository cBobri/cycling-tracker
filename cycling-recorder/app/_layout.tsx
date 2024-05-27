import { Stack } from "expo-router";
import { AuthProvider } from "./auth/authContext";

export default function Layout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "tomato",
          },
          headerTintColor: "#fff",
        }}
      >
        <Stack.Screen name="auth" options={{headerShown:false}}/>
        <Stack.Screen name="record" options={{headerShown:false}}/>
      </Stack>
    </AuthProvider>
  );
}
