import { initializeApp } from "firebase/app";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDfK1i0xYIeWSIOWAKgaITZuUtcCAdF-Rk",
  authDomain: "fintech-58c58.firebaseapp.com",
  projectId: "fintech-58c58",
  storageBucket: "fintech-58c58.firebasestorage.app",
  messagingSenderId: "734555459804",
  appId: "1:734555459804:web:64faafbac179ac4a36e419",
  measurementId: "G-N5NXXK4JJV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {
    localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
    }),
});

export { db };
