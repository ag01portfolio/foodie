import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCartIcon } from './Icons';
import LoginModal from './LoginModal';

interface HeaderProps {
    onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCartClick }) => {
    const { totalItems } = useCart();
    const { user, logout, loading } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const renderAuthControl = () => {
        if (loading) {
            return <div className="auth-loader"></div>;
        }

        if (user) {
            return (
                <div className="profile-container" ref={profileRef}>
                    <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="profile-button">
                        <img src={user.picture} alt={user.name} className="profile-avatar" />
                    </button>
                    {isProfileOpen && (
                        <div className="profile-dropdown">
                            <div className="dropdown-header">
                                <p className="user-name">{user.name}</p>
                                <p className="user-email">{user.email}</p>
                            </div>
                            <button onClick={logout} className="dropdown-item">
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            );
        }

        return (
            <button onClick={() => setIsLoginModalOpen(true)} className="login-button">
                Login
            </button>
        );
    };

    return (
        <>
            <header className="header">
                <div className="container header-container">
                    <div className="logo-container">
                        <Link to="/" className="logo-link">
                            Foodie
                        </Link>
                    </div>
                    <div className="search-bar-container">
                        <input
                            type="text"
                            placeholder="Search for restaurants or dishes..."
                            className="search-input"
                        />
                    </div>
                    <div className="actions-container">
                        {renderAuthControl()}
                        <button
                            onClick={onCartClick}
                            className="cart-button"
                            aria-label="Open shopping cart"
                        >
                            <ShoppingCartIcon />
                            {totalItems > 0 && (
                                <span className="cart-item-count">
                                    {totalItems}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>
            <LoginModal 
                isOpen={isLoginModalOpen} 
                onClose={() => setIsLoginModalOpen(false)} 
            />
        </>
    );
};

export default Header;
