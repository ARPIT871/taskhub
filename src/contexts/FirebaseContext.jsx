import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Replace the config object with your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqwsHFsxnwq9QDaN41POoWXsEQgmxuUCM",
  authDomain: "task-management-app-ef86a.firebaseapp.com",
  projectId: "task-management-app-ef86a",
  storageBucket: "task-management-app-ef86a.appspot.com",
  messagingSenderId: "876672825308",
  appId: "1:876672825308:web:22a639e066d5e7d5fe4119",
  measurementId: "G-YNNXTEF7E2"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

// Create FirebaseContext
const FirebaseContext = createContext();

// Create a FirebaseProvider component to wrap the entire application
export const FirebaseProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading,SetLoading]=useState(true)

  // Set up an observer to watch for changes in the user's login status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth,(user) => {
       setCurrentUser(user);
       SetLoading(false);
    });
    // Unsubscribe from the observer when the component is unmounted
    return () => unsubscribe();
  }, []);

  // Provide the context values to the components
  const contextValues = {
    currentUser,
    auth,
    db,
    loading
  };

  return (
    <FirebaseContext.Provider value={contextValues}>
      {children}
    </FirebaseContext.Provider>
  );
};

// Create a custom hook to access the Firebase context
export const useFirebase = () => {
  return useContext(FirebaseContext);
};
