import { db } from "@/database/client";
import * as schema from "@/database/schema";
import { eq } from "drizzle-orm";
import {
  getMovieDetails,
  getPopularMovies,
  getRecommendationsForMovie,
  getTrendingMovies,
  MovieItem,
} from "./tmdb";

/**
 * Generates personalized recommendations for a user.
 */
export async function getPersonalizedRecommendations(
  userId: string | null,
): Promise<MovieItem[]> {
  // Unauthenticated user fallback
  if (!userId) {
    const popular = await getPopularMovies(1);
    return popular.results.slice(0, 12);
  }

  try {
    // Getting user data
    const [userRatings, userWatchlist, userPrefs] = await Promise.all([
      db.select().from(schema.ratings).where(eq(schema.ratings.userId, userId)),
      db
        .select()
        .from(schema.watchlist)
        .where(eq(schema.watchlist.userId, userId)),
      db
        .select()
        .from(schema.preferences)
        .where(eq(schema.preferences.userId, userId)),
    ]);

    // Movies to exclude (already watchlisted or rated)
    const ratedMovieIds = new Set(userRatings.map((r) => r.movieId));
    const watchlistMovieIds = new Set(userWatchlist.map((w) => w.movieId));
    const excludedMovieIds = new Set([...ratedMovieIds, ...watchlistMovieIds]);

    // Genre preferences profile
    const genreWeights: Record<number, number> = {};

    // Base weights from explicitly selected genres in profile
    if (userPrefs && userPrefs.length > 0 && userPrefs[0].favoriteGenres) {
      const explicitGenres = userPrefs[0].favoriteGenres
        .split(",")
        .map((id) => parseInt(id.trim()))
        .filter((id) => !isNaN(id));

      explicitGenres.forEach((genreId) => {
        genreWeights[genreId] = (genreWeights[genreId] || 0) + 5; // Give high weight to explicit preferences
      });
    }

    // Add weights from watchlist items
    // Since we don't store movie genres in the watchlist table directly (we store basic details),
    // we will fetch genres for watchlisted/rated movies when generating recommendations, or extract
    // them. To keep things fast and avoid TMDB rate limits, we fetch details of up to 5 favorite movies.
    const favoriteMovieIds = [
      ...userRatings.filter((r) => r.rating >= 4).map((r) => r.movieId),
      ...userWatchlist.map((w) => w.movieId),
    ].slice(0, 5); // Take up to 5 reference movies

    // If the user has no history, fallback to trending boosted by preferred genres
    if (favoriteMovieIds.length === 0) {
      const trending = await getTrendingMovies(1);

      // Score trending based on preferred genres
      const scoredTrending = trending.results
        .filter((m) => !excludedMovieIds.has(m.id))
        .map((m) => {
          let score = m.r || 0; // base score is rating
          m.genreIds.forEach((gid) => {
            if (genreWeights[gid]) {
              score += genreWeights[gid];
            }
          });
          return { movie: m, score };
        });

      return scoredTrending
        .sort((a, b) => b.score - a.score)
        .map((x) => x.movie)
        .slice(0, 12);
    }

    // 3. Collaborative similarities: Get recommendations from TMDB for favorite movies
    const recommendationPromises = favoriteMovieIds.map((id) =>
      getRecommendationsForMovie(id)
        .then((res) => res.results)
        .catch(() => [] as MovieItem[]),
    );
    const recommendationResults = await Promise.all(recommendationPromises);

    // Build map of candidate movies and counts of how often they were suggested
    const candidateCounts: Record<number, { movie: MovieItem; count: number }> =
      {};

    // Retrieve genres for favorite movies to update genreWeights profile
    const detailsPromises = favoriteMovieIds.map((id) =>
      getMovieDetails(id).catch(() => null),
    );
    const detailsResults = await Promise.all(detailsPromises);

    detailsResults.forEach((details) => {
      if (details) {
        details.genreIds.forEach((gid) => {
          genreWeights[gid] = (genreWeights[gid] || 0) + 2; // Add weights for actual interaction
        });
      }
    });

    recommendationResults.forEach((movies) => {
      movies.forEach((m) => {
        if (excludedMovieIds.has(m.id)) return; // Skip already watched/saved movies

        if (candidateCounts[m.id]) {
          candidateCounts[m.id].count += 1;
        } else {
          candidateCounts[m.id] = { movie: m, count: 1 };
        }
      });
    });

    // 4. Score candidates
    const scoredCandidates = Object.values(candidateCounts).map(
      ({ movie, count }) => {
        // Base score is based on similarity count (co-occurrence)
        let score = count * 4.0;

        // Add vote average rating score
        score += movie.r || 0;

        // Add genre profile match bonus
        movie.genreIds.forEach((gid) => {
          if (genreWeights[gid]) {
            score += genreWeights[gid] * 1.5;
          }
        });

        return { movie, score };
      },
    );

    // Sort by score descending and return top 12
    const finalRecommendations = scoredCandidates
      .sort((a, b) => b.score - a.score)
      .map((x) => x.movie);

    if (finalRecommendations.length > 0) {
      return finalRecommendations.slice(0, 12);
    }

    // Fallback if candidates list is too small
    const popular = await getPopularMovies(1);
    return popular.results
      .filter((m) => !excludedMovieIds.has(m.id))
      .slice(0, 12);
  } catch (error) {
    console.error("Error generating recommendations:", error);
    const popular = await getPopularMovies(1);
    return popular.results.slice(0, 12);
  }
}
