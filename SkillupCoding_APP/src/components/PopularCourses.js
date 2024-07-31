import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Image, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const courseUrl = "http://192.168.33.157:5164/skillup_Course";
const enrollUrl = "http://192.168.33.157:5164/skillup_Course";

const PopularCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const navigation = useNavigation(); 

  useEffect(() => {
    fetchCourses(); // Initial fetch when component mounts
    const interval = setInterval(fetchCourses, 60000); // Fetch courses every 60 seconds

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    setError('');
    try {
      const requestData = {
        eventID: "1006",
        addInfo: {
          "req": {}
        }
      };
      const response = await axios.post(courseUrl, requestData);
      if (response.data.rData.rCode === 0) {
        setCourses(response.data.rData.courses[0]); // Assuming courses are an array of objects
      } else {
        setError(response.data.rData.rMessage || 'Failed to fetch courses');
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };
  const enrollCourse = async (courseId) => {
    const userInfoString = await AsyncStorage.getItem('userInfo');
    const userInfo = JSON.parse(userInfoString);
    try {
      const response = await axios.post(enrollUrl, {
        eventID: '1008',
        addInfo: {
          skillup_id: userInfo.rData.id,
          course_id: courseId,
        },
      });

      if (response.data.rData.rCode === 0) {
        // Update enrolledCourses state with the enrolled course id
        setEnrolledCourses([...enrolledCourses, courseId]);
        Alert.alert('Success', 'Course enrolled successfully.');
      } else {
        throw new Error(response.data.rData.rMessage || 'Failed to enroll in course.');
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
      Alert.alert('Error', error.message || 'Failed to enroll in course. Please try again later.');
    }
  };
  const handleEnroll = (courseId) => {
    enrollCourse(courseId);
    // Implement your enroll logic here, e.g., navigate to enrollment screen
  };
  const handleCourseDetails = (courseId) => {
    navigation.navigate('CourseDetails', { courseId });
  };

  const getImageUri = (base64String) => {
    if (base64String.startsWith('/9j/')) {
      return `data:image/jpeg;base64,${base64String}`;
    } else if (base64String.startsWith('iVBORw0KGgo=')) {
      return `data:image/png;base64,${base64String}`;
    } else {
      return `data:image/jpg;base64,${base64String}`; // Default to JPEG if unknown
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Popular Courses</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {courses.map((course, index) => {
            const imageUri = getImageUri(course[6]);
            // console.log(`Image URI for course ${course[1]}: `, imageUri); // Logging image URI
            // console.log(`Base64 String for course ${course[1]}: `, course[6]); // Logging base64 string
            return (
              <TouchableOpacity onPress={() => handleCourseDetails(course[0])} style={styles.item}>
              <View key={index} style={styles.courseCard}>
                <Image
                  source={{ uri: imageUri }}
                  style={styles.courseImage}
                  onError={() => console.log(`Failed to load image for course: ${course[1]}`)}
                />
                <View style={styles.courseDetails}>
                  <Text numberOfLines={1} ellipsizeMode="tail" style={styles.courseTitle}>{course[1]}</Text>
                  <Text numberOfLines={1} ellipsizeMode="tail" style={styles.courseDescription}>{course[2]}</Text>
                  <TouchableOpacity style={styles.enrollButton} onPress={() => handleEnroll(course[0])}>
                    <Text style={styles.enrollButtonText}>Enroll Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
              </TouchableOpacity>
              
            );
          })}
        </ScrollView>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 10,
  },
  header: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
    color: 'red',
  },
  courseCard: {
    width: 200,
    height: 200, // Increased height to accommodate larger images
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    elevation: 2, // for Android shadow
    shadowColor: '#000', // for iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  courseImage: {
    width: '100%',
    height: 90, // Increased image height
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  courseDetails: {
    padding: 10,
    flexDirection: 'column', // Ensure text elements are aligned vertically
    justifyContent: 'space-between', // Align elements with space between them
    flex: 1,
  },
  courseTitle: {
    fontSize: 16, // Decreased font size
    fontWeight: 'bold',
    marginBottom: 2, // Add spacing between title and description
  },
  courseDescription: {
    fontSize: 14, // Decreased font size
    lineHeight: 18,
    marginBottom: 5, // Add spacing between description and button
  },
  enrollButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  enrollButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PopularCourses;

// import React, { useEffect, useState } from 'react';
// import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Image, TouchableOpacity, Alert } from 'react-native';
// import axios from 'axios';

// const courseUrl = "http://192.168.33.157:5164/skillup_Course";

// const PopularCourses = () => {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   const fetchCourses = async () => {
//     setLoading(true);
//     try {
//       const requestData = {
//         eventID: "1006",
//         addInfo: {
//           "req": {}
//         }
//       };
//       const response = await axios.post(courseUrl, requestData);
//       if (response.data.rData.rCode === 0) {
//         setCourses(response.data.rData.courses[0]); // Assuming courses are an array of objects
//       } else {
//         setError(response.data.rData.rMessage || 'Failed to fetch courses');
//       }
//     } catch (error) {
//       setError(error.message || 'Failed to fetch courses');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEnroll = (courseId) => {
//     Alert.alert('Enroll', `Enroll button clicked for course ID: ${courseId}`);
//     // Implement your enroll logic here, e.g., navigate to enrollment screen
//   };

//   const getImageUri = (base64String) => {
//     if (base64String.startsWith('/9j/')) {
//       return `data:image/jpeg;base64,${base64String}`;
//     } else if (base64String.startsWith('iVBORw0KGgo=')) {
//       return `data:image/png;base64,${base64String}`;
//     } else {
//       return `data:image/jpg;base64,${base64String}`; // Default to JPEG if unknown
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>Popular Courses</Text>
//       </View>

//       {loading ? (
//         <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
//       ) : error ? (
//         <Text style={styles.errorText}>{error}</Text>
//       ) : (
//         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//           {courses.map((course, index) => {
//             const imageUri = getImageUri(course[6]);
//             // console.log(`Image URI for course ${course[1]}: `, imageUri); // Logging image URI
//             // console.log(`Base64 String for course ${course[1]}: `, course[6]); // Logging base64 string
//             return (
//               <View key={index} style={styles.courseCard}>
//                 <Image
//                   source={{ uri: imageUri }}
//                   style={styles.courseImage}
//                   onError={() => console.log(`Failed to load image for course: ${course[1]}`)}
//                 />
//                 <View style={styles.courseDetails}>
//                   <Text numberOfLines={1} ellipsizeMode="tail" style={styles.courseTitle}>{course[1]}</Text>
//                   <Text numberOfLines={1} ellipsizeMode="tail" style={styles.courseDescription}>{course[2]}</Text>
//                   <TouchableOpacity style={styles.enrollButton} onPress={() => handleEnroll(course[0])}>
//                     <Text style={styles.enrollButtonText}>Enroll Now</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             );
//           })}
//         </ScrollView>
//       )}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     paddingVertical: 10,
//   },
//   header: {
//     paddingHorizontal: 10,
//     marginBottom: 10,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   loader: {
//     marginTop: 20,
//   },
//   errorText: {
//     textAlign: 'center',
//     marginTop: 10,
//     fontSize: 16,
//     color: 'red',
//   },
//   courseCard: {
//     width: 200,
//     height: 200, // Increased height to accommodate larger images
//     marginHorizontal: 10,
//     padding: 10,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     backgroundColor: '#fff',
//     elevation: 2, // for Android shadow
//     shadowColor: '#000', // for iOS shadow
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   courseImage: {
//     width: '100%',
//     height: 90, // Increased image height
//     borderTopLeftRadius: 8,
//     borderTopRightRadius: 8,
//   },
//   courseDetails: {
//     padding: 10,
//     flexDirection: 'column', // Ensure text elements are aligned vertically
//     justifyContent: 'space-between', // Align elements with space between them
//     flex: 1,
//   },
//   courseTitle: {
//     fontSize: 16, // Decreased font size
//     fontWeight: 'bold',
//     marginBottom: 2, // Add spacing between title and description
//   },
//   courseDescription: {
//     fontSize: 14, // Decreased font size
//     lineHeight: 18,
//     marginBottom: 5, // Add spacing between description and button
//   },
//   enrollButton: {
//     backgroundColor: '#007AFF',
//     paddingVertical: 5,
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   enrollButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default PopularCourses;


// import React, { useEffect, useState } from 'react';
// import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Image, TouchableOpacity, Alert } from 'react-native';
// import axios from 'axios';

// const courseUrl = "http://192.168.33.157:5164/skillup_Course";

// const PopularCourses = () => {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   const fetchCourses = async () => {
//     setLoading(true);
//     try {
//       const requestData = {
//         eventID: "1006",
//         addInfo: {
//           "req": {}
//         }
//       };
//       const response = await axios.post(courseUrl, requestData);
//       if (response.data.rData.rCode === 0) {
//         setCourses(response.data.rData.courses[0]); // Assuming courses are an array of objects
//       } else {
//         setError(response.data.rData.rMessage || 'Failed to fetch courses');
//       }
//     } catch (error) {
//       setError(error.message || 'Failed to fetch courses');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEnroll = (courseId) => {
//     Alert.alert('Enroll', `Enroll button clicked for course ID: ${courseId}`);
//     // Implement your enroll logic here, e.g., navigate to enrollment screen
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>Popular Courses</Text>
//       </View>

//       {loading ? (
//         <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
//       ) : error ? (
//         <Text style={styles.errorText}>{error}</Text>
//       ) : (
//         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//           {courses.map((course, index) => (
//             <View key={index} style={styles.courseCard}>
//               <Image source={{ uri: `data:image/png;base64,${course[6]}` }} style={styles.courseImage} onError={() => console.log('Failed to load image')}/>
//               <View style={styles.courseDetails}>
//                 <Text numberOfLines={1} ellipsizeMode="tail" style={styles.courseTitle}>{course[1]}</Text>
//                 <Text numberOfLines={1} ellipsizeMode="tail" style={styles.courseDescription}>{course[2]}</Text>
//                 <TouchableOpacity style={styles.enrollButton} onPress={() => handleEnroll(course[0])}>
//                   <Text style={styles.enrollButtonText}>Enroll Now</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           ))}
//         </ScrollView>
//       )}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     paddingVertical: 10,

//   },
//   header: {
//     paddingHorizontal: 10,
//     marginBottom: 10,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   loader: {
//     marginTop: 20,
//   },
//   errorText: {
//     textAlign: 'center',
//     marginTop: 20,
//     fontSize: 16,
//     color: 'red',
//   },
//   courseCard: {
//     width: 200,
//     height: 200,
//     marginHorizontal: 10,
//     padding: 10,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     backgroundColor: '#fff',
//     elevation: 2, // for Android shadow
//     shadowColor: '#000', // for iOS shadow
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   courseImage: {
//     width: '90%',
//     height: 80,
//     borderTopLeftRadius: 8,
//     borderTopRightRadius: 8,
//   },
//   courseDetails: {
//     padding: 10,
//     flexDirection: 'column', // Ensure text elements are aligned vertically
//     justifyContent: 'space-between', // Align elements with space between them
//     flex: 1,
//   },
//   courseTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 5, // Add spacing between title and description
//   },
//   courseDescription: {
//     fontSize: 16,
//     lineHeight: 20,
//     marginBottom: 10, // Add spacing between description and button
//   },
//   enrollButton: {
//     backgroundColor: '#007AFF',
//     paddingVertical: 5,
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   enrollButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default PopularCourses;
