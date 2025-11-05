import Image from "next/image";
import AppLogo from "../../public/images/logo_light.svg";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8">
      <Image src={AppLogo} alt="" height={200} />
      <h2 className="text-4xl font-bold text-foreground">Under construction</h2>
      <p className="text-muted-foreground">We're working hard to bring you something amazing!</p>
    </main>
  );
}
