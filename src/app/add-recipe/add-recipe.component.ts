import { Component, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-add-recipe',
  imports: [],
  templateUrl: './add-recipe.component.html',
  styleUrl: './add-recipe.component.scss',
})
export class AddRecipeComponent implements OnInit {
  ngOnInit(): void {
    console.log('check');
  }
}
