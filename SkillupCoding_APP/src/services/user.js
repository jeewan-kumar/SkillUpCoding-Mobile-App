// src/services/user.js
let user = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    enrolledCourses: [
      { id: 1, title: 'React Native for Beginners' },
      { id: 2, title: 'Advanced React Native' },
    ],
  };
  
  export const getUser = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(user);
      }, 100);
    });
  };
  
  export const updateUser = (updatedUser) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        user = { ...user, ...updatedUser };
        resolve(user);
      }, 100);
    });
  };
  