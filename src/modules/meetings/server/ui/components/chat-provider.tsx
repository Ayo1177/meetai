"use client";

import { LoadingState } from "@/components/loading-state";
import { authClient } from "@/lib/auth-client";
import { ChatUI } from "./chat-ui";



interface Props {
    meetingId: string;
    meetingName: string;
}

export const ChatProvider = ({
    meetingId,
    meetingName,
}: Props) => {
    const { data, isPending, error } = authClient.useSession();

    console.log("ChatProvider - Auth state:", { data, isPending, error });

    if (isPending) {
        return (
            <LoadingState
                title="Loading ..."
                description="please wait while we load the chat"
            />
        );
    }

    if (!data || !data.user) {
        return (
            <LoadingState
                title="Authentication Error"
                description="Please sign in to access the chat"
            />
        );
    }

    return (
        <ChatUI
            meetingId={meetingId}
            meetingName={meetingName}
            userId={data.user.id}
            userName={data.user.name}
            userImage={data.user.image ?? ""}
        />
    );
}
