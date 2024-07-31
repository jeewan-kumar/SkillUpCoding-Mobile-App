import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, FlatList, Image } from 'react-native';
import axios from 'axios';

const certificatesUrl = "http://192.168.33.157:5164/skillup_Certificates";

const CertificatesPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    setLoading(true);
    setError('');
    try {
      const requestData = {
        eventID: "1008", // Adjust eventID as per your API requirement
        addInfo: {
          "skillup_id": 1, // Adjust skillup_id as per your API requirement
        }
      };
      const response = await axios.post(certificatesUrl, requestData);
      if (response.data.rData.rCode === 0) {
        setCertificates(response.data.rData.certificates || []); // Assuming certificates are an array of objects
      } else {
        setError(response.data.rData.rMessage || 'Failed to fetch certificates');
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch certificates');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image source={{ uri: getImageUri(item[6]) }} style={styles.certificateImage} />
      <View style={styles.certificateDetails}>
        <Text style={styles.certificateTitle}>{item[1]}</Text>
        <Text style={styles.certificateDescription}>{item[2]}</Text>
      </View>
    </View>
  );

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
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={certificates}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
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
  certificateImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  certificateDetails: {
    paddingLeft: 10,
    flex: 1,
    justifyContent: 'center',
  },
  certificateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  certificateDescription: {
    fontSize: 14,
    color: '#555',
  },
});

export default CertificatesPage;
