import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import image from '../assets/images/landingpage-banner.jpg';

const { width, height } = Dimensions.get('window');

const LandingPage = () => {
  const navigation = useNavigation();

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={image}
        style={styles.landingPageImage}
        resizeMode="cover"
      >
        <View style={styles.content}>
          <Text style={styles.welcomeMessage}>Welcome to SELFIT</Text>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
          >
            <Text style={styles.registerButtonText}>START NOW</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  landingPageImage: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeMessage: {
    fontSize: 36,
    fontWeight: '300',
    color: '#ffffff',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,

    textAlign: 'center',
  },
  registerButton: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButtonText: {
    color: '#000000',
    letterSpacing: 1,
    fontWeight: '400',
  },
});

export default LandingPage;
