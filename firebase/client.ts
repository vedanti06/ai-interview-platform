
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  
 apiKey: "AIzaSyBhlqrh3XPvyQTpMhSoCwlAG-ugyi_okhE",
 authDomain: "prepwise-6fac5.firebaseapp.com",
 projectId: "prepwise-6fac5",
 storageBucket: "prepwise-6fac5.firebasestorage.app",
 messagingSenderId: "515160831965",
 appId: "1:515160831965:web:b0ff9025817fbc672b2834",
 measurementId: "G-TVTX9F22YV"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);