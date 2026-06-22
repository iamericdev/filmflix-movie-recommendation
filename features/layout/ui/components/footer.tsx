"use client";

import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-surface py-12">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        <div className="font-display tracking-[0.3em] text-xl mb-5">
          FILMFLIX
        </div>

        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          &copy;{new Date().getFullYear()} by
          <Link
            href="https://github.com/iamericdev"
            className="hover:text-white cursor-pointer whitespace-nowrap text-primary"
          >
            Eric Ricky
          </Link>
        </div>
      </div>
    </footer>
  );
};
