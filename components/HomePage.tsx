import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCategories } from '../services/foodService';
import { ApiCategory } from '../types';
import Spinner from './Spinner';

const HomePage: React.FC = () => {
    const [categories, setCategories] = useState<ApiCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                setLoading(true);
                const data = await fetchCategories();
                
                const unwanted = ['Beef', 'Lamb', 'Pork', 'Goat'];
                const filteredCategories = data.filter(c => !unwanted.includes(c.strCategory));

                const customCategories: ApiCategory[] = [
                    {
                        idCategory: 'custom-1',
                        strCategory: 'Pizza',
                        strCategoryThumb: 'https://www.themealdb.com/images/media/meals/x0lk931587671540.jpg',
                        strCategoryDescription: 'Delicious pizzas of all kinds.'
                    },
                    {
                        idCategory: 'custom-2',
                        strCategory: 'Biryani',
                        strCategoryThumb: 'https://www.themealdb.com/images/media/meals/xrttsx1487339558.jpg',
                        strCategoryDescription: 'Aromatic and flavorful biryani dishes.'
                    }
                ];

                setCategories([...customCategories, ...filteredCategories]);

            } catch (err) {
                setError('Failed to fetch categories. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        loadCategories();
    }, []);

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="animate-fade-in">
            <section className="welcome-section">
                <h1>What would you like to order?</h1>
                <p>Explore a world of flavors with our curated categories.</p>
            </section>

            <section>
                <div className="category-grid">
                    {categories.map((category) => (
                        <Link 
                            to={`/category/${category.strCategory}`}
                            key={category.idCategory}
                            className="category-card"
                        >
                            <img 
                                src={category.strCategoryThumb} 
                                alt={category.strCategory} 
                                className="category-card-image"
                            />
                            <div className="category-card-title-container">
                                <h3 className="category-card-title">{category.strCategory}</h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePage;