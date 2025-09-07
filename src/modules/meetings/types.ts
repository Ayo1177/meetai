import { inferRouterOutputs } from '@trpc/server'

import type { AppRouter } from "@/trpc/routers/_app"

export type MeetingGetone = inferRouterOutputs<AppRouter>["meetings"]["getOne"]
export type MeetingMany = inferRouterOutputs<AppRouter>["meetings"]["getMany"]["items"]
export enum MeetingStatus {
    UPCOMING = "upcoming",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    PROCESSING = "processing",
    ACTIVE = "active",
}
