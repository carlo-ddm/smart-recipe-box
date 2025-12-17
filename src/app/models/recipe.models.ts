export interface RecipeModel {
  id: number;
  name: string;
  description: string;
  imgUrl: string;
  isFavorite: boolean
  ingredients: Ingredient[];
}

type Unit = 'g' | 'ml' | 'tbsp' | 'each' | 'pinch' | 'clove';

export interface Ingredient {
  name: string;
  quantity: number;
  unit: Unit;
}
