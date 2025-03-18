import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, Image, ImageBackground } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../../../Styles'; // Assumindo que este é o caminho correto para o arquivo Styles.js

 const MainComponent = () => {

  const [location, setLocation] = useState(null);
  const [name, setName] = useState('');
  const [seunomename, setSeunomename] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [userMarker, setUserMarker] = useState(null);
  const [firebaseMarker, setFirebaseMarker] = useState(null);
  const [lastClickTime, setLastClickTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedData = await AsyncStorage.getItem('savedData');
        if (savedData) {
          const { name: savedName, seunomename: savedSeunomename } = JSON.parse(savedData);
          setName(savedName);
          setSeunomename(savedSeunomename);
        }
      } catch (error) {
        console.error('Erro ao carregar dados salvos do AsyncStorage:', error);
      }
    };

    loadSavedData();
  }, []);

  const handleShowMap = async (event) => {
    event.persist();
    console.log('HandleShowMap initiated');
  
    const currentTime = new Date().getTime();
    console.log('Current time:', currentTime);
  
    if (lastClickTime && currentTime - lastClickTime < 3600000) {
      console.log('Using cached data, showing map directly');
      setShowMap(true);
      return;
    }
  
    if (!code || code.length !== 8) {
      console.log('Invalid code:', code);
      Alert.alert('Required field', 'Please enter a valid 8-character code.');
      return;
    }
  
    try {
      await AsyncStorage.setItem('savedData', JSON.stringify({ name, seunomename }));
      console.log('Data saved to AsyncStorage');
    } catch (error) {
      console.error('AsyncStorage error:', error);
    }
  
    setLoading(true);
    console.log('Loading state set to true');
  
    const supabaseUrl = 'https://zvxmeplxgwysaqiaibvh.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eG1lcGx4Z3d5c2FxaWFpYnZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMDUzMDMsImV4cCI6MjA1Nzg4MTMwM30.NMVYAimnYpkdmqYsGvyhwE5p2Mwy7-soN_UnzUBBRjs';

    console.log('Attempting to fetch data from Supabase for code:', code);

    try {
      console.log('Making Supabase request to:', `${supabaseUrl}/rest/v1/locations?code=eq.${code}&select=*`);
      const response = await axios.get(
        `${supabaseUrl}/rest/v1/locations?code=eq.${code}&select=*`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
          }
        }
      );
      console.log('Supabase response:', response.data);

      if (response.data && response.data.length > 0) {
        const locationData = response.data[0];
        console.log('Location data found:', locationData);

        const { latitude, longitude, name, code } = locationData;
        console.log('Extracted coordinates:', { latitude, longitude });

        setFirebaseMarker({
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          name: name || 'Unknown',
          code: code || 'Unknown',
        });
        console.log('Marker set with coordinates');

        setRegion({
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        console.log('Region updated');

        setShowMap(true);
        setLastClickTime(currentTime);
        console.log('Map display enabled');
      } else {
        console.log('No location data found for code:', code);
        Alert.alert('User not found', 'No location found for the specified code.');
      }
    } catch (error) {
      console.error('Supabase request error:', error);
      console.error('Error details:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to fetch location data. Please try again.');
    } finally {
      setLoading(false);
      console.log('Loading state set to false');
    }
  };

  const handleBack = () => {
    setShowMap(false);
  };

  const getUserLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permissão de localização negada');
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation);

      setUserMarker({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
      });

      setRegion({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []); // Executa apenas uma vez na montagem do componente

  const handleZoomIn = () => {
    setRegion({
      ...region,
      latitudeDelta: region.latitudeDelta / 2,
      longitudeDelta: region.longitudeDelta / 2,
    });
  };

  const handleZoomOut = () => {
    setRegion({
      ...region,
      latitudeDelta: region.latitudeDelta * 2,
      longitudeDelta: region.longitudeDelta * 2,
    });
  };

  const handleGoToUserLocation = () => {
    if (location) {
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  const handleGoToFirebaseLocation = () => {
    if (firebaseMarker) {
      setRegion({
        latitude: firebaseMarker.latitude,
        longitude: firebaseMarker.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  return (
    <ImageBackground source={require('../../../assets/backft.png')} style={{ flex: 1 }}>
      <View style={styles.container}>
        {!showMap ? (
          <View style={styles.inputContainer}>
            <Text style={styles.inputxt1}>Place the code below</Text>
            <TextInput
              style={styles.input}
              placeholder="Place the code here"
              placeholderTextColor="#000000"
              value={code}
              onChangeText={(text) => setCode(text)}
              keyboardType="default"
              maxLength={8} // Ajuste conforme o tamanho do código gerado
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleShowMap}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Find Now!</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              region={region}
              onRegionChangeComplete={setRegion}
            >
              {userMarker && (
                <Marker
                  coordinate={{
                    latitude: userMarker.latitude,
                    longitude: userMarker.longitude,
                  }}
                  title={`You`}
                  description={`You are here!`}
                />
              )}
              {firebaseMarker && (
                <Marker
                  coordinate={{
                    latitude: firebaseMarker.latitude,
                    longitude: firebaseMarker.longitude,
                  }}
                  title={`Location of ${firebaseMarker.name}`}
                  description={`Name: ${firebaseMarker.name}, Code: ${firebaseMarker.code}`}
                />
              )}
            </MapView>
            <View style={styles.mapButtonsContainer}>
              <TouchableOpacity style={styles.zoomButton} onPress={handleZoomIn}>
                <Text style={styles.zoomText}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.zoomButton} onPress={handleZoomOut}>
                <Text style={styles.zoomText}>-</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.locationButton} onPress={handleGoToUserLocation}>
                <Text style={styles.locationText}>Me</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.locationButton} onPress={handleGoToFirebaseLocation}>
                <Text style={styles.locationText}>{firebaseMarker.name} location</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Text style={styles.backText}>back</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

export default MainComponent;
