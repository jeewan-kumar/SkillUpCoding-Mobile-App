import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const CourseDetails = ({ navigation, route }) => {
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const { courseId } = route.params;  // Ensure courseId is passed through navigation parameters

  useEffect(() => {
    fetchCourseDetails();
  }, []);

  const fetchCourseDetails = async () => {
    try {
      const response = await fetch('http://192.168.33.157:5164/skillup_Course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventID: '10012',
          addInfo: {
            course_id: courseId
          }
        })
      });
      const data = await response.json();
      if (data.rData.rCode === 0) {
        setCourseDetails(data.rData.course_details);
      } else {
        console.error(data.rData.rMessage);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSyllabusItemClick = (lessonId) => {
    // You can navigate to a detailed view or perform an action based on the lessonId
    console.log(`Clicked on syllabus item with lessonId: ${lessonId}`);
    navigation.navigate('VideoPlayer', { lessonId });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />;
  }

  if (!courseDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load course details.</Text>
      </View>
    );
  }

  const courseInfo = courseDetails[0];
  const syllabusItems = courseDetails.slice(1);

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-left" size={24} style={styles.backIcon} />
        <Text style={styles.backText}>Back to Courses</Text>
      </TouchableOpacity>
      <Image source={{ uri: `data:image/png;base64,${courseInfo[0][1]}` }} style={styles.image} />
      <View style={styles.courseInfo}>
        <Text style={styles.title}>{courseInfo[1][2]}</Text>
        <Text style={styles.subtitle}>{courseInfo[1][3]}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Course Syllabus</Text>
        {courseInfo.map((courseInfo, index) => (
          <TouchableOpacity
            key={index}
            style={styles.syllabusItem}
            onPress={() => handleSyllabusItemClick(courseInfo[0])} // Assuming syllabusItem[0] contains lesson_id
          >
            <Text style={styles.syllabusText}>{courseInfo[4]}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* <TouchableOpacity style={styles.enrollButton}>
        <Text style={styles.enrollButtonText}>Enroll Now</Text>
      </TouchableOpacity> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  loadingIndicator: {
    marginTop: 50,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'red',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backIcon: {
    color: '#007AFF',
  },
  backText: {
    fontSize: 18,
    color: '#007AFF',
    marginLeft: 8,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 16,
    borderRadius: 8,
  },
  courseInfo: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  syllabusItem: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  syllabusText: {
    fontSize: 16,
  },
  enrollButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  enrollButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CourseDetails;



// import React from 'react';
// import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';

// const CourseDetails = ({ navigation }) => {
//   return (
//     <ScrollView style={styles.container}>
//       <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>      
//       <Text> <Icon name="arrow-left" size={24} style={styles.icon} /> Course Details </Text>
//       </TouchableOpacity>
//       <Image source={{ uri: 'https://via.placeholder.com/300' }} style={styles.image} />
//       <Text style={styles.title}>Principle of Java Language</Text>
//       <Text style={styles.subtitle}>3:40hrs   12 Lessons</Text>
//       <Text style={styles.sectionTitle}>Description</Text>
//       <Text style={styles.description}>
//         The aim of the UI/UX course is to provide students with the knowledge of user-centered design, user-centered methods in design, graphic design on screens, simulation and prototyping techniques, usability testing methods, interactive technologies and user-centered design in corporate perspective.
//       </Text>
//       <Text style={styles.sectionTitle}>Course Syllabus</Text>
//       <View style={styles.syllabusItem}>
//         <Text>Visual Design Principles</Text>
//       </View>
//       <View style={styles.syllabusItem}>
//         <Text>Information Design and Data Visualization</Text>
//       </View>
//       <View style={styles.syllabusItem}>
//         <Text>Interaction Design</Text>
//       </View>
//       <View style={styles.syllabusItem}>
//         <Text>Information Architecture</Text>
//       </View>
//       <View style={styles.syllabusItem}>
//         <Text>Wire Framing & Storyboarding</Text>
//       </View>
//       <View style={styles.syllabusItem}>
//         <Text>Elements and Widgets</Text>
//       </View>
//       <View style={styles.syllabusItem}>
//         <Text>Screen Design and Layouts</Text>
//       </View>
//       <View style={styles.syllabusItem}>
//         <Text>Hands-on Assignments and Quiz</Text>
//       </View>
//       <TouchableOpacity style={styles.enrollButton}>
//         <Text style={styles.enrollButtonText}>Enroll Now</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#fff',
//   },
//   backButton: {
//     marginBottom: 16,
//   },
//   image: {
//     width: '100%',
//     height: 200,
//     marginBottom: 16,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: 'gray',
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginVertical: 8,
//   },
//   description: {
//     fontSize: 16,
//     color: 'gray',
//     marginBottom: 16,
//   },
//   syllabusItem: {
//     padding: 16,
//     backgroundColor: '#f0f0f0',
//     marginVertical: 4,
//   },
//   enrollButton: {
//     padding: 16,
//     backgroundColor: 'green',
//     alignItems: 'center',
//     marginVertical: 16,
//   },
//   enrollButtonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
// });

// export default CourseDetails;
