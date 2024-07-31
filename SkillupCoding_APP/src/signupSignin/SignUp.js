import React, { useContext, useState } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Dimensions,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { AuthContext } from '../services/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

const windowWidth = Dimensions.get('window').width;

const SignUp = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [secureEntry, setSecureEntry] = useState(true);
    const { signUp, isLoading } = useContext(AuthContext);

    const handleSignUp = async () => {
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            Alert.alert('Error', 'Invalid email address');
            return;
        }

        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            Alert.alert('Error', 'Invalid phone number. Phone number must be 10 digits');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (email && phone && password) {
            const signUpResponse = await signUp(email, phone, password);
            console.log(signUpResponse ,'signUpResponse')
            if (signUpResponse.success) {                
                navigation.navigate('SignUpForm',{signUpResponse} );
                
            } else if (signUpResponse.message === 'Duplicate Credentials') {
                Alert.alert('Error', 'Email or phone number already registered');
            } else {
                Alert.alert('Error', signUpResponse.message);
            }
        } else {
            Alert.alert('Error', 'All fields are required');
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButtonWrapper} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back-outline" color="#000" size={25} />
            </TouchableOpacity>
            <View style={styles.textContainer}>
                <Text style={styles.headingText}>Let's get started</Text>
            </View>
            <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={30} color="#888" />
                    <TextInput
                        style={styles.textInput}
                        placeholder="Enter your email"
                        placeholderTextColor="#888"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <SimpleLineIcons name="screen-smartphone" size={30} color="#888" />
                    <TextInput
                        style={styles.textInput}
                        placeholder="Enter your phone no"
                        placeholderTextColor="#888"
                        keyboardType="phone-pad"
                        value={phone}
                        onChangeText={setPhone}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <SimpleLineIcons name="lock" size={30} color="#888" />
                    <TextInput
                        style={styles.textInput}
                        placeholder="Enter your password"
                        placeholderTextColor="#888"
                        secureTextEntry={secureEntry}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity onPress={() => setSecureEntry(prev => !prev)}>
                        <SimpleLineIcons name="eye" size={20} color="#888" />
                    </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                    <SimpleLineIcons name="lock" size={30} color="#888" />
                    <TextInput
                        style={styles.textInput}
                        placeholder="Confirm your password"
                        placeholderTextColor="#888"
                        secureTextEntry={secureEntry}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity onPress={() => setSecureEntry((prev) => !prev)}>
                        <SimpleLineIcons name="eye" size={20} color="#888" />
                    </TouchableOpacity>
                </View>
                {isLoading ? (
                    <ActivityIndicator size="large" color="blue" />
                ) : (
                    <TouchableOpacity style={styles.loginButtonWrapper} onPress={handleSignUp}>
                        <Text style={styles.loginText}>Sign-Up</Text>
                    </TouchableOpacity>
                )}
                <Text style={styles.continueText}>or continue with</Text>
                <TouchableOpacity style={styles.googleButtonContainer}>
                    <Image source={require('../images/Google.png')} style={styles.googleImage} />
                    <Text style={styles.googleText}>Google</Text>
                </TouchableOpacity>
                <View style={styles.footerContainer}>
                    <Text style={styles.accountText}>Already have an account!</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                        <Text style={styles.signupText}>Sign-In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default SignUp;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    backButtonWrapper: {
        height: 40,
        width: 40,
        backgroundColor: '#ddd',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        marginVertical: 20,
    },
    headingText: {
        fontSize: 32,
        color: '#000',
        fontWeight: '600',
    },
    formContainer: {
        marginTop: 20,
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
    },
    loginButtonWrapper: {
        backgroundColor: '#45484A',
        borderRadius: 30,
        marginTop: 20,
    },
    loginText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        padding: 10,
    },
    continueText: {
        textAlign: 'center',
        marginVertical: 20,
        fontSize: 14,
        color: '#000',
    },
    googleButtonContainer: {
        flexDirection: 'row',
        borderWidth: 2,
        borderColor: 'blue',
        borderRadius: 30,
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
        fontWeight: '600',
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
        gap: 5,
    },
    accountText: {
        color: '#000',
    },
    signupText: {
        color: 'blue',
        fontWeight: 'bold',
    },
});

// import React, { useContext, useState } from 'react';
// import { StyleSheet, Text, View, Dimensions, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
// import { AuthContext } from '../services/AuthContext';

// const windowWidth = Dimensions.get('window').width;

// const SignUp = ({ navigation }) => {
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const { signUp, isLoading } = useContext(AuthContext);

//   const handleSignUp = async () => {
//     // Basic email format validation
//     const emailRegex = /\S+@\S+\.\S+/;
//     if (!emailRegex.test(email)) {
//       Alert.alert('Error', 'Invalid email address');
//       return;
//     }

//     // Basic phone number format validation
//     const phoneRegex = /^\d{10}$/;
//     if (!phoneRegex.test(phone)) {
//       Alert.alert('Error', 'Invalid phone number. Phone number must be 10 digits');
//       return;
//     }

//     // Other validations and sign up logic
//     if (email && phone && password && password === confirmPassword) {
//       const signUpSuccess = await signUp(email, phone, password);
//       if (signUpSuccess) {
//         navigation.navigate('Home');
//       } else {
//         Alert.alert('Error', 'Sign-up failed. Please try again.');
//       }
//     } else {
//       Alert.alert('Error', 'All fields are required and passwords must match');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Sign Up</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         keyboardType="email-address"
//         autoCapitalize="none"
//         value={email}
//         onChangeText={setEmail}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Phone"
//         keyboardType="phone-pad"
//         value={phone}
//         onChangeText={setPhone}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         secureTextEntry
//         value={password}
//         onChangeText={setPassword}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Confirm Password"
//         secureTextEntry
//         value={confirmPassword}
//         onChangeText={setConfirmPassword}
//       />
//       {isLoading ? (
//         <ActivityIndicator size="large" color="blue" />
//       ) : (
//         <TouchableOpacity style={styles.button} onPress={handleSignUp}>
//           <Text style={styles.buttonText}>Sign Up</Text>
//         </TouchableOpacity>
//       )}
//       <TouchableOpacity onPress={() => navigation.goBack()}>
//         <Text style={styles.linkText}>Back to Sign In</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default SignUp;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color:'#000'
//   },
//   input: {
//     width: windowWidth * 0.8,
//     height: 40,
//     borderWidth: 1,
//     borderColor: 'gray',
//     borderRadius: 5,
//     paddingLeft: 10,
//     marginBottom: 10,
//   },
//   button: {
//     width: windowWidth * 0.8,
//     height: 40,
//     backgroundColor: 'blue',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 5,
//     marginTop: 20,
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   linkText: {
//     color: 'blue',
//     marginTop: 20,
//   },
// });
