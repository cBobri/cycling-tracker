import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../api/service";
import { Link, Redirect, useRouter } from "expo-router";

const useCheckForAuthRequest = () => {
  const [needsAuthentication, setNeedsAuthentication] = useState<
    boolean | null
  >(null);
  const [loading2, setLoading] = useState<boolean>(true);
  const [error2, setError] = useState<string | null>(null);
  const router = useRouter();

  const checkForAuth = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const res = await api.get("/auth/check");
        if (res.status === 200) {
          const { requestExists } = res.data;
          console.log("Ali obstaja zahteva: ", requestExists);
          setNeedsAuthentication(requestExists);
          console.log("Needs auth: ", needsAuthentication);
          if (requestExists) {
            alert("You need to verify your identity on a web page.");
            const mode = "2fa_web";
            router.replace({
              pathname: "/auth/2fa",
              params: { token, mode },
            });
          }
        } else {
          setNeedsAuthentication(false);
        }
      } else {
        setNeedsAuthentication(false);
        setError("No token found");
      }
    } catch (error) {
      setError("Failed to authenticate");
      setNeedsAuthentication(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkForAuth();
  }, []);

  return { needsAuthentication, loading2, error2 };
};

export default useCheckForAuthRequest;
