
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Button, Alert, ActivityIndicator, TextInput, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

const windowWidth = Dimensions.get('window').width;

const SignUpForm = ({ navigation, route }) => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [base64Image, setBase64Image] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const value = route;

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    validateForm();
  }, [userData, base64Image]);

  const fetchUserProfile = async () => {
    try {
      const userInfoString = await AsyncStorage.getItem('userInfo');
      const userInfo = JSON.parse(userInfoString);
      setUserData(userInfo);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleChooseImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        includeBase64: true,
      });

      if (result.assets && result.assets.length > 0) {
        setBase64Image(result.assets[0].base64);
      }
    } catch (error) {
      console.error('Error choosing image:', error);
    }
  };

  const validateForm = () => {
    const { first_name, last_name, date_of_birth, gender, bio } = userData;
    if (first_name && last_name && date_of_birth && gender && bio && base64Image) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  const handleSave = async () => {
    if (!isFormValid) {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }

    try {
      const params = {
        eventID: '1001',
        addInfo: {
          skillup_id: value.params.signUpResponse.user,
          profile_picture: base64Image,
          first_name: userData.first_name,
          last_name: userData.last_name,
          date_of_birth: userData.date_of_birth,
          gender: userData.gender,
          bio: userData.bio,
        },
      };

      const response = await fetch('http://192.168.33.157:5164/skillup_UserProfile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (response.ok) {
        const resData = await response.json();
        Alert.alert('Success', 'Profile created successfully');
        fetchUserProfile();
        navigation.navigate('SignIn');
      } else {
        console.error('Failed to update profile:', response.status);
        Alert.alert('Error', 'Failed to created profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to created profile');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* <TouchableOpacity style={styles.backButtonWrapper} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" color="#000" size={25} />
      </TouchableOpacity> */}
      <View style={styles.profileCard}>
        <Image style={styles.image} source={{ uri: `data:image/jpeg;base64,${base64Image}` }} />
        <TouchableOpacity style={styles.chooseImageButton} onPress={handleChooseImage}>
          <Text style={styles.chooseImageText}>Choose Image</Text>
        </TouchableOpacity>
        <View style={styles.inputContainer}>
          <SimpleLineIcons name="user" size={30} color="#888" />
          <TextInput
            style={styles.textInput}
            value={userData.first_name}
            onChangeText={(text) => setUserData({ ...userData, first_name: text })}
            placeholder="First Name"
            placeholderTextColor="#888"
          />
        </View>
        <View style={styles.inputContainer}>
          <SimpleLineIcons name="user" size={30} color="#888" />
          <TextInput
            style={styles.textInput}
            value={userData.last_name}
            onChangeText={(text) => setUserData({ ...userData, last_name: text })}
            placeholder="Last Name"
            placeholderTextColor="#888"
          />
        </View>
        <View style={styles.inputContainer}>
          <SimpleLineIcons name="calendar" size={30} color="#888" />
          <TextInput
            style={styles.textInput}
            value={userData.date_of_birth}
            onChangeText={(text) => setUserData({ ...userData, date_of_birth: text })}
            placeholder="Date of Birth (yyyy-mm-dd)"
            placeholderTextColor="#888"
          />
        </View>
        <View style={styles.inputContainer}>
          <SimpleLineIcons name="tag" size={30} color="#888" />
          <TextInput
            style={styles.textInput}
            value={userData.gender}
            onChangeText={(text) => setUserData({ ...userData, gender: text })}
            placeholder="Gender"
            placeholderTextColor="#888"
          />
        </View>
        <View style={[styles.inputContainer, styles.bioInput]}>
          <SimpleLineIcons name="info" size={30} color="#888" />
          <TextInput
            style={styles.textInput}
            value={userData.bio}
            onChangeText={(text) => setUserData({ ...userData, bio: text })}
            placeholder="Bio"
            placeholderTextColor="#888"
            multiline
          />
        </View>
        <TouchableOpacity
          style={[styles.saveButton, !isFormValid && styles.disabledButton]}
          onPress={handleSave}
          disabled={!isFormValid}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backButtonWrapper: {
    height: 40,
    width: 40,
    backgroundColor: '#ddd',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    alignSelf: 'center',
  },
  chooseImageButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 30,
    padding: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  chooseImageText: {
    color: '#fff',
    fontSize: 16,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 30,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 2,
    marginVertical: 10,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#000',
  },
  bioInput: {
    height: 100,
    alignItems: 'flex-start',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 30,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SignUpForm;
