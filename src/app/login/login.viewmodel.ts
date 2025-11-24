import clientFirebaseApp from "@core/firebase/firebase-client.config";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";

type FirebaseSignInResult = {
  success: boolean;
  message: string;
};

const useLoginViewModel = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hidePassword, setHidePassword] = useState(false);
  const auth = getAuth(clientFirebaseApp);

  const signIn = async () => {
    setLoading(true);

    const firebaseToken = await firebaseSignIn();

    if (!firebaseToken.success) {
      setError(firebaseToken.message);
      setLoading(false);
      return;
    }
  };

  const firebaseSignIn = async (): Promise<FirebaseSignInResult> => {
    setLoading(true);
    try {
      const credentials = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await credentials.user.getIdToken();

      return { success: true, message: idToken };
    } catch (err: any) {
      return { success: false, message: parseFirebaseError(err) };
    }
  };

  const parseFirebaseError = (err: any): string => {
    if (!err) return "Unknown error";
    if (err.code) {
      switch (err.code) {
        case "auth/user-not-found":
          return "Incorrect credentials.";
        case "auth/wrong-password":
          return "Incorrect credentials.";
        case "auth/invalid-email":
          return "Invalid email address.";
        case "auth/popup-closed-by-user":
          return "Popup closed before completion.";
        case "auth/popup-blocked":
          return "Popup blocked by browser.";
        default:
          return "Unknown error. Please try again later.";
      }
    }
    return String(err);
  };
};
