import apiClient from "@core/api/api-client";
import { ErrorResponse } from "@core/api/error-handler";
import handleResponse from "@core/api/handle-response";
import clientFirebaseApp from "@core/firebase/firebase-client.config";
import { FirebaseError } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential,
} from "firebase/auth";
import { useState } from "react";
import { useUser } from "src/hooks/user.hook";

type LoginResponse = {
  displayName: string;
  photoUrl: string | null;
};

const useLoginViewModel = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hidePassword, setHidePassword] = useState(false);
  const auth = getAuth(clientFirebaseApp);
  const { refreshUser } = useUser();

  const credentialSignIn = async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const credential = await signInWithEmailAndPassword(auth, email, password);
      await handleSignIn(credential);
      return true;
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError(parseFirebaseError(err.code));
      } else {
        setError("Unexpected error");
      }
      return false;
    } finally {
      auth.signOut();
      setLoading(false);
    }
  };

  const googleSignIn = async (): Promise<boolean> => {
    setError(null);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: "select_account",
      });
      const credential = await signInWithPopup(auth, provider);
      await handleSignIn(credential);
      return true;
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError(parseFirebaseError(err.code));
      }
      if (err instanceof ErrorResponse) {
        setError(err.message);
      } else {
        setError("Unexpected error");
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const parseFirebaseError = (err: string): string => {
    if (!err) return "Unknown error";

    switch (err) {
      case "auth/user-not-found":
        return "Incorrect credentials.";
      case "auth/wrong-password":
        return "Incorrect credentials.";
      case "auth/invalid-credential":
        return "Incorrect email or password.";
      case "auth/invalid-email":
        return "Invalid email address.";
      case "auth/popup-closed-by-user":
        return "Popup closed before completion.";
      case "auth/popup-blocked":
        return "Popup blocked by browser.";
      default:
        return "Unknown error. Please try again later.";
    }
  };

  const handleSignIn = async (credential: UserCredential) => {
    const idToken = await credential.user.getIdToken();

    const result = await apiClient.post<LoginResponse>(
      "/api/v1/auth/login",
      { authToken: idToken },
      { skipRefresh: true }
    );

    if (result instanceof ErrorResponse) {
      throw result;
    }
    await refreshUser();
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
