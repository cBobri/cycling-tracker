import { Text, View, StyleSheet } from "react-native";
import React from 'react';
import AccelerometerSensor from '../components/AccelerometerSensor';


export default function Index() {
  return (
    <View style={styles.container}>
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <AccelerometerSensor />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
