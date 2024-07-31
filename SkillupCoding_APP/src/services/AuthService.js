import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const BASE_URL = "http://192.168.33.157:5164/"; // Replace with your actual base URL

export const logout = async (userInfo, setUserInfo, setIsLoading, navigation) => {
  setIsLoading(true);
  try {
    // Perform logout API request
    await axios.post(
      `${BASE_URL}logout`,
      {},
      {
        headers: { Authorization: `Bearer ${userInfo?.access_token}` },
      }
    );

    // Clear AsyncStorage data
    await AsyncStorage.removeItem('userInfo');
    await AsyncStorage.removeItem('onboardingCompleted');

    // Update state to reflect user logged out
    setUserInfo(null);
    setIsLoading(false);

    // Navigate to the Login screen
    navigation.navigate('SignIn');
  } catch (error) {
    console.error(`Logout failed: ${error}`);
    setIsLoading(false);
    // Handle any errors that occur during logout process
    // For example, you might want to inform the user that logout failed
  }
};
