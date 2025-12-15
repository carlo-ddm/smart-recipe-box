# Smart Recipe Box

A small, modern Angular learning project: a “recipe box” app with a master/detail layout, filtering, favorites, and a (work-in-progress) recipe creation flow.

This repository is primarily an **exercise to practice modern Angular** (standalone components, signals, the new built-in control flow, and modern routing). Parts of the development and refactoring were done with the support of an **Angular AI tutor**.

## Features

- Browse a list of recipes with a friendly UI.
- Search/filter recipes in real time.
- Marked “Favorite” recipes show a badge in the list.
- Recipe detail view with ingredient list and serving adjustments.
- Nested routing with a master/detail layout.
- Route resolver that loads a recipe for the detail route and gracefully handles invalid IDs.

## Tech stack

- Angular `^21`
- Standalone components (no NgModules)
- Signals for state (`signal`, `computed`, `input`)
- Built-in control flow (`@if`, `@for`)
- Angular Router (nested routes + resolver)
- Template-driven forms for the search input (`FormsModule`)
- Unit test runner: `ng test` (Vitest via Angular CLI setup)

## Getting started

### Prerequisites

- Node.js (recent LTS recommended)
- npm (this project uses `npm@10.x`)

### Install

```bash
npm install
```

### Development server

```bash
npm start
```

Then open `http://localhost:4200/`. The app uses live reload.

### Build

```bash
npm run build
```

### Unit tests

```bash
npm test
```

## Project structure (high level)

- `src/app/app.routes.ts` — route configuration (nested routes + resolver)
- `src/app/services/recipe.service.ts` — central recipe data (signal-backed)
- `src/app/recipe-list/*` — list view (filtering, navigation, master layout)
- `src/app/recipe-detail/*` — detail view (inputs via route data binding)
- `src/app/mock-recipes.ts` — mock data used as the initial dataset
- `src/styles.scss` — global styling (buttons, shared tokens)

## Architecture notes

### URL as the source of truth

The selected recipe is driven by the route parameter (e.g. `/:rId`). This keeps navigation shareable, refresh-safe, and avoids duplicating selection state in a global service.

### Resolver: data for the route (no global side effects)

The detail route uses a resolver to “resolve” the recipe model for the `:rId` parameter and passes it to the component via router data/component input binding. Invalid or missing IDs are redirected to a safe default.

### Signals and derived state

The service exposes a read-only `Signal<RecipeModel[]>`. The list derives `filteredRecipe` via `computed()`. The detail derives `adjustedIngredients` from the current recipe and the servings signal.

## Roadmap / next steps

The “Add recipe” form is intentionally left as an exercise:

- Implement a reactive form (with dynamic ingredients).
- Validate input and submit.
- Add a recipe mutation method to the service.
- Navigate to the newly created recipe detail after save.

## Scripts

- `npm start` → `ng serve`
- `npm run build` → production build
- `npm test` → unit tests

## Acknowledgements

- Built with the Angular CLI and modern Angular features.
- Portions of the workflow were guided by an AI tutor to accelerate learning and explore best practices.
