"use client";

import Link from "next/link";
import { SparklesIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useUserRole } from "@/hooks/useUserRole";

function AiBtn() {
    const {isInterviewer, isLoading} = useUserRole()

    if(isInterviewer || isLoading) return null

    return (
        <Link href={"/ai-interview"}>
            <Button className="gap-2 font-medium" size={"sm"}>
                <SparklesIcon className="size-4"/>
                AI Interview
            </Button>
        </Link>
    );
};

export default AiBtn;
