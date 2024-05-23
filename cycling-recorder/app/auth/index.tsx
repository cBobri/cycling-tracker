import { View } from 'react-native';
import { Link } from 'expo-router';


const Record = () => {
  return (
    <View>
      <Link href="/auth/login">Login</Link>
      <Link href="/auth/register">Register</Link>
    </View>
  );
}

export default Record;
