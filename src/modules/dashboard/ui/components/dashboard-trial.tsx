import { MAX_FREE_AGENTS } from "@/modules/premium/server/constants"
import { useTRPC } from "@/trpc/client"
import { RocketIcon } from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

export const DashboardTrial = () => {
    const trpc = useTRPC()
    const {data} = trpc.premium.getFreeUsage.useQuery()

    return (
        <div className="border border-border/10 rounded-lg w-full bg-white/5 flex flex-col gap-y-2">
            <div className="p-3 flex flex-col gap-y-4">
                <div className="flex items-center gap-2">
                    <RocketIcon className="size-4" />
                    <p className="text-sm font-medium">
                        Free Trial
                    </p>
                </div>
                <div>
                    <p className="text-xs">
                        {data?.agentCount?.count || 0}/{MAX_FREE_AGENTS} agents
                    </p>
                    <Progress value={((data?.agentCount?.count || 0) / MAX_FREE_AGENTS) * 100} />
                </div>
                <div>
                    <p className="text-xs">
                        {data?.meetingCount?.count || 0}/{MAX_FREE_AGENTS} Meetings
                    </p>
                    <Progress value={((data?.meetingCount?.count || 0) / MAX_FREE_AGENTS) * 100} />
                </div>
            </div>
            <Button 
                asChild
                className="bg-primary/10 border-t border-border/10 hover:bg-primary/20 rounded-t-none text-primary-foreground"
            >
                <Link href="/upgrade">
                    Upgrade
                </Link>
            </Button>
        </div>
    )
}