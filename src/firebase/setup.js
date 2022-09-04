// Import the functions you need from the SDKs you need
import Firebase from "firebase/compat/app";
import { getDatabase } from "firebase/database";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBn5JdBwmQuzehtVYm0lw3skASz1u1aUcE",
  authDomain: "digital-cocktail-menu.firebaseapp.com",
  projectId: "digital-cocktail-menu",
  databaseURL: "https://digital-cocktail-menu-default-rtdb.firebaseio.com",
  storageBucket: "digital-cocktail-menu.appspot.com",
  messagingSenderId: "503562161720",
  appId: "1:503562161720:web:cce9bd839a4ffbff2ba0cd",
  measurementId: "G-Z9H31JXNBJ",
};

// Initialize Firebase
const app = Firebase.initializeApp(firebaseConfig);
export const auth = app.auth();
export const db = getDatabase(app);
