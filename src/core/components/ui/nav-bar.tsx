"use client";
import { useState } from "react";
import { Menu, X, Moon, Sun } from "lucide-react";
import Image from "next/image";
import LightLogo from "@images/monolithic-horizontal-light.svg";
import DarkLogo from "@images/monolithic-horizontal-dark.svg";

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between">
          <Image src={isDark ? DarkLogo : LightLogo} alt="Monolithic logo" height={64} className="flex items-center" />

          {/* Mark: Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Mark: Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
