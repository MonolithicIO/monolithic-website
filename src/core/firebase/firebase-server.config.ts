import { credential } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";

const isDevelopment = process.env.NODE_ENV === "development";

const serverFirebaseApp = initializeApp({
  credential: isDevelopment
    ? credential.applicationDefault()
    : credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
      }),
});

if (isDevelopment) {
  process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
  process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";
}

export default serverFirebaseApp;
