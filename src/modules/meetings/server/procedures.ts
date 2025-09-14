import { db } from "@/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import {  agents, meetings, session } from "@/db/schema"
import { z } from "zod";
import { and, eq, getTableColumns, ilike, sql, desc, count } from "drizzle-orm";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";
import { TRPCError } from "@trpc/server";
import { meetingsInsertSchema, meetingsUpdateSchema } from "../schemas";
import { MeetingStatus } from "../types";
import { streamVideo } from "@/lib/stream-video";
import { generatedAvatrUri } from "@/lib/avatar";

export const meetingsRouter = createTRPCRouter({
    generateToken: protectedProcedure
        .mutation(async ({ ctx }) => {
            if (!ctx.auth.data) {
                throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
            }

            await streamVideo.upsertUsers([
                {
                    id: ctx.auth.data.user.id,
                    name: ctx.auth.data.user.name,
                    role: "admin",
                    image: 
                        ctx.auth.data.user.image ?? 
                        generatedAvatrUri({ seed: ctx.auth.data.user.name, variant: "initials" })
                }
            ]);
        
        const expirationTime = Math.floor(Date.now() / 1000) + 3600;
        const issuedAt = Math.floor(Date.now() / 1000) - 60;

        const token = streamVideo.generateUserToken({
            user_id: ctx.auth.data.user.id,
            exp: expirationTime,
            iat: issuedAt
        });
        return token;
    }),

    remove: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ input, ctx }) => {
            const [ removedMeeting ] = await db
                .delete(meetings)
                .where(and(
                    eq(meetings.id, input.id),
                    eq(meetings.userId, ctx.auth.data!.session.userId)
                ))
                .returning();

            if (!removedMeeting) {
                throw new TRPCError({ 
                    code: "NOT_FOUND", 
                    message: "Meeting not found" 
                })
            }
            return removedMeeting
        }),

    update: protectedProcedure
        .input(meetingsUpdateSchema)
        .mutation(async ({ input, ctx }) => {
            const [ updatedMeeting ] = await db
                .update(meetings)
                .set(input)
                .where(and(
                    eq(meetings.id, input.id),
                    eq(meetings.userId, ctx.auth.data!.session.userId)
                ))
                .returning();

            if (!updatedMeeting) {
                throw new TRPCError({ 
                    code: "NOT_FOUND", 
                    message: "Meeting not found" 
                })
            }
            return updatedMeeting
        }),
    
    create: protectedProcedure
        .input(meetingsInsertSchema)
        .mutation(async ({ input, ctx }) => {
            if (!ctx.auth.data) {
                throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
            }

            const [createdMeeting] = await db
                .insert(meetings)
                .values({
                    ...input,
                    userId: ctx.auth.data.session.userId,
                    instructions: ""
                })
                .returning();
            
            const call = streamVideo.video.call("default", createdMeeting.id);
            await call.create({
                data: {
                    created_by_id: ctx.auth.data!.session.userId,
                    custom: {
                        meetingId: createdMeeting.id,
                        meetingName: createdMeeting.name,
                    },
                    settings_override: {
                        transcription: {
                            language: "en",
                            mode: "auto-on",
                            closed_caption_mode: "auto-on",
                        },
                        recording: {
                            mode: "auto-on",
                            quality: "1080p",
                        },
                    },
                },
            });


            const [existingAgent] = await db
                .select()
                .from(agents)
                .where(eq(agents.id, createdMeeting.agentId));

            if (!existingAgent) {
                throw new TRPCError({ 
                    code: "NOT_FOUND", 
                    message: "Agent not found" 
                });
            }

            await streamVideo.upsertUsers([
                {
                    id: existingAgent.id,
                    name: existingAgent.name,
                    role: "user",
                    image: generatedAvatrUri({ 
                        seed: existingAgent.name, 
                        variant: "botttsNeutral" })
                }
            ]);

            return createdMeeting;
        }),

    getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
        const [existingMeeting] = await db
            .select({
                ...getTableColumns(meetings),
                agent: {
                    ...getTableColumns(agents),
                    duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as("duration")
                }
            })
            .from(meetings)
            .innerJoin(agents, eq(meetings.agentId, agents.id))
            .where(
                and(
                    eq(meetings.id, input.id),
                    eq(meetings.userId, ctx.auth.data!.session.userId)    
                )
            )

        if (!existingMeeting) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Meeting not found" })
        }

        return existingMeeting
    }),
  
    getMany: protectedProcedure
    .input(z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z
            .number()
            .min(MIN_PAGE_SIZE)
            .max(MAX_PAGE_SIZE)
            .default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
        agentId: z.string().nullish(),
        status: z.enum([
            MeetingStatus.UPCOMING,
            MeetingStatus.ACTIVE,
            MeetingStatus.COMPLETED,
            MeetingStatus.PROCESSING,
            MeetingStatus.CANCELLED,
        ]).nullish(),
    })
    )
    .query(async ({ ctx, input }) => {

        const { page, pageSize, search, status, agentId } = input;   

        const data = await db
            .select({
                
                ...getTableColumns(meetings),
                agent: {
                    ...getTableColumns(agents),
                    duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as("duration")
                }
            })
            .from(meetings)
            .innerJoin(agents, eq(meetings.agentId, agents.id))
            .where(
                and(
                eq(meetings.userId, ctx.auth.data!.session.userId),
                search ? ilike(meetings.name, `%${search}%`) : undefined,
                status ? eq(meetings.status, status) : undefined,
                agentId ? eq(meetings.agentId, agentId) : undefined
                )
            )
            .orderBy(desc(meetings.createdAt), desc(meetings.id))
            .limit(pageSize)
            .offset((page - 1)* pageSize)

        const total = await db
            .select({ count: count() })
            .from(meetings)
            .innerJoin(agents, eq(meetings.agentId, agents.id))
            .where(
                and(
                    eq(meetings.userId, ctx.auth.data!.session.userId),
                    search ? ilike(meetings.name, `%${search}%`) : undefined,
                    status ? eq(meetings.status, status) : undefined,
                    agentId ? eq(meetings.agentId, agentId) : undefined
                )
            )

        const totalPages = Math.ceil(total[0].count / pageSize);

        //await new Promise((resolve) => setTimeout(resolve, 5000))

        return {
            items: data,
            total: total[0].count,
            totalPages,
        }
    }),


});