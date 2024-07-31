import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const CourseCard = ({ title, lessons, image, isPopular, navigation }) => {
  return (
    <TouchableOpacity style={[styles.card, isPopular && styles.popularCard]} onPress={() => {
      navigation.navigate('CourseDetails', {
        title: title,
        lessons: lessons,
        image

      })
    }} >
      <Image source={image} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.lessons}>{lessons}</Text>
        <TouchableOpacity style={styles.enrollButton}>
          <Text style={styles.enrollText}>Enroll Now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  popularCard: {
    backgroundColor: '#6200EE',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  info: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  lessons: {
    fontSize: 14,
    color: '#888',
    marginVertical: 5,
  },
  enrollButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 5,
    alignSelf: 'flex-start',
  },
  enrollText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default CourseCard;
