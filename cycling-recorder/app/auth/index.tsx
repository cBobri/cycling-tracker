import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, ImageBackground, Image } from "react-native";
import { Button } from "react-native-paper";
import { Link } from "expo-router";
import styles from "../../styles/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          router.replace("/main/record");
        } else {
          console.log("Token not found");
        }
      } catch (error) {
        console.error("Error fetching token", error);
      }
    };

    fetchToken();
  }, []);
  return (
    <View style={styles.mainContainer}>
      <ImageBackground
        source={require("../../assets/images/background.png")} // Your desired background image
        style={styles.topContainer}
        resizeMode="cover" // This ensures the background covers the entire container area
      >
        <Text style={styles.title}>Cycling Recorder</Text>
      </ImageBackground>
      <View style={styles.bottomContainer}>
        <Link href="/auth/Register" asChild style={styles.link}>
          <Button
            mode="contained"
            style={styles.button}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            Register
          </Button>
        </Link>
        <Link href="/auth/Login" asChild>
          <Button
            mode="contained"
            style={styles.button}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            Login
          </Button>
        </Link>
      </View>
    </View>
  );
};

export default Index;
