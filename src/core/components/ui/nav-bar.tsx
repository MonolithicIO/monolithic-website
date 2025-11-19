"use client";
import { Moon, Sun } from "lucide-react";
import Image from "next/image";
import LightLogo from "@images/monolithic-horizontal-light.svg";
import DarkLogo from "@images/monolithic-horizontal-dark.svg";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { Button } from "./button";
import Link from "next/link";

export default function Navbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme == "dark";
  const pathName = usePathname();
  const showLoginButtons = !["/login", "/sign-up"].includes(pathName);

  const toggleTheme = () => {
    if (isDark) {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between">
          <Image src={isDark ? LightLogo : DarkLogo} alt="Monolithic logo" height={64} className="flex items-center" />

          {/* Mark: Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Mark: Theme Toggle */}
            {showLoginButtons && <LoginButtons />}
            <button
              onClick={toggleTheme}
              className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              aria-label="Toggle theme"
            >
              {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function LoginButtons() {
  return (
    <div className="flex flex-row gap-4">
      <Button variant="outline">
        <Link href={"login"}>Log in</Link>
      </Button>
      <Button>
        <Link href={"sign-up"}>Sign up</Link>
      </Button>
    </div>
  );
}
