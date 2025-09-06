"use client"

import { useTRPC } from "@/trpc/client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

export const MeetingsView = () => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(
        trpc.meetings.getMany.queryOptions({}));
    
    return (
        <div>
            {/*JSON.stringify(data)*/}
        </div> 
    )
}