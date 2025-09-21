import { authClient } from "@/lib/auth-client"
import { UpgradeView, UpgradeViewError, UpgradeViewLoading } from "@/modules/premium/server/ui/views/upgrade-view"
import { getQueryClient, trpc } from "@/trpc/server"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"


const Page = async () => {
    const session = await authClient.getSession({
        headers: await headers(),
    })
    if (!session) {
        redirect("/sign-in")
    }


    const queryClient = getQueryClient()
    void queryClient.prefetchQuery(
        trpc.premium.getCurrentSubscription.queryOptions()
    )
    void queryClient.prefetchQuery(
        trpc.premium.getProducts.queryOptions()
    )

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<UpgradeViewLoading />}>
                <ErrorBoundary fallback={<UpgradeViewError />}>
                    <UpgradeView />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    )
}

export default Page