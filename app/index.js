// HomeScreen.js
import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  ImageBackground, 
  StyleSheet, 
  StatusBar, 
  SafeAreaView,
  Animated,
  Dimensions,
  Platform
} from 'react-native';
import LinkButton from './screens/home/LinkButton';
import SocialMedia from './screens/home/social';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  // Animation values
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground 
        source={require('../assets/backft.png')} 
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      >
        <View style={styles.overlay} />
        
        <Animated.View 
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Welcome Home</Text>
            <View style={styles.titleUnderline} />
          </View>

          <View style={styles.cardContainer}>
            <View style={styles.card}>
              <Text style={styles.tutorialTitle}>Choose an option:</Text>
              
              <View style={styles.buttonContainer}>
                <LinkButton />
              </View>
              
              <View style={styles.instructionContainer}>
                <Text style={styles.instructionText}>
                  Click Above for a tutorial on how to use the App!
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.socialContainer}>
            <SocialMedia />
          </View>
        </Animated.View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  backgroundImageStyle: {
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    letterSpacing: 1,
  },
  titleUnderline: {
    height: 3,
    width: 100,
    backgroundColor: '#4CAF50',
    marginTop: 10,
    borderRadius: 2,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  card: {
    width: width * 0.9,
    backgroundColor: 'rgba(29, 72, 1, 0.85)',
    borderRadius: 20,
    padding: 25,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tutorialTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 25,
  },
  buttonContainer: {
    marginVertical: 20,
  },
  instructionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },
  instructionText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 22,
  },
  socialContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
});