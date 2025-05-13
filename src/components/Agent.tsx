"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants/data";
import { createFeedback } from "@/lib/actions/general.action";

interface Message {
  type: string;
  transcriptType?: "partial" | "final";
  transcript?: string;
  role?: "user" | "system" | "assistant";
}

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
}: AgentProps) => {
  const router = useRouter();

  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: Message) => {
      if (
        message.type === "transcript" &&
        message.transcriptType === "final" &&
        message.role &&
        message.transcript
      ) {
        const newMessage: SavedMessage = {
          role: message.role,
          content: message.transcript,
        };
        setMessages((prev: SavedMessage[]) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.log("Error:", error);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      console.log("handleGenerateFeedback");

      const { success, feedbackId: id } = await createFeedback({
        interviewId: interviewId!,
        userId: userId!,
        transcript: messages,
        feedbackId,
      });

      if (success && id) {
        router.push(`/ai-interview/${interviewId}/feedback`);
      } else {
        console.log("Error saving feedback");
        router.push("/ai-interview");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/ai-interview");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    if (type === "generate") {
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
        variableValues: {
          username: userName,
          userid: userId,
        },
        clientMessages: [],
        serverMessages: [],
      });
    } else {
      let formattedQuestions = "";
      if (questions) {
        formattedQuestions = questions
          .map((question) => `- ${question}`)
          .join("\n");
      }

      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
        },
        clientMessages: [],
        serverMessages: [],
      });
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  return (
    <>
      <div className="flex sm:flex-row flex-col gap-10 items-center justify-between w-full">
        {/* AI Interviewer Card */}
        <div
          className="flex items-center justify-center flex-col gap-2 p-7 h-[400px] bg-gradient-to-b from-[#171532] to-[#08090D] rounded-lg border-2 border-primary-200/50 flex-1 sm:basis-[45%] w-full
      mt-5 ml-20"
        >
          <div
            className="relative w-[120px] h-[120px] flex items-center justify-center 
                  bg-gradient-to-tr from-blue-400 to-white rounded-full 
                  overflow-visible"
          >
            {isSpeaking && (
              <span
                className="absolute inset-0 block animate-ping rounded-full 
                       bg-white/40 opacity-75 z-0"
              />
            )}
            <Image
              src="/ai-avatar.png"
              alt="profile-image"
              width={65}
              height={54}
              className="relative z-10 object-cover"
            />
          </div>
          <h3 className="text-2xl font-semibold">AI Interviewer</h3>
        </div>

        {/* User Profile Card */}
        <div className="bg-gradient-to-b from-[#4B4D4F] to-[#4B4D4F33] p-0.5 rounded-2xl flex-1 sm:basis-[45%] w-full h-[400px] max-md:hidden mt-5 mr-20">
          <div className="flex flex-col gap-2 justify-center items-center p-7 bg-gradient-to-b from-[#1A1C20] to-[#08090D] rounded-2xl min-h-full">
            <Image
              src="/profile-avatar.png"
              alt="profile-image"
              width={539}
              height={539}
              className="rounded-full object-cover size-[120px]"
            />
            <h3 className="text-2xl font-semibold">{userName}</h3>
          </div>
        </div>
      </div>

      <br />

      {messages.length > 0 && (
        <div className="bg-gradient-to-b from-[#4B4D4F] to-[#4B4D4F33] p-0.5 rounded-2xl w-full">
          <div className="bg-gradient-to-b from-[#1A1C20] to-[#08090D] rounded-2xl  min-h-12 px-5 py-3 flex items-center justify-center">
            <p
              key={lastMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      <br />

      <div className="w-full flex justify-center">
        {callStatus !== "ACTIVE" ? (
          <button
            className="relative inline-flex items-center justify-center px-7 py-3 font-bold text-sm text-white bg-green-500 rounded-full shadow-sm overflow-visible focus:outline-none hover:bg-green-600 active:bg-green-600"
            onClick={handleCall}
          >
            {/* Ping ripple */}
            <span
              className={cn(
                "absolute inset-0 inline-flex h-full w-full animate-ping rounded-full bg-white/40 opacity-75 z-0",
                callStatus !== "CONNECTING" && "hidden"
              )}
            />
            {/* Button label */}
            <span className="relative z-10">
              {callStatus === "INACTIVE" || callStatus === "FINISHED"
                ? "Call"
                : "..."}
            </span>
          </button>
        ) : (
          <button
            className="relative inline-flex items-center justify-center px-7 py-3 font-bold text-sm leading-5 text-white bg-red-600 border border-transparent rounded-full shadow-sm overflow-visible focus:outline-none focus:shadow-2xl hover:bg-red-700 active:bg-red-700 min-w-20"
            onClick={handleDisconnect}
          >
            End
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
