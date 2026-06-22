/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clearTmdbCache, fetchWithCache, mapTmdbMovie } from "./tmdb";

describe("TMDB API Client & Caching", () => {
  beforeEach(() => {
    clearTmdbCache();
    vi.stubEnv("TMDB_API_KEY", "test_api_key_123");
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should map raw TMDB movie structures to MovieItem format correctly", () => {
    const rawMovie = {
      id: 550,
      title: "Fight Club",
      poster_path: "/dummy_poster.jpg",
      backdrop_path: "/dummy_backdrop.jpg",
      release_date: "1999-10-15",
      vote_average: 8.433,
      overview: "An insomniac office worker...",
      genre_ids: [18, 53],
    };

    const mapped = mapTmdbMovie(rawMovie);

    expect(mapped).toEqual({
      id: 550,
      t: "Fight Club",
      img: "https://image.tmdb.org/t/p/w500/dummy_poster.jpg",
      backdrop: "https://image.tmdb.org/t/p/original/dummy_backdrop.jpg",
      y: 1999,
      r: 4.2, // 8.433 / 2 rounded to 1 decimal
      overview: "An insomniac office worker...",
      genreIds: [18, 53],
    });
  });

  it("should fetch details and cache subsequent identical requests", async () => {
    const mockResponse = { results: [{ id: 1, title: "Movie 1" }] };

    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });
    globalThis.fetch = fetchSpy;

    // First request - should call fetch
    const firstResult = await fetchWithCache<any>("/movie/popular", {
      page: 1,
    });
    expect(firstResult).toEqual(mockResponse);
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    // Second request with same inputs - should return cached value and NOT fetch again
    const secondResult = await fetchWithCache<any>("/movie/popular", {
      page: 1,
    });
    expect(secondResult).toEqual(mockResponse);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("should fetch again if cache TTL expires", async () => {
    const mockResponse = { results: [{ id: 1, title: "Movie 1" }] };

    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });
    globalThis.fetch = fetchSpy;

    // First request
    await fetchWithCache<any>("/movie/popular", { page: 1 }, 10); // 10ms TTL
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    // Wait for TTL expiration (15ms)
    await new Promise((resolve) => setTimeout(resolve, 15));

    // Second request - should fetch again
    await fetchWithCache<any>("/movie/popular", { page: 1 }, 10);
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it("should return fallback empty/mock data if TMDB_API_KEY is not defined", async () => {
    vi.stubEnv("TMDB_API_KEY", ""); // Clear key

    const mockResponse = { results: [] };
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });
    globalThis.fetch = fetchSpy;

    const result = await fetchWithCache<any>("/movie/popular", { page: 1 });
    expect(result).toEqual({ results: [], page: 1, total_pages: 1 });
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
