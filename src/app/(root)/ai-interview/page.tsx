import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { dummyInterviews } from "@/constants/data";
import InterviewCard from "@/components/InterviewCard";
import { useUser } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";

async function Home() {
  const { userId } = await auth();

  const [userInterviews, allInterview] = userId
    ? await Promise.all([
        getInterviewsByUserId(userId),
        getLatestInterviews({ userId }),
      ])
    : [null, null];

  const hasPastInterviews = userInterviews?.length! > 0;
  const hasUpcomingInterviews = allInterview?.length! > 0;

  return (
    <>
      <section className="flex flex-row bg-gradient-to-b from-[#171532] to-[#08090D] rounded-3xl px-16 py-6 items-center justify-between max-sm:px-4">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2 className="text-lg">Get Interview-Ready with AI-Powered Practice & Feedback</h2>
          <p className="text-lg">
            Practice real interview questions & get instant feedback
          </p>

          <Button
            asChild
            className="w-fit !bg-primary-200 !text-dark-100 hover:!bg-primary-200/80 !rounded-full !font-bold px-5 cursor-pointer min-h-10 max-sm:w-full"
          >
            <Link href="/ai-interview/create-interview">Start an Interview</Link>
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

      <section className="ml-10 mr-10 flex flex-col gap-6 mt-8">
        <h2 className="text-3xl font-semibold">Your Interviews</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={userId ?? undefined}
                id={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <p className="text-center text-muted-foreground">You haven&apos;t taken any interviews yet</p>
          )}
        </div>
      </section>

      <section className="ml-10 mr-10 flex flex-col gap-6 mt-8 mb-10">
        <h2 className="text-3xl font-semibold">Take Interviews</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {hasUpcomingInterviews ? (
            allInterview?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={userId ?? undefined}
                id={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <p className="text-center text-muted-foreground">There are no interviews available</p>
          )}
        </div>
      </section>
    </>
  );
}

export default Home;
