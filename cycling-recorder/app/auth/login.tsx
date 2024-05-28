import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import authStyles from '../../styles/authStyle';
import axios from 'axios';
import { useRouter } from 'expo-router';
import api, { setToken } from '../../api/service';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async () =>{
        if(username === '' || password === ''){
            alert('Please fill all the fields');
            return;
        }
        try{
            const res = await api.post('/users/login', {
                username,
                password,
            });
            if(res.status === 200){
                const { token } = res.data;
                await setToken(token);
                alert('User logged in successfully');
                router.replace('/map');
            }
        }catch(error: any){
            if(error.response.status === 401){
                alert('User not found');
            }else if(error.response.status === 402){
                alert('Incorrect password');
            }
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