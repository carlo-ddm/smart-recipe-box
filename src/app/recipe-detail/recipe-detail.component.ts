import { Component, computed, input, signal } from '@angular/core';
import { recipes } from '../mock-recipes';

@Component({
  selector: 'app-recipe-detail',
  imports: [],
  templateUrl: './recipe-detail.component.html',
  styleUrl: './recipe-detail.component.scss',
})
export class RecipeDetailComponent {
  recipeIndex = input.required<number>();
  currentRecipe = computed(() => recipes[this.recipeIndex()]);
  servings = signal<number>(1);
  adjustedIngredients = computed(() =>
    this.currentRecipe().ingredients.map((ingredient) => ({
      ...ingredient,
      quantity: ingredient.quantity * this.servings(),
    }))
  );

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
