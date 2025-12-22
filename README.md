# Smart Recipe Box

An Angular learning project: a “recipe box” app with a master/detail layout, filtering, favorites, and a create/edit flow.

This repository is primarily an **exercise to practice modern Angular** (standalone components, signals, the new built-in control flow, modern routing, and reactive forms).

While the development (code, naming, and commits) is written in **English**, the visible UI copy is intentionally **Italian**.

## Note on AI usage

AI was used **exclusively** to iterate on the visual side of the project (HTML/CSS styling and UI polish), so I could focus on the application logic and modern Angular features.

## Features

- Browse a list of recipes with a friendly UI.
- Search/filter recipes in real time.
- Favorite recipes show a badge in the list.
- Recipe detail view with ingredient list and serving adjustments.
- Nested routing with a master/detail layout.
- Route resolver that loads a recipe for the detail route and gracefully handles invalid IDs.
- Create a new recipe via a reactive form with dynamic ingredients and validation.
- Edit an existing recipe with pre-populated form values.
- Delete a recipe with a custom confirmation dialog (service-driven).
- Responsive layout with scrollable ingredient panels to keep pages tidy.

Note: the navigation items in the header are placeholders (they are not wired to real sections).

## Tech stack

- Angular `^21`
- Standalone components (no NgModules)
- Signals for state (`signal`, `computed`, `input`)
- Built-in control flow (`@if`, `@for`)
- Angular Router (nested routes + resolver)
- Template-driven forms for the search input (`FormsModule`)
- Typed reactive forms for create/edit (`ReactiveFormsModule`)
- Service-driven confirmation dialog (custom, Material-inspired API)
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

- `src/app/app.ts` + `src/app/app.html` — root layout + dialog host
- `src/app/app.routes.ts` — route configuration (nested routes + resolver + add/edit routes)
- `src/app/models/*` — domain models and dialog configuration types
- `src/app/services/recipe.service.ts` — recipe store (signal-backed) + mutations (create/edit/delete)
- `src/app/services/dialog.service.ts` — service-driven confirmation dialog API
- `src/app/recipe-list/*` — list view (filtering, navigation, master layout)
- `src/app/recipe-detail/*` — detail view (resolver-backed input + servings)
- `src/app/add-recipe/*` — create/edit form (typed reactive forms + dynamic ingredients)
- `src/app/mock-recipes.ts` — mock data used as the initial dataset
- `src/styles.scss` — global styling (buttons, shared tokens)

## Architecture notes

### URL as the source of truth

The selected recipe is driven by the route parameter (e.g. `/:rId`). This keeps navigation shareable, refresh-safe, and avoids duplicating selection state in a global service.

### Resolver: data for the route (no global side effects)

The detail route uses a resolver to “resolve” the recipe model for the `:rId` parameter and passes it to the component via router data/component input binding. Invalid or missing IDs are redirected to a safe default.

### Signals and derived state

The service exposes a read-only `Signal<RecipeModel[]>`. The list derives `filteredRecipe` via `computed()`. The detail derives `adjustedIngredients` from the current recipe and the servings signal.

### Centralized confirmation dialog

The confirmation dialog is rendered once at the app root and driven by a `DialogService` that exposes a config signal and returns a `Promise<boolean>` for the user decision. This keeps UI consistent and avoids duplicating modal markup across features.

## Scripts

- `npm start` → `ng serve`
- `npm run build` → production build
- `npm test` → unit tests

## Acknowledgements

- Built with the Angular CLI and modern Angular features.
- AI assistance was used only for UI styling iterations (HTML/CSS) as described above.
