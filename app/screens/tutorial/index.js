import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Tutorial() {
  const router = useRouter();

  const handleOptionSelect1 = () => {
    router.push('screens/catch');
  };

  const handleOptionSelect = () => {
    router.push('screens/Find');
  };

  return (
    <ImageBackground source={require('../../../assets/backft.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
  
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>
            Ensuring Safety & Locating Loved Ones
          </Text>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.descriptionText}>
            Your spouse, children, or anyone important to you!
          </Text>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.instructionText}>
            1 - First, download the app on the phone you want to track and click "Generate code".
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleOptionSelect1}
        >
          <Text style={styles.buttonText}>
            Generate code
          </Text>
        </TouchableOpacity>

        <View style={styles.textContainer}>
          <Text style={styles.instructionText}>
            2 - Next, download the app on another phone to track the first phone and click "Find location" to enter the code you just generated.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleOptionSelect}
        >
          <Text style={styles.buttonText}>
            Find location!
          </Text>
        </TouchableOpacity>

        <View style={styles.textContainer}>
          <Text style={styles.instructionText}>
            That's all you need to do to always be in touch with your loved ones!
          </Text>
        </View>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
  },
  textContainer: {
    backgroundColor: 'rgba(29, 72, 1, 0.8)',
    padding: 5,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center', // To center the text inside the container
    width: '90%', // Adjust the width to fit within the screen
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 19,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',

  },
  instructionText: {
    fontSize: 17,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',

  },
  button: {
    backgroundColor: '#388b02',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});
