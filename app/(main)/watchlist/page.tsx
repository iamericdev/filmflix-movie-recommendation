import { requireAuth } from "@/features/auth/auth-utils";
import {
  WatchlistView,
  WatchlistViewError,
  WatchlistViewLoading,
} from "@/features/movies/ui/views/watchlist-view";
import { getQueryClient, prefetch, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export const dynamic = "force-dynamic";

const WatchlistPage = async () => {
  await requireAuth();

  const queryClient = getQueryClient();
  void prefetch(trpc.movies.getWatchlist.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ErrorBoundary FallbackComponent={WatchlistViewError}>
        <Suspense fallback={<WatchlistViewLoading />}>
          <WatchlistView />
        </Suspense>
      </ErrorBoundary>
    </HydrationBoundary>
  );
};

export default WatchlistPage;
