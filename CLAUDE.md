# CLAUDE.md — AnisPort Portfolio

This file provides context and conventions for AI assistants working on the AnisPort codebase.

---

## Project Overview

**AnisPort** is a personal portfolio website built as a single-page application (SPA). It features a neo-brutalist aesthetic with advanced interactive elements: a matrix rain hero animation, an interactive terminal interface, GitHub contribution graph, and WhatsApp-integrated contact form.

The project has **no backend** — it is a purely static, client-side React application suitable for hosting on Vercel, Netlify, or any static host.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Bundler | Vite 5 (with SWC plugin) |
| Styling | Tailwind CSS 3 + CSS variables |
| Component Library | shadcn/ui (Radix UI primitives) |
| Routing | React Router DOM v6 |
| Server State | TanStack React Query v5 |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| Testing | Vitest + Testing Library + jsdom |
| Package Manager | npm (also has `bun.lockb` — either works) |

---

## Directory Structure

```
AnisPort/
├── public/               # Static assets served as-is
│   ├── favicon.png
│   ├── resume.pdf        # Downloadable resume
│   ├── robots.txt
│   └── images/
├── src/
│   ├── main.tsx          # React root mount point
│   ├── App.tsx           # Router setup + global providers
│   ├── index.css         # Global styles, Tailwind directives, CSS variables
│   ├── vite-env.d.ts     # Vite type shims
│   ├── components/       # Feature components (one per portfolio section)
│   │   ├── Navbar.tsx
│   │   ├── HeroSection.tsx       # Matrix rain + typewriter
│   │   ├── AboutSection.tsx
│   │   ├── EducationSection.tsx
│   │   ├── ExperienceSection.tsx
│   │   ├── SkillsSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   ├── ContactSection.tsx    # WhatsApp integration
│   │   ├── Terminal.tsx          # Interactive CLI (Ctrl+K to open)
│   │   ├── Finale.tsx
│   │   ├── Footer.tsx
│   │   ├── ScrollToTop.tsx
│   │   ├── SectionBlock.tsx      # Scroll-animated section wrapper
│   │   ├── GithubGraph.tsx       # GitHub contribution calendar
│   │   ├── AnimatedAvatar.tsx
│   │   ├── NavLink.tsx
│   │   └── ui/                   # shadcn/ui primitives (30+ files)
│   ├── pages/
│   │   ├── Index.tsx             # Main portfolio page (composes all sections)
│   │   └── NotFound.tsx          # 404 page
│   ├── hooks/
│   │   ├── use-mobile.tsx        # Breakpoint detection (768px threshold)
│   │   └── use-toast.ts          # Toast notifications
│   ├── lib/
│   │   └── utils.ts              # cn() Tailwind class merger
│   └── test/
│       ├── setup.ts              # Testing Library + matchMedia mock
│       └── example.test.ts
├── index.html            # Vite HTML entry point
├── vite.config.ts        # Dev server (port 8080), path aliases
├── vitest.config.ts      # Test runner config
├── tailwind.config.ts    # Theme tokens (CSS variable–based colors)
├── tsconfig.json         # Base TypeScript config
├── tsconfig.app.json     # App-specific TS config
├── tsconfig.node.json    # Node/tooling TS config
├── eslint.config.js      # ESLint rules
├── postcss.config.js     # PostCSS (Tailwind + autoprefixer)
└── components.json       # shadcn/ui CLI config
```

---

## Development Commands

```bash
npm run dev          # Start dev server at http://localhost:8080
npm run build        # Production build → dist/
npm run build:dev    # Dev-mode build (for debugging)
npm run preview      # Serve the dist/ build locally
npm run lint         # Run ESLint
npm run test         # Run tests once (Vitest)
npm run test:watch   # Run tests in watch mode
```

---

## Key Conventions

### Imports
- Always use the `@/` path alias for src imports: `import { cn } from "@/lib/utils"`
- shadcn/ui components live in `@/components/ui/` — do not import from `radix-ui` directly

### Styling
- Use **Tailwind utility classes** as the primary styling method
- For theme-aware colors, use CSS variables: `bg-background`, `text-foreground`, `text-primary`, etc.
- Custom utility classes are defined in `src/index.css`: `heading-brutal`, `section-title`, `body-text`, `nav-link`
- Dark mode is class-based (`dark` on `<html>`) via `next-themes`
- Animations: prefer CSS keyframes (defined in `index.css`) or `tailwindcss-animate` utilities over inline styles

### Components
- Feature/section components belong in `src/components/`
- Reusable UI primitives (buttons, inputs, dialogs) belong in `src/components/ui/` and should be generated via `npx shadcn@latest add <component>`
- Wrap new portfolio sections with `<SectionBlock>` to get consistent fade-in scroll animation and spacing
- Keep components self-contained; avoid prop-drilling beyond 2 levels

### TypeScript
- TypeScript `strict` mode is **off** (`tsconfig.json`); type annotations are pragmatic, not exhaustive
- Zod is available for runtime schema validation (used in forms)
- Do not add type annotations to files you are not otherwise modifying

### State Management
- Local component state: `useState` / `useReducer`
- Server/async state: `TanStack React Query` (`useQuery`, `useMutation`)
- Global UI state: React Context (e.g., `TooltipProvider`)
- No Redux or Zustand — keep state lightweight

### Testing
- Tests live in `src/test/` or co-located as `*.test.tsx` / `*.spec.tsx`
- Use Vitest globals (`describe`, `it`, `expect`) — no imports needed
- `@testing-library/react` is available for component rendering
- `window.matchMedia` is mocked in `src/test/setup.ts` for responsive tests

---

## Important Implementation Details

### HeroSection — Matrix Rain
The canvas-based matrix animation in `HeroSection.tsx` uses `requestAnimationFrame`. When modifying this component, be careful not to introduce memory leaks — the animation loop must be cancelled in the `useEffect` cleanup.

### Terminal Component (`Ctrl+K`)
`Terminal.tsx` handles a global keyboard shortcut (`Ctrl+K`) for opening/closing. It has an internal command registry. To add a new command, add an entry to the command handler inside the component.

### SectionBlock — Scroll Animations
`SectionBlock.tsx` uses `IntersectionObserver` to trigger fade-in animations. Any new portfolio section should be wrapped in `<SectionBlock>` for visual consistency.

### Contact / WhatsApp Integration
`ContactSection.tsx` constructs a WhatsApp deep link from the form fields. Phone number and email are **hardcoded** in the component — update them there directly if they change.

### GitHub Graph
`GithubGraph.tsx` uses `react-github-calendar` with the username `VARA4u-tech`. Update the username prop directly in that file if the GitHub account changes.

### No Environment Variables
There are currently **no `.env` files** and no runtime environment variables. All configuration (social links, contact info, GitHub username) is hardcoded in component files.

---

## Architectural Patterns

| Pattern | Where Used |
|---|---|
| Composition via `SectionBlock` | All portfolio sections |
| Custom hooks for browser APIs | `use-mobile`, `use-toast` |
| `cn()` for conditional classes | Every component |
| Canvas-based animation | `HeroSection.tsx` |
| Intersection Observer | `SectionBlock.tsx` |
| React Query | `App.tsx` (provider ready, hooks available) |

---

## What NOT to Do

- **Do not** add server-side code or API routes — this is a static site
- **Do not** add Redux, Zustand, or other global state libraries; use React state / Context
- **Do not** import shadcn/ui components from `@radix-ui/*` directly — use the `@/components/ui/` wrappers
- **Do not** introduce environment variable requirements without updating this file
- **Do not** skip the `SectionBlock` wrapper for new portfolio sections
- **Do not** cancel the matrix rain animation without also updating the `useEffect` cleanup in `HeroSection.tsx`
- **Do not** modify `src/components/ui/` files manually — use `npx shadcn@latest add` to update them

---

## Adding New Portfolio Sections

1. Create `src/components/YourSection.tsx`
2. Wrap content with `<SectionBlock id="your-section" title="Your Title">`
3. Import and add the component to `src/pages/Index.tsx` in the desired position
4. Add a nav link entry in `Navbar.tsx` pointing to `#your-section`

## Adding New shadcn/ui Components

```bash
npx shadcn@latest add <component-name>
# This generates the component in src/components/ui/
```

---

## Git & Branching

- Main branch: `master`
- Feature branches: use descriptive names, e.g., `feature/add-blog-section`
- No CI/CD pipeline is currently configured
- No automated deployment — deployments are manual (e.g., Vercel dashboard or CLI)
