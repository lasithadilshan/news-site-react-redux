# 📰 PulseNews — Real-Time News Application

A modern, responsive news web application built with **React 19**, **Redux Toolkit**, and **Vite**. Fetches and displays real-time news from the [GNews API](https://gnews.io/) with category filtering, search, and automatic background refresh.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.x-764ABC?logo=redux)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)

## ✨ Features

- **📡 Real-Time News** — Fetches latest headlines from GNews API
- **🏷️ Category Filtering** — Browse by Technology, Business, Sports, Entertainment, Health, Science, World
- **🔍 Live Search** — Debounced search with instant results
- **♾️ Infinite Scroll** — Seamless content loading with IntersectionObserver
- **🔄 Auto-Refresh** — Background polling every 5 minutes (configurable)
- **🌗 Dark/Light Theme** — Persisted theme preference with system detection
- **📱 Mobile Responsive** — Fully responsive with hamburger menu
- **⚡ Performance** — Memoized components, lazy image loading, skeleton placeholders
- **🛡️ Error Handling** — Graceful error states with retry functionality
- **📄 Article Detail Pages** — Full article view with share and source links

## 🏗️ Project Structure

```
src/
├── api/
│   └── newsApi.js              # Axios instance & API service functions
├── components/
│   ├── ArticleCard/            # Reusable news article card
│   ├── ErrorMessage/           # Error display with retry
│   ├── Footer/                 # Site footer
│   ├── Loader/                 # Animated loading indicator
│   └── Navbar/                 # Navigation with search & theme toggle
├── hooks/
│   ├── useAutoRefresh.js       # Polling hook for background updates
│   ├── useDebounce.js          # Input debouncing hook
│   └── useInfiniteScroll.js    # IntersectionObserver infinite scroll
├── pages/
│   ├── ArticleDetailPage/      # Individual article view
│   ├── CategoryPage/           # Category-filtered news
│   ├── HomePage/               # Main landing page with hero
│   └── SearchPage/             # Search results page
├── store/
│   ├── slices/
│   │   ├── newsSlice.js        # News state, async thunks
│   │   ├── searchSlice.js      # Search state, async thunks
│   │   └── uiSlice.js          # Theme, menu, modal state
│   └── store.js                # Redux store configuration
├── utils/
│   ├── constants.js            # Categories, config values
│   └── helpers.js              # Date formatting, text utilities
├── App.jsx                     # Root component with routing
├── index.css                   # Global design system & themes
└── main.jsx                    # Entry point with Redux Provider
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd news-site-react-redux

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### API Key Setup

1. Sign up at [gnews.io](https://gnews.io/) for a free API key (100 requests/day)
2. Add your key to `.env`:

```env
VITE_GNEWS_API_KEY=your_actual_api_key_here
VITE_NEWS_REFRESH_INTERVAL=300000
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **Redux Toolkit** | Global state management |
| **React Router v7** | Client-side routing |
| **Axios** | HTTP client with interceptors |
| **date-fns** | Date formatting |
| **react-icons** | Icon library |
| **Vite** | Build tool & dev server |

## 🎨 Design System

- **Typography**: Inter (Google Fonts)
- **Colors**: Indigo accent palette with curated dark/light themes
- **Effects**: Glassmorphism navbar, floating orb decorations, skeleton loaders
- **Animations**: Card fade-in, image zoom, pulse loader, bounce-in emojis
- **Responsive**: 3-column → 2-column → 1-column grid breakpoints

## ⚙️ Configuration

| Env Variable | Default | Description |
|---|---|---|
| `VITE_GNEWS_API_KEY` | — | Your GNews API key (required) |
| `VITE_NEWS_REFRESH_INTERVAL` | `300000` | Auto-refresh interval in ms (5 min) |

## 📋 Redux State Architecture

```
store/
├── news/           # Headlines, pagination, loading, errors
├── search/         # Search results, query, pagination
└── ui/             # Theme, mobile menu, search modal
```

Each slice uses `createAsyncThunk` for API calls with proper loading, success, and error states.

## 📝 License

MIT
