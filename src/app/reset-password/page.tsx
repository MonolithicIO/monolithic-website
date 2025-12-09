"use client";

import React, { JSX, Suspense } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@core/components/ui/card";
import { Button } from "@core/components/ui/button";
import { Label } from "@core/components/ui/label";
import Link from "next/link";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@core/components/ui/input-group";
import { ArrowLeftIcon, CheckCircle2Icon, LockIcon, Loader2Icon } from "lucide-react";
import useResetPasswordViewModel from "./reset-password.viewmodel";

function ResetPasswordContent(): JSX.Element {
  const {
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
  } = useResetPasswordViewModel();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  if (validatingCode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Loader2Icon className="h-16 w-16 text-primary animate-spin" />
            </div>
            <CardTitle className="text-center">Validating reset link</CardTitle>
            <CardDescription className="text-center">
              Please wait while we verify your password reset link...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!codeValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Invalid Reset Link</CardTitle>
            <CardDescription className="text-center text-destructive">
              {error || "This password reset link is invalid or has expired."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <Link href="/forgot-password" className="flex items-center gap-2">
                Request a new reset link
              </Link>
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/login" className="text-sm text-primary hover:underline">
              Back to sign in
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle2Icon className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-center">Password reset successful</CardTitle>
            <CardDescription className="text-center">
              Your password has been successfully reset for <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center mb-4">
              You can now sign in with your new password.
            </p>
            <Button className="w-full">
              <Link href="/login" className="flex items-center gap-2">
                <ArrowLeftIcon className="h-4 w-4" />
                Back to sign in
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create new password</CardTitle>
          <CardDescription>
            Enter a new password for <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="my-2" htmlFor="password">
                New Password
              </Label>
              <InputGroup>
                <InputGroupInput
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Enter new password"
                  className="mt-1"
                  minLength={6}
                />
                <InputGroupAddon>
                  <LockIcon />
                </InputGroupAddon>
              </InputGroup>
            </div>

            <div>
              <Label className="my-2" htmlFor="confirmPassword">
                Confirm Password
              </Label>
              <InputGroup>
                <InputGroupInput
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm new password"
                  className="mt-1"
                  minLength={6}
                />
                <InputGroupAddon>
                  <LockIcon />
                </InputGroupAddon>
              </InputGroup>
            </div>

            {error && <div className="text-sm text-destructive">{error}</div>}

            <div className="flex flex-col gap-2">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Resetting password..." : "Reset password"}
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

export default function ResetPasswordPage(): JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Loader2Icon className="h-16 w-16 text-primary animate-spin" />
              </div>
              <CardTitle className="text-center">Loading...</CardTitle>
            </CardHeader>
          </Card>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
