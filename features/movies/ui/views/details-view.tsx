"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";
import { useTRPC } from "@/trpc/client";
import { ArrowLeft, Clock, Heart, Star } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const DetailsView = () => {
  const router = useRouter();
  const params = useParams();
  const trpc = useTRPC();
  const { data: session } = authClient.useSession();

  const id = parseInt(params.id as string, 10);

  // Fetch movie details
  const { data: movie, isLoading, error } = trpc.example.getMovieDetails.useQuery({ id }, {
    enabled: !isNaN(id),
  });

  // Fetch user rating if authenticated
  const { data: userRating, refetch: refetchRating } = trpc.example.getUserRatingForMovie.useQuery(
    { movieId: id },
    { enabled: !!session && !isNaN(id) }
  );

  // Fetch watchlist to check if watchlisted
  const { data: watchlist, refetch: refetchWatchlist } = trpc.example.getWatchlist.useQuery(
    undefined,
    { enabled: !!session }
  );

  // Check if movie is currently in watchlist
  const isWatchlisted = watchlist?.some((w) => w.movieId === id) ?? false;

  // Mutations
  const toggleWatchlist = trpc.example.toggleWatchlist.useMutation({
    onSuccess: (data) => {
      refetchWatchlist();
      toast.success(data.added ? "Added to watchlist" : "Removed from watchlist");
    },
    onError: () => {
      toast.error("Failed to update watchlist");
    },
  });

  const rateMovie = trpc.example.rateMovie.useMutation({
    onSuccess: () => {
      refetchRating();
      toast.success("Rating saved successfully!");
    },
    onError: () => {
      toast.error("Failed to save rating");
    },
  });

  const [hoverRating, setHoverRating] = useState<number | null>(null);

  if (isLoading) {
    return <DetailsSkeleton />;
  }

  if (error || !movie) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h2 className="text-2xl font-bold mb-4">Movie Not Found</h2>
        <p className="text-white/60 mb-6">There was an error loading the movie details.</p>
        <Button asChild>
          <Link href="/">Go Back Home</Link>
        </Button>
      </div>
    );
  }

  const handleWatchlistToggle = () => {
    if (!session) {
      toast.error("Please sign in to manage your watchlist");
      router.push("/login");
      return;
    }
    toggleWatchlist.mutate({
      movieId: movie.id,
      title: movie.t,
      posterPath: movie.img.replace("https://image.tmdb.org/t/p/w500", ""),
      releaseDate: movie.y.toString(),
      voteAverage: movie.r ? movie.r * 2 : null,
    });
  };

  const handleRate = (stars: number) => {
    if (!session) {
      toast.error("Please sign in to rate movies");
      router.push("/login");
      return;
    }
    rateMovie.mutate({
      movieId: movie.id,
      rating: stars,
      title: movie.t,
      posterPath: movie.img.replace("https://image.tmdb.org/t/p/w500", ""),
    });
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground pb-20">
      {/* Back Button */}
      <div className="absolute top-24 left-4 md:left-12 z-40">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/45 backdrop-blur border border-white/10 text-white/80 hover:text-white transition-all hover:border-white/30"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      {/* Hero Backdrop Section */}
      <div className="relative h-[400px] md:h-[550px] w-full overflow-hidden">
        <motion.img
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 1 }}
          src={movie.backdrop}
          alt={movie.t}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
      </div>

      {/* Main Details Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-12 -mt-36 md:-mt-52 relative z-30">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 md:gap-12">
          {/* Movie Poster & Actions */}
          <div className="flex flex-col gap-4">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="aspect-2/3 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={movie.img} alt={movie.t} className="w-full h-full object-cover" />
            </motion.div>

            {/* Watchlist Toggle */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleWatchlistToggle}
              className={`w-full py-3 rounded-xl border flex items-center justify-center gap-2 font-medium transition-all ${
                isWatchlisted
                  ? "bg-accent-red/20 border-accent-red text-accent-red hover:bg-accent-red/30"
                  : "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20"
              }`}
            >
              <Heart className={`w-4 h-4 ${isWatchlisted ? "fill-accent-red" : ""}`} />
              {isWatchlisted ? "In Watchlist" : "Add to Watchlist"}
            </motion.button>

            {/* User Rating Panel */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/5 p-4 flex flex-col items-center">
              <span className="text-xs text-white/50 mb-2">
                {userRating ? "Your Rating" : "Rate this Movie"}
              </span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRate(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 transition-transform active:scale-90"
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        star <= (hoverRating ?? userRating?.rating ?? 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-white/20 hover:text-white/40"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Info Details */}
          <div className="flex flex-col justify-end pt-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h1 className="text-3xl md:text-5xl font-display tracking-wide">{movie.t}</h1>
              {movie.tagline && (
                <p className="text-lg text-primary italic font-light">"{movie.tagline}"</p>
              )}

              {/* Badges / Metrics */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/5 font-semibold text-xs">
                  {movie.y}
                </span>
                {movie.runtime > 0 && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {movie.runtime} mins
                  </span>
                )}
                {movie.r && (
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {movie.r} / 5
                  </span>
                )}
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 pt-2">
                {movie.genres.map((g) => (
                  <span
                    key={g.id}
                    className="px-3.5 py-1 rounded-full text-xs bg-primary/10 border border-primary/20 text-white/90"
                  >
                    {g.name}
                  </span>
                ))}
              </div>

              <hr className="border-white/10 my-6" />

              {/* Overview */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Overview</h3>
                <p className="text-white/70 leading-relaxed text-sm md:text-base">
                  {movie.overview || "No overview available for this movie."}
                </p>
              </div>

              {/* Cast Members */}
              {movie.credits?.cast?.length > 0 && (
                <div className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Top Cast</h3>
                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {movie.credits.cast.map((actor: any) => (
                      <div key={actor.id} className="flex flex-col items-center text-center shrink-0 w-20">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-white/5 border border-white/10 mb-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={actor.profilePath || "/images/p-johnwick.jpg"}
                            alt={actor.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-[11px] font-semibold truncate w-full">{actor.name}</span>
                        <span className="text-[9px] text-white/50 truncate w-full">{actor.character}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Similar Recommendations Section */}
        <SimilarRecommendations movieId={movie.id} />
      </div>
    </div>
  );
};

// Sub-component for Similar Recommendations to enable modular rendering
const SimilarRecommendations = ({ movieId }: { movieId: number }) => {
  const trpc = useTRPC();
  const { data: recs, isLoading } = trpc.example.getMovieRecommendations.useQuery({ movieId });

  if (isLoading) {
    return (
      <div className="mt-20">
        <h3 className="text-xl font-semibold mb-6">More Like This</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse flex flex-col gap-2">
              <div className="aspect-2/3 bg-white/5 rounded-lg" />
              <div className="h-4 bg-white/5 rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!recs || recs.results.length === 0) return null;

  return (
    <div className="mt-20">
      <h3 className="text-xl font-semibold mb-6">More Like This</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {recs.results.slice(0, 6).map((m) => (
          <Link key={m.id} href={`/movie/${m.id}`} className="group block">
            <div className="aspect-2/3 rounded-lg overflow-hidden border border-white/5 shadow-md transition-all group-hover:scale-[1.03] group-hover:-translate-y-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.img} alt={m.t} className="w-full h-full object-cover" />
            </div>
            <p className="text-sm mt-2 truncate font-medium group-hover:text-primary transition-colors">
              {m.t}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Skeleton Screen for Details Loading
const DetailsSkeleton = () => (
  <div className="relative min-h-screen bg-background pb-20 animate-pulse">
    <div className="h-[300px] md:h-[450px] w-full bg-white/5" />
    <div className="max-w-7xl mx-auto px-4 md:px-12 -mt-36 md:-mt-52 relative z-30">
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 md:gap-12">
        <div className="flex flex-col gap-4">
          <div className="aspect-2/3 rounded-2xl bg-white/10 border border-white/5 shadow-2xl" />
          <div className="h-12 rounded-xl bg-white/5" />
          <div className="h-16 rounded-xl bg-white/5" />
        </div>
        <div className="space-y-4 pt-12">
          <div className="h-10 bg-white/10 rounded w-2/3" />
          <div className="h-5 bg-white/5 rounded w-1/3" />
          <div className="flex gap-3">
            <div className="h-6 w-16 bg-white/5 rounded-full" />
            <div className="h-6 w-24 bg-white/5 rounded-full" />
          </div>
          <hr className="border-white/5 my-6" />
          <div className="h-4 bg-white/5 rounded w-full" />
          <div className="h-4 bg-white/5 rounded w-full" />
          <div className="h-4 bg-white/5 rounded w-4/5" />
        </div>
      </div>
    </div>
  </div>
);
