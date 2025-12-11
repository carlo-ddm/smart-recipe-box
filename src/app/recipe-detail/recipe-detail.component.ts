import { Component, computed, DestroyRef, inject, input, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeModel } from '../models';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-recipe-detail',
  imports: [],
  templateUrl: './recipe-detail.component.html',
  styleUrl: './recipe-detail.component.scss',
})
export class RecipeDetailComponent implements OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private recipeService = inject(RecipeService);
  protected recipe = signal(this.recipeService.getRecipe(+this.route.snapshot.params['id']));
  private subscription = this.route.params.subscribe((p) => {
    return this.recipe.set(this.recipeService.getRecipe(+p['id']));
  });

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

  addRecipe() {
    this.router.navigate(['add-recipe']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
