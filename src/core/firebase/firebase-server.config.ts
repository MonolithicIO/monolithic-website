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

export default serverFirebaseApp;
