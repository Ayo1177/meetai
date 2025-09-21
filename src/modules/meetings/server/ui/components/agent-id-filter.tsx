import { useTRPC } from "@/trpc/client"
import { useState } from "react"
import { useMeetingsFilters } from "@/modules/meetings/hooks/use-meetings-filters"
import { CommandSelect } from "./command-select"
import { GeneratedAvatar } from "@/components/generated-avatar"




export const AgentIdFilter = () => {
    const [filters, setFilters] = useMeetingsFilters()

    const trpc = useTRPC();

    const [agentSearch, setAgentSearch] = useState("");
    const { data } = trpc.agents.getMany.useQuery({
        pageSize: 100,
        search: agentSearch,
    });


    
    return (
        <CommandSelect
            className="h-9 w-[200px]"
            options={data?.items?.map((agent) => ({
                id: agent.id,
                value: agent.id,
                children: (
                    <div className="flex items-center gap-2">
                        <GeneratedAvatar
                            variant="botttsNeutral"
                            seed={agent.name}
                            className="size-4"
                        />
                        <span>{agent.name}</span>
                    </div>
                )
            })) ?? []}
            onSelect={(value) => setFilters({ agentId: value })}
            onSearch={setAgentSearch}
            value={filters.agentId ?? ""}
            placeholder="Select Agent"
        />
    )
}
