import React, { createContext, useContext } from 'react';
import { useFirebase } from './FirebaseContext';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

// Create AuthContext
const AuthContext = createContext();

// Create an AuthProvider component to wrap the Auth-related functionalities
export const AuthProvider = ({ children }) => {
  const { auth } = useFirebase();

  // Function to log in with email and password
  const loginUser = async (email, password) => {
    try {
     const response= await signInWithEmailAndPassword(auth, email, password);
     return response
    } catch (error) {
      throw error;
    }
  };

  // Function to log out
  const logoutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  // Function to register a new user with email and password
  const registerUser = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  // Provide the context values to the components
  const contextValues = {
    loginUser,
    logoutUser,
    registerUser,
  };

  return (
    <AuthContext.Provider value={contextValues}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to access the Auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
