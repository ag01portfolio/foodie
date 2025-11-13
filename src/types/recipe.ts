// Recipe Types
export interface Recipe {
  id: string;
  name: string;
  thumbnail: string;
  category?: string;
  area?: string;
  tags?: string[];
}

export interface RecipeDetail extends Recipe {
  instructions: string;
  ingredients: Array<{
    ingredient: string;
    measure: string;
  }>;
  youtubeUrl?: string;
  source?: string;
}

// Sort and Filter Options
export type SortOption = 'name-asc' | 'name-desc' | 'category';
export type FilterCategory = 'All' | 'Breakfast' | 'Lunch' | 'Dinner' | 'Dessert' | 'Vegetarian';
