// Firebase initializer
// Note: For production it's preferable to put these values in environment variables
// (REACT_APP_FIREBASE_*) and not commit them. This file falls back to the provided
// constants if env vars are not set.
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyBfLcEWSGRsfiJ3BoPSYkU8GX7w-B5v6Is',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'hostelcare-679ba.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'hostelcare-679ba',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'hostelcare-679ba.firebasestorage.app',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '431888471069',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:431888471069:web:884eccc854f2c146c562f4',
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || 'G-G5GRTT6Q82'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
