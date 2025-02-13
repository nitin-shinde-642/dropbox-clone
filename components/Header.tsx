import { SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggler } from "./ThemeToggler";

function Header() {
  return (
    <header className="flex items-center justify-between shadow-md px-5 py-3">
      <Link href={"/"} className="flex items-center space-x-2">
        <Image
          src={"https://www.vectorlogo.zone/logos/dropbox/dropbox-tile.svg"}
          width={50}
          height={50}
          alt="Logo"
        />
        <h1 className="font-bold text-xl">DropBox</h1>
      </Link>

      {/* theme toggler */}
      <div className="px-5 flex space-x-2 items-center">
      <ThemeToggler />
          <UserButton />
          <SignedOut>
            <SignInButton forceRedirectUrl={"/dashboard"} mode="modal" />
          </SignedOut>
      </div>
    </header>
  );
}
export default Header;
