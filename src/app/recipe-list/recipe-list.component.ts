import { Component, computed, inject, signal } from '@angular/core';
import { RecipeDetailComponent } from '../recipe-detail/recipe-detail.component';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-recipe-list',
  imports: [RecipeDetailComponent, NgClass, FormsModule],
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.scss',
})
export class RecipeListComponent {
  private recipeService = inject(RecipeService);
  protected recipes = this.recipeService.getAllRecipe();
  protected readonly selectedRecipeIndex = signal<number>(1);
  protected readonly recipe = computed(() => this.recipes()[this.selectedRecipeIndex() - 1]);
  protected readonly searchRecipe = signal('');
  protected readonly filteredRecipe = computed(() => {
    return this.recipes().filter((recipe) =>
      recipe.name.toLocaleLowerCase().includes(this.searchRecipe().toLocaleLowerCase())
    );
  });

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
