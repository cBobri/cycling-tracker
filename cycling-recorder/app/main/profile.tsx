import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Link } from "expo-router";
import Logout from "@/components/Logout";
import { useAuth } from "../auth/authContext";
import { api, setToken } from "../../api/service";
import useUserDetails from "../../hooks/GetUserDetails";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const Profile = () => {
  const router = useRouter();
  const { user, loading, error } = useUserDetails();
  const [weight, setWeight] = useState(
    user?.weight ? user.weight.toString() : ""
  );
  const [bikeWeight, setBikeWeight] = useState(
    user?.bikeWeight ? user.bikeWeight.toString() : ""
  );
  const [username, setUsername] = useState(user?.username || "");

  useEffect(() => {
    if (user) {
      setWeight(user.weight?.toString() || "");
      setBikeWeight(user.bikeWeight?.toString() || "");
      setUsername(user.username);
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      //console.log('user:::', user);
      const response = await api.put("users/profile", {
        username,
        weight,
        bikeWeight,
      });

      if (response.status === 200) {
        alert("Profile updated successfully");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error");
    }
  };
  const openVideoCapture = async () => {
    router.push({
      pathname: "/VideoCapture",
    });
  }
  const handleOpenVideoCapture = async () => {
    if (!user?.enabled_2fa) {
      openVideoCapture();
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Profile</Text>
      </View>

      <View style={styles.userTextContainer}>
        <Text style={styles.userText}>Hello {username}!</Text>
      </View>

      <View style={styles.mainContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.text}>Weight:</Text>
          <View style={styles.field}>
            <TextInput
              style={styles.inputWithUnit}
              placeholder="Your Weight"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />
            <Text style={styles.unit}>kg</Text>
          </View>
          <Text style={styles.text}>Bike Weight:</Text>
          <View style={styles.field}>
            <TextInput
              style={styles.inputWithUnit}
              placeholder="Bike Weight"
              value={bikeWeight}
              onChangeText={setBikeWeight}
              keyboardType="numeric"
            />
            <Text style={styles.unit}>kg</Text>
          </View>
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomContainer}>
          <Logout />
          <TouchableOpacity style={styles.enable2faButton} onPress={handleOpenVideoCapture}>
              <Text style={styles.buttonText}> {user?.enabled_2fa?'2fa enabled':'Enable 2fa'} </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    marginTop: 30,
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
  inputContainer: {
    padding: 16,
    marginVertical: "30%",
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
  },
  inputWithUnit: {
    flex: 1,
    padding: 12,
    borderWidth: 0,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  updateButton: {
    width: "100%",
    padding: 12,
    backgroundColor: "#124559",
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    color: "#007bff",
    fontSize: 16,
    marginTop: 20,
  },
  footer: {
    padding: 16,
  },
  text: {
    color: "black",
    fontSize: 16,
    marginBottom: 10,
  },
  userText: {
    fontSize: 30,
    fontWeight: "600",
  },
  userTextContainer: {
    padding: 16,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  unit: {
    fontSize: 16,
    marginLeft: 5,
    paddingRight: 5,
  },
  bottomContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  enable2faButton: {
    backgroundColor: 'green',
    color: 'white',
    padding: 10,
    cursor: 'pointer',
    borderRadius: 5,
  }
});

export default Profile;
