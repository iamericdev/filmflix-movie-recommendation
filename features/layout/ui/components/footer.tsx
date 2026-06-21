"use client";

import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-surface py-12 text-center">
      <div className="font-display tracking-[0.3em] text-xl mb-5">AGENCY</div>
      <div className="flex justify-center gap-8 text-xs text-white/50">
        {[
          "About us",
          "Vlog",
          "Contact",
          "Report broken links",
          "Disclaimer",
        ].map((l) => (
          <Link key={l} href="#" className="hover:text-white cursor-pointer">
            {l}
          </Link>
        ))}
      </div>
    </footer>
  );
};
