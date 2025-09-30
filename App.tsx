import React, { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Cart from './components/Cart';
import HomePage from './components/HomePage';
import CategoryPage from './components/CategoryPage';
import MealDetailPage from './components/MealDetailPage';
import LoginModal from './components/LoginModal';

const App: React.FC = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);

    return (
        <AuthProvider>
            <CartProvider>
                <HashRouter>
                    <div className="app">
                        <Header onCartClick={() => setIsCartOpen(true)} />
                        <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
                        <main className="main-content container">
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/category/:categoryName" element={<CategoryPage />} />
                                <Route path="/meal/:mealId" element={<MealDetailPage />} />
                            </Routes>
                        </main>
                        <footer className="app-footer">
                            <div className="container footer-container">
                                <p>&copy; {new Date().getFullYear()} Foodie. All Rights Reserved.</p>
                                <p>Powered by React & TheMealDB API.</p>
                            </div>
                        </footer>
                    </div>
                </HashRouter>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
