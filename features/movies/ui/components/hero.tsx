"use client";

import { hero } from "@/lib/images";
import { Play, Search, Star } from "lucide-react";
import { motion } from "motion/react";
import { PopularPanel } from "./popular-panel";

export const HeroSection = () => {
  return (
    <>
      <section className="relative h-[500px] sm:h-[600px] md:h-[680px] overflow-hidden rounded-b-[20px]">
        <motion.img
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8, ease: "easeOut" }}
          src={hero}
          alt="Star Wars"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-background/60" />

        <div className="absolute top-16 sm:top-20 left-4 md:left-24 right-4 md:right-1/2 z-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 bg-white/5 backdrop-blur rounded-full px-4 py-2 max-w-full md:max-w-md mb-8 md:mb-16"
          >
            <Search className="w-4 h-4 text-white/50" />
            <input
              placeholder="Search"
              className="bg-transparent text-sm outline-none flex-1 placeholder:text-white/40"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="font-display text-4xl md:text-6xl tracking-wider leading-none"
          >
            STAR WARS
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.55, duration: 0.7 }}
            className="font-display text-xl md:text-3xl tracking-wider mt-2 text-white/95"
          >
            THE RISE OF SKYWALKER
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-sm text-white/70 mt-4 max-w-full md:max-w-md leading-relaxed"
          >
            The surviving members of the resistance face the First Order once
            again, and the legendary conflict between the Jedi and the Sith
            reaches its peak bringing the Skywalker saga to its end.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-1 mt-3"
          >
            {[1, 2, 3, 4].map((i) => (
              <Star key={i} className="w-4 h-4 fill-primary text-primary" />
            ))}
            <Star className="w-4 h-4 text-primary" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95 }}
            className="flex gap-3 mt-6"
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 25px rgba(80,160,255,0.5)",
              }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 bg-primary rounded-full px-6 py-2.5 text-sm font-medium"
            >
              <Play className="w-3.5 h-3.5 fill-white" /> Watch Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.8)" }}
              whileTap={{ scale: 0.96 }}
              className="rounded-full px-6 py-2.5 text-sm border border-white/40"
            >
              Trailer
            </motion.button>
          </motion.div>
        </div>
      </section>
      <PopularPanel />
    </>
  );
};
