import React, { useEffect } from 'react'
import { auth } from '../firebase/firebase.config';
import { useNavigate } from 'react-router-dom';

const RequireAuth  = ({ children }) => {
    const navigate = useNavigate();
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          if (!user) {
            navigate('/');  // Redirect to login if the user is not authenticated
          }
        });
    
        return () => unsubscribe();
      }, [navigate]);
  return (
    <div>
      { children }
    </div>
  )
}

export default RequireAuth 
