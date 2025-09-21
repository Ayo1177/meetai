import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { 
    createTRPCRouter,
    protectedProcedure
} from "@/trpc/init";
import { count, eq } from "drizzle-orm";
import { polarClient } from "@/lib/polar";


export const premiumRouter = createTRPCRouter({

    getCurrentSubscription: protectedProcedure.query(async ({ ctx }) => {
        const customer = await polarClient.customers.getStateExternal({
            externalId: ctx.auth.data.user.id,
        })
        const subscription = customer.activeSubscriptions[0]
        if (!subscription) {
            return null
        }
        const product = await polarClient.products.get({
            id: subscription.productId,
        })
        return product
    }),

    getProducts: protectedProcedure.query(async ({ ctx }) => {
        const products = await polarClient.products.list({
            isArchived: false,
            isRecurring: true,
            sorting: ["price_amount"],
        })
        return products.result.items
    }),
    
    getFreeUsage: protectedProcedure.query(async ({ ctx }) => {
        if (!ctx.auth?.data?.user?.id) {
            throw new Error('User not authenticated')
        }

        const customer = await polarClient.customers.getStateExternal({
            externalId: ctx.auth.data.user.id,
        })
        const subscription = customer.activeSubscriptions[0]

        if (subscription) {
            return null
        }

        const [userMeetings] = await db
            .select({
                count: count(meetings.id),
            })
            .from(meetings)
            .where(eq(meetings.userId, ctx.auth.data.user.id))

        const [userAgents] = await db
            .select({
                count: count(agents.id),
            })
            .from(agents)
            .where(eq(agents.userId, ctx.auth.data.user.id))

        return {
            meetingCount: userMeetings,
            agentCount: userAgents,
        }
    })
})