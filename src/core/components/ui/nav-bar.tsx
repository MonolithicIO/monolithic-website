"use client";
import { Moon, Sun, User } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import LightLogo from "@images/monolithic-horizontal-light.svg";
import DarkLogo from "@images/monolithic-horizontal-dark.svg";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { Button } from "./button";
import Link from "next/link";
import { useUser } from "src/hooks/user.hook";

export default function Navbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const { user } = useUser();
  const isDark = resolvedTheme == "dark";
  const pathName = usePathname();
  const showLoginButtons = !user && !["/login", "/sign-up"].includes(pathName);

  const toggleTheme = () => {
    if (isDark) {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between">
          <Link href={"/"}>
            <Image
              src={isDark ? LightLogo : DarkLogo}
              alt="Monolithic logo"
              height={64}
              className="flex items-center"
            />
          </Link>

          <div className="flex items-center gap-2">
            {showLoginButtons && <LoginButtons />}
            {user && <UserInfo />}
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

function UserInfo() {
  const { user, clearUser } = useUser();
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex flex-row items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-muted flex items-center justify-center">
          {user?.photoUrl && !imageError ? (
            <Image
              src={user.photoUrl}
              alt={`${user.displayName || "User"} profile`}
              width={40}
              height={40}
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <User className="h-5 w-5 text-muted-foreground" />
          )}
        </div>

        <span className="text-sm font-medium text-foreground">{user?.displayName || "User"}</span>
      </div>

      <Button variant="outline">
        <Link
          href={"/"}
          onClick={() => {
            clearUser();
          }}
        >
          Log out
        </Link>
      </Button>
    </div>
  );
}
