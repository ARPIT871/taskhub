import React, { createContext, useContext } from 'react';
import { useFirebase } from './FirebaseContext';
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc,getDoc} from 'firebase/firestore';

// Create FirestoreContext
const FirestoreContext = createContext();

// Create a FirestoreProvider component to wrap Firestore-related functionalities
export const FirestoreProvider = ({ children }) => {
  const { db } = useFirebase();

  // Function to add a new document to a Firestore collection
  const addDocument = async (collectionName, data) => {
    try {
      const collectionRef = collection(db, collectionName);
      await addDoc(collectionRef, data);
    } catch (error) {
      throw error;
    }
  };

  // Function to fetch all documents from a Firestore collection
  const getDocuments = async (collectionName) => {
    try {
      const collectionRef = collection(db, collectionName);
      const querySnapshot = await getDocs(collectionRef);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw error;
    }
  };

  const getDocumentById = async (collectionName, documentId) => {
    try {
      const documentRef = doc(db, collectionName, documentId);
      const documentSnapshot = await getDoc(documentRef);
  
      if (documentSnapshot.exists()) {
        return { id: documentSnapshot.id, ...documentSnapshot.data() };
      } else {
        throw new Error(`Document with ID ${documentId} does not exist.`);
      }
    } catch (error) {
      throw error;
    }
  };

  // Function to update a document in a Firestore collection
  const updateDocument = async (collectionName, documentId, data) => {
    try {
      const documentRef = doc(db, collectionName, documentId);
      await updateDoc(documentRef, data);
    } catch (error) {
      throw error;
    }
  };

  // Function to delete a document from a Firestore collection
  const deleteDocument = async (collectionName, documentId) => {
    try {
      const documentRef = doc(db, collectionName, documentId);
      await deleteDoc(documentRef);
    } catch (error) {
      throw error;
    }
  };

  // Provide the context values to the components
  const contextValues = {
    addDocument,
    getDocuments,
    updateDocument,
    deleteDocument,
    getDocumentById
  };

  return (
    <FirestoreContext.Provider value={contextValues}>
      {children}
    </FirestoreContext.Provider>
  );
};

// Create a custom hook to access the Firestore context
export const useFirestore = () => {
  return useContext(FirestoreContext);
};
