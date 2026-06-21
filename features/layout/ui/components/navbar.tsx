"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  return (
    <header className="absolute top-0 inset-x-0 z-30 pt-6 px-4 md:px-10">
      <div className="flex items-center justify-between">
        <nav className="hidden sm:flex items-center gap-7 text-sm text-white/80">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          {session && (
            <Link href="/watchlist" className="hover:text-white transition-colors">
              My Watchlist
            </Link>
          )}
          {["Movies", "Series"].map((n) => (
            <motion.a
              key={n}
              whileHover={{ y: -2, color: "#fff" }}
              className="relative cursor-pointer"
              href="#"
            >
              {n}
            </motion.a>
          ))}
        </nav>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute left-1/2 -translate-x-1/2 font-display tracking-[0.3em] text-base sm:text-lg cursor-pointer"
        >
          <Link href="/" className="hover:text-white">
            FILMFLIX
          </Link>
        </motion.div>
        <div className="flex items-center gap-3 sm:gap-5">
          {isPending ? (
            <div className="w-8 h-8 rounded-full border border-white/20 border-t-white animate-spin" />
          ) : session ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/70 hidden md:inline">
                Hi, {session.user.name}
              </span>
              <Button onClick={handleSignOut} variant="outline" size="sm">
                Sign Out
              </Button>
            </div>
          ) : (
            <Button asChild size="sm">
              <Link href={"/login"}>Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
