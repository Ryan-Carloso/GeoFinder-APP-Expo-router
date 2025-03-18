"use client"

import { useEffect, useRef } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  ScrollView,
  Dimensions,
  StatusBar,
  Animated,
  Platform,
} from "react-native"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { Feather, MaterialIcons } from "@expo/vector-icons"

const { width, height } = Dimensions.get("window")

export default function Tutorial() {
  const router = useRouter()

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim1 = useRef(new Animated.Value(50)).current
  const slideAnim2 = useRef(new Animated.Value(50)).current
  const slideAnim3 = useRef(new Animated.Value(50)).current

  useEffect(() => {
    // Staggered animations for a more engaging experience
    Animated.sequence([
      // Fade in the entire content
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),

      // Animate each section with a slight delay
      Animated.stagger(150, [
        Animated.timing(slideAnim1, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim2, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim3, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start()
  }, [])

  const handleGenerateCode = () => {
    router.push("screens/catch")
  }

  const handleFindLocation = () => {
    router.push("screens/Find")
  }

  return (
    <ImageBackground
      source={require("../../../assets/backft.png")}
      style={styles.backgroundImage}
      imageStyle={styles.backgroundImageStyle}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Gradient overlay for better readability */}
      <LinearGradient colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.7)"]} style={styles.overlay} />

      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.titleText}>Ensuring Safety & Locating Loved Ones</Text>
            <Text style={styles.descriptionText}>
              Stay connected with your spouse, children, and everyone important to you
            </Text>
          </View>

          {/* Step 1 */}
          <Animated.View style={[styles.stepContainer, { transform: [{ translateY: slideAnim1 }] }]}>
            <View style={styles.stepNumberContainer}>
              <Text style={styles.stepNumber}>1</Text>
            </View>

            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Generate a tracking code</Text>
              <Text style={styles.instructionText}>
                First, download the app on the phone you want to track and generate a unique code.
              </Text>

              <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={handleGenerateCode}>
                <LinearGradient
                  colors={["#4CAF50", "#388E3C"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>Generate Code</Text>
                  <Feather name="key" size={20} color="white" style={styles.buttonIcon} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Step 2 */}
          <Animated.View style={[styles.stepContainer, { transform: [{ translateY: slideAnim2 }] }]}>
            <View style={styles.stepNumberContainer}>
              <Text style={styles.stepNumber}>2</Text>
            </View>

            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Track the location</Text>
              <Text style={styles.instructionText}>
                Next, download the app on another phone and enter the generated code to track the first device.
              </Text>

              <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={handleFindLocation}>
                <LinearGradient
                  colors={["#4CAF50", "#388E3C"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>Find Location</Text>
                  <MaterialIcons name="location-searching" size={20} color="white" style={styles.buttonIcon} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Final Step */}
          <Animated.View style={[styles.finalStepContainer, { transform: [{ translateY: slideAnim3 }] }]}>
            <LinearGradient
              colors={["rgba(29, 72, 1, 0.8)", "rgba(40, 100, 10, 0.8)"]}
              style={styles.finalStepGradient}
            >
              <MaterialIcons name="check-circle" size={40} color="#FFFFFF" style={styles.checkIcon} />
              <Text style={styles.finalStepText}>
                That's all you need to do to always stay connected with your loved ones!
              </Text>
            </LinearGradient>
          </Animated.View>

          {/* Additional info */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              This app helps you ensure the safety of your family members by providing real-time location tracking.
            </Text>
          </View>
        </ScrollView>
      </Animated.View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  backgroundImageStyle: {
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: "center",
  },
  header: {
    width: "100%",
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: "rgba(29, 72, 1, 0.85)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  titleText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 12,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  descriptionText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 22,
  },
  stepContainer: {
    width: "100%",
    flexDirection: "row",
    marginBottom: 25,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  stepNumberContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  stepNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 15,
    lineHeight: 22,
  },
  button: {
    alignSelf: "flex-start",
    borderRadius: 25,
    overflow: "hidden",
    marginTop: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  buttonIcon: {
    marginLeft: 10,
  },
  finalStepContainer: {
    width: "100%",
    marginVertical: 20,
    borderRadius: 16,
    overflow: "hidden",
  },
  finalStepGradient: {
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 16,
  },
  checkIcon: {
    marginBottom: 10,
  },
  finalStepText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    lineHeight: 24,
  },
  infoContainer: {
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
  },
  infoText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    lineHeight: 20,
  },
})

