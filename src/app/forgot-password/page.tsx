"use client";

import React, { JSX } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@core/components/ui/card";
import { Button } from "@core/components/ui/button";
import { Label } from "@core/components/ui/label";
import Link from "next/link";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@core/components/ui/input-group";
import { ArrowLeftIcon, CheckCircle2Icon, MailIcon } from "lucide-react";
import useForgotPasswordViewModel from "./forgot-password.viewmodel";

export default function ForgotPasswordPage(): JSX.Element {
  const { email, setEmail, loading, error, success, onSubmit, onDismissSuccess } = useForgotPasswordViewModel();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle2Icon className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-center">Check your email</CardTitle>
            <CardDescription className="text-center">
              We&apos;ve sent a password reset link to <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Click the link in the email to reset your password. If you don&apos;t see it, check your spam folder.
            </p>
            <Button variant="outline" className="w-full">
              <Link href="/login" className="flex items-center gap-2">
                <ArrowLeftIcon className="h-4 w-4" />
                Back to sign in
              </Link>
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              variant="link"
              onClick={() => {
                onDismissSuccess();
              }}
            >
              Try a different email
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset your password</CardTitle>
          <CardDescription>
            Enter your email address and we&apos;ll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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

            {error && <div className="text-sm text-destructive">{error}</div>}

            <div className="flex flex-col gap-2">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Sending..." : "Send reset link"}
              </Button>

              <Button variant="outline" className="w-full">
                <Link href="/login" className="flex items-center gap-2">
                  <ArrowLeftIcon className="h-4 w-4" />
                  Back to sign in
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Remembered your password?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
