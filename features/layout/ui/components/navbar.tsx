"use client";

import { Bell, Settings } from "lucide-react";
import { motion } from "motion/react";

export const Navbar = () => {
  return (
    <header className="absolute top-0 inset-x-0 z-30 pt-6 px-10">
      <div className="flex items-center justify-between">
        <nav className="flex items-center gap-7 text-sm text-white/80">
          {["New", "Movies", "Series", "Cartoons"].map((n) => (
            <motion.a
              key={n}
              whileHover={{ y: -2, color: "#fff" }}
              className="relative cursor-pointer"
              href="#"
            >
              {n}
              {n === "Cartoons" && <sup className="text-[10px] ml-0.5">2</sup>}
            </motion.a>
          ))}
        </nav>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute left-1/2 -translate-x-1/2 font-display tracking-[0.3em] text-lg"
        >
          AGENCY
        </motion.div>
        <div className="flex items-center gap-5">
          <motion.button whileHover={{ rotate: 15 }} className="text-white/70">
            <Bell className="w-5 h-5" />
          </motion.button>
          <span className="text-sm text-white/90">João M</span>
          <motion.div
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.4 }}
            className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center"
          >
            <Settings className="w-4 h-4 text-primary" />
          </motion.div>
        </div>
      </div>
    </header>
  );
};
