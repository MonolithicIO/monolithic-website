import admin from "firebase-admin";

const isDevelopment = process.env.NODE_ENV === "development";

const serverFirebaseApp = admin.apps.length === 0 ? admin.initializeApp() : admin.app();

if (isDevelopment) {
  process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
  process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";
}

export default serverFirebaseApp;
