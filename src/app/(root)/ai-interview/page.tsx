import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { dummyInterviews } from "@/constants/data";
import InterviewCard from "@/components/InterviewCard";

async function Home() {
  return (
    <>
      <section className="flex flex-row bg-gradient-to-b from-[#171532] to-[#08090D] rounded-3xl px-16 py-6 items-center justify-between max-sm:px-4">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
          <p className="text-lg">
            Practice real interview questions & get instant feedback
          </p>

          <Button asChild className="w-fit !bg-primary-200 !text-dark-100 hover:!bg-primary-200/80 !rounded-full !font-bold px-5 cursor-pointer min-h-10 max-sm:w-full">
            <Link href="/create-interview">Start an Interview</Link>
          </Button>
        </div>

        <Image
          src="/robot.png"
          alt="robo-dude"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2 className="text-3xl font-semibold">Your Interviews</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {dummyInterviews.map((interview) => (
                <InterviewCard {...interview} key={interview.id}/>
            ))}

          {/*<p>You haven&apos;t taken any interviews yet</p>*/}
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2 className="text-3xl font-semibold">Take Interviews</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {dummyInterviews.map((interview) => (
                <InterviewCard {...interview} key={interview.id}/>
            ))}

          {/*<p>There are no interviews available</p>*/}
        </div>
      </section>
    </>
  );
}

export default Home;
