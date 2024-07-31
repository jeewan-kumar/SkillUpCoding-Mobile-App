import React, { useState } from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import BackButton from './BackButton';

const SettingsPage = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  // Function to handle toggling notifications
  const toggleNotifications = async () => {
    
    try {
      const updatedState = !notificationsEnabled;
      setNotificationsEnabled(updatedState); // Optimistically update UI
      
      const response = await axios.post('http://example.com/api/updatePreferences', { notificationsEnabled: updatedState });
      if (response.data.success) {
        // Optionally handle success message or UI update
        // console.log('Notifications preference updated successfully');
      } else {
        throw new Error('Failed to update notifications preference');
      }
    } catch (error) {
      // Handle error and revert UI state if necessary
      setNotificationsEnabled(previousState => !previousState);
      Alert.alert('Error', 'Failed to update notifications preference');
    }
  };

  // Function to handle toggling dark mode
  const toggleDarkMode = async () => {
    try {
      const updatedState = !darkModeEnabled;
      setDarkModeEnabled(updatedState); // Optimistically update UI
      // Example: Make API call to update user preferences on the server
      const response = await axios.post('http://example.com/api/updatePreferences', { darkModeEnabled: updatedState });
      if (response.data.success) {
        // Optionally handle success message or UI update
        // console.log('Dark mode preference updated successfully');
      } else {
        throw new Error('Failed to update dark mode preference');
      }
    } catch (error) {
      // Handle error and revert UI state if necessary
      setDarkModeEnabled(previousState => !previousState);
      Alert.alert('Error', 'Failed to update dark mode preference');
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
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'SignIn' }],
              });
            },
            style: 'destructive', // Change button style to indicate danger
          },
        ],
        { cancelable: false }
      );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton navigation={navigation} />
        <Text style={styles.title}>Settings</Text>
      </View>
      <Text style={styles.sectionTitle}>Notifications</Text>
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Enable Notifications</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={notificationsEnabled ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleNotifications}
          value={notificationsEnabled}
        />
      </View>

      <Text style={styles.sectionTitle}>Appearance</Text>
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Dark Mode</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={darkModeEnabled ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleDarkMode}
          value={darkModeEnabled}
        />
      </View>

      {/* <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
    textAlign: 'center',
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#FF6347',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default SettingsPage;
