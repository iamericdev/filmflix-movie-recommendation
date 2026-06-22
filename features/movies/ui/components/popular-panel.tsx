"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import Link from "next/link";

export const PopularPanel = () => {
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(
    trpc.movies.getPopular.queryOptions({ page: 1 }),
  );

  if (isLoading) {
    return (
      <div className="-mt-20">
        <h3 className="font-semibold text-sm mb-3 pl-2">Popular Movies</h3>
        <div className="bg-black/55 backdrop-blur-md rounded-2xl p-4 flex gap-3 overflow-x-auto scrollbar-hide border border-white/5 h-[120px] items-center">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="shrink-0 w-56 aspect-2/3 bg-white/5 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  const movies = data?.results.slice(0, 6) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1, duration: 0.7 }}
      className="-mt-20"
    >
      <h3 className="font-semibold text-sm mb-3 pl-2">Popular Movies</h3>
      <div className="bg-black/55 backdrop-blur-md rounded-2xl p-4 flex items-end gap-3 relative border border-white/5 overflow-x-auto scrollbar-hide">
        {movies.map((m) => (
          <Link key={m.id} href={`/movie/${m.id}`} className="block shrink-0">
            <motion.div
              whileHover={{ y: -6, scale: 1.05 }}
              className="relative shrink-0 w-56 aspect-2/3 rounded-lg overflow-hidden cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={m.img}
                alt={m.t}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
};
