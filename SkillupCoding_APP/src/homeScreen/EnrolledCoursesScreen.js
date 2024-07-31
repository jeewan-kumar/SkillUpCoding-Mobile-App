
import { StyleSheet, Text, View } from 'react-native'
import EnrolledCourses from '../components/EnrolledCourses'
const EnrolledCoursesScreen = () => {
  return (
   <EnrolledCourses/>
  )
}
export default EnrolledCoursesScreen
const styles = StyleSheet.create({})



// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
// import { getCourses } from '../services/courses';
// import Loader from '../components/Loader';
// import ErrorMessage from '../components/ErrorMessage';

// const EnrolledCoursesScreen = ({ route, navigation }) => {
//   const { enrolledCourses } = route.params; // Extracting enrolledCourses from route.params
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const allCourses = await getCourses();
//         const enrolledCoursesData = allCourses.filter(course => enrolledCourses.includes(course.id));
//         setCourses(enrolledCoursesData);
//       } catch (e) {
//         setError('Failed to load enrolled courses.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourses();
//   }, [enrolledCourses]);

//   const renderItem = ({ item }) => (
//     <TouchableOpacity
//       style={styles.courseItem}
//       onPress={() => navigation.navigate('CourseDetails', { courseId: item.id })}
//     >
//       <Text style={styles.courseTitle}>{item.title}</Text>
//       <Text style={styles.courseDescription}>{item.description}</Text>
//     </TouchableOpacity>
//   );

//   if (loading) return <Loader />;

//   if (error) return <ErrorMessage error={error} />;

//   // Render a message when there are no enrolled courses
//   if (courses.length === 0) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.title}>Enrolled Courses</Text>
//         <Text style={styles.message}>No enrolled courses found.</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={courses}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id.toString()}
//         contentContainerStyle={styles.courseList}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f8f8f8',
//     justifyContent: 'center', // Center items vertically
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   message: {
//     fontSize: 16,
//     textAlign: 'center',
//     marginTop: 20,
//   },
//   courseList: {
//     paddingBottom: 20,
//   },
//   courseItem: {
//     padding: 15,
//     backgroundColor: '#fff',
//     borderRadius: 5,
//     marginBottom: 10,
//     elevation: 2,
//   },
//   courseTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   courseDescription: {
//     fontSize: 14,
//     color: '#666',
//   },
// });

// export default EnrolledCoursesScreen;
