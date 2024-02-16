// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-34134.firebaseapp.com",
  projectId: "real-estate-34134",
  storageBucket: "real-estate-34134.appspot.com",
  messagingSenderId: "858305084035",
  appId: "1:858305084035:web:4a9326f39ea60c8390f9b6",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
