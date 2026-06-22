<div align="center">
  <br />
  <h1>🎬 FilmFlix — Movie Recommendation App</h1>
  <p>
    <strong>A modern movie discovery platform built with Next.js, tRPC, and TMDB.</strong>
  </p>
  <p>
    <img src="https://img.shields.io/badge/Next.js-16.2.9-000000?style=flat-square&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/tRPC-11-2596BE?style=flat-square&logo=trpc" alt="tRPC" />
    <img src="https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Drizzle%20ORM-0.45-C5F74F?style=flat-square&logo=drizzle" alt="Drizzle ORM" />
    <img src="https://img.shields.io/badge/Bun-latest-FBF0DF?style=flat-square&logo=bun" alt="Bun" />
    <img src="https://img.shields.io/badge/TMDB-API-01D277?style=flat-square&logo=themoviedatabase" alt="TMDB" />
  </p>
  <br />
  <img src="./public/images/hero-starwars.jpg" alt="FilmFlix Banner" width="100%" style="border-radius: 12px;" />
  <br />
</div>

---

## Features

| Feature                          | Description                                                                |
| -------------------------------- | -------------------------------------------------------------------------- |
| **Authentication**               | Email/password & Google OAuth via Better Auth                              |
| **Personalized Recommendations** | AI-driven engine that analyzes your ratings, watchlist & genre preferences |
| **Debounced Search**             | Search movies by title or keyword with smart debouncing (400ms)            |
| **4 Browsing Tabs**              | Trending (filterable by genre), Popular, Recent, and Top-Rated             |
| **Movie Details**                | Full cast & crew, ratings, runtime, genre badges, trailers & more          |
| **Rate Movies**                  | 1–5 star rating with hover preview and persistent storage                  |
| **Watchlist**                    | Save movies to your personal watchlist with one click                      |
| **Poster Carousel**              | Horizontal carousel for popular movies                                     |
| **Type-Safe API**                | End-to-end type safety with tRPC + TanStack React Query                    |
| **PostgreSQL**                   | Persistent storage via Drizzle ORM + Neon Serverless                       |
| **Dark/Light Mode**              | Theme-aware UI with next-themes                                            |
| **Responsive Design**            | Fully responsive across mobile, tablet & desktop                           |
| **Tested**                       | Unit tests with Vitest + Testing Library                                   |
| **CI/CD**                        | Automated linting, testing, and PR creation via GitHub Actions             |

---

## Tech Stack

| Category        | Technologies                                       |
| --------------- | -------------------------------------------------- |
| **Framework**   | Next.js 16 (App Router), React 19, TypeScript 5    |
| **API Layer**   | tRPC 11, TanStack React Query 5, Superjson         |
| **Database**    | PostgreSQL (Neon), Drizzle ORM 0.45                |
| **Auth**        | Better Auth (email/password + Google OAuth)        |
| **Styling**     | Tailwind CSS 4, shadcn/ui, Radix UI, Framer Motion |
| **Testing**     | Vitest, Testing Library, jsdom                     |
| **CI/CD**       | GitHub Actions (lint, type-check, test, auto PR)   |
| **Data Source** | [TMDB API](https://www.themoviedb.org/)            |

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 20+
- A [TMDB API key](https://www.themoviedb.org/settings/api) (free)
- A [Neon PostgreSQL](https://neon.tech/) database (free tier)

### Installation

```bash
# Clone the repository
git clone https://github.com/iamericdev/filmflix-movie-recommendation.git
cd filmflix-movie-recommendation

# Install dependencies
bun install

# Copy environment variables
cp .env.example .env
```

Fill in your `.env` file:

```env
DATABASE_URL="postgresql://..."
TMDB_API_KEY="your_tmdb_api_key_here"
BETTER_AUTH_SECRET="your_auth_secret"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
BETTER_AUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

### Run Database Migrations

```bash
bun run db:push
```

### Start Development Server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Usage

1. **Browse Movies** — Explore the Trending, Popular, Recent, and Top-Rated tabs on the home page.
2. **Filter by Genre** — On the Trending tab, filter by genre categories like Action, Adventure, Sci-Fi, etc.
3. **Search** — Use the search bar in the hero section to find any movie.
4. **View Details** — Click any movie poster to see full details, cast, ratings, and recommendations.
5. **Create an Account** — Sign up with email/password or Google to unlock personalized features.
6. **Rate Movies** — Give movies a 1–5 star rating (requires login).
7. **Build Your Watchlist** — ❤️ Save movies to your watchlist for later.
8. **Get Recommendations** — The app suggests movies tailored to your taste based on your ratings and watchlist.

---

## Running Tests

```bash
bun run test       # Run all tests
bun run test:watch # Watch mode
```

---

## 📦 Scripts

| Script                | Description                     |
| --------------------- | ------------------------------- |
| `bun run dev`         | Start development server        |
| `bun run build`       | Production build                |
| `bun run start`       | Start production server         |
| `bun run lint`        | Run ESLint                      |
| `bun run typecheck`   | Run TypeScript type checking    |
| `bun run test`        | Run Vitest tests                |
| `bun run db:push`     | Push Drizzle schema to database |
| `bun run db:generate` | Generate Drizzle migrations     |
| `bun run db:studio`   | Open Drizzle Studio             |

---

## Project Structure

```
app/                  # Next.js App Router pages & layouts
├── (auth)/           # Login & Signup pages
├── (main)/           # Home, Movie Details & Watchlist pages
├── api/              # API routes (auth, tRPC)
├── globals.css       # Global styles
└── layout.tsx        # Root layout

features/             # Domain logic (feature-based)
├── auth/             # Auth forms & utilities
├── layout/           # Navbar, Footer
└── movies/           # Movie components, views, tRPC procedures

components/ui/        # shadcn/ui components
lib/                  # TMDB client, recommendation engine, utilities
database/             # Drizzle schema & client
trpc/                 # tRPC configuration & router
public/images/        # Static assets
```

---

## 🤝 Contact

**Eric Ricky**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/eric-ricky-7532b01b9/)

---

<div align="center">
  <sub>Built with ❤️ by Eric Ricky 🇰🇪</sub>
</div>
