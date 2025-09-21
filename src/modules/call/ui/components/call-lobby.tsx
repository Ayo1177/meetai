"use client"

import { authClient } from "@/lib/auth-client";
import { generatedAvatrUri } from "@/lib/avatar";
import { DefaultVideoPlaceholder, VideoPreview, useCallStateHooks, StreamVideoParticipant, ToggleAudioPreviewButton, ToggleVideoPreviewButton } from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LogInIcon } from "lucide-react";

interface Props {
    onJoin: () => void;
}

export const CallLobby = ({
    onJoin,
}: Props) => {
    const { } = useCallStateHooks();

    const hasBrowserPermission = true; // Simplified for now

    const DisabledVideoPreview = () => {
        const { data } = authClient.useSession();

        const avatarUrl = data?.user?.image ?? 
            generatedAvatrUri({ 
                seed: data?.user?.name ?? "", 
                variant: "initials"
            });

        return (
            <div className="relative w-full h-full">
                <DefaultVideoPlaceholder
                    participant={{
                        name: data?.user?.name ?? "",
                        image: avatarUrl,
                    } as StreamVideoParticipant
                }
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Image 
                        src={avatarUrl} 
                        alt={data?.user?.name ?? "User"} 
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-lg"
                    />
                </div>
            </div>
        );
    };

    const AllowBrowserPermissions = () => {
        return (
            <p className="text-sm text-muted-foreground">
                Please grant your browser permission to access your camera and microphone
            </p>
        );
    };

    return (
        <div className="flex flex-col items-center justify-center h-full bg-radial from-sidebar-accent to-sidebar">
            <div className="py-4 px-8 flex flex-1 items-center justify-center">
                <div className="flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-10 shadow-sm">
                    <div className="flex flex-col gap-y-2 text-center">
                        <h6 className="text-lg font-medius">Ready to join?</h6>
                        <p>Set up your call before joining</p>
                    </div>
                    <VideoPreview
                        DisabledVideoPreview={
                            hasBrowserPermission
                                ? DisabledVideoPreview
                                : AllowBrowserPermissions
                        }
                    />

                    <div className="flex gap-x-2">
                        <ToggleAudioPreviewButton />
                        <ToggleVideoPreviewButton />
                    </div>
                    <div className="fle gap-x-2">
                        <Button asChild variant="ghost">
                            <Link href="/meetings">
                                Cancel
                            </Link>
                        </Button>
                        <Button 
                        onClick={onJoin}
                        >
                            <LogInIcon />
                            Join Call
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};