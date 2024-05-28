// AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import api from '../../api/service'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({ token: null, user: null });

    const fetchUserDetails = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const res = await api.get('/users/details');
                if (res.status === 200) {
                    setAuthState({ token, user: res.data });
                }
            }
        } catch (error) {
            console.log('Failed to fetch user details', error.response.data.error || error.message);
        }
    };

    useEffect(() => {
        fetchUserDetails();
    }, []);

    return (
        <AuthContext.Provider value={authState}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
