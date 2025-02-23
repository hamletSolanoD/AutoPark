import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { zonaEstacionamientoRouter } from "./routers/zonaEstacionamiento";

export const appRouter = createTRPCRouter({
  zonaEstacionamiento: zonaEstacionamientoRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);