import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api/service';

interface User {
  username: string;
  weight?: number;
  bikeWeight?: number;
  email: string;
  enabled_2fa: boolean;
}

const useUserDetails = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const res = await api.get('/users/details');
        if (res.status === 200) {
          setUser(res.data as User);
          setToken(token);
        } else {
          setError('Failed to fetch user details');
        }
      } else {
        setError('No token found');
      }
    } catch (error) {
      setError('Failed to fetch user details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return { user, token, loading, error };
};

export default useUserDetails;
