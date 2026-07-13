# COEQWAL Website Archive Notes

> Personal archive copy. This documents the project and my role for use as a code sample.

## What the project is

The public-facing web application for COEQWAL (Collaboratory for Equity in Water Allocation), a University of California project. It presents California statewide water-operations modeling (CalSim3) to a general audience through interactive maps, scrollytelling storylines, and a scenario explorer that lets users compare water-management scenarios across equity, reservoir storage, agricultural, environmental, and urban-demand outcomes.

## Tech stack

- **Monorepo**: Turborepo + pnpm workspaces
- **Apps**: Next.js (App Router, React 19, TypeScript), statically exported and deployed on AWS Amplify
- **UI**: MUI (Material UI) v7 with a custom theme/design system
- **Data vizualizations**: D3, Mapbox GL, custom chart components
- **Animation**: Framer Motion + a custom motion/scrollytelling layer
- **Data**: SWR-based hooks over a REST API (`api.coeqwal.org`)

## Architecture (high level)

- `apps/main` - the primary application (maps, scenario explorer, homepage)
- `apps/storyline-*` - standalone scrollytelling storylines (flow, climate, and newer equity/management) by Yun Hsin Kuo
- `packages/ui` - shared design system: theme, MUI re-exports, and components
- `packages/motion`, `packages/scrollytelling` - animation + scroll primitives
- `packages/viz` - chart components
- `packages/data` - API fetching layer, typed hooks, and caching
- `packages/i18n`, `packages/state`, `packages/utils`, `packages/map` - shared cross-cutting code

## Fantauzza's primary contributions

- Design system and theming in `packages/ui` (theme tokens, shared components, MUI integration)
- The scenario explorer and its tool panels (data-in-depth, resilience, radar, list, equity) under `apps/main/app/features/scenarioExplorer` except for the distribution/equity view, which is by Yuya K.
- The data-fetching layer and typed API hooks in `packages/data`
- Map features and visualization layers in `apps/main/app/features/map`
- Theme pages are by Meli Jimenez

## Team and attribution

Full authorship for the codebase is preserved in the git history (`git shortlog -sne`). The `apps/storyline-*` directories are the work of Yun-Hsin Kuo. They are included so the archive shows the complete site, and her individual commits remain in the history.

## Running locally

```bash
pnpm install
# requires .env.local
pnpm dev:main
```

Environment variables are all `NEXT_PUBLIC_*` (a Mapbox token and API base URLs). No server secrets are required to run the front end.
