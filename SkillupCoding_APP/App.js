
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './src/homeScreen/Home';
import ProfileScreen from './src/homeScreen/ProfileScreen';
import SearchScreen from './src/homeScreen/SearchScreen';
import EnrolledCoursesScreen from './src/homeScreen/EnrolledCoursesScreen';
import SplashScreen from './src/homeScreen/SplashScreen';
import SignIn from './src/signupSignin/SignIn';
import SignUp from './src/signupSignin/SignUp';
import ForgotPassword from './src/signupSignin/ForgotPassword';
import CourseDetailsScreen from './src/homeScreen/CourseDetailsScreen';
import LessonDetailsScreen from './src/homeScreen/LessonDetailsScreen';
import CourseListScreen from './src/homeScreen/CourseListScreen';
import Onboarding from './src/onboarding/Onboarding';
import { AuthProvider } from './src/services/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Profile from './src/components/Profile';
import EnrolledCourses from './src/components/EnrolledCourses';
import HelpPage from './src/components/HelpPage';
import ReportProblemPage from './src/components/ReportProblemPage';
import SettingsPage from './src/components/SettingsPage';
import AboutSkillUpCodingPage from './src/components/AboutSkillUpCodingPage';
import LearningPlanPage from './src/components/LearningPlanPage';
import CertificatesPage from './src/components/CertificatesPage';
import CourseDetails from './src/components/CourseDetails';
import CourseList from './src/components/CourseList';
import SignUpForm from './src/components/SignUpForm';
import AllCourses from './src/components/AllCourses';
import VideoPlayer from './src/components/VideoPlayer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WebViewScreen from './src/components/WebViewScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [showHomePage, setShowHomePage] = React.useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const sliderRef = React.useRef(null);
  

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
        if (user) {
          setShowHomePage(true);
          setShowOnboarding(false);
        } else {
          
          setShowOnboarding(!hasSeenOnboarding);
        }
      } catch (e) {
        console.error(e);
      }
    };
    checkAuthState();
  }, []);

  const handleNext = () => {
    if (sliderRef.current) {
      setCurrentIndex(currentIndex + 1);
      sliderRef.current.goToSlide(currentIndex + 1);
    }
  };

  
  const handleSkip = async () => {
    try {
      
      setShowOnboarding(false);
      setShowHomePage(true);
    } catch (e) {
      console.error(e);
    }
  };

  const renderContent = () => {
    if (!showHomePage) {
      return (
        <Onboarding
          sliderRef={sliderRef}
          handleNext={handleNext}
          handleSkip={handleSkip}
          setShowHomePage={setShowHomePage}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
      );
    } else if (showHomePage){
      return (
        <AuthProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Splash" screenOptions={{headerShown:false}}>
              <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
              <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
              <Stack.Screen name="SignUp" component={SignUp} />
              <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
              <Stack.Screen name="Home" component={MainTabNavigator}  />
              <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
              <Stack.Screen name="CourseDetails" component={CourseDetails} />
              <Stack.Screen name="Search" component={SearchScreen} />
              <Stack.Screen name="AllCourses" component={AllCourses} />
              <Stack.Screen name="VideoPlayer" component={VideoPlayer} />
              <Stack.Screen name="Profile" component={Profile} />
              <Stack.Screen name="CourseList" component={CourseList} />
              <Stack.Screen name="LessonDetails" component={LessonDetailsScreen} />
              <Stack.Screen name="EnrolledCoursesScreen" component={EnrolledCoursesScreen} />
              <Stack.Screen name="EnrolledCourses" component={EnrolledCourses} />
              <Stack.Screen name="Help" component={HelpPage} />
              <Stack.Screen name="ReportProblem" component={ReportProblemPage} />
              <Stack.Screen name="Settings" component={SettingsPage} />
              <Stack.Screen name="About" component={AboutSkillUpCodingPage} />
              <Stack.Screen name="LearningPlan" component={LearningPlanPage} />
              <Stack.Screen name="MyCertificates" component={CertificatesPage} />
              <Stack.Screen name="SignUpForm" component={SignUpForm} />
              <Stack.Screen name="WebViewScreen" component={WebViewScreen} />


            </Stack.Navigator>
          </NavigationContainer>
        </AuthProvider>
      );
    } else {
      return <SplashScreen/>;
    }
  };

  return renderContent();
}

function MainTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home}  options={{headerTitle:'Explore Courses', headerTitleAlign:"center", 
        tabBarIcon:()=>{
          return<Ionicons name="home-outline" size={25}/>
        }
      }}/>      
      <Tab.Screen name="Search" component={SearchScreen} options={{ headerTitleAlign:"center",
        tabBarIcon:()=>{
          return<Ionicons name="search-outline" size={25}/>
        }
      }}/>
      <Tab.Screen name="EnrolledCourses" component={EnrolledCoursesScreen} options={{ headerTitleAlign:"center",
        tabBarIcon:()=>{
          return<Ionicons name="laptop-outline" size={25}/>
        }
      }}/>
      <Tab.Screen name="ProfileScreen" component={ProfileScreen} options={{headerTitleAlign:"center",
        tabBarIcon:()=>{
          return<Ionicons name="person-outline" size={25}/>
        }
       }}/>
    </Tab.Navigator>
  );
}


// import { StyleSheet, Text, View } from 'react-native'
// import SignUpForm from './src/components/SignUpForm'
// const App = () => {
//   return (
//     <SignUpForm/>
//   )
// }
// export default App
// const styles = StyleSheet.create({})