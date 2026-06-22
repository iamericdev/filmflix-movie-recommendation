/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getPersonalizedRecommendations } from "./recommendations";
import * as tmdb from "./tmdb";

// ---------------------------------------------------------------------------
// Module-level mock for the database client.
// We use a factory that replaces every call with a no-op chain so that the
// real Neon DB is never touched during unit tests.
// ---------------------------------------------------------------------------
vi.mock("@/database/client", () => {
  const where = vi.fn().mockResolvedValue([]);
  const from = vi.fn().mockReturnValue({ where });
  const select = vi.fn().mockReturnValue({ from });
  return { db: { select } };
});

import { db } from "@/database/client";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build a mock implementation for `db.select()` that returns different data
 * for each consecutive call.  The `getPersonalizedRecommendations` function
 * uses `Promise.all([ratings, watchlist, prefs])`, so calls are always in
 * that order.
 */
function mockDbSelectSequence(
  ratingsResult: any[],
  watchlistResult: any[],
  prefsResult: any[],
) {
  let callIndex = 0;
  const results = [ratingsResult, watchlistResult, prefsResult];

  (db.select as ReturnType<typeof vi.fn>).mockImplementation(() => ({
    from: vi.fn().mockReturnValue({
      where: vi.fn().mockImplementation(() => {
        const result = results[callIndex] ?? [];
        callIndex++;
        return Promise.resolve(result);
      }),
    }),
  }));
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Recommendation Engine", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  // -------------------------------------------------------------------------
  it("should return general popular movies for unauthenticated users (cold start fallback)", async () => {
    const popularMock = {
      results: [
        {
          id: 101,
          t: "Popular 1",
          img: "img1",
          backdrop: "b1",
          y: 2021,
          r: 4.5,
          overview: "",
          genreIds: [28],
        },
        {
          id: 102,
          t: "Popular 2",
          img: "img2",
          backdrop: "b2",
          y: 2022,
          r: 4.0,
          overview: "",
          genreIds: [35],
        },
      ],
      totalPages: 1,
    };

    const popularSpy = vi
      .spyOn(tmdb, "getPopularMovies")
      .mockResolvedValue(popularMock as any);

    const recs = await getPersonalizedRecommendations(null);

    expect(popularSpy).toHaveBeenCalledTimes(1);
    expect(recs).toHaveLength(2);
    expect(recs[0].id).toBe(101);
  });

  // -------------------------------------------------------------------------
  it("should score and boost recommendations based on user genre preferences", async () => {
    const userId = "user_abc_123";

    // No ratings, no watchlist, explicit genre prefs = Action (28) + Adventure (12)
    mockDbSelectSequence(
      [], // ratings - empty - favoriteMovieIds = []
      [], // watchlist - empty
      [{ favoriteGenres: "28,12" }], // preferences
    );

    // Mock TMDB trending (already mapped MovieItem shape because we spy on the
    // high-level function, not fetchWithCache)
    const trendingMock = {
      results: [
        { id: 1, t: "Action Movie", genreIds: [28], r: 4.0 }, // score = 4.0 + 5 = 9.0
        { id: 2, t: "Comedy Movie", genreIds: [35], r: 4.5 }, // score = 4.5
        { id: 3, t: "Action/Adventure Movie", genreIds: [28, 12], r: 3.5 }, // score = 3.5 + 5 + 5 = 13.5
      ],
      totalPages: 1,
    };
    const trendingSpy = vi
      .spyOn(tmdb, "getTrendingMovies")
      .mockResolvedValue(trendingMock as any);

    const recs = await getPersonalizedRecommendations(userId);

    expect(trendingSpy).toHaveBeenCalledTimes(1);
    // Should return movies ordered by custom genre score (Action/Adventure > Action > Comedy)
    expect(recs).toHaveLength(3);
    expect(recs[0].id).toBe(3); // Score 13.5
    expect(recs[1].id).toBe(1); // Score 9.0
    expect(recs[2].id).toBe(2); // Score 4.5
  });

  // -------------------------------------------------------------------------
  it("should filter out movies already in the user's watchlist or ratings list", async () => {
    const userId = "user_abc_123";

    // Both movies rated below the 4-star threshold → favoriteMovieIds stays
    // empty, keeping us on the trending path. But both IDs end up in
    // excludedMovieIds so they're filtered from results.
    mockDbSelectSequence(
      [
        { movieId: 1, rating: 2 }, // rated - low - excluded
        { movieId: 2, rating: 3 }, // rated - low - excluded
      ],
      [], // watchlist
      [], // preferences
    );

    const trendingMock = {
      results: [
        { id: 1, t: "Already Rated", genreIds: [28], r: 4.0 },
        { id: 2, t: "Also Rated", genreIds: [35], r: 4.5 },
        { id: 3, t: "New Movie", genreIds: [16], r: 4.2 },
      ],
      totalPages: 1,
    };
    vi.spyOn(tmdb, "getTrendingMovies").mockResolvedValue(trendingMock as any);

    const recs = await getPersonalizedRecommendations(userId);

    // Movies 1 and 2 are excluded, only Movie 3 remains
    expect(recs).toHaveLength(1);
    expect(recs[0].id).toBe(3);
  });
});
