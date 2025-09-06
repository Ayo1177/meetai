"use client"

import { GeneratedAvatar } from "@/components/generated-avatar"
import { Badge } from "@/components/ui/badge"
import { ColumnDef } from "@tanstack/react-table"
import { CornerDownRightIcon, ClockFadingIcon } from "lucide-react"
import { ClockIcon, Loader2, CheckCircle2, XCircle } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import humanizeDuration from "humanize-duration"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

function fomatDuration(seconds: number) {
    return humanizeDuration(seconds * 1000, {
        largest:1,
        round: true,
        units: ["h", "m", "s"],
    })
}

const statusIconMap = {
    upcoming: ClockIcon,
    active: Loader2,
    completed: CheckCircle2,
    processing: Loader2,
    cancelled: XCircle,
}

const statusColorMap = {
    upcoming: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
    active: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    completed: "text-green-500 bg-green-500/10 border-green-500/20",
    processing: "text-gray-500 bg-gray-500/10 border-gray-500/20",
    cancelled: "text-rose-500 bg-rose-500/10 border-rose-500/20",
}

export const columns: ColumnDef<AgentMany[number]>[] = [
  {
    accessorKey: "name",
    header: "Meeting Name",
    cell: ({ row }) => (
        <div className="flex flex-col gap-y-1">
            <span className="font-semibold capitalize">
                {row.original.name}
            </span>
            <div className="flex items-center gap-x-2">
                <div className="text-sm text-muted-foreground max-w-[200px] truncate capitalize">
                    <CornerDownRightIcon className="size-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground max-w-[200px] truncate capitalize">
                        {row.original.instructions}
                    </span>
                </div>
                <GeneratedAvatar
                    variant="botttsNeutral"
                    seed={row.original.agentname}
                    className="size-4"
                />
                <span>
                    {row.original.agent.name}
                </span>
            </div>
        </div>
    )
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
        const Icon = statusIconMap[row.original.status]
        return (
            <Badge 
                variant="outline"
                className={cn(
                    "capitalize [&>svg]:size-4 text-muted-foreground",
                    statusColorMap[row.original.status as keyof typeof statusColorMap]
                )}
            >
                <Icon
                    className={cn(
                        row.original.status === "processing" && "animate-spin"
                    )} 
                />
                {row.original.status}
            </Badge>
        )
    }
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => (
        <Badge
            variant="outline"
            className={cn(
                "capitalize [&>svg]:size-4 flex items-center gap-x-2",
                statusColorMap[row.original.status as keyof typeof statusColorMap]
            )}
        >
            <ClockFadingIcon className="text-blue-700" />
            {row.original.duration ? fomatDuration(row.original.duration) : "Not started"}
        </Badge>
    )
  },
]

type AgentMany = Array<{
    agent: any
    id: string;
    name: string;
    instructions?: string;
    agentname: string;
    status: "upcoming" | "active" | "completed" | "processing" | "cancelled";
    duration?: number;
    startedAt?: Date;
}>;