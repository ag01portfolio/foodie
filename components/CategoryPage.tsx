import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchMealsByCategory, fetchMealsBySearchTerm } from '../services/foodService';
import { ApiMealSummary } from '../types';
import Spinner from './Spinner';
import { ChevronLeftIcon, StarIcon } from './Icons';

type FilterType = 'All' | 'Veg' | 'NonVeg';
type SortType = 'default' | 'price-asc' | 'price-desc' | 'rating-desc';

// --- Helper Functions to generate consistent data ---
const simpleHash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; 
    }
    return Math.abs(hash);
};

const generatePrice = (mealId: string): number => {
    const hash = simpleHash(mealId);
    const price = 8 + (hash % 20) + ((hash % 100) / 100);
    return parseFloat(price.toFixed(2));
};

const generateRating = (mealId: string): number => {
    const hash = simpleHash(mealId + 'rating'); 
    const rating = 3.5 + (hash % 15) / 10;
    return parseFloat(rating.toFixed(1));
};

// --- Components ---
const FilterButton: React.FC<{
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`filter-button ${isActive ? 'active' : ''}`}
    >
        {label}
    </button>
);

const CategoryPage: React.FC = () => {
    const { categoryName } = useParams<{ categoryName: string }>();
    const [meals, setMeals] = useState<ApiMealSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<FilterType>('All');
    const [sort, setSort] = useState<SortType>('default');
    const [vegMealIds, setVegMealIds] = useState<Set<string>>(new Set());
    const [isFetchingVegIds, setIsFetchingVegIds] = useState(true);

    useEffect(() => {
        const fetchVegMealIds = async () => {
            try {
                setIsFetchingVegIds(true);
                const [vegetarianMeals, veganMeals] = await Promise.all([
                    fetchMealsByCategory('Vegetarian'),
                    fetchMealsByCategory('Vegan'),
                ]);
                const allVegMeals = [...vegetarianMeals, ...veganMeals];
                setVegMealIds(new Set(allVegMeals.map(meal => meal.idMeal)));
            } catch (e) {
                console.error("Failed to fetch vegetarian meal IDs", e);
            } finally {
                setIsFetchingVegIds(false);
            }
        };
        fetchVegMealIds();
    }, []);

    useEffect(() => {
        if (categoryName) {
            const loadMeals = async () => {
                try {
                    setLoading(true);
                    setError(null);
                    let data;
                    if (categoryName === 'Pizza' || categoryName === 'Biryani') {
                        data = await fetchMealsBySearchTerm(categoryName);
                    } else {
                        data = await fetchMealsByCategory(categoryName);
                    }
                    setMeals(data);
                } catch (err) {
                    setError('Failed to fetch meals. Please try again later.');
                } finally {
                    setLoading(false);
                }
            };
            loadMeals();
        }
    }, [categoryName]);

    const processedMeals = useMemo(() => {
        if (isFetchingVegIds) return [];

        // 1. Add price and rating to each meal
        const mealsWithData = meals.map(meal => ({
            ...meal,
            price: generatePrice(meal.idMeal),
            rating: generateRating(meal.idMeal)
        }));

        // 2. Filter meals
        const VEG_KEYWORDS = ['mushroom', 'vegetable', 'veggie', 'tofu', 'lentil', 'spinach', 'cheese', 'egg', 'potato', 'tomato', 'gnocchi', 'margherita', 'fettuccine alfredo', 'penne arrabiata'];
        
        const isVeg = (meal: ApiMealSummary): boolean => {
            if (vegMealIds.has(meal.idMeal)) return true;
            const mealNameLower = meal.strMeal.toLowerCase();
            return VEG_KEYWORDS.some(keyword => mealNameLower.includes(keyword));
        };

        const filtered = (() => {
            switch (filter) {
                case 'Veg': return mealsWithData.filter(isVeg);
                case 'NonVeg': return mealsWithData.filter(meal => !isVeg(meal));
                default: return mealsWithData;
            }
        })();

        // 3. Sort meals
        return [...filtered].sort((a, b) => {
            switch (sort) {
                case 'price-asc': return a.price - b.price;
                case 'price-desc': return b.price - a.price;
                case 'rating-desc': return b.rating - a.rating;
                default: return 0;
            }
        });
        
    }, [meals, filter, sort, vegMealIds, isFetchingVegIds]);


    if (loading) return <Spinner />;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="animate-fade-in">
            <div className="category-page-header">
                <Link to="/" className="back-link" aria-label="Go back to home">
                    <ChevronLeftIcon />
                </Link>
                <h1 className="category-page-title">{categoryName}</h1>
            </div>

            <div className="controls-bar">
                 <div className="filter-bar">
                    <FilterButton label="All" isActive={filter === 'All'} onClick={() => setFilter('All')} />
                    <FilterButton label="Veg" isActive={filter === 'Veg'} onClick={() => setFilter('Veg')} />
                    <FilterButton label="Non-Veg" isActive={filter === 'NonVeg'} onClick={() => setFilter('NonVeg')} />
                </div>
                <div className="sort-bar">
                    <label htmlFor="sort-select">Sort by:</label>
                    <select id="sort-select" className="sort-select" value={sort} onChange={e => setSort(e.target.value as SortType)}>
                        <option value="default">Relevance</option>
                        <option value="rating-desc">Rating</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                    </select>
                </div>
            </div>

            {!isFetchingVegIds && processedMeals.length === 0 ? (
                <div className="no-meals-message">
                    <p className="primary">No {filter !== 'All' ? filter.toLowerCase().replace('nonveg', 'non-veg') : ''} meals found in this category.</p>
                    <p className="secondary">Try selecting a different filter or category.</p>
                </div>
            ) : (
                <div className="meal-grid">
                    {processedMeals.map((meal) => (
                        <Link to={`/meal/${meal.idMeal}`} key={meal.idMeal} className="meal-card">
                            <div className="meal-card-image-container">
                                <img src={meal.strMealThumb} alt={meal.strMeal} className="meal-card-image" />
                            </div>
                            <div className="meal-card-info">
                                <h3 className="meal-card-title">{meal.strMeal}</h3>
                                <div className="meta">
                                    <div className="rating">
                                        <StarIcon/>
                                        <span>{meal.rating.toFixed(1)}</span>
                                    </div>
                                    <span className="meta-separator">•</span>
                                    <span>${meal.price.toFixed(2)}</span>
                                </div>
                                <p className="description">{categoryName} speciality</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryPage;