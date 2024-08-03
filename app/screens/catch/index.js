import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import { styles } from '../../../Styles';
import axios from 'axios';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard'; 

export default function Catch() {
  const [input1, setInput1] = useState('');
  const [code, setCode] = useState('');
  const [showCode, setShowCode] = useState(false);

  // Função para gerar o código
  const generateCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$?';
    const length = 8; // Tamanho do código gerado
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
  };

  // Função para salvar o código gerado no AsyncStorage
  const saveCodeToStorage = async (code) => {
    try {
      await AsyncStorage.setItem('@generatedCode', code);
    } catch (e) {
      console.error('Erro ao salvar código no AsyncStorage:', e);
    }
  };

  // Função para carregar o código do AsyncStorage ao inicializar o componente
  const loadCodeFromStorage = async () => {
    try {
      const savedCode = await AsyncStorage.getItem('@generatedCode');
      if (savedCode !== null) {
        setCode(savedCode);
        setShowCode(true);
      }
    } catch (e) {
      console.error('Erro ao carregar código do AsyncStorage:', e);
    }
  };

  // Efeito que carrega o código salvo ao inicializar o componente
  useEffect(() => {
    loadCodeFromStorage();
  }, []);

  // Handler para gerar um novo código
  const handleGenerate = () => {
    const generatedCode = generateCode();
    setCode(generatedCode);
    setShowCode(true);
    saveCodeToStorage(generatedCode); // Salva o código gerado no AsyncStorage
    Clipboard.setString(generatedCode); // Copia o código gerado para o clipboard
    Alert.alert('Code Copied', 'The generated code has been copied to the clipboard.');
  };

  // Handler para copiar o código para o clipboard
  const handleCopyToClipboard = () => {
    Clipboard.setString(code);
    Alert.alert('Code Copied', 'The generated code has been copied to the clipboard.');
  };

  // Handler para salvar a localização
  const handleSave = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permissão de localização negada');
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      
      const firebaseDatabaseUrl = 'https://geo-finder-7e641-default-rtdb.europe-west1.firebasedatabase.app/';
      const locationData = {
        name: input1,
        code: code,
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
      };

      await axios.put(`${firebaseDatabaseUrl}/users/${code}.json`, locationData);

      setInput1('');
      setShowCode(false);
      Alert.alert('Sucess', 'Location saved!');

    } catch (error) {
      console.error('Erro ao obter ou enviar localização:', error);
      Alert.alert('Error', 'Please try again!');
    }
  };

  return (
    <ImageBackground source={require('../../../assets/backft.png')} style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TextInput
          style={styles.input}
          placeholder="Put here a name"
          placeholderTextColor="#000000"
          value={input1}
          onChangeText={(text) => setInput1(text)}
          keyboardType="default"
          maxLength={16}
        />
        <TouchableOpacity
              style={styles.buttoncatch}
              onPress={handleGenerate}
        >
          <Text style={styles.buttonText} >Generate Code</Text>
        </TouchableOpacity>

        {/* Exibindo o código gerado */}
        {showCode && (
          <View style={{ alignItems: 'center',  }}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>


            <TouchableOpacity
              style={styles.buttoncatch}
              onPress={handleCopyToClipboard}
            >
              <Text style={styles.buttonText} >Copy Code</Text>
            </TouchableOpacity>

            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.buttonText, { fontSize: 20 }]}>Code:</Text>
              <Text style={[styles.buttonText, { fontSize: 20, marginLeft: 5, }]}>{code}</Text>
            </View>


  
          </View>
        )}

        {/* Botão para salvar a localização */}
        <TouchableOpacity
              style={styles.buttoncatch}
              onPress={handleSave}
          disabled={!showCode}
        >
          <Text style={styles.buttonText}>Save locate</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
