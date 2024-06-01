import React, { useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Link} from "expo-router";


const Profile = () => {

  return (
    <View style={styles.container}>
      <Text>Profile</Text>
        <Link push href="/VideoCapture">Enable 2fa</Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Profile;