"use client"

import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { BanIcon, Link, VideoIcon } from "lucide-react"





export const CancelledState = () => {
    return (
        <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
            <EmptyState
                image="/cancelled.svg"
                title="Meeting is Active"
                description="Meeting will end once all participants have left"
            />

            
        </div>
    
    )
}