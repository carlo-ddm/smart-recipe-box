import { Component, signal } from '@angular/core';
import { RecipeListComponent } from './recipe-list/recipe-list.component';

@Component({
  selector: 'app-root',
  imports: [RecipeListComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  title = signal('My Recipe Box');
}
