import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import GameScreen from './GameScreen';

export default function App() {
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
