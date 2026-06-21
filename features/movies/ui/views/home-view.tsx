"use client";

import { Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { cats, row1, row2, row3, tabIcons, tabs } from "../../server/data";
import { FeatureBanner } from "../components/feature-banner";
import { HeroSection } from "../components/hero";
import { Row } from "../components/row-component";

export const HomeView = () => {
  const [tab, setTab] = useState("Trending");
  const [cat, setCat] = useState("Action");
  return (
    <div>
      <HeroSection />

      {/* Tabs */}
      <section className="pt-24 pb-6">
        <div className="flex justify-center gap-10 mb-7">
          {tabs.map((t) => {
            const Icon = tabIcons[t];
            const active = tab === t;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="relative flex items-center gap-1.5 text-sm pb-2"
              >
                <Icon
                  className={`w-4 h-4 ${active ? "text-primary" : "text-white/50"}`}
                />
                <span className={active ? "text-white" : "text-white/50"}>
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

        <div className="flex justify-center items-center gap-3 px-12 relative">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide max-w-3xl">
            {cats.map((c) => {
              const active = cat === c;
              return (
                <motion.button
                  key={c}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCat(c)}
                  className={`px-6 py-2 rounded-full text-sm whitespace-nowrap border transition-colors ${
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
      </section>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab + cat}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-10 pb-10"
        >
          <Row items={row1} />
          <Row items={row2} />
          {/* <Row items={row3} /> */}
        </motion.div>
      </AnimatePresence>

      {/* Feature banner */}
      <FeatureBanner />

      <div className="pb-10">
        <Row items={row3} />
      </div>

      <div className="px-12 pb-8">
        <motion.button
          whileHover={{
            scale: 1.01,
            backgroundColor: "rgba(255,255,255,0.08)",
          }}
          className="w-full py-3 rounded-lg border border-white/10 text-sm flex items-center justify-center gap-2 text-white/70"
        >
          <Plus className="w-4 h-4" /> Show More
        </motion.button>
      </div>
    </div>
  );
};
