import { Routes } from '@angular/router';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import {
  RecipeDetailComponent,
  resolveRecipe,
  resolveTitle,
} from './recipe-detail/recipe-detail.component';
import { AddRecipeComponent } from './add-recipe/add-recipe.component';

export const routes: Routes = [
  { path: 'add-recipe/:rId', component: AddRecipeComponent },
  { path: 'add-recipe', component: AddRecipeComponent },
  {
    path: '',
    component: RecipeListComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: '1' },
      {
        path: ':rId',
        component: RecipeDetailComponent,
        runGuardsAndResolvers: 'always',
        resolve: {
          recipe: resolveRecipe,
        },
        title: resolveTitle,
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
