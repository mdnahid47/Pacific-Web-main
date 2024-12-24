// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  // apiKey: import.meta.env.VITE_APIKEY,
  // authDomain: import.meta.env.VITE_AUTHDOMAIN,
  // projectId: import.meta.env.VITE_PROJECTID,
  // storageBucket:import.meta.env.VITE_STORAGEBUCKET,
  // messagingSenderId:import.meta.env.VITE_MESSAGINGSENDERID,
  // appId: import.meta.env.VITE_APPID
  apiKey: "AIzaSyDgf2VQq6ek12wIzTEAAgeGFT10XaxfcHE",

  authDomain: "pacific-web-d7e9f.firebaseapp.com",

  databaseURL: "https://pacific-web-d7e9f-default-rtdb.firebaseio.com",

  projectId: "pacific-web-d7e9f",

  storageBucket: "pacific-web-d7e9f.appspot.com",

  messagingSenderId: "790985713345",

  appId: "1:790985713345:web:5d9b07c24407601caf5640"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth();
export const db = getFirestore(app);
export default app