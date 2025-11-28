import { ErrorResponse } from "@core/api/error-handler";
import handleResponse from "@core/api/handle-response";
import clientFirebaseApp from "@core/firebase/firebase-client.config";
import LoginResponseModel from "@model/login-response.model";
import { FirebaseError } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential,
} from "firebase/auth";
import { useState } from "react";

const useLoginViewModel = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hidePassword, setHidePassword] = useState(false);
  const auth = getAuth(clientFirebaseApp);

  const credentialSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      const credential = await signInWithEmailAndPassword(auth, email, password);
      await handleSignIn(credential);
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError(parseFirebaseError(err));
      } else {
        setError("Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  };

  const googleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(auth, provider);
      await handleSignIn(credential);
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError(parseFirebaseError(err));
      } else {
        setError("Unexpected error");
      }
    } finally {
      setLoading(false);
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

  const handleSignIn = async (credential: UserCredential) => {
    const idToken = await credential.user.getIdToken();

    const response = await fetch("api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ authToken: idToken }),
    });

    const result = await handleResponse<LoginResponseModel>(response);

    if (result instanceof ErrorResponse) {
      setError(result.message);
      return;
    }

    alert(result.userName);
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
    credentialSignIn,
    googleSignIn,
  };
};

export default useLoginViewModel;
