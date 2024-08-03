import { StyleSheet, View, TouchableOpacity, Linking } from 'react-native'
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import React from 'react'

export default function SocialMedia() {
    const openLink = (url) => {
        Linking.openURL(url);
      };
    
  return (
    <View style={styles.socialContainer}>
    <TouchableOpacity style={styles.socialIcon} onPress={() => openLink('https://www.linkedin.com/in/ryancarlos/')}>
      <AntDesign name="linkedin-square" size={24} color="white" />
    </TouchableOpacity>
    <TouchableOpacity style={styles.socialIcon} onPress={() => openLink('https://instagram.com/make4ryan')}>
      <AntDesign name="instagram" size={24} color="white" />
    </TouchableOpacity>
    <TouchableOpacity style={styles.socialIcon} onPress={() => openLink('https://www.tiktok.com/@madebryan')}>
      <FontAwesome5 name="tiktok" size={24} color="white" />
    </TouchableOpacity>
    <TouchableOpacity style={styles.socialIcon} onPress={() => openLink('https://github.com/Ryan-Carloso')}>
    <AntDesign name="github" size={24} color="white" />
    </TouchableOpacity>
  </View>
  )
}

const styles = StyleSheet.create({
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 16,
      },
    socialIcon: {
        margin: 10,
    },

})