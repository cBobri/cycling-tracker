import { Stack } from "expo-router";
import { AuthProvider } from "./auth/authContext";
//import { LocationProvider } from "./locationContext";

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
        <Stack.Screen name="main" options={{headerShown:false}}/>
        {/* <Stack.Screen name="map" options={{headerShown:false}}/>
        <Stack.Screen name="record" options={{headerShown:false}}/> */}
      </Stack>
    </AuthProvider>
  );
}
