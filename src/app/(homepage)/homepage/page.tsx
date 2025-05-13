"use client";
import { SignInButton, SignedOut, SignedIn, SignUpButton } from "@clerk/nextjs";
import "./home.css";

export default function Home() {
  return (
    <>
      <main>
        <section>
          {[...Array(150)].map((_, i) => (
            <span key={i}></span>
          ))}

          <div className="absolute z-10 bg-black/80 border-[2px] border-green-500 p-8 rounded-lg w-[600px] h-[537px] flex flex-col items-center">
            <h1 className="text-7xl font-bold mb-6 text-green-500">
              Interviewly
            </h1>
            
            <div className="loader">
              <h2>Interview <br /> Innovate <br /> Iterate</h2>
            </div>

            <br />

            <SignInButton mode="modal" forceRedirectUrl={"/main"}>
              <button className="px-4 py-2 border border-white text-green-500 rounded hover:bg-green-500 hover:text-black transition">
                Get Started
              </button>
            </SignInButton>
          </div>
        </section>
      </main>
    </>
  );
}
