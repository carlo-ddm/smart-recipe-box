import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RecipeService } from '../services/recipe.service';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-recipe-list',
  imports: [FormsModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.scss',
})
export class RecipeListComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private recipeService = inject(RecipeService);
  protected recipes = this.recipeService.getAllRecipe();
  protected readonly searchRecipe = signal('');
  protected readonly filteredRecipe = computed(() => {
    return this.recipes().filter((recipe) =>
      recipe.name.toLocaleLowerCase().includes(this.searchRecipe().toLocaleLowerCase())
    );
  });

  private getActiveRecipeId(): number | null {
    const value = this.route.firstChild?.snapshot.paramMap.get('rId');
    const id = Number(value);
    return Number.isFinite(id) ? id : null;
  }

  onNextRecipe() {
    const all = this.recipes();
    if (all.length === 0) {
      return;
    }

    const currentId = this.getActiveRecipeId();
    const currentIndex = all.findIndex((r) => r.id === currentId);
    const safeIndex = currentIndex === -1 ? 0 : currentIndex;

    const nextIndex = Math.min(safeIndex + 1, all.length - 1);
    const nextId = all[nextIndex]?.id;
    if (nextId === undefined) {
      return;
    }

    this.router.navigate([nextId], { relativeTo: this.route });
  }

  onPrevRecipe() {
    const all = this.recipes();
    if (all.length === 0) {
      return;
    }

    const currentId = this.getActiveRecipeId();
    const currentIndex = all.findIndex((r) => r.id === currentId);
    const safeIndex = currentIndex === -1 ? 0 : currentIndex;

    const prevIndex = Math.max(safeIndex - 1, 0);
    const prevId = all[prevIndex]?.id;
    if (prevId === undefined) {
      return;
    }

    this.router.navigate([prevId], { relativeTo: this.route });
  }

  protected isActiveRecipe(id: number): boolean {
    return this.getActiveRecipeId() === id;
  }

  protected canGoNext(): boolean {
    const all = this.recipes();
    const currentId = this.getActiveRecipeId();
    const currentIndex = all.findIndex((r) => r.id === currentId);
    const safeIndex = currentIndex === -1 ? 0 : currentIndex;
    return safeIndex < all.length - 1;
  }

  protected canGoPrev(): boolean {
    const all = this.recipes();
    const currentId = this.getActiveRecipeId();
    const currentIndex = all.findIndex((r) => r.id === currentId);
    const safeIndex = currentIndex === -1 ? 0 : currentIndex;
    return safeIndex > 0;
  }
}
