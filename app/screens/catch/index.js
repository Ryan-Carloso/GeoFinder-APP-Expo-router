"use client"

import { useState, useEffect, useRef } from "react"
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
  StatusBar,
} from "react-native"
import axios from "axios"
import * as Location from "expo-location"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Clipboard from "expo-clipboard"
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons"

const { width } = Dimensions.get("window")

export default function Catch() {
  const [input1, setInput1] = useState("")
  const [code, setCode] = useState("")
  const [showCode, setShowCode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.9)).current
  const buttonScaleAnim = useRef(new Animated.Value(1)).current

  // Function to generate code
  const generateCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$?"
    const length = 8
    let result = ""
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length)
      result += characters.charAt(randomIndex)
    }
    return result
  }

  // Save code and name to AsyncStorage
  const saveToStorage = async (code, name) => {
    try {
      await AsyncStorage.setItem('@generatedCode', code);
      await AsyncStorage.setItem('@userName', name);
    } catch (e) {
      console.error('Error saving data to AsyncStorage:', e);
    }
  };

  // Load code and name from AsyncStorage
  const loadFromStorage = async () => {
    try {
      const [savedCode, savedName] = await Promise.all([
        AsyncStorage.getItem('@generatedCode'),
        AsyncStorage.getItem('@userName')
      ]);
      
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
          }),
        ]).start();
      }
      
      if (savedName !== null) {
        setInput1(savedName);
      }
    } catch (e) {
      console.error('Error loading data from AsyncStorage:', e);
    }
  };

  // Update useEffect to use new loading function
  useEffect(() => {
    loadFromStorage();
  }, []);

  // Update handleGenerateAndSave to use new saving function
  const handleGenerateAndSave = async () => {
    if (!input1.trim()) {
      Alert.alert('Error', 'Please enter a name first.');
      return;
    }

    setIsLoading(true);

    // Button press animation
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start()

    try {
      // Generate code first
      const generatedCode = generateCode()
      setCode(generatedCode)
      setShowCode(true)
      await saveToStorage(generatedCode, input1);
      Clipboard.setString(generatedCode)

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
        }),
      ]).start()

      // Then get location permission
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        setIsLoading(false)
        Alert.alert("Permission Denied", "Location permission is required to save your location.")
        return
      }

      // Get current location
      const userLocation = await Location.getCurrentPositionAsync({})

      // Save to Supabase
      const supabaseUrl = "https://zvxmeplxgwysaqiaibvh.supabase.co"
      const supabaseKey =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eG1lcGx4Z3d5c2FxaWFpYnZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMDUzMDMsImV4cCI6MjA1Nzg4MTMwM30.NMVYAimnYpkdmqYsGvyhwE5p2Mwy7-soN_UnzUBBRjs"

      const locationData = {
        name: input1,
        code: generatedCode,
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        created_at: new Date().toISOString(),
      }

      await axios.post(`${supabaseUrl}/rest/v1/locations`, locationData, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
      })

      setIsLoading(false)
      Alert.alert("Success", "Code generated and location saved successfully!")
    } catch (error) {
      console.error("Error in generate and save process:", error)
      setIsLoading(false)
      Alert.alert("Error", "Failed to complete the operation. Please try again.")
    }
  }

  return (
    <ImageBackground
      source={require("../../../assets/backft.png")}
      style={styles.backgroundImage}
      imageStyle={styles.backgroundImageStyle}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.overlay} />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
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

          {showCode && (
            <Animated.View
              style={[
                styles.codeContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <View style={styles.codeHeader}>
                <Text style={styles.codeHeaderText}>Your Unique Code</Text>
                <TouchableOpacity style={styles.copyButton} onPress={handleCopyToClipboard}>
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

          <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
            <TouchableOpacity
              style={styles.combinedButton}
              onPress={handleGenerateAndSave}
              disabled={isLoading || !input1.trim()}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <FontAwesome5 name="map-marker-alt" size={18} color="#fff" style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>Generate & Save Location</Text>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>

          <Text style={styles.instructionText}>
            {!input1.trim()
              ? "Enter a name to generate a code and save your location"
              : "Click the button to generate a code and save your location"}
          </Text>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImageStyle: {
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 20,
  },
  card: {
    width: width > 500 ? 500 : width * 0.9,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
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
    alignItems: "center",
    marginBottom: 25,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1D4801",
  },
  headerUnderline: {
    height: 3,
    width: 60,
    backgroundColor: "#4CAF50",
    marginTop: 8,
    borderRadius: 2,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: "#333",
    fontSize: 16,
  },
  combinedButton: {
    backgroundColor: "#1D4801",
    borderRadius: 12,
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 15,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  codeContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  codeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  codeHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  copyButton: {
    padding: 5,
  },
  codeText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    letterSpacing: 1,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  codeDivider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 12,
  },
  codeInfo: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    lineHeight: 18,
  },
  instructionText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
    fontStyle: "italic",
  },
})


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
      }),
    ]).start();

    Alert.alert("Copied!", "The code has been copied to clipboard.");
  };

