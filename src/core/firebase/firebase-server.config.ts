import admin from "firebase-admin";

const isDevelopment = process.env.NODE_ENV === "development";

if (admin.apps.length === 0) {
  if (isDevelopment) {
    process.env.FIREBASE_AUTH_EMULATOR_HOST = "http://localhost:9099";
  } else {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
      }),
    });
  }
}

const serverFirebaseApp = admin.app();

export default serverFirebaseApp;
