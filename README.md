# 🎬 FreeKyi (CinemaFlow)

FreeKyi is a premium web application for browsing and streaming movies and TV series. Built with a sleek dark-mode interface, fluid animations, and highly optimized performance.

## ✨ Features

- **Extensive Catalog:** Browse trending, top-rated, and genre-specific movies and TV shows.
- **Embedded Streaming:** Watch movies and episodes directly in the app.
- **Advanced Search:** Real-time debounced search with categorized tabs (All, Movies, TV).
- **Bookmarks:** Save your favorite shows and movies to watch later (persisted locally).
- **Responsive UI:** Fully optimized for both desktop and mobile screens, including mobile bottom-sheet filters and tailored pagination.
- **Top-Tier Performance:** Implements lazy loading, JavaScript chunking, and pre-connected API routes.

## 🛠 Tech Stack

- **Framework:** React 19 + TypeScript
- **State Management:** Redux Toolkit
- **Routing:** React Router DOM
- **Styling:** Tailwind CSS + Framer Motion (for smooth animations)
- **Data Source:** [TMDB (The Movie Database) API](https://www.themoviedb.org/)
- **Build Tool:** Vite

## 🚀 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed.

### 1. Clone the repository

\`\`\`bash
git clone https://github.com/your-username/cinemaflow.git
cd cinemaflow
\`\`\`

### 2. Install dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Environment Setup

Create a \`.env\` file in the root of the project and add your TMDB API keys:
\`\`\`env
VITE*BASE_URL=https://api.themoviedb.org/3
VITE_MOVIE_APIKEY=your_tmdb_v3_api_key_here
\`\`\`
*(You can get a free API key by signing up at [TMDB's Developer Portal](https://developer.themoviedb.org/docs)).\_

### 4. Run the Development Server

\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### 5. Build for Production

\`\`\`bash
npm run build
\`\`\`

## ⚠️ Disclaimer

- This application does not host any media files on its own servers.
- All metadata, posters, and backdrops are provided by [TMDB](https://www.themoviedb.org/).
- Video playback relies on third-party public iframe endpoints that are not affiliated with this project. Use at your own discretion.
