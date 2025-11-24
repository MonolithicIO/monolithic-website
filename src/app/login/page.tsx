"use client";

import React, { JSX, useState } from "react";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@core/components/ui/card";
import { Button } from "@core/components/ui/button";
import { Label } from "@core/components/ui/label";
import Image from "next/image";
import { Separator } from "@core/components/ui/separator";
import Google from "@images/google.svg";
import clientFirebaseApp from "@core/firebase/firebase-client.config";
import Link from "next/link";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@core/components/ui/input-group";
import { EyeClosedIcon, EyeIcon, LockIcon, MailIcon } from "lucide-react";

export default function SignInPage(): JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hidePassword, setHidePassword] = useState(false);
  const auth = getAuth(clientFirebaseApp);

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      alert(`Signed in with email ${cred.user.email}`);
    } catch (err: any) {
      setError(parseFirebaseError(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Sign in to your account with email or Google</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <Label className="my-2" htmlFor="email">
                Email
              </Label>
              <InputGroup>
                <InputGroupInput
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@company.com"
                  className="mt-1"
                />
                <InputGroupAddon>
                  <MailIcon />
                </InputGroupAddon>
              </InputGroup>
            </div>

            <div>
              <Label className="my-2" htmlFor="password">
                Password
              </Label>
              <InputGroup>
                <InputGroupInput
                  id="password"
                  type={hidePassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Your password"
                  className="mt-1"
                />
                <InputGroupAddon>
                  <LockIcon />
                </InputGroupAddon>
                <InputGroupButton
                  onClick={() => {
                    setHidePassword(!hidePassword);
                  }}
                >
                  {hidePassword ? <EyeIcon /> : <EyeClosedIcon />}
                </InputGroupButton>
              </InputGroup>
            </div>

            {error && <div className="text-sm text-destructive">{error}</div>}

            <div className="flex items-center justify-between">
              <Button type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>

              <Button variant="link">
                <Link href={"/sign-up"}>Create account</Link>
              </Button>
            </div>
          </form>

          <div className="my-4">
            <Separator />
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={handleGoogleSignIn} disabled={loading}>
              <span className="flex items-center gap-2">
                <Image src={Google} alt="Google" height={24} />
                Continue with Google
              </span>
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">By signing in you agree to our terms.</div>
        </CardFooter>
      </Card>
    </div>
  );
}

function parseFirebaseError(err: any): string {
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
}
