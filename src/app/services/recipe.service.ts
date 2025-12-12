import { Injectable, signal } from '@angular/core';
import { recipes } from '../mock-recipes';
import { RecipeModel } from '../models';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private readonly recipes = signal<RecipeModel[]>(recipes);
  currentRecipeIndex = signal<number>(0);

  getAllRecipe() {
    return this.recipes.asReadonly(); // .asReadonly non sul valore, sul box (sul signal)
  }
}
