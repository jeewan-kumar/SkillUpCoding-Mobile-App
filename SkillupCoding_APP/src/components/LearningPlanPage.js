import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';

const learningPlanUrl = "http://192.168.33.157:5164/skillup_LearningPlan";

const LearningPlanPage = () => {
  const [learningPlan, setLearningPlan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLearningPlan();
  }, []);

  const fetchLearningPlan = async () => {
    setLoading(true);
    setError('');
    try {
      const requestData = {
        eventID: "1002",
        addInfo: {
          skillup_id: 1,
          course_id: 1
        }
      };
      const response = await axios.post(learningPlanUrl, requestData);
      if (response.data.rData.rCode === 0) {
        setLearningPlan(response.data.rData.learningPlan || []);
      } else {
        setError(response.data.rData.rMessage || 'Failed to fetch learning plan');
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch learning plan');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item}>
      <Text style={styles.goalText}>{item.goal}</Text>
      <Text style={styles.descriptionText}>{item.description}</Text>
    </TouchableOpacity>
  );

  return ( <ScrollView>
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={learningPlan}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
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
  goalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  descriptionText: {
    fontSize: 14,
    color: '#555',
  },
});

export default LearningPlanPage;
