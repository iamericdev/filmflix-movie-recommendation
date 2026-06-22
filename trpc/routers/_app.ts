import { moviesRouter } from "@/features/movies/server/procedures";
import { createTRPCRouter } from "../init";
export const appRouter = createTRPCRouter({
  movies: moviesRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
