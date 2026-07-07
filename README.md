# Trove — Investment Portfolio Dashboard

A polished investment portfolio dashboard built with **Next.js** (App Router), **TypeScript**, and **Tailwind CSS v4**. Features a login screen with validation and a comprehensive dashboard displaying net worth, allocation breakdown, account summaries, holdings, and transactions.

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** 9+

### Run Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm run test

# Run tests with coverage
npm run test:coverage
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You'll be directed to the login screen. Use any email/password to sign in (minimum 6 characters for password).

## 📐 Architecture & Approach

### Folder Structure

Mirrors a production-ready Next.js app structure:

```
app/
├── (auth)/login/         # Auth route group - login page
├── (dashboard)/          # Dashboard route group with layout
│   ├── layout.tsx        # Sidebar + TopNav + MobileNav wrapper
│   └── dashboard/        # Main dashboard page
├── components/
│   ├── layout/           # App Sidebar, TopNav, MobileNav
│   └── ui/               # Reusable UI components (shadcn-like)
├── config/               # Environment configuration
├── constants/            # Color maps, nav items
├── context/              # Auth provider
├── data/                 # portfolio_data.json
├── enum/                 # TransactionStatus, TransactionType, Sector, TimePeriod
├── hooks/                # useIsMobile, usePortfolioData
├── interfaces/           # Shared prop interfaces
├── lib/                  # cn() utility
├── services/             # Portfolio service layer (async data fetching)
├── stores/               # Zustand auth store
├── types/                # TypeScript type definitions
├── utils/                # Formatters (currency, percentage, date)
└── validations/          # Zod login form schema
```

### Key Decisions

| Decision                   | Rationale                                                                                                                                     |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Custom UI components**   | Built with CVA (class-variance-authority) + clsx + tailwind-merge, no UI library imports                                                      |
| **Service layer**          | JSON data is never imported directly into components. All access goes through `portfolioService` with simulated async delays (400-800ms)      |
| **TanStack Query**         | Used for all data fetching (`useQuery`) and mutations (`useMutation`), providing deduplication, automatic caching, and elegant loading states |
| **Zustand for auth state** | Lightweight global state used alongside an `AuthProvider` HOC-like wrapper that conditionally protects routes and guest pages                 |
| **Zod + react-hook-form**  | Form validation with type-safe schemas                                                                                                        |
| **Recharts**               | Wrapped in a custom `<Chart />` component                                                                                                     |
| **react-icons**            | Icon library for all icons (Lucide icon set: `react-icons/lu`)                                                                                |
| **Enums for status**       | `TransactionStatus` enum (`COMPLETED`, `PENDING`, `FAILED`) ensures type safety and consistent rendering                                      |

### Component Architecture

Every UI element is its own component file:

- `button.tsx` — CVA variants (default, outline, ghost, link, destructive) + loading spinner
- `input.tsx` — Props-driven type switching (text, email, password with eye toggle, search)
- `card.tsx` — Card suite (Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter)
- `tabs.tsx` — Custom tabs with React context, smooth fade animation
- `separator.tsx` — Horizontal/vertical divider
- `badge.tsx` — Status badges (success, warning, error, info)
- `skeleton.tsx` — Shimmer loading placeholder
- `progress-bar.tsx` — Horizontal stacked bar for allocation
- `chart.tsx` — Recharts AreaChart wrapper with gradient fill

## 🧩 Data Quirk Handling

### 1. Data Validation & Edge Cases

When receiving data from the backend, I validate the incoming data before rendering to handle edge cases appropriately:

**shares === 0**
A holding with zero shares is not an active investment. I would:

- Exclude it from the active portfolio list.
- Never include it in portfolio calculations.

**currentPrice === 0**
I would treat this as missing or unavailable market data, not as a genuine stock price. I would:

- Display "N/A" or "Price unavailable" instead of $0.00.
- Disable gain/loss calculations for that holding to avoid incorrect metrics.
- Show a placeholder (—) for market value if it depends on the current price.

For overall portfolio metrics, I would rely on the backend-provided summary values to ensure consistenc and respect for the backend as the source of truth.

### 4. PENDING Transaction (AMZN Buy)

- **Decision**: Displayed with amber/yellow badge, clock icon, and "Price unavailable" instead of an amount
- **Rationale**: A pending transaction hasn't settled — showing a definitive amount could be misleading
- **Visual**: `LuClock` icon, `warning` badge variant, muted amount text

### 5. FAILED Transaction (Visa Buy)

- **Decision**: Displayed with red badge, X icon, and strikethrough-style muted amount
- **Rationale**: The transaction didn't execute — the amount should be visually de-emphasized
- **Visual**: `LuCircleX` icon, `error` badge variant, 75% opacity card, muted+line-through text

### 6. Negative Gain/Loss

- **Decision**: Properly formatted with negative sign, red color (#BF221C), and down-trending arrow
- **Format**: `-$161.00 (-6.1%)` — negative sign preserved in both dollar and percentage
- **Visual**: Uses `text-destructive` color class, `LuTrendingDown` icon

## 🎨 Design System

### Trove v3 Color Palette

| Token                 | Value     | Usage                            |
| --------------------- | --------- | -------------------------------- |
| Primary (Trove Green) | `#059A83` | Buttons, active states, links    |
| Primary Light         | `#E0F5E1` | Badges, subtle backgrounds       |
| Success               | `#10AE17` | Positive returns, gains          |
| Destructive           | `#BF221C` | Negative returns, losses, errors |
| Page Background       | `#F5F1EE` | Outer page background            |
| Card Surface          | `#FFFFFF` | Card backgrounds                 |
| Text Default          | `#13342F` | Headings, primary text           |
| Text Neutral          | `#687D7A` | Labels, secondary text           |
| Text Disabled         | `#92A29F` | Placeholders, muted text         |
| Border                | `#DBDFDF` | Card borders, dividers           |

### Typography

- **Font**: Inter (Google Fonts)
- **Net worth value**: 28px, semi-bold
- **Card values**: 14px, medium weight
- **Labels/captions**: 11-12px, neutral/disabled color

### Responsive Breakpoints

| Breakpoint              | Layout                                                  |
| ----------------------- | ------------------------------------------------------- |
| **Mobile** (<768px)     | Single column, bottom nav, tabbed holdings/transactions |
| **Tablet** (768-1023px) | Two-column grids, top nav search visible                |
| **Desktop** (≥1024px)   | Full sidebar, side-by-side layout, all cards visible    |

## ⏱️ What I Would Improve With More Time

1. **Real-time chart data** — Connect to a WebSocket for live price updates with animated transitions
2. **Skeleton loading per-section** — Independent loading states for each dashboard section rather than a single global loading state
3. **Dark mode** — The color system is already CSS variable-based, making dark mode a matter of swapping variables
4. **Accessibility audit** — Full keyboard navigation, ARIA live regions for dynamic content, screen reader announcements
5. **Data persistence** — Use sessionStorage or a backend to persist auth state across refreshes
6. **Portfolio performance chart** — Real historical data with configurable date ranges
7. **Search autocomplete** — Debounced search with dropdown suggestions
8. **PWA support** — Service worker for offline portfolio viewing

## 🛠 Tech Stack

| Category   | Technology                           |
| ---------- | ------------------------------------ |
| Framework  | Next.js 16 (App Router)              |
| Language   | TypeScript                           |
| Styling    | Tailwind CSS v4                      |
| State      | Zustand + TanStack Query             |
| Forms      | react-hook-form + Zod                |
| Charts     | Recharts                             |
| Icons      | react-icons (Lucide set)             |
| Components | Custom (CVA + clsx + tailwind-merge) |
| Testing    | Jest + React Testing Library         |
