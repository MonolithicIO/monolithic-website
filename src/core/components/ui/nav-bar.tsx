"use client";
import { Moon, Sun, User, LogOut, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import LightLogo from "@images/monolithic-horizontal-light.svg";
import DarkLogo from "@images/monolithic-horizontal-dark.svg";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { Button } from "./button";
import Link from "next/link";
import { useUser } from "src/hooks/user.hook";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { useRouter } from "next/navigation";

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
            {user && <UserMenu />}
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

function UserMenu() {
  const { user, clearUser } = useUser();
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  const handleLogout = () => {
    clearUser();
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full border border-border bg-background px-2 py-1.5 transition-colors hover:bg-accent focus:outline-none">
          <div className="relative h-8 w-8 overflow-hidden rounded-full bg-muted flex items-center justify-center">
            {user?.photoUrl && !imageError ? (
              <Image
                src={user.photoUrl}
                alt={`${user.displayName || "User"} profile`}
                width={32}
                height={32}
                className="object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <User className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.displayName || "User"}</p>
            <p className="text-xs leading-none text-muted-foreground">My Account</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
