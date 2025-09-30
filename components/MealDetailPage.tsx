import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMealDetails } from '../services/foodService';
import { ApiMealDetail } from '../types';
import Spinner from './Spinner';
import { ChevronLeftIcon, StarIcon } from './Icons';
import { useCart } from '../context/CartContext';

// Simple hash function to generate a consistent price from the meal ID
const generatePrice = (mealId: string): number => {
    let hash = 0;
    for (let i = 0; i < mealId.length; i++) {
        const char = mealId.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; 
    }
    const price = 8 + (Math.abs(hash) % 20) + (Math.abs(hash % 100) / 100);
    return parseFloat(price.toFixed(2));
};

const MealDetailPage: React.FC = () => {
    const { mealId } = useParams<{ mealId: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [meal, setMeal] = useState<ApiMealDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const price = useMemo(() => mealId ? generatePrice(mealId) : 0, [mealId]);

    useEffect(() => {
        if (mealId) {
            const loadMeal = async () => {
                try {
                    setLoading(true);
                    const data = await fetchMealDetails(mealId);
                    setMeal(data);
                } catch (err) {
                    setError('Failed to load meal details. Please try again.');
                } finally {
                    setLoading(false);
                }
            };
            loadMeal();
        }
    }, [mealId]);
    
    const handleAddToCart = () => {
        if (meal) {
            addToCart(meal, price);
        }
    };

    if (loading) {
        return <Spinner />;
    }

    if (error || !meal) {
        return <div className="error-message">{error || 'Meal not found.'}</div>;
    }

    const ingredients = Object.keys(meal)
        .filter(key => key.startsWith('strIngredient') && meal[key as keyof ApiMealDetail])
        .map(key => {
            const index = key.replace('strIngredient', '');
            const measureKey = `strMeasure${index}` as keyof ApiMealDetail;
            return {
                ingredient: meal[key as keyof ApiMealDetail],
                measure: meal[measureKey]
            };
        });

    return (
        <div className="meal-detail-page animate-fade-in">
            <button onClick={() => navigate(-1)} className="back-button">
                <ChevronLeftIcon />
                Back to meals
            </button>
            <div className="meal-detail-card">
                <div className="meal-detail-grid">
                    <div className="meal-image-container">
                       <img src={meal.strMealThumb} alt={meal.strMeal} className="meal-image"/>
                    </div>
                    <div className="meal-info-container">
                        <span className="meal-category">{meal.strCategory}</span>
                        <h1 className="meal-title">{meal.strMeal}</h1>
                        <div className="meal-reviews">
                           <div className="stars">
                               <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon filled={false}/>
                           </div>
                           <span className="review-count">(132 reviews)</span>
                        </div>
                        <p className="meal-description">
                            {meal.strInstructions.substring(0, 200)}...
                        </p>
                        
                        <div className="meal-actions">
                            <span className="meal-price">${price.toFixed(2)}</span>
                            <button 
                                onClick={handleAddToCart}
                                className="add-to-cart-button">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
                <div className="ingredients-section">
                    <h2>Ingredients</h2>
                    <ul className="ingredients-list">
                        {ingredients.map((ing, index) => (
                            <li key={index}>
                                <strong>{ing.ingredient}:</strong> {ing.measure}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default MealDetailPage;