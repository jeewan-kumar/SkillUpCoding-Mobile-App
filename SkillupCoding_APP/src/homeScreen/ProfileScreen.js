import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../services/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const { logout } = useContext(AuthContext);

  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // useEffect(() => {
  //   fetchData(); // Fetch data when component mounts
  // }, []);

  // const fetchData = async () => {
  // //  const userInfo = await AsyncStorage.getItem('userInfo', JSON.stringify(userInfo));
  // //  console.log(userInfo ,'userInfo1111')

  //   const userInfoString = await AsyncStorage.getItem('userInfo');
  //   const userInfo = JSON.parse(userInfoString);
  //   try {
  //     const response = await fetch('http://192.168.33.157:5164/skillup_UserProfile', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         eventID: "1006",
  //         addInfo: {
  //           skillup_id: userInfo.rData.id
  //         }
  //       }),
  //     });
  //     const jsonResponse = await response.json();
  //     // console.log('API Response:', jsonResponse);
      
  //     if (jsonResponse.rStatus === 0 && jsonResponse.rData && jsonResponse.rData.profile) {
  //       const userArray = jsonResponse.rData.profile[0];
  //       // console.log('User Array:', userArray);
        
  //       if (userArray && userArray.length > 0) {
  //         const user = {
  //           profile_picture: userArray[0],
  //           first_name: userArray[1],
  //           last_name: userArray[2],
  //           date_of_birth: userArray[3],
  //           bio: userArray[4],
  //           email: userArray[5],
  //           phone_number: userArray[6],
  //           name: userArray[7],
  //           gender: userArray[8]
  //         };
  //         // console.log('User Data:', user);
          
  //         setUserData(user);
  //       } else {
  //         console.error('No user data found in profile array');
  //       }
  //     } else {
  //       console.error('Invalid response structure or rStatus is not 0');
  //     }
  //     setLoading(false);
  //   } catch (error) {
  //     console.error('Error fetching user profile:', error);
  //     setLoading(false);
  //   }
  // };

  // if (loading) {
  //   return (
  //     <View style={styles.container}>
  //       <Text>Loading...</Text>
  //     </View>
  //   );
  // }

  // if (!userData) {
  //   return (
  //     <View style={styles.container}>
  //       <Text>No data available</Text>
  //     </View>
  //   );
  // }

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
            await logout(); // Call logout function from AuthContext
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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* <View style={styles.profileInfo}>
        {userData.profile_picture && (
          <Image
            source={{ uri: `data:image/jpeg;base64,${userData.profile_picture}` }}
            style={styles.image}
          />
        )}
        <Text style={styles.name}>{userData.name}</Text>
        <Text style={styles.email}>{userData.email}</Text>
      </View> */}

      {/* Navigation Buttons */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Profile')}>
        <Ionicons name="person-outline" size={25} style={styles.icon} />
        <Text style={styles.buttonText}>My Account</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Search')}>
        <Ionicons name="compass-outline" size={25} style={styles.icon} />
        <Text style={styles.buttonText}>Explore Courses</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EnrolledCourses')}>
        <Ionicons name="book-outline" size={25} style={styles.icon} />
        <Text style={styles.buttonText}>My Courses</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('LearningPlan')}>
        <Ionicons name="reader-outline" size={25} style={styles.icon} />
        <Text style={styles.buttonText}>Learning Plan</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MyCertificates')}>
        <Ionicons name="ribbon-outline" size={25} style={styles.icon} />
        <Text style={styles.buttonText}>My Certificates</Text>
      </TouchableOpacity> */}

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('About')}>
        <Ionicons name="person-outline" size={25} style={styles.icon} />
        <Text style={styles.buttonText}>About Skillup Coding</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Settings')}>
        <Ionicons name="settings-outline" size={25} style={styles.icon} />
        <Text style={styles.buttonText}>Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ReportProblem')}>
        <Ionicons name="person-outline" size={25} style={styles.icon} />
        <Text style={styles.buttonText}>Report Problem</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Help')}>
        <Ionicons name="help-circle-outline" size={25} style={styles.icon} />
        <Text style={styles.buttonText}>Help</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
        <Ionicons name="log-out-outline" size={25} style={styles.icon} />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#DDDDDD',
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    marginLeft: 12,
  },
  icon: {
    color: '#007AFF',
    marginLeft: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'red',
    borderRadius: 8,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 20,
  },
});

export default ProfileScreen;


// import React, { useContext, useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Image, ActivityIndicator } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { useNavigation } from '@react-navigation/native';
// import { AuthContext } from '../services/AuthContext';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const ProfileScreen = () => {
//   const { logout } = useContext(AuthContext);
//   const navigation = useNavigation();
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true); // Set loading to true initially

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const userInfoString = await AsyncStorage.getItem('userInfo');
//       const userInfo = JSON.parse(userInfoString);
//       const response = await fetch('http://192.168.33.157:5164/skillup_UserProfile', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           eventID: "1006",
//           addInfo: {
//             skillup_id: userInfo.rData.id
//           }
//         }),
//       });
//       const jsonResponse = await response.json();
//       if (jsonResponse.rStatus === 0 && jsonResponse.rData && jsonResponse.rData.profile) {
//         const userArray = jsonResponse.rData.profile[0];
//         if (userArray && userArray.length > 0) {
//           const user = {
//             profile_picture: userArray[0],
//             first_name: userArray[1],
//             last_name: userArray[2],
//             date_of_birth: userArray[3],
//             bio: userArray[4],
//             email: userArray[5],
//             phone_number: userArray[6],
//             name: userArray[7],
//             gender: userArray[8]
//           };
//           setUserData(user);
//         } else {
//           console.error('No user data found in profile array');
//         }
//       } else {
//         console.error('Invalid response structure or rStatus is not 0');
//       }
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching user profile:', error);
//       setLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     Alert.alert(
//       'Logout',
//       'Are you sure you want to logout?',
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel',
//         },
//         {
//           text: 'OK',
//           onPress: async () => {
//             await logout();
//             navigation.reset({
//               index: 0,
//               routes: [{ name: 'SignIn' }],
//             });
//           },
//           style: 'destructive',
//         },
//       ],
//       { cancelable: false }
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="blue" />
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.scrollContainer}>
//       {userData && (
//         <View style={styles.profileInfo}>
//           {userData.profile_picture && (
//             <Image
//               source={{ uri: `data:image/jpeg;base64,${userData.profile_picture}` }}
//               style={styles.image}
//             />
//           )}
//           <Text style={styles.name}>{userData.name}</Text>
//           <Text style={styles.email}>{userData.email}</Text>
//         </View>
//       )}

//       <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Profile')}>
//         <Ionicons name="person-outline" size={25} style={styles.icon} />
//         <Text style={styles.buttonText}>My Account</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Search')}>
//         <Ionicons name="compass-outline" size={25} style={styles.icon} />
//         <Text style={styles.buttonText}>Explore Courses</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EnrolledCourses')}>
//         <Ionicons name="book-outline" size={25} style={styles.icon} />
//         <Text style={styles.buttonText}>My Courses</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('About')}>
//         <Ionicons name="information-circle-outline" size={25} style={styles.icon} />
//         <Text style={styles.buttonText}>About SkillUp Coding</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Settings')}>
//         <Ionicons name="settings-outline" size={25} style={styles.icon} />
//         <Text style={styles.buttonText}>Settings</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ReportProblem')}>
//         <Ionicons name="alert-circle-outline" size={25} style={styles.icon} />
//         <Text style={styles.buttonText}>Report Problem</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Help')}>
//         <Ionicons name="help-circle-outline" size={25} style={styles.icon} />
//         <Text style={styles.buttonText}>Help</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
//         <Ionicons name="log-out-outline" size={25} style={styles.icon} />
//         <Text style={styles.logoutText}>Log Out</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   scrollContainer: {
//     flexGrow: 1,
//     padding: 16,
//     backgroundColor: '#fff',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   profileInfo: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   name: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   email: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   button: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 16,
//     paddingHorizontal: 20,
//     backgroundColor: '#DDDDDD',
//     marginBottom: 12,
//     borderRadius: 8,
//     elevation: 2,
//   },
//   buttonText: {
//     fontSize: 16,
//     marginLeft: 12,
//   },
//   icon: {
//     color: '#007AFF',
//   },
//   logoutButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 16,
//     paddingHorizontal: 20,
//     backgroundColor: 'red',
//     borderRadius: 8,
//     elevation: 2,
//     marginBottom: 20,
//   },
//   logoutText: {
//     fontSize: 16,
//     color: 'white',
//     fontWeight: 'bold',
//     marginLeft: 10,
//   },
//   image: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     alignSelf: 'center',
//     marginBottom: 20,
//   },
// });

// export default ProfileScreen;
