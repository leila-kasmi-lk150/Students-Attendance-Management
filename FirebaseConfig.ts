// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
import { getFirestore} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_RgVy9tYeW-E9IxNQwzQhv-yXKR1yXbE",
  authDomain: "student-leiknach2023.firebaseapp.com",
  databaseURL: "https://student-leiknach2023-default-rtdb.firebaseio.com",
  projectId: "student-leiknach2023",
  storageBucket: "student-leiknach2023.appspot.com",
  messagingSenderId: "707904052104",
  appId: "1:707904052104:web:409a6a4da754ebf5f3783d"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);