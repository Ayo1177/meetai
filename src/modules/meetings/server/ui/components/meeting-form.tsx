"use client";

import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { MeetingGetone } from "@/modules/meetings/types";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { meetingsInsertSchema } from "@/modules/meetings/schemas";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useState } from "react";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { CommandSelect } from "./command-select";
import { NewAgentDialog } from "@/modules/agents/ui/views/components/new-agent-dialog";

interface MeetingFormProps {
    onSuccess: (id?: string) => void;
    onCancel: () => void;
    initialValues?: MeetingGetone;
}

export const MeetingForm = ({
    onSuccess,
    onCancel,
    initialValues,
}: MeetingFormProps) => {
    const trpc = useTRPC();
    const router = useRouter();
    const queryClient = useQueryClient();

    const [openNewAgentDialog, setOpenNewAgentDialog] = useState(false);
    const [agentSearch, setAgentSearch] = useState("");
    
    const agents = trpc.agents.getMany.useQuery({
        pageSize: 100,
        search: agentSearch,
    });

    const createMeeting = trpc.meetings.create.useMutation({
        onSuccess: async (data) => {
            await queryClient.invalidateQueries();
            onSuccess?.(data.id);
        },
        onError: (error) => {
            toast.error(error.message);

            if (error.data?.code === "FORBIDDEN") {
                router.push("/upgrade");
            }
        },
    });

    const updateMeeting = trpc.meetings.update.useMutation({
        onSuccess: async () => {
            await queryClient.invalidateQueries();
            onSuccess?.();
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const form = useForm<z.infer<typeof meetingsInsertSchema>>({
        resolver: zodResolver(meetingsInsertSchema),
        defaultValues: {
            name: initialValues?.name || "",
            agentId: initialValues?.agentId || "",
        },
    });

    const isEdit = !!initialValues?.id;
    const isPending = createMeeting.isPending || updateMeeting.isPending;

    const onSubmit = (values: z.infer<typeof meetingsInsertSchema>) => {
        if (isEdit) {
            updateMeeting.mutate({ ...values, id: initialValues?.id || "" });
        } else {
            createMeeting.mutate(values);
        }
    };

    return (
        <>
            <NewAgentDialog
                open={openNewAgentDialog}
                onOpenChange={setOpenNewAgentDialog}
            />
            <Form {...form}>
                <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>e.g. Math consultation</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Meeting Name" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="agentId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>agent</FormLabel>
                                <FormControl>
                                    <CommandSelect
                                        options={agents.data?.items?.map((agent) => ({
                                            id: agent.id,
                                            value: agent.id,
                                            children: (
                                                <div className="flex items-center gap-x-2">
                                                    <GeneratedAvatar
                                                        seed={agent.name}
                                                        variant="botttsNeutral"
                                                        className="border size-6"
                                                    />
                                                    <span>{agent.name}</span>
                                                </div>
                                            )
                                        })) ?? []}
                                        onSelect={field.onChange}
                                        onSearch={setAgentSearch}
                                        value={field.value}
                                        placeholder="Select Agent"
                                    />
                                </FormControl>
                                <FormDescription>
                                    Not found what you&apos;re looking for?{" "}
                                    <button
                                        type="button"
                                        className="text-primary hover:underline"
                                        onClick={() => setOpenNewAgentDialog(true)}
                                    >
                                        Create new agent
                                    </button>
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    <div className="flex justify-between gap-x-2">
                        {onCancel && (
                            <Button
                                variant="ghost" 
                                type="button"
                                onClick={() => onCancel()}
                            >
                                Cancel
                            </Button>
                        )}
                        <Button 
                            type="submit"
                            disabled={isPending}
                        >
                            {isEdit ? "Update" : "Create"}
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
};