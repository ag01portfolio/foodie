// API Configuration - Easy switching between different APIs
// To switch APIs, change the ACTIVE_API constant

export type APIType = 'FOOD_API' | 'ALTERNATIVE_API' | 'BACKEND_API';

// DATA SOURCE CONFIGURATION
// Set to true to use mock data from local database
// Set to false to use backend MongoDB API
export const GET_LOCAL_DATA = true;

// Change this to switch between APIs
export const ACTIVE_API: APIType = 'BACKEND_API';

// API Endpoints Configuration
export const API_CONFIGS = {
  FOOD_API: {
    name: 'TheMealDB API',
    baseUrl: 'https://www.themealdb.com/api/json/v1/1',
    endpoints: {
      search: '/search.php',
      categories: '/categories.php',
      filter: '/filter.php',
      lookup: '/lookup.php',
      random: '/random.php',
    },
  },
  ALTERNATIVE_API: {
    name: 'Alternative Recipe API',
    baseUrl: 'https://api.spoonacular.com/recipes',
    apiKey: 'YOUR_SPOONACULAR_API_KEY', // Add your API key here
    endpoints: {
      search: '/complexSearch',
      details: '/{id}/information',
    },
  },
  BACKEND_API: {
    name: 'MERN Stack Backend API',
    baseUrl: 'http://localhost:3000/api', // Change to your server URL in production
    endpoints: {
      recipes: '/recipes',
      recipeById: '/recipes/:id',
      recipesByCategory: '/recipes/category/:category',
      searchRecipes: '/recipes/search',
    },
  },
};

export const getActiveConfig = () => API_CONFIGS[ACTIVE_API];
