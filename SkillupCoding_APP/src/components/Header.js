// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const Header = () => {
//   return (
//     <View style={styles.header}>
//       <TouchableOpacity>
//         <Icon name="menu" size={30} color="#333" />
//       </TouchableOpacity>
//       <Text style={styles.title}>Explore Courses</Text>
//       <TouchableOpacity>
//         <Icon name="more-vert" size={30} color="#333" />
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: 15,
//     backgroundColor: '#fff',
//     paddingHorizontal: 16,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
// });

// export default Header;

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Header = () => {
  const handleMenuPress = () => {
    // Define actions when menu icon is pressed
  };

  const handleMorePress = () => {
    // Define actions when more-vert icon is pressed
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleMenuPress}>
        <Icon name="menu" size={30} color="#333" />
      </TouchableOpacity>
      <Text style={styles.title}>Explore Courses</Text>
      <TouchableOpacity onPress={handleMorePress}>
        <Icon name="more-vert" size={30} color="#333" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default Header;
