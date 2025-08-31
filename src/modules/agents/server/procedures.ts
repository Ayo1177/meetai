import { db } from "@/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { agents, session } from "@/db/schema"
import { agentsInsertSchema } from "../schemas";
import { z } from "zod";
import { eq, getTableColumns } from "drizzle-orm";

export const agentsRouter = createTRPCRouter({
    getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
        const [existingAgent] = await db
            .select({
                meetingCount: sql<number>'5',
                ...getTableColumns(agents),
            })
            .from(agents)
            .where(eq(agents.id, input.id))

        return existingAgent
    }),
  
    getMany: protectedProcedure.query(async () => {
        const data = await db
            .select()
            .from(agents);

        //await new Promise((resolve) => setTimeout(resolve, 5000))

        return data
    }),


    create: protectedProcedure
        .input(agentsInsertSchema)
        .mutation(async ({ input, ctx }) => {
            const [createdAgent] = await db
                .insert(agents)
                .values({
                    ...input,
                    iserId: (ctx.auth as any).data.session.userId
                })
                .returning()
                
            return createdAgent
        })
})