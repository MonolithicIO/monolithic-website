import clientFirebaseApp from "@core/firebase/firebase-client.config";
import { getAuth, confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const useResetPasswordViewModel = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [validatingCode, setValidatingCode] = useState(true);
  const [codeValid, setCodeValid] = useState(false);
  const [email, setEmail] = useState("");
  const auth = getAuth(clientFirebaseApp);
  const searchParams = useSearchParams();

  useEffect(() => {
    const validateCode = async () => {
      const oobCode = searchParams.get("oobCode");

      if (!oobCode) {
        setError("Invalid or missing reset code");
        setValidatingCode(false);
        return;
      }

      try {
        const userEmail = await verifyPasswordResetCode(auth, oobCode);
        setEmail(userEmail);
        setCodeValid(true);
      } catch {
        setError("Invalid or expired reset code");
      } finally {
        setValidatingCode(false);
      }
    };

    validateCode();
  }, [searchParams, auth]);

  const onSubmit = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    const oobCode = searchParams.get("oobCode");
    if (!oobCode) {
      setError("Invalid reset code");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await confirmPasswordReset(auth, oobCode, password);
      setSuccess(true);
    } catch {
      setError("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    error,
    success,
    validatingCode,
    codeValid,
    email,
    onSubmit,
  };
};

export default useResetPasswordViewModel;
