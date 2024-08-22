// screens/HomeScreen.js
import React from 'react';
import {View, Text, Button, StyleSheet, ImageBackground} from 'react-native';
// import backgroundImage from '../multitasking.avif';

const HomeScreen = ({navigation}) => {
  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1713470995189-31461925b54c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bXVsdGl0YXNraW5nfGVufDB8fDB8fHww',
      }}
      style={styles.backgroundImage}>
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Text style={styles.title}>Embrace Tranquility, Anytime You Need.</Text>
        <Button
          style={styles.btn}
          title="Dashboard"
          onPress={() => navigation.navigate('Dashboard')}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  btn: {
    borderRadius: 16,
  },
});

export default HomeScreen;
