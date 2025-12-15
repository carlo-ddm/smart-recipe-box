import { Injectable, signal } from '@angular/core';
import { recipes } from '../mock-recipes';
import { RecipeModel } from '../models';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private readonly recipes = signal<RecipeModel[]>(recipes);

  getAllRecipe() {
    return this.recipes.asReadonly(); // .asReadonly non sul valore, sul box (sul signal)
  }
}
