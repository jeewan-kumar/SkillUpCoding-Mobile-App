
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import Ionicons from 'react-native-vector-icons/Ionicons';

const apiUrl = 'http://192.168.33.157:5164/skillup_UserSignUp';

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  const forgotPassword = async (email) => {
    try {
      setIsLoading(true);
      const requestData = {
        eventID: '1002',
        addInfo: { email },
      };
      const response = await axios.post(apiUrl, requestData);
      const userData = response.data;
      if (userData.rData.rCode === 0) {
        await AsyncStorage.setItem('email', email);
        setShowOtpInput(true);
      } else {
        Alert.alert('Error', userData.rData.rMessage);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
      console.error('Failed to send OTP:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setIsLoading(true);
      const storedEmail = await AsyncStorage.getItem('email');
      const requestData = {
        eventID: '1004',
        addInfo: { email: storedEmail, otp },
      };
      const response = await axios.post(apiUrl, requestData);
      if (response.data.rData.rCode === 0) {
        setShowOtpInput(false);
        setShowResetPassword(true);
      } else {
        Alert.alert('Error', response.data.rData.rMessage);
      }
    } catch (error) {
      Alert.alert('Error', 'Invalid OTP. Please try again.');
      console.error('Failed to verify OTP:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPasswordFinal = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      const storedEmail = await AsyncStorage.getItem('email');
      const storedOtp = otp;
      const requestData = {
        eventID: '1003',
        addInfo: { email: storedEmail, otp: storedOtp, password },
      };
      const response = await axios.post(apiUrl, requestData);
      if (response.data.rData.rCode === 0) {
        Alert.alert('Password Reset', 'Password has been reset successfully.');
        navigation.goBack();
      } else {
        Alert.alert('Error', response.data.rData.rMessage);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to reset password. Please try again.');
      console.error('Failed to reset password:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = () => {
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Invalid email address');
      return;
    }

    forgotPassword(email);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButtonWrapper} onPress={() => navigation.goBack()}>
        <Ionicons name={"arrow-back-outline"} color={colors.primary} size={25} />
      </TouchableOpacity>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={{color:'black', fontWeight:"bold"}}>Email : {email}</Text>
      {!showOtpInput && !showResetPassword && (
        <TextInput
          style={styles.input}
          placeholder="Email address"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor={colors.secondary}
        />
      )}
      {showOtpInput && (
        <TextInput
          style={styles.input}
          placeholder="Enter OTP"
          keyboardType="numeric"
          value={otp}
          onChangeText={setOtp}
          placeholderTextColor={colors.secondary}
        />
      )}
      {showResetPassword && (
        <>
          <TextInput
            style={styles.input}
            placeholder="New Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholderTextColor={colors.secondary}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholderTextColor={colors.secondary}
          />
        </>
      )}
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : showOtpInput ? (
        <TouchableOpacity style={styles.button} onPress={handleVerifyOTP}>
          <Text style={styles.buttonText}>Verify OTP</Text>
        </TouchableOpacity>
      ) : showResetPassword ? (
        <TouchableOpacity style={styles.button} onPress={handleResetPasswordFinal}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonWrapper: {
    position: 'absolute',
    top: 40,
    left: 20,
    height: 40,
    width: 40,
    backgroundColor: colors.gray,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    color: colors.primary,
    fontFamily: fonts.SemiBold,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginVertical: 10,
    fontFamily: fonts.Light,
    color: colors.primary,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: colors.primary,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: fonts.SemiBold,
    
  },
});


// import React, { useState } from 'react';
// import { StyleSheet, Text, View, Dimensions, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const windowWidth = Dimensions.get('window').width;
// const apiUrl = 'http://192.168.33.157:5164/skillup_UserSignUp';

// const ForgotPassword = ({ navigation }) => {
//   const [email, setEmail] = useState('');
//   const [otp, setOtp] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [showOtpInput, setShowOtpInput] = useState(false);
//   const [showResetPassword, setShowResetPassword] = useState(false);

//   const forgotPassword = async (email) => {
//     try {
//       setIsLoading(true);
//       const requestData = {
//         eventID: '1002',
//         addInfo: {
//           email: email,
//         },
//       };
//       const response = await axios.post(apiUrl, requestData);
//       const userData = response.data;
//       if (userData.rData.rCode === 0) {
//         await AsyncStorage.setItem('email', email);
//         setShowOtpInput(true);
//       } else {
//         Alert.alert('Error', userData.rData.rMessage);
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Failed to send OTP. Please try again.');
//       console.error('Failed to send OTP:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleVerifyOTP = async () => {
//     try {
//       setIsLoading(true);
//       const storedEmail = await AsyncStorage.getItem('email');
//       const requestData = {
//         eventID: '1004',
//         addInfo: {
//           email: storedEmail,
//           otp: otp,
//         },
//       };
//       const response = await axios.post(apiUrl, requestData);
//       if (response.data.rData.rCode === 0) {
//         setShowOtpInput(false);
//         setShowResetPassword(true);
//       } else {
//         Alert.alert('Error', response.data.rData.rMessage);
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Invalid OTP. Please try again.');
//       console.error('Failed to verify OTP:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResetPasswordFinal = async () => {
//     if (newPassword !== confirmPassword) {
//       Alert.alert('Error', 'Passwords do not match');
//       return;
//     }

//     try {
//       setIsLoading(true);
//       const storedEmail = await AsyncStorage.getItem('email');
//       const storedotp = await AsyncStorage.getItem('otp');
//       const requestData = {
//         eventID: '1003',
//         addInfo: {
//           email: storedEmail,
//           otp: storedotp,
//           newPassword: newPassword,
//         },
//       };
//       const response = await axios.post(apiUrl, requestData);
//       if (response.data.rData.rCode === 0) {
//         Alert.alert('Password Reset', 'Password has been reset successfully.');
//         navigation.goBack();
//       } else {
//         Alert.alert('Error', response.data.rData.rMessage);
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Failed to reset password. Please try again.');
//       console.error('Failed to reset password:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResetPassword = () => {
//     const emailRegex = /\S+@\S+\.\S+/;
//     if (!emailRegex.test(email)) {
//       Alert.alert('Error', 'Invalid email address');
//       return;
//     }

//     forgotPassword(email);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Forgot Password</Text>
//       {!showOtpInput && !showResetPassword && (
//         <TextInput
//           style={styles.input}
//           placeholder="Email address"
//           keyboardType="email-address"
//           autoCapitalize="none"
//           value={email}
//           onChangeText={setEmail}
//         />
//       )}
//       {showOtpInput && (
//         <TextInput
//           style={styles.input}
//           placeholder="Enter OTP"
//           keyboardType="numeric"
//           value={otp}
//           onChangeText={setOtp}
//         />
//       )}
//       {showResetPassword && (
//         <>
//           <TextInput
//             style={styles.input}
//             placeholder="New Password"
//             secureTextEntry
//             value={newPassword}
//             onChangeText={setNewPassword}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Confirm Password"
//             secureTextEntry
//             value={confirmPassword}
//             onChangeText={setConfirmPassword}
//           />
//         </>
//       )}
//       {isLoading ? (
//         <ActivityIndicator size="large" color="blue" />
//       ) : showOtpInput ? (
//         <TouchableOpacity style={styles.button} onPress={handleVerifyOTP}>
//           <Text style={styles.buttonText}>Verify OTP</Text>
//         </TouchableOpacity>
//       ) : showResetPassword ? (
//         <TouchableOpacity style={styles.button} onPress={handleResetPasswordFinal}>
//           <Text style={styles.buttonText}>Reset Password</Text>
//         </TouchableOpacity>
//       ) : (
//         <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
//           <Text style={styles.buttonText}>Reset Password</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// export default ForgotPassword;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color: '#000',
//   },
//   input: {
//     width: windowWidth * 0.8,
//     height: 40,
//     borderWidth: 1,
//     borderColor: 'gray',
//     borderRadius: 5,
//     paddingLeft: 10,
//     marginBottom: 20,
//   },
//   button: {
//     width: windowWidth * 0.8,
//     height: 40,
//     backgroundColor: 'blue',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 5,
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
// });

