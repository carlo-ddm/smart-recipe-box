import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-add-recipe',
  imports: [],
  templateUrl: './add-recipe.component.html',
  styleUrl: './add-recipe.component.scss',
})
export class AddRecipeComponent {
  private router = inject(Router);
  private recipeService = inject(RecipeService);
  protected readonly rId = input.required<number>();
}
