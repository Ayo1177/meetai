"use client"

import { columns } from "@/components/columns";
import { DataPagination } from "@/components/data-pagination";
import { DataTable } from "@/components/data-table";
import { EmptyState } from "@/components/empty-state";
import { useMeetingsFilters } from "@/modules/meetings/hooks/use-meetings-filters";
import { useTRPC } from "@/trpc/client";
import { useRouter } from "next/navigation";

export const MeetingsView = () => {
    const trpc = useTRPC();
    const router = useRouter();
    const [filters, setFilters] = useMeetingsFilters()
    const [data] = trpc.meetings.getMany.useSuspenseQuery({
        ...filters,
    });
    
    return (
        <div className="flex-1 pb-4 px-4 md:px-8">
            <div className="flex flex-col gap-y-4">
                <DataTable
                data={data.items.map(item => ({
                    id: item.id,
                    name: item.name,
                    instructions: item.instructions || undefined,
                    agentname: item.agent.name,
                    status: item.status,
                    duration: item.agent.duration,
                    startedAt: item.startedAt ? new Date(item.startedAt) : undefined,
                    agent: item.agent
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
        </div> 
    )
}