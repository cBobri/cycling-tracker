import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import authStyles from '../../styles/authStyle';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () =>{
        if(username === '' || password === ''){
            alert('Please fill all the fields');
            return;
        }
        const res = await axios.post('http://192.168.31.210:5000/users/login', {
            username,
            password,
        });
        if(res.status === 200){
            const { token } = res.data;
            await AsyncStorage.setItem('token', token);
            alert('User logged in successfully');
        }
        
    };

    return (
        <View style={authStyles.container}>
            <TextInput
                label = "Username"
                value = {username}
                onChangeText = {setUsername}
                style = {authStyles.input}
                autoCapitalize='none'
                theme={{ roundness: 10 }}
            />
            <TextInput
                label= "Password"
                value = {password}
                onChangeText = {setPassword}
                style = {authStyles.input}
                secureTextEntry
                theme={{ roundness: 10 }}
            />
            <Button mode="contained" onPress={handleLogin} style={authStyles.button}>
                <Text style={authStyles.buttonText}>Login</Text>
            </Button>
        </View>

    )
    
    
    ;
}

export default Login;