// HomeScreen.js
import React from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import LinkButton from './screens/home/LinkButton';
import SocialMedia from './screens/home/social';


export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('../assets/backft.png')} 
        style={styles.backgroundImage}
      >
        <View style={styles.innerContainer}>
          <View style={styles.textcontainer}>
            <Text style={styles.title}>Welcome Home</Text>
          </View>
          <View style={styles.textcontainer}>
            <Text style={styles.tutorialtitle}>Choose an option:</Text>
          </View>

            <LinkButton/>

          <View style={styles.textcontainer}>
            <Text style={styles.inputxt4}>Click Above for a tutorial on</Text>
            <Text style={styles.inputxt4}>how to use the App!</Text>
          </View>
          <SocialMedia/>
        </View>
        
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
  },
  tutorialtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  textcontainer: {
    backgroundColor: 'rgba(29, 72, 1, 0.7)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  inputxt4: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
