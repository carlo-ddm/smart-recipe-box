import { Component, computed, signal } from '@angular/core';
import { RecipeModel } from '../models';
import { recipes } from '../mock-recipes';
import { RecipeDetailComponent } from '../recipe-detail/recipe-detail.component';

@Component({
  selector: 'app-recipe-list',
  imports: [RecipeDetailComponent],
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.scss',
})
export class RecipeListComponent {
  protected readonly recipes = signal<RecipeModel[]>(recipes);
  protected readonly selectedRecipeIndex = signal<number>(1);
  protected readonly recipe = computed(() => this.recipes()[this.selectedRecipeIndex() - 1]);

  selectRecipe(recipeId: number) {
    this.selectedRecipeIndex.set(recipeId);
  }

  onNextRecipe() {
    this.selectedRecipeIndex.update((index) => {
      let nextRecipeIndex = index + 1;
      const totalRecipes = this.recipes().length;
      if (nextRecipeIndex > totalRecipes) {
        return nextRecipeIndex - 1;
      }
      return nextRecipeIndex;
    });
  }

  onPrevRecipe() {
    this.selectedRecipeIndex.update((index) => {
      const previousRecipeIndex = index - 1;
      if (previousRecipeIndex <= 0) {
        return index;
      }
      return previousRecipeIndex;
    });
  }
}
