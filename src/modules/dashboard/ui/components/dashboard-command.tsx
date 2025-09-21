import { 
  CommandResponsiveDialog, 
  CommandInput, 
  CommandList,
  CommandItem,
  CommandGroup,
  CommandEmpty
} from "@/components/ui/command";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";

interface Props {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}


export const DashboardCommand = ({ open, setOpen }: Props) => {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const trpc = useTRPC()
  const { data: meetings } = trpc.meetings.getMany.useQuery({
    search,
    pageSize: 100,
  })

  const { data: agents } = trpc.agents.getMany.useQuery({
    search,
    pageSize: 100,
  })

  return (
    <CommandResponsiveDialog shouldFilter={false} open={open} onOpenChange={setOpen}>
        <CommandInput 
        placeholder="Find a meeting or agent"
        value={search}
        onValueChange={(value) => setSearch(value)}
        />
        <CommandList>
          <CommandGroup heading="Meetings">
            <CommandEmpty>
              <span className="text-muted-foreground text-sm">No meetings found</span>
            </CommandEmpty>
              {meetings?.items?.map((meeting) => (
                <CommandItem 
                  key={meeting.id}
                  onSelect={() => {
                    router.push(`/meetings/${meeting.id}`);
                    setOpen(false);
                  }}
                >
                  {meeting.name}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Agents">
            <CommandEmpty>
              <span className="text-muted-foreground text-sm">No agents found</span>
            </CommandEmpty>
              {agents?.items?.map((agent) => (
                <CommandItem 
                  key={agent.id}
                  onSelect={() => {
                    router.push(`/agents/${agent.id}`);
                    setOpen(false);
                  }}
                >
                  {agent.name}
                </CommandItem>
              ))}
            </CommandGroup>
        </CommandList>
    </CommandResponsiveDialog>
  )
}