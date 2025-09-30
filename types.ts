
export interface ApiCategory {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

export interface ApiMealSummary {
  strMeal: string;
  strMealThumb: string;
  idMeal: string;
}

export interface ApiMealDetail extends ApiMealSummary {
  strInstructions: string;
  strCategory: string;
  [key: `strIngredient${number}`]: string | null;
  [key: `strMeasure${number}`]: string | null;
}

export interface CartItem extends ApiMealSummary {
  quantity: number;
  price: number;
}
