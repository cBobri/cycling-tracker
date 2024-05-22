import React from 'react';
import { View, Button, StyleSheet} from 'react-native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

const AuthScreen = ({ navigation }: { navigation: NavigationProp<ParamListBase> }) => {
  return (
    <View style={styles.container}>
      <Button title="Login" onPress={() => navigation.navigate('Login')} />
      <Button title="Register" onPress={() => navigation.navigate('Register')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AuthScreen;