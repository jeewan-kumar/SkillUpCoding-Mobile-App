
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, Button, Alert, ActivityIndicator, TextInput, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { AuthContext } from '../services/AuthContext';
import BackButton from './BackButton';

const Profile = ({ navigation }) => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [base64Image, setBase64Image] = useState('');

  const { logout } = useContext(AuthContext);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userInfoString = await AsyncStorage.getItem('userInfo');
      const userInfo = JSON.parse(userInfoString);

      const response = await fetch('http://192.168.33.157:5164/skillup_UserProfile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventID: "1006",
          addInfo: {
            skillup_id: userInfo.rData.id,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const jsonResponse = await response.json();

      if (jsonResponse.rStatus === 0 && jsonResponse.rData && jsonResponse.rData.profile) {
        const userArray = jsonResponse.rData.profile[0];

        if (userArray && userArray.length > 0) {
          const user = {
            profile_picture: userArray[0],
            first_name: userArray[1],
            last_name: userArray[2],
            date_of_birth: userArray[3],
            bio: userArray[4],
            email: userArray[5],
            phone_number: userArray[6],
            name: userArray[7],
            gender: userArray[8],
            skillup_id: userInfo.rData.id,
          };

          setUserData(user);
          setLoading(false);
          setBase64Image(userArray[0]);
         console.log(userArray[0] ,'userArray[0]')
        } else {
          console.error('No user data found in profile array');
          setLoading(false);
        }
      } else {
        console.error('Invalid response structure or rStatus is not 0');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            await logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'SignIn' }],
            });
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChooseImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        includeBase64: true,
      });

      if (result.assets && result.assets.length > 0) {
        const source = { uri: result.assets[0].uri };
        setNewProfilePicture(source);
        setBase64Image(result.assets[0].base64);
        console.log('result.assets[0].base64' ,result.assets[0].base64)
      }
    } catch (error) {
      console.error('Error choosing image:', error);
    }
  };

  const handleSave = async () => {
    try {
      const userInfoString = await AsyncStorage.getItem('userInfo');
      const userInfo = JSON.parse(userInfoString);

      const params = {
        eventID: '1007',
        addInfo: {
          skillup_id: userInfo.rData.id,
          profile_picture: base64Image,
          first_name: userData.first_name,
          last_name: userData.last_name,
          date_of_birth: userData.date_of_birth,
          bio: userData.bio,
          email: userData.email,
          phone_number: userData.phone_number,
          gender: userData.gender,
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
        console.log('Update successful:', resData);
        Alert.alert('Success', 'Profile updated successfully');
        setIsEditing(false);
        fetchUserProfile(); // Refresh user profile
      } else {
        console.error('Failed to update profile:', response.status);
        Alert.alert('Error', 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
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
      <View style={styles.header}>
        <BackButton navigation={navigation} />
        <Text style={styles.titles}>My Profile</Text>
      </View>
      <View style={styles.profileCard}>
        {base64Image ? (
          <Image
            style={styles.image}
            source={{ uri: `data:image/jpeg;base64,${base64Image}` }}
          />
         ) : (
          <Text>No profile picture</Text>
        )} 
        {isEditing ? (
          <>
            <Button title="Choose New Image" onPress={handleChooseImage} style={styles.chooseImageButton}/>
            <TextInput
              style={[styles.input, styles.firstNameInput]}
              value={userData.first_name}
              onChangeText={(text) => setUserData({ ...userData, first_name: text })}
              placeholder="First Name"
            />
            <TextInput
              style={styles.input}
              value={userData.last_name}
              onChangeText={(text) => setUserData({ ...userData, last_name: text })}
              placeholder="Last Name"
            />
            <TextInput
              style={styles.input}
              value={userData.email}
              onChangeText={(text) => setUserData({ ...userData, email: text })}
              placeholder="Email"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              value={userData.phone_number}
              onChangeText={(text) => setUserData({ ...userData, phone_number: text })}
              placeholder="Phone Number"
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              value={userData.date_of_birth}
              onChangeText={(text) => setUserData({ ...userData, date_of_birth: text })}
              placeholder="Date of Birth"
            />
            <TextInput
              style={styles.input}
              value={userData.gender}
              onChangeText={(text) => setUserData({ ...userData, gender: text })}
              placeholder="Gender"
            />
            <TextInput
              style={styles.input}
              value={userData.bio}
              onChangeText={(text) => setUserData({ ...userData, bio: text })}
              placeholder="Bio"
            />
            <Button title="Save" onPress={handleSave} color="#4CAF50" style={styles.editButton}/>
          </>
        ) : (
          <>
            <Text style={styles.title}>Profile Details</Text>
            <Text style={styles.label}>Name: {userData.name}</Text>
            <Text style={styles.label}>Email: {userData.email}</Text>
            <Text style={styles.label}>Phone Number: {userData.phone_number}</Text>
            <Text style={styles.label}>Date of Birth: {userData.date_of_birth}</Text>
            <Text style={styles.label}>Gender: {userData.gender}</Text>
            <Text style={styles.label}>Bio: {userData.bio}</Text>
            <Button title="Edit" onPress={handleEdit} color="#FFA500" style={styles.editButton} />
          </>
        )}
      </View>
      {/* <Button title="Logout" onPress={handleLogout} color="#f44336" /> */}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  titles: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
    textAlign: 'center',
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    alignSelf: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    width: '100%',
  },
  editButton: {
    marginBottom: 10,
  },chooseImageButton: {
    marginBottom: 10,
    },
    firstNameInput: {
      marginTop: 10, // Adjust margin as needed
      },
});

export default Profile;
