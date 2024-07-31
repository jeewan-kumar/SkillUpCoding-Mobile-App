import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Image, TouchableOpacity, Alert, FlatList } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../services/AuthContext';
import { useNavigation } from '@react-navigation/native';

const courseUrl = "http://192.168.33.157:5164/skillup_Course";

const EnrolledCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const navigation = useNavigation(); 

  useEffect(() => {
    fetchCourses();

    const intervalId = setInterval(fetchCourses, 60000); // Fetch courses every 60 seconds

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, []);

  const fetchCourses = async () => {
    const userInfoString = await AsyncStorage.getItem('userInfo');
    const userInfo = JSON.parse(userInfoString);
    setLoading(true);
    setError('');
    try {
      const requestData = {
        eventID: "1007",
        addInfo: {
          "skillup_id": userInfo.rData.id
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

  const handleEnroll = (courseId) => {
    Alert.alert('Enroll', `Enroll button clicked for course ID: ${courseId}`);
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

  const Item = ({ item, onPress }) => (
    <TouchableOpacity onPress={() => handleCourseDetails(item[0])} style={styles.item}>
      <Image source={{ uri: getImageUri(item[6]) }} style={styles.courseImage} onError={() => console.log(`Failed to load image for course: ${item[1]}`)} />
      <View style={styles.courseDetails}>
        <Text numberOfLines={1} style={styles.courseTitle}>{item[1]}</Text>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.courseDescription}>{item[2]}</Text>
        <TouchableOpacity style={styles.enrollButton} onPress={() => handleCourseDetails(item[0])}>
          <Text style={styles.enrollButtonText}>Start Now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <Item
      item={item}
      onPress={() => setSelectedId(item[0])}
    />
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={courses}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          extraData={selectedId}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
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
  item: {
    flexDirection: 'row',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  courseImage: {
    width: 150,
    height: 90,
    borderRadius: 8,
  },
  courseDetails: {
    paddingLeft: 10,
    flex: 1,
    justifyContent: 'space-between',
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#333',
  },
  courseDescription: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 5,
    color: '#555',
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

export default EnrolledCourses;
