import Image from "next/image";
import { redirect } from "next/navigation";

import Agent from "@/components/Agent";
import { getRandomInterviewCover } from "@/lib/utils";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import DisplayTechIcons from "@/components/DisplayTechIcons";

const InterviewDetails = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const { userId } = await auth();
  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId!);

  const interview = await getInterviewById(id);
  if (!interview) redirect("/ai-interview");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: userId!,
  });

  return (
    <>
      <div className="flex flex-row gap-4 justify-between ml-20 mt-3">
        <div className="flex flex-row gap-4 items-center max-sm:flex-col">
          <div className="flex flex-row gap-4 items-center">
            <Image
              src={getRandomInterviewCover()}
              alt="cover-image"
              width={40}
              height={40}
              className="rounded-full object-cover size-[40px]"
            />
            <h3 className="capitalize text-2xl font-semibold">{interview.role} Interview</h3>
          </div>

          <DisplayTechIcons techStack={interview.techstack} />
        </div>

        <p className="bg-gray-700 capitalize px-4 py-2 rounded-lg h-fit mr-20">
          {interview.type}
        </p>
      </div>

      <Agent
        userName={user.firstName!}
        userId={userId!}
        interviewId={id}
        type="interview"
        questions={interview.questions}
        feedbackId={feedback?.id}
      />
    </>
  );
};

export default InterviewDetails;