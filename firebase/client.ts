
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  
 apiKey: "",
 authDomain: "prepwise-6fac5.firebaseapp.com",
 projectId: "prepwise-6fac5",
 storageBucket: "prepwise-6fac5.firebasestorage.app",
 messagingSenderId: "",
 appId: "",
 measurementId: "G-TVTX9F22YV"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
