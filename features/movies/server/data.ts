import { Flame, Plus, Star, TrendingUp } from "lucide-react";

export const tabs = ["Trending", "Popular", "Recent", "Premium"] as const;
export const tabIcons = {
  Trending: TrendingUp,
  Popular: Flame,
  Recent: Plus,
  Premium: Star,
};
export const cats = [
  "Action",
  "Adventure",
  "Animation",
  "Fiction",
  "Heroes",
  "Comedy",
];
