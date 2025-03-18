"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native"
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"
import * as Location from "expo-location"
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Feather, MaterialIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { BlurView } from "expo-blur"

const { width, height } = Dimensions.get("window")

const MainComponent = () => {
  const [location, setLocation] = useState(null)
  const [name, setName] = useState("")
  const [seunomename, setSeunomename] = useState("")
  const [showMap, setShowMap] = useState(false)
  const [userMarker, setUserMarker] = useState(null)
  const [firebaseMarker, setFirebaseMarker] = useState(null)
  const [lastClickTime, setLastClickTime] = useState(null)
  const [loading, setLoading] = useState(false)
  const [code, setCode] = useState("")
  const [region, setRegion] = useState({
    latitude: -23.5505, // Default to São Paulo
    longitude: -46.6333,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })

  // Load saved data on component mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedData = await AsyncStorage.getItem("savedData")
        if (savedData) {
          const { name: savedName, seunomename: savedSeunomename } = JSON.parse(savedData)
          setName(savedName)
          setSeunomename(savedSeunomename)
        }
      } catch (error) {
        console.error("Error loading saved data:", error)
      }
    }

    loadSavedData()
    getUserLocation()
  }, [])

  // Get user's current location
  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        Alert.alert("Location Permission", "We need location permission to show your position on the map.", [
          { text: "OK" },
        ])
        return
      }

      const userLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      })

      setLocation(userLocation)
      setUserMarker({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
      })

      setRegion({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      })
    } catch (error) {
      console.error("Location error:", error)
      Alert.alert("Error", "Could not get your location. Please check your device settings.")
    }
  }

  // Handle search button press
  const handleShowMap = async (event) => {
    event.persist()

    const currentTime = new Date().getTime()

    // Use cached data if less than an hour old
    if (lastClickTime && currentTime - lastClickTime < 3600000) {
      setShowMap(true)
      return
    }

    // Validate code
    if (!code || code.length !== 8) {
      Alert.alert("Required Field", "Please enter a valid 8-character code.")
      return
    }

    // Save data to AsyncStorage
    try {
      await AsyncStorage.setItem("savedData", JSON.stringify({ name, seunomename }))
    } catch (error) {
      console.error("AsyncStorage error:", error)
    }

    setLoading(true)

    // Supabase credentials
    const supabaseUrl = "https://zvxmeplxgwysaqiaibvh.supabase.co"
    const supabaseKey =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eG1lcGx4Z3d5c2FxaWFpYnZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMDUzMDMsImV4cCI6MjA1Nzg4MTMwM30.NMVYAimnYpkdmqYsGvyhwE5p2Mwy7-soN_UnzUBBRjs"

    try {
      // Fetch location data from Supabase
      const response = await axios.get(`${supabaseUrl}/rest/v1/locations?code=eq.${code}&select=*`, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      })

      if (response.data && response.data.length > 0) {
        const locationData = response.data[0]
        const { latitude, longitude, name, code } = locationData

        setFirebaseMarker({
          latitude: Number.parseFloat(latitude),
          longitude: Number.parseFloat(longitude),
          name: name || "Unknown",
          code: code || "Unknown",
        })

        setRegion({
          latitude: Number.parseFloat(latitude),
          longitude: Number.parseFloat(longitude),
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        })

        setShowMap(true)
        setLastClickTime(currentTime)
      } else {
        Alert.alert("User Not Found", "No location found for the specified code.")
      }
    } catch (error) {
      console.error("Supabase request error:", error)
      Alert.alert("Error", "Failed to fetch location data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Map control functions
  const handleBack = () => setShowMap(false)

  const handleZoomIn = () => {
    setRegion({
      ...region,
      latitudeDelta: region.latitudeDelta / 2,
      longitudeDelta: region.longitudeDelta / 2,
    })
  }

  const handleZoomOut = () => {
    setRegion({
      ...region,
      latitudeDelta: region.latitudeDelta * 2,
      longitudeDelta: region.longitudeDelta * 2,
    })
  }

  const handleGoToUserLocation = () => {
    if (location) {
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      })
    } else {
      getUserLocation()
    }
  }

  const handleGoToFirebaseLocation = () => {
    if (firebaseMarker) {
      setRegion({
        latitude: firebaseMarker.latitude,
        longitude: firebaseMarker.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      })
    }
  }

  return (
    <ImageBackground
      source={require("../../../assets/backft.png")}
      style={styles.backgroundImage}
      imageStyle={styles.backgroundImageStyle}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.4)", "rgba(0,0,0,0.7)"]} style={styles.overlay} />

      <View style={styles.container}>
        {!showMap ? (
          // Input Screen
          <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.title}>Find Location</Text>
              <Text style={styles.subtitle}>Enter the 8-character code to find someone</Text>

              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter code here"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={code}
                  onChangeText={(text) => setCode(text.toUpperCase())}
                  maxLength={8}
                  autoCapitalize="characters"
                />
                <Feather name="search" size={20} color="rgba(255,255,255,0.7)" style={styles.inputIcon} />
              </View>

              <TouchableOpacity style={styles.button} onPress={handleShowMap} disabled={loading} activeOpacity={0.8}>
                {loading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>Find Now</Text>
                    <MaterialIcons name="location-searching" size={20} color="white" style={styles.buttonIcon} />
                  </>
                )}
              </TouchableOpacity>
            </View>
          </BlurView>
        ) : (
          // Map Screen
          <View style={styles.mapContainer}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              region={region}
              onRegionChangeComplete={setRegion}
              showsUserLocation={true}
              showsCompass={false}
              showsScale={true}
              showsMyLocationButton={false}
              mapType="standard"
            >
              {userMarker && (
                <Marker
                  coordinate={{
                    latitude: userMarker.latitude,
                    longitude: userMarker.longitude,
                  }}
                  title="Your Location"
                  description="You are here"
                  pinColor="#4285F4"
                />
              )}
              {firebaseMarker && (
                <Marker
                  coordinate={{
                    latitude: firebaseMarker.latitude,
                    longitude: firebaseMarker.longitude,
                  }}
                  title={`${firebaseMarker.name}'s Location`}
                  description={`Code: ${firebaseMarker.code}`}
                  pinColor="#EA4335"
                />
              )}
            </MapView>

            {/* Map Controls */}
            <View style={styles.mapControlsContainer}>
              <TouchableOpacity style={styles.mapControlButton} onPress={handleZoomIn}>
                <Feather name="plus" size={22} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.mapControlButton} onPress={handleZoomOut}>
                <Feather name="minus" size={22} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.mapControlButton} onPress={handleGoToUserLocation}>
                <MaterialIcons name="my-location" size={22} color="#fff" />
              </TouchableOpacity>

              {firebaseMarker && (
                <TouchableOpacity style={styles.mapControlButton} onPress={handleGoToFirebaseLocation}>
                  <MaterialIcons name="person-pin-circle" size={22} color="#fff" />
                </TouchableOpacity>
              )}
            </View>

            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <LinearGradient
                colors={["#4CAF50", "#2E7D32"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.backButtonGradient}
              >
                <Feather name="arrow-left" size={20} color="#fff" />
                <Text style={styles.backButtonText}>Back</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Location Info Card */}
            {firebaseMarker && (
              <View style={styles.locationInfoCard}>
                <Text style={styles.locationInfoTitle}>{firebaseMarker.name}</Text>
                <Text style={styles.locationInfoCode}>Code: {firebaseMarker.code}</Text>
                <TouchableOpacity style={styles.centerLocationButton} onPress={handleGoToFirebaseLocation}>
                  <Text style={styles.centerLocationText}>Center on map</Text>
                  <Feather name="crosshair" size={16} color="#4CAF50" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
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
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  blurContainer: {
    width: width * 0.9,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  inputContainer: {
    width: "100%",
    padding: 25,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 30,
    textAlign: "center",
  },
  inputWrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  input: {
    flex: 1,
    height: 55,
    color: "#fff",
    fontSize: 18,
    letterSpacing: 2,
  },
  inputIcon: {
    marginLeft: 10,
  },
  button: {
    width: "100%",
    height: 55,
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonIcon: {
    marginLeft: 10,
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    height: "100%",
    width: "100%",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapControlsContainer: {
    position: "absolute",
    right: 16,
    top: "50%",
    transform: [{ translateY: -100 }],
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 12,
    padding: 8,
  },
  mapControlButton: {
    width: 44,
    height: 44,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 40,
    left: 16,
    zIndex: 999,
  },
  backButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
  },
  backButtonText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "bold",
  },
  locationInfoCard: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 15,
    padding: 16,
    width: width * 0.85,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  locationInfoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  locationInfoCode: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  centerLocationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    backgroundColor: "rgba(76,175,80,0.1)",
    borderRadius: 8,
  },
  centerLocationText: {
    color: "#4CAF50",
    fontWeight: "500",
    marginRight: 8,
  },
})

export default MainComponent

