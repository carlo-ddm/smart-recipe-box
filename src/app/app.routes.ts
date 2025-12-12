import { Routes } from '@angular/router';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { AddRecipeComponent } from './add-recipe/add-recipe.component';

export const routes: Routes = [
  { path: 'recipes', component: RecipeListComponent },
  { path: 'recipes/:rId', component: RecipeDetailComponent },
  { path: 'add-recipe', component: AddRecipeComponent },
];
