import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function Bubble({ x, y, radius, color, type }) {
  return (
    <View
      style={[
        styles.bubble,
        {
          left: x,
          top: y,
          width: radius * 2,
          height: radius * 2,
          borderRadius: radius,
          backgroundColor: color,
          // Extra glow only for power-ups
          shadowColor: type === 'powerup' ? 'yellow' : '#F8F8FF',
          shadowOpacity: type === 'powerup' ? 0.9 : 0.8,
          shadowRadius: type === 'powerup' ? 15 : 10,
          elevation: type === 'powerup' ? 10 : 10, 
          borderColor: type === 'powerup' ? 'yellow' : '#F8F8FF',
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  bubble: {
    position: 'absolute',
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#F8F8FF',
    shadowColor: '#F8F8FF',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
});
