import { ApiCategory, ApiMealDetail, ApiMealSummary } from '../types';

const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1/';

async function apiFetch<T,>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch from ${endpoint}:`, error);
    throw error;
  }
}

interface CategoriesResponse {
  categories: ApiCategory[];
}

interface MealsResponse {
  meals: ApiMealSummary[] | null;
}

interface MealDetailResponse {
  meals: ApiMealDetail[] | null;
}

export const fetchCategories = async (): Promise<ApiCategory[]> => {
  const data = await apiFetch<CategoriesResponse>('categories.php');
  return data.categories;
};

export const fetchMealsByCategory = async (category: string): Promise<ApiMealSummary[]> => {
  const data = await apiFetch<MealsResponse>(`filter.php?c=${category}`);
  return data.meals || [];
};

export const fetchMealDetails = async (id: string): Promise<ApiMealDetail | null> => {
  const data = await apiFetch<MealDetailResponse>(`lookup.php?i=${id}`);
  return data.meals ? data.meals[0] : null;
};

export const fetchMealsBySearchTerm = async (term: string): Promise<ApiMealSummary[]> => {
    const data = await apiFetch<MealsResponse>(`search.php?s=${term}`);
    return data.meals || [];
};