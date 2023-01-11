import { TRPCError } from "@trpc/server";
import slugify from "slugify";
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const productRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const limit = input.limit ?? 50;
      const { cursor } = input;
      const items = await ctx.prisma.product.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        nextCursor = nextItem!.id;
      }
      return {
        items,
        nextCursor,
      };
    }),
  getBySlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const product = await ctx.prisma.product.findUnique({
        where: { slug: input.slug },
        include: {
          user: {
            select: { name: true, image: true },
          },
        },
      });
      return product;
    }),
  submitProduct: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        tagline: z.string(),
        website: z.string().url(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const slug = slugify(input.name, {
        lower: true,
        trim: true,
        strict: true,
      });
      const exists = await ctx.prisma.product.findUnique({ where: { slug } });
      if (exists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Product already exists.",
        });
      }
      const product = await ctx.prisma.product.create({
        data: {
          ...input,
          slug,
          userId: ctx.session.user.id,
        },
      });
      return product;
    }),
  updateProduct: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        tagline: z.string(),
        slug: z.string(),
        website: z.string().url(),
        motivation: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      let product = await ctx.prisma.product.findUnique({
        where: {
          slug: input.slug,
        },
      });
      if (!product || product.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found.",
        });
      }

      product = await ctx.prisma.product.update({
        where: {
          slug: input.slug,
        },
        data: {
          ...input,
        },
      });

      return product;
    }),
  updateProductLogo: protectedProcedure
    .input(z.object({ slug: z.string(), image: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.product.update({
        data: { logo: input.image },
        where: { slug: input.slug },
      });
    }),
});
