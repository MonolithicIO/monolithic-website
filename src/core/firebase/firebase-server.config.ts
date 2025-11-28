import admin from "firebase-admin";

const isDevelopment = process.env.NODE_ENV === "development";

const serverFirebaseApp =
  admin.apps.length === 0
    ? admin.initializeApp({
        credential: isDevelopment
          ? admin.credential.applicationDefault()
          : admin.credential.cert({
              projectId: process.env.FIREBASE_PROJECT_ID,
              clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
              privateKey: process.env.FIREBASE_PRIVATE_KEY,
            }),
      })
    : admin.app();

if (isDevelopment) {
  process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
  process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";
}

export default serverFirebaseApp;
