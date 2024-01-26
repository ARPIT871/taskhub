import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBqwsHFsxnwq9QDaN41POoWXsEQgmxuUCM",
    authDomain: "task-management-app-ef86a.firebaseapp.com",
    projectId: "task-management-app-ef86a",
    storageBucket: "task-management-app-ef86a.appspot.com",
    messagingSenderId: "876672825308",
    appId: "1:876672825308:web:22a639e066d5e7d5fe4119",
    measurementId: "G-YNNXTEF7E2"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export { firebase };
