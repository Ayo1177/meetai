"use client"

import { ErrorState } from "@/components/error-state"
import { LoadingState } from "@/components/loading-state"
import { useTRPC } from "@/trpc/client";
import { PricingCard } from "../components/pricing-card";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";



export const UpgradeView = () => {
    const trpc = useTRPC();
    const [isHydrated, setIsHydrated] = useState(false);

    const { data: products, isLoading: productsLoading } = trpc.premium.getProducts.useQuery();

    const { data: currentSubscription, isLoading: subscriptionLoading } = trpc.premium.getCurrentSubscription.useQuery();

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    const isLoading = productsLoading || subscriptionLoading;
    
    if (!isHydrated || isLoading) {
        return <UpgradeViewLoading />;
    }
    
    return (
        <div className="flex-1 py-4 md:px-8 flex flex-col gap-y-10">
            <div className="mt-4 flex-1 flex flex-col gap-y-10 items-center">
                <h5 className="font-medium text-2xl md:text-3xl">
                    you are on the {" "}
                    <span className="font-semibold text-primary">
                        {currentSubscription?.name ?? "free"}
                    </span>{" "}
                    plan
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {products && products.length > 0 ? products.map((product) => {
                        const isCurrentProduct = product.id === currentSubscription?.id
                        const isPremium = !!currentSubscription

                        let buttonText = "Upgrade"
                        let onClick = () => authClient.checkout({ products: [product.id] })

                        if (isCurrentProduct) {
                            buttonText = "Manage"
                            onClick = () => authClient.customer.portal()
                        } else if (isPremium) {
                            buttonText = "Change Plan"
                            onClick = () => authClient.customer.portal()
                        }
                        
                        return (
                            <PricingCard
                                key={product.id}
                                buttonText={buttonText}
                                onClick={onClick}
                                variant={
                                    product.metadata?.variant === "highlighted"
                                    ? "highlighted"
                                    : "default"
                                }
                                title={product.name}
                                price={
                                    product.prices[0].type === "recurring"
                                    ? (product.prices[0] as { priceAmount: number }).priceAmount / 100
                                    : (product.prices[0] as { priceAmount: number }).priceAmount / 100
                                }
                                description={product.description ?? undefined}
                                priceSuffix={`/${product.prices[0].recurringInterval}`}
                                features={product.benefits.map(
                                    (benefit: { description: string }) => benefit.description
                                )}
                                badge={product.metadata?.badge as string | undefined}
                            />
                        )
                    }) : (
                        <div className="col-span-full text-center text-muted-foreground">
                            No products available
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}


export const UpgradeViewLoading = () => {
    return (
        <LoadingState
            title="Loading Upgrade"
            description="Please wait while we load the upgrade page"
        />
    )
}

export const UpgradeViewError = () => {
    return (
        <ErrorState
            title="Error Loading Upgrade"
            description="Please try again later"
        />
    )
}