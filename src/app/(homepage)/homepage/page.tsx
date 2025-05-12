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

          <div className="absolute z-10 bg-black/80 border-[2px] border-green-500 p-8 rounded-lg w-[800px] h-[500px] flex flex-col items-center">
            <h1 className="text-7xl font-bold mb-6 text-green-500">CodeSync</h1>

            <div className="flex items-strech justify-center w-full gap-12 flex-1">
              {/* User Side */}
              <div className="flex-1 flex flex-col items-center text-center">
                <h2 className="text-4xl font-semibold mb-5 text-white">
                  For Candidates
                </h2>
                <p className="text-xl mb-5 w-4/5 text-zinc-400">
                  "Show your skills, not just your resume." <br /> <br />
                  Join live interviews that let your talent speak louder than
                  words.
                </p>
                <SignInButton mode="modal" forceRedirectUrl={"/main"}>
                  <button className="px-4 py-2 border border-white text-green-500 rounded hover:bg-green-500 hover:text-black transition">
                    Get Started
                  </button>
                </SignInButton>
              </div>

              {/* Divider */}
              <div className="w-px bg-green-900" />

              {/* Admin Side */}
              <div className="flex-1 flex flex-col items-center text-center">
                <h2 className="text-4xl font-semibold mb-5 text-white">
                  For Interviewers
                </h2>
                <p className="text-xl mb-5 w-4/5 text-zinc-400">
                  "Interview smarter. Hire better." <br /> <br />
                  Connect with top talent through seamless video interviews.
                </p>
                <SignInButton mode="modal" forceRedirectUrl={"/main"}>
                  <button className="px-4 py-2 border border-white text-green-500 rounded hover:bg-green-500 hover:text-black transition">
                    Get Started
                  </button>
                </SignInButton>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
