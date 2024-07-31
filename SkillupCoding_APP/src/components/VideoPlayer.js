// import React from 'react';
// import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

// const VideoPlayer = ({ navigation }) => {
//   return (
//     <ScrollView style={styles.container}>
//       <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//         <Text>←</Text>
//       </TouchableOpacity>
//       <Text style={styles.courseTitle}>Principle of Java Language</Text>
//       <Image source={{ uri: 'https://via.placeholder.com/300' }} style={styles.videoThumbnail} />
//       <Text style={styles.title}>Introduction</Text>
//       <Text style={styles.subtitle}>Tutor - John Doe</Text>
//       <Text style={styles.subtitle}>9 Lessons   1:10mins</Text>
//       <View style={styles.lessonItem}>
//         <Text style={styles.lessonNumber}>01</Text>
//         <View>
//           <Text style={styles.lessonTitle}>Introduction</Text>
//           <Text style={styles.lessonDescription}>Introduction to the interface</Text>
//         </View>
//         <TouchableOpacity style={styles.playButton}>
//           <Text>▶</Text>
//         </TouchableOpacity>
//       </View>
//       <View style={styles.lessonItem}>
//         <Text style={styles.lessonNumber}>02</Text>
//         <View>
//           <Text style={styles.lessonTitle}>Getting Started</Text>
//           <Text style={styles.lessonDescription}>Getting to know how to navigate</Text>
//         </View>
//         <TouchableOpacity style={styles.playButton}>
//           <Text>▶</Text>
//         </TouchableOpacity>
//       </View>
//       <View style={styles.lessonItem}>
//         <Text style={styles.lessonNumber}>03</Text>
//         <View>
//           <Text style={styles.lessonTitle}>Layers</Text>
//           <Text style={styles.lessonDescription}>How layers work</Text>
//         </View>
//         <TouchableOpacity style={styles.playButton}>
//           <Text>▶</Text>
//         </TouchableOpacity>
//       </View>
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
//   courseTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
//   videoThumbnail: {
//     width: '100%',
//     height: 200,
//     marginBottom: 16,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: 'gray',
//     marginBottom: 16,
//   },
//   lessonItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#f0f0f0',
//     marginVertical: 4,
//   },
//   lessonNumber: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginRight: 16,
//   },
//   lessonTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   lessonDescription: {
//     fontSize: 14,
//     color: 'gray',
//   },
//   playButton: {
//     marginLeft: 'auto',
//   },
// });

// export default VideoPlayer;

// import React, { useState, useEffect } from 'react';
// import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';

// const VideoPlayer = ({ navigation, route }) => {
//   const { lessonId } = route.params;  // Retrieve the lessonId from navigation parameters
//   const [lessonDetails, setLessonDetails] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchLessonDetails();
//   }, []);

//   const fetchLessonDetails = async () => {
//     try {
//       const response = await fetch('http://192.168.33.157:5164/skillup_UserProfile', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           eventID: '1005',
//           addInfo: {
//             lesson_id: lessonId,
//           },
//         }),
//       });
//       const result = await response.json();
//       if (result.rStatus === 0) {
//         setLessonDetails(result.rData);
//       } else {
//         // Handle error response
//         console.error('Error fetching lesson details:', result.rMessage);
//       }
//     } catch (error) {
//       console.error('Error fetching lesson details:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loader}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   return (
//     <ScrollView style={styles.container}>
//       <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//         <Text>←</Text>
//       </TouchableOpacity>
//       <Text style={styles.courseTitle}>{lesson[0][1]}</Text>
//       <Image source={{ uri: 'https://via.placeholder.com/300' }} style={styles.videoThumbnail} />
//       <Text style={styles.title}>Introduction</Text>
//       <Text style={styles.subtitle}>Tutor - John Doe</Text>
//       <Text style={styles.subtitle}>9 Lessons   1:10mins</Text>
//       {/* {lessonDetails && lessonDetails.lessons.map((lesson, index) => (
//         <View key={index} style={styles.lessonItem}>
//           <Text style={styles.lessonNumber}>{index + 1}</Text>
//           <View>
//             <Text style={styles.lessonTitle}>{lesson[1]}</Text>
//             <Text style={styles.lessonDescription}>{lesson[2]}</Text>
//           </View>
//           <TouchableOpacity style={styles.playButton}>
//             <Text>▶</Text>
//           </TouchableOpacity>
//         </View>
//       ))} */}
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
//   courseTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
//   videoThumbnail: {
//     width: '100%',
//     height: 200,
//     marginBottom: 16,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: 'gray',
//     marginBottom: 16,
//   },
//   lessonItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#f0f0f0',
//     marginVertical: 4,
//   },
//   lessonNumber: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginRight: 16,
//   },
//   lessonTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   lessonDescription: {
//     fontSize: 14,
//     color: 'gray',
//   },
//   playButton: {
//     marginLeft: 'auto',
//   },
//   loader: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default VideoPlayer;


import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import BackButton from './BackButton';
import Icon from 'react-native-vector-icons/FontAwesome';

const VideoPlayer = ({ navigation, route }) => {
  const { lessonId } = route.params;  // Retrieve the lessonId from navigation parameters
  const [videoDetails, setVideoDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideoDetails();
  }, []);

  const fetchVideoDetails = async () => {
    try {
      const response = await fetch('http://192.168.33.157:5164/skillup_Video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventID: '1005',
          addInfo: {
            lesson_id: lessonId
          }
        })
      });
      const data = await response.json();
      if (data.rData.rCode === 0) {
        setVideoDetails(data.rData.lessons);
      } else {
        console.error(data.rData.rMessage);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />;
  }

  if (!videoDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load video details.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
      <Icon name="arrow-left" size={24} style={styles.backIcon} />
      <Text style={styles.backText}>Back to Lessons</Text>
      </TouchableOpacity>
      <Text style={styles.courseTitle}>{videoDetails[0][1]}</Text>
      {videoDetails.map((video) => (
        <View key={video[0]} style={styles.videoContainer}>
          <Image source={{ uri: `data:image/png;base64,${video[2]}` }} style={styles.videoThumbnail} />
          <Text style={styles.title}>{video[3]}</Text>
          <Text style={styles.subtitle}>Duration: {video[5]}</Text>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => navigation.navigate('WebViewScreen', { videoUrl: video[4] })}
          >
            <Text style={styles.playButtonText}>▶ Play</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },backText: {
    fontSize: 18,
    color: '#007AFF',
    marginLeft: 8,
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
  videoContainer: {
    marginBottom: 24,
  },
  courseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  videoThumbnail: {
    width: '100%',
    height: 200,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 16,
  },
  playButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  playButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default VideoPlayer;
