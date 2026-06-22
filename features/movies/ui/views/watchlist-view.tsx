"use client";

import { Button } from "@/components/ui/button";
import { Row } from "@/features/movies/ui/components/row-component";
import { MovieItem } from "@/lib/tmdb";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AlertTriangleIcon, Heart } from "lucide-react";
import { type FallbackProps, getErrorMessage } from "react-error-boundary";

export const WatchlistView = () => {
  const trpc = useTRPC();

  const { data: watchlist } = useSuspenseQuery(
    trpc.movies.getWatchlist.queryOptions(),
  );

  const mappedMovies: MovieItem[] = (watchlist || []).map((w) => ({
    id: w.movieId,
    t: w.title,
    img: w.posterPath
      ? `https://image.tmdb.org/t/p/w500${w.posterPath}`
      : "/images/p-johnwick.jpg",
    backdrop: "/images/bg.png",
    y: w.releaseDate ? parseInt(w.releaseDate, 10) : 0,
    r: w.voteAverage ? w.voteAverage / 2 : null,
    overview: "",
    genreIds: [],
  }));

  return (
    <div className="min-h-screen bg-background pt-32 px-4 md:px-12 pb-20">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="w-6 h-6 text-accent-red fill-accent-red" />
        <h1 className="text-2xl md:text-3xl font-display tracking-wide">
          My Watchlist
        </h1>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-white/70">
          {mappedMovies.length} {mappedMovies.length === 1 ? "movie" : "movies"}
        </span>
      </div>

      {mappedMovies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5 text-center px-4">
          <Heart className="w-12 h-12 text-white/20 mb-4" />
          <h3 className="font-semibold text-lg mb-1">
            Your watchlist is empty
          </h3>
          <p className="text-white/40 text-sm max-w-sm">
            Explore films on the home screen and click &quot;Add to
            Watchlist&quot; to save them here.
          </p>
        </div>
      ) : (
        <Row items={mappedMovies} />
      )}
    </div>
  );
};

export const WatchlistViewLoading = () => {
  return (
    <div className="min-h-screen bg-background pt-32 px-4 md:px-12">
      <h1 className="text-2xl md:text-3xl font-display tracking-wide mb-8 animate-pulse bg-white/10 h-8 w-48 rounded" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="aspect-2/3 bg-white/5 rounded-lg animate-pulse"
          />
        ))}
      </div>
    </div>
  );
};

export const WatchlistViewError = ({
  error,
  resetErrorBoundary,
}: FallbackProps) => {
  const message = getErrorMessage(error);
  return (
    <div className="grid place-items-center h-screen">
      <div className="max-w-4xl mx-auto flex items-center justify-center h-full flex-1 flex-col gap-y-4">
        <AlertTriangleIcon className="size-6 text-destructive" />
        {!!message && (
          <p className="text-muted-foreground text-sm">{message}</p>
        )}
        {resetErrorBoundary && (
          <Button onClick={resetErrorBoundary}>Retry</Button>
        )}
      </div>
    </div>
  );
};
