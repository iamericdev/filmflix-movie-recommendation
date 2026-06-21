const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export interface MovieItem {
  id: number;
  t: string;          // title
  img: string;        // poster image URL
  backdrop: string;   // backdrop image URL
  y: number;          // release year
  r: number | null;   // rating (out of 5 stars)
  overview: string;
  genreIds: number[];
}

export interface Genre {
  id: number;
  name: string;
}

// In-memory cache store
interface CacheEntry<T> {
  data: T;
  expiry: number;
}

const memoryCache = new Map<string, CacheEntry<any>>();

/**
 * Gets a clean, formatted TMDB URL with API Key or token parameters.
 */
function getUrl(path: string, params: Record<string, string | number> = {}) {
  const url = new URL(`${TMDB_BASE_URL}${path}`);

  // If using short-form API Key, append it to URL
  if (TMDB_API_KEY && !TMDB_API_KEY.startsWith("ey")) {
    url.searchParams.append("api_key", TMDB_API_KEY);
  }

  Object.entries(params).forEach(([key, val]) => {
    url.searchParams.append(key, String(val));
  });

  return url.toString();
}

/**
 * Returns header authorization if using TMDB Read-Access Token (JWT).
 */
function getHeaders() {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (TMDB_API_KEY && TMDB_API_KEY.startsWith("ey")) {
    headers["Authorization"] = `Bearer ${TMDB_API_KEY}`;
  }

  return headers;
}

/**
 * Helper to fetch data with an in-memory cache fallback.
 */
export async function fetchWithCache<T>(
  path: string,
  params: Record<string, string | number> = {},
  ttlMs: number = 5 * 60 * 1000 // default 5 minutes
): Promise<T> {
  const cacheKey = JSON.stringify({ path, params });
  const cached = memoryCache.get(cacheKey);

  if (cached && cached.expiry > Date.now()) {
    return cached.data as T;
  }

  // If TMDB key is not defined, fall back gracefully to return mock structure or empty list
  if (!TMDB_API_KEY) {
    console.warn("TMDB_API_KEY is not defined. Returning fallback empty/mock data.");
    if (path.includes("genre")) {
      return { genres: [] } as any;
    }
    return { results: [], page: 1, total_pages: 1 } as any;
  }

  const url = getUrl(path, params);
  const headers = getHeaders();

  const response = await fetch(url, { headers, next: { revalidate: ttlMs / 1000 } });
  if (!response.ok) {
    throw new Error(`TMDB API request failed: ${response.statusText} (${response.status})`);
  }

  const data = await response.json();
  memoryCache.set(cacheKey, { data, expiry: Date.now() + ttlMs });

  return data as T;
}

/**
 * Clear in-memory cache (primarily for tests)
 */
export function clearTmdbCache() {
  memoryCache.clear();
}

/**
 * Map raw TMDB movie results into structured MovieItem format
 */
export function mapTmdbMovie(movie: any): MovieItem {
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : movie.first_air_date
    ? new Date(movie.first_air_date).getFullYear()
    : 0;

  return {
    id: movie.id,
    t: movie.title || movie.name || "Untitled",
    img: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "/images/p-johnwick.jpg", // Fallback to an existing asset
    backdrop: movie.backdrop_path
      ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
      : "/images/bg.png",
    y: isNaN(releaseYear) ? 0 : releaseYear,
    r: movie.vote_average ? parseFloat((movie.vote_average / 2).toFixed(1)) : null,
    overview: movie.overview || "",
    genreIds: movie.genre_ids || movie.genres?.map((g: any) => g.id) || [],
  };
}

// --- API Methods ---

export async function getMovieGenres(): Promise<Genre[]> {
  try {
    const data = await fetchWithCache<{ genres: Genre[] }>(
      "/genre/movie/list",
      { language: "en-US" },
      24 * 60 * 60 * 1000 // Cache genres for 24 hours
    );
    return data.genres || [];
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
}

export async function getTrendingMovies(page = 1, genreId?: number): Promise<{ results: MovieItem[]; totalPages: number }> {
  try {
    const data = await fetchWithCache<{ results: any[]; total_pages: number }>(
      "/trending/movie/week",
      { page }
    );

    let movies = (data.results || []).map(mapTmdbMovie);

    if (genreId) {
      movies = movies.filter((m) => m.genreIds.includes(genreId));
    }

    return {
      results: movies,
      totalPages: data.total_pages || 1,
    };
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return { results: [], totalPages: 1 };
  }
}

export async function getPopularMovies(page = 1): Promise<{ results: MovieItem[]; totalPages: number }> {
  try {
    const data = await fetchWithCache<{ results: any[]; total_pages: number }>(
      "/movie/popular",
      { page }
    );

    return {
      results: (data.results || []).map(mapTmdbMovie),
      totalPages: data.total_pages || 1,
    };
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    return { results: [], totalPages: 1 };
  }
}

export async function getRecentlyAddedMovies(page = 1): Promise<{ results: MovieItem[]; totalPages: number }> {
  try {
    // Sort discover endpoint by release date to get recently added/released movies
    const data = await fetchWithCache<{ results: any[]; total_pages: number }>(
      "/discover/movie",
      {
        page,
        sort_by: "primary_release_date.desc",
        "primary_release_date.lte": new Date().toISOString().split("T")[0],
      }
    );

    return {
      results: (data.results || []).map(mapTmdbMovie),
      totalPages: data.total_pages || 1,
    };
  } catch (error) {
    console.error("Error fetching recently added movies:", error);
    return { results: [], totalPages: 1 };
  }
}

export async function getTopRatedMovies(page = 1): Promise<{ results: MovieItem[]; totalPages: number }> {
  try {
    const data = await fetchWithCache<{ results: any[]; total_pages: number }>(
      "/movie/top_rated",
      { page }
    );

    return {
      results: (data.results || []).map(mapTmdbMovie),
      totalPages: data.total_pages || 1,
    };
  } catch (error) {
    console.error("Error fetching top rated movies:", error);
    return { results: [], totalPages: 1 };
  }
}

export async function searchMovies(query: string, page = 1): Promise<{ results: MovieItem[]; totalPages: number }> {
  if (!query.trim()) {
    return { results: [], totalPages: 1 };
  }
  try {
    const data = await fetchWithCache<{ results: any[]; total_pages: number }>(
      "/search/movie",
      { query, page }
    );

    return {
      results: (data.results || []).map(mapTmdbMovie),
      totalPages: data.total_pages || 1,
    };
  } catch (error) {
    console.error("Error searching movies:", error);
    return { results: [], totalPages: 1 };
  }
}

export async function getMovieDetails(id: number): Promise<MovieItem & { genres: Genre[]; runtime: number; tagline: string; credits: any }> {
  const data = await fetchWithCache<any>(
    `/movie/${id}`,
    { append_to_response: "credits,videos" },
    10 * 60 * 1000 // Cache details for 10 minutes
  );

  const mapped = mapTmdbMovie(data);
  return {
    ...mapped,
    genres: data.genres || [],
    runtime: data.runtime || 0,
    tagline: data.tagline || "",
    credits: {
      cast: (data.credits?.cast || []).slice(0, 10).map((c: any) => ({
        id: c.id,
        name: c.name,
        character: c.character,
        profilePath: c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : null,
      })),
      crew: (data.credits?.crew || []).slice(0, 10).map((c: any) => ({
        id: c.id,
        name: c.name,
        job: c.job,
      })),
    },
  };
}

export async function getRecommendationsForMovie(movieId: number, page = 1): Promise<{ results: MovieItem[]; totalPages: number }> {
  try {
    const data = await fetchWithCache<{ results: any[]; total_pages: number }>(
      `/movie/${movieId}/recommendations`,
      { page }
    );

    return {
      results: (data.results || []).map(mapTmdbMovie),
      totalPages: data.total_pages || 1,
    };
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return { results: [], totalPages: 1 };
  }
}
