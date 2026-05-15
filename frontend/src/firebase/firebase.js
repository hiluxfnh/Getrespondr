import { initializeApp } from "firebase/app";

const firebaseApiKey = import.meta.env.VITE_FIREBASE_API_KEY;

if (!firebaseApiKey) {
  console.warn("Missing VITE_FIREBASE_API_KEY. Set it in frontend/.env.local or your deployment environment.");
}

const firebaseConfig = {
  apiKey: firebaseApiKey || "",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "getrespondr-itmo.firebaseapp.com",
  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID || "getrespondr-itmo",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "getrespondr-itmo.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "62204005333",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID || "1:62204005333:web:4c3bfb627ce2b09f23cb5c",
};

export const firebaseApp = initializeApp(firebaseConfig);

export default firebaseConfig;
