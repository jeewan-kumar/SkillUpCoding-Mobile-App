// src/components/Screens/CourseDetailsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Button, ScrollView } from 'react-native';
import { getCourseById } from '../services/courses';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const CourseDetailsScreen = ({ route, navigation }) => {
  const { courseId } = route.params;
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseData = await getCourseById(courseId);
        setCourse(courseData);
      } catch (e) {
        setError('Failed to load course details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleEnroll = () => {
    // Simulate enrollment action
    alert('You have enrolled in this course.');
  };

  const renderLesson = ({ item }) => (
    <TouchableOpacity style={styles.lessonItem}>
      <Text style={styles.lessonTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  if (loading) return <Loader />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{course.title}</Text>
      <Text style={styles.description}>{course.description}</Text>
      <Text style={styles.details}>{course.details}</Text>
      <Button title="Enroll in Course" onPress={handleEnroll} />
      <Text style={styles.sectionTitle}>Lessons</Text>
      <FlatList
        data={course.lessons}
        renderItem={renderLesson}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.lessonList}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    marginBottom: 10,
  },
  details: {
    fontSize: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  lessonList: {
    paddingBottom: 20,
  },
  lessonItem: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
    elevation: 2,
  },
  lessonTitle: {
    fontSize: 16,
  },
});

export default CourseDetailsScreen;
