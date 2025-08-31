import { inferRouterOutputs } from '@trpc/server'

import type { AppRouter } from "@/trpc/routers/_app"

export type AgentGetone = inferRouterOutputs<AppRouter>["agents"]["getOne"]

