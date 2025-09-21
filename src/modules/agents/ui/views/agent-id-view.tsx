"use client"

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { AgentIdViewHeader } from "./components/agent-id-view-header";
import { Badge, VideoIcon } from "lucide-react";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirm } from "../../hooks/use-confirm";
import { useState } from "react";
import { UpdateAgentDialog } from "./components/update-agent-dialog";

interface Props {
    agentId: string;
}

export const AgentIdView = ({ agentId }: Props) => {
    
    const trpc = useTRPC();
    const router = useRouter();
    const queryClient = useQueryClient();

    const [UpdateAgentDialogOpen, setUpdateAgentDialogOpen] = useState(false);
    
    const [data] = trpc.agents.getOne.useSuspenseQuery({ id: agentId });

    const removeAgent = trpc.agents.remove.useMutation({
        onSuccess: async () => {
            await queryClient.invalidateQueries();
            router.push("/agents");
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });

    const [RemoveConfirmationDialog, confirmRemove] = useConfirm();

    const handleRemoveAgent = async () => {
        const ok = await confirmRemove(
            "Are you sure?",
            `The following action will remove ${data.name} and all of its meetings`
        );
        
        if (!ok) return; 
        removeAgent.mutate({ id: agentId });
    };
    

    return (
        <>
        {RemoveConfirmationDialog}
        <UpdateAgentDialog 
        open={UpdateAgentDialogOpen} 
        onOpenChange={setUpdateAgentDialogOpen}
        initialValues={data}
        />
        <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
            <AgentIdViewHeader
              agentId={agentId}
              agentName={data.name}
              onEdit={() => {setUpdateAgentDialogOpen(true)}}
              onRemove={() => {handleRemoveAgent()}}
            />
            <div className="bg-white rounded-lg border">
                <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
                    <div className="flex flex-col gap-y-2">
                        <GeneratedAvatar
                            seed={data.name}
                            variant="botttsNeutral"
                            className="border size-16"
                        />
                        <h2 className="text-2xl font-medius">{data.name}</h2>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <span className="inline-flex items-center rounded border px-2 py-0.5 text-sm font-medium text-neutral-700 bg-white border-neutral-200">
                            <VideoIcon className="size-4 mr-1" />
                            {data.meetingCount} {data.meetingCount === 1 ? "meeting" : "meetings"}
                        </span>
                    </div>
                    <div className="flex flex-col gap-y-4">
                        <p className="text-lg font-medium">Instructions</p>
                        <p className="text-neutral-800">{data.instructions}</p>
                    </div>
                </div>
            </div>
        </div>
        </>
    )

}
    export const AgentsIdViewLoading = () => {
        return (
            <LoadingState
            title="loading Agent" 
            description="this may take a few seconds"
            />
        )
    }
    
    export const AgentsIdViewError = () => {
        return (
            <ErrorState
                title="Error Loading Agent"
                description="Something went wrong"
            />
        )
    }