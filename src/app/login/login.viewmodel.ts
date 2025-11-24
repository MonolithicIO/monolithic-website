import clientFirebaseApp from "@core/firebase/firebase-client.config";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useState } from "react";

const useLoginViewModel = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hidePassword, setHidePassword] = useState(false);
  const auth = getAuth(clientFirebaseApp);

  const signIn = async () => {
    try {
      setLoading(true);
      setError(null);
      const cred = await signInWithEmailAndPassword(auth, email, password);
      alert(`Signed in with email ${cred.user.email}`);
    } catch (err: any) {
      setError(parseFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  async function googleSignIn() {
    setError(null);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(auth, provider);
      alert(`Signed in with email ${credential.user.email}`);
    } catch (err: any) {
      setError(parseFirebaseError(err));
    } finally {
      setLoading(false);
    }
  }

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

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    hidePassword,
    setHidePassword,
    signIn,
    googleSignIn,
  };
};

export default useLoginViewModel;
