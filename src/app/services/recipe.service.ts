import { inject, Injectable, signal } from '@angular/core';
import { recipes } from '../mock-recipes';
import { CreateRecipeInput, RecipeModel } from '../models/recipe.models';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private router = inject(Router);
  private recipes = signal<RecipeModel[]>(recipes);

  getAllRecipe() {
    return this.recipes.asReadonly(); // .asReadonly is called on the signal itself, not on its value
  }

  insertNewRecipe(value: CreateRecipeInput) {
    const lastId = this.recipes().find(
      (value: RecipeModel, _: number, obj: RecipeModel[]) => value.id === obj[obj.length - 1].id
    )?.id as number;

    const newRecipe: RecipeModel = {
      ...value,
      id: lastId + 1,
    };

    this.recipes.update((recipes) => [...recipes, newRecipe]);

    this.router.navigate(['../']);
  }
}
