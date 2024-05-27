import { View } from "react-native";
import { Link, Redirect } from "expo-router";
import { useAuth } from "./auth/authContext";

export default function Index() {
  const { token, user } = useAuth();
  console.log(user);
  //const user = false;
  return (
    <View>
      {user ? (
        <Redirect href="/record" />
      ) : (
        <Redirect href="/auth" />
      )}
    </View>
  );
}
