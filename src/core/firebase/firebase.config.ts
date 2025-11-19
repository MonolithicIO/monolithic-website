import { initializeApp, FirebaseOptions, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const firebaseApp = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);

export default firebaseApp;

if (process.env.NODE_ENV === "development") {
  connectAuthEmulator(getAuth(firebaseApp), "http://127.0.0.1:9099");
}
