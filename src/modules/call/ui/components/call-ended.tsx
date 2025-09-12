"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon } from "lucide-react";

export const CallEnded = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-sidebar-accent to-sidebar">
            <div className="py-4 px-8 flex flex-1 items-center justify-center">
                <div className="flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-10 shadow-lg max-w-md w-full">
                    <div className="flex flex-col items-center gap-y-4 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircleIcon className="w-8 h-8 text-green-600" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold">Call Ended</h2>
                            <p className="text-muted-foreground">
                                The meeting has been completed. A summary will be available shortly.
                            </p>
                        </div>
                    </div>
                    
                    <Button asChild className="w-full">
                        <Link href="/meetings">
                            Return to Meetings
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};