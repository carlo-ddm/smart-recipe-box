import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecipeService } from '../services/recipe.service';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-recipe-list',
  imports: [FormsModule, RouterLink, RouterOutlet],
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.scss',
})
export class RecipeListComponent implements OnInit {
  private router = inject(Router);
  private recipeService = inject(RecipeService);
  protected recipes = this.recipeService.getAllRecipe();
  protected readonly searchRecipe = signal('');
  protected readonly filteredRecipe = computed(() => {
    return this.recipes().filter((recipe) =>
      recipe.name.toLocaleLowerCase().includes(this.searchRecipe().toLocaleLowerCase())
    );
  });

  ngOnInit(): void {
    const all = this.recipes();
    const currentIndex = this.recipeService.currentRecipeIndex();
    if (all[currentIndex]) {
      this.router.navigate(['/recipes', all[currentIndex].id]);
    }
  }

  onNextRecipe() {
    const all = this.recipes();
    const currentIndex = this.recipeService.currentRecipeIndex();
    // MDN: The Math.min() static method returns the smallest of the numbers given as input parameters, or Infinity if there are no parameters.
    const nextIndex = Math.min(currentIndex + 1, all.length - 1);
    const next = all[nextIndex];
    if (next) {
      this.router.navigate(['/recipes', next.id]);
    }
  }

  onPrevRecipe() {
    const all = this.recipes();
    const currentIndex = this.recipeService.currentRecipeIndex();
    // MDN: The Math.max() static method returns the largest of the numbers given as input parameters, or -Infinity if there are no parameters.
    const prevIndex = Math.max(currentIndex - 1, 0);
    const prev = all[prevIndex];
    if (prev) {
      this.router.navigate(['/recipes', prev.id]);
    }
  }
}
