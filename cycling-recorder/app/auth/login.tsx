import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import authStyles from '../../styles/authStyle';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () =>{
        
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