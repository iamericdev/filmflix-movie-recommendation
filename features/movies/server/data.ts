import {
  pArcane,
  pArrow,
  pAvengers,
  pBoys,
  pCaptain,
  pCobra,
  pContinental,
  pCyberpunk,
  pDaredevil,
  pDragon,
  pExtraction,
  pFalcon,
  pFallout,
  pFlash,
  pGenv,
  pGodzilla,
  pGranturismo,
  pHalo,
  pInvincible,
  pJohnwick,
  pKnight,
  pLastjedi,
  pLastofus,
  pReacher,
  pSpiderman,
  pStarwars,
  pTomorrow,
  pTransformers,
  pUncharted,
  pVikings,
} from "@/lib/images";
import { Flame, Plus, Star, TrendingUp } from "lucide-react";

export const popular = [
  { t: "Captain America", img: pCaptain },
  { t: "Star Wars", img: pStarwars, active: true },
  { t: "Spider-Man", img: pSpiderman },
  { t: "The Last Jedi", img: pLastjedi },
  { t: "Uncharted", img: pUncharted },
  { t: "Avengers Endgame", img: pAvengers },
];

export const row1 = [
  { t: "John Wick: Chapter 4", img: pJohnwick, y: 2023, r: 4.6 },
  { t: "Godzilla Minus One", img: pGodzilla, y: 2023, r: null },
  { t: "Gran Turismo", img: pGranturismo, y: 2023, r: 4.8 },
  { t: "Transformers: Rise o…", img: pTransformers, y: 2023, r: 4.0 },
  { t: "Extraction 2", img: pExtraction, y: 2023, r: 4.1 },
  { t: "The Tomorrow War", img: pTomorrow, y: 2021, r: 4.0 },
  { t: "The Hunger Games", img: pAvengers, y: 2023, r: 5.0 },
  { t: "Marvel's Daredevil", img: pDaredevil, y: 2015, r: 4.1 },
  { t: "The Flash", img: pFlash, y: 2014, r: 4.5 },
  { t: "Arrow", img: pArrow, y: 2012, r: 4.7 },
  { t: "The Boys", img: pBoys, y: 2019, r: 4.8 },
  { t: "Cobra Kai", img: pCobra, y: 2018, r: 5.0 },
];
export const row2 = [
  { t: "Marvel's Daredevil", img: pDaredevil, y: 2015, r: 4.1 },
  { t: "The Flash", img: pFlash, y: 2014, r: 4.5 },
  { t: "Arrow", img: pArrow, y: 2012, r: 4.7 },
  { t: "The Boys", img: pBoys, y: 2019, r: 4.8 },
  { t: "Cobra Kai", img: pCobra, y: 2018, r: 5.0 },
  { t: "The Last of Us", img: pLastofus, y: 2023, r: 4.5 },
];
export const row3 = [
  { t: "The Continental: Fro…", img: pContinental, y: 2023, r: null },
  { t: "Falcon and the Wint…", img: pFalcon, y: 2021, r: 4.7 },
  { t: "Gen V", img: pGenv, y: 2023, r: 4.0 },
  { t: "Halo", img: pHalo, y: 2022, r: 4.8 },
  { t: "Knight Rider", img: pKnight, y: 2015, r: 3.6 },
  { t: "House of the Dragon", img: pDragon, y: 2022, r: 4.5 },
];
export const row4 = [
  { t: "Fallout", img: pFallout, y: 2024, r: 4.1 },
  { t: "Arcane", img: pArcane, y: 2021, r: 4.5 },
  { t: "Invencible", img: pInvincible, y: 2021, r: 4.7 },
  { t: "Reacher", img: pReacher, y: 2022, r: 4.1 },
  { t: "Cyberpunk: Edgerun…", img: pCyberpunk, y: 2022, r: 5.0 },
  { t: "Vikings Valhalla", img: pVikings, y: 2022, r: 4.5 },
];

export const tabs = [
  "Trending",
  "Popular",
  "Recently added",
  "Premium",
] as const;
export const tabIcons = {
  Trending: TrendingUp,
  Popular: Flame,
  "Recently added": Plus,
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
