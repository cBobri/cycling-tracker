import { View } from "react-native";
import { Link, Redirect, useRouter } from "expo-router";
import { useAuth } from "./auth/authContext";
import useUserDetails from "@/hooks/GetUserDetails";
import useCheckForAuthRequest from "@/hooks/CheckForAuthRequest";

export default function Index() {
  const { user, loading, error, token } = useUserDetails();
  const { needsAuthentication, loading2, error2 } = useCheckForAuthRequest();
  const router = useRouter();
  console.log(user);

  return (
    <View>
      {user ? (
        <Redirect href="/main/record" />
      ) : (
        // <Redirect href="/map" />
        <Redirect href="/auth" />
        // <Redirect href="/record"/>
      )}
    </View>
  );
}
