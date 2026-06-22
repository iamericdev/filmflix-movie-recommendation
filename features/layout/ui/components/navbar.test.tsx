/* eslint-disable @typescript-eslint/no-explicit-any */
import { authClient } from "@/lib/auth/client";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Navbar } from "./navbar";

// Mock next/navigation
vi.mock("next/navigation", () => {
  return {
    useRouter: () => ({
      push: vi.fn(),
      refresh: vi.fn(),
    }),
  };
});

// Mock Better Auth React client hooks
vi.mock("@/lib/auth/client", () => {
  return {
    authClient: {
      useSession: vi.fn(),
      signOut: vi.fn(),
    },
  };
});

describe("Navbar Component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should render Sign In button when session is null (unauthenticated)", () => {
    // Mock useSession returning no user session
    vi.mocked(authClient.useSession).mockReturnValue({
      data: null,
      isPending: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(<Navbar />);

    // Check that "Sign In" button is visible
    expect(screen.getByText("Sign In")).toBeInTheDocument();

    // Check that "Sign Out" and greeting are NOT visible
    expect(screen.queryByText("Sign Out")).not.toBeInTheDocument();
    expect(screen.queryByText("My Watchlist")).not.toBeInTheDocument();
  });

  it("should render greeting, Watchlist link, and Sign Out button when authenticated", () => {
    // Mock useSession returning active user session
    vi.mocked(authClient.useSession).mockReturnValue({
      data: {
        user: {
          id: "user123",
          name: "Eric Ricky",
          email: "eric@test.com",
          emailVerified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        session: {
          id: "session123",
          token: "token123",
          expiresAt: new Date(),
          userId: "user123",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
      isPending: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(<Navbar />);

    // Check greeting, Watchlist, and Sign Out button are visible
    expect(screen.getByText("Hi, Eric Ricky")).toBeInTheDocument();
    expect(screen.getByText("My Watchlist")).toBeInTheDocument();
    expect(screen.getByText("Sign Out")).toBeInTheDocument();

    // Sign In button should NOT be visible
    expect(screen.queryByText("Sign In")).not.toBeInTheDocument();
  });

  it("should call authClient.signOut when clicking the Sign Out button", async () => {
    // Mock active session
    vi.mocked(authClient.useSession).mockReturnValue({
      data: {
        user: { id: "u123", name: "Eric" },
      },
      isPending: false,
    } as any);

    const signOutSpy = vi
      .spyOn(authClient, "signOut")
      .mockResolvedValue(null as any);

    render(<Navbar />);

    const signOutButton = screen.getByText("Sign Out");
    fireEvent.click(signOutButton);

    expect(signOutSpy).toHaveBeenCalledTimes(1);
  });
});
