import Image from "next/image";
import AppLogo from "../../public/images/logo_light.svg";

export default function Page() {
  return (
    <main className="template-container">
      <Image src={AppLogo} alt="" height={200} />
      <h2>Under construction</h2>
    </main>
  );
}
