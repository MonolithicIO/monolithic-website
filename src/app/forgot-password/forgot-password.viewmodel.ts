import clientFirebaseApp from "@core/firebase/firebase-client.config";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";

const useForgotPasswordViewModel = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const auth = getAuth(clientFirebaseApp);

  const onSubmit = async () => {
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch {
      setError("Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onDismissSuccess = () => {
    setSuccess(false);
    setEmail("");
  };

  return {
    email,
    setEmail,
    loading,
    error,
    success,
    onSubmit,
    onDismissSuccess,
  };
};

export default useForgotPasswordViewModel;
