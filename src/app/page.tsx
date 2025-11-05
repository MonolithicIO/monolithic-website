"use client";
import Image from "next/image";
import LightLogo from "@images/monolithic-vertical-light.svg";
import DarkLogo from "@images/monolithtic-vertical-dark.svg";
import { useTheme } from "next-themes";

export default function Page() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme == "dark";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8">
      <Image src={isDark ? LightLogo : DarkLogo} alt="" height={200} />
      <h2 className="text-4xl font-bold text-foreground">Under construction</h2>
      <p className="text-muted-foreground">We're working hard to bring you something amazing!</p>
    </main>
  );
}
