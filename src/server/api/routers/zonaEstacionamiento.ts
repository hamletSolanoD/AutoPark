// server/api/routers/zonaEstacionamiento.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const zonaEstacionamientoRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        metrosX: z.number(),
        metrosY: z.number(),
        nombreDeArea: z.string(),
        numeroEstacionamientos: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.zonaEstacionamiento.create({
        data: {
          ...input,
          createdBy: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.zonaEstacionamiento.findMany({
      where: { createdById: ctx.session.user.id },
      orderBy: { createdAt: "desc" },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.zonaEstacionamiento.findFirst({
        where: { 
          id: input.id,
          createdById: ctx.session.user.id 
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        metrosX: z.number(),
        metrosY: z.number(),
        nombreDeArea: z.string(),
        numeroEstacionamientos: z.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.zonaEstacionamiento.update({
        where: { id },
        data,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.zonaEstacionamiento.delete({
        where: { id: input.id },
      });
    }),
});