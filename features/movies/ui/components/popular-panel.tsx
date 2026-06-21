"use client";
import { motion } from "motion/react";
import { popular } from "../../server/data";

export const PopularPanel = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1, duration: 0.7 }}
      className="-mt-20"
    >
      <h3 className="font-semibold text-sm mb-3 pl-2">Popular Movies</h3>
      <div className="bg-black/55 backdrop-blur-md rounded-2xl p-4 flex items-end gap-3 relative border border-white/5 overflow-x-auto scrollbar-hide">
        {popular.map((p, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -6, scale: 1.03 }}
            className={`relative shrink-0 w-20 sm:w-auto sm:flex-1 aspect-2/3 rounded-lg overflow-hidden cursor-pointer ${
              p.active
                ? "ring-2 ring-accent-red shadow-[0_0_20px_rgba(255,60,60,0.4)]"
                : ""
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.img}
              alt={p.t}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
