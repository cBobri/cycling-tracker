import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView } from "react-native";
import { Link} from "expo-router";
import Logout from "@/components/Logout";
import { useAuth } from "../auth/authContext";
import { api, setToken } from "../../api/service";
import useUserDetails from '../../hooks/GetUserDetails';


const Profile = () => {
  const { user, loading, error } = useUserDetails();
  const [weight, setWeight] = useState(user?.weight ? user.weight.toString() : '');
  const [bikeWeight, setBikeWeight] = useState(user?.bikeWeight ? user.bikeWeight.toString() : '');
  const [username, setUsername] = useState(user?.username || '');

  useEffect(() => {
    if (user) {
      setWeight(user.weight?.toString() || '');
      setBikeWeight(user.bikeWeight?.toString() || '');
      setUsername(user.username);
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      //console.log('user:::', user); 
      const response = await api.put('users/profile', {
        username,
        weight,
        bikeWeight,
      });

      if (response.status === 200) {
        alert('Profile updated successfully');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Profile</Text>
      </View>

      
      <View style={styles.inputContainer}>
        <Text style={styles.text}>Weight:</Text>
        <TextInput
          style={styles.input}
          placeholder="Your Weight"
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
        />
        <Text style={styles.text}>Bike Weight:</Text>
        <TextInput
          style={styles.input}
          placeholder="Bike Weight"
          value={bikeWeight}
          onChangeText={setBikeWeight}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
        <Link style={styles.link} push href="/VideoCapture">
          Enable 2FA
        </Link>
      </View>

      <View style={styles.footer}>
        <Logout />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
    textAlign: "center",
  },
  updateButton: {
    width: "100%",
    padding: 12,
    backgroundColor: "#007bff",
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
  text:{
    color: "black",
    fontSize: 16,
    marginBottom: 10,
  }
});

export default Profile;