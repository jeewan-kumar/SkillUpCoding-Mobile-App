import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const BackButton = ({ navigation }) => {
  return (
    <View>
      <TouchableOpacity 
        style={styles.backButtonWrapper} 
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back-outline" color="#000" size={25} />
      </TouchableOpacity>
    </View>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  backButtonWrapper: {
    height: 40,
    width: 40,
    backgroundColor: '#ddd',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
