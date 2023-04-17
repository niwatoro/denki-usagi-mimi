// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9TUdTsxbtt-QnRHU1Csfxj03hP1lKQMk",
  authDomain: "raito-e480d.firebaseapp.com",
  projectId: "raito-e480d",
  storageBucket: "raito-e480d.appspot.com",
  messagingSenderId: "672552815479",
  appId: "1:672552815479:web:b39311a8b59f9d26b7af72",
  measurementId: "G-XRSH2EJBZX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
