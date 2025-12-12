import { Component, computed, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-recipe-detail',
  imports: [],
  templateUrl: './recipe-detail.component.html',
  styleUrl: './recipe-detail.component.scss',
})
export class RecipeDetailComponent implements OnInit {
  private recipeService = inject(RecipeService);
  protected readonly rId = input.required<string>();
  protected recipe = computed(() => {
    const recipesSignal = this.recipeService.getAllRecipe();
    return recipesSignal().find((recipe) => recipe.id === Number(this.rId()));
  });
  protected readonly servings = signal<number>(1);

  protected readonly adjustedIngredients = computed(() =>
    this.recipe()?.ingredients.map((ingredient) => ({
      ...ingredient,
      quantity: ingredient.quantity * this.servings(),
    }))
  );

  ngOnInit(): void {
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
