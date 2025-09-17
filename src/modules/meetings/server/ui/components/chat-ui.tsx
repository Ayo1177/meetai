import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import type { Channel as StreamChannel, StreamChat } from "stream-chat";
import {
    Channel,
    Chat,
    MessageInput,
    MessageList,
    Thread,
    Window,
} from "stream-chat-react";


import "stream-chat-react/dist/css/v2/index.css";


interface ChatUIProps {
    meetingId: string;
    meetingName: string;
    userId: string;
    userName: string;
    userImage: string | undefined;
}

export const ChatUI = ({
    meetingId,
    meetingName,
    userId,
    userName,
    userImage,
}: ChatUIProps) => {
    const trpc = useTRPC();
    const { data: token, isLoading: isTokenLoading } = useQuery(
        trpc.meetings.generateChatToken.queryOptions()
    );

    const [channel, setChannel] = useState<StreamChannel>();
    const [client, setClient] = useState<StreamChat | null>(null);

    // Only create client when token is available
    useEffect(() => {
        if (!token || !process.env.NEXT_PUBLIC_STREAM_CHAT_API_KEY) {
            return;
        }

        const createClient = async () => {
            try {
                const { StreamChat } = await import("stream-chat");
                const newClient = new StreamChat(
                    process.env.NEXT_PUBLIC_STREAM_CHAT_API_KEY!
                );
                
                await newClient.connectUser(
                    {
                        id: userId,
                        name: userName,
                        image: userImage,
                    },
                    token
                );
                
                setClient(newClient);
            } catch (error) {
                console.error("Failed to create Stream Chat client:", error);
            }
        };

        createClient();
    }, [token, userId, userName, userImage]);

    console.log("ChatUI - Token state:", { token, isTokenLoading, userId, userName, userImage });
    console.log("ChatUI - Client state:", { client, userId, userName, userImage });

    useEffect(() => {
        if (!client) {
            console.log("ChatUI - No client available yet");
            return;
        }

        console.log("ChatUI - Creating channel for meeting:", meetingId);
        const newChannel = client.channel("messaging", meetingId, {
            name: meetingName,
            members: [userId],
        });

        setChannel(newChannel);
    }, [client, meetingId, meetingName, userId]);

    if (isTokenLoading || !token || !client || !channel) {
        return (
            <LoadingState
                title="Loading Chat"
                description="please wait while we load the chat"
            />
        );
    }

    return (
        <div className="bg-white rounded-lg border overflow-hidden">
            <Chat client={client}>
                <Channel channel={channel}>
                    <Window>
                        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-23rem)] border-b">
                            <MessageList />
                        </div>
                        <MessageInput />
                    </Window>
                    <Thread />
                </Channel>
            </Chat>
        </div>
    );
}