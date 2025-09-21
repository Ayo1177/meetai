"use client"

import { useTRPC } from "@/trpc/client";
import { CallProvider } from "../components/call-provider";
import { ErrorState } from "@/components/error-state";

interface Props {
    meetingId: string
}

export const CallView = ({ 
    meetingId 
}: Props) => {
    const trpc = useTRPC();
    const [data] = trpc.meetings.getOne.useSuspenseQuery({ id: meetingId });


    if (data.status === "completed") {
        return (
            <div className="flex h-screen items-center justify-center">
                <ErrorState
                    title="Meeting has ended"
                    description="you can no longer join this meeting"
                />
            </div>
        );
    }

    return <CallProvider meetingId={meetingId} meetingName={data.name} />;
}