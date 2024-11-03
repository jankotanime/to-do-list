import React, { useRef } from 'react';
import { Animated, View, Text, StyleSheet, Dimensions, PanResponder, ScrollView } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function SideDrawer() {
  const translateX = useRef(new Animated.Value(-SCREEN_WIDTH * 0.75)).current; // Start panelu poza ekranem

  // PanResponder do obsługi gestów przesuwania
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 0;
      },
      onPanResponderMove: (event, gestureState) => {
        if (gestureState.dx > 0) {
          Animated.timing(translateX, {
            toValue: -20,
            duration: 300,
            useNativeDriver: true,
          }).start();
        } else if (gestureState.dx < 0) {
          Animated.timing(translateX, {
            toValue: -SCREEN_WIDTH * 0.75,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Animated.View
      style={[styles.drawer, { transform: [{ translateX }] }]}
      {...panResponder.panHandlers} // Gesty przesuwania dla całego panelu
    >
      <View style={styles.main}>
        <Text style={styles.title}>Wysuwany Panel</Text>
        <Text>Tu dodaj swoją zawartość lub menu.</Text>
        </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  drawer: {
    height: '100%',
    position: 'absolute',
    left: 20,
    top: 0,
    width: SCREEN_WIDTH * 0.75, // Panel zajmuje 75% szerokości ekranu
    backgroundColor: 'rgb(240, 240, 250)',
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowOffset: { width: 2, height: 0 },
    shadowRadius: 10,
    elevation: 10,
  },
  scrollContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  main: {
    marginTop: 60,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
});
