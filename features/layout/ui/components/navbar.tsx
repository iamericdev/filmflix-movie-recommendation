"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const Navbar = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    setMenuOpen(false);
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
    <>
      <header className="absolute top-0 inset-x-0 z-30 pt-6 px-4 md:px-10">
        <div className="flex items-center justify-end md:justify-between">
          <nav className="hidden sm:flex items-center gap-7 text-sm text-white/80">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            {session && (
              <Link
                href="/watchlist"
                className="hover:text-white transition-colors"
              >
                My Watchlist
              </Link>
            )}
          </nav>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute left-4 md:left-1/2 md:-translate-x-1/2 font-display tracking-[0.3em] text-base sm:text-lg cursor-pointer"
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
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="hidden sm:inline-flex"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button asChild size="sm" className="hidden sm:inline-flex">
                <Link href={"/login"}>Sign In</Link>
              </Button>
            )}

            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="md:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />

            {/* Drawer */}
            <motion.aside
              key="mobile-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 z-50 h-full w-72 bg-[#0d0d0f] border-l border-white/10 flex flex-col md:hidden"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
                <span className="font-display tracking-[0.3em] text-base">
                  FILMFLIX
                </span>
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex flex-col gap-1 px-4 py-6 flex-1">
                <MobileNavLink href="/" onClick={() => setMenuOpen(false)}>
                  Home
                </MobileNavLink>
                {session && (
                  <MobileNavLink
                    href="/watchlist"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Watchlist
                  </MobileNavLink>
                )}
              </nav>

              {/* Auth section */}
              <div className="px-6 py-6 border-t border-white/10">
                {isPending ? (
                  <div className="w-6 h-6 rounded-full border border-white/20 border-t-white animate-spin mx-auto" />
                ) : session ? (
                  <div className="flex flex-col gap-3">
                    <p className="text-sm text-white/50">
                      Signed in as{" "}
                      <span className="text-white font-medium">
                        {session.user.name}
                      </span>
                    </p>
                    <Button
                      onClick={handleSignOut}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Button asChild size="sm" className="w-full">
                    <Link href="/login" onClick={() => setMenuOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const MobileNavLink = ({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    onClick={onClick}
    className="flex items-center px-3 py-3 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/8 transition-colors"
  >
    {children}
  </Link>
);
