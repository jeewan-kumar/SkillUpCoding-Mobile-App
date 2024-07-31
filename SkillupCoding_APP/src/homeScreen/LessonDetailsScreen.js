
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const LessonDetailsScreen = ({ route }) => {
  const { lesson } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.course_id}>{lesson.course_id}</Text>
      <Text style={styles.title}>{lesson.title}</Text>
      <Text style={styles.description}>{lesson.description}</Text>
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
  content: {
    fontSize: 16,
  },
});

export default LessonDetailsScreen;
