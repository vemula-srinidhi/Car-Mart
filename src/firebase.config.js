import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAFY3mPZUKTw-9em0GWyURfZzbq2psVjRk",
  authDomain: "shaik-gouse-rahiman.firebaseapp.com",
  projectId: "shaik-gouse-rahiman",
  storageBucket: "shaik-gouse-rahiman.firebasestorage.app",
  messagingSenderId: "218658698424",
  appId: "1:218658698424:web:986ab5136d85dc1567304d",
  measurementId: "G-C8B7KCH8H1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
