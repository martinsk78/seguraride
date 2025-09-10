import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDUWRtl8Jpi5QznRWCgE8WAZgexogP8OEc",
  authDomain: "segura-a3ecc.firebaseapp.com",
  databaseURL: "https://segura-a3ecc-default-rtdb.firebaseio.com",
  projectId: "segura-a3ecc",
  storageBucket: "segura-a3ecc.firebasestorage.app",
  messagingSenderId: "294522316649",
  appId: "1:294522316649:web:2a14a15935ac20dd143ff8",
};

// Solo inicializa si no hay apps
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Auth y Database
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db };
