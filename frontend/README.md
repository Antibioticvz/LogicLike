# Frontend - Voting Platform

React + TypeScript + Vite + Tailwind CSS frontend for the voting platform.

## 🚀 Quick Start

### Prerequisites

- Node.js 20.11+ 
- npm 10+
- Backend server running on port 3000

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── api/                    # API client layer
│   └── client.ts          # Type-safe API methods
├── components/            # React components
│   ├── features/          # Feature-specific components
│   │   └── ideas/
│   │       ├── IdeaCard.tsx      # Idea card component
│   │       ├── IdeaList.tsx      # Ideas list container
│   │       └── VoteButton.tsx    # Vote button component
│   └── shared/            # Reusable components
│       ├── ErrorMessage.tsx
│       └── LoadingSpinner.tsx
├── hooks/                 # Custom React hooks
│   ├── useIdeas.ts       # Ideas data fetching
│   └── useVote.ts        # Voting logic
├── types/                # TypeScript types
│   ├── generated.ts      # 🤖 Auto-generated from backend
│   └── api.types.ts      # API type exports
├── App.tsx               # Main app component
└── main.tsx              # App entry point
```

## 🎨 Features

- ✅ **Type-safe API** - Full TypeScript coverage
- ✅ **Auto-generated types** - Synced with backend Prisma schema
- ✅ **Responsive design** - Mobile-first approach
- ✅ **Real-time updates** - Vote counts update immediately
- ✅ **Error handling** - User-friendly error messages
- ✅ **Loading states** - Smooth UX with spinners
- ✅ **Vote status** - Visual feedback for voted items
- ✅ **IP-based limits** - Clear indication of voting status

## 🛠️ Development

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Type checking
npm run type-check

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Type Generation

Types are automatically generated from the backend Prisma schema:

```bash
# In backend directory
npm run types:generate
```

This creates `src/types/generated.ts` with all domain types, API responses, and error types.

## 🎯 Component Architecture

### Container/Presentational Pattern

- **Containers** (IdeaList) - Handle logic and state
- **Presentational** (IdeaCard, VoteButton) - Pure UI components

### Custom Hooks

- `useIdeas()` - Fetches and manages ideas list
- `useVote()` - Handles voting logic and error states

### Type Safety

All components use generated types:

```typescript
import type { IdeaWithVoteStatus } from '@/types/api.types'

interface Props {
  idea: IdeaWithVoteStatus
}
```

## 🌐 API Integration

### Endpoints

- `GET /api/ideas` - Get all ideas with vote status
- `GET /api/ideas/:id` - Get single idea
- `POST /api/ideas/:id/vote` - Vote for an idea

### Error Handling

The app handles various error types:

- Network errors
- Duplicate vote attempts
- Vote limit exceeded
- Invalid ideas

```typescript
import { isVotingError } from '@/types/api.types'

if (isVotingError(error)) {
  // Handle specific voting errors
  switch(error.type) {
    case 'DUPLICATE_VOTE': ...
    case 'VOTE_LIMIT_EXCEEDED': ...
  }
}
```

## 🎨 Styling

### Tailwind CSS

Utility-first CSS framework for rapid UI development:

```tsx
<div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
  {/* Component content */}
</div>
```

### Responsive Design

Mobile-first breakpoints:

- `sm:` - 640px+
- `md:` - 768px+
- `lg:` - 1024px+
- `xl:` - 1280px+

## 🔧 Configuration

### Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:3000
```

### Vite Configuration

See `vite.config.ts` for:
- Path aliases (`@/*`)
- API proxy configuration
- Build optimizations

## 📦 Build & Deploy

### Production Build

```bash
npm run build
```

Outputs to `dist/` directory.

### Preview Build

```bash
npm run preview
```

Serves the production build locally.

## 🧪 Best Practices

1. **Type Safety** - Always use generated types
2. **Component Decomposition** - Keep components small and focused
3. **Custom Hooks** - Extract logic into reusable hooks
4. **Error Boundaries** - Handle errors gracefully
5. **Accessibility** - Use semantic HTML and ARIA labels
6. **Performance** - Lazy load components when needed

## 📚 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Fetch API** - HTTP requests

## 🐛 Troubleshooting

### Types not found

Run type generation:

```bash
cd ../backend
npm run types:generate
```

### API connection fails

1. Check backend is running on port 3000
2. Verify `VITE_API_URL` in `.env`
3. Check CORS settings in backend

### Build fails

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## 📝 License

MIT
