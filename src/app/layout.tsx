import { Inter } from "next/font/google";
import "./global.css";
import { ThemeProvider } from "next-themes";
import NavBar from "@core/components/ui/nav-bar";
import { Metadata } from "next";
import React from "react";
import { Toaster } from "sonner";
import { UserProvider } from "src/hooks/user.hook";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Monolithic",
    default: "Home | Monolithic",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <UserProvider>
            <NavBar />
            <main>{children}</main>
            <Toaster />
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
