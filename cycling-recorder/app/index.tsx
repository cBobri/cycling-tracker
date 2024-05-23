import { View } from 'react-native';
import { Link } from 'expo-router';

export default function Index() {
  return (
    <View>
      <Link href="/auth">Auth index</Link>
      <Link href="/record">Record</Link>
    </View>
  );
}