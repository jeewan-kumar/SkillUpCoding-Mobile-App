import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ErrorMessage = ({ error }) => (
  error ? <View style={styles.container}><Text style={styles.text}>{error}</Text></View> : null
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8d7da',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  text: {
    color: '#721c24',
  },
});

export default ErrorMessage;
