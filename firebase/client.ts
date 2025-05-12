// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA5pzh8xVprZzUaw5925TdJ6IqA6vNhfJ8",
  authDomain: "codesync-33109.firebaseapp.com",
  projectId: "codesync-33109",
  storageBucket: "codesync-33109.firebasestorage.app",
  messagingSenderId: "65219498253",
  appId: "1:65219498253:web:31e10a0aa2d16359542044",
  measurementId: "G-P1EYX72SFS"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);