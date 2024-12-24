/* eslint-disable react/prop-types */
import React, { Children, createContext, useEffect, useState ,user} from 'react'
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { GoogleAuthProvider } from 'firebase/auth';
import { FacebookAuthProvider } from 'firebase/auth';
import app from '../firebase/firebase.config';



export const AuthContext = createContext();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();


const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create A Account
  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // Signup with gmail
  
  // Signup With facebook
  const signUpWithFacebook = () => {
    setLoading(true);
    return signInWithPopup(auth, facebookProvider)
  }

  // login using email & password 
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);

  }

  // logout 
  const logOut = () =>{
    return signOut(auth);
}

  // update profile 
  const updateUserProfile = (name, photoURL) => {
    updateProfile(auth.currentUser, {
      displayName: name, photoURL: photoURL
    })
  }
  // check signed user 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        setLoading(false)
      } else {
        // User is signed out
        // ...
      }
    })
    return () => {
      return unsubscribe();
    }
  }, [])

  const authInfo = {
    user,
    createUser,
    signUpWithFacebook,
    login,
    logOut,
    updateUserProfile,
    loading,
  };
  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider