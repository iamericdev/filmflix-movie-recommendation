"use client";

import { authClient } from "@/lib/auth/client";
import { MovieItem } from "@/lib/tmdb";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Plus, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { cats, tabIcons, tabs } from "../../server/data";
import { FeatureBanner } from "../components/feature-banner";
import { HeroSection } from "../components/hero";
import { Row } from "../components/row-component";

const GENRE_MAPPING: Record<string, number> = {
  Action: 28,
  Adventure: 12,
  Animation: 16,
  Fiction: 878, // Sci-fi
  Heroes: 14, // Fantasy
  Comedy: 35,
};

export const HomeView = () => {
  const trpc = useTRPC();
  const { data: session } = authClient.useSession();

  const [tab, setTab] = useState<string>("Trending");
  const [cat, setCat] = useState<string>("Action");
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const [moviesList, setMoviesList] = useState<MovieItem[]>([]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
    setMoviesList([]);
  }, [debouncedQuery]);

  const { data: personalizedRecs, isLoading: isRecsLoading } = useQuery(
    trpc.movies.getPersonalizedRecommendations.queryOptions(undefined, {
      enabled: !!session,
    }),
  );

  const isTrending = tab === "Trending" && !debouncedQuery;
  const isPopular = tab === "Popular" && !debouncedQuery;
  const isRecent = tab === "Recent" && !debouncedQuery;
  const isPremium = tab === "Premium" && !debouncedQuery;

  const { data: trendingRes, isLoading: isTrendingLoading } = useQuery(
    trpc.movies.getTrending.queryOptions(
      { page, genreId: GENRE_MAPPING[cat] },
      { enabled: isTrending },
    ),
  );

  const { data: popularRes, isLoading: isPopularLoading } = useQuery(
    trpc.movies.getPopular.queryOptions({ page }, { enabled: isPopular }),
  );

  const { data: recentRes, isLoading: isRecentLoading } = useQuery(
    trpc.movies.getRecentlyAdded.queryOptions({ page }, { enabled: isRecent }),
  );

  const { data: premiumRes, isLoading: isPremiumLoading } = useQuery(
    trpc.movies.getTopRated.queryOptions({ page }, { enabled: isPremium }),
  );

  const { data: searchRes, isLoading: isSearchLoading } = useQuery(
    trpc.movies.searchMovies.queryOptions(
      { query: debouncedQuery, page },
      { enabled: !!debouncedQuery },
    ),
  );

  const activeRes = debouncedQuery
    ? searchRes
    : isTrending
      ? trendingRes
      : isPopular
        ? popularRes
        : isRecent
          ? recentRes
          : premiumRes;

  const isLoading = debouncedQuery
    ? isSearchLoading
    : isTrending
      ? isTrendingLoading
      : isPopular
        ? isPopularLoading
        : isRecent
          ? isRecentLoading
          : isPremiumLoading;

  useEffect(() => {
    if (activeRes?.results) {
      if (page === 1) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMoviesList(activeRes.results);
      } else {
        setMoviesList((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const uniqueNew = activeRes.results.filter(
            (m) => !existingIds.has(m.id),
          );
          return [...prev, ...uniqueNew];
        });
      }
    }
  }, [activeRes, page]);

  const handleTabChange = (newTab: string) => {
    setTab(newTab);
    setPage(1);
    setMoviesList([]);
  };

  const handleCatChange = (newCat: string) => {
    setCat(newCat);
    setPage(1);
    setMoviesList([]);
  };

  const handleShowMore = () => {
    setPage((p) => p + 1);
  };

  return (
    <div className="pb-10">
      <HeroSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {debouncedQuery ? (
        <section className="pt-20 px-4 md:px-12">
          <div className="flex flex-col mb-8 gap-1.5">
            <h2 className="text-xl md:text-2xl font-bold tracking-wide">
              Search Results for &quot;{debouncedQuery}&quot;
            </h2>
            <p className="text-xs text-white/50">
              Found {activeRes?.results?.length || 0} movies in this page
            </p>
          </div>

          {isLoading && page === 1 ? (
            <GridSkeleton />
          ) : (
            <Row items={moviesList} />
          )}
        </section>
      ) : (
        <>
          {/* Personalized Recommendations Row (AI Powered) */}
          {session && personalizedRecs && personalizedRecs.length > 0 && (
            <section className="pt-16 px-4 md:px-12">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-primary animate-glow-pulse" />
                <h2 className="text-lg md:text-xl font-bold tracking-wide">
                  Recommended For You
                </h2>
              </div>
              {isRecsLoading ? (
                <RowSkeleton />
              ) : (
                <Row items={personalizedRecs} />
              )}
            </section>
          )}

          <section className="pt-20 md:pt-24 pb-6">
            <div className="flex justify-center gap-4 sm:gap-10 mb-7">
              {tabs.map((t) => {
                const Icon = tabIcons[t as keyof typeof tabIcons];
                const active = tab === t;
                return (
                  <button
                    key={t}
                    onClick={() => handleTabChange(t)}
                    className="relative flex items-center gap-1.5 text-sm pb-2 cursor-pointer outline-none"
                  >
                    <Icon
                      className={`w-4 h-4 ${active ? "text-primary" : "text-white/50"}`}
                    />
                    <span
                      className={
                        active ? "text-white font-medium" : "text-white/50"
                      }
                    >
                      {t}
                    </span>
                    {active && (
                      <motion.div
                        layoutId="tab-dot"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {tab === "Trending" && (
              <div className="flex justify-center items-center gap-3 px-4 md:px-12 relative mb-8">
                <div className="flex gap-3 overflow-x-auto scrollbar-hide max-w-full md:max-w-3xl">
                  {cats.map((c) => {
                    const active = cat === c;
                    return (
                      <motion.button
                        key={c}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCatChange(c)}
                        className={`px-6 py-2 rounded-full text-sm whitespace-nowrap border transition-colors cursor-pointer ${
                          active
                            ? "bg-primary border-primary text-white"
                            : "border-white/20 text-white/80 hover:border-white/50"
                        }`}
                      >
                        {c}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={tab + cat}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-10 pb-4"
              >
                {isLoading && page === 1 ? (
                  <GridSkeleton />
                ) : (
                  <Row items={moviesList} />
                )}
              </motion.div>
            </AnimatePresence>
          </section>
        </>
      )}

      <FeatureBanner />

      {activeRes && page < activeRes.totalPages && (
        <div className="px-4 md:px-12 pt-10">
          <motion.button
            whileHover={{
              scale: 1.01,
              backgroundColor: "rgba(255,255,255,0.08)",
            }}
            whileTap={{ scale: 0.99 }}
            onClick={handleShowMore}
            disabled={isLoading}
            className="w-full py-3 rounded-lg border border-white/10 text-sm flex items-center justify-center gap-2 text-white/70 hover:text-white cursor-pointer hover:border-white/20 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 rounded-full border border-white/20 border-t-white animate-spin" />
            ) : (
              <>
                <Plus className="w-4 h-4" /> Show More
              </>
            )}
          </motion.button>
        </div>
      )}
    </div>
  );
};

const RowSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="aspect-2/3 bg-white/5 rounded-lg animate-pulse" />
    ))}
  </div>
);

const GridSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 px-4 md:px-12">
    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
      <div key={i} className="flex flex-col gap-2">
        <div className="aspect-2/3 bg-white/5 rounded-lg animate-pulse" />
        <div className="h-4 bg-white/5 rounded w-3/4 animate-pulse" />
      </div>
    ))}
  </div>
);
