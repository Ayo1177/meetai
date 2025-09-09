"use client"

import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { BanIcon, Link, VideoIcon } from "lucide-react"



interface Props {
    meetingId: string;
    onCancelMeeting: () => void;
    inCancelling: boolean;
}

export const UpcomingState = ({
    meetingId,
    onCancelMeeting,
    inCancelling,
}: Props) => {
    return (
        <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
            <EmptyState
                image="/upcoming.svg"
                title="Not Started Yet"
                description="once you start this meeting, a summary will appear here"
            />
            <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-full"> 
                <Button
                    variant="secondary"
                    className="w-full lg:w-auto"
                    onClick={onCancelMeeting}
                    disabled={inCancelling}
                >
                    <BanIcon />
                    Cancel Meeting
                </Button>
                <Button 
                    disabled={inCancelling} 
                    asChild 
                    className="w-full lg:w-[250px]"
                >
                    <Link href={`/calls/${meetingId}/start`} className="flex items-center gap-2 w-full">
                        <VideoIcon className="w-4 h-4" />
                        Start Meeting
                    </Link>
                </Button>
            </div>
        </div>
    
    )
}