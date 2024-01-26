import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { FirestoreProvider } from './contexts/FirestoreContext.jsx'
import { FirebaseProvider } from './contexts/FirebaseContext.jsx'
import {AuthProvider} from './contexts/AuthContext.jsx'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FirebaseProvider>
      <AuthProvider>
        <FirestoreProvider>
          <App/>
        </FirestoreProvider>
      </AuthProvider>
    </FirebaseProvider>

   
  </React.StrictMode>,
)
