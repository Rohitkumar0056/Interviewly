import Link from "next/link";
import { CodeIcon } from "lucide-react";
import { SignedIn } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import DasboardBtn from "./DasboardBtn";
import AiBtn from "./AiBtn";
import { OrganizationSwitcher } from "@clerk/nextjs";

function Navbar() {
  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        {/* Left side - logo */}
        <Link
          href="/main"
          className="flex items-center gap-2 font-semibold text-2xl mr-6 font-mono hover:opacity-80 trasition-opacity"
        >
          <CodeIcon className="size-8 text-emerald-500" />
          <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            Interviewly
          </span>
        </Link>

        {/* Right side - actions */}
        <SignedIn>
          <OrganizationSwitcher /> 
          
          <div className="flex items-center space-x-4 ml-auto">
            <DasboardBtn />
            <AiBtn />
            <UserButton />   
          </div>
        </SignedIn>
      </div>
    </nav>
  );
}

export default Navbar;
