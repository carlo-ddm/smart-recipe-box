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
    return this.recipes.asReadonly();
  }

  /**
   * Returns a cloned recipe to keep the store immutable from callers.
   */
  getRecipe(id: number) {
    const recipe = this.recipes().find((value) => value.id === id);
    return structuredClone(recipe);
  }

  /**
   * Creates a new recipe when edit is false and then navigates back to the list.
   * Note: edit mode handling is intentionally left unimplemented for now.
   */
  inserOrUpdatewRecipe<T extends CreateRecipeInput | RecipeModel>(value: T, edit: boolean) {
    if (!edit) {
      const lastId = this.recipes().find(
        (value: RecipeModel, _: number, obj: RecipeModel[]) => value.id === obj[obj.length - 1].id
      )?.id as number;

      const newRecipe: RecipeModel = {
        ...value,
        id: lastId + 1,
      };

      this.recipes.update((recipes) => [...recipes, newRecipe]);
    } else {
      // TODO
    }

    this.router.navigate(['../']);
  }

  deleteRecipe(id: number) {
    const recipeIndex = this.recipes().findIndex((value: RecipeModel) => value.id === id);
    this.recipes.update((recipes: RecipeModel[]) =>
      recipes.filter(
        (value: RecipeModel, _: number, obj: RecipeModel[]) => obj.indexOf(value) !== recipeIndex
      )
    );
  }
}
