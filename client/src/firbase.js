// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIRBASE_API_KEY,
  authDomain: "mern-auth-app-be884.firebaseapp.com",
  projectId: "mern-auth-app-be884",
  storageBucket: "mern-auth-app-be884.appspot.com",
  messagingSenderId: "996153534827",
  appId: "1:996153534827:web:74f07b4e8bfa0b81ce042e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);