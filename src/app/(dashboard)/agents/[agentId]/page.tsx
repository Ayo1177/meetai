import { AgentIdView, AgentsIdViewLoading, AgentsIdViewError } from "@/modules/agents/ui/views/agent-id-view"
import { getQueryClient, trpc } from "@/trpc/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { parseAsNumberLiteral } from "nuqs"
import { Suspense } from "react"
import { ErrorBoundaryWrapper } from "@/components/error-boundary-wrapper"

interface Props {
    params: Promise<{agentId: string}>
}

const Page = async ({ params }: Props) => {
    const { agentId } = await params 

    const queryClient = getQueryClient()

    void queryClient.prefetchQuery(
        trpc.agents.getOne.queryOptions({ id: agentId })
    )

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<AgentsIdViewLoading />}>
                <ErrorBoundaryWrapper fallback={<AgentsIdViewError />}>
                    <AgentIdView agentId={agentId} />   
                </ErrorBoundaryWrapper>
            </Suspense>
        </HydrationBoundary>
    )
}

export default Page