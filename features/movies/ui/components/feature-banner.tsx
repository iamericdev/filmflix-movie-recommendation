import { featureDragon } from "@/lib/images";
import { Play, Plus, Star } from "lucide-react";
import { motion } from "motion/react";

export const FeatureBanner = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative mx-12 my-10 rounded-2xl overflow-hidden h-[340px]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={featureDragon}
        alt="House of the Dragon"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-r from-background via-background/60 to-transparent" />
      <div className="relative z-10 p-10 max-w-xl h-full flex flex-col justify-between">
        <div className="flex items-center gap-3 text-xs">
          <span className="bg-accent-red px-2 py-0.5 rounded font-bold">
            16
          </span>
          <span>2022</span>
          <span>2 Seasons</span>
          <span className="flex">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-3 h-3 fill-white text-white" />
            ))}
          </span>
        </div>
        <div>
          <h3 className="text-3xl font-bold mb-3">House of the Dragon</h3>
          <p className="text-sm text-white/70 leading-relaxed mb-5">
            Lorem ipsum dolor sit amet consectetur. Rutrum ultrices amet cursus
            hac viverra semper tincidunt condimentum. Est mattis bibendum
            euismod sed facilisis laoreet.
          </p>
          <div className="flex items-center justify-between">
            <div className="flex gap-4 text-xs text-white/60">
              <a className="hover:text-white cursor-pointer">Infomations</a>
              <a className="hover:text-white cursor-pointer">Trailer</a>
              <a className="hover:text-white cursor-pointer">Reviews</a>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 bg-primary rounded-full px-5 py-2 text-sm"
              >
                <Play className="w-3 h-3 fill-white" /> Watch
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-1 text-sm"
              >
                <Plus className="w-4 h-4" /> MY LIST
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
