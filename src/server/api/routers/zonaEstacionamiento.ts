import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

// Schema para los objetos colocados
const placedObjectSchema = z.object({
  id: z.string(),
  objectType: z.object({
    id: z.string(),
    name: z.string(),
    icon: z.string(),
    width: z.number(),
    height: z.number(),
    color: z.string(),
  }),
  x: z.number(),
  y: z.number(),
  rotation: z.number().optional(),
});

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

  // Nuevo método para guardar objetos colocados
  saveObjects: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        placedObjects: z.array(placedObjectSchema),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, placedObjects } = input;
      
      // Verificar que el mapa pertenece al usuario
      const map = await ctx.db.zonaEstacionamiento.findFirst({
        where: { 
          id,
          createdById: ctx.session.user.id 
        },
      });

      if (!map) {
        throw new Error("Mapa no encontrado o no autorizado");
      }

      return ctx.db.zonaEstacionamiento.update({
        where: { id },
        data: {
          objectsData: JSON.stringify(placedObjects),
          updatedAt: new Date(),
        },
      });
    }),

  // Método para obtener objetos colocados
  getObjects: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const map = await ctx.db.zonaEstacionamiento.findFirst({
        where: { 
          id: input.id,
          createdById: ctx.session.user.id 
        },
      });

      if (!map || !map.objectsData) {
        return [];
      }

      try {
        return JSON.parse(map.objectsData);
      } catch {
        return [];
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.zonaEstacionamiento.delete({
        where: { id: input.id },
      });
    }),
});