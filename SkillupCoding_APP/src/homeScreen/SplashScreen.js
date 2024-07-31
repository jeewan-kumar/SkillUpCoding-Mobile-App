import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { AuthContext } from '../services/AuthContext'; 

const SplashScreen = ({ navigation }) => {
  const authContext = useContext(AuthContext);
  const { splashLoading, userInfo } = useContext(AuthContext);

  useEffect(() => {
    console.log(authContext); 
    const checkAuthStatus = async () => {
      try {
        if (!splashLoading) {
          setTimeout(() => {
            if (userInfo) {
              navigation.navigate('Home', { email: userInfo.email });
            } else {
              navigation.navigate('SignIn');
            }
          }, 10);
        }
      } catch (e) {
        // console.error('Failed to load auth status', e);
        navigation.navigate('SignIn');
      }
    };

    checkAuthStatus();
  }, [navigation, splashLoading, userInfo]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Skillup Coding</Text>
      {splashLoading && (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default SplashScreen;

