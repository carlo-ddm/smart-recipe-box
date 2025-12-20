export type Unit = 'g' | 'ml' | 'tbsp' | 'each' | 'pinch' | 'clove';

export interface Ingredient {
  name: string;
  quantity: number;
  unit: Unit;
}

export interface RecipeModel {
  id: number;
  name: string;
  description: string;
  imgUrl: string;
  servings: number;
  isFavourite: boolean;
  ingredients: Ingredient[];
}

export type CreateRecipeInput = Omit<RecipeModel, 'id'>;
