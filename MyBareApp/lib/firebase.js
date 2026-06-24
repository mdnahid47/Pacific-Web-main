

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth, signInWithPhoneNumber,getAuth } from 'firebase/auth';

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
// configuration 
const firebaseConfig = {
  apiKey: "AIzaSyDgf2VQq6ek12wIzTEAAgeGFT10XaxfcHE",
  authDomain: "pacific-web-d7e9f.firebaseapp.com",
  projectId: "pacific-web-d7e9f",
  storageBucket: "pacific-web-d7e9f.appspot.com", // 
  messagingSenderId: "790985713345",
  appId: "1:790985713345:web:5d9b07c24407601caf5640"
};

// ⚙️ Initialize Firebase app and auth
const app = initializeApp(firebaseConfig);
export { signInWithPhoneNumber, getAuth };

