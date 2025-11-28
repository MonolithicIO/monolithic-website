"use client";

import React, { JSX } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@core/components/ui/card";
import { Button } from "@core/components/ui/button";
import { Label } from "@core/components/ui/label";
import Image from "next/image";
import { Separator } from "@core/components/ui/separator";
import Google from "@images/google.svg";
import Link from "next/link";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@core/components/ui/input-group";
import { EyeClosedIcon, EyeIcon, LockIcon, MailIcon } from "lucide-react";
import useLoginViewModel from "./login.viewmodel";

export default function SignInPage(): JSX.Element {
  const viewModel = useLoginViewModel();

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault();
    await viewModel.credentialSignIn();
  }

  async function handleGoogleSignIn() {
    viewModel.googleSignIn();
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
                  value={viewModel.email}
                  onChange={e => viewModel.setEmail(e.target.value)}
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
                  type={viewModel.hidePassword ? "text" : "password"}
                  value={viewModel.password}
                  onChange={e => viewModel.setPassword(e.target.value)}
                  required
                  placeholder="Your password"
                  className="mt-1"
                />
                <InputGroupAddon>
                  <LockIcon />
                </InputGroupAddon>
                <InputGroupButton
                  onClick={() => {
                    viewModel.setHidePassword(!viewModel.hidePassword);
                  }}
                >
                  {viewModel.hidePassword ? <EyeIcon /> : <EyeClosedIcon />}
                </InputGroupButton>
              </InputGroup>
            </div>

            {viewModel.error && <div className="text-sm text-destructive">{viewModel.error}</div>}

            <div className="flex items-center justify-between">
              <Button type="submit" disabled={viewModel.loading}>
                {viewModel.loading ? "Signing in..." : "Sign in"}
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
            <Button onClick={handleGoogleSignIn} disabled={viewModel.loading}>
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
