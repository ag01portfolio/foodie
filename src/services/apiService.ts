import { Recipe, RecipeDetail } from '../types/recipe';
import { ACTIVE_API, GET_LOCAL_DATA, getActiveConfig } from '../config/apiConfig';
import { 
  getAllIndianRecipes, 
  getIndianRecipeById, 
  getIndianRecipesByCategory,
  searchIndianRecipes 
} from '../mockDB';

class APIService {
  private baseUrl: string;

  constructor() {
    const config = getActiveConfig();
    this.baseUrl = config.baseUrl;
  }

  // Fetch from MERN Backend API
  private async fetchFromBackendAPI(query: string = ''): Promise<Recipe[]> {
    try {
      const url = query 
        ? `${this.baseUrl}/recipes/search?q=${query}`
        : `${this.baseUrl}/recipes`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (!data.success || !data.recipes) return [];

      return data.recipes;
    } catch (error) {
      console.error('Error in fetching  x x. x x x -- Backend API:', error);
      return [];
    }
  }

  // Fetch recipe details from Backend API
  private async fetchRecipeDetailFromBackendAPI(id: string): Promise<RecipeDetail | null> {
    try {
      const response = await fetch(`${this.baseUrl}/recipes/${id}`);
      const data = await response.json();

      if (!data.success || !data.recipe) return null;

      return data.recipe;
    } catch (error) {
      console.error('Error fetching recipe detail from Backend:', error);
      return null;
    }
  }

  // Fetch recipes from Food API (TheMealDB)
  private async fetchFromFoodAPI(query: string = ''): Promise<Recipe[]> {
    try {
      const url = query 
        ? `${this.baseUrl}/search.php?s=${query}`
        : `${this.baseUrl}/search.php?s=`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (!data.meals) return [];

      return data.meals.map((meal: any) => ({
        id: meal.idMeal,
        name: meal.strMeal,
        thumbnail: meal.strMealThumb,
        category: meal.strCategory,
        area: meal.strArea,
        tags: meal.strTags ? meal.strTags.split(',') : [],
      }));
    } catch (error) {
      console.error('Error fetching from Food API:', error);
      return [];
    }
  }

  // Fetch recipe details from Food API
  private async fetchRecipeDetailFromFoodAPI(id: string): Promise<RecipeDetail | null> {
    try {
      const response = await fetch(`${this.baseUrl}/lookup.php?i=${id}`);
      const data = await response.json();

      if (!data.meals || data.meals.length === 0) return null;

      const meal = data.meals[0];
      
      // Extract ingredients and measures
      const ingredients = [];
      for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim()) {
          ingredients.push({
            ingredient: ingredient.trim(),
            measure: measure ? measure.trim() : '',
          });
        }
      }

      return {
        id: meal.idMeal,
        name: meal.strMeal,
        thumbnail: meal.strMealThumb,
        category: meal.strCategory,
        area: meal.strArea,
        tags: meal.strTags ? meal.strTags.split(',') : [],
        instructions: meal.strInstructions,
        ingredients,
        youtubeUrl: meal.strYoutube,
        source: meal.strSource,
      };
    } catch (error) {
      console.error('Error fetching recipe detail:', error);
      return null;
    }
  }

  // Fetch from Alternative API (placeholder implementation)
  private async fetchFromAlternativeAPI(query: string = ''): Promise<Recipe[]> {
    // Implement your alternative API logic here
    console.warn('Alternative API not fully implemented');
    return [];
  }

  private async fetchRecipeDetailFromAlternativeAPI(id: string): Promise<RecipeDetail | null> {
    // Implement your alternative API logic here
    console.warn('Alternative API not fully implemented');
    return null;
  }

  // Public methods that route to the correct API
  async searchRecipes(query: string = ''): Promise<Recipe[]> {
    // If GET_LOCAL_DATA is true, return only mock data
    if (GET_LOCAL_DATA) {
      return query ? searchIndianRecipes(query) : getAllIndianRecipes();
    }

    // Otherwise fetch from backend API
    let recipes: Recipe[] = [];
    
    if (ACTIVE_API === 'BACKEND_API') {
      recipes = await this.fetchFromBackendAPI(query);
    } else if (ACTIVE_API === 'FOOD_API') {
      const apiRecipes = await this.fetchFromFoodAPI(query);
      const indianRecipesList = query ? searchIndianRecipes(query) : getAllIndianRecipes();
      recipes = [...indianRecipesList, ...apiRecipes];
    } else {
      const apiRecipes = await this.fetchFromAlternativeAPI(query);
      const indianRecipesList = query ? searchIndianRecipes(query) : getAllIndianRecipes();
      recipes = [...indianRecipesList, ...apiRecipes];
    }
    
    return recipes;
  }

  async getRecipeDetail(id: string): Promise<RecipeDetail | null> {
    // If GET_LOCAL_DATA is true, return only mock data
    if (GET_LOCAL_DATA) {
      return getIndianRecipeById(id);
    }

    // Otherwise fetch from backend API
    if (ACTIVE_API === 'BACKEND_API') {
      return this.fetchRecipeDetailFromBackendAPI(id);
    } else if (ACTIVE_API === 'FOOD_API') {
      // Check local first, then external API
      const indianRecipe = getIndianRecipeById(id);
      if (indianRecipe) return indianRecipe;
      return this.fetchRecipeDetailFromFoodAPI(id);
    } else {
      const indianRecipe = getIndianRecipeById(id);
      if (indianRecipe) return indianRecipe;
      return this.fetchRecipeDetailFromAlternativeAPI(id);
    }
  }

  // Fetch recipes by category
  async getRecipesByCategory(category: string): Promise<Recipe[]> {
    // If GET_LOCAL_DATA is true, return only mock data
    if (GET_LOCAL_DATA) {
      return getIndianRecipesByCategory(category);
    }

    // Otherwise fetch from backend API
    let recipes: Recipe[] = [];
    
    if (ACTIVE_API === 'BACKEND_API') {
      try {
        const response = await fetch(`${this.baseUrl}/recipes/category/${category}`);
        const data = await response.json();
        return data.success ? data.recipes : [];
      } catch (error) {
        console.error('Error fetching by category from backend:', error);
        return [];
      }
    } else if (ACTIVE_API === 'FOOD_API') {
      // Check if it's an Indian category
      const indianCategories = ['North Karnataka', 'South Indian', 'North Indian', 'Punjabi'];
      if (indianCategories.includes(category)) {
        return getIndianRecipesByCategory(category);
      }
      
      try {
        const response = await fetch(`${this.baseUrl}/filter.php?c=${category}`);
        const data = await response.json();

        if (!data.meals) return [];

        return data.meals.map((meal: any) => ({
          id: meal.idMeal,
          name: meal.strMeal,
          thumbnail: meal.strMealThumb,
          category: category,
        }));
      } catch (error) {
        console.error('Error fetching by category:', error);
        return [];
      }
    }
    return recipes;
  }
}

export default new APIService();
