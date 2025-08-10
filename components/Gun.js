import React from 'react';
import { Image, StyleSheet } from 'react-native';

export default function Gun({ x }) {
    return (
      <Image
        source={require('../assets/gun.png')} // your gun image
        style={[styles.gun, { left: x - 25 }]} // center horizontally
        resizeMode="contain"
      />
    );
  }
  
  const styles = StyleSheet.create({
    gun: {
      position: 'absolute',
      bottom: 0,
      width: 60,
      height: 80,
    },
  });