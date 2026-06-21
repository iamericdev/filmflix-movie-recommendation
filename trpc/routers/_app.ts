import { exampleRouter } from "@/features/movies/server/procedures";
import { createTRPCRouter } from "../init";
export const appRouter = createTRPCRouter({
  example: exampleRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
