import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Image, Linking } from 'react-native';
import { styles } from '../Styles';

export default function HomeScreen({ navigation }) {
  return (
    <ImageBackground source={require('../assets/backft.png')} style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.tutorialtitle}>Choose an option:</Text>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => handleOptionSelect(1)}
        >
          <Text style={styles.optionButtonText}>Find location!</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => handleOptionSelect1()}
        >
          <Text style={styles.optionButtonText}>Generate code</Text>
        </TouchableOpacity>

        {/* New button for the tutorial */}
        <TouchableOpacity
          style={[styles.optionButton, { backgroundColor: 'blue' }]}
          onPress={handleOptionSelect3}
        >
          <Text style={styles.optionButtonText}>Tutorial</Text>
        </TouchableOpacity>
        <Text style={styles.inputxt4}>Click Above for a tutorial on</Text>
        <Text style={styles.inputxt4}>how to use the App!</Text>


      </View>
    </ImageBackground>
  );
}
