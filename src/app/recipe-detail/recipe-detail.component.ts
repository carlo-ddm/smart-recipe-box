import { Component, computed, inject, input, signal } from '@angular/core';
import { RecipeService } from '../services/recipe.service';
import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { RecipeModel } from '../models';

@Component({
  selector: 'app-recipe-detail',
  imports: [],
  templateUrl: './recipe-detail.component.html',
  styleUrl: './recipe-detail.component.scss',
})
export class RecipeDetailComponent {
  protected readonly recipe = input<RecipeModel | null>(null);
  protected readonly servings = signal<number>(1);
  protected readonly adjustedIngredients = computed(() =>
    this.recipe()?.ingredients.map((ingredient) => ({
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

export const resolveRecipe: ResolveFn<RecipeModel | null | UrlTree> = (
  activatedRouteSnapshot: ActivatedRouteSnapshot,
  _routerState: RouterStateSnapshot
) => {
  const recipeService = inject(RecipeService);
  const router = inject(Router);
  const id = Number(activatedRouteSnapshot.paramMap.get('rId'));

  if (!Number.isFinite(id)) {
    return router.createUrlTree(['/1']);
  }

  const match =
    recipeService
      .getAllRecipe()()
      .find((recipe) => recipe.id === id) ?? null;

  if (!match) {
    return router.createUrlTree(['/1']);
  }

  return match;
};
