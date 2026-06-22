import { MovieItem } from "@/lib/tmdb";
import { Eye, Heart, Play, Star } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

interface RowProps {
  items: MovieItem[];
}

export const Row = ({ items }: RowProps) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-white/40 text-sm">
        No movies found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 px-4 md:px-12">
      {items.map((m, i) => (
        <PosterCard key={m.id} m={m} i={i} />
      ))}
    </div>
  );
};

const PosterCard = ({ m, i }: { m: MovieItem; i: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: Math.min(i * 0.04, 0.3) }}
      className="group"
    >
      <Link href={`/movie/${m.id}`}>
        <motion.div
          whileHover={{ y: -8, scale: 1.04 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="relative aspect-2/3 rounded-lg overflow-hidden cursor-pointer shadow-lg border border-white/5"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={m.img}
            alt={m.t}
            loading="lazy"
            className="w-full h-full object-cover"
          />
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex items-end justify-center pb-4"
          >
            <Play className="w-10 h-10 text-white fill-white/90 animate-pulse" />
          </motion.div>
        </motion.div>
      </Link>
      <p className="text-sm mt-2 truncate font-medium group-hover:text-primary transition-colors">
        {m.t}
      </p>
      <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-1">
        <span>{m.y > 0 ? m.y : "N/A"}</span>
        <Heart className="w-3 h-3 text-white/30 hover:text-accent-red hover:fill-accent-red cursor-pointer transition-colors" />
        <Eye className="w-3 h-3 text-white/30 hover:text-primary cursor-pointer transition-colors" />
        {m.r !== null && m.r > 0 && (
          <span className="flex items-center gap-0.5 ml-auto">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            {m.r}
          </span>
        )}
      </div>
    </motion.div>
  );
};
