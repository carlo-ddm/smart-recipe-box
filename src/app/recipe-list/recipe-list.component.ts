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
  recipes = signal<RecipeModel[]>(recipes);
  selectedRecipeIndex = signal<number>(-1);

  selectRecipe(recipeId: number) {
    this.selectedRecipeIndex.set(recipeId);
  }

  onNextRecipe() {
    // const nextRecipeIndex = recipes.indexOf(this.recipe()) + 1;
    // const totalRecipes = recipes.length;
    // if (nextRecipeIndex >= totalRecipes) {
    //   this.recipe.set(recipes[0]);
    //   return;
    // }
    // this.recipe.set(recipes[nextRecipeIndex]);
  }

  onPrevRecipe() {
    // const previousRecipeIndex = recipes.indexOf(this.recipe()) - 1;
    // if (previousRecipeIndex <= 0) {
    //   this.recipe.set(recipes[recipes.length - 1]);
    //   return;
    // }
    // this.recipe.set(recipes[previousRecipeIndex]);
  }
}
