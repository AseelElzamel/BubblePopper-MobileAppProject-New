import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function Bubble({ x, y, radius, color }) {
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
