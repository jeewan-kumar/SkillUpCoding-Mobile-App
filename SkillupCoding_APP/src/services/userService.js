// src/services/userService.js
const users = {
    user1: {
      email: 'user1@example.com',
      enrolledCourses: [1, 3], // Array of enrolled course IDs
    },
  };
  
  export const getUser = (email) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(users[email]);
      }, 10);
    });
  };
  
  export const enrollCourse = (email, courseId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        users[email].enrolledCourses.push(courseId);
        resolve(users[email]);
      }, 10);
    });
  };
  