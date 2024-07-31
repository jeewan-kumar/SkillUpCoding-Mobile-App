
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const SearchBar = ({ query, onSearch }) => {
  return (
    <View style={styles.container}>
      <Icon name="search" size={24} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder='Search courses...'
        placeholderTextColor='#888'
        keyboardType='default'
        autoCapitalize='none'
        autoCorrect={false}
        value={query}
        onChangeText={text => onSearch(text)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    margin: 10,
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
    color: '#888', // Adjust color of the icon
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333', // Adjust text color
  },
});

export default SearchBar;
