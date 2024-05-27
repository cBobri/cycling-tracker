import React from 'react';
import { View, Image, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { Link } from 'expo-router';
import styles from '../../styles/styles';


const Index = () => {
    return (
        <View style={styles.mainContainer}>
          <View style={styles.topContainer}>
            
            <Image
                source={require('../../assets/images/authArt.png')}
                style={styles.image}
            />
            <Text style={styles.title}>Cycling Recorder</Text>
            
          </View>
          <View style={styles.bottomContainer}>
            <Link href="/auth/Register" asChild style={styles.link}>
              <Button
                mode="contained"
                style={styles.button}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
              >
                Register
              </Button>
            </Link>
            <Link href="/auth/Login" asChild>
              <Button
                mode="contained"
                style={styles.button}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
              >
                Login
              </Button>
            </Link>
          </View>
        </View>
      );
}

export default Index;
