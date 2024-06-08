import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const Logout = () => {
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      router.replace({
        pathname: "auth",
      });
    } catch (error) {
      console.error("Error removing token:", error);
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutButton: {
    backgroundColor: "red",
    color: "white",
    padding: 10,
    marginRight: 10,
    cursor: "pointer",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  },
});

export default Logout;
