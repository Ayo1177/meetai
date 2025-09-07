"use client"

import { columns } from "@/components/columns";
import { DataPagination } from "@/components/data-pagination";
import { DataTable } from "@/components/data-table";
import { EmptyState } from "@/components/empty-state";
import { useMeetingsFilters } from "@/modules/meetings/hooks/use-meetings-filters";
import { useTRPC } from "@/trpc/client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const MeetingsView = () => {
    const trpc = useTRPC();
    const router = useRouter();
    const [filters, setFilters] = useMeetingsFilters()
    const { data } = useSuspenseQuery(
        trpc.meetings.getMany.queryOptions({
            ...filters,
        }));
    
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
            <DataPagination
                page={filters.page}
                totalPages={data.totalPages}
                onPageChange={(page) => setFilters({ page })}
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