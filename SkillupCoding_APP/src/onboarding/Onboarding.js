
// import React, { useState, useEffect, useRef } from 'react';
// import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
// import AppIntroSlider from 'react-native-app-intro-slider';
// import axios from 'axios';

// const onboardingUrl = "http://192.168.33.157:5164/Skillup_Onboarding";

// const Onboarding = ({ setShowHomePage }) => {
//   const [slides, setSlides] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeSlideIndex, setActiveSlideIndex] = useState(0);
//   const sliderRef = useRef(null);

//   useEffect(() => {
//     fetchSlides(1);
//   }, []);

//   const fetchSlides = async (startIndex) => {
//     try {
//       const requestData = {
//         eventID: "1002",
//         addInfo: {
//           id: startIndex.toString()
//         }
//       };
//       const response = await axios.post(onboardingUrl, requestData);

//       const { rData } = response.data;
//       if (rData && rData.lessons && rData.lessons.length > 0) {
//         const lessons = rData.lessons[0];
//         const formattedSlides = lessons.map((lesson, index) => ({
//           key: `${index}`,
//           image: lesson[1],
//           title: lesson[2],
//           subtitle: lesson[3]
//         }));
//         setSlides(prevSlides => [...prevSlides, ...formattedSlides]);
//       } else {
//         console.error('Empty or invalid slide data:', response.data);
//         Alert.alert('Error', 'Empty or invalid slide data');
//       }
//     } catch (error) {
//       console.error('Error fetching slides:', error);
//       Alert.alert('Error', `Error fetching slides: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleNext = () => {
//     if (sliderRef.current) {
//       const nextIndex = activeSlideIndex + 1;
//       sliderRef.current.goToSlide(nextIndex);
//       setActiveSlideIndex(nextIndex);
//       fetchSlides(nextIndex + 1); // Fetch next set of slides
//     }
//   };

//   const handleSkip = () => {
//     setShowHomePage(true);
//   };

//   const renderSlideItem = ({ item }) => (
//     <View style={styles.slide}>
//       <Image source={{ uri: `data:image/png;base64,${item.image}` }} style={styles.image} resizeMode="contain" />
//       <Text style={styles.title}>{item.title}</Text>
//       <Text style={styles.subtitle}>{item.subtitle}</Text>
//     </View>
//   );

//   const renderButton = (label, onPress) => (
//     <TouchableOpacity style={styles.button} onPress={onPress}>
//       <Text style={styles.buttonText}>{label}</Text>
//     </TouchableOpacity>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#007AFF" />
//       </View>
//     );
//   }

//   return (
//     <View style={{ flex: 1 }}>
//       <AppIntroSlider
//         ref={sliderRef}
//         data={slides}
//         renderItem={renderSlideItem}
//         activeDotStyle={styles.activeDot}
//         showSkipButton
//         renderNextButton={() => renderButton('Next', handleNext)}
//         renderSkipButton={() => renderButton('Skip', handleSkip)}
//         renderDoneButton={() => renderButton('Done', handleSkip)}
//         onDone={() => setShowHomePage(true)}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   slide: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 20,
//   },
//   image: {
//     width: '90%',
//     height: 300,
//     borderRadius: 10,
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: 16,
//     textAlign: 'center',
//   },
//   activeDot: {
//     backgroundColor: '#007AFF',
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//   },
//   button: {
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     backgroundColor: '#007AFF',
//     borderRadius: 20,
//     marginBottom: 20,
//   },
//   buttonText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default Onboarding;


import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { AuthContext } from '../services/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const slides = [
  {
    id: '1',
    image: require('../images/onbod_01.png'),
    title: 'Skillup Coding',
  },
  {
    id: '2',
    image: require('../images/onbod_02.png'),
    title: 'Skillup Coding Free Trial Courses',
    subtitle: 'Free courses for you to find your way to learning.',
  },
  {
    id: '3',
    image: require('../images/onbod_03.png'),
    title: 'Quick and easy learning',
    subtitle: 'Easy and fast learning at any time to help you improve various skills.',
  },
  {
    id: '4',
    image: require('../images/onbod_04.png'),
    title: 'Personalized for you',
    subtitle: 'Get recommendations based on your enrolled courses and searches.',
  },
  {
    id: '5',
    image: require('../images/onbod_05.png'),
    title: 'Get Online Certificate',
    subtitle: 'Analyse your scores and Track your results.',
  },
];

const Onboarding = ({
  sliderRef,
  handleNext,
  handleSkip,
  setShowHomePage,
  currentIndex,
  setCurrentIndex,
}) => {
  const renderSlideItem = ({ item }) => (
    <View style={styles.slide}>
      <Image source={item.image} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>{item.title}</Text>
      {item.subtitle && <Text style={styles.subtitle}>{item.subtitle}</Text>}
    </View>
  );

  const renderButton = (label, onPress) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <AppIntroSlider
        ref={sliderRef}
        data={slides}
        renderItem={renderSlideItem}
        activeDotStyle={styles.activeDot}
        showSkipButton
        renderNextButton={() => renderButton('Next', handleNext)}
        renderSkipButton={() => renderButton('Skip', handleSkip)}
        renderDoneButton={() => renderButton('Done', handleSkip)}
        onDone={() => setShowHomePage(true)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: '90%',
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  activeDot: {
    backgroundColor: '#007AFF',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Onboarding;




// import React, { useState, useEffect, useRef } from 'react';
// import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
// import AppIntroSlider from 'react-native-app-intro-slider';
// import axios from 'axios';

// const onboardingUrl = "http://192.168.33.157:5164/Skillup_Onboarding";

// const Onboarding = ({ setShowHomePage }) => {
//   const [slides, setSlides] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeSlideIndex, setActiveSlideIndex] = useState(0);
//   const sliderRef = useRef(null);

//   useEffect(() => {
//     fetchSlides(1);
//   }, []);

//   const fetchSlides = async (startIndex) => {
//     try {
//       const requestData = {
//         eventID: "1002",
//         addInfo: {
//           id: startIndex.toString()
//         }
//       };
//       const response = await axios.post(onboardingUrl, requestData);

//       const { rData } = response.data;
//       if (rData && rData.lessons && rData.lessons.length > 0) {
//         const lessons = rData.lessons[0];
//         const formattedSlides = lessons.map((lesson, index) => ({
//           key: `${index}`,
//           image: lesson[1],
//           title: lesson[2],
//           subtitle: lesson[3]
//         }));
//         setSlides(prevSlides => [...prevSlides, ...formattedSlides]);
//       } else {
//         console.error('Empty or invalid slide data:', response.data);
//         Alert.alert('Error', 'Empty or invalid slide data');
//       }
//     } catch (error) {
//       console.error('Error fetching slides:', error);
//       Alert.alert('Error', `Error fetching slides: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleNext = () => {
//     if (sliderRef.current) {
//       const nextIndex = activeSlideIndex + 1;
//       sliderRef.current.goToSlide(nextIndex);
//       setActiveSlideIndex(nextIndex);
//       fetchSlides(nextIndex + 1); // Fetch next set of slides
//     }
//   };

//   const handleSkip = async () => {
//     try {
//       await AsyncStorage.setItem('hasSeenOnboarding', 'true');
//       setShowHomePage(true);
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const renderSlideItem = ({ item }) => (
//     <View style={styles.slide}>
//       <Image source={{ uri: `data:image/png;base64,${item.image}` }} style={styles.image} resizeMode="contain" />
//       <Text style={styles.title}>{item.title}</Text>
//       <Text style={styles.subtitle}>{item.subtitle}</Text>
//     </View>
//   );

//   const renderButton = (label, onPress) => (
//     <TouchableOpacity style={styles.button} onPress={onPress}>
//       <Text style={styles.buttonText}>{label}</Text>
//     </TouchableOpacity>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#007AFF" />
//       </View>
//     );
//   }

//   return (
//     <View style={{ flex: 1 }}>
//       <AppIntroSlider
//         ref={sliderRef}
//         data={slides}
//         renderItem={renderSlideItem}
//         activeDotStyle={styles.activeDot}
//         showSkipButton
//         renderNextButton={() => renderButton('Next', handleNext)}
//         renderSkipButton={() => renderButton('Skip', handleSkip)}
//         renderDoneButton={() => renderButton('Done', handleSkip)}
//         onDone={handleSkip}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   slide: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 20,
//   },
//   image: {
//     width: '90%',
//     height: 300,
//     borderRadius: 10,
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: 16,
//     textAlign: 'center',
//   },
//   activeDot: {
//     backgroundColor: '#007AFF',
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//   },
//   button: {
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     backgroundColor: '#007AFF',
//     borderRadius: 20,
//     marginBottom: 20,
//   },
//   buttonText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default Onboarding;
