import { View, Text } from 'react-native';
import React, { useState } from 'react';
import { TextInput, Button } from 'react-native-paper';
import authStyles from '../../styles/authStyle';
import axios from 'axios';


const Register = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister =  async () => {
        if (email === '' || username === '' || password === '') {
            alert('Please fill all the fields');
            return;
        }
        const res = await axios.post('http://192.168.31.210:8081/users/register', {
            email,
            username,
            password,
        });
        if (res.data.error) {
            alert(res.data.error);
            return;
        }
        if (res.status === 200) {
            alert('User registered successfully');
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
          <Button mode="contained" onPress={handleRegister} style={authStyles.button}>
            <Text style={authStyles.buttonText}>Register</Text>
          </Button>
        </View>
      );

}

export default Register;