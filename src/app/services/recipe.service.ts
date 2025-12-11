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

  getRecipe(id: number) {
    const recipe = this.recipes().find((recipe) => recipe.id === id);
    // salvo lo stato
    this.currentRecipeIndex.set(this.recipes().findIndex((r) => r === recipe));
    return recipe;
  }
}
