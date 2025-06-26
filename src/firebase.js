import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAXxTQ_8A7ECulaz8ukxJOBiRqrxYEJ73M",
  authDomain: "axis-21017.firebaseapp.com",
  projectId: "axis-21017",
  storageBucket: "axis-21017.firebasestorage.app",
  messagingSenderId: "563797511582",
  appId: "1:563797511582:web:07ea613aade8aec9369a8f",
  measurementId: "G-KCTD8FE7YZ"
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

