"use client"

import { columns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import { EmptyState } from "@/components/empty-state";
import { useTRPC } from "@/trpc/client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import router from "next/router";

export const MeetingsView = () => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(
        trpc.meetings.getMany.queryOptions({}));
    
    return (
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
            <DataTable
            data={data.items.map(item => ({
                ...item,
                agentname: item.agent.name,
                duration: item.agent.duration
            }))}
            columns={columns}
            onRowClick={(row) => router.push(`/meetings/${row.id}`)}
            />
            {data.items.length === 0 && (
                <EmptyState 
                title="Create your first Meeting"
                description="Create to collaborate with others."
                />
            )}
        </div> 
    )
}