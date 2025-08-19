import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDQNWyYplMHDAJu1bhfHG0Cr1UWQTrB9Iw",
  authDomain: "jenom-c8a69.firebaseapp.com",
  databaseURL: "https://jenom-c8a69-default-rtdb.firebaseio.com",
  projectId: "jenom-c8a69",
  storageBucket: "jenom-c8a69.firebasestorage.app",
  messagingSenderId: "1076986591746",
  appId: "1:1076986591746:web:8c381638ccc0eddd15c51b",
  measurementId: "G-FS8HEKF6NQ"
};

console.log('[FIREBASE] Initializing Firebase with project:', firebaseConfig.projectId, 'appId:', firebaseConfig.appId);
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = initializeFirestore(app, {
    localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
    }),
});
console.log('[FIREBASE] Firebase initialized successfully.');

export { db };

