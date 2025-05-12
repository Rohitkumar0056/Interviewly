// components/ClientLayout.tsx
"use client";

import Navbar from "./Navbar";
import { useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { ThemeProvider } from "./providers/ThemeProvider";
import { Toaster } from "react-hot-toast";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const path = usePathname();

  // 1) Don’t render anything until Clerk has finished loading auth state
  if (!isLoaded) {
    return null;
  }

  // 2) If signed-out and not already on /homepage, redirect immediately
  if (!isSignedIn && path !== "/homepage") {
    router.replace("/homepage");
    return null;
  }

  // 3) If signed-in but still on /homepage, send to /main
  if (isSignedIn && path === "/homepage") {
    router.replace("/main");
    return null;
  }

  // 4) Otherwise:
  //    • signed-out on /homepage  → render children  
  //    • signed-in on other pages → render children with Navbar & Toaster
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {isSignedIn && <Navbar />}
      <main>{children}</main>
      {isSignedIn && <Toaster />}
    </ThemeProvider>
  );
}
