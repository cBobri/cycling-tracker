import { View, Text } from 'react-native';
import React, { useState } from 'react';
import { TextInput, Button } from 'react-native-paper';
import authStyles from '../../styles/authStyle';
import axios from 'axios';
import { useRouter } from 'expo-router';
import {api} from '../../api/service';


const Register = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const router = useRouter();

    const handleRegister =  async () => {
        if (email === '' || username === '' || password === '') {
            alert('Please fill all the fields');
            return;
        }
        if (password !== passwordRepeat) {
          alert("Passwords don't match");
          return;
        }
        try{
          const res = await api.post('/users/register', {
            email,
            username,
            password,
            passwordRepeat,
          });
          if (res.status === 200) {
            alert('User registered successfully');
            router.push('/auth/Login');
          }
        } catch (error: any) {
          if(error.response.status === 401){
            alert("Passwords don't match!");
          }else if(error.response.status === 402){
            alert('Email is already taken');
          }else if(error.response.status === 403){
            alert('Username is already taken');
          }
        }
    };
    return (
        <View style={authStyles.container}>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={authStyles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            theme={{ roundness: 10 }}
          />
          <TextInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            style={authStyles.input}
            autoCapitalize="none"
            theme={{ roundness: 10 }}
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            style={authStyles.input}
            secureTextEntry
            theme={{ roundness: 10 }}
          />
          <TextInput
            label="Repeat password"
            value={passwordRepeat}
            onChangeText={setPasswordRepeat}
            style={authStyles.input}
            secureTextEntry
            theme={{ roundness: 10 }}
          />
          <Button mode="contained" onPress={handleRegister} style={authStyles.button}>
            <Text style={authStyles.buttonText}>Register</Text>
          </Button>
        </View>
      );

}

export default Register;