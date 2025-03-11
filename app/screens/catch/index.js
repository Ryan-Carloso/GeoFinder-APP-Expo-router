// Catch.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ImageBackground, 
  Alert,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StatusBar
} from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function Catch() {
  const [input1, setInput1] = useState('');
  const [code, setCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Animation values
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.9);
  
  // Function to generate code
  const generateCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$?';
    const length = 8;
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
  };

  // Save code to AsyncStorage
  const saveCodeToStorage = async (code) => {
    try {
      await AsyncStorage.setItem('@generatedCode', code);
    } catch (e) {
      console.error('Error saving code to AsyncStorage:', e);
    }
  };

  // Load code from AsyncStorage
  const loadCodeFromStorage = async () => {
    try {
      const savedCode = await AsyncStorage.getItem('@generatedCode');
      if (savedCode !== null) {
        setCode(savedCode);
        setShowCode(true);
        
        // Animate code display
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          })
        ]).start();
      }
    } catch (e) {
      console.error('Error loading code from AsyncStorage:', e);
    }
  };

  // Load saved code on component mount
  useEffect(() => {
    loadCodeFromStorage();
  }, []);

  // Handle code generation
  const handleGenerate = () => {
    setIsLoading(true);
    
    // Simulate a small delay for better UX
    setTimeout(() => {
      const generatedCode = generateCode();
      setCode(generatedCode);
      setShowCode(true);
      saveCodeToStorage(generatedCode);
      Clipboard.setString(generatedCode);
      
      // Animate code display
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        })
      ]).start();
      
      setIsLoading(false);
      Alert.alert('Success', 'Code generated and copied to clipboard!');
    }, 800);
  };

  // Handle copy to clipboard
  const handleCopyToClipboard = () => {
    Clipboard.setString(code);
    
    // Visual feedback animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start();
    
    Alert.alert('Copied!', 'The code has been copied to clipboard.');
  };

  // Handle save location
  const handleSave = async () => {
    if (!input1.trim()) {
      Alert.alert('Error', 'Please enter a name first.');
      return;
    }
    
    setIsSaving(true);
    
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to save your location.');
        setIsSaving(false);
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      
      const firebaseDatabaseUrl = 'https://geo-finder-7e641-default-rtdb.europe-west1.firebasedatabase.app/';
      const locationData = {
        name: input1,
        code: code,
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        timestamp: new Date().toISOString(),
      };

      await axios.put(`${firebaseDatabaseUrl}/users/${code}.json`, locationData);

      setInput1('');
      
      // Reset animations for next use
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
      
      setShowCode(false);
      setIsSaving(false);
      Alert.alert('Success', 'Your location has been saved successfully!');

    } catch (error) {
      console.error('Error getting or sending location:', error);
      setIsSaving(false);
      Alert.alert('Error', 'Failed to save location. Please try again.');
    }
  };

  return (
    <ImageBackground 
      source={require('../../../assets/backft.png')} 
      style={styles.backgroundImage}
      imageStyle={styles.backgroundImageStyle}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.overlay} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.card}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Location Tracker</Text>
            <View style={styles.headerUnderline} />
          </View>
          
          <View style={styles.inputContainer}>
            <MaterialIcons name="person" size={20} color="#4CAF50" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter a name"
              placeholderTextColor="#666"
              value={input1}
              onChangeText={(text) => setInput1(text)}
              keyboardType="default"
              maxLength={16}
            />
          </View>
          
          <TouchableOpacity
            style={styles.button}
            onPress={handleGenerate}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="code-working" size={18} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Generate Code</Text>
              </>
            )}
          </TouchableOpacity>

          {showCode && (
            <Animated.View 
              style={[
                styles.codeContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }]
                }
              ]}
            >
              <View style={styles.codeHeader}>
                <Text style={styles.codeHeaderText}>Your Unique Code</Text>
                <TouchableOpacity
                  style={styles.copyButton}
                  onPress={handleCopyToClipboard}
                >
                  <MaterialIcons name="content-copy" size={20} color="#4CAF50" />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.codeText}>{code}</Text>
              
              <View style={styles.codeDivider} />
              
              <Text style={styles.codeInfo}>
                This code will be used to identify your location. Share it with those who need to find you.
              </Text>
            </Animated.View>
          )}

          <TouchableOpacity
            style={[
              styles.saveButton,
              (!showCode || !input1.trim()) && styles.disabledButton
            ]}
            onPress={handleSave}
            disabled={!showCode || !input1.trim() || isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <FontAwesome5 name="map-marker-alt" size={18} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Save Location</Text>
              </>
            )}
          </TouchableOpacity>
          
          {!showCode && (
            <Text style={styles.instructionText}>
              Generate a code first to save your location
            </Text>
          )}
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImageStyle: {
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 20,
  },
  card: {
    width: width > 500 ? 500 : width * 0.9,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1D4801',
  },
  headerUnderline: {
    height: 3,
    width: 60,
    backgroundColor: '#4CAF50',
    marginTop: 8,
    borderRadius: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#333',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  codeContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  codeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  codeHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  copyButton: {
    padding: 5,
  },
  codeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    letterSpacing: 1,
    
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  codeDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  codeInfo: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
  saveButton: {
    backgroundColor: '#1D4801',
    borderRadius: 12,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#9E9E9E',
    opacity: 0.7,
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 15,
    fontStyle: 'italic',
  },
});