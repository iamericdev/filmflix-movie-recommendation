import { Eye, Heart, Play, Star } from "lucide-react";
import { motion } from "motion/react";
import { row1 } from "../../server/data";

export const Row = ({ items }: { items: typeof row1 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 px-4 md:px-12">
    {items.map((m, i) => (
      <PosterCard key={m.t} m={m} i={i} />
    ))}
  </div>
);

const PosterCard = ({ m, i }: { m: (typeof row1)[number]; i: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: i * 0.05 }}
      className="group"
    >
      <motion.div
        whileHover={{ y: -8, scale: 1.04 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="relative aspect-2/3 rounded-lg overflow-hidden cursor-pointer shadow-lg"
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
          <Play className="w-10 h-10 text-white fill-white/90" />
        </motion.div>
      </motion.div>
      <p className="text-sm mt-2 truncate">{m.t}</p>
      <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-1">
        <span>{m.y}</span>
        <Heart className="w-3 h-3 fill-accent-red text-accent-red" />
        <Eye className="w-3 h-3" />
        {m.r && (
          <span className="flex items-center gap-0.5">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            {m.r}
          </span>
        )}
      </div>
    </motion.div>
  );
};
