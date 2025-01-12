// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDJYdQNgMUuvta8OS0pLdpAPbp_TGDXasY",
  authDomain: "mock-interview-90f5f.firebaseapp.com",
  projectId: "mock-interview-90f5f",
  storageBucket: "mock-interview-90f5f.firebasestorage.app",
  messagingSenderId: "795357830740",
  appId: "1:795357830740:web:c93f976b34670c5eed17c1",
  measurementId: "G-YGH6GXVXZB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
