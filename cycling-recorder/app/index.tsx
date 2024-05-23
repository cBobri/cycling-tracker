import { View } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from './auth/authContext';

export default function Index() {
  const { token, user } = useAuth();
  console.log(user);
  return (
    <View>
      {user ? (
        <Link href="/record">Record</Link>
      ) : (
        <Link href="/auth">Auth index</Link>
      )}
    </View>
  );
}