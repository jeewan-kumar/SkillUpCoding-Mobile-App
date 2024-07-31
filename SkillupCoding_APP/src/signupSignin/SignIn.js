import React, { useContext, useState } from 'react';
import { Image, StyleSheet, Text, View, Dimensions, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { AuthContext } from '../services/AuthContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { colors } from '../utils/colors';
import { fonts } from '../utils/fonts';

const windowWidth = Dimensions.get('window').width;

const BASE_URL = 'http://192.168.33.157:5164/';

const SignIn = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [secureEntry, setSecureEntry] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailLogin, setIsEmailLogin] = useState(true); // State to toggle between email and phone number login
  const { signIn } = useContext(AuthContext);

  const handleSignInPress = async () => {
    try {
      if (isEmailLogin) {
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
          Alert.alert('Error', 'Invalid email address');
          return;
        }

        if (!email || !password) {
          Alert.alert('Error', 'All fields are required');
          return;
        }

        const signInResponse = await signIn(email, password, true); // Pass true for email login
        if (signInResponse.success) {
          navigation.navigate('Home');
        } else {
          Alert.alert('Error', signInResponse.message);
        }
      } else {
        const phoneRegex = /^\d{10}$/; // Assuming a 10-digit phone number
        if (!phoneRegex.test(phone_number)) {
          Alert.alert('Error', 'Invalid phone number');
          return;
        }

        if (!phone_number || !password) {
          Alert.alert('Error', 'All fields are required');
          return;
        }

        const signInResponse = await signIn(phone_number, password, false); 
        if (signInResponse.success) {
          navigation.navigate('Home');
        } else {
          Alert.alert('Error', signInResponse.message);
        }
      }
    } catch (error) {
      console.error('Sign in failed:', error.message);
      Alert.alert('Error', 'Sign in failed. Please try again.');
    }
  };

  const handleSignup = () => {
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.headingText}>Hey,</Text>
        <Text style={styles.headingText}>Welcome</Text>
        <Text style={styles.headingText}>Back</Text>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.switchContainer}>
          <TouchableOpacity onPress={() => setIsEmailLogin(true)} style={isEmailLogin ? styles.switchActive : styles.switchInactive}>
            <Text style={isEmailLogin ? styles.switchTextActive : styles.switchTextInactive}>Email</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsEmailLogin(false)} style={!isEmailLogin ? styles.switchActive : styles.switchInactive}>
            <Text style={!isEmailLogin ? styles.switchTextActive : styles.switchTextInactive}>Phone Number</Text>
          </TouchableOpacity>
        </View>
        {isEmailLogin ? (
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={30} color={colors.secondary} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter your email"
              placeholderTextColor={colors.secondary}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>
        ) : (
          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={30} color={colors.secondary} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter your phone number"
              placeholderTextColor={colors.secondary}
              keyboardType="phone-pad"
              autoCapitalize="none"
              value={phone_number}
              onChangeText={setPhoneNumber}
            />
          </View>
        )}
        <View style={styles.inputContainer}>
          <SimpleLineIcons name="lock" size={30} color={colors.secondary} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your password"
            placeholderTextColor={colors.secondary}
            secureTextEntry={secureEntry}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setSecureEntry(!secureEntry)}>
            <SimpleLineIcons name="eye" size={20} color={colors.secondary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <TouchableOpacity style={styles.loginButtonWrapper} onPress={handleSignInPress}>
            <Text style={styles.loginText}>Sign-In</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.continueText}>or continue with</Text>
        <TouchableOpacity style={styles.googleButtonContainer} onPress={() => {}}>
          <Image source={require('../images/Google.png')} style={styles.googleImage} />
          <Text style={styles.googleText}>Google</Text>
        </TouchableOpacity>
        <View style={styles.footerContainer}>
          <Text style={styles.accountText}>Don’t have an account?</Text>
          <TouchableOpacity onPress={handleSignup}>
            <Text style={styles.signupText}>Sign-Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },
  textContainer: {
    marginVertical: 20,
    marginTop: 70,
  },
  headingText: {
    fontSize: 32,
    color: colors.primary,
    fontFamily: fonts.SemiBold,
    fontWeight: 'bold',
  },
  formContainer: {
    marginTop: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  switchActive: {
    borderBottomWidth: 2,
    borderColor: colors.primary,
    paddingHorizontal: 20,
    paddingBottom: 5,
    marginRight: 10,
  },
  switchInactive: {
    paddingHorizontal: 20,
    paddingBottom: 5,
    marginRight: 10,
  },
  switchTextActive: {
    fontSize: 18,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
  },
  switchTextInactive: {
    fontSize: 18,
    fontFamily: fonts.Regular,
    color: colors.secondary,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 100,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 2,
    marginVertical: 10,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontFamily: fonts.Light,
  },
  forgotPasswordText: {
    textAlign: 'right',
    color: colors.primary,
    fontFamily: fonts.SemiBold,
    marginVertical: 10,
  },
  loginButtonWrapper: {
    backgroundColor: colors.primary,
    borderRadius: 100,
    marginTop: 20,
  },
  loginText: {
    color: colors.white,
    fontSize: 20,
    fontFamily: fonts.SemiBold,
    textAlign: 'center',
    padding: 10,
  },
  continueText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: colors.primary,
  },
  googleButtonContainer: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    gap: 10,
  },
  googleImage: {
    height: 40,
    width: 40,
  },
  googleText: {
    fontSize: 20,
    fontFamily: fonts.SemiBold,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    gap: 5,
  },
  accountText: {
    color: colors.primary,
    fontFamily: fonts.Regular,
  },
  signupText: {
    color: colors.primary,
    fontFamily: fonts.Bold,
    color: 'blue',
    fontWeight: 'bold',
  },
});

// import React, { useContext, useState } from 'react';
// import { Image, StyleSheet, Text, View, Dimensions, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
// import { AuthContext } from '../services/AuthContext';

// import { colors } from '../utils/colors';
// import { fonts } from '../utils/fonts';

// const windowWidth = Dimensions.get('window').width;

// const SignIn = () => {
//   const navigation = useNavigation();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [secureEntry, setSecureEntry] = useState(true);
//   const { signIn, isLoading } = useContext(AuthContext);

//   const handleSignInPress = async () => {
//     const emailRegex = /\S+@\S+\.\S+/;
//     if (!emailRegex.test(email)) {
//       Alert.alert('Error', 'Invalid email address');
//       return;
//     }

//     if (email && password) {
//       const signInResponse = await signIn(email, password);
//       if (signInResponse.success) {
//         navigation.navigate('Home');
//       } else {
//         Alert.alert('Error', signInResponse.message);
//       }
//     } else {
//       Alert.alert('Error', 'All fields are required');
//     }
//   };

//   const handleSignup = () => {
//     navigation.navigate('SignUp');
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.textContainer}>
//         <Text style={styles.headingText}>Hey,</Text>
//         <Text style={styles.headingText}>Welcome</Text>
//         <Text style={styles.headingText}>Back</Text>
//       </View>
//       <View style={styles.formContainer}>
//         <View style={styles.inputContainer}>
//           <Ionicons name="mail-outline" size={30} color={colors.secondary} />
//           <TextInput
//             style={styles.textInput}
//             placeholder="Enter your email"
//             placeholderTextColor={colors.secondary}
//             keyboardType="email-address"
//             autoCapitalize="none"
//             value={email}
//             onChangeText={setEmail}
//           />
//         </View>
//         <View style={styles.inputContainer}>
//           <SimpleLineIcons name="lock" size={30} color={colors.secondary} />
//           <TextInput
//             style={styles.textInput}
//             placeholder="Enter your password"
//             placeholderTextColor={colors.secondary}
//             secureTextEntry={secureEntry}
//             value={password}
//             onChangeText={setPassword}
//           />
//           <TouchableOpacity onPress={() => setSecureEntry(!secureEntry)}>
//             <SimpleLineIcons name="eye" size={20} color={colors.secondary} />
//           </TouchableOpacity>
//         </View>
//         <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
//           <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
//         </TouchableOpacity>
//         {isLoading ? (
//           <ActivityIndicator size="large" color={colors.primary} />
//         ) : (
//           <TouchableOpacity style={styles.loginButtonWrapper} onPress={handleSignInPress}>
//             <Text style={styles.loginText}>Sign-In</Text>
//           </TouchableOpacity>
//         )}
//         <Text style={styles.continueText}>or continue with</Text>
//         <TouchableOpacity style={styles.googleButtonContainer} onPress={() => {}}>
//           <Image source={require('../images/Google.png')} style={styles.googleImage} />
//           <Text style={styles.googleText}>Google</Text>
//         </TouchableOpacity>
//         <View style={styles.footerContainer}>
//           <Text style={styles.accountText}>Don’t have an account?</Text>
//           <TouchableOpacity onPress={handleSignup}>
//             <Text style={styles.signupText}>Sign-Up</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default SignIn;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.white,
//     padding: 20,
//   },
//   textContainer: {
//     marginVertical: 20,
//     marginTop: 100,
//   },
//   headingText: {
//     fontSize: 32,
//     color: colors.primary,
//     fontFamily: fonts.SemiBold,
//     fontWeight: 'bold',
//   },
//   formContainer: {
//     marginTop: 20,
//   },
//   inputContainer: {
//     borderWidth: 1,
//     borderColor: colors.secondary,
//     borderRadius: 100,
//     paddingHorizontal: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 2,
//     marginVertical: 10,
//   },
//   textInput: {
//     flex: 1,
//     paddingHorizontal: 10,
//     fontFamily: fonts.Light,
//   },
//   forgotPasswordText: {
//     textAlign: 'right',
//     color: colors.primary,
//     fontFamily: fonts.SemiBold,
//     marginVertical: 10,
//   },
//   loginButtonWrapper: {
//     backgroundColor: colors.primary,
//     borderRadius: 100,
//     marginTop: 20,
//   },
//   loginText: {
//     color: colors.white,
//     fontSize: 20,
//     fontFamily: fonts.SemiBold,
//     textAlign: 'center',
//     padding: 10,
//   },
//   continueText: {
//     textAlign: 'center',
//     marginVertical: 20,
//     fontSize: 14,
//     fontFamily: fonts.Regular,
//     color: colors.primary,
//   },
//   googleButtonContainer: {
//     flexDirection: 'row',
//     borderWidth: 2,
//     borderColor: colors.primary,
//     borderRadius: 100,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 10,
//     gap: 10,
//   },
//   googleImage: {
//     height: 40,
//     width: 40,
//   },
//   googleText: {
//     fontSize: 20,
//     fontFamily: fonts.SemiBold,
//   },
//   footerContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginVertical: 20,
//     gap: 5,
//   },
//   accountText: {
//     color: colors.primary,
//     fontFamily: fonts.Regular,
//   },
//   signupText: {
//     color: colors.primary,
//     fontFamily: fonts.Bold,
//     color: 'blue',
//     fontWeight: 'bold',
//   },
// });
