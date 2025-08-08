// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvZF2skixzWc6d3uVn43M9ZIv4SO2QFVI",
  authDomain: "apostas-firebase.firebaseapp.com",
  projectId: "apostas-firebase",
  storageBucket: "apostas-firebase.firebasestorage.app",
  messagingSenderId: "944656948785",
  appId: "1:944656948785:web:38845e211a40868edf7f10",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
