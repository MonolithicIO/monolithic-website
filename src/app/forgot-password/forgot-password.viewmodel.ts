import { useState } from "react";

const useForgotPasswordViewModel = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const onSubmit = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
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
