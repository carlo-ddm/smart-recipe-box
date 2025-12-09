import { Component, computed, signal } from '@angular/core';
import { RecipeModel } from '../models';
import { recipes } from '../mock-recipes';

@Component({
  selector: 'app-recipe-list',
  imports: [],
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.scss',
})
export class RecipeListComponent {
  recipe = signal<RecipeModel>(recipes[0]);
  servings = signal<number>(1);
  adjustedIngredients = computed(() =>
    this.recipe().ingredients.map((ingredient) => ({
      ...ingredient,
      quantity: ingredient.quantity * this.servings(),
    }))
  );

  onNextRecipe() {
    const nextRecipeIndex = recipes.indexOf(this.recipe()) + 1;
    const totalRecipes = recipes.length;

    if (nextRecipeIndex >= totalRecipes) {
      this.recipe.set(recipes[0]);
      return;
    }

    this.recipe.set(recipes[nextRecipeIndex]);
  }

  onPrevRecipe() {
    const previousRecipeIndex = recipes.indexOf(this.recipe()) - 1;
    if (previousRecipeIndex <= 0) {
      this.recipe.set(recipes[recipes.length - 1]);
      return;
    }

    this.recipe.set(recipes[previousRecipeIndex]);
  }

  onIncrementServings() {
    this.servings.update((n) => n + 1);
  }

  onDecrementServings() {
    if (this.servings() <= 1) {
      return;
    }
    this.servings.update((n) => n - 1);
  }
}
