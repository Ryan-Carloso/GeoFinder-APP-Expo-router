"use client"

import { useEffect, useRef } from "react"
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Animated,
  Dimensions,
  TouchableOpacity,
  Platform,
} from "react-native"
import { BlurView } from "expo-blur"
import { LinearGradient } from "expo-linear-gradient"
import LinkButton from "./screens/home/LinkButton"
import SocialMedia from "./screens/home/social"
import { useFonts } from "expo-font"

const { width, height } = Dimensions.get("window")

export default function HomeScreen() {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current
  const scaleAnim = useRef(new Animated.Value(0.95)).current
  const titleFade = useRef(new Animated.Value(0)).current
  const cardFade = useRef(new Animated.Value(0)).current
  const socialFade = useRef(new Animated.Value(0)).current

  // Load custom fonts
  const [fontsLoaded] = useFonts({
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
    "Montserrat-Medium": require("../assets/fonts/Montserrat-Medium.ttf"),
  })

  useEffect(() => {
    // Staggered animations for a more polished feel
    Animated.sequence([
      // First animate the title
      Animated.timing(titleFade, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),

      // Then animate the card with multiple properties
      Animated.parallel([
        Animated.timing(cardFade, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),

      // Finally animate the social media section
      Animated.timing(socialFade, {
        toValue: 1,
        duration: 500,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  if (!fontsLoaded) {
    return null // Or a loading screen
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ImageBackground
        source={require("../assets/backft.png")}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      >
        <LinearGradient colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.4)", "rgba(0,0,0,0.7)"]} style={styles.overlay} />

        <View style={styles.contentContainer}>
          {/* Header Section */}
          <Animated.View style={[styles.headerContainer, { opacity: titleFade }]}>
            <Text style={styles.title}>Welcome Home</Text>
            <View style={styles.titleUnderlineContainer}>
              <View style={styles.titleUnderline} />
              <View style={styles.titleUnderlineAccent} />
            </View>
          </Animated.View>

          {/* Card Section */}
          <Animated.View
            style={[
              styles.cardContainer,
              {
                opacity: cardFade,
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
              },
            ]}
          >
            <BlurView intensity={80} tint="dark" style={styles.cardBlur}>
              <LinearGradient
                colors={["rgba(29, 72, 1, 0.9)", "rgba(40, 100, 10, 0.85)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
              >
                <Text style={styles.tutorialTitle}>Choose an option</Text>

                <View style={styles.buttonContainer}>
                  <LinkButton />
                </View>

                <View style={styles.instructionContainer}>
                  <Text style={styles.instructionText}>Click Above for a tutorial on how to use the App!</Text>
                </View>

                <TouchableOpacity style={styles.exploreButton}>
                  <Text style={styles.exploreButtonText}>Explore More</Text>
                </TouchableOpacity>
              </LinearGradient>
            </BlurView>
          </Animated.View>

          {/* Social Media Section */}
          <Animated.View style={[styles.socialContainer, { opacity: socialFade }]}>
            <SocialMedia />
            <Text style={styles.versionText}>Version 1.0.2</Text>
          </Animated.View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
  },
  backgroundImageStyle: {
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 60 : 80,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 42,
    fontFamily: "Montserrat-Bold",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    letterSpacing: 1.2,
  },
  titleUnderlineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  titleUnderline: {
    height: 3,
    width: 80,
    backgroundColor: "#4CAF50",
    borderRadius: 2,
  },
  titleUnderlineAccent: {
    height: 3,
    width: 30,
    backgroundColor: "#8BC34A",
    borderRadius: 2,
    marginLeft: 5,
  },
  cardContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  cardBlur: {
    borderRadius: 24,
    overflow: "hidden",
    width: width * 0.9,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  card: {
    width: "100%",
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  tutorialTitle: {
    fontSize: 28,
    fontFamily: "Montserrat-Bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 25,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  buttonContainer: {
    marginVertical: 25,
  },
  instructionContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    padding: 18,
    borderRadius: 16,
    marginTop: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  instructionText: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "Montserrat-Medium",
    textAlign: "center",
    lineHeight: 24,
  },
  exploreButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 25,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  exploreButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Montserrat-Bold",
    letterSpacing: 0.5,
  },
  socialContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  versionText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
    marginTop: 15,
    fontFamily: "Montserrat-Medium",
  },
})

