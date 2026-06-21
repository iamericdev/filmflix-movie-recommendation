import { db } from "@/database/client";
import * as schema from "@/database/schema";
import { getPersonalizedRecommendations } from "@/lib/recommendations";
import * as tmdb from "@/lib/tmdb";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const exampleRouter = createTRPCRouter({
  // Public procedures
  getGenres: baseProcedure.query(async () => {
    return await tmdb.getMovieGenres();
  }),

  getTrending: baseProcedure
    .input(
      z.object({
        page: z.number().default(1),
        genreId: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      return await tmdb.getTrendingMovies(input.page, input.genreId);
    }),

  getPopular: baseProcedure
    .input(
      z.object({
        page: z.number().default(1),
      })
    )
    .query(async ({ input }) => {
      return await tmdb.getPopularMovies(input.page);
    }),

  getRecentlyAdded: baseProcedure
    .input(
      z.object({
        page: z.number().default(1),
      })
    )
    .query(async ({ input }) => {
      return await tmdb.getRecentlyAddedMovies(input.page);
    }),

  getTopRated: baseProcedure
    .input(
      z.object({
        page: z.number().default(1),
      })
    )
    .query(async ({ input }) => {
      return await tmdb.getTopRatedMovies(input.page);
    }),

  searchMovies: baseProcedure
    .input(
      z.object({
        query: z.string(),
        page: z.number().default(1),
      })
    )
    .query(async ({ input }) => {
      return await tmdb.searchMovies(input.query, input.page);
    }),

  getMovieDetails: baseProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ input }) => {
      return await tmdb.getMovieDetails(input.id);
    }),

  getMovieRecommendations: baseProcedure
    .input(
      z.object({
        movieId: z.number(),
        page: z.number().default(1),
      })
    )
    .query(async ({ input }) => {
      return await tmdb.getRecommendationsForMovie(input.movieId, input.page);
    }),

  getPersonalizedRecommendations: baseProcedure.query(async ({ ctx }) => {
    // If user is logged in, use their ID for personalized algorithm.
    // If not, it will gracefully fallback to standard popular.
    const session = ctx && "auth" in ctx && ctx.auth ? (ctx.auth as any) : null;
    const userId = session?.user?.id || null;
    return await getPersonalizedRecommendations(userId);
  }),

  // Protected procedures (require active session)
  getWatchlist: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth.user.id;
    return await db.select().from(schema.watchlist).where(eq(schema.watchlist.userId, userId));
  }),

  toggleWatchlist: protectedProcedure
    .input(
      z.object({
        movieId: z.number(),
        title: z.string(),
        posterPath: z.string().nullable(),
        releaseDate: z.string().nullable(),
        voteAverage: z.number().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.auth.user.id;

      const existing = await db
        .select()
        .from(schema.watchlist)
        .where(
          and(
            eq(schema.watchlist.userId, userId),
            eq(schema.watchlist.movieId, input.movieId)
          )
        );

      if (existing.length > 0) {
        await db
          .delete(schema.watchlist)
          .where(
            and(
              eq(schema.watchlist.userId, userId),
              eq(schema.watchlist.movieId, input.movieId)
            )
          );
        return { added: false };
      } else {
        const id = crypto.randomUUID();
        await db.insert(schema.watchlist).values({
          id,
          userId,
          movieId: input.movieId,
          title: input.title,
          posterPath: input.posterPath,
          releaseDate: input.releaseDate,
          voteAverage: input.voteAverage,
        });
        return { added: true };
      }
    }),

  getRatings: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth.user.id;
    return await db.select().from(schema.ratings).where(eq(schema.ratings.userId, userId));
  }),

  getUserRatingForMovie: protectedProcedure
    .input(z.object({ movieId: z.number() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.auth.user.id;
      const res = await db
        .select()
        .from(schema.ratings)
        .where(
          and(
            eq(schema.ratings.userId, userId),
            eq(schema.ratings.movieId, input.movieId)
          )
        );
      return res[0] || null;
    }),

  rateMovie: protectedProcedure
    .input(
      z.object({
        movieId: z.number(),
        rating: z.number().min(1).max(5),
        title: z.string(),
        posterPath: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.auth.user.id;

      const existing = await db
        .select()
        .from(schema.ratings)
        .where(
          and(
            eq(schema.ratings.userId, userId),
            eq(schema.ratings.movieId, input.movieId)
          )
        );

      if (existing.length > 0) {
        await db
          .update(schema.ratings)
          .set({
            rating: input.rating,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(schema.ratings.userId, userId),
              eq(schema.ratings.movieId, input.movieId)
            )
          );
        return { updated: true };
      } else {
        const id = crypto.randomUUID();
        await db.insert(schema.ratings).values({
          id,
          userId,
          movieId: input.movieId,
          rating: input.rating,
          title: input.title,
          posterPath: input.posterPath,
        });
        return { updated: false };
      }
    }),

  getPreferences: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth.user.id;
    const res = await db
      .select()
      .from(schema.preferences)
      .where(eq(schema.preferences.userId, userId));
    return res[0] || null;
  }),

  updatePreferences: protectedProcedure
    .input(
      z.object({
        favoriteGenres: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.auth.user.id;

      const existing = await db
        .select()
        .from(schema.preferences)
        .where(eq(schema.preferences.userId, userId));

      if (existing.length > 0) {
        await db
          .update(schema.preferences)
          .set({
            favoriteGenres: input.favoriteGenres,
            updatedAt: new Date(),
          })
          .where(eq(schema.preferences.userId, userId));
        return { updated: true };
      } else {
        const id = crypto.randomUUID();
        await db.insert(schema.preferences).values({
          id,
          userId,
          favoriteGenres: input.favoriteGenres,
        });
        return { updated: false };
      }
    }),
});
