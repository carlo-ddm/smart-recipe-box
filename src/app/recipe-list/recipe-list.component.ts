import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RecipeService } from '../services/recipe.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

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
      this.router.navigate(['/', all[currentIndex].id]);
    }
  }

  onSelectRecipe(id: number) {
    this.recipeService.currentRecipeIndex.set(id - 1);
    this.router.navigate(['/', id]);
  }

  onNextRecipe() {
    const all = this.recipes();
    const currentIndex = this.recipeService.currentRecipeIndex();
    const nextIndex = Math.min(currentIndex + 1, all.length - 1);
    const next = all[nextIndex];
    if (nextIndex != currentIndex && currentIndex < all.length) {
      this.recipeService.currentRecipeIndex.update((n) => n + 1);
      this.router.navigate(['/', next.id]);
    }
  }

  onPrevRecipe() {
    const all = this.recipes();
    const currentIndex = this.recipeService.currentRecipeIndex();
    const prevIndex = Math.max(currentIndex - 1, 0);
    const prev = all[prevIndex];
    if (prevIndex < currentIndex) {
      this.recipeService.currentRecipeIndex.update((n) => n - 1);
      this.router.navigate(['/', prev.id]);
    }
  }
}
