import { initializeApp, FirebaseOptions, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const firebaseApp = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);

export default firebaseApp;

if (process.env.NODE_ENV === "development") {
  connectAuthEmulator(getAuth(firebaseApp), "http://127.0.0.1:9099");
}
