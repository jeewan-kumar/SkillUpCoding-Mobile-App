import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [splashLoading, setSplashLoading] = useState(true);
    const BASE_URL = "http://192.168.33.157:5164/";

    const signUp = async (email, phone, password) => {
        setIsLoading(true);
        const params = {
            eventID: "1001",
            addInfo: {
                phone_number: phone,
                email: email,
                password: password
            }
        };
        try {
            const response = await axios.post(`${BASE_URL}skillup_UserSignUp`, params);
            // console.log(response, 'api response');
            const userInfo = response.data;
            if (userInfo.rData && userInfo.rData.rMessage === "Duplicate Credentials") {
                setIsLoading(false);
                console.log(userInfo.rData.id);
                return { success: false, message: 'Duplicate Credentials' };
            }
            setUserInfo(userInfo);
            await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
            setIsLoading(false);
            console.log(userInfo.rData.id);
            return { success: true , user:userInfo.rData.id };
        } catch (error) {
            console.error(`Sign up failed: ${error}`);
            setIsLoading(false);
            return { success: false, message: 'Sign-up failed. Please try again.' };
        }
    };

    // const signIn = async (email, password) => {
    //     setIsLoading(true);
    //     const params = {
    //         eventID: "1001",
    //         addInfo: {
    //             email: email,
    //             password: password,
    //         },
    //     };
    //     try {
    //         const response = await axios.post(`${BASE_URL}skillup_UserSignIn`, params);
    //         const userInfo = response.data;
    //         if (userInfo.rData && userInfo.rData.rCode === 1) {
    //             setIsLoading(false);
    //             return { success: false, message: userInfo.rData.rMessage };
    //         }
    //         console.log(userInfo, 'api response');
    //         setUserInfo(userInfo);
    //         await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
    //         //await AsyncStorage.setItem('token', userInfo.rData.token);
    //         setIsLoading(false);
    //         return { success: true };
    //     } catch (error) {
    //         console.error(`Sign in failed: ${error}`);
    //         setIsLoading(false);
    //         return { success: false, message: error.message };
    //     }
    // };

    const signIn = async (identifier, password, isEmailLogin = true) => {
        setIsLoading(true);
      
        try {
          const params = {
            eventID: "1001",
            addInfo: {
              [isEmailLogin ? "email" : "phone_number"]: identifier,
              password: password,
            },
          };
      
          const response = await axios.post(`${BASE_URL}skillup_UserSignIn`, params);
          const userInfo = response.data;
      
          if (userInfo.rData && userInfo.rData.rCode === 1) {
            setIsLoading(false);
            return { success: false, message: userInfo.rData.rMessage };
          }
      
        //   console.log(userInfo, 'api response');
          setUserInfo(userInfo);
          await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
          //await AsyncStorage.setItem('token', userInfo.rData.token);
          setIsLoading(false);
          return { success: true };
        } catch (error) {
          console.error(`Sign in failed: ${error}`);
          setIsLoading(false);
          return { success: false, message: error.message };
        }
      };
      

    const logout = async () => {
        setIsLoading(true);
        try {
            // await axios.post(
            //     `${BASE_URL}/logout`,
            //     {},
            //     {
            //         headers: { Authorization: `Bearer ${userInfo?.access_token}` },
            //     }
            // );
            await AsyncStorage.removeItem('userInfo');
            setUserInfo(null);
            setIsLoading(false);
        } catch (error) {
            console.error(`Logout failed: ${error}`);
            setIsLoading(false);
        }
    };

    const isLoggedIn = async () => {
        try {
            setSplashLoading(true);
            const userInfo = await AsyncStorage.getItem('userInfo');
            if (userInfo) {
                setUserInfo(JSON.parse(userInfo));
            }
            setSplashLoading(false);
        } catch (error) {
            setSplashLoading(false);
            console.error(`Is logged in check failed: ${error}`);
        }
    };

    useEffect(() => {
        isLoggedIn();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isLoading,
                userInfo,
                splashLoading,
                signUp,
                signIn,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import React, { createContext, useEffect, useState } from 'react';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [userInfo, setUserInfo] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [splashLoading, setSplashLoading] = useState(true);
//   const BASE_URL = "http://192.168.33.157:5164/";

//   const signUp = async (email, phone, password) => {
//     setIsLoading(true);
//     const params = {
//       eventID: "1001",
//       addInfo: {
//         phone_number: phone,
//         email: email,
//         password: password
//       }
//     };
//     try {
//       const response = await axios.post(`${BASE_URL}skillup_UserSignUp`, params);
//       const userInfo = response.data;
//       if (userInfo.rData && userInfo.rData.rMessage === "Duplicate Credentials") {
//         setIsLoading(false);
//         return { success: false, message: 'Duplicate Credentials' };
//       }
//       setUserInfo(userInfo);
//       await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
//       setIsLoading(false);
//       return { success: true };
//     } catch (error) {
//       console.error(`Sign up failed: ${error}`);
//       setIsLoading(false);
//       return { success: false, message: 'Sign-up failed. Please try again.' };
//     }
//   };

//   const signIn = async (identifier, password, isEmailLogin = true) => {
//     setIsLoading(true);
//     const params = {
//       eventID: "1001",
//       addInfo: {
//         [isEmailLogin ? "email" : "phone_number"]: identifier,
//         password: password,
//       }
//     };
//     try {
//       const response = await axios.post(`${BASE_URL}skillup_UserSignIn`, params);
//       const userInfo = response.data;
//       if (userInfo.rData && userInfo.rData.rCode === 1) {
//         setIsLoading(false);
//         return { success: false, message: userInfo.rData.rMessage };
//       }
//       setUserInfo(userInfo);
//       await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
//       setIsLoading(false);
//       return { success: true };
//     } catch (error) {
//       console.error(`Sign in failed: ${error}`);
//       setIsLoading(false);
//       return { success: false, message: error.message };
//     }
//   };

//   const logout = async () => {
//     setIsLoading(true);
//     try {
//       await AsyncStorage.removeItem('userInfo');
//       setUserInfo(null);
//       setIsLoading(false);
//     } catch (error) {
//       console.error(`Logout failed: ${error}`);
//       setIsLoading(false);
//     }
//   };

//   const isLoggedIn = async () => {
//     try {
//       setSplashLoading(true);
//       const userInfo = await AsyncStorage.getItem('userInfo');
//       if (userInfo) {
//         setUserInfo(JSON.parse(userInfo));
//       }
//       setSplashLoading(false);
//     } catch (error) {
//       setSplashLoading(false);
//       console.error(`Is logged in check failed: ${error}`);
//     }
//   };

//   useEffect(() => {
//     isLoggedIn();
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{
//         isLoading,
//         userInfo,
//         splashLoading,
//         signUp,
//         signIn,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };


// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import React, { createContext, useEffect, useState } from 'react';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [userInfo, setUserInfo] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [splashLoading, setSplashLoading] = useState(true);

//   const BASE_URL = "http://192.168.33.157:5164/";

//   const signUp = async (email, phone, password) => {
//     setIsLoading(true);
//     const params = {
//       eventID: "1001",
//       addInfo: {
//         phone_number: phone,
//         email: email,
//         password: password
//       }
//     };
//     try {
//       const response = await axios.post(`${BASE_URL}skillup_UserSignUp`, params);
//       const userInfo = response.data;
//       setUserInfo(userInfo);
//       await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
//       setIsLoading(false);
//       return { success: true };
//     } catch (error) {
//       console.error(`Sign up failed: ${error}`);
//       setIsLoading(false);
//       return { success: false, message: 'Sign-up failed. Please try again.' };
//     }
//   };

//   const signIn = async (identifier, password, isEmailLogin = true) => {
//     setIsLoading(true);
//     const params = {
//       eventID: "1001",
//       addInfo: {
//         [isEmailLogin ? "email" : "phone_number"]: identifier,
//         password: password,
//       }
//     };
//     try {
//       const response = await axios.post(`${BASE_URL}skillup_UserSignIn`, params);
//       const userInfo = response.data;
//       if (userInfo.rData && userInfo.rData.rCode === 1) {
//         setIsLoading(false);
//         return { success: false, message: userInfo.rData.rMessage };
//       }
//       setUserInfo(userInfo);
//       await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
//       setIsLoading(false);
//       return { success: true };
//     } catch (error) {
//       console.error(`Sign in failed: ${error}`);
//       setIsLoading(false);
//       return { success: false, message: error.message };
//     }
//   };

//   const logout = async () => {
//     setIsLoading(true);
//     try {
//       await AsyncStorage.removeItem('userInfo');
//       setUserInfo(null);
//       setIsLoading(false);
//     } catch (error) {
//       console.error(`Logout failed: ${error}`);
//       setIsLoading(false);
//     }
//   };

//   const isLoggedIn = async () => {
//     try {
//       setSplashLoading(true);
//       const userInfo = await AsyncStorage.getItem('userInfo');
//       if (userInfo) {
//         setUserInfo(JSON.parse(userInfo));
//       }
//       setSplashLoading(false);
//     } catch (error) {
//       setSplashLoading(false);
//       console.error(`Is logged in check failed: ${error}`);
//     }
//   };

//   useEffect(() => {
//     isLoggedIn();
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{
//         isLoading,
//         userInfo,
//         splashLoading,
//         signUp,
//         signIn,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };
