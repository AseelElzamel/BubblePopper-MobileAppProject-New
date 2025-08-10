import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import GameScreen from './GameScreen';
//import { useFonts } from 'expo-font';
import { useFonts, LuckiestGuy_400Regular } from '@expo-google-fonts/luckiest-guy';


export default function App() {
  // const [fontsLoaded] = useFonts({
  //   CartoonFont: require('./assets/fonts/CartoonFont.ttf'),
  // });
  
  // if (!fontsLoaded) {
  //   return null;
  // }
  const [fontsLoaded] = useFonts({
    LuckiestGuy_400Regular,
  });

  if (!fontsLoaded) {
    return null; // Show nothing until font is loaded
  }
  
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <GameScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  PopEffect: {
    position: 'absolute',
    width: 60,
    height:60,
    borderRadius: 30,
    backgroundColor: 'white',
    opacity: 0.5,
    transform: [{scale: 1.5}],
  }
});
