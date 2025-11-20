"use client";

import React, { JSX, useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@core/components/ui/card";
import { Button } from "@core/components/ui/button";
import { Input } from "@core/components/ui/input";
import { Label } from "@core/components/ui/label";
import firebaseApp from "@core/firebase/firebase.config";

export default function SignUpPage(): JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = getAuth(firebaseApp);

  async function handleEmailSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      alert(`Account created for ${cred.user.email}`);
    } catch (err: any) {
      setError(parseFirebaseError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
          <CardDescription>Create an account with email or Google</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <div>
              <Label className="my-2" htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@company.com"
                className="mt-1"
              />
            </div>

            <div>
              <Label className="my-2" htmlFor="password">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Create a password"
                className="mt-1"
              />
            </div>

            {error && <div className="text-sm text-destructive">{error}</div>}

            <div className="flex items-center justify-between">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">By signing up you agree to our terms.</div>
        </CardFooter>
      </Card>
    </div>
  );
}

function parseFirebaseError(err: any): string {
  if (!err) return "Unknown error";
  if (err.code) {
    switch (err.code) {
      case "auth/email-already-in-use":
        return "Email is already in use.";
      case "auth/weak-password":
        return "Password is too weak.";
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
}
